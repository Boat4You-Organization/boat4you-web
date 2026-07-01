/* eslint-disable no-nested-ternary, react/no-unstable-nested-components */
import { useEffect, useMemo, useState } from 'react';

import CheckCircleOutline from '@mui/icons-material/CheckCircleOutline';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import {
  Alert,
  Box,
  Button,
  Collapse,
  Divider,
  IconButton,
  Link as MuiLink,
  Radio,
  Stack,
  Tooltip,
  Typography,
} from '@mui/material';
import dayjs from 'dayjs';
import { useLocale, useTranslations } from 'next-intl';
import NextLink from 'next/link';

import { getBankTransferFee, getCardSurchargePercentage } from '@/actions/settings.actions';
import BankTransferIcon from '@/components/SvgIcons/Payment/BankTransfer';
import CardBrands from '@/components/SvgIcons/Payment/CardBrands';
import CreditCardIcon from '@/components/SvgIcons/Payment/CreditCard';
import SecurePayement from '@/components/SvgIcons/WhyChooseUs/SecurePayment';
import { bankDetails } from '@/config/bank-details.config';
import { PaymentMethod } from '@/config/paymentMethods.config';
import { PaymentPhase as ApiPaymentPhase } from '@/models/reservation.model';
import colors from '@/styles/themes/colors';
import { ReservationData } from '@/types/reservation.type';
import { usePaymentSubmit } from '@/utils/hooks/usePaymentSubmit';
import { bankFeeShareForPhase } from '@/utils/static/bankTransferFee';
import { formatPriceWithCurrency } from '@/utils/static/formatPriceCurrency';
import { calculatePaymentPhases as calculateClientPhases } from '@/utils/static/paymentPhases';
import { getDataFromSessionStorage } from '@/utils/static/sessionStorageUtils';
import { setPaymentMethod } from '@/valtio/booking/booking.actions';
import { useBookingStore } from '@/valtio/booking/booking.store';
import { showToast } from '@/valtio/global/global.actions';
import BookingReviewModal from '@/views/Booking/BookingReviewModal';

interface UnifiedPaymentStepProps {
  reservationData: ReservationData;
}

interface BookingContact {
  name: string;
  surname: string;
  email: string;
  phoneNumber: string;
  specialRequest: string;
}

interface DisplayPhase {
  id?: number;
  deadline: dayjs.Dayjs;
  amount: number;
}

