'use client';

import { useEffect, useState, useTransition } from 'react';

import AccessTimeIcon from '@mui/icons-material/AccessTimeOutlined';
import CloseIcon from '@mui/icons-material/Close';
import CompareArrowsIcon from '@mui/icons-material/CompareArrows';
import { Alert, Box, Container, IconButton, Stack, Typography } from '@mui/material';
import dayjs from 'dayjs';
import { useLocale, useTranslations } from 'next-intl';
import Image from 'next/image';

import { YachtSwapInfo, acknowledgeYachtSwap, getYachtSwapInfo } from '@/actions/reservation.actions';
import Gallery from '@/components/Gallery';
import StatusChip from '@/components/StatusChip';
import {
  RESERVATION_STATUS_COLOR_MAP,
  RESERVATION_STATUS_LABEL_MAP,
  ReservationDetails,
  ReservationStatus,
} from '@/models/reservation.model';
import colors from '@/styles/themes/colors';
import DateTime from '@/utils/static/DateTime';
import { getCancellationDisplayState } from '@/utils/static/cancellationUtils';
import { toTitleCase } from '@/utils/static/toTitleCase';

import styles from './ReservationHeroSection.module.scss';

interface ReservationHeroSectionProps {
  reservationDetails: ReservationDetails;
}

