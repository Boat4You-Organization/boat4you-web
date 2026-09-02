import React from 'react';

import { NextIntlClientProvider } from 'next-intl';
import { getMessages, setRequestLocale } from 'next-intl/server';

import { CLIENT_NAMESPACES, ITINERARY_NAMESPACES, pickMessages } from '@/i18n/clientMessages';

interface ItinerariesLayoutProps {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}

// The root layout deliberately withholds the ~2 MB per-country itinerary
// namespaces from the client. Itinerary views (hub, area, route, builder's
// useMessages()) read them client-side, so this segment re-provides them.
// A nested provider REPLACES messages (no merge) — pass the client set too.
const ItinerariesLayout = async ({ children, params }: ItinerariesLayoutProps) => {
  const { locale } = await params;

  setRequestLocale(locale);

  const messages = await getMessages();

  return (
    <NextIntlClientProvider messages={pickMessages(messages, [...CLIENT_NAMESPACES, ...ITINERARY_NAMESPACES])}>
      {children}
    </NextIntlClientProvider>
  );
};

export default ItinerariesLayout;
