import { useEffect, useState } from 'react';

import { Box, Button, Divider, IconButton, Stack, Typography } from '@mui/material';
import { useLocale, useTranslations } from 'next-intl';
import Link from 'next/link';

import { getCardSurchargePercentage } from '@/actions/settings.actions';
import StatusChip from '@/components/StatusChip';
import Calendar from '@/components/SvgIcons/Calendar';
import Email from '@/components/SvgIcons/Contact/Email';
import Copy from '@/components/SvgIcons/Copy';
import Download from '@/components/SvgIcons/Download';
import ExternalLink from '@/components/SvgIcons/ExternalLink';
import Phone from '@/components/SvgIcons/Phone';
import { PaymentMethod } from '@/config/paymentMethods.config';
import { ReservationDetails, ReservationStatus } from '@/models/reservation.model';
import colors from '@/styles/themes/colors';
import useInvoiceDownload from '@/utils/hooks/useInvoiceDownload';
import usePaymentStatus from '@/utils/hooks/usePaymentStatus';
import { usePaymentSubmit } from '@/utils/hooks/usePaymentSubmit';
import DateTime from '@/utils/static/DateTime';
import { getCancellationDisplayState } from '@/utils/static/cancellationUtils';
import copyToClipboard from '@/utils/static/copyToClipboard';
import { formatPriceWithCurrency } from '@/utils/static/formatPriceCurrency';
import { saveDataToSessionStorage } from '@/utils/static/sessionStorageUtils';
import { togglePayNowModal } from '@/valtio/reservation/reservation.actions';

import styles from './ReservationCTA.module.scss';

interface ReservationCTAProps {
  reservationDetails: ReservationDetails;
}

