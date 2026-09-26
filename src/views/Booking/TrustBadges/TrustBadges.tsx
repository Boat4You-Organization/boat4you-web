import React from 'react';

import { Box, Stack, Typography } from '@mui/material';
import { useLocale, useTranslations } from 'next-intl';

import AssuranceBadges from '@/components/AssuranceBadges';
import { TRIPADVISOR_RATING, TRIPADVISOR_REVIEW_COUNT } from '@/config/tripadvisor';
import colors from '@/styles/themes/colors';

import styles from './TrustBadges.module.scss';

/** Catalogue counts (siteStats.ts `display`, rounded down for "N+"). */
export interface TrustStats {
  boats: number;
  marinas: number;
}

interface TrustBadgesProps {
  /** Null / missing → the counts are left out rather than guessed. */
  stats?: TrustStats | null;
}

/**
 * Bottom-of-page reassurance row — intentionally NOT the "three generic cards"
 * pattern Boataround/Expedia use. Instead: concrete proof-of-platform stats
 * next to a payment-security line.
 *
 * Every figure has a source (audit B32, 26.9.2026): the boat and marina
 * counts are the catalogue counts the home hero and /about-us show
 * (siteStats.ts), the rating is the TripAdvisor profile the footer links.
 * The hardcoded "15,000+ boats · 850+ marinas · 40,000+ happy sailors · 4.8★"
 * row (26.5.2026) had none.
 *
 * The four-icon assurance strip below the stats lives in <AssuranceBadges />
 * so the same row can also render in the site footer (variant="footer").
 */
const TrustBadges = ({ stats = null }: TrustBadgesProps) => {
  const t = useTranslations('common');
  const locale = useLocale();
  const number = new Intl.NumberFormat(locale);
  const rating = new Intl.NumberFormat(locale, { minimumFractionDigits: 1, maximumFractionDigits: 1 }).format(
    Number(TRIPADVISOR_RATING)
  );

  const items = [
    ...(stats && stats.boats > 0 ? [{ value: `${number.format(stats.boats)}+`, label: t('statBoats') }] : []),
    ...(stats && stats.marinas > 0 ? [{ value: `${number.format(stats.marinas)}+`, label: t('statMarinas') }] : []),
    { value: `${rating}★`, label: t('tripadvisorReviews', { count: Number(TRIPADVISOR_REVIEW_COUNT) }) },
  ];

  return (
    <Box className={styles.container}>
      {/* Stats row — large numbers, visible differentiator */}
      <Stack
        direction={{ xs: 'column', sm: 'row' }}
        className={styles.statsRow}
        divider={<Box className={styles.verticalDivider} />}
      >
        {items.map(({ value, label }) => (
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
