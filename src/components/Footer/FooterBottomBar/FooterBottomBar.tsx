import { Box, Typography } from '@mui/material';
import { useTranslations } from 'next-intl';

import AssuranceBadges from '@/components/AssuranceBadges';
import CookieSettingsButton from '@/components/Footer/CookieSettingsButton';
import colors from '@/styles/themes/colors';

import styles from './FooterBottomBar.module.scss';

const FooterBottomBar = () => {
  const t = useTranslations('common');

  return (
    <Box className={styles.footerBottomBar}>
      <Box>
        <Typography variant="body2" color={colors.black600} sx={{ whiteSpace: 'nowrap' }}>
          © {new Date().getFullYear()} boat4you. {t('allRightsReserved')}
        </Typography>
        {/* Impressum / company identity (audit C2): the legal entity behind the
            Boat4you brand, surfaced on every page. Language-neutral registration
            data (company name / address / OIB), so it isn't run through i18n. */}
        <Typography variant="caption" component="p" color={colors.black600} sx={{ mt: 0.5, opacity: 0.75 }}>
          Cusmanich d.o.o. · Vrboran 37, 21000 Split, Croatia · OIB 87394862517
        </Typography>
        {/* Cookie-consent withdrawal (audit C4) — re-opens the consent UI; GDPR Art. 7(3). */}
        <Box sx={{ mt: 0.5 }}>
          <CookieSettingsButton />
        </Box>
      </Box>
      {/* Trust strip sits in-line with the copyright on desktop (right-aligned),
          wraps below it on mobile. Compact variant has no chrome of its own,
          so it reads as a horizontal continuation of the copyright row. */}
      <AssuranceBadges variant="footer" />
    </Box>
  );
};

export default FooterBottomBar;
