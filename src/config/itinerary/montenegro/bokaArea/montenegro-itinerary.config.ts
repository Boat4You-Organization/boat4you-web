import { Itinerary } from '@/types/itinerary.type';

import { bokaBudvaWeekRoute, montenegroAdriatic14Route } from './routes';

const montenegroItinerary: Itinerary = {
  metaTitle: 'Montenegro Sailing Itineraries | Boat4You',
  metaDesc: 'Day-by-day charter routes in Montenegro — 7- and 14-day options.',
  id: 'montenegro',
  sailingArea: 'Montenegro',
  image: { src: '/images/itinerary/montenegro/montenegro-photos/kotor-bay.webp', alt: 'Montenegro' },
  title: 'Montenegro sailing itineraries',
  backgroundImage: { src: '/images/itinerary/montenegro/montenegro-photos/kotor-bay.webp', alt: 'Montenegro' },
  description: 'Charter routes across Montenegro with practical day-by-day notes.',
  routes: [bokaBudvaWeekRoute, montenegroAdriatic14Route],
};

export default montenegroItinerary;
