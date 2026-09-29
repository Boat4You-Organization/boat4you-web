'use client';

import { useEffect } from 'react';

import { AppRouterCacheProvider } from '@mui/material-nextjs/v13-appRouter';
import { ThemeProvider } from '@mui/material/styles';
import { NextIntlClientProvider, useLocale } from 'next-intl';

import theme from '@/styles/themes';
import { reloadForNewDeployment } from '@/utils/static/deploymentSkew';
import ErrorPage from '@/views/ErrorPage';

export default function Error({ error }: { error: Error & { digest?: string } }) {
  const locale = useLocale();

  // A stale tab after a deploy: load the new build instead of an error page.
  useEffect(() => {
    reloadForNewDeployment(error);
  }, [error]);

  return (
    <AppRouterCacheProvider>
      <ThemeProvider theme={theme}>
        <NextIntlClientProvider locale={locale}>
          <ErrorPage />
        </NextIntlClientProvider>
      </ThemeProvider>
    </AppRouterCacheProvider>
  );
}
