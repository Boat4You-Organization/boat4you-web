import { computeItineraryNumberOfDays } from '@/helper/itineraryDaysHelper';
import { ItineraryRoute } from '@/types/itinerary.type';

const alsaceCanalWeekRoute: ItineraryRoute = {
  metaTitle: '7-Day Hesse Route | Boat4You',
  metaDesc: '7-day itinerary from Hesse.',
  id: 'alsace-canal-week',
  startingPoint: 'Hesse',
  otherPoints: ['Saverne', 'Lutzelbourg'],
  cardImage: { src: '/images/destinations/france.webp', alt: 'French Canals' },
  gallery: [],
  routeDays: [
    {
      id: 'alsace-canal-week-day-1',
      routeFrom: 'Hesse',
      routeTo: 'Niderviller',
      day: 1,
      mapPin: { desktop: { left: 56.7, top: 44.8 }, mobile: { left: 56.7, top: 44.8 } },
      description: 'Day 1: Hesse to Niderviller.',
      gallery: [],
    },
    {
      id: 'alsace-canal-week-day-2',
      routeFrom: 'Niderviller',
      routeTo: 'Lutzelbourg',
      day: 2,
      mapPin: { desktop: { left: 74.5, top: 23.7 }, mobile: { left: 74.5, top: 23.7 } },
      description: 'Day 2: Niderviller to Lutzelbourg.',
      gallery: [],
    },
    {
      id: 'alsace-canal-week-day-3',
      routeFrom: 'Lutzelbourg',
      routeTo: 'Saverne',
      day: 3,
      mapPin: { desktop: { left: 86.8, top: 13.2 }, mobile: { left: 86.8, top: 13.2 } },
      description: 'Day 3: Lutzelbourg to Saverne.',
      gallery: [],
    },
    {
      id: 'alsace-canal-week-day-4',
      routeFrom: 'Saverne',
      routeTo: 'Lutzelbourg',
      day: 4,
      mapPin: { desktop: { left: 74.5, top: 23.7 }, mobile: { left: 74.5, top: 23.7 } },
      description: 'Day 4: Saverne to Lutzelbourg.',
      gallery: [],
    },
    {
      id: 'alsace-canal-week-day-5',
      routeFrom: 'Lutzelbourg',
      routeTo: 'Xouaxange',
      day: 5,
      mapPin: { desktop: { left: 44.8, top: 72.8 }, mobile: { left: 44.8, top: 72.8 } },
      description: 'Day 5: Lutzelbourg to Xouaxange.',
      gallery: [],
    },
    {
      id: 'alsace-canal-week-day-6',
      routeFrom: 'Xouaxange',
      routeTo: 'Lagarde',
      day: 6,
      mapPin: { desktop: { left: 13.2, top: 86.8 }, mobile: { left: 13.2, top: 86.8 } },
      description: 'Day 6: Xouaxange to Lagarde.',
      gallery: [],
    },
    {
      id: 'alsace-canal-week-day-7',
      routeFrom: 'Lagarde',
      routeTo: 'Hesse',
      day: 7,
      mapPin: { desktop: { left: 51.4, top: 68.1 }, mobile: { left: 51.4, top: 68.1 } },
      description: 'Day 7: Lagarde to Hesse.',
      gallery: [],
    },
  ],
  map: {
    desktop: {
      image: {
        src: '/images/itinerary/france/french-canals-maps/alsace-canal-week-map.webp',
        alt: 'French Canals route map',
      },
      width: 1350,
      height: 199,
    },
    mobile: {
      image: {
        src: '/images/itinerary/france/french-canals-maps/alsace-canal-week-map.webp',
        alt: 'French Canals route map',
      },
      width: 1350,
      height: 199,
    },
  },
};

export default computeItineraryNumberOfDays(alsaceCanalWeekRoute);
