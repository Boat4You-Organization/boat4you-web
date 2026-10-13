import React from 'react';

import { Metadata } from 'next';
import { NextIntlClientProvider, hasLocale } from 'next-intl';
import { getMessages, getTranslations, setRequestLocale } from 'next-intl/server';
import { notFound } from 'next/navigation';

import { CLIENT_NAMESPACES, PAY_NAMESPACES, pickMessages } from '@/i18n/clientMessages';
import { routing } from '@/i18n/routing';
import { isPayLinkKey } from '@/utils/server/payLinkKey';

interface PayLayoutProps {
  children: React.ReactNode;
  params: Promise<{ locale: string; key: string }>;
}

/**
 * Secret card-payment link printed in contracts (/[locale/]pay/<key>). There
 * is no bare /pay route, and a key that is not in PAY_LINK_KEYS is the same
 * 404 as any missing page — checked here, in the metadata and in each page
 * (layouts and pages render in parallel). Never indexed, never in a sitemap,
 * not linked from anywhere, no analytics (GoogleAnalyticsConsent), and sent
 * with `Cache-Control: private, no-store` + `Referrer-Policy: no-referrer`
 * (next.config.js). The metadata here covers the form, success and failed
 * pages alike.
 */
export async function generateMetadata({ params }: Omit<PayLayoutProps, 'children'>): Promise<Metadata> {
  const { locale, key } = await params;

  if (!hasLocale(routing.locales, locale) || !isPayLinkKey(key)) notFound();

  const t = await getTranslations({ locale, namespace: 'pay' });

  return {
    title: t('meta.title'),
    robots: {
      index: false,
      follow: false,
      nocache: true,
      noarchive: true,
      googleBot: { index: false, follow: false, noarchive: true },
    },
    referrer: 'no-referrer',
    // The root layout's canonical / hreflang / og:url point at the homepage;
    // a private one-off page carries none of them.
    alternates: {},
    openGraph: null,
  };
}

// The form is a client component; its copy is not in the site-wide client
// bundle, so this segment provides it. A nested provider REPLACES messages
// (no merge) — pass the client set too (same as /review).
const PayLayout = async ({ children, params }: PayLayoutProps) => {
  const { locale, key } = await params;

  if (!isPayLinkKey(key)) notFound();

  setRequestLocale(locale);

  const messages = await getMessages();

  return (
    <NextIntlClientProvider messages={pickMessages(messages, [...CLIENT_NAMESPACES, ...PAY_NAMESPACES])}>
      {children}
    </NextIntlClientProvider>
  );
};

export default PayLayout;
