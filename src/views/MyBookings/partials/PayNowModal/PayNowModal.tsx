'use client';

import React, { useEffect, useMemo, useRef, useState } from 'react';

import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import { Alert, Box, Button, Collapse, Divider, IconButton, Radio, Stack, Tooltip, Typography } from '@mui/material';
import dayjs from 'dayjs';
import { useLocale, useTranslations } from 'next-intl';

import { getBankTransferFee, getCardSurchargePercentage } from '@/actions/settings.actions';
import ModalRoot from '@/components/ModalRoot';
import BankTransferIcon from '@/components/SvgIcons/Payment/BankTransfer';
import CreditCardIcon from '@/components/SvgIcons/Payment/CreditCard';
import SecurePayement from '@/components/SvgIcons/WhyChooseUs/SecurePayment';
import { bankDetails } from '@/config/bank-details.config';
import { PaymentMethod } from '@/config/paymentMethods.config';
import { PaymentPhase } from '@/models/reservation.model';
import colors from '@/styles/themes/colors';
import { usePaymentSubmit } from '@/utils/hooks/usePaymentSubmit';
import { formatPriceWithCurrency } from '@/utils/static/formatPriceCurrency';
import { showToast } from '@/valtio/global/global.actions';

/**
 * Modal shown from /my-bookings when the customer clicks "Pay now". Matches
 * the look of the standalone /payment/[slug] page (UnifiedPaymentStep):
 *   • Two radio cards — Online payment (card) / Bank transfer
 *   • Each card shows amount + method fee + total-to-pay breakdown
 *   • Bank transfer card expands into copy-able account details
 *   • "Pay now €XX,YY" button posts to Stripe checkout for card,
 *     or bank-redirect (existing usePaymentSubmit flow) for bank
 *
 * Two behavioural differences vs UnifiedPaymentStep:
 *   1. Data source — UnifiedPaymentStep reads from sessionStorage (booking
 *      flow state); here we receive phases + dateFrom as props from the
 *      my-bookings detail page which has them from the backend.
 *   2. Full-vs-installment — if ANY phase already has `paidOn`, we hide the
 *      "pay full" option entirely (pay-full on a partially-paid reservation
 *      would double-charge the customer) and pin the charge to the oldest
 *      remaining unpaid phase.
 */

interface PayNowModalProps {
  isOpen: boolean;
  onOpen: () => void;
  onClose: () => void;
  reservationId: number;
  reservationNumber?: string;
  paymentPhases: PaymentPhase[];
  dateFrom: string;
}

