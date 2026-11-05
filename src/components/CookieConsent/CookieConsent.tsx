'use client';

import { useState } from 'react';

import { Box, Button, Stack, Typography } from '@mui/material';
import cx from 'clsx';
import { useTranslations } from 'next-intl';
import Image from 'next/image';

import ModalRoot from '@/components/ModalRoot';
import Settings from '@/components/SvgIcons/Settings';
import { setCookieConsent } from '@/lib/cookie-consent';
import colors from '@/styles/themes/colors';
import { CookieSettings, CookieSettingsConfigArray } from '@/types/cookie.type';
import useToggleState from '@/utils/hooks/useToggleState';

import styles from './CookieConset.module.scss';
import CookieModalContent from './CookieModalContent';

interface CookieConsentProps {
  showConsent: boolean;
}

const CookieConsent = ({ showConsent }: CookieConsentProps) => {
  const [settings, setSettings] = useState<CookieSettings>({
    essential: true,
    analytics: false,
    marketing: false,
  });
  const [showSettings, toggleShowSettings] = useToggleState();
  const [isProcessing, setIsProcessing] = useState(false);
  const t = useTranslations('cookieConsent');

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

  const handleManageOrSave = () => {
    if (showSettings) {
      handleSave();
    } else {
      toggleShowSettings();
    }
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
      <Box
        className={cx(styles.container, { [styles.visible]: showConsent })}
        // The boat page's exit popup waits while the banner is up (lib/exitIntent.ts).
        data-cookie-consent-open={showConsent || undefined}
      >
        <Image
          // 386 x 260, twice the 193 x 130 box (15 KB). The 1214 x 817 original (83 KB) was sent as it is: the
          // image loader resizes only yacht photos (utils/static/bunnyImageLoader.js), `quality` does nothing
          // for a file from public/. Low fetch priority so the banner art never competes with the page's
          // largest paint. A changed drawing gets a new file name: /images is cached for a day.
          src="/images/cookies-386.webp"
          // Decorative, beside the banner's own title (it read "cookies" on every locale).
          alt=""
          width={193}
          height={130}
          className={styles.image}
          fetchPriority="low"
        />
        <Typography component="p" variant="h3" fontWeight={800} fontStyle="italic" color={colors.blue500}>
          {t('title')}
        </Typography>
        <Typography variant="body1" color={colors.black500} className={styles.text}>
          {t('description')}
        </Typography>
        <Stack direction="column" mt={4} gap={1.5} width="100%">
          <Button size="large" onClick={handleAcceptAll} disabled={isProcessing} fullWidth>
            {t('buttons.accept')}
          </Button>
          <Button size="large" color="secondary" onClick={handleRejectAll} disabled={isProcessing} fullWidth>
            {t('buttons.reject')}
          </Button>
          <Button
            size="large"
            variant="outlinedSecondary"
            onClick={handleManageOrSave}
            disabled={isProcessing}
            fullWidth
            startIcon={<Settings size={20} />}
          >
            {t('buttons.manage')}
          </Button>
        </Stack>
      </Box>
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
