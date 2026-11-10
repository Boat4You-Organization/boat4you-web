'use client';

import { useEffect, useRef, useState } from 'react';

import { Box, Button, Typography } from '@mui/material';
import cx from 'clsx';
import { useTranslations } from 'next-intl';
import { usePathname } from 'next/navigation';

import ModalRoot from '@/components/ModalRoot';
import { Link } from '@/i18n/navigation';
import { setCookieConsent } from '@/lib/cookie-consent';
import { CookieSettings, CookieSettingsConfigArray } from '@/types/cookie.type';
import useToggleState from '@/utils/hooks/useToggleState';

import styles from './CookieConset.module.scss';
import CookieModalContent from './CookieModalContent';

/**
 * The pages the notice links to (privacy policy, terms): there the notice sits at the bottom without the veil, so the
 * visitor can read what they are asked to agree to.
 */
const READABLE_PATH = /^(?:\/[a-z]{2})?\/(?:privacy-policy|terms-and-conditions|press\/privacy)(?:\/|$)/;

const renderPrivacyLink = (chunks: React.ReactNode) => (
  <Link href="/privacy-policy" target="_blank" className={styles.link}>
    {chunks}
  </Link>
);

interface CookieConsentProps {
  showConsent: boolean;
  /** Server HTML / first render: shown unless <html data-cc-consent> (CookieConsentController). */
  beforeHydration?: boolean;
}

const CookieConsent = ({ showConsent, beforeHydration = false }: CookieConsentProps) => {
  const [settings, setSettings] = useState<CookieSettings>({
    essential: true,
    analytics: false,
    marketing: false,
  });
  const [showSettings, toggleShowSettings] = useToggleState();
  const [isProcessing, setIsProcessing] = useState(false);
  const t = useTranslations('cookieConsent');
  const docked = READABLE_PATH.test(usePathname() ?? '');
  const noticeRef = useRef<HTMLDivElement>(null);

  // Keyboard and screen-reader users land in the notice when it appears (review 10.11.2026).
  useEffect(() => {
    if (showConsent && !showSettings && !docked) noticeRef.current?.focus({ preventScroll: true });
  }, [showConsent, showSettings, docked]);

  const handleAcceptAll = () => {
    setIsProcessing(true);
    setCookieConsent({
      essential: true,
      analytics: true,
      marketing: true,
      consentGiven: true,
    });
    setIsProcessing(false);
  };

  const handleRejectAll = () => {
    setIsProcessing(true);
    setCookieConsent({
      essential: true,
      analytics: false,
      marketing: false,
      consentGiven: true,
    });
    setIsProcessing(false);
  };

  const handleSave = () => {
    setIsProcessing(true);
    setCookieConsent({
      essential: settings.essential,
      analytics: settings.analytics,
      marketing: settings.marketing,
      consentGiven: true,
    });
    setIsProcessing(false);
  };

  const handleToggle = (settingKey: keyof CookieSettings) => (event: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = event.target.checked;
    const newSettings: CookieSettings = {
      ...settings,
      [settingKey]: newValue,
    };

    setSettings(newSettings);
    event.stopPropagation();
  };

  const cookieSettingsConfig: CookieSettingsConfigArray = [
    {
      key: 'essential' as const,
      name: t('necessary.title'),
      description: t('necessary.description'),
      // the chat token of the Contact Center widget (browser storage, P3b)
      cookies: t.raw('necessary.cookies') || [],
      required: true,
    },
    {
      key: 'analytics' as const,
      name: t('analytics.title'),
      description: t('analytics.description'),
      cookies: t.raw('analytics.cookies') || [],
      required: false,
    },
    {
      key: 'marketing' as const,
      name: t('marketing.title'),
      description: t('marketing.description'),
      cookies: [],
      required: false,
    },
  ];

  return (
    <>
      {/* The consent notice (Mario 10.11.2026, "kao index.hr i dnevnik.hr"): a dialog in the middle of the page over a
          pale veil, the purposes listed, "Learn more" (the settings dialog, with "Accept only necessary") and "Accept
          and close". It steps aside while the settings dialog is open. */}
      {/* Only in the page while it is shown (and in the server HTML): the Iris widget treats any
          [role=dialog][aria-modal=true] as an open site dialog and would never greet (review 10.11.2026). */}
      {(showConsent || beforeHydration) && (
        <Box
          className={cx(styles.container, {
            [styles.visible]: showConsent && !showSettings,
            [styles.beforeHydration]: beforeHydration,
            [styles.docked]: docked,
          })}
          // The boat page's exit popup waits while the banner is up (lib/exitIntent.ts).
          data-cookie-consent-open={showConsent || undefined}
          // Never quoted in a search result snippet: the notice is in the HTML of every page.
          data-nosnippet=""
          // The layout's <noscript> style hides it when JavaScript is off: it could not be answered.
          data-cc-notice=""
        >
          <div
            ref={noticeRef}
            className={styles.notice}
            role="dialog"
            aria-modal={!docked}
            aria-labelledby="cc-consent-title"
            aria-describedby="cc-consent-text"
            tabIndex={-1}
          >
            <Typography id="cc-consent-title" component="p" className={styles.title}>
              {t('notice.title')}
            </Typography>
            <Typography variant="body2" className={styles.text}>
              {t.rich('notice.policy', { link: renderPrivacyLink })}
            </Typography>
            <Typography id="cc-consent-text" variant="body2" className={styles.text}>
              {t('notice.text')}
            </Typography>
            <Typography component="p" className={styles.purposesTitle}>
              {t('notice.purposesTitle')}
            </Typography>
            <Typography component="p" className={styles.purposes}>
              {t('notice.purposes')}
            </Typography>
            <div className={styles.actions}>
              <Button
                variant="outlined"
                className={cx(styles.button, styles.learnMore)}
                onClick={toggleShowSettings}
                disabled={isProcessing}
              >
                {t('notice.learnMore')}
              </Button>
              <Button
                variant="contained"
                className={cx(styles.button, styles.accept)}
                onClick={handleAcceptAll}
                disabled={isProcessing}
              >
                {t('notice.accept')}
              </Button>
            </div>
          </div>
        </Box>
      )}
      <ModalRoot
        open={showSettings}
        onClose={toggleShowSettings}
        onOpen={toggleShowSettings}
        hideCancelButton
        hideConfirmButton
        hideCloseButton
        hideDivider
        width={630}
      >
        <CookieModalContent
          settings={settings}
          isProcessing={isProcessing}
          cookieSettingsConfig={cookieSettingsConfig}
          showSettings={showSettings}
          handleToggle={handleToggle}
          handleAcceptAll={handleAcceptAll}
          handleRejectAll={handleRejectAll}
          handleSave={handleSave}
          onClose={toggleShowSettings}
        />
      </ModalRoot>
    </>
  );
};

export default CookieConsent;
