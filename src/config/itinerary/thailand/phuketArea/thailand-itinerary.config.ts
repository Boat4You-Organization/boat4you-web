import { Itinerary } from '@/types/itinerary.type';

import { andamanExplorer14Route, phuketPhangNgaWeekRoute } from './routes';

const thailandItinerary: Itinerary = {
  metaTitle: 'Thailand (Andaman Sea) Sailing Itineraries | Boat4You',
  metaDesc: 'Day-by-day charter routes in Thailand (Andaman Sea) — 7- and 14-day options.',
  id: 'thailand',
  sailingArea: 'Thailand (Andaman Sea)',
  image: { src: '/images/itinerary/thailand/thailand-photos/thailand-andaman.webp', alt: 'Thailand (Andaman Sea)' },
  title: 'Thailand (Andaman Sea) sailing itineraries',
  backgroundImage: {
    src: '/images/itinerary/thailand/thailand-photos/thailand-andaman.webp',
    alt: 'Thailand (Andaman Sea)',
  },
  description: 'Charter routes across Thailand (Andaman Sea) with practical day-by-day notes.',
  routes: [phuketPhangNgaWeekRoute, andamanExplorer14Route],
};

export default thailandItinerary;
