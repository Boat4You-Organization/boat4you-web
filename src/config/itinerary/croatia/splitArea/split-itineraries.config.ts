import { Itinerary } from '@/types/itinerary.type';

import {
  kastelaDubrovnikKastela14DaysRoute,
  kastelaKornatiKrkaRoute,
  kastelaVisKorculaHvarRoute,
  splitDubrovnikSplitRoute,
  splitKornatiKrkaRoute,
  splitVisKorculaHvarRoute,
  trogirDubrovnikTrogir14DaysRoute,
  trogirKornatiKrkaRoute,
  trogirVisKorculaHvarRoute,
} from './routes';

const splitItinerary: Itinerary = {
  metaTitle: 'Split Area Yacht Charter Itineraries | Croatia Sailing Routes',
  metaDesc:
    'Explore Split-area yacht charters from Kaštela—14-day Dubrovnik route or 7-day visits to Kornati–Krka or Vis–Korčula–Hvar. Plan your ideal Adriatic voyage.',
  id: 'split',
  sailingArea: 'Split',
  image: {
    src: '/images/itinerary/croatia/split-dubrovnik-itinerary/split-itinerary-card.webp',
    alt: 'Split',
  },
  title: 'Split area yacht charter itinerary',
  backgroundImage: {
    src: '/images/destinations/croatia/croatia-banner.webp',
    alt: 'Split',
  },
  description: `Split anchors the central Dalmatian charter market and pulls roughly two-thirds of all Croatian yacht bookings each season — for good reason. Marina Kaštela, ACI Trogir and Marina Baotić sit twenty minutes from the airport, the Roman-era Diocletian's Palace runs as the city's living downtown, and a single Saturday-to-Saturday week lets you reach Šolta, Brač, Hvar, Vis, Korčula and back without ever doing more than 25 nautical miles in a day.
  From Boat4You' Split base you can pick a sailboat for the classic family charter, a catamaran for stable two-cabin couples-and-kids weeks, a motor yacht for Costa Brava–style port hopping, or a fully crewed gulet for a hands-off luxury week. The Dalmatian middle islands suit every vessel type because the channels are sheltered, the bora and maestral arrive on predictable schedules, and the ports stack one Konoba lunch after another — Komiža on Vis, Stari Grad on Hvar, Vela Luka on Korčula.
  Two-week charters from Split typically run as a one-way to Dubrovnik via the Mljet National Park and the Pelješac peninsula. Shorter weeks loop back through the Kornati archipelago for visitors who prioritise raw landscape over town life. Whichever vessel and route you choose, the Split charter market offers the deepest fleet selection, the broadest skipper pool, and the most reliable charter logistics in the country.`,
  routes: [
    kastelaDubrovnikKastela14DaysRoute,
    kastelaKornatiKrkaRoute,
    kastelaVisKorculaHvarRoute,
    splitDubrovnikSplitRoute,
    splitKornatiKrkaRoute,
    splitVisKorculaHvarRoute,
    trogirDubrovnikTrogir14DaysRoute,
    trogirKornatiKrkaRoute,
    trogirVisKorculaHvarRoute,
  ],
};

export default splitItinerary;
