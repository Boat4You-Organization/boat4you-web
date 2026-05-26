import React from 'react';

import { Box, Stack, Typography } from '@mui/material';
import { useTranslations } from 'next-intl';

import AssuranceBadges from '@/components/AssuranceBadges';
import colors from '@/styles/themes/colors';

import styles from './TrustBadges.module.scss';

/**
 * Bottom-of-page reassurance row — intentionally NOT the "three generic cards"
 * pattern Boataround/Expedia use. Instead: concrete proof-of-platform stats
 * (boats, marinas, happy sailors) next to a payment-security line. Real numbers
 * build trust faster than slogans, and the compact row keeps the form above
 * it as the visual focus.
 *
 * The four-icon assurance strip below the stats lives in <AssuranceBadges />
 * so the same row can also render in the site footer (variant="footer").
 */
const TrustBadges = () => {
  const t = useTranslations('common');

  const stats = [
    { value: '15,000+', label: t('statBoats') },
    { value: '850+', label: t('statMarinas') },
    { value: '40,000+', label: t('statSailors') },
    { value: '4.8★', label: t('statRating') },
  ];

  return (
    <Box className={styles.container}>
      {/* Stats row — large numbers, visible differentiator */}
      <Stack
        direction={{ xs: 'column', sm: 'row' }}
        className={styles.statsRow}
        divider={<Box className={styles.verticalDivider} />}
      >
        {stats.map(({ value, label }) => (
          <Stack key={label} alignItems="center" className={styles.statItem}>
            <Typography variant="h3" fontWeight={700} color={colors.blue500}>
              {value}
            </Typography>
            <Typography variant="body2" color={colors.black600} textAlign="center">
              {label}
            </Typography>
          </Stack>
        ))}
      </Stack>

      {/* Assurance row — shared component (variant="card" = white card with
          border, matching the original look). */}
      <AssuranceBadges variant="card" />
    </Box>
  );
};

export default TrustBadges;
