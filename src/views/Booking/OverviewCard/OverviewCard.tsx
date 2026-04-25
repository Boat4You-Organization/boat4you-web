import React from 'react';

import { Box, Divider, Icon, Stack, Tooltip, Typography } from '@mui/material';
import dayjs from 'dayjs';
import { useLocale, useTranslations } from 'next-intl';
import Link from 'next/link';

import StatusChip from '@/components/StatusChip';
import ExternalLink from '@/components/SvgIcons/ExternalLink';
import Information from '@/components/SvgIcons/Information';
import YachtCard from '@/components/YachtCard';
import { ReservationData } from '@/types/reservation.type';
import DateTime from '@/utils/static/DateTime';
import { generateGoogleMapsLink } from '@/utils/static/googleMapsUtils';
import CancellationCard from '@/views/Booking/CancellationCard';

import styles from './OverviewCard.module.scss';

interface OverviewCardProps {
  reservationData: ReservationData;
  isLastStep: boolean;
}

const OverviewCard = ({ reservationData, isLastStep }: OverviewCardProps) => {
  const { name, model, locationFrom, mainImage, dateFrom, dateTo } = reservationData;
  const t = useTranslations('common');
  const locale = useLocale();

  const startDate = dayjs(dateFrom);
  const endDate = dayjs(dateTo);

  // Null-guard for yachts without a location (OSH/MMK legacy).
  const pickUpLocationName = locationFrom?.name ?? '';
  const googleMapsLink = pickUpLocationName ? generateGoogleMapsLink(pickUpLocationName) : '';

  return (
    <Box className={styles.container}>
      <YachtCard
        mainImageId={mainImage?.id ?? 0}
        model={model}
        name={name}
        locationCountryCode={locationFrom?.countryCode ?? ''}
        locationName={pickUpLocationName}
      >
        <Stack direction="row" alignItems="center" mt={1}>
          <StatusChip label="Multi Location" color="success" />
          <Tooltip
            title="Crewed Boats require a custom inquiry rather than being booked automatically."
            placement="right-end"
            slotProps={{
              transition: { timeout: 0 },
            }}
          >
            <Icon className={styles.icon}>
              <Information size={20} />
            </Icon>
          </Tooltip>
        </Stack>
      </YachtCard>
      <Divider
        sx={{
          '&.MuiDivider-root': {
            marginBlock: 3,
          },
        }}
      />
      <Stack gap={3}>
        <Stack gap={1}>
          <Typography variant="h4" component="h3">
            {t('dates')}
          </Typography>
          <Typography variant="body1" textTransform="capitalize">
            {startDate && endDate && startDate.isValid() && endDate.isValid()
              ? `${DateTime.formatLong(startDate, locale)} - ${DateTime.formatLong(endDate, locale)}`
              : '-'}
          </Typography>
        </Stack>
        {pickUpLocationName && (
          <Stack gap={1}>
            <Typography variant="h4" component="h3">
              {t('pickUpLocation')}
            </Typography>
            <Link href={googleMapsLink} target="_blank" className={styles.link}>
              <Typography variant="body1">{pickUpLocationName}</Typography>
              <ExternalLink variant="secondary" />
            </Link>
          </Stack>
        )}
      </Stack>
      <Divider
        sx={{
          '&.MuiDivider-root': {
            marginBlock: 3,
          },
        }}
      />
      <CancellationCard compact isLastStep={isLastStep} dateFrom={dateFrom} />
      <Box className={styles.divider} />
    </Box>
  );
};

export default OverviewCard;
