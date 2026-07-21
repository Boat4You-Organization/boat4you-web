import { Itinerary } from '@/types/itinerary.type';

import { innerIslandsClassicRoute, seychellesExplorer14Route } from './routes';

const seychellesItinerary: Itinerary = {
  metaTitle: 'Seychelles Sailing Itineraries | Boat4You',
  metaDesc: 'Day-by-day charter routes in Seychelles — 7- and 14-day options.',
  id: 'seychelles',
  sailingArea: 'Seychelles',
  image: { src: '/images/destinations/seychelles.webp', alt: 'Seychelles' },
  title: 'Seychelles sailing itineraries',
  backgroundImage: { src: '/images/destinations/seychelles.webp', alt: 'Seychelles' },
  description: 'Charter routes across Seychelles with practical day-by-day notes.',
  routes: [innerIslandsClassicRoute, seychellesExplorer14Route],
};

export default seychellesItinerary;
