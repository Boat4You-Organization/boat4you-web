'use client';

import { AppRouterCacheProvider } from '@mui/material-nextjs/v13-appRouter';
import { ThemeProvider } from '@mui/material/styles';
import { NextIntlClientProvider, useLocale } from 'next-intl';

import theme from '@/styles/themes';
import ErrorPage from '@/views/ErrorPage';

export default function Error() {
  const locale = useLocale();

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
