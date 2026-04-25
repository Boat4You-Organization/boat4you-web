'use client';

import React, { useState } from 'react';

import { Box, Card, CardContent, CardMedia, Stack, Typography } from '@mui/material';
import { useLocale, useTranslations } from 'next-intl';
import Image from 'next/image';

import BoatLocationModal from '@/components/BoatLocationModal';
import FlagIcon from '@/components/FlagIcon';
import ExternalLink from '@/components/SvgIcons/ExternalLink';
import DateTime from '@/utils/static/DateTime';
import { getBoatImageUrl } from '@/utils/static/imageUtils';
import { toTitleCase } from '@/utils/static/toTitleCase';

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
  const [isMapOpen, setIsMapOpen] = useState(false);
  const toggleMap = () => setIsMapOpen(prev => !prev);

  return (
    <>
      {locationFrom && (
        <BoatLocationModal open={isMapOpen} onClose={toggleMap} locationName={locationFrom} />
      )}
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
          {model} | {toTitleCase(name)}
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
            <Box
              component="button"
              type="button"
              onClick={toggleMap}
              disabled={!locationFrom}
              className={styles.link}
              sx={{
                background: 'none',
                border: 0,
                padding: 0,
                cursor: locationFrom ? 'pointer' : 'default',
                font: 'inherit',
                color: 'inherit',
                display: 'inline-flex',
                alignItems: 'center',
                gap: 0.5,
              }}
            >
              {locationFrom}
              <ExternalLink />
            </Box>
          </Typography>
        </Stack>
      </CardContent>
    </Card>
    </>
  );
};

export default ReservationOverviewCard;
