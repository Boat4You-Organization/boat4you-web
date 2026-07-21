import { Itinerary } from '@/types/itinerary.type';

import { brittanyIslands14Route, morbihanQuiberonRoute } from './routes';

const atlanticFranceItinerary: Itinerary = {
  metaTitle: 'Brittany & Atlantic Sailing Itineraries | Boat4You',
  metaDesc: 'Day-by-day charter routes in Brittany & Atlantic — 7- and 14-day options.',
  id: 'atlantic-france',
  sailingArea: 'Brittany & Atlantic',
  image: { src: '/images/destinations/france.webp', alt: 'Brittany & Atlantic' },
  title: 'Brittany & Atlantic sailing itineraries',
  backgroundImage: { src: '/images/destinations/france.webp', alt: 'Brittany & Atlantic' },
  description: 'Charter routes across Brittany & Atlantic with practical day-by-day notes.',
  routes: [morbihanQuiberonRoute, brittanyIslands14Route],
};

export default atlanticFranceItinerary;
