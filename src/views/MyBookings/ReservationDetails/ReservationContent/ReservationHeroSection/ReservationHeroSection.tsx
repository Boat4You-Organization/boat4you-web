'use client';

import { Box, Container, Stack, Typography } from '@mui/material';
import { useTranslations } from 'next-intl';
import Image from 'next/image';

import Gallery from '@/components/Gallery';
import StatusChip from '@/components/StatusChip';
import {
  RESERVATION_STATUS_COLOR_MAP,
  RESERVATION_STATUS_LABEL_MAP,
  ReservationDetails,
} from '@/models/reservation.model';
import colors from '@/styles/themes/colors';

import styles from './ReservationHeroSection.module.scss';

interface ReservationHeroSectionProps {
  reservationDetails: ReservationDetails;
}

const ReservationHeroSection = ({ reservationDetails }: ReservationHeroSectionProps) => {
  const { yachtImages, modelName, yachtName, locationFromCountryCode, locationFrom, status } = reservationDetails;
  const t = useTranslations('common');

  return (
    <Container
      component="section"
      maxWidth="xl"
      disableGutters
      classes={{ root: styles.root }}
      className={styles.container}
    >
      <Stack direction="column" spacing={0.5}>
        <Stack direction="row" alignItems="center" spacing={1.5}>
          <Typography variant="h2" color={colors.black950}>
            {modelName} | {yachtName}
          </Typography>
          <StatusChip label={t(RESERVATION_STATUS_LABEL_MAP[status])} color={RESERVATION_STATUS_COLOR_MAP[status]} />
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
      <Gallery images={yachtImages} showShareAndFavorite={false} maxDisplayedImages={3} />
    </Container>
  );
};

export default ReservationHeroSection;