const ReservationHeroSection = ({ reservationDetails }: ReservationHeroSectionProps) => {
  const {
    yachtImages,
    modelName,
    yachtName,
    locationFromCountryCode,
    locationFrom,
    status,
    cancellationRequestAt,
    cancellationRequest,
    cancellationRejectedAt,
    reservationId,
  } = reservationDetails;
  const t = useTranslations('common');
  const locale = useLocale();

  const [swapInfo, setSwapInfo] = useState<YachtSwapInfo | null>(null);
  const [swapDismissed, setSwapDismissed] = useState(false);
  const [, startTransition] = useTransition();

  useEffect(() => {
    let cancelled = false;

    (async () => {
      const result = await getYachtSwapInfo(reservationId);

      if (!cancelled && result.payload) {
        setSwapInfo(result.payload);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [reservationId]);

  const handleDismissSwap = () => {
    setSwapDismissed(true);
    startTransition(() => {
      void acknowledgeYachtSwap(reservationId);
    });
  };

  const showSwapBanner = Boolean(swapInfo) && !swapDismissed && !swapInfo?.acknowledged;

  // A cancellation request can be in 3 states:
  //   'pending'   — request sent, admin hasn't decided yet (warning banner).
  //   'rejected'  — admin refused, still inside the 10-day visibility window
  //                 (red banner + chip). Booking stays active.
  //   'none'      — no request, decision long past, or booking already
  //                 cancelled — the cancelled chip wins.
  // After 10 days from rejection, the customer-side surface returns to
  // pretending no request ever happened (Mario rule, 3.5.2026).
  const isCancelled = status === ReservationStatus.CANCELLED;
  const cancelDisplayState = getCancellationDisplayState({
    cancellationRequestAt,
    cancellationRejectedAt,
    isCancelled,
  });
  const hasPendingCancellationRequest = cancelDisplayState === 'pending';
  const hasRejectedCancellationRequest = cancelDisplayState === 'rejected';
  const isConfirmedCancellation = Boolean(cancellationRequestAt) && isCancelled;

  // Agent-finalised cancellations (admin clicked Cancel in the back-office
  // — whether approving a customer request or initiating themselves) are
  // tagged with "[AGENT]" in `cancellationRequest`. The marker is the only
  // source of truth for "this was closed by our staff" because a single
  // DB column holds both the customer's original reason and the admin's
  // follow-up. Content after the prefix is the reason to surface.
  const agentPrefix = '[AGENT]';
  // Legacy marker from an earlier iteration — treat the same way.
  const legacyAdminPrefix = '[ADMIN]';
  // System auto-cancellation marker — set by OptionExpiryService when option
  // expires + grace period passes without payment. Surfaces a different banner
  // ("payment not received") so the customer understands WHY (and that no
  // human action is required).
  const systemPrefix = '[SYSTEM]';
  const agentMarkerLen =
    isCancelled && typeof cancellationRequest === 'string'
      ? cancellationRequest.startsWith(agentPrefix)
        ? agentPrefix.length
        : cancellationRequest.startsWith(legacyAdminPrefix)
          ? legacyAdminPrefix.length
          : 0
      : 0;
  const systemMarkerLen =
    isCancelled && typeof cancellationRequest === 'string' && cancellationRequest.startsWith(systemPrefix)
      ? systemPrefix.length
      : 0;
  const isAgentCancelled = agentMarkerLen > 0;
  const isSystemCancelled = systemMarkerLen > 0;
  const agentReason = isAgentCancelled ? cancellationRequest!.slice(agentMarkerLen).trim() : '';
  const systemReason = isSystemCancelled ? cancellationRequest!.slice(systemMarkerLen).trim() : '';
  // Hide raw markers from the customer-visible note so they never see prefix strings.
  const customerFacingCancellationRequest = isAgentCancelled || isSystemCancelled ? '' : cancellationRequest;

  return (
    <Container
      component="section"
      maxWidth="xl"
      disableGutters
      classes={{ root: styles.root }}
      className={styles.container}
    >
      <Stack direction="column" spacing={0.5}>
        <Stack direction="row" alignItems="center" spacing={1.5} flexWrap="wrap">
          <Typography variant="h2" color={colors.black950}>
            {modelName} | {toTitleCase(yachtName)}
          </Typography>
          {hasPendingCancellationRequest ? (
            <StatusChip label={t('cancellationInProgress')} color="warning" />
          ) : hasRejectedCancellationRequest ? (
            <StatusChip label={t('cancellationRequestRejected')} color="error" />
          ) : (
            <StatusChip label={t(RESERVATION_STATUS_LABEL_MAP[status])} color={RESERVATION_STATUS_COLOR_MAP[status]} />
          )}
        </Stack>
        <Stack direction="row" alignItems="center" spacing={1}>
          <Box className={styles.imageWrapper}>
            <Image
              loading="lazy"
              fill
              sizes="auto"
              src={`https://flagcdn.com/w80/${locationFromCountryCode.toLowerCase()}.png`}
              alt={`${locationFromCountryCode} flag`}
              className={styles.image}
            />
          </Box>
          <Typography variant="body1" color={colors.black950}>
            {locationFrom}
          </Typography>
        </Stack>
      </Stack>

      {/* Banner: while the cancellation request is pending admin review. */}
      {hasPendingCancellationRequest && (
        <Alert severity="warning" icon={<AccessTimeIcon />} sx={{ mt: 2, alignItems: 'flex-start' }}>
          <Stack gap={0.5}>
            <Typography variant="body1" fontWeight={700}>
              {t('cancellationPendingTitle')}
            </Typography>
            <Typography variant="body2">
              {t('cancellationPendingDescription', {
                date: DateTime.formatLong(dayjs(cancellationRequestAt), locale),
              })}
            </Typography>
            {customerFacingCancellationRequest && (
              <Typography variant="body2" color={colors.black600} sx={{ mt: 0.5 }}>
                <strong>{t('yourMessage')}:</strong> {customerFacingCancellationRequest}
              </Typography>
            )}
          </Stack>
        </Alert>
      )}

      {/* Banner: cancellation is finalised (status = CANCELLED). When the
          agent clicked Cancel in the back-office (either approving a customer
          request or initiating themselves), we surface a dedicated "cancelled
          by agent" notice plus any reason they typed. Otherwise fall back to
          the generic "your request was approved" banner. */}
      {isConfirmedCancellation && (
        <Alert
          severity={isSystemCancelled ? 'warning' : isAgentCancelled ? 'info' : 'success'}
          sx={{ mt: 2, alignItems: 'flex-start' }}
        >
          <Stack gap={0.5}>
            <Typography variant="body1" fontWeight={700}>
              {isSystemCancelled
                ? 'Your reservation has been cancelled — payment not received'
                : isAgentCancelled
                  ? 'Your reservation has been cancelled by our agent'
                  : t('cancellationConfirmedTitle')}
            </Typography>
            {isSystemCancelled ? (
              <Typography variant="body2">
                This booking was automatically cancelled on {DateTime.formatLong(dayjs(cancellationRequestAt), locale)}{' '}
                because we did not receive your payment within the option deadline. The yacht is now released and may be
                booked by someone else. To reserve it again, please start a new booking.
              </Typography>
            ) : isAgentCancelled ? (
              <Typography variant="body2">
                This booking was cancelled on {DateTime.formatLong(dayjs(cancellationRequestAt), locale)}. A member of
                our team will contact you shortly regarding the refund of any payments already made.
              </Typography>
            ) : (
              <Typography variant="body2">
                {t('cancellationConfirmedDescription', {
                  date: DateTime.formatLong(dayjs(cancellationRequestAt), locale),
                })}
              </Typography>
            )}
            {isAgentCancelled && agentReason && (
              <Typography variant="body2" color={colors.black600} sx={{ mt: 0.5 }}>
                <strong>Reason:</strong> {agentReason}
              </Typography>
            )}
            {isSystemCancelled && systemReason && (
              <Typography variant="body2" color={colors.black600} sx={{ mt: 0.5 }}>
                <strong>Reason:</strong> {systemReason}
              </Typography>
            )}
          </Stack>
        </Alert>
      )}

      {/* Banner: agency replaced the yacht on this reservation. Shown to the
          customer once per detected swap (state persisted via acknowledge endpoint). */}
      {showSwapBanner && swapInfo && (
        <Alert
          severity="info"
          icon={<CompareArrowsIcon />}
          sx={{ mt: 2, alignItems: 'flex-start' }}
          action={
            <IconButton aria-label="Dismiss" size="small" onClick={handleDismissSwap} sx={{ color: 'inherit' }}>
              <CloseIcon fontSize="small" />
            </IconButton>
          }
        >
          <Stack gap={0.5}>
            <Typography variant="body1" fontWeight={700}>
              The charter agency has replaced your yacht
            </Typography>
            {swapInfo.action === 'AUTO_UPDATED' && swapInfo.newYachtName ? (
              <Typography variant="body2">
                Your new yacht is <strong>{swapInfo.newYachtName}</strong>. Dates, location and price remain the same.
                The booking details on this page reflect the replacement yacht.
              </Typography>
            ) : swapInfo.action === 'MANUAL_REVIEW' ? (
              <Typography variant="body2">
                The agency has changed the yacht on your reservation. We&apos;re verifying the new details and will
                contact you shortly — no action required from you right now.
              </Typography>
            ) : (
              <Typography variant="body2">
                A change was detected on your reservation. Our team is reviewing and will contact you if anything
                requires your attention.
              </Typography>
            )}
            <Typography variant="body2" color={colors.black600} sx={{ mt: 0.5, fontSize: '0.8125rem' }}>
              Detected on {DateTime.formatLong(dayjs(swapInfo.detectedAt), locale)}
            </Typography>
          </Stack>
        </Alert>
      )}

      <Gallery images={yachtImages} showShareAndFavorite={false} maxDisplayedImages={3} />
    </Container>
  );
};

export default ReservationHeroSection;
