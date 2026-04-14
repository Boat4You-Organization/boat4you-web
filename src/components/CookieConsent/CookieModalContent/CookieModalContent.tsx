import { CloseRounded } from '@mui/icons-material';
import { Box, Button, Collapse, IconButton, Stack, Typography } from '@mui/material';
import { useTranslations } from 'next-intl';
import Image from 'next/image';
import Link from 'next/link';

import CookieAccordion from '@/components/CookieConsent/CookieAccordion';
import CookieList from '@/components/CookieConsent/CookieList';
import Save from '@/components/SvgIcons/Save';
import colors from '@/styles/themes/colors';
import { CookieSettings, CookieSettingsConfigArray } from '@/types/cookie.type';

import styles from './CookieModalContent.module.scss';

interface CookieModalContentProps {
  settings: CookieSettings;
  isProcessing: boolean;
  showSettings: boolean;
  cookieSettingsConfig: CookieSettingsConfigArray;
  handleToggle: (settingKey: keyof CookieSettings) => (event: React.ChangeEvent<HTMLInputElement>) => void;
  handleAcceptAll: () => void;
  handleRejectAll: () => void;
  handleSave: () => void;
  onClose: () => void;
}

const renderCookiePolicyLink = (chunks: React.ReactNode) => (
  <Link href="/privacy-policy" target="_blank" className={styles.link}>
    {chunks}
  </Link>
);

const CookieModalContent = ({
  settings,
  isProcessing,
  cookieSettingsConfig,
  showSettings,
  handleToggle,
  handleAcceptAll,
  handleRejectAll,
  handleSave,
  onClose,
}: CookieModalContentProps) => {
  const t = useTranslations('cookieConsent');

  const handleAccept = () => {
    handleAcceptAll();
    onClose();
  };

  const handleReject = () => {
    handleRejectAll();
    onClose();
  };

  const handleSaveSettings = () => {
    handleSave();
    onClose();
  };

  return (
    <Stack className={styles.container}>
      <Stack direction="column" pb={3}>
        <Stack direction="row" justifyContent="space-between" alignItems="center">
          <Stack direction="row" spacing={1} alignItems="center">
            <Typography component="p" variant="h3" fontStyle="italic" fontWeight={700}>
              {t('mainTitle')}
            </Typography>
            <Box className={styles.imageWrapper}>
              <Image src="/images/cookies.webp" alt="cookies" fill sizes="auto" className={styles.image} />
            </Box>
          </Stack>
          <IconButton size="large" onClick={onClose} sx={{ color: colors.black400 }}>
            <CloseRounded />
          </IconButton>
        </Stack>
        <Typography variant="body2">
          {t.rich('mainDescription', {
            link: renderCookiePolicyLink,
          })}
        </Typography>
      </Stack>
      <Collapse in={showSettings} timeout={300} unmountOnExit className={styles.wrapper}>
        <Stack direction="column" gap={2}>
          {cookieSettingsConfig.map(item => (
            <CookieAccordion
              title={item.name}
              checked={settings[item.key]}
              onChange={handleToggle(item.key)}
              disabled={item.required}
              key={item.key}
            >
              <CookieList description={item.description} cookies={item.cookies} />
            </CookieAccordion>
          ))}
        </Stack>
      </Collapse>
      <Stack direction={{ xs: 'column', md: 'row' }} pt={3} gap={1} width="100%">
        <Button size="medium" onClick={handleAccept} disabled={isProcessing} fullWidth>
          {t('buttons.accept')}
        </Button>
        <Button size="medium" color="secondary" onClick={handleReject} disabled={isProcessing} fullWidth>
          {t('buttons.reject')}
        </Button>
        <Button
          size="medium"
          variant="outlinedSecondary"
          onClick={handleSaveSettings}
          disabled={isProcessing}
          fullWidth
          startIcon={<Save size={20} />}
        >
          {t('buttons.save')}
        </Button>
      </Stack>
    </Stack>
  );
};

export default CookieModalContent;
