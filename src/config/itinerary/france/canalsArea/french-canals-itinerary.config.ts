import { Itinerary } from '@/types/itinerary.type';

import { alsaceCanalWeekRoute, burgundySaoneWeekRoute, canalDuMidi14Route, canalDuMidiClassicRoute } from './routes';

const frenchCanalsItinerary: Itinerary = {
  metaTitle: 'French Canals Sailing Itineraries | Boat4You',
  metaDesc: 'Day-by-day charter routes in French Canals — 7- and 14-day options.',
  id: 'french-canals',
  sailingArea: 'French Canals',
  image: { src: '/images/destinations/france.webp', alt: 'French Canals' },
  title: 'French Canals sailing itineraries',
  backgroundImage: { src: '/images/destinations/france.webp', alt: 'French Canals' },
  description: 'Charter routes across French Canals with practical day-by-day notes.',
  routes: [canalDuMidiClassicRoute, canalDuMidi14Route, alsaceCanalWeekRoute, burgundySaoneWeekRoute],
};

export default frenchCanalsItinerary;
