import { Itinerary } from '@/types/itinerary.type';

import { balticDanishIslesWeekRoute, balticFynCircle14Route } from './routes';

const germanyItinerary: Itinerary = {
  metaTitle: 'German Baltic & Danish Isles Sailing Itineraries | Boat4You',
  metaDesc: 'Day-by-day charter routes in German Baltic & Danish Isles — 7- and 14-day options.',
  id: 'baltic-germany',
  sailingArea: 'German Baltic & Danish Isles',
  image: {
    src: '/images/itinerary/germany/baltic-germany-photos/heiligenhafen.webp',
    alt: 'German Baltic & Danish Isles',
  },
  title: 'German Baltic & Danish Isles sailing itineraries',
  backgroundImage: {
    src: '/images/itinerary/germany/baltic-germany-photos/heiligenhafen.webp',
    alt: 'German Baltic & Danish Isles',
  },
  description: 'Charter routes across German Baltic & Danish Isles with practical day-by-day notes.',
  routes: [balticDanishIslesWeekRoute, balticFynCircle14Route],
};

export default germanyItinerary;