const PayNowModal = ({ isOpen, onClose, reservationId, reservationNumber, paymentPhases }: PayNowModalProps) => {
  const t = useTranslations('common');
  const locale = useLocale();

  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>(PaymentMethod.CREDIT_CARD);
  const [cardSurchargePercent, setCardSurchargePercent] = useState<number>(0);
  const [bankFee, setBankFee] = useState<number>(0);

  // Unpaid = any phase without paidOn. If none are paid yet, this is all
  // phases; otherwise it's whatever remains after the admin / customer
  // already cleared earlier installments.
  const unpaidPhases = useMemo(() => paymentPhases.filter(p => !p.paidOn), [paymentPhases]);
  const hasAnyPaid = paymentPhases.some(p => p.paidOn);

  // The phase we charge on this click = oldest unpaid by deadline.
  const oldestUnpaid = useMemo(
    () => [...unpaidPhases].sort((a, b) => (a.deadline > b.deadline ? 1 : -1))[0],
    [unpaidPhases]
  );

  // Full-pay disabled after ANY installment has been paid — otherwise the
  // customer would be charged for the whole reservation a second time.
  // With a single unpaid phase, there's no meaningful difference, so we
  // simply pin to that phase in both branches.
  const payFullAmount = !hasAnyPaid && paymentPhases.length === 1;

  // Pull the fee configuration once on modal open. Admins tweak these in
  // settings (CARD_PAYMENT_SURCHARGE / BANK_TRANSFER_FIXED_FEE).
  useEffect(() => {
    if (!isOpen) return;

    let cancelled = false;

    Promise.all([getCardSurchargePercentage(), getBankTransferFee()]).then(([pct, fee]) => {
      if (cancelled) return;

      setCardSurchargePercent(pct);
      setBankFee(fee);
    });

    return () => {
      cancelled = true;
    };
  }, [isOpen]);

  // One idempotency key per modal open — protects against double-clicks
  // producing duplicate Stripe Sessions.
  const idempotencyKey = useMemo(() => crypto.randomUUID(), [isOpen]);

  // Auto-scroll the bank transfer details into view once the user picks
  // bank transfer — the IBAN block sits below the fold on most screens, and
  // the customer would otherwise have to manually scroll down to copy it.
  // Wait one tick past the MUI Collapse animation (~225ms default) so the
  // panel is actually rendered before scrollIntoView measures it.
  const bankInfoRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (paymentMethod !== PaymentMethod.BANK_TRANSFER) return;

    const timer = setTimeout(() => {
      bankInfoRef.current?.scrollIntoView({ behavior: 'smooth', block: 'end' });
    }, 250);

    return () => clearTimeout(timer);
  }, [paymentMethod]);

  const baseDueNow = oldestUnpaid?.amount ?? 0;
  const cardFee = (baseDueNow * cardSurchargePercent) / 100;
  const cardAdjusted = baseDueNow + cardFee;
  const bankAdjusted = baseDueNow + bankFee;
  const methodAdjustedAmount = paymentMethod === PaymentMethod.BANK_TRANSFER ? bankAdjusted : cardAdjusted;

  const dueNowDeadline = oldestUnpaid ? dayjs(oldestUnpaid.deadline) : dayjs();
  const dateFormatter = (d: dayjs.Dayjs) => d.locale(locale).format('D MMMM YYYY');
  const fmt = (eur: number) => formatPriceWithCurrency({ clientPriceEur: eur, locale });

  const { handleSubmit, isLoading } = usePaymentSubmit({
    paymentMethod,
    reservationId: reservationId != null ? String(reservationId) : '',
    payFullAmount,
    // Pin to the next-due unpaid phase — mirrors the UnifiedPaymentStep
    // behaviour on the booking flow. Backend StripePaymentService honours
    // paymentPhaseId over payFullAmount when both are present.
    paymentPhaseId: oldestUnpaid?.id,
    idempotencyKey,
  });

  const cardBorder = (active: boolean) => (active ? `2px solid ${colors.blue500}` : `1px solid ${colors.black200}`);

  const handleCopy = async (value: string, label: string) => {
    try {
      await navigator.clipboard.writeText(value);
      showToast({ status: 'success', text: t('copiedToClipboard', { label }) });
    } catch {
      showToast({ status: 'error', text: t('copyFailed') });
    }
  };

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

  // Safety — no unpaid phase means nothing left to pay; rendering empty prevents
  // an NaN total from showing. The Pay now trigger upstream should already
  // hide itself in that state but defensive code is cheap.
  if (!oldestUnpaid) {
    return (
      <ModalRoot open={isOpen} onClose={onClose} onCancel={onClose} title={t('payNow')} width={670}>
        <Typography variant="body2" color={colors.black500}>
          {t('noUpcomingPayments')}
        </Typography>
      </ModalRoot>
    );
  }

  return (
    <ModalRoot
      open={isOpen}
      onClose={onClose}
      onCancel={onClose}
      title={t('payNow')}
      cancelBtnText={t('cancel')}
      width={670}
      // Hide the default confirm button — we render our own "Pay now €X"
      // button at the bottom with a live amount.
      ConfirmBtnProps={{ sx: { display: 'none' } }}
    >
      {/* When ANY installment is already paid, the reservation is already
          secured — the yellow "Complete the reservation" callout from the
          initial booking flow would be confusing here. Show only the blue
          "part paid, remaining due" notice and move straight to the method
          picker. Otherwise (nothing paid yet — rare in /my-bookings but
          possible for fresh bookings the customer lands on), fall back to
          the original yellow callout. */}
      {hasAnyPaid ? (
        <Alert
          severity="info"
          variant="outlined"
          icon={false}
          sx={{ mb: 3, backgroundColor: colors.blue50, borderColor: colors.blue300 }}
        >
          <Typography variant="body2">
            {t('partialPaidNotice', {
              amount: fmt(baseDueNow),
              date: dateFormatter(dueNowDeadline),
            })}
          </Typography>
        </Alert>
      ) : (
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

      {/* Payment method */}
      <Stack direction="row" alignItems="baseline" justifyContent="space-between" mb={1.5}>
        <Typography variant="h3">{t('howWouldYouLikeToPay')}</Typography>
        <Typography variant="body2" color={colors.black500}>
          {t('poweredByStripe')}
        </Typography>
      </Stack>

      <Stack gap={1.5} mb={3}>
        {/* Online payment / Credit card */}
        <Box
          onClick={() => setPaymentMethod(PaymentMethod.CREDIT_CARD)}
          sx={{
            border: cardBorder(paymentMethod === PaymentMethod.CREDIT_CARD),
            borderRadius: 1.5,
            p: 2,
            cursor: 'pointer',
            transition: 'border-color 0.15s',
          }}
        >
          <Stack direction="row" alignItems="center" gap={1.5}>
            <Radio
              checked={paymentMethod === PaymentMethod.CREDIT_CARD}
              onChange={() => setPaymentMethod(PaymentMethod.CREDIT_CARD)}
              sx={{ p: 0 }}
            />
            <CreditCardIcon />
            <Typography variant="body1" fontWeight={700}>
              {t('onlinePaymentsCreditCard')}
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

        {/* Bank transfer + inline details */}
        <Box
          sx={{
            border: cardBorder(paymentMethod === PaymentMethod.BANK_TRANSFER),
            borderRadius: 1.5,
            transition: 'border-color 0.15s',
            overflow: 'hidden',
          }}
        >
          <Box onClick={() => setPaymentMethod(PaymentMethod.BANK_TRANSFER)} sx={{ p: 2, cursor: 'pointer' }}>
            <Stack direction="row" alignItems="center" gap={1.5}>
              <Radio
                checked={paymentMethod === PaymentMethod.BANK_TRANSFER}
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
                  +{fmt(bankFee)}
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

          {/* Expandable account details */}
          <Collapse in={paymentMethod === PaymentMethod.BANK_TRANSFER} unmountOnExit>
            <Divider />
            <Box ref={bankInfoRef} sx={{ backgroundColor: colors.black100, px: 2.5, py: 1.5 }}>
              <Typography variant="body1" fontWeight={700} mb={1}>
                {t('bankTransferInfo')}
              </Typography>
              <BankDetailRow label={t('amount')} value={fmt(bankAdjusted)} />
              {bankDetails.map(({ title, value }) => (
                <BankDetailRow key={title} label={title} value={value} />
              ))}
              <BankDetailRow label={t('paymentReference')} value={`#${reservationNumber ?? reservationId}`} />
            </Box>
          </Collapse>
        </Box>
      </Stack>

      {/* Pay now / Reserve button — hidden for bank transfer on already-
          confirmed reservations: the bank details above are everything the
          customer needs, no DB action is required (the unpaid phase already
          exists, payment is reconciled when funds arrive). The button is
          still shown for:
            • CREDIT_CARD (always, since clicking opens Stripe checkout), and
            • BANK_TRANSFER on a fresh OPTION (clicking marks the reservation
              and triggers the confirmation email — without that click the
              option would expire). */}
      {paymentMethod === PaymentMethod.BANK_TRANSFER && hasAnyPaid ? null : (
        <Stack alignItems="flex-end" gap={1}>
          <Button
            size="large"
            onClick={handleSubmit}
            disabled={isLoading}
            sx={{ width: 260 }}
            startIcon={<SecurePayement size={24} />}
          >
            {isLoading
              ? t('processing')
              : paymentMethod === PaymentMethod.BANK_TRANSFER
                ? t('reserve')
                : t('payNowAmount', { amount: fmt(methodAdjustedAmount) })}
          </Button>
        </Stack>
      )}
    </ModalRoot>
  );
};

export default PayNowModal;
