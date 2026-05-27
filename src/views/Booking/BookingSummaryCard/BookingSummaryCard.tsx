/* eslint-disable @typescript-eslint/no-use-before-define */
import React from 'react';

import { Box, Divider, Stack, Typography } from '@mui/material';
import dayjs from 'dayjs';
import { useLocale, useTranslations } from 'next-intl';

import colors from '@/styles/themes/colors';
import { ReservationData } from '@/types/reservation.type';
import DateTime from '@/utils/static/DateTime';

import styles from './BookingSummaryCard.module.scss';

interface BookingSummaryCardProps {
  reservationData: ReservationData;
}

/**
 * Sidebar "Your booking details" card — clean, white, compact. Does NOT repeat
 * the yacht identity (that's shown in the BookingHero banner above). Focuses
 * solely on the *trip specifics*: pick-up/drop-off dates with time bands, total
 * length, addresses, charter company.
 */
const BookingSummaryCard = ({ reservationData }: BookingSummaryCardProps) => {
  const { locationFrom, dateFrom, dateTo, numberOfDays, agencyName, checkin, checkout } = reservationData;
  const t = useTranslations('common');
  const locale = useLocale();

  const startDate = dayjs(dateFrom);
  const endDate = dayjs(dateTo);

  return (
    <Box className={styles.card}>
      <Typography variant="h4" fontWeight={700} pb={2.5}>
        {t('yourBookingDetails')}
      </Typography>

      <Stack gap={2.5}>
        {/* Pick-up with time band visualization (0-24 scale) */}
        <Stack gap={0.5}>
          <Typography variant="body2" color={colors.black600}>
            {t('yachtPickUp')}
          </Typography>
          <Typography variant="body1" fontWeight={700}>
            {DateTime.formatLong(startDate, locale)}
          </Typography>
          {checkin && <TimeBand time={checkin} anchor="start" />}
        </Stack>

        {/* Drop-off */}
        <Stack gap={0.5}>
          <Typography variant="body2" color={colors.black600}>
            {t('yachtDropOff')}
          </Typography>
          <Typography variant="body1" fontWeight={700}>
            {DateTime.formatLong(endDate, locale)}
          </Typography>
          {checkout && <TimeBand time={checkout} anchor="end" />}
        </Stack>
      </Stack>

      <Divider sx={{ my: 2.5, borderColor: colors.black200 }} />

      <Stack gap={1.75}>
        {numberOfDays > 0 && (
          <Stack>
            <Typography variant="body2" color={colors.black600}>
              {t('totalLengthOfRental')}
            </Typography>
            <Typography variant="body1" fontWeight={700}>
              {numberOfDays} {t('days')}
            </Typography>
          </Stack>
        )}

        {locationFrom?.name && (
          <Stack>
            <Typography variant="body2" color={colors.black600}>
              {t('pickUpAddress')}
            </Typography>
            <Typography variant="body1" fontWeight={700}>
              {locationFrom.name}
            </Typography>
          </Stack>
        )}

        {agencyName && (
          <Stack>
            <Typography variant="body2" color={colors.black600}>
              {t('charterCompany')}
            </Typography>
            <Typography variant="body1" fontWeight={700} color={colors.blue500}>
              {agencyName}
            </Typography>
          </Stack>
        )}
      </Stack>
    </Box>
  );
};

/**
 * Horizontal 0-24 time band — a subtle bar where the pick-up/drop-off hour is
 * marked by a filled segment. Differentiates us from competitors who show time
 * as plain text only; gives an at-a-glance feel of when the boat is booked.
 */
const TimeBand = ({ time, anchor }: { time: string; anchor: 'start' | 'end' }) => {
  const [hh, mm] = time.split(':').map(n => parseInt(n, 10));
  const hourFraction = Number.isFinite(hh) ? (hh + (mm || 0) / 60) / 24 : 0;
  const t = useTranslations('common');

  return (
    <Box sx={{ mt: 0.5 }}>
      <Box sx={{ position: 'relative', height: 6, borderRadius: 3, backgroundColor: colors.black100 }}>
        <Box
          sx={{
            position: 'absolute',
            left: anchor === 'start' ? `${hourFraction * 100}%` : 0,
            right: anchor === 'end' ? `${(1 - hourFraction) * 100}%` : 0,
            top: 0,
            bottom: 0,
            borderRadius: 3,
            backgroundColor: colors.blue500,
            opacity: 0.65,
          }}
        />
      </Box>
      <Stack direction="row" justifyContent="space-between" sx={{ mt: 0.5 }}>
        <Typography variant="body2" color={colors.black500} fontSize={11}>
          0:00
        </Typography>
        <Typography variant="body2" fontWeight={700} color={colors.black950} fontSize={12}>
          {anchor === 'start' ? `${t('from')} ${time}` : `${t('by')} ${time}`}
        </Typography>
        <Typography variant="body2" color={colors.black500} fontSize={11}>
          24:00
        </Typography>
      </Stack>
    </Box>
  );
};

export default BookingSummaryCard;