const ReservationCTA = ({ reservationDetails }: ReservationCTAProps) => {
  const t = useTranslations('common');
  const tToast = useTranslations('toastMessages');
  const {
    reservationId,
    reservationNumber,
    paymentPhases,
    status,
    totalPriceInfo,
    cancellationRequestAt,
    cancellationRequest,
    cancellationRejectedAt,
    cancellationRejectedReason,
  } = reservationDetails;
  const { installmentDisplay, nextInstallment, isFullyPaid } = usePaymentStatus(paymentPhases);
  const { handleSubmit, isLoading } = usePaymentSubmit({
    paymentMethod: PaymentMethod.CREDIT_CARD,
    reservationId: reservationId.toString(),
    paymentPhaseId: nextInstallment?.phaseId,
  });
  const locale = useLocale();
  const [surchargePercentage, setSurchargePercentage] = useState<number>(0);

  // Fetch the card-payment surcharge so we can warn the user it gets added
  // to the displayed amount at Stripe checkout time (backend applies +% on
  // StripePaymentService.initiatePayment).
  useEffect(() => {
    let cancelled = false;

    getCardSurchargePercentage().then(pct => {
      if (!cancelled) setSurchargePercentage(pct);
    });

    return () => {
      cancelled = true;
    };
  }, []);

  const totalPriceEur = paymentPhases.reduce((sum, phase) => sum + phase.amount, 0);

  const isBookingEditable = status === ReservationStatus.CANCELLED;
  const isOption = status === ReservationStatus.OPTION;

  const { downloadReservationPDF, isDownloading } = useInvoiceDownload({
    reservationDetails,
  });

  const handleCopyReservationId = () => {
    copyToClipboard(reservationId.toString(), tToast('reservationIdCopied'));
  };

  const handleCopyReservationNumber = () => {
    copyToClipboard(reservationNumber, tToast('reservationNumberCopied'));
  };

  const handlePayNow = () => {
    saveDataToSessionStorage('reservationId', reservationId);
    // Always open the modal so the customer can pick card vs bank transfer.
    // The modal itself adapts: pre-reservation (status=OPTION) shows the
    // yellow "Complete the reservation" warning, post-confirmation (any
    // paid phase) shows the blue "partial paid" notice. Going straight to
    // Stripe used to lock the customer into card on subsequent instalments
    // even if they paid the first one by bank transfer.
    togglePayNowModal();
  };

  const renderPaymentStatus = () => (
    <>
      <Divider
        sx={{
          '&.MuiDivider-root': {
            marginBlock: 3,
          },
        }}
      />
      <Stack gap={3}>
        <Stack gap={2}>
          <Typography variant="h3" component="p" fontWeight={700}>
            {t('totalPrice')}
          </Typography>
          <Stack direction="row" gap={1.5}>
            <Calendar size={24} variant="secondary" />
            <Stack>
              <Typography variant="h3" component="p" fontWeight={700} color={colors.blue500}>
                {formatPriceWithCurrency({
                  clientPriceEur: totalPriceInfo.amount,
                  clientPriceInfo: totalPriceInfo,
                  locale,
                })}
              </Typography>
              {paymentPhases.length > 0 && (
                <>
                  {/* Heading for the installment list. Replaces the old
                      "Total amount [1/2 installments]" chip — the per-row
                      breakdown below already communicates progress, so the
                      summary chip was redundant. */}
                  <Typography variant="body1" fontWeight={700} mt={1.5}>
                    {t('installments')}
                  </Typography>
                  {/* Per-installment breakdown — compact single-row-per-phase
                      layout (status dot + label/date on left, amount on right).
                      Strikethrough + green text marks paid installments so the
                      customer sees instantly what's been covered vs remaining,
                      without the two-line / chip sprawl of earlier iterations. */}
                  <Stack mt={0.75} sx={{ border: `1px solid ${colors.black100}`, borderRadius: 1 }}>
                    {[...paymentPhases]
                      .sort((a, b) => (a.deadline > b.deadline ? 1 : -1))
                      .map((phase, idx, arr) => {
                        const paid = Boolean(phase.paidOn);
                        // Month spelled out (Mario 2.7.2026): "06.07.2026" reads as
                        // June 7th to an American — "6 July 2026" is unambiguous.
                        const dateLabel = phase.deadline
                          ? DateTime.formatLongWithoutDay(DateTime.date(phase.deadline), locale)
                          : '-';

                        return (
                          <Stack
                            key={phase.id ?? idx}
                            direction="row"
                            justifyContent="space-between"
                            alignItems="center"
                            sx={{
                              px: 1.25,
                              py: 0.75,
                              borderBottom: idx < arr.length - 1 ? `1px solid ${colors.black100}` : 'none',
                              backgroundColor: paid ? colors.green50 : 'transparent',
                            }}
                          >
                            <Stack direction="row" alignItems="center" gap={1} sx={{ minWidth: 0 }}>
                              <Box
                                sx={{
                                  width: 8,
                                  height: 8,
                                  borderRadius: '50%',
                                  flexShrink: 0,
                                  backgroundColor: paid ? colors.green500 : colors.black300,
                                }}
                              />
                              <Typography variant="body2" fontWeight={600} sx={{ whiteSpace: 'nowrap' }}>
                                {idx + 1}.
                              </Typography>
                              <Typography variant="caption" color={colors.black500} sx={{ whiteSpace: 'nowrap' }}>
                                {dateLabel}
                              </Typography>
                            </Stack>
                            <Typography
                              variant="body2"
                              fontWeight={700}
                              sx={{
                                whiteSpace: 'nowrap',
                                color: paid ? colors.green500 : colors.black950,
                                textDecoration: paid ? 'line-through' : 'none',
                              }}
                            >
                              {formatPriceWithCurrency({
                                clientPriceEur: phase.amount,
                                locale,
                              })}
                            </Typography>
                          </Stack>
                        );
                      })}
                  </Stack>
                </>
              )}
            </Stack>
          </Stack>
        </Stack>
        {/* Obligatory extras + deposit + insurance moved to PaymentTab Extras
            section (3.5.2026). Sidebar duplicated the same rows under "Pay at
            marina / Included in your booking" — Mario rule: extras live in the
            main Payment content, sidebar stays utility-only (Total, Pay Now,
            Contact, Cancel, Download). */}
        {!isFullyPaid && nextInstallment && (
          <Stack gap={2}>
            <Typography variant="h3" component="p" fontWeight={700}>
              {t('upcomingPayment')}
            </Typography>
            <Stack direction="row" justifyContent="space-between" alignItems="flex-start">
              <Typography variant="body1" fontWeight={600}>
                {t('amount')}
              </Typography>
              <Stack gap={0.5} alignItems="flex-end">
                <Typography variant="h3" component="p" fontWeight={700} color={colors.green500}>
                  {formatPriceWithCurrency({
                    clientPriceEur: nextInstallment.amount,
                    clientPriceInfo: totalPriceInfo
                      ? {
                          amount: (nextInstallment.amount / totalPriceEur) * totalPriceInfo.amount,
                          currency: totalPriceInfo.currency,
                        }
                      : undefined,
                    locale,
                  })}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {t('deadline')}{' '}
                  {nextInstallment.deadline
                    ? DateTime.formatLongWithoutDay(DateTime.date(nextInstallment.deadline), locale)
                    : '-'}
                </Typography>
              </Stack>
            </Stack>
          </Stack>
        )}
      </Stack>
      {!isFullyPaid && (
        <Stack mt={3} gap={1}>
          <Button size="large" fullWidth onClick={handlePayNow} disabled={isLoading || isBookingEditable}>
            {t('payNow')}
          </Button>
          {/* "+X% card surcharge" notice removed — it misled customers who
              intended to pay by bank transfer (no surcharge). The per-method
              fee breakdown lives inside the Pay-now modal. */}
        </Stack>
      )}
      <Divider
        sx={{
          '&.MuiDivider-root': {
            marginBlock: 3,
          },
        }}
      />
    </>
  );

  return (
    <Box className={styles.container} component="aside" aria-label="Reservation information">
      {/* Cancellation banner has 3 mutually-exclusive states resolved by
          `getCancellationDisplayState`:
            'pending'  — request received, no decision yet (amber)
            'rejected' — admin refused, still inside 10-day visibility (red)
            'none'     — booked cancelled OR rejected > 10 days ago OR
                         no request at all → no banner.
          The 10-day rollout is intentional: rejection is a final answer
          and we don't want a permanent "rejected" reminder on the booking
          forever. Mario rule (3.5.2026). */}
      {(() => {
        const cancellationState = getCancellationDisplayState({
          cancellationRequestAt,
          cancellationRejectedAt,
          isCancelled: status === ReservationStatus.CANCELLED,
        });

        if (cancellationState === 'none') return null;

        if (cancellationState === 'rejected') {
          return (
            <Stack
              gap={2}
              sx={{
                backgroundColor: colors.mandalay50,
                borderLeft: `4px solid ${colors.red500}`,
                borderRadius: 1.5,
                padding: 2,
                marginBottom: 2,
              }}
            >
              <Stack gap={1}>
                <Typography variant="h4" component="p" fontWeight={700} color={colors.red500}>
                  {t('cancellationRejectedTitle')}
                </Typography>
                <Typography variant="body2" color={colors.mandalay800}>
                  {t('cancellationRejectedDescription')}
                </Typography>
              </Stack>
              {cancellationRejectedReason && (
                <Stack gap={0.5}>
                  <Typography variant="body2" fontWeight={700} color={colors.mandalay800}>
                    {t('cancellationRejectedReasonLabel')}:
                  </Typography>
                  <Typography variant="body2" color={colors.mandalay800} sx={{ whiteSpace: 'pre-wrap' }}>
                    {cancellationRejectedReason}
                  </Typography>
                </Stack>
              )}
              {cancellationRequest && (
                <Stack gap={0.5}>
                  <Typography variant="body2" fontWeight={700} color={colors.mandalay800}>
                    {t('cancellationRequestedReasonLabel')}:
                  </Typography>
                  <Typography variant="body2" color={colors.mandalay800} sx={{ whiteSpace: 'pre-wrap' }}>
                    {cancellationRequest}
                  </Typography>
                </Stack>
              )}
              <Typography variant="body2" color={colors.mandalay800}>
                {DateTime.formatLongWithoutDay(DateTime.date(cancellationRejectedAt!), locale)}
              </Typography>
            </Stack>
          );
        }

        // 'pending' — request received, no decision yet
        return (
          <Stack
            gap={2}
            sx={{
              backgroundColor: colors.mandalay50,
              borderRadius: 1.5,
              padding: 2,
              marginBottom: 2,
            }}
          >
            <Stack gap={1}>
              <Typography variant="h4" component="p" fontWeight={700} color={colors.mandalay900}>
                {t('cancellationRequested')}
              </Typography>
              <Typography variant="body2" color={colors.mandalay800}>
                {t('cancellationRequestedDescription')}
              </Typography>
            </Stack>
            <Typography variant="body2" color={colors.mandalay800}>
              {DateTime.formatLongWithoutDay(DateTime.date(cancellationRequestAt!), locale)}
            </Typography>
            {cancellationRequest && (
              <Stack gap={0.5}>
                <Typography variant="body2" fontWeight={700} color={colors.mandalay800}>
                  {t('note')}:
                </Typography>
                <Typography variant="body2" color={colors.mandalay800}>
                  {cancellationRequest}
                </Typography>
              </Stack>
            )}
          </Stack>
        );
      })()}
      <Stack direction="column" spacing={2} className={styles.confirmationNumber}>
        <Stack direction="row" justifyContent="space-between" alignItems="center">
          <Typography variant="body1">{t('confirmationNumber')}:</Typography>
          <Stack direction="row" alignItems="center">
            <Typography variant="h4" color={colors.blue500}>
              #{reservationNumber ?? reservationId}
            </Typography>
            <IconButton
              aria-label="Copy booking reference"
              onClick={reservationNumber ? handleCopyReservationNumber : handleCopyReservationId}
              className={styles.copyButton}
            >
              <Copy size={20} fill={colors.blue500} />
            </IconButton>
          </Stack>
        </Stack>
      </Stack>
      {renderPaymentStatus()}
      <Stack gap={3} mt={3}>
        <Typography variant="h3" component="p" fontWeight={700}>
          {cancellationRequestAt ? t('questionsAboutCancellation') : t('contactTheSupport')}
        </Typography>
        <Stack direction="row" alignItems="flex-start" gap={1.5}>
          <Email size={24} />
          <Stack gap={0.5}>
            <Typography variant="h4" component="p" fontWeight={700}>
              {t('email')}
            </Typography>
            <Typography variant="body1">{t('contactTheSupportDescription')}</Typography>
            <Link href="mailto:info@boat4you.com">
              <Typography variant="body1" color={colors.blue500}>
                {t('sendEmail')}
              </Typography>
            </Link>
          </Stack>
        </Stack>
        <Stack direction="row" alignItems="flex-start" gap={1.5}>
          <Phone size={24} />
          <Stack gap={0.5}>
            <Typography variant="h4" component="p" fontWeight={700}>
              {t('phone')}
            </Typography>
            <Link href="tel:+385913000009">
              <Typography variant="body1" color={colors.blue500}>
                +385 91 3000 009
              </Typography>
            </Link>
          </Stack>
        </Stack>
      </Stack>
      <Divider sx={{ mt: 3, mb: 2 }} />
      {/* Document stack — Download receipt + crew list URL + admin-uploaded
          files all share the same Button shape so the sidebar reads as one
          consistent column. Mario rule (3.5.2026): unificiraj da svi izgledaju
          isto + dodaj naslov da klijent zna sta je to. */}
      {(() => {
        const buttonSx = {
          textTransform: 'none' as const,
          justifyContent: 'flex-start',
          textAlign: 'left',
          fontWeight: 700,
          fontSize: 15,
          px: 2,
          '& .MuiButton-startIcon': { marginRight: 1.25 },
        };

        return (
          <Stack spacing={1.25}>
            <Typography variant="h3" component="p" fontWeight={700} sx={{ mb: 1.5 }}>
              {t('documentsTitle')}
            </Typography>
            <Button
              fullWidth
              size="large"
              variant="contained"
              color="info"
              startIcon={<Download size={20} />}
              onClick={downloadReservationPDF}
              disabled={isDownloading || isBookingEditable}
              sx={buttonSx}
            >
              {t('downloadReceipt')}
            </Button>
            {reservationDetails.crewListUrl && (
              <Button
                fullWidth
                size="large"
                variant="contained"
                color="info"
                startIcon={<ExternalLink size={20} />}
                component="a"
                href={reservationDetails.crewListUrl}
                target="_blank"
                rel="noopener noreferrer"
                sx={buttonSx}
              >
                {t('crewListTitle')}
              </Button>
            )}
            {reservationDetails.documents?.map(doc => (
              <Button
                key={doc.id}
                fullWidth
                size="large"
                variant="contained"
                color="info"
                startIcon={<Download size={20} />}
                component="a"
                href={`/api/my-bookings/${reservationId}/documents/${doc.id}`}
                target="_blank"
                rel="noopener noreferrer"
                sx={buttonSx}
              >
                <Box sx={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', flex: 1 }}>
                  {doc.filename}
                </Box>
              </Button>
            ))}
          </Stack>
        );
      })()}
      {/* Cancel reservation sits at the very bottom of the sidebar with a
          dedicated divider + extra spacing so it reads as a separate, last-
          resort action. Mario rule (3.5.2026): odvoji cancel reservation,
          stavi divider, odmakni. variant="text" + gray = quiet link, not
          the previous red pill. */}
      {!cancellationRequestAt && (
        <>
          <Divider sx={{ mt: 5, mb: 2 }} />
          <Box sx={{ textAlign: 'center', mt: 1 }}>
            <Link href={`/cancel-booking?reservationId=${reservationId}`}>
              <Button
                variant="text"
                size="small"
                disabled={isBookingEditable}
                sx={{
                  color: colors.black500,
                  textTransform: 'none',
                  fontSize: 13,
                  fontWeight: 500,
                  '&:hover': { backgroundColor: 'transparent', color: colors.black700, textDecoration: 'underline' },
                }}
              >
                {t('cancelReservation')}
              </Button>
            </Link>
          </Box>
        </>
      )}
    </Box>
  );
};

export default ReservationCTA;
