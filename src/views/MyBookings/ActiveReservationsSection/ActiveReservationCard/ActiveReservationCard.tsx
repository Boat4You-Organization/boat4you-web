'use client';

import { Box, Card, CardContent, CardMedia, Stack, Typography } from '@mui/material';
import { useLocale, useTranslations } from 'next-intl';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

import StatusChip from '@/components/StatusChip';
import Calendar from '@/components/SvgIcons/Calendar';
import ExternalLink from '@/components/SvgIcons/ExternalLink';
import {
  RESERVATION_STATUS_COLOR_MAP,
  RESERVATION_STATUS_LABEL_MAP,
  ReservationShortInfo,
  ReservationStatus,
} from '@/models/reservation.model';
import colors from '@/styles/themes/colors';
import DateTime from '@/utils/static/DateTime';
import { getCancellationDisplayState } from '@/utils/static/cancellationUtils';
import { formatPriceWithCurrency } from '@/utils/static/formatPriceCurrency';
import { generateGoogleMapsLink } from '@/utils/static/googleMapsUtils';
import { getBoatImageUrl } from '@/utils/static/imageUtils';
import { toTitleCase } from '@/utils/static/toTitleCase';

import styles from './ActiveReservationCard.module.scss';

interface ActiveReservationCardProps {
  reservation: ReservationShortInfo;
}

