import React from 'react';

import { type Messages } from 'next-intl';

import ExtraClientMessages from '@/components/ExtraClientMessages';

interface ItineraryMessagesProps {
  /** Per-country itinerary namespaces this page's client components read. */
  namespaces: readonly (keyof Messages)[];
  children: React.ReactNode;
}

/**
 * Client messages for an itinerary page: the whole `itinerary` namespace (every other page gets three keys of
 * it, i18n/clientMessages.ts) plus ONLY the per-country namespaces the page needs. The /itineraries segment
 * layout used to hand every page all 12 per-country namespaces (~1.9 MB of the 2.47 MB area-page HTML); an
 * area or route page reads just its own country. The hub and the builder list every country and still pass
 * all of them. Added on top of the site-wide client set, which the page already has from the root layout.
 */
const ItineraryMessages = ({ namespaces, children }: ItineraryMessagesProps) => (
  <ExtraClientMessages namespaces={['itinerary', ...namespaces]}>{children}</ExtraClientMessages>
);

export default ItineraryMessages;
