import { useState } from 'react';

import { Box, Button, Divider, List, Stack, Typography } from '@mui/material';
import { useTranslations } from 'next-intl';

import { logout } from '@/actions/auth.actions';
import navigationMobile from '@/config/navigationMobile.config';
import { useRouter } from '@/i18n/navigation';
import { UserModel } from '@/models/user.model';
import { YachtModelLocalStorage } from '@/models/yacht.model';
import { useLocalStorage } from '@/utils/hooks/useLocalStorage';
import { resetAuthModals } from '@/valtio/auth/auth.actions';
import { resetToast, showToast } from '@/valtio/global/global.actions';
import { clearUser } from '@/valtio/user/user.actions';

import styles from './NavigationMobile.module.scss';
import NavigationMobileItem from './NavigationMobileItem';
import CurrencyModal from './partials/CurrencyModal';
import FavoritesModal from './partials/FavoritesModal';
import LanguageModal from './partials/LanguageModal';

interface NavigationMobileProps {
  onNavigationToggle: () => void;
  user?: UserModel | null;
}

const NavigationMobile = ({ user, onNavigationToggle }: NavigationMobileProps) => {
  const [favorites] = useLocalStorage<YachtModelLocalStorage[]>('favorites', []);
  const [favoritesModalOpen, setFavoritesModalOpen] = useState<boolean>(false);
  const [languageModalOpen, setLanguageModalOpen] = useState<boolean>(false);
  const [currencyModalOpen, setCurrencyModalOpen] = useState<boolean>(false);
  const [isPending, setIsPending] = useState(false);
  const router = useRouter();
  const t = useTranslations('navigation.navigationMobile');
  const tCommon = useTranslations('common');

  const favoritesCount = (favorites || []).length;

  const handleFavoritesClick = () => {
    setFavoritesModalOpen(true);
  };

  const handleLanguageClick = () => {
    setLanguageModalOpen(true);
  };

  const handleCurrencyClick = () => {
    setCurrencyModalOpen(true);
  };

  const handleLogout = async () => {
    setIsPending(true);

    resetToast();
    resetAuthModals();
    clearUser();

    try {
      await logout();
      window.location.href = '/';
      router.refresh();
    } catch (error) {
      showToast({ status: 'error', text: tCommon('logoutFailed') });
      setIsPending(false);
    }
  };

  const getClickHandler = (text: string) => {
    switch (text) {
      case 'preferences.favorites':
        return handleFavoritesClick;
      case 'preferences.language':
        return handleLanguageClick;
      case 'preferences.currency':
        return handleCurrencyClick;
      default:
        return undefined;
    }
  };

  const getBadgeCount = (text: string) => {
    if (text === 'preferences.favorites') {
      return favoritesCount;
    }

    return undefined;
  };

  return (
    <>
      <FavoritesModal
        isOpen={favoritesModalOpen}
        onOpen={() => setFavoritesModalOpen(true)}
        onClose={() => setFavoritesModalOpen(false)}
      />
      <LanguageModal
        isOpen={languageModalOpen}
        onOpen={() => setLanguageModalOpen(true)}
        onClose={() => setLanguageModalOpen(false)}
        user={user || undefined}
      />
      <CurrencyModal
        isOpen={currencyModalOpen}
        onOpen={() => setCurrencyModalOpen(true)}
        onClose={() => setCurrencyModalOpen(false)}
        user={user || undefined}
      />
      <Box component="nav" className={styles.container}>
        <List className={`${styles.list} ${!user ? styles.listLoggedOut : ''}`}>
          {navigationMobile.map((item, index) => (
            <Stack key={item.title}>
              <Typography variant="h4" component="p" fontWeight={700} mb={2} px={2}>
                {t(item.title)}
              </Typography>
              {item.links.map(link => (
                <NavigationMobileItem
                  key={link.text}
                  {...link}
                  onClick={getClickHandler(link.text)}
                  onNavigationToggle={onNavigationToggle}
                  badgeCount={getBadgeCount(link.text)}
                />
              ))}
              {index < navigationMobile.length - 1 && (
                <Divider
                  sx={{
                    '&.MuiDivider-root': {
                      mx: 2,
                    },
                  }}
                />
              )}
            </Stack>
          ))}
          {user && (
            <>
              <Divider
                sx={{
                  '&.MuiDivider-root': {
                    mx: 2,
                  },
                }}
              />
              <Typography variant="h4" component="h2" fontWeight={700} mb={2} px={2}>
                {t('profile.title')}
              </Typography>
              <NavigationMobileItem
                text={`${user.name} ${user.surname}`}
                href="/my-profile"
                onNavigationToggle={onNavigationToggle}
              />
            </>
          )}
        </List>
        {user && (
          <Box className={styles.buttonWrapper}>
            <Button
              color="error"
              size="large"
              fullWidth
              className={styles.button}
              disabled={isPending}
              onClick={handleLogout}
            >
              {isPending ? tCommon('loggingOut') : tCommon('logOut')}{' '}
            </Button>
          </Box>
        )}
      </Box>
    </>
  );
};

export default NavigationMobile;
