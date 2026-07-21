import { Itinerary } from '@/types/itinerary.type';

import { dutchWaters14Route, ijsselmeerClassicWeekRoute } from './routes';

const netherlandsItinerary: Itinerary = {
  metaTitle: 'IJsselmeer & Dutch Waters Sailing Itineraries | Boat4You',
  metaDesc: 'Day-by-day charter routes in IJsselmeer & Dutch Waters — 7- and 14-day options.',
  id: 'netherlands',
  sailingArea: 'IJsselmeer & Dutch Waters',
  image: { src: '/images/itinerary/netherlands/netherlands-photos/ijsselmeer.webp', alt: 'IJsselmeer & Dutch Waters' },
  title: 'IJsselmeer & Dutch Waters sailing itineraries',
  backgroundImage: {
    src: '/images/itinerary/netherlands/netherlands-photos/ijsselmeer.webp',
    alt: 'IJsselmeer & Dutch Waters',
  },
  description: 'Charter routes across IJsselmeer & Dutch Waters with practical day-by-day notes.',
  routes: [ijsselmeerClassicWeekRoute, dutchWaters14Route],
};

export default netherlandsItinerary;
