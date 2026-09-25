import React from 'react';

import { type Messages, NextIntlClientProvider } from 'next-intl';
import { getMessages } from 'next-intl/server';

import { CLIENT_NAMESPACES, pickMessages } from '@/i18n/clientMessages';

interface ItineraryMessagesProps {
  /** Per-country itinerary namespaces this page's client components read. */
  namespaces: readonly (keyof Messages)[];
  children: React.ReactNode;
}

/**
 * Client messages for an itinerary page: the site-wide client set plus ONLY
 * the itinerary namespaces the page needs. The /itineraries segment layout
 * used to hand every page all 12 per-country namespaces (~1.9 MB of the
 * 2.47 MB area-page HTML); an area or route page reads just its own country.
 * The hub and the builder list every country and still pass all of them.
 * A nested provider REPLACES messages (no merge), hence the client set too.
 */
const ItineraryMessages = async ({ namespaces, children }: ItineraryMessagesProps) => {
  const messages = await getMessages();

  return (
    <NextIntlClientProvider messages={pickMessages(messages, [...CLIENT_NAMESPACES, ...namespaces])}>
      {children}
    </NextIntlClientProvider>
  );
};

export default ItineraryMessages;
