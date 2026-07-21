import { Itinerary } from '@/types/itinerary.type';

import {
  corfuKassiopiSagiadaRouteConfig,
  corfuLefkasIthakaRoute14DaysConfig,
  corfuPaxosPargaRouteConfig,
  lefkasIthakaKastosRouteConfig,
  lefkasKefaloniaZakynthos14DaysRouteConfit,
  lefkasPaxosIthaka14DaysRouteConfig,
  prevezaIthakaKastosRouteConfig,
  prevezaKefaloniaZakynthos14DaysRouteConfig,
  zakynthosRouteConfig,
} from './routes';

const ionianItinerary: Itinerary = {
  metaTitle: 'Ionian Islands Yacht Charter Itineraries | Greece Sailing Routes',
  metaDesc:
    'Explore Ionian yacht charters—from 7-day routes like Corfu–Kassiopi & Corfu–Lefkas to 14-day adventures across Corfu, Lefkada, Kefalonia & Zakynthos.',
  id: 'ionian',
  sailingArea: 'Ionian',
  image: {
    src: '/images/itinerary/greece/ionian-itinerary/itinerary-card.webp',
    alt: 'Ionian',
  },
  title: 'Ionian area yacht charter itinerary',
  backgroundImage: {
    src: '/images/destinations/greece/greece-banner.webp',
    alt: 'Ionian area banner image',
  },
  description: `The Ionian Sea is the gentlest charter ground in Greece — protected channels between Lefkada, Kefalonia, Ithaca and Meganisi, light afternoon thermals (rarely above 5 Bft), and a chain of small fishing-village ports where charter pressure is much lower than the Cyclades. Lefkada (Marina Lefkas) and Corfu (Marina Gouvia) handle the bulk of bareboat embarkations; Preveza on the mainland is third. Distances are shorter — most legs are 8–18 NM — and almost everything is line-of-sight, which makes this the best Greek charter base for first-time skippers and families with young kids.
    A 7-day Ionian week typically runs Lefkas → Meganisi → Kalamos → Kastos → Ithaca → Kefalonia (Sami or Fiscardo) → Skorpios anchorage → return. Corfu charters loop south to Paxos / Antipaxos and Parga on the mainland; longer 14-day weeks cross to Zakynthos for the famous Shipwreck Bay. The food is a different Greek cuisine to the Cyclades — heavier on olive oil, less on fish — and the Ionian villages tend to keep traditional working harbours open year-round rather than tourist-only marinas.
    Suits all vessel types but particularly catamarans (downwind summer routes, shallow stern-to anchoring) and crewed gulets (Corfu-Lefkas one-way deliveries are common). Best season is May–early July and September; August brings family-tourism crowds but never the Cyclades heat.`,
  routes: [
    corfuKassiopiSagiadaRouteConfig,
    corfuLefkasIthakaRoute14DaysConfig,
    corfuPaxosPargaRouteConfig,
    lefkasIthakaKastosRouteConfig,
    lefkasPaxosIthaka14DaysRouteConfig,
    lefkasKefaloniaZakynthos14DaysRouteConfit,
    prevezaIthakaKastosRouteConfig,
    prevezaKefaloniaZakynthos14DaysRouteConfig,
    zakynthosRouteConfig,
  ],
};

export default ionianItinerary;
