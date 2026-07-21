import { computeItineraryNumberOfDays } from '@/helper/itineraryDaysHelper';
import { ItineraryRoute } from '@/types/itinerary.type';

const canalDuMidiClassicRoute: ItineraryRoute = {
  metaTitle: '7-Day Castelnaudary Route | Boat4You',
  metaDesc: '7-day itinerary from Castelnaudary.',
  id: 'canal-du-midi-classic',
  startingPoint: 'Castelnaudary',
  otherPoints: ['Carcassonne', 'Le Somail'],
  cardImage: { src: '/images/destinations/france.webp', alt: 'French Canals' },
  gallery: [],
  routeDays: [
    {
      id: 'canal-du-midi-classic-day-1',
      routeFrom: 'Castelnaudary',
      routeTo: 'Bram',
      day: 1,
      mapPin: { desktop: { left: 22.6, top: 67.7 }, mobile: { left: 22.6, top: 67.7 } },
      description: 'Day 1: Castelnaudary to Bram.',
      gallery: [],
    },
    {
      id: 'canal-du-midi-classic-day-2',
      routeFrom: 'Bram',
      routeTo: 'Carcassonne',
      day: 2,
      mapPin: { desktop: { left: 36.4, top: 85.1 }, mobile: { left: 36.4, top: 85.1 } },
      description: 'Day 2: Bram to Carcassonne.',
      gallery: [],
    },
    {
      id: 'canal-du-midi-classic-day-3',
      routeFrom: 'Carcassonne',
      routeTo: 'Trebes',
      day: 3,
      mapPin: { desktop: { left: 41.8, top: 86.8 }, mobile: { left: 41.8, top: 86.8 } },
      description: 'Day 3: Carcassonne to Trebes.',
      gallery: [],
    },
    {
      id: 'canal-du-midi-classic-day-4',
      routeFrom: 'Trebes',
      routeTo: 'Homps',
      day: 4,
      mapPin: { desktop: { left: 57.9, top: 54.8 }, mobile: { left: 57.9, top: 54.8 } },
      description: 'Day 4: Trebes to Homps.',
      gallery: [],
    },
    {
      id: 'canal-du-midi-classic-day-5',
      routeFrom: 'Homps',
      routeTo: 'Le Somail',
      day: 5,
      mapPin: { desktop: { left: 66.3, top: 61.0 }, mobile: { left: 66.3, top: 61.0 } },
      description: 'Day 5: Homps to Le Somail.',
      gallery: [],
    },
    {
      id: 'canal-du-midi-classic-day-6',
      routeFrom: 'Le Somail',
      routeTo: 'Capestang',
      day: 6,
      mapPin: { desktop: { left: 76.9, top: 20.5 }, mobile: { left: 76.9, top: 20.5 } },
      description: 'Day 6: Le Somail to Capestang.',
      gallery: [],
    },
    {
      id: 'canal-du-midi-classic-day-7',
      routeFrom: 'Capestang',
      routeTo: 'Beziers',
      day: 7,
      mapPin: { desktop: { left: 86.8, top: 13.2 }, mobile: { left: 86.8, top: 13.2 } },
      description: 'Day 7: Capestang to Beziers.',
      gallery: [],
    },
  ],
  map: {
    desktop: {
      image: {
        src: '/images/itinerary/france/french-canals-maps/canal-du-midi-classic-map.webp',
        alt: 'French Canals route map',
      },
      width: 1350,
      height: 192,
    },
    mobile: {
      image: {
        src: '/images/itinerary/france/french-canals-maps/canal-du-midi-classic-map.webp',
        alt: 'French Canals route map',
      },
      width: 1350,
      height: 192,
    },
  },
};

export default computeItineraryNumberOfDays(canalDuMidiClassicRoute);
