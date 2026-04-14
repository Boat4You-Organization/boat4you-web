import { Card, CardContent, CardMedia, Stack, Typography } from '@mui/material';
import { useLocale, useTranslations } from 'next-intl';
import Image from 'next/image';
import Link from 'next/link';

import FlagIcon from '@/components/FlagIcon';
import StatusChip from '@/components/StatusChip';
import {
  RESERVATION_STATUS_COLOR_MAP,
  RESERVATION_STATUS_LABEL_MAP,
  ReservationShortInfo,
} from '@/models/reservation.model';
import colors from '@/styles/themes/colors';
import DateTime from '@/utils/static/DateTime';
import { formatPriceWithCurrency } from '@/utils/static/formatPriceCurrency';
import { getBoatImageUrl } from '@/utils/static/imageUtils';

import styles from './PastReservationCard.module.scss';

interface PastReservationCardProps {
  reservation: ReservationShortInfo;
}

const PastReservationCard = ({ reservation }: PastReservationCardProps) => {
  const t = useTranslations('common');
  const {
    status,
    reservationId,
    reservationNumber,
    yachtName,
    locationFrom,
    locationToCountryCode,
    dateFrom,
    dateTo,
    totalPrice,
    totalPriceInfo,
    yachtImage,
    modelName,
    cancellationRequestAt,
  } = reservation;
  const locale = useLocale();

  const formattedPrice = formatPriceWithCurrency({
    clientPriceEur: totalPrice,
    clientPriceInfo: totalPriceInfo,
    locale,
  });

  return (
    <Link href={`/my-bookings/${reservationId}`}>
      <Card classes={{ root: styles.root }} className={styles.container}>
        <CardMedia className={styles.media}>
          <Image
            src={getBoatImageUrl(yachtImage, 800)}
            alt={yachtName}
            fill
            sizes="(max-width: 899px) 50vw, 50vw"
            style={{ objectFit: 'cover' }}
          />
        </CardMedia>
        <CardContent className={styles.content}>
          <Stack direction="column">
            <Stack direction="row" alignItems="flex-start" gap={1} flexWrap="wrap">
              {cancellationRequestAt ? (
                <StatusChip label={t('cancellationInProgress')} color="warning" />
              ) : (
                <StatusChip
                  label={t(RESERVATION_STATUS_LABEL_MAP[status])}
                  color={RESERVATION_STATUS_COLOR_MAP[status]}
                />
              )}
              <Typography variant="body1" color={colors.black500}>
                {reservationNumber && `#${reservationNumber}`}
              </Typography>
            </Stack>
            <Typography variant="h4" component="h3" mt={1}>
              {modelName} | {yachtName}
            </Typography>
            <Stack direction="row" alignItems="center" gap={1} mt={0.5} display={{ xs: 'none', md: 'flex' }}>
              <FlagIcon countryCode={locationToCountryCode} />
              <Typography variant="body1">{locationFrom}</Typography>
            </Stack>
            <Stack mt={1}>
              <Typography variant="body1">
                {DateTime.formatShortWithoutDay(DateTime.date(dateFrom))} -{' '}
                {DateTime.formatShortWithoutDay(DateTime.date(dateTo))}
              </Typography>
            </Stack>
          </Stack>
          <Stack mt={{ xs: 0, md: 4 }}>
            <Typography
              component="p"
              color={colors.green500}
              sx={{
                typography: {
                  xs: 'body1',
                  md: 'h2',
                  fontWeight: '700 !important',
                },
              }}
            >
              {formattedPrice}
            </Typography>
            <Typography variant="body2" color={colors.black600} sx={{ display: { xs: 'none', md: 'block' } }}>
              {t('totalPrice').toLowerCase()}
            </Typography>
          </Stack>
        </CardContent>
      </Card>
    </Link>
  );
};

export default PastReservationCard;
