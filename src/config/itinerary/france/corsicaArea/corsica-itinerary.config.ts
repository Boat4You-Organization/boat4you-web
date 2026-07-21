import { Itinerary } from '@/types/itinerary.type';

import { ajaccioSouthCorsicaRoute, corsicaGrandTour14Route } from './routes';

const corsicaItinerary: Itinerary = {
  metaTitle: 'Corsica Sailing Itineraries | Boat4You',
  metaDesc: 'Day-by-day charter routes in Corsica — 7- and 14-day options.',
  id: 'corsica',
  sailingArea: 'Corsica',
  image: { src: '/images/destinations/france.webp', alt: 'Corsica' },
  title: 'Corsica sailing itineraries',
  backgroundImage: { src: '/images/destinations/france.webp', alt: 'Corsica' },
  description: 'Charter routes across Corsica with practical day-by-day notes.',
  routes: [ajaccioSouthCorsicaRoute, corsicaGrandTour14Route],
};

export default corsicaItinerary;
