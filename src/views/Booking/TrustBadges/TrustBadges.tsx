import React from 'react';

import { LockOutlined, Sailing, SupportAgent, VerifiedUser } from '@mui/icons-material';
import { Box, Stack, Typography } from '@mui/material';
import { useTranslations } from 'next-intl';

import colors from '@/styles/themes/colors';

import styles from './TrustBadges.module.scss';

/**
 * Bottom-of-page reassurance row — intentionally NOT the "three generic cards"
 * pattern Boataround/Expedia use. Instead: concrete proof-of-platform stats
 * (boats, marinas, happy sailors) next to a payment-security line. Real numbers
 * build trust faster than slogans, and the compact row keeps the form above
 * it as the visual focus.
 */
const TrustBadges = () => {
  const t = useTranslations('common');

  const stats = [
    { value: '15,000+', label: t('statBoats') },
    { value: '850+', label: t('statMarinas') },
    { value: '40,000+', label: t('statSailors') },
    { value: '4.8★', label: t('statRating') },
  ];

  const assurances = [
    { Icon: LockOutlined, label: t('assuranceSSL') },
    { Icon: SupportAgent, label: t('assurance247') },
    { Icon: VerifiedUser, label: t('assuranceVerified') },
    { Icon: Sailing, label: t('assuranceNoHidden') },
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

      {/* Assurance row — separate white card with visible border and its own
          padding so it reads as its own "box", breathing room from the stats
          row above. */}
      <Box className={styles.assuranceRow}>
        {assurances.map(({ Icon, label }) => (
          <Box key={label} className={styles.assuranceItem}>
            <Icon sx={{ fontSize: 18, color: colors.green500 }} />
            <Typography variant="body2" color={colors.black600} fontSize={12}>
              {label}
            </Typography>
          </Box>
        ))}
      </Box>
    </Box>
  );
};

export default TrustBadges;
