import { computeItineraryNumberOfDays } from '@/helper/itineraryDaysHelper';
import { ItineraryRoute } from '@/types/itinerary.type';

const burgundySaoneWeekRoute: ItineraryRoute = {
  metaTitle: '7-Day Saint-Jean-de-Losne Route | Boat4You',
  metaDesc: '7-day itinerary from Saint-Jean-de-Losne.',
  id: 'burgundy-saone-week',
  startingPoint: 'Saint-Jean-de-Losne',
  otherPoints: ['Dole', 'Auxonne'],
  cardImage: { src: '/images/itinerary/france/french-canals-photos/canal-du-midi-barge.webp', alt: 'French Canals' },
  gallery: [],
  routeDays: [
    {
      id: 'burgundy-saone-week-day-1',
      routeFrom: 'Saint-Jean-de-Losne',
      routeTo: 'Auxonne',
      day: 1,
      mapPin: { desktop: { left: 70.6, top: 13.2 }, mobile: { left: 70.6, top: 13.2 } },
      description: 'Day 1: Saint-Jean-de-Losne to Auxonne.',
      gallery: [],
    },
    {
      id: 'burgundy-saone-week-day-2',
      routeFrom: 'Auxonne',
      routeTo: 'Dole',
      day: 2,
      mapPin: { desktop: { left: 86.8, top: 38.4 }, mobile: { left: 86.8, top: 38.4 } },
      description: 'Day 2: Auxonne to Dole.',
      gallery: [],
    },
    {
      id: 'burgundy-saone-week-day-3',
      routeFrom: 'Dole',
      routeTo: 'Saint-Symphorien',
      day: 3,
      mapPin: { desktop: { left: 55.4, top: 42.1 }, mobile: { left: 55.4, top: 42.1 } },
      description: 'Day 3: Dole to Saint-Symphorien.',
      gallery: [],
    },
    {
      id: 'burgundy-saone-week-day-4',
      routeFrom: 'Saint-Symphorien',
      routeTo: 'Seurre',
      day: 4,
      mapPin: { desktop: { left: 33.8, top: 62.0 }, mobile: { left: 33.8, top: 62.0 } },
      description: 'Day 4: Saint-Symphorien to Seurre.',
      gallery: [],
    },
    {
      id: 'burgundy-saone-week-day-5',
      routeFrom: 'Seurre',
      routeTo: 'Verdun-sur-le-Doubs',
      day: 5,
      mapPin: { desktop: { left: 13.2, top: 86.8 }, mobile: { left: 13.2, top: 86.8 } },
      description: 'Day 5: Seurre to Verdun-sur-le-Doubs.',
      gallery: [],
    },
    {
      id: 'burgundy-saone-week-day-6',
      routeFrom: 'Verdun-sur-le-Doubs',
      routeTo: 'Seurre',
      day: 6,
      mapPin: { desktop: { left: 33.8, top: 62.0 }, mobile: { left: 33.8, top: 62.0 } },
      description: 'Day 6: Verdun-sur-le-Doubs to Seurre.',
      gallery: [],
    },
    {
      id: 'burgundy-saone-week-day-7',
      routeFrom: 'Seurre',
      routeTo: 'Saint-Jean-de-Losne',
      day: 7,
      mapPin: { desktop: { left: 51.2, top: 36.1 }, mobile: { left: 51.2, top: 36.1 } },
      description: 'Day 7: Seurre to Saint-Jean-de-Losne.',
      gallery: [],
    },
  ],
  map: {
    desktop: {
      image: {
        src: '/images/itinerary/france/french-canals-maps/burgundy-saone-week-map.webp',
        alt: 'French Canals route map',
      },
      width: 1350,
      height: 1250,
    },
    mobile: {
      image: {
        src: '/images/itinerary/france/french-canals-maps/burgundy-saone-week-map.webp',
        alt: 'French Canals route map',
      },
      width: 1350,
      height: 1250,
    },
  },
};

export default computeItineraryNumberOfDays(burgundySaoneWeekRoute);
