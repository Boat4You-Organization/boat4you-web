'use client';

import { Typography } from '@mui/material';
import { useTranslations } from 'next-intl';

import colors from '@/styles/themes/colors';

/**
 * Footer "Cookie settings" link — re-opens the consent banner so visitors can
 * withdraw or change cookie consent at any time (GDPR Art. 7(3): withdrawing
 * consent must be as easy as giving it). Dispatches an event the
 * CookieConsentController listens for. Reuses the banner's existing
 * "Cookies Settings" label, so no new translations are needed.
 */
const CookieSettingsButton = () => {
  const t = useTranslations('cookieConsent');

  const handleClick = () => {
    window.dispatchEvent(new CustomEvent('openCookieSettings'));
  };

  return (
    <Typography
      component="button"
      type="button"
      onClick={handleClick}
      variant="body2"
      color={colors.black600}
      sx={{
        background: 'none',
        border: 'none',
        padding: 0,
        cursor: 'pointer',
        textDecoration: 'underline',
        font: 'inherit',
      }}
    >
      {t('buttons.manage')}
    </Typography>
  );
};

export default CookieSettingsButton;
