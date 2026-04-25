import { Box, Divider, Grid, Stack, Typography } from '@mui/material';
import dayjs from 'dayjs';
import { useLocale, useTranslations } from 'next-intl';
import Link from 'next/link';

import ExternalLink from '@/components/SvgIcons/ExternalLink';
import Information from '@/components/SvgIcons/Information';
import colors from '@/styles/themes/colors';
import DateTime from '@/utils/static/DateTime';
import { generateGoogleMapsLink } from '@/utils/static/googleMapsUtils';

import styles from './MainInfoTab.module.scss';

interface MainInfoTabProps {
  dateFrom: string;
  dateTo: string;
  locationFrom: string;
  defaultCheckin: string;
  defaultCheckout: string;
  numberOfDays: number;
  agencyName?: string;
  specialRequest?: string;
}

/**
 * Horizontal 0-24 time band — mirrors the BookingSummaryCard on /enter-your-details
 * so pick-up / drop-off hours get the same at-a-glance visualization after the
 * reservation is made, not just during the booking funnel.
 */
const TimeBand = ({ time, anchor }: { time: string; anchor: 'start' | 'end' }) => {
  const [hh, mm] = time.split(':').map(n => parseInt(n, 10));
  const hourFraction = Number.isFinite(hh) ? (hh + (mm || 0) / 60) / 24 : 0;
  const t = useTranslations('common');

  return (
    <Box sx={{ mt: 1 }}>
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

const MainInfoTab = ({
  dateFrom,
  dateTo,
  locationFrom,
  defaultCheckin,
  defaultCheckout,
  numberOfDays,
  agencyName,
  specialRequest,
}: MainInfoTabProps) => {
  const t = useTranslations('common');
  const locale = useLocale();

  const startDate = dayjs(dateFrom);
  const endDate = dayjs(dateTo);

  return (
    <Stack component="section" className={styles.container}>
      <Stack>
        <Stack direction="row" alignItems="center" gap={1}>
          <Information size={32} variant="secondary" />
          <Typography variant="h3" component="h2" fontWeight={700}>
            {t('reservationTabs.mainInfo')}
          </Typography>
        </Stack>

        {/* Pick-up + drop-off with clear dates + time bands — same visual pattern
            as the /enter-your-details BookingSummaryCard sidebar. */}
        <Grid container spacing={4} mt={1}>
          <Grid size={{ xs: 12, md: 6 }}>
            <Typography variant="body2" color={colors.black600}>
              {t('yachtPickUp')}
            </Typography>
            <Typography variant="body1" fontWeight={700} textTransform="capitalize" mt={0.5}>
              {DateTime.formatLong(startDate, locale)}
            </Typography>
            {defaultCheckin && <TimeBand time={defaultCheckin} anchor="start" />}
          </Grid>
          <Grid size={{ xs: 12, md: 6 }}>
            <Typography variant="body2" color={colors.black600}>
              {t('yachtDropOff')}
            </Typography>
            <Typography variant="body1" fontWeight={700} textTransform="capitalize" mt={0.5}>
              {DateTime.formatLong(endDate, locale)}
            </Typography>
            {defaultCheckout && <TimeBand time={defaultCheckout} anchor="end" />}
          </Grid>
        </Grid>

        <Divider classes={{ root: styles.rootDivider }} className={styles.divider} sx={{ my: 3 }} />

        <Grid container spacing={4}>
          {numberOfDays > 0 && (
            <Grid size={{ xs: 12, md: 6 }}>
              <Typography variant="body2" color={colors.black600}>
                {t('totalLengthOfRental')}
              </Typography>
              <Typography variant="body1" fontWeight={700} mt={0.5}>
                {numberOfDays} {t('days')}
              </Typography>
            </Grid>
          )}

          {locationFrom && (
            <Grid size={{ xs: 12, md: 6 }}>
              <Typography variant="body2" color={colors.black600}>
                {t('pickUpAddress')}
              </Typography>
              <Link href={generateGoogleMapsLink(locationFrom)} target="_blank" className={styles.link}>
                <Typography variant="body1" fontWeight={700}>
                  {locationFrom}
                </Typography>
                <ExternalLink />
              </Link>
            </Grid>
          )}

          {agencyName && (
            <Grid size={{ xs: 12, md: 6 }}>
              <Typography variant="body2" color={colors.black600}>
                {t('charterCompany')}
              </Typography>
              <Typography variant="body1" fontWeight={700} color={colors.blue500} mt={0.5}>
                {agencyName}
              </Typography>
            </Grid>
          )}

          {specialRequest && (
            <Grid size={{ xs: 12 }}>
              <Typography variant="body2" color={colors.black600}>
                {t('specialRequest')}
              </Typography>
              <Typography variant="body1" mt={0.5}>
                {specialRequest}
              </Typography>
            </Grid>
          )}
        </Grid>
      </Stack>
    </Stack>
  );
};

export default MainInfoTab;
