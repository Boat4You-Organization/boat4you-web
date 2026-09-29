'use client';

import { useEffect } from 'react';

import { AppRouterCacheProvider } from '@mui/material-nextjs/v13-appRouter';
import { ThemeProvider } from '@mui/material/styles';
import { NextIntlClientProvider } from 'next-intl';
import { usePathname } from 'next/navigation';

import theme from '@/styles/themes';
import { reloadForNewDeployment } from '@/utils/static/deploymentSkew';
import ErrorPage from '@/views/ErrorPage';

export default function GlobalError({ error }: { error: Error & { digest?: string } }) {
  const pathname = usePathname();
  const locale = pathname?.split('/')[1] || 'en';

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
