import { Itinerary } from '@/types/itinerary.type';

import {
  dubrovnikHvarLastovoKorculaRoute,
  dubrovnikKorculaHvarVisLastovo14dayRoute,
  dubrovnikKorculaLastovoRoute,
  dubrovnikSplitOnewayRoute,
  slanoHvarLastovoKorculaRoute,
  slanoKorculaHvarVisLastovo14dayRoute,
  slanoKorculaLastovoRoute,
} from './routes';

const dubrovnikItinerary: Itinerary = {
  metaTitle: 'Dubrovnik Sailing Itineraries | Croatia Yacht Routes from Dubrovnik',
  metaDesc:
    'Explore Dubrovnik sailing routes—from 7-day excursions to Mljet, Korčula & Lastovo, to 14-day journeys through Hvar, Vis, Šćedro & beyond.',
  id: 'dubrovnik',
  sailingArea: 'Dubrovnik',
  image: {
    src: '/images/itinerary/croatia/split-dubrovnik-itinerary/dubrovnik-itinerary-card.webp',
    alt: 'Dubrovnik',
  },
  title: 'Dubrovnik area yacht charter itinerary',
  backgroundImage: {
    src: '/images/destinations/croatia/croatia-banner.webp',
    alt: 'Dubrovnik',
  },
  description: `Charters from Dubrovnik live and die by the southern flank of the Dalmatian coast — Mljet National Park 17 NM north, Lastovo 25 NM west, the Pelješac peninsula's wine villages a comfortable day-sail away. ACI Marina Dubrovnik (Komolac) and Marina Frapa Dubrovnik handle most of the fleet, with the airport at Čilipi twenty minutes south of both. Embarkation Saturday afternoons, return the following Saturday by 09:00 — same as the rest of Croatia, but with a noticeably calmer weather window than Split because you sit south of the bora's main reach.
    This base suits crews who want to start with the postcard view: Dubrovnik old town from the water, then sail to working fishing villages where charter traffic thins. Mljet's Polače and Pomena offer the only national park you can sail into in Croatia. Korčula's medieval old town and Hvar's Pakleni Islands are reachable for week-charter loops.
    Vessel mix from Dubrovnik leans toward sailing yachts and catamarans for couples and small families wanting the slow Adriatic pace, plus a strong motor yacht and crewed mega-yacht segment for guests flying in via Zagreb or Split with a private transfer. Fourteen-day charters frequently run as one-way Dubrovnik → Split via Mljet and Korčula, ending where the Dalmatian fleet density peaks.`,
  routes: [
    dubrovnikHvarLastovoKorculaRoute,
    dubrovnikKorculaHvarVisLastovo14dayRoute,
    dubrovnikKorculaLastovoRoute,
    dubrovnikSplitOnewayRoute,
    slanoHvarLastovoKorculaRoute,
    slanoKorculaHvarVisLastovo14dayRoute,
    slanoKorculaLastovoRoute,
  ],
};

export default dubrovnikItinerary;
