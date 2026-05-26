import React from 'react';

import { LockOutlined, Sailing, SupportAgent, VerifiedUser } from '@mui/icons-material';
import { Box, Typography } from '@mui/material';
import { useTranslations } from 'next-intl';

import colors from '@/styles/themes/colors';

import styles from './AssuranceBadges.module.scss';

type Variant = 'card' | 'footer';

interface AssuranceBadgesProps {
  /**
   * Visual treatment.
   * - `card` (default): white card with border and padding — matches the
   *   booking-flow trust strip below the form.
   * - `footer`: compact, transparent background, sized to sit alongside
   *   site-footer link columns without competing visually for attention.
   */
  variant?: Variant;
}

/**
 * Reassurance row showing the four platform commitments with icons. Same
 * four messages everywhere — single source of truth so a copy/icon change
 * propagates to both the booking-flow strip and the site footer.
 */
const AssuranceBadges = ({ variant = 'card' }: AssuranceBadgesProps) => {
  const t = useTranslations('common');

  const items = [
    { Icon: LockOutlined, label: t('assuranceSSL') },
    { Icon: SupportAgent, label: t('assurance247') },
    { Icon: VerifiedUser, label: t('assuranceVerified') },
    { Icon: Sailing, label: t('assuranceNoHidden') },
  ];

  const isFooter = variant === 'footer';
  const iconSize = isFooter ? 16 : 18;
  const fontSize = isFooter ? 11 : 12;

  return (
    <Box className={isFooter ? styles.footerRow : styles.cardRow}>
      {items.map(({ Icon, label }) => (
        <Box key={label} className={styles.item}>
          <Icon sx={{ fontSize: iconSize, color: colors.blue500 }} />
          <Typography variant="body2" color={colors.black600} fontSize={fontSize} fontWeight={isFooter ? 500 : 400}>
            {label}
          </Typography>
        </Box>
      ))}
    </Box>
  );
};

export default AssuranceBadges;
