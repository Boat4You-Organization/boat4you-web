import { computeItineraryNumberOfDays } from '@/helper/itineraryDaysHelper';
import { ItineraryRoute } from '@/types/itinerary.type';

const innerIslandsClassicRoute: ItineraryRoute = {
  metaTitle: '7-Day Eden Island (Mahe) Route | Boat4You',
  metaDesc: '7-day itinerary from Eden Island (Mahe).',
  id: 'inner-islands-classic',
  startingPoint: 'Eden Island (Mahe)',
  otherPoints: ['Praslin (Baie Sainte Anne)', 'La Digue'],
  cardImage: { src: '/images/destinations/seychelles.webp', alt: 'Seychelles' },
  gallery: [],
  routeDays: [
    {
      id: 'inner-islands-classic-day-1',
      routeFrom: 'Eden Island (Mahe)',
      routeTo: 'Sainte Anne',
      day: 1,
      mapPin: { desktop: { left: 18.1, top: 81.9 }, mobile: { left: 18.1, top: 81.9 } },
      description: 'Day 1: Eden Island (Mahe) to Sainte Anne.',
      gallery: [],
    },
    {
      id: 'inner-islands-classic-day-2',
      routeFrom: 'Sainte Anne',
      routeTo: 'Praslin (Baie Sainte Anne)',
      day: 2,
      mapPin: { desktop: { left: 66.3, top: 27.7 }, mobile: { left: 66.3, top: 27.7 } },
      description: 'Day 2: Sainte Anne to Praslin (Baie Sainte Anne).',
      gallery: [],
    },
    {
      id: 'inner-islands-classic-day-3',
      routeFrom: 'Praslin (Baie Sainte Anne)',
      routeTo: 'Curieuse',
      day: 3,
      mapPin: { desktop: { left: 60.2, top: 13.2 }, mobile: { left: 60.2, top: 13.2 } },
      description: 'Day 3: Praslin (Baie Sainte Anne) to Curieuse.',
      gallery: [],
    },
    {
      id: 'inner-islands-classic-day-4',
      routeFrom: 'Curieuse',
      routeTo: 'Anse Lazio',
      day: 4,
      mapPin: { desktop: { left: 54.5, top: 15.3 }, mobile: { left: 54.5, top: 15.3 } },
      description: 'Day 4: Curieuse to Anse Lazio.',
      gallery: [],
    },
    {
      id: 'inner-islands-classic-day-5',
      routeFrom: 'Anse Lazio',
      routeTo: 'La Digue',
      day: 5,
      mapPin: { desktop: { left: 79.3, top: 29.0 }, mobile: { left: 79.3, top: 29.0 } },
      description: 'Day 5: Anse Lazio to La Digue.',
      gallery: [],
    },
    {
      id: 'inner-islands-classic-day-6',
      routeFrom: 'La Digue',
      routeTo: 'Ile Cocos',
      day: 6,
      mapPin: { desktop: { left: 86.8, top: 22.1 }, mobile: { left: 86.8, top: 22.1 } },
      description: 'Day 6: La Digue to Ile Cocos.',
      gallery: [],
    },
    {
      id: 'inner-islands-classic-day-7',
      routeFrom: 'Ile Cocos',
      routeTo: 'Eden Island (Mahe)',
      day: 7,
      mapPin: { desktop: { left: 13.2, top: 86.8 }, mobile: { left: 13.2, top: 86.8 } },
      description: 'Day 7: Ile Cocos to Eden Island (Mahe).',
      gallery: [],
    },
  ],
  map: {
    desktop: {
      image: {
        src: '/images/itinerary/seychelles/seychelles-maps/inner-islands-classic-map.webp',
        alt: 'Seychelles route map',
      },
      width: 1350,
      height: 1196,
    },
    mobile: {
      image: {
        src: '/images/itinerary/seychelles/seychelles-maps/inner-islands-classic-map.webp',
        alt: 'Seychelles route map',
      },
      width: 1350,
      height: 1196,
    },
  },
};

export default computeItineraryNumberOfDays(innerIslandsClassicRoute);
