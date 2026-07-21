import { computeItineraryNumberOfDays } from '@/helper/itineraryDaysHelper';
import { ItineraryRoute } from '@/types/itinerary.type';

const balticDanishIslesWeekRoute: ItineraryRoute = {
  metaTitle: '7-Day Heiligenhafen Route | Boat4You',
  metaDesc: '7-day itinerary from Heiligenhafen.',
  id: 'baltic-danish-isles-week',
  startingPoint: 'Heiligenhafen',
  otherPoints: ['Marstal', 'Aeroskobing'],
  cardImage: {
    src: '/images/itinerary/germany/baltic-germany-photos/heiligenhafen.webp',
    alt: 'German Baltic & Danish Isles',
  },
  gallery: [],
  routeDays: [
    {
      id: 'baltic-danish-isles-week-day-1',
      routeFrom: 'Heiligenhafen',
      routeTo: 'Burgtiefe (Fehmarn)',
      day: 1,
      mapPin: { desktop: { left: 86.8, top: 83.2 }, mobile: { left: 86.8, top: 83.2 } },
      description: 'Day 1: Heiligenhafen to Burgtiefe (Fehmarn).',
      gallery: [{ src: '/images/itinerary/germany/baltic-germany-photos/fehmarn.webp', alt: 'Burgtiefe (Fehmarn)' }],
    },
    {
      id: 'baltic-danish-isles-week-day-2',
      routeFrom: 'Burgtiefe (Fehmarn)',
      routeTo: 'Bagenkop',
      day: 2,
      mapPin: { desktop: { left: 59.3, top: 35.3 }, mobile: { left: 59.3, top: 35.3 } },
      description: 'Day 2: Burgtiefe (Fehmarn) to Bagenkop.',
      gallery: [],
    },
    {
      id: 'baltic-danish-isles-week-day-3',
      routeFrom: 'Bagenkop',
      routeTo: 'Marstal',
      day: 3,
      mapPin: { desktop: { left: 51.3, top: 21.7 }, mobile: { left: 51.3, top: 21.7 } },
      description: 'Day 3: Bagenkop to Marstal.',
      gallery: [{ src: '/images/itinerary/germany/baltic-germany-photos/marstal-harbour.webp', alt: 'Marstal' }],
    },
    {
      id: 'baltic-danish-isles-week-day-4',
      routeFrom: 'Marstal',
      routeTo: 'Aeroskobing',
      day: 4,
      mapPin: { desktop: { left: 45.8, top: 16.7 }, mobile: { left: 45.8, top: 16.7 } },
      description: 'Day 4: Marstal to Aeroskobing.',
      gallery: [{ src: '/images/itinerary/germany/baltic-germany-photos/aeroskobing.webp', alt: 'Aeroskobing' }],
    },
    {
      id: 'baltic-danish-isles-week-day-5',
      routeFrom: 'Aeroskobing',
      routeTo: 'Sonderborg',
      day: 5,
      mapPin: { desktop: { left: 13.2, top: 13.2 }, mobile: { left: 13.2, top: 13.2 } },
      description: 'Day 5: Aeroskobing to Sonderborg.',
      gallery: [{ src: '/images/itinerary/germany/baltic-germany-photos/sonderborg-castle.webp', alt: 'Sonderborg' }],
    },
    {
      id: 'baltic-danish-isles-week-day-6',
      routeFrom: 'Sonderborg',
      routeTo: 'Bagenkop',
      day: 6,
      mapPin: { desktop: { left: 59.3, top: 35.3 }, mobile: { left: 59.3, top: 35.3 } },
      description: 'Day 6: Sonderborg to Bagenkop.',
      gallery: [],
    },
    {
      id: 'baltic-danish-isles-week-day-7',
      routeFrom: 'Bagenkop',
      routeTo: 'Heiligenhafen',
      day: 7,
      mapPin: { desktop: { left: 75.2, top: 86.8 }, mobile: { left: 75.2, top: 86.8 } },
      description: 'Day 7: Bagenkop to Heiligenhafen.',
      gallery: [{ src: '/images/itinerary/germany/baltic-germany-photos/heiligenhafen.webp', alt: 'Heiligenhafen' }],
    },
  ],
  map: {
    desktop: {
      image: {
        src: '/images/itinerary/germany/baltic-germany-maps/baltic-danish-isles-week-map.webp',
        alt: 'German Baltic & Danish Isles route map',
      },
      width: 1350,
      height: 883,
    },
    mobile: {
      image: {
        src: '/images/itinerary/germany/baltic-germany-maps/baltic-danish-isles-week-map.webp',
        alt: 'German Baltic & Danish Isles route map',
      },
      width: 1350,
      height: 883,
    },
  },
};

export default computeItineraryNumberOfDays(balticDanishIslesWeekRoute);
