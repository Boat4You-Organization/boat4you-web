'use client';

import React, { PropsWithChildren } from 'react';

import { AppRouterCacheProvider } from '@mui/material-nextjs/v13-appRouter';
import { ThemeProvider } from '@mui/material/styles';

import CookieConsentController from '@/components/CookieConsentController';
import Toast from '@/components/Toast';
import UserSync from '@/components/UserSync';
import { UserModel } from '@/models/user.model';
import theme from '@/styles/themes';
import { AuthModalProvider } from '@/utils/context/AuthModalContext';

interface ProvidersProps extends PropsWithChildren {
  user: UserModel | null;
}

const Providers = ({ children, user }: ProvidersProps) => (
  <AppRouterCacheProvider>
    <ThemeProvider theme={theme}>
      <AuthModalProvider>
        <UserSync user={user} />
        {children}
        <Toast />
        <CookieConsentController />
      </AuthModalProvider>
    </ThemeProvider>
  </AppRouterCacheProvider>
);

export default Providers;
