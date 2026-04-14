'use client';

import { AppRouterCacheProvider } from '@mui/material-nextjs/v13-appRouter';
import { ThemeProvider } from '@mui/material/styles';
import { NextIntlClientProvider } from 'next-intl';
import { usePathname } from 'next/navigation';

import theme from '@/styles/themes';
import ErrorPage from '@/views/ErrorPage';

export default function GlobalError() {
  const pathname = usePathname();
  const locale = pathname?.split('/')[1] || 'en';

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
