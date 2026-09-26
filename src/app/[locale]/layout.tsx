/* eslint-disable react/no-danger */
import React from 'react';
import { preload } from 'react-dom';

import { Metadata, Viewport } from 'next';
import { Locale, NextIntlClientProvider, hasLocale } from 'next-intl';
import { getMessages, getTranslations, setRequestLocale } from 'next-intl/server';
import { notFound } from 'next/navigation';
import Script from 'next/script';

import ChatWidget from '@/components/ChatWidget';
import GoogleAnalyticsConsent from '@/components/GoogleAnalyticsConsent';
import InstallPrompt from '@/components/InstallPrompt';
import ServiceWorkerRegister from '@/components/ServiceWorkerRegister';
import { LocaleType } from '@/config/locales.config';
import { meta } from '@/config/meta';
import { CLIENT_NAMESPACES, pickMessages } from '@/i18n/clientMessages';
import { routing } from '@/i18n/routing';
import '@/styles/index.scss';
import { getSiteStatsWithin } from '@/utils/server/siteStats';
import { buildAlternateLanguages, getLocalizedJsonLd, localizedUrl } from '@/utils/static/buildMetadata';

import Providers from './providers';

/** How long the layout waits for the catalogue counts (meta + JSON-LD description). */
const SITE_STATS_LAYOUT_BUDGET_MS = 1500;

export async function generateMetadata({ params }: { params: Promise<{ locale: Locale }> }): Promise<Metadata> {
  const { locale } = await params;

  const t = await getTranslations({ locale, namespace: 'metadata' });
  // Locale-aware root URL — non-EN locales get `/hr`, `/de`, … so canonical
  // and openGraph point at the actually-rendered page, not the EN root.
  const homeUrl = localizedUrl(locale as LocaleType, '/');
  // Country count from the one count source (siteStats.ts, shared with the
  // JSON-LD, /about-us and llms.txt); the number-free text when it is not
  // available within the layout budget.
  const siteStats = await getSiteStatsWithin(SITE_STATS_LAYOUT_BUDGET_MS);
  const description = siteStats
    ? t('metadata.base.descriptionWithCount', { countries: siteStats.display.countries })
    : t(meta.description);

  return {
    metadataBase: new URL(meta.url),
    title: {
      default: t(meta.title),
      template: t(meta.titleTemplate),
    },
    description,
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
      description,
      images: [{ url: `${meta.url}/meta/og-image.png`, width: 1200, height: 630, alt: meta.name }],
    },
    twitter: {
      card: 'summary_large_image',
      title: { default: t(meta.title), template: t(meta.titleTemplate) },
      description,
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
    manifest: '/manifest.webmanifest',
    appleWebApp: {
      capable: true,
      statusBarStyle: 'default',
      title: 'Boat4You',
    },
    verification: {
      google: 'tFIC79JuxjclDP3qaJy82tGjJETeJ5Zz_BeVNK_vYPQ',
    },
  };
}

export const viewport: Viewport = {
  themeColor: '#0a2540',
};

interface RootLayoutProps {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}

// `generateStaticParams` deliberately omitted at this layout: it would
// cascade to every [locale] child route (incl. ones that legitimately
// need useSearchParams without Suspense) and break the build. Pages that
// want ISR/SSG opt in individually with their own static params +
// setRequestLocale (see (root)/page.tsx).

const RootLayout = async ({ children, params }: RootLayoutProps) => {
  const { locale } = await params;

  if (!hasLocale(routing.locales, locale)) {
    notFound();
  }

  setRequestLocale(locale);

  // Only client-consumed namespaces go to the browser (the full catalogue
  // is 2.2 MB and was serialized into every page). Itinerary pages add the
  // per-country itinerary namespace(s) they need (ItineraryMessages).
  const messages = pickMessages(await getMessages(), CLIENT_NAMESPACES);
  // Never block every page on the API: once cached this is instant; on a
  // cold cache or a slow API the JSON-LD uses its static description.
  const siteStats = await getSiteStatsWithin(SITE_STATS_LAYOUT_BUDGET_MS);
  const localizedJsonLd = await getLocalizedJsonLd(locale as LocaleType, siteStats?.display);

  // Hero H1 uses Raleway 500 (regular hero text) + 800 italic for the CTA
  // span. Preloading those two weights eliminates the 3s FOIT window PSI
  // flagged. Through ReactDOM.preload: React 19 hoists a JSX <link
  // rel="preload"> as a resource AND kept the element, so every page sent
  // each font preload twice (audit B50).
  preload('/fonts/Raleway/Raleway-Medium.woff2', { as: 'font', type: 'font/woff2', crossOrigin: '' });
  preload('/fonts/Raleway/Raleway-ExtraBoldItalic.woff2', { as: 'font', type: 'font/woff2', crossOrigin: '' });

  return (
    <html lang={locale} suppressHydrationWarning>
      <head>
        {/* Google Consent Mode v2 — set the denied-by-default consent state
            BEFORE gtag.js loads (GoogleAnalyticsConsent loads it eagerly so
            Google can detect the tag). Until the visitor accepts, the tag sets
            no cookies and tracks nothing; analytics_storage follows the
            analytics choice, ad_* follows marketing. A returning visitor who
            already consented starts granted (read synchronously from the
            consent cookie). */}
        <Script
          id="gtag-consent-default"
          strategy="beforeInteractive"
          dangerouslySetInnerHTML={{
            __html:
              "window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments);}var a='denied',m='denied';try{var c=document.cookie.match(/(?:^|; )boat4you_cookie_consent=([^;]*)/);if(c){var o=JSON.parse(decodeURIComponent(c[1]));if(o&&o.consentGiven){if(o.analytics)a='granted';if(o.marketing)m='granted';}}}catch(e){}gtag('consent','default',{analytics_storage:a,ad_storage:m,ad_user_data:m,ad_personalization:m,functionality_storage:'granted',security_storage:'granted'});",
          }}
        />
        {/* Pre-resolve DNS + TLS to the two hosts every page fetches from
            (backend API + Bunny image CDN). PSI flags "Avoid multiple
            page redirects" + TTFB win on cold-cache mobile. preconnect is
            cheap when the host actually receives traffic. */}
        <link rel="preconnect" href="https://api.boat4you.com" crossOrigin="" />
        <link rel="preconnect" href="https://boat4you.b-cdn.net" crossOrigin="" />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(localizedJsonLd) }} />
      </head>
      <body suppressHydrationWarning>
        <NextIntlClientProvider messages={messages}>
          <Providers>
            {children}
            <ChatWidget />
          </Providers>
          {/* InstallPrompt uses useTranslations → must be INSIDE the provider. */}
          <InstallPrompt />
        </NextIntlClientProvider>
        <ServiceWorkerRegister />
      </body>
      <GoogleAnalyticsConsent
        gaId={process.env.NEXT_PUBLIC_BOAT_WS_GAID as string}
        gAdsIds={['AW-17979079830', 'AW-11060948992']}
      />
    </html>
  );
};

export default RootLayout;
