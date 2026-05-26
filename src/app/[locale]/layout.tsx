/* eslint-disable react/no-danger */
import React from 'react';

import { Metadata } from 'next';
import { Locale, NextIntlClientProvider, hasLocale } from 'next-intl';
import { getMessages, getTranslations } from 'next-intl/server';
import { notFound } from 'next/navigation';

import { getLoggedInUser } from '@/actions/auth.actions';
import GoogleAnalyticsConsent from '@/components/GoogleAnalyticsConsent';
import { LocaleType } from '@/config/locales.config';
import { meta } from '@/config/meta';
import { routing } from '@/i18n/routing';
import '@/styles/index.scss';
import { buildAlternateLanguages, getLocalizedJsonLd, localizedUrl } from '@/utils/static/buildMetadata';

import Providers from './providers';

export async function generateMetadata({ params }: { params: Promise<{ locale: Locale }> }): Promise<Metadata> {
  const { locale } = await params;

  const t = await getTranslations({ locale, namespace: 'metadata' });
  // Locale-aware root URL — non-EN locales get `/hr`, `/de`, … so canonical
  // and openGraph point at the actually-rendered page, not the EN root.
  const homeUrl = localizedUrl(locale as LocaleType, '/');

  return {
    metadataBase: new URL(meta.url),
    title: {
      default: t(meta.title),
      template: t(meta.titleTemplate),
    },
    description: t(meta.description),
    alternates: {
      canonical: homeUrl,
      languages: buildAlternateLanguages('/'),
    },
    authors: [{ name: meta.name, url: meta.url }],
    applicationName: meta.name,
    robots: { index: true },
    openGraph: {
      type: 'website',
      url: homeUrl,
      title: { default: t(meta.title), template: t(meta.titleTemplate) },
      description: t(meta.description),
      images: [{ url: `${meta.url}/meta/og-image.png`, width: 1200, height: 630, alt: meta.name }],
    },
    twitter: {
      card: 'summary_large_image',
      title: { default: t(meta.title), template: t(meta.titleTemplate) },
      description: t(meta.description),
      images: [`${meta.url}/meta/og-image.png`],
    },
    icons: {
      icon: '/favicons/favicon.ico',
      shortcut: '/favicons/favicon.ico',
      apple: '/favicons/apple-touch-icon.png',
      other: [
        { rel: 'icon', type: 'image/png', sizes: '32x32', url: '/favicons/favicon-32x32.png' },
        { rel: 'icon', type: 'image/png', sizes: '16x16', url: '/favicons/favicon-16x16.png' },
        { rel: 'mask-icon', url: '/favicons/safari-pinned-tab.svg', color: '#000000' },
      ],
    },
    manifest: '/favicons/site.webmanifest',
    verification: {
      google: 'tFIC79JuxjclDP3qaJy82tGjJETeJ5Zz_BeVNK_vYPQ',
    },
  };
}

interface RootLayoutProps {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}

const RootLayout = async ({ children, params }: RootLayoutProps) => {
  const { locale } = await params;
  const messages = await getMessages();

  if (!hasLocale(routing.locales, locale)) {
    notFound();
  }

  const [localizedJsonLd, user] = await Promise.all([getLocalizedJsonLd(locale as LocaleType), getLoggedInUser()]);

  return (
    <html lang={locale} suppressHydrationWarning>
      <head>
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(localizedJsonLd) }} />
      </head>
      <body suppressHydrationWarning>
        <NextIntlClientProvider messages={messages}>
          <Providers user={user}>{children}</Providers>
        </NextIntlClientProvider>
      </body>
      <GoogleAnalyticsConsent gaId={process.env.NEXT_PUBLIC_BOAT_WS_GAID as string} gAdsId="AW-17979079830" />
    </html>
  );
};

export default RootLayout;
