'use client';

import { Suspense } from 'react';

import { AppBar, Button, Container, Divider, Drawer, IconButton, Stack } from '@mui/material';
import { useTranslations } from 'next-intl';
import Link from 'next/link';

import HamburgerMenu from '@/components/HamburgerMenu';
import Favorites from '@/components/Header/Favorites';
import NavigationMobile from '@/components/NavigationMobile';
import ProfileDropdown from '@/components/ProfileDropdown';
import Logo from '@/components/SvgIcons/Logo';
import colors from '@/styles/themes/colors';
import { useAuthModal } from '@/utils/context/AuthModalContext';
import useToggleState from '@/utils/hooks/useToggleState';
import { useUserStore } from '@/valtio/user/user.store';

import styles from './Header.module.scss';
import LanguageCurrency from './LanguageCurrency';
import Navigation from './Navigation';

const Header = () => {
  const [navigationOpen, toggleNavigation] = useToggleState();
  const { toggleLoginModal } = useAuthModal();
  // Read user from client store (hydrated by UserSync via /api/me on mount)
  // so the root layout doesn't have to call cookies() — that single change
  // unlocks static rendering of (root) and a real CDN-level cache.
  const { user } = useUserStore();
  const { language, currency, id } = user || {};
  const t = useTranslations('common');

  return (
    <>
      <AppBar elevation={0} classes={{ root: styles.root }} className={styles.container}>
        <Container disableGutters maxWidth="xl" className={styles.header}>
          <Link href="/" aria-label={t('home')}>
            <Logo />
          </Link>
          <Stack direction="row" alignItems="center" gap={2} className={styles.desktopContent}>
            <Navigation />
            <Divider orientation="vertical" variant="middle" flexItem sx={{ color: colors.black200, height: 24 }} />
            <Stack direction="row" gap={1}>
              <Favorites />
              {/* useSearchParams() inside LanguageCurrency bails out of
                  prerender unless wrapped — Suspense lets the home stay
                  SSG/ISR while the picker hydrates client-side. */}
              <Suspense fallback={null}>
                <LanguageCurrency language={language} currency={currency} id={id} />
              </Suspense>
            </Stack>
            {user ? (
              <ProfileDropdown user={user} />
            ) : (
              <Button color="secondary" onClick={toggleLoginModal}>
                {t('signIn')}
              </Button>
            )}
          </Stack>
          <Stack direction="row" alignItems="center" gap={{ xs: 1, md: 2 }} className={styles.mobileContent}>
            {user ? (
              <ProfileDropdown user={user} />
            ) : (
              <Button color="secondary" size="large" onClick={toggleLoginModal}>
                {t('signIn')}
              </Button>
            )}
            <IconButton size="large" aria-label="Open navigation drawer" onClick={toggleNavigation}>
              <HamburgerMenu open={navigationOpen} />
            </IconButton>
          </Stack>
        </Container>
      </AppBar>
      <Drawer
        open={navigationOpen}
        onClose={toggleNavigation}
        classes={{ paper: styles.paper }}
        className={styles.drawer}
        keepMounted
        anchor="right"
      >
        <NavigationMobile onNavigationToggle={toggleNavigation} />
      </Drawer>
    </>
  );
};

export default Header;
