'use client';

import React, { PropsWithChildren } from 'react';

import { AppRouterCacheProvider } from '@mui/material-nextjs/v13-appRouter';
import { ThemeProvider } from '@mui/material/styles';

import CookieConsentController from '@/components/CookieConsentController';
import Toast from '@/components/Toast';
import UserSync from '@/components/UserSync';
import theme from '@/styles/themes';
import { AuthModalProvider } from '@/utils/context/AuthModalContext';

// UserSync now self-fetches /api/me; no `user` prop needed from the
// server layout (which lets the layout drop cookies() and stay static).
const Providers = ({ children }: PropsWithChildren) => (
  <AppRouterCacheProvider>
    <ThemeProvider theme={theme}>
      <AuthModalProvider>
        <UserSync />
        {children}
        <Toast />
        <CookieConsentController />
      </AuthModalProvider>
    </ThemeProvider>
  </AppRouterCacheProvider>
);

export default Providers;
