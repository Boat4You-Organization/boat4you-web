'use client';

import { useTranslations } from 'next-intl';

/**
 * Footer "Cookie settings" link — re-opens the consent banner so visitors can
 * withdraw or change cookie consent at any time (GDPR Art. 7(3): withdrawing
 * consent must be as easy as giving it). Dispatches an event the
 * CookieConsentController listens for. Reuses the banner's existing
 * "Cookies Settings" label, so no new translations are needed. A button styled
 * by the footer (className) to read as a link in the Legal column.
 */
const CookieSettingsButton = ({ className }: { className?: string }) => {
  const t = useTranslations('cookieConsent');

  const handleClick = () => {
    window.dispatchEvent(new CustomEvent('openCookieSettings'));
  };

  return (
    <button type="button" onClick={handleClick} className={className}>
      {t('buttons.manage')}
    </button>
  );
};

export default CookieSettingsButton;
