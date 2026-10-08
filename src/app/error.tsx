'use client';

import { useEffect } from 'react';

import { AppRouterCacheProvider } from '@mui/material-nextjs/v13-appRouter';
import { ThemeProvider } from '@mui/material/styles';
import { NextIntlClientProvider, hasLocale } from 'next-intl';
import { usePathname } from 'next/navigation';

import { routing } from '@/i18n/routing';
import theme from '@/styles/themes';
import { reloadForNewDeployment } from '@/utils/static/deploymentSkew';
import ErrorPage from '@/views/ErrorPage';

export default function GlobalError({ error }: { error: Error & { digest?: string } }) {
  const pathname = usePathname();
  // The first segment only when it is a locale: an EN path ("/boat/…") has no
  // prefix, and "boat" as the locale sent the error page's home link to "/boat".
  const segment = pathname?.split('/')[1];
  const locale = hasLocale(routing.locales, segment) ? segment : routing.defaultLocale;

  useEffect(() => {
    reloadForNewDeployment(error);
  }, [error]);

  return (
    <html lang={locale}>
      <body>
        <AppRouterCacheProvider>
          <ThemeProvider theme={theme}>
            <NextIntlClientProvider locale={locale}>
              <ErrorPage />
            </NextIntlClientProvider>
          </ThemeProvider>
        </AppRouterCacheProvider>
      </body>
    </html>
  );
}