const ActiveReservationCard = ({ reservation }: ActiveReservationCardProps) => {
  const {
    status,
    reservationId,
    reservationNumber,
    yachtName,
    modelName,
    locationFrom,
    dateFrom,
    dateTo,
    totalPrice,
    totalPriceInfo,
    listPrice,
    listPriceInfo,
    yachtImage,
    checkin,
    checkout,
    cancellationRequestAt,
    cancellationRejectedAt,
  } = reservation;
  const router = useRouter();
  const locale = useLocale();
  const t = useTranslations('common');

  const formattedPrice = formatPriceWithCurrency({
    clientPriceEur: totalPrice,
    clientPriceInfo: totalPriceInfo,
    locale,
  });

  const showListPrice = typeof listPrice === 'number' && listPrice > totalPrice;
  const discountPercent = showListPrice ? Math.round(((listPrice! - totalPrice) / listPrice!) * 100) : 0;
  const formattedListPrice = showListPrice
    ? formatPriceWithCurrency({
        clientPriceEur: listPrice!,
        clientPriceInfo: listPriceInfo ?? undefined,
        locale,
      })
    : null;

  const timeUntil = DateTime.timeUntil(dateFrom);

  const getTimeUnitText = () => {
    const { value, unit, extraDays } = timeUntil;

    if (value === 0) {
      return t('ongoing');
    }

    const isSingular = value === 1;

    let unitText = '';

    // eslint-disable-next-line default-case
    switch (unit) {
      case 'day':
        unitText = isSingular ? t('day') : t('days');
        break;
      case 'week':
        unitText = isSingular ? t('week') : t('weeks');
        break;
      case 'month':
        unitText = isSingular ? t('month') : t('months');
        break;
      case 'year':
        unitText = isSingular ? t('year') : t('years');
        break;
    }

    return extraDays ? `${t('in')} ${value} ${unitText} ${extraDays} ${t('days')}` : `${t('in')} ${value} ${unitText}`;
  };

  const timeText = getTimeUnitText();

  return (
    <Card
      classes={{ root: styles.root }}
      className={styles.container}
      onClick={() => router.push(`/my-bookings/${reservationId}`)}
    >
      <CardContent className={styles.content}>
        <Stack direction="row" alignItems="center" gap={1} flexWrap="wrap">
          {(() => {
            const cancelState = getCancellationDisplayState({
              cancellationRequestAt,
              cancellationRejectedAt,
              isCancelled: status === ReservationStatus.CANCELLED,
            });

            if (cancelState === 'pending') {
              return <StatusChip label={t('cancellationInProgress')} color="warning" />;
            }

            if (cancelState === 'rejected') {
              return <StatusChip label={t('cancellationRequestRejected')} color="error" />;
            }

            return (
              <StatusChip
                label={t(RESERVATION_STATUS_LABEL_MAP[status])}
                color={RESERVATION_STATUS_COLOR_MAP[status]}
              />
            );
          })()}
          <StatusChip
            label={`${t('confirmationNumber')}: #${reservationNumber ?? reservationId}`}
            sx={{ '& .MuiChip-label': { color: colors.black600 } }}
          />
        </Stack>
        <Typography variant="h2" mt={1}>
          {modelName} | {toTitleCase(yachtName)}
        </Typography>
        <Stack
          mt={2.5}
          direction={{ xs: 'column', sm: 'row' }}
          gap={{ xs: 1.5, sm: 4 }}
          alignItems={{ sm: 'flex-start' }}
        >
          <Stack direction="row" gap={1.25} alignItems="flex-start">
            <Box mt={0.25} color={colors.blue500}>
              <Calendar size={20} />
            </Box>
            <Stack>
              <Typography variant="body2" color={colors.black500}>
                {t('yachtPickUp')}
              </Typography>
              <Typography variant="body1" fontWeight={600} textTransform="capitalize">
                {DateTime.formatLong(DateTime.date(dateFrom), locale)}
              </Typography>
              <Typography variant="body2" color={colors.black600}>
                {checkin}
              </Typography>
            </Stack>
          </Stack>
          <Stack direction="row" gap={1.25} alignItems="flex-start">
            <Box mt={0.25} color={colors.blue500}>
              <Calendar size={20} />
            </Box>
            <Stack>
              <Typography variant="body2" color={colors.black500}>
                {t('yachtDropOff')}
              </Typography>
              <Typography variant="body1" fontWeight={600} textTransform="capitalize">
                {DateTime.formatLong(DateTime.date(dateTo), locale)}
              </Typography>
              <Typography variant="body2" color={colors.black600}>
                {checkout}
              </Typography>
            </Stack>
          </Stack>
        </Stack>
        <Stack mt={2.5} direction={{ xs: 'column', md: 'row' }} justifyContent="space-between">
          <Stack>
            <Typography variant="h4" component="h3">
              {t('pickUpLocation')}
            </Typography>
            <Stack mt={0.5}>
              <Link href={generateGoogleMapsLink(locationFrom)} target="_blank" className={styles.link}>
                <Typography variant="body1">{locationFrom}</Typography>
                <ExternalLink />
              </Link>
            </Stack>
          </Stack>
          <Stack mt={{ xs: 2.5, md: 0 }} alignItems={{ xs: 'flex-start', md: 'flex-end' }}>
            {showListPrice && (
              <Stack direction="row" alignItems="center" gap={1}>
                <Typography variant="body2" color={colors.black500} sx={{ textDecoration: 'line-through' }}>
                  {formattedListPrice}
                </Typography>
                <Typography variant="body2" color={colors.black950} fontWeight={800}>
                  − {discountPercent}%
                </Typography>
              </Stack>
            )}
            <Stack direction="row" alignItems="baseline" gap={1} mt={0.25}>
              <Typography variant="body2" color={colors.black600}>
                {t('totalPrice')}
              </Typography>
              <Typography variant="h2" component="p" color={colors.green500}>
                {formattedPrice}
              </Typography>
            </Stack>
          </Stack>
        </Stack>
      </CardContent>
      <CardMedia className={styles.media}>
        <Image
          src={getBoatImageUrl(yachtImage, 800)}
          alt={yachtName}
          fill
          sizes="(max-width: 899px) 100vw, 50vw"
          style={{ objectFit: 'cover' }}
        />
        <Box className={styles.chip}>
          <Typography variant="body2">{timeText}</Typography>
        </Box>
      </CardMedia>
    </Card>
  );
};

export default ActiveReservationCard;
