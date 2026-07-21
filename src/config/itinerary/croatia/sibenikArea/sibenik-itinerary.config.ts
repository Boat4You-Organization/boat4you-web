import { Itinerary } from '@/types/itinerary.type';

import {
  primostenDubrovnikPrimostenRouteConfig,
  primostenNpKornatiRouteConfig,
  primostenVisKorculaHvarSoltaRouteConfig,
  rogoznicaDubrovnikRogoznica14DaysRouteConfig,
  rogoznicaNpKornatiRouteConfig,
  rogoznicaVisHvarKorculaSoltaRouteConfig,
  sibenikDubrovnikSibenikRouteConfig,
  sibenikHvarVisSoltaRouteConfig,
  sibenikKornatiMolatRouteConfig,
  skradinDugiOtokRouteConfig,
  skradinHvarRouteConfig,
} from './routes';

const sibenikItinerary: Itinerary = {
  metaTitle: 'Šibenik Area Yacht Charter Itineraries | Croatia Sailing Routes',
  metaDesc:
    'Explore Šibenik yacht charter itineraries—from 7-day routes through Kornati or Vis & Hvar, to 14-day voyages to Dubrovnik—tailored for sailing yachts, catamarans & motor yachts.',
  id: 'sibenik',
  sailingArea: 'Sibenik',
  image: {
    src: '/images/itinerary/croatia/split-dubrovnik-itinerary/sibenik-itinerary-card.webp',
    alt: 'Sibenik',
  },
  title: 'Sibenik area yacht charter itinerary',
  backgroundImage: {
    src: '/images/destinations/croatia/croatia-banner.webp',
    alt: 'Sibenik',
  },
  description: `The Šibenik charter base is the gateway to Croatia's two best protected national parks — Kornati and Krka — both reachable in a single day-sail. Marina Mandalina, Marina Frapa Rogoznica and Marina D-Marin Mandalina take embarkation; the bus from Split airport reaches Šibenik in roughly 90 minutes, with private transfers cutting it to under an hour. Charter density is lower here than in Split or Trogir, which translates to less competition for moorings at popular anchorages and faster check-in lines on Saturdays.
  Šibenik's signature week is the Kornati loop: cross to the archipelago through Žirje, anchor in Levrnaka or Lavsa, and weave between the 89 uninhabited islands of the national park. Routes south to Hvar, Vis and Korčula go via Primošten — the prettiest bell-tower silhouette on the Croatian coast — and Rogoznica, a fishing-port harbour with one of the cheapest provisioning supermarkets on the coast.
  This base suits sailing-yacht and catamaran crews looking for raw landscape over town life, plus motor-yacht charters wanting a quieter Krka River entry (the only river-park sailing in Croatia, accessible to vessels under 6 m draft via the Skradin lock). Ideal for shoulder-season weeks (May–June, September) when the Kornati anchorages thin out.`,
  routes: [
    primostenDubrovnikPrimostenRouteConfig,
    primostenNpKornatiRouteConfig,
    primostenVisKorculaHvarSoltaRouteConfig,
    rogoznicaDubrovnikRogoznica14DaysRouteConfig,
    rogoznicaNpKornatiRouteConfig,
    rogoznicaVisHvarKorculaSoltaRouteConfig,
    sibenikDubrovnikSibenikRouteConfig,
    sibenikHvarVisSoltaRouteConfig,
    sibenikKornatiMolatRouteConfig,
    skradinDugiOtokRouteConfig,
    skradinHvarRouteConfig,
  ],
};

export default sibenikItinerary;
