import { Box, Typography } from '@mui/material';
import { useTranslations } from 'next-intl';

import AssuranceBadges from '@/components/AssuranceBadges';
import colors from '@/styles/themes/colors';

import styles from './FooterBottomBar.module.scss';

const FooterBottomBar = () => {
  const t = useTranslations('common');

  return (
    <Box className={styles.footerBottomBar}>
      <Typography variant="body2" color={colors.black600} sx={{ whiteSpace: 'nowrap' }}>
        © {new Date().getFullYear()} boat4you. {t('allRightsReserved')}
      </Typography>
      {/* Trust strip sits in-line with the copyright on desktop (right-aligned),
          wraps below it on mobile. Compact variant has no chrome of its own,
          so it reads as a horizontal continuation of the copyright row. */}
      <AssuranceBadges variant="footer" />
    </Box>
  );
};

export default FooterBottomBar;
