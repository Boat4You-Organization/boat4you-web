import React from 'react';

import { Card, CardContent, CardMedia, Stack, Typography } from '@mui/material';
import { useLocale, useTranslations } from 'next-intl';
import Image from 'next/image';
import Link from 'next/link';

import FlagIcon from '@/components/FlagIcon';
import ExternalLink from '@/components/SvgIcons/ExternalLink';
import DateTime from '@/utils/static/DateTime';
import { generateGoogleMapsLink } from '@/utils/static/googleMapsUtils';
import { getBoatImageUrl } from '@/utils/static/imageUtils';

import styles from './ReservationOverviewCard.module.scss';

interface ReservationOverviewCardProps {
  mainImage: number;
  model: string;
  name: string;
  locationFrom: string;
  locationFromCountryCode: string;
  dateFrom: string;
  dateTo: string;
}

const ReservationOverviewCard = ({
  mainImage,
  model,
  name,
  locationFrom,
  locationFromCountryCode,
  dateFrom,
  dateTo,
}: ReservationOverviewCardProps) => {
  const locale = useLocale();
  const t = useTranslations('common');

  return (
    <Card classes={{ root: styles.root }} elevation={0} className={styles.container}>
      <CardMedia className={styles.cardMedia}>
        <Image
          src={getBoatImageUrl(mainImage, 256)}
          alt={`${model} ${name} boat image`}
          fill
          sizes="104px"
          className={styles.image}
        />
      </CardMedia>
      <CardContent className={styles.content}>
        <Typography variant="h3" fontWeight={700} whiteSpace="wrap">
          {model} | {name}
        </Typography>
        <Stack direction="row" alignItems="center" gap={1}>
          {locationFrom && (
            <Stack direction="row" alignItems="center" gap={1} mt={1}>
              {locationFromCountryCode && <FlagIcon countryCode={locationFromCountryCode} />}
              <Typography variant="body1">{locationFrom}</Typography>
            </Stack>
          )}
        </Stack>
        <Stack gap={1} mt={2}>
          <Typography variant="h4" component="h3">
            {t('dates')}
          </Typography>
          <Typography variant="body1" textTransform="capitalize">
            {`${DateTime.formatLong(DateTime.date(dateFrom), locale)} - ${DateTime.formatLong(DateTime.date(dateTo), locale)}`}
          </Typography>
        </Stack>
        <Stack gap={1} mt={3}>
          <Typography variant="h4" component="h3">
            {t('pickUpLocation')}
          </Typography>
          <Typography variant="body1">
            <Link href={generateGoogleMapsLink(locationFrom)} target="_blank" className={styles.link}>
              {locationFrom}
              <ExternalLink />
            </Link>
          </Typography>
        </Stack>
      </CardContent>
    </Card>
  );
};

export default ReservationOverviewCard;
