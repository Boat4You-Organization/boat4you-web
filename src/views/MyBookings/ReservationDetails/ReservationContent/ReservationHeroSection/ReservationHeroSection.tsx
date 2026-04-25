'use client';

import AccessTimeIcon from '@mui/icons-material/AccessTimeOutlined';
import CompareArrowsIcon from '@mui/icons-material/CompareArrows';
import CloseIcon from '@mui/icons-material/Close';
import { Alert, Box, Container, IconButton, Stack, Typography } from '@mui/material';
import dayjs from 'dayjs';
import { useLocale, useTranslations } from 'next-intl';
import Image from 'next/image';
import { useEffect, useState, useTransition } from 'react';

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
import { toTitleCase } from '@/utils/static/toTitleCase';
import {
  acknowledgeYachtSwap,
  getYachtSwapInfo,
  YachtSwapInfo,
} from '@/actions/reservation.actions';

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

  // A cancellation request is "pending admin review" while it has been sent
  // AND the admin hasn't yet flipped status to CANCELLED. Once the admin
  // approves (status → CANCELLED), we switch from the warning "awaiting"
  // banner to the confirmation banner.
  const isCancelled = status === ReservationStatus.CANCELLED;
  const hasPendingCancellationRequest = Boolean(cancellationRequestAt) && !isCancelled;
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
  const agentMarkerLen = isCancelled && typeof cancellationRequest === 'string'
    ? (cancellationRequest.startsWith(agentPrefix)
        ? agentPrefix.length
        : cancellationRequest.startsWith(legacyAdminPrefix)
          ? legacyAdminPrefix.length
          : 0)
    : 0;
  const isAgentCancelled = agentMarkerLen > 0;
  const agentReason = isAgentCancelled ? cancellationRequest!.slice(agentMarkerLen).trim() : '';
  // Hide the raw "[AGENT] …" marker from the customer-visible note so
  // they never see the prefix string.
  const customerFacingCancellationRequest = isAgentCancelled ? '' : cancellationRequest;

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
        <Alert
          severity="warning"
          icon={<AccessTimeIcon />}
          sx={{ mt: 2, alignItems: 'flex-start' }}
        >
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
          severity={isAgentCancelled ? 'info' : 'success'}
          sx={{ mt: 2, alignItems: 'flex-start' }}
        >
          <Stack gap={0.5}>
            <Typography variant="body1" fontWeight={700}>
              {isAgentCancelled
                ? 'Your reservation has been cancelled by our agent'
                : t('cancellationConfirmedTitle')}
            </Typography>
            {isAgentCancelled ? (
              <Typography variant="body2">
                This booking was cancelled on{' '}
                {DateTime.formatLong(dayjs(cancellationRequestAt), locale)}. A member of our team will
                contact you shortly regarding the refund of any payments already made.
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
            <IconButton
              aria-label="Dismiss"
              size="small"
              onClick={handleDismissSwap}
              sx={{ color: 'inherit' }}
            >
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
                Your new yacht is <strong>{swapInfo.newYachtName}</strong>. Dates, location and
                price remain the same. The booking details on this page reflect the replacement
                yacht.
              </Typography>
            ) : swapInfo.action === 'MANUAL_REVIEW' ? (
              <Typography variant="body2">
                The agency has changed the yacht on your reservation. We&apos;re verifying the new
                details and will contact you shortly — no action required from you right now.
              </Typography>
            ) : (
              <Typography variant="body2">
                A change was detected on your reservation. Our team is reviewing and will contact
                you if anything requires your attention.
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
