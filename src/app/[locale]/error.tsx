'use client';

import { useEffect } from 'react';

import { AppRouterCacheProvider } from '@mui/material-nextjs/v13-appRouter';
import { ThemeProvider } from '@mui/material/styles';
import { NextIntlClientProvider, useLocale } from 'next-intl';

import theme from '@/styles/themes';
import { reloadForNewDeployment } from '@/utils/static/deploymentSkew';
import { reportErrorToRecorder } from '@/utils/static/recorderError';
import ErrorPage from '@/views/ErrorPage';

export default function Error({ error }: { error: Error & { digest?: string } }) {
  const locale = useLocale();

  // The cause reaches the visit's recording in the Contact Center; a stale tab after a deploy loads the new build
  // instead of an error page.
  useEffect(() => {
    reportErrorToRecorder(error);
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
