import { computeItineraryNumberOfDays } from '@/helper/itineraryDaysHelper';
import { ItineraryRoute } from '@/types/itinerary.type';

const bokaBudvaWeekRoute: ItineraryRoute = {
  metaTitle: '7-Day Porto Montenegro (Tivat) Route | Boat4You',
  metaDesc: '7-day itinerary from Porto Montenegro (Tivat).',
  id: 'boka-budva-week',
  startingPoint: 'Porto Montenegro (Tivat)',
  otherPoints: ['Kotor', 'Budva'],
  cardImage: { src: '/images/destinations/montenegro.webp', alt: 'Montenegro' },
  gallery: [],
  routeDays: [
    {
      id: 'boka-budva-week-day-1',
      routeFrom: 'Porto Montenegro (Tivat)',
      routeTo: 'Kotor',
      day: 1,
      mapPin: { desktop: { left: 70.1, top: 35.1 }, mobile: { left: 70.1, top: 35.1 } },
      description: 'Day 1: Porto Montenegro (Tivat) to Kotor.',
      gallery: [],
    },
    {
      id: 'boka-budva-week-day-2',
      routeFrom: 'Kotor',
      routeTo: 'Perast',
      day: 2,
      mapPin: { desktop: { left: 52.9, top: 13.2 }, mobile: { left: 52.9, top: 13.2 } },
      description: 'Day 2: Kotor to Perast.',
      gallery: [],
    },
    {
      id: 'boka-budva-week-day-3',
      routeFrom: 'Perast',
      routeTo: 'Herceg Novi',
      day: 3,
      mapPin: { desktop: { left: 13.2, top: 25.6 }, mobile: { left: 13.2, top: 25.6 } },
      description: 'Day 3: Perast to Herceg Novi.',
      gallery: [],
    },
    {
      id: 'boka-budva-week-day-4',
      routeFrom: 'Herceg Novi',
      routeTo: 'Zanjice',
      day: 4,
      mapPin: { desktop: { left: 20.1, top: 44.9 }, mobile: { left: 20.1, top: 44.9 } },
      description: 'Day 4: Herceg Novi to Zanjice.',
      gallery: [],
    },
    {
      id: 'boka-budva-week-day-5',
      routeFrom: 'Zanjice',
      routeTo: 'Budva',
      day: 5,
      mapPin: { desktop: { left: 86.8, top: 86.8 }, mobile: { left: 86.8, top: 86.8 } },
      description: 'Day 5: Zanjice to Budva.',
      gallery: [],
    },
    {
      id: 'boka-budva-week-day-6',
      routeFrom: 'Budva',
      routeTo: 'Bigova',
      day: 6,
      mapPin: { desktop: { left: 53.9, top: 59.7 }, mobile: { left: 53.9, top: 59.7 } },
      description: 'Day 6: Budva to Bigova.',
      gallery: [],
    },
    {
      id: 'boka-budva-week-day-7',
      routeFrom: 'Bigova',
      routeTo: 'Porto Montenegro (Tivat)',
      day: 7,
      mapPin: { desktop: { left: 51.0, top: 31.9 }, mobile: { left: 51.0, top: 31.9 } },
      description: 'Day 7: Bigova to Porto Montenegro (Tivat).',
      gallery: [],
    },
  ],
  map: {
    desktop: {
      image: {
        src: '/images/itinerary/montenegro/montenegro-maps/boka-budva-week-map.webp',
        alt: 'Montenegro route map',
      },
      width: 1350,
      height: 1273,
    },
    mobile: {
      image: {
        src: '/images/itinerary/montenegro/montenegro-maps/boka-budva-week-map.webp',
        alt: 'Montenegro route map',
      },
      width: 1350,
      height: 1273,
    },
  },
};

export default computeItineraryNumberOfDays(bokaBudvaWeekRoute);
