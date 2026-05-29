'use client';

import { useMemo } from 'react';

import { Box, Stack, Typography } from '@mui/material';
import dayjs from 'dayjs';
import { useLocale, useTranslations } from 'next-intl';

import CircularProgress from '@/components/CircularProgress';
import Modal from '@/components/ModalRoot/Modal';
import VerticalTimeline from '@/components/VerticalTimeline';
import { PaymentPhase } from '@/models/reservation.model';
import colors from '@/styles/themes/colors';
import DateTime from '@/utils/static/DateTime';
import { generateCancellationTimeline } from '@/utils/static/cancellationUtils';
import { formatPriceWithCurrency } from '@/utils/static/formatPriceCurrency';
import { calculatePaymentPhases } from '@/utils/static/paymentPhases';
import { toTitleCase } from '@/utils/static/toTitleCase';

import styles from './BookingReviewModal.module.scss';

interface BookingReviewModalProps {
  open: boolean;
  onClose: () => void;
  yachtName: string;
  yachtModel: string;
  dateFrom: string;
  totalPriceEur: number;
  totalPriceInfo: { amount: number; currency: string; rate: number; validAt: string } | null;
  /**
   * Partner-aware payment phases (the real MMK/NauSys installment ratios with
   * the B4Y agency discount applied) from /payment-phases-preview or the
   * post-reservation schedule. When present these are the source of truth — the
   * modal only falls back to the client-side A/B/C approximation when empty
   * (preview still loading / sync gap / network error). Mirrors PriceBreakdownCard.
   */
  paymentPhases?: PaymentPhase[];
  isLoadingPhases?: boolean;
}

/**
 * Read-only booking recap shown from a link under the Next-details button.
 * Mirrors the payment schedule and cancellation timeline the user already
 * saw on the sidebar cards, compacted into one modal for a quick glance
 * before committing to the next step.
 */
const BookingReviewModal = ({
  open,
  onClose,
  yachtName,
  yachtModel,
  dateFrom,
  totalPriceEur,
  totalPriceInfo,
  paymentPhases = [],
  isLoadingPhases = false,
}: BookingReviewModalProps) => {
  const t = useTranslations('common');
  const locale = useLocale();

  // Source priority mirrors PriceBreakdownCard: use the partner-aware phases
  // (real MMK/NauSys ratios) passed in as a prop; fall back to the client-side
  // A/B/C formula only when none were supplied. Previously this modal ALWAYS
  // recomputed locally, so it disagreed with the sidebar Price-breakdown card
  // on partner yachts (different split + dates).
  const phases = useMemo(
    () =>
      paymentPhases.length > 0
        ? paymentPhases.map(p => ({ deadline: DateTime.date(p.deadline), amount: p.amount }))
        : calculatePaymentPhases(dateFrom, totalPriceEur),
    [paymentPhases, dateFrom, totalPriceEur]
  );

  const cancellationTimeline = useMemo(() => generateCancellationTimeline(dateFrom, t, locale), [dateFrom, t, locale]);

  const today = dayjs().startOf('day');

  const formattedTotal = formatPriceWithCurrency({
    clientPriceEur: totalPriceEur,
    clientPriceInfo: totalPriceInfo ?? undefined,
    locale,
  });

  return (
    <Modal open={open} onClose={onClose} title={t('bookingReview')} hideCancelButton hideConfirmButton maxWidth="sm">
      <Stack>
        <Box className={styles.row}>
          <Typography className={styles.rowLabel}>{t('yachtName')}</Typography>
          <Typography className={styles.rowValue} fontWeight={700}>
            {yachtModel} {yachtName ? `| ${toTitleCase(yachtName)}` : ''}
          </Typography>
        </Box>

        <Box className={styles.row}>
          <Typography className={styles.rowLabel}>{t('totalPrice')}</Typography>
          <Typography className={styles.priceValue}>{formattedTotal}</Typography>
        </Box>

        <Box className={styles.row}>
          <Typography className={styles.rowLabel}>{t('paymentSchedule')}</Typography>
          {isLoadingPhases && paymentPhases.length === 0 ? (
            <Box sx={{ display: 'flex', justifyContent: 'center', py: 2, flex: 1 }}>
              <CircularProgress size={28} />
            </Box>
          ) : (
            <Box className={styles.phaseList}>
              {phases.map((phase, index) => {
                const isPaidOrDue = today.isSame(phase.deadline, 'day') || today.isAfter(phase.deadline, 'day');

                return (
                  <Box key={phase.deadline.toISOString()} className={styles.phase}>
                    <Box className={`${styles.phaseDot} ${isPaidOrDue ? styles.phaseDotActive : ''}`} />
                    <Stack>
                      <Typography className={styles.phaseAmount}>
                        {formatPriceWithCurrency({
                          clientPriceEur: phase.amount,
                          // Per-phase currency info: scale the EUR phase amount by
                          // the total's conversion ratio so each instalment shows
                          // its own converted amount (not the full total).
                          clientPriceInfo:
                            totalPriceInfo && totalPriceEur > 0
                              ? {
                                  ...totalPriceInfo,
                                  amount: phase.amount * (totalPriceInfo.amount / totalPriceEur),
                                }
                              : undefined,
                          locale,
                        })}
                      </Typography>
                      <Typography className={styles.phaseDeadline}>
                        {t('installmentNumber', { number: String(index + 1) })} {phase.deadline.format('D MMMM YYYY')}
                      </Typography>
                    </Stack>
                  </Box>
                );
              })}
            </Box>
          )}
        </Box>

        <Box className={styles.row}>
          <Typography className={styles.rowLabel}>{t('cancellationLabel')}</Typography>
          <Box sx={{ mt: -1 }}>
            <VerticalTimeline items={cancellationTimeline} />
          </Box>
        </Box>
      </Stack>

      <Typography variant="body2" color={colors.black500} sx={{ mt: 2 }}>
        {t('bookingReviewFooter')}
      </Typography>
    </Modal>
  );
};

export default BookingReviewModal;