const UnifiedPaymentStep = ({ reservationData }: UnifiedPaymentStepProps) => {
  const t = useTranslations('common');
  const locale = useLocale();
  const { paymentData } = useBookingStore();
  const { selectedPaymentMethod } = paymentData;

  const reservationId = getDataFromSessionStorage<number>('reservationId');
  const reservationNumber = getDataFromSessionStorage<string>('reservationNumber');
  const contact = getDataFromSessionStorage<BookingContact>('bookingContact');
  // Real partner option-expiry (MMK `expirationDate` / NauSys `optionTill`).
  // Persisted by DetailsStep when the option was created. Drives the
  // bank-transfer deadline banner — varies wildly: ~1 day for last-minute
  // bookings, several days for long-lead. Showing the wrong window risks
  // the customer paying after the partner already released the yacht.
  const reservationExpiresAt = getDataFromSessionStorage<string>('reservationExpiresAt');
  // Customer-facing booking number for bank transfer reference / notices.
  // Falls back to the internal id for historical reservations that predate the
  // booking-number feature.
  const paymentReference = reservationNumber ?? (reservationId != null ? String(reservationId) : '');
  const apiPhases = getDataFromSessionStorage<ApiPaymentPhase[]>('paymentPhases');

  // Prefer backend-computed phases (carry DB ids Stripe metadata hangs off of),
  // fall back to the client-side mirror util if the session cache is missing.
  const paymentPhases: DisplayPhase[] = useMemo(() => {
    if (apiPhases && apiPhases.length > 0) {
      return apiPhases.map(p => ({
        id: p.id,
        deadline: dayjs(p.deadline),
        amount: p.amount,
      }));
    }

    return calculateClientPhases(reservationData.dateFrom, reservationData.totalPriceEur).map(p => ({
      deadline: p.deadline,
      amount: p.amount,
    }));
  }, [apiPhases, reservationData.dateFrom, reservationData.totalPriceEur]);

  // No UI for picking a phase here — the schedule lives in the sidebar
  // (PriceBreakdownCard). This screen always commits to the first (due-now)
  // payment, which is what "Pay now" triggers.
  const selectedPhase = paymentPhases[0];
  const payFullAmount = paymentPhases.length === 1;

  // One idempotency key per /payment page mount. Passed to Stripe on
  // Session.create so a double-click returns the same Session (Stripe
  // dedupes for 24 h on this key) instead of spawning a second checkout.
  // Refreshing the page starts a fresh key — that's deliberate; a refresh
  // is a legitimate signal the user wants a new attempt.
  const idempotencyKey = useMemo(() => crypto.randomUUID(), []);

  const { handleSubmit, isLoading } = usePaymentSubmit({
    paymentMethod: selectedPaymentMethod,
    reservationId: reservationId?.toString() ?? '',
    payFullAmount,
    paymentPhaseId: selectedPhase?.id,
    idempotencyKey,
  });

  useEffect(() => {
    if (!selectedPaymentMethod) {
      setPaymentMethod(PaymentMethod.CREDIT_CARD);
    }
  }, [selectedPaymentMethod]);

  const [cardSurchargePercent, setCardSurchargePercent] = useState<number>(0);
  const [bankFee, setBankFee] = useState<number>(0);
  const [bookingReviewOpen, setBookingReviewOpen] = useState(false);

  useEffect(() => {
    let cancelled = false;

    Promise.all([getCardSurchargePercentage(), getBankTransferFee()]).then(([pct, fee]) => {
      if (cancelled) return;

      setCardSurchargePercent(pct);
      setBankFee(fee);
    });

    return () => {
      cancelled = true;
    };
  }, []);

  const baseDueNow = selectedPhase?.amount ?? 0;
  // Whole-euro fees (no cents) — mirrors the backend exactly:
  // card: StripePaymentService rounds the surcharge HALF_UP to whole EUR before
  // charging, so Math.round here always displays the amount Stripe collects;
  // bank: this phase's share of the fixed per-reservation fee (32 across 2
  // installments → 16 per wire), same split the wire emails use. This screen
  // always pays phase #0 (see selectedPhase above).
  const cardFee = Math.round((baseDueNow * cardSurchargePercent) / 100);
  const cardAdjusted = baseDueNow + cardFee;
  const bankFeeShare = bankFeeShareForPhase(bankFee, paymentPhases.length, 0);
  const bankAdjusted = baseDueNow + bankFeeShare;

  const methodAdjustedAmount = selectedPaymentMethod === PaymentMethod.BANK_TRANSFER ? bankAdjusted : cardAdjusted;

  const dueNowDeadline = paymentPhases[0]?.deadline ?? dayjs();
  const dateFormatter = (d: dayjs.Dayjs) => d.locale(locale).format('D MMMM YYYY');
  const fmt = (eur: number) => formatPriceWithCurrency({ clientPriceEur: eur, locale });

  // Free-cancellation trust tick — Mario rule (2.7.2026): the free window
  // lasts EXACTLY as long as our option at the charter agency, so the date is
  // the partner option expiry (reservationExpiresAt), the same source as the
  // bank-transfer deadline banner. No partner expiry → no tick; we never
  // invent a deadline (option-expiry-no-fallback rule). The sidebar
  // CancellationCard receives the same date via Booking.tsx so the two
  // surfaces always agree.
  const freeCancellationUntil = reservationExpiresAt ? dateFormatter(dayjs(reservationExpiresAt)) : null;

  const cardBorder = (active: boolean) => (active ? `2px solid ${colors.blue500}` : `1px solid ${colors.black200}`);

  const handleCopy = async (value: string, label: string) => {
    try {
      await navigator.clipboard.writeText(value);
      showToast({ status: 'success', text: t('copiedToClipboard', { label }) });
    } catch {
      showToast({ status: 'error', text: t('copyFailed') });
    }
  };

  // Bank transfer details row with inline copy icon. The row stacks on mobile
  // (label on top) so long IBAN strings don't squash the label.
  const BankDetailRow = ({ label, value }: { label: string; value: string }) => (
    <Stack
      direction={{ xs: 'column', sm: 'row' }}
      justifyContent="space-between"
      alignItems={{ xs: 'flex-start', sm: 'center' }}
      gap={{ xs: 0.25, sm: 2 }}
      sx={{ py: 0.75 }}
    >
      <Typography variant="body2" color={colors.black600}>
        {label}
      </Typography>
      <Stack direction="row" alignItems="center" gap={0.5}>
        <Typography
          variant="body2"
          fontWeight={600}
          sx={{ wordBreak: 'break-all', textAlign: { xs: 'left', sm: 'right' } }}
        >
          {value}
        </Typography>
        <Tooltip title={t('copy')} placement="top" arrow>
          <IconButton size="small" onClick={() => handleCopy(value, label)} aria-label={t('copy')}>
            <ContentCopyIcon sx={{ fontSize: 16, color: colors.black500 }} />
          </IconButton>
        </Tooltip>
      </Stack>
    </Stack>
  );

  return (
    <Box>
      {/* Yellow "complete the reservation" callout */}
      {selectedPhase && (
        <Alert
          severity="warning"
          variant="outlined"
          icon={false}
          sx={{
            mb: 3,
            backgroundColor: '#fff8e1',
            borderColor: '#f5d76e',
            '& .MuiAlert-message': { width: '100%' },
          }}
        >
          <Typography variant="body1" fontWeight={700} mb={0.5}>
            {t('completeTheReservation')}
          </Typography>
          <Typography variant="body2" color={colors.black700}>
            {t('secureByFirstPayment', {
              amount: fmt(baseDueNow),
              date: dateFormatter(dueNowDeadline),
            })}
          </Typography>
        </Alert>
      )}

      {/* Your details — vertically stacked read-only summary */}
      <Typography variant="h3" mb={1.5}>
        {t('yourDetails')}
      </Typography>
      <Box sx={{ border: cardBorder(false), borderRadius: 1.5, px: 2.5, py: 0.5, mb: 3 }}>
        {contact ? (
          [
            { label: t('firstName'), value: contact.name },
            { label: t('lastName'), value: contact.surname },
            { label: t('email'), value: contact.email },
            { label: t('phoneNumber'), value: contact.phoneNumber },
          ].map(({ label, value }, idx, arr) => (
            <Stack
              key={label}
              direction={{ xs: 'column', sm: 'row' }}
              justifyContent="space-between"
              alignItems={{ xs: 'flex-start', sm: 'center' }}
              gap={{ xs: 0.25, sm: 2 }}
              sx={{
                py: 1.5,
                borderBottom: idx < arr.length - 1 ? `1px solid ${colors.black100}` : 'none',
              }}
            >
              <Typography variant="body2" color={colors.black500}>
                {label}
              </Typography>
              <Typography
                variant="body1"
                fontWeight={600}
                sx={{ wordBreak: 'break-all', textAlign: { xs: 'left', sm: 'right' } }}
              >
                {value}
              </Typography>
            </Stack>
          ))
        ) : (
          <Typography variant="body2" color={colors.black500} sx={{ py: 2 }}>
            {t('contactDetailsUnavailable')}
          </Typography>
        )}
      </Box>

      {/* Payment method */}
      <Stack direction="row" alignItems="baseline" justifyContent="space-between" mb={1.5}>
        <Typography variant="h3">{t('howWouldYouLikeToPay')}</Typography>
        <Typography variant="body2" color={colors.black500}>
          {t('poweredByStripe')}
        </Typography>
      </Stack>

      <Stack gap={1.5} mb={3}>
        {/* Online payments / Credit card */}
        <Box
          onClick={() => setPaymentMethod(PaymentMethod.CREDIT_CARD)}
          sx={{
            border: cardBorder(selectedPaymentMethod === PaymentMethod.CREDIT_CARD),
            borderRadius: 1.5,
            p: 2,
            cursor: 'pointer',
            transition: 'border-color 0.15s',
          }}
        >
          <Stack direction="row" alignItems="center" gap={1.5} flexWrap="wrap">
            <Radio
              checked={selectedPaymentMethod === PaymentMethod.CREDIT_CARD}
              onChange={() => setPaymentMethod(PaymentMethod.CREDIT_CARD)}
              sx={{ p: 0 }}
            />
            <CreditCardIcon />
            <Typography variant="body1" fontWeight={700}>
              {t('onlinePaymentsCreditCard')}
            </Typography>
            {/* Brand acceptance marks — stronger trust cue than the
                "Powered by Stripe" caption alone. Three badges don't fit
                next to the title on a phone: the row wraps and the marks
                shrink slightly so they sit right-aligned on their own line. */}
            <Box
              sx={{
                ml: 'auto',
                display: 'flex',
                alignItems: 'center',
                '& svg': { height: { xs: 18, sm: 22 }, width: 'auto' },
              }}
            >
              <CardBrands height={22} />
            </Box>
          </Stack>
          <Stack gap={0.25} ml={5} mt={0.75}>
            <Stack direction="row" justifyContent="space-between">
              <Typography variant="body2" color={colors.black600}>
                {t('amount')}
              </Typography>
              <Typography variant="body2" color={colors.black700}>
                {fmt(baseDueNow)}
              </Typography>
            </Stack>
            <Stack direction="row" justifyContent="space-between">
              <Typography variant="body2" color={colors.black600}>
                {t('cardProcessingFee', { percent: cardSurchargePercent.toFixed(0) })}
              </Typography>
              <Typography variant="body2" color={colors.black700}>
                +{fmt(cardFee)}
              </Typography>
            </Stack>
            <Divider sx={{ my: 0.5 }} />
            <Stack direction="row" justifyContent="space-between">
              <Typography variant="body2" fontWeight={700}>
                {t('totalToPay')}
              </Typography>
              <Typography variant="body2" fontWeight={700} color={colors.blue500}>
                {fmt(cardAdjusted)}
              </Typography>
            </Stack>
          </Stack>
        </Box>

        {/* Bank transfer + inline details collapse (only expanded when picked) */}
        <Box
          sx={{
            border: cardBorder(selectedPaymentMethod === PaymentMethod.BANK_TRANSFER),
            borderRadius: 1.5,
            transition: 'border-color 0.15s',
            overflow: 'hidden',
          }}
        >
          <Box onClick={() => setPaymentMethod(PaymentMethod.BANK_TRANSFER)} sx={{ p: 2, cursor: 'pointer' }}>
            <Stack direction="row" alignItems="center" gap={1.5}>
              <Radio
                checked={selectedPaymentMethod === PaymentMethod.BANK_TRANSFER}
                onChange={() => setPaymentMethod(PaymentMethod.BANK_TRANSFER)}
                sx={{ p: 0 }}
              />
              <BankTransferIcon />
              <Typography variant="body1" fontWeight={700}>
                {t('bankTransfer')}
              </Typography>
            </Stack>
            <Stack gap={0.25} ml={5} mt={0.75}>
              <Stack direction="row" justifyContent="space-between">
                <Typography variant="body2" color={colors.black600}>
                  {t('amount')}
                </Typography>
                <Typography variant="body2" color={colors.black700}>
                  {fmt(baseDueNow)}
                </Typography>
              </Stack>
              <Stack direction="row" justifyContent="space-between">
                <Typography variant="body2" color={colors.black600}>
                  {t('bankTransferFee')}
                </Typography>
                <Typography variant="body2" color={colors.black700}>
                  +{fmt(bankFeeShare)}
                </Typography>
              </Stack>
              <Divider sx={{ my: 0.5 }} />
              <Stack direction="row" justifyContent="space-between">
                <Typography variant="body2" fontWeight={700}>
                  {t('totalToPay')}
                </Typography>
                <Typography variant="body2" fontWeight={700} color={colors.blue500}>
                  {fmt(bankAdjusted)}
                </Typography>
              </Stack>
              <Typography variant="body2" color={colors.black500} mt={0.5}>
                {t('bankTransferDueByNotice', { date: dateFormatter(dueNowDeadline) })}
              </Typography>
            </Stack>
          </Box>

          {/* Expandable bank details — visible only when bank transfer is picked.
              Each row has a copy-to-clipboard icon. */}
          <Collapse in={selectedPaymentMethod === PaymentMethod.BANK_TRANSFER} unmountOnExit>
            <Divider />
            <Box sx={{ backgroundColor: colors.black100, px: 2.5, py: 1.5 }}>
              {/* Option-expiry banner — sits ABOVE bank details so the deadline
                  is the first thing the customer sees. Real partner timestamp
                  only; if the partner returned null we surface a "we'll confirm
                  by email" warning rather than inventing a number, since under-
                  estimating the deadline is the dangerous direction (yacht
                  already rebooked when the wire arrives). */}
              {reservationExpiresAt ? (
                (() => {
                  const expiry = dayjs(reservationExpiresAt);
                  const now = dayjs();
                  const hoursLeft = expiry.diff(now, 'hour');
                  const isUrgent = hoursLeft <= 24;

                  return (
                    <Alert severity={isUrgent ? 'error' : 'warning'} icon={false} sx={{ mb: 2, fontWeight: 600 }}>
                      {t('optionExpiresOnNotice', {
                        date: expiry.locale(locale).format('D MMMM YYYY'),
                        time: expiry.format('HH:mm'),
                      })}
                    </Alert>
                  );
                })()
              ) : (
                <Alert severity="warning" icon={false} sx={{ mb: 2, fontWeight: 600 }}>
                  {t('optionExpiryUnknownNotice')}
                </Alert>
              )}
              <Typography variant="body1" fontWeight={700} mb={1}>
                {t('bankTransferInfo')}
              </Typography>
              <BankDetailRow label={t('amount')} value={fmt(bankAdjusted)} />
              {bankDetails.map(({ title, value }) => (
                <BankDetailRow key={title} label={title} value={value} />
              ))}
              {paymentReference && <BankDetailRow label={t('paymentReference')} value={paymentReference} />}
              <Typography variant="body2" color={colors.black600} mt={1.5}>
                {t('paymentReferenceNotice', { reservationNumber: paymentReference })}
              </Typography>
            </Box>
          </Collapse>
        </Box>

        {/* "What happens after payment" — kills the high-ticket fear of
            "I pay and then… silence". Three concrete steps, no promises the
            emails don't actually deliver. */}
        <Box sx={{ border: cardBorder(false), borderRadius: 1.5, px: 2.5, py: 2 }}>
          <Typography variant="body1" fontWeight={700} mb={1.5}>
            {t('whatHappensNext')}
          </Typography>
          <Stack gap={1.25}>
            {[t('nextStepEmailConfirmation'), t('nextStepBookingConfirmed'), t('nextStepCheckIn')].map((step, idx) => (
              <Stack key={step} direction="row" alignItems="flex-start" gap={1.25}>
                <Box
                  sx={{
                    width: 22,
                    height: 22,
                    borderRadius: '50%',
                    backgroundColor: colors.blue500,
                    color: '#fff',
                    fontSize: '0.75rem',
                    fontWeight: 700,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0,
                    mt: 0.1,
                  }}
                >
                  {idx + 1}
                </Box>
                <Typography variant="body2" color={colors.black700}>
                  {step}
                </Typography>
              </Stack>
            ))}
          </Stack>
        </Box>

        {/* Legal acceptance notice — by clicking "Pay now" the user implicitly
            agrees to the policies below. Links open the corresponding static
            pages in a new tab so the booking flow isn't interrupted. */}
        <Typography variant="body2" color={colors.black600}>
          {t.rich('reservationAgreementNotice', {
            terms: chunks => (
              <MuiLink
                component={NextLink}
                href="/terms-and-conditions"
                target="_blank"
                rel="noopener noreferrer"
                underline="always"
                color={colors.blue500}
              >
                {chunks}
              </MuiLink>
            ),
            privacy: chunks => (
              <MuiLink
                component={NextLink}
                href="/privacy-policy"
                target="_blank"
                rel="noopener noreferrer"
                underline="always"
                color={colors.blue500}
              >
                {chunks}
              </MuiLink>
            ),
          })}
        </Typography>
      </Stack>

      {/* Pay now */}
      <Stack alignItems="flex-end" gap={1}>
        <Button
          size="large"
          onClick={handleSubmit}
          disabled={isLoading || !selectedPaymentMethod}
          sx={{ width: 260 }}
          startIcon={<SecurePayement size={24} />}
        >
          {isLoading
            ? t('processing')
            : selectedPaymentMethod === PaymentMethod.BANK_TRANSFER
              ? t('reserve')
              : t('payNowAmount', { amount: fmt(methodAdjustedAmount) })}
        </Button>
        {contact?.email && (
          <Typography variant="body2" color={colors.black500}>
            {t('confirmationWillBeSentTo', { email: contact.email })}
          </Typography>
        )}
        {/* Trust row — same green-tick language as BookingHero. The
            free-cancellation tick is CONDITIONAL (charter 45+ days away)
            and carries the exact date, mirroring the CancellationCard
            timeline so the two can never contradict each other. */}
        <Stack direction="row" flexWrap="wrap" columnGap={2} rowGap={0.5} justifyContent="flex-end">
          {freeCancellationUntil && (
            <Stack direction="row" alignItems="center" gap={0.5}>
              <CheckCircleOutline sx={{ fontSize: 16, color: colors.green500 }} />
              <Typography variant="body2" color={colors.green500} fontWeight={600}>
                {t('trustFreeCancellationUntil', { date: freeCancellationUntil })}
              </Typography>
            </Stack>
          )}
          <Stack direction="row" alignItems="center" gap={0.5}>
            <CheckCircleOutline sx={{ fontSize: 16, color: colors.green500 }} />
            <Typography variant="body2" color={colors.green500} fontWeight={600}>
              {t('trustSecurePayment')}
            </Typography>
          </Stack>
          <Stack direction="row" alignItems="center" gap={0.5}>
            <CheckCircleOutline sx={{ fontSize: 16, color: colors.green500 }} />
            <Typography variant="body2" color={colors.green500} fontWeight={600}>
              {t('bestPriceOnTheMarket')}
            </Typography>
          </Stack>
        </Stack>
        <Box
          component="button"
          type="button"
          onClick={() => setBookingReviewOpen(true)}
          sx={{
            background: 'none',
            border: 0,
            p: 0,
            color: colors.blue500,
            cursor: 'pointer',
            textDecoration: 'underline',
            font: 'inherit',
            fontSize: '0.875rem',
          }}
        >
          {t('whatAreMyBookingConditions')}
        </Box>
      </Stack>

      <BookingReviewModal
        open={bookingReviewOpen}
        onClose={() => setBookingReviewOpen(false)}
        yachtName={reservationData.name}
        yachtModel={reservationData.model}
        dateFrom={reservationData.dateFrom}
        totalPriceEur={reservationData.totalPriceEur}
        totalPriceInfo={reservationData.totalPriceInfo}
        paymentPhases={apiPhases ?? []}
        freeUntil={reservationExpiresAt}
      />
    </Box>
  );
};

export default UnifiedPaymentStep;
