'use client';

import { Box, Card, CardContent, CardMedia, Stack, Typography } from '@mui/material';
import { useLocale, useTranslations } from 'next-intl';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

import FlagIcon from '@/components/FlagIcon';
import StatusChip from '@/components/StatusChip';
import ExternalLink from '@/components/SvgIcons/ExternalLink';
import {
  RESERVATION_STATUS_COLOR_MAP,
  RESERVATION_STATUS_LABEL_MAP,
  ReservationShortInfo,
} from '@/models/reservation.model';
import colors from '@/styles/themes/colors';
import DateTime from '@/utils/static/DateTime';
import { formatPriceWithCurrency } from '@/utils/static/formatPriceCurrency';
import { generateGoogleMapsLink } from '@/utils/static/googleMapsUtils';
import { getBoatImageUrl } from '@/utils/static/imageUtils';

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
    locationToCountryCode,
    dateFrom,
    dateTo,
    totalPrice,
    totalPriceInfo,
    yachtImage,
    checkin,
    checkout,
    cancellationRequestAt,
  } = reservation;
  const router = useRouter();
  const locale = useLocale();
  const t = useTranslations('common');

  const formattedPrice = formatPriceWithCurrency({
    clientPriceEur: totalPrice,
    clientPriceInfo: totalPriceInfo,
    locale,
  });

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
          {cancellationRequestAt ? (
            <StatusChip label={t('cancellationInProgress')} color="warning" />
          ) : (
            <StatusChip label={t(RESERVATION_STATUS_LABEL_MAP[status])} color={RESERVATION_STATUS_COLOR_MAP[status]} />
          )}
          <StatusChip
            label={`${t('bookingReference')}: #${reservationId}`}
            sx={{ '& .MuiChip-label': { color: colors.black600 } }}
          />
          {reservationNumber && (
            <StatusChip
              label={`${t('confirmation')}: #${reservationNumber}`}
              sx={{ '& .MuiChip-label': { color: colors.black600 } }}
            />
          )}
        </Stack>
        <Typography variant="h2" mt={1}>
          {modelName} | {yachtName}
        </Typography>
        <Stack direction="row" alignItems="center" gap={1} mt={0.5}>
          <FlagIcon countryCode={locationToCountryCode} />
          <Typography variant="body1">{locationFrom}</Typography>
        </Stack>
        <Stack mt={2.5}>
          <Typography variant="h4" component="h3">
            {t('dates')}
          </Typography>
          <Typography variant="body1" mt={0.5} textTransform="capitalize">
            {`${DateTime.formatLong(DateTime.date(dateFrom), locale)} ${checkin}`} - <br />
            {`${DateTime.formatLong(DateTime.date(dateTo), locale)} ${checkout}`}
          </Typography>
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
          <Stack mt={{ xs: 2.5, md: 0 }}>
            <Typography variant="h2" component="p" color={colors.green500}>
              {formattedPrice}
            </Typography>
            <Typography variant="body2" color={colors.black600} textAlign={{ xs: 'start', md: 'end' }}>
              {t('totalPrice')}
            </Typography>
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
