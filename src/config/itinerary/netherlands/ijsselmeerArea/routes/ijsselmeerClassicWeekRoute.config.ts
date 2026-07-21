import { computeItineraryNumberOfDays } from '@/helper/itineraryDaysHelper';
import { ItineraryRoute } from '@/types/itinerary.type';

const ijsselmeerClassicWeekRoute: ItineraryRoute = {
  metaTitle: '7-Day Lemmer Route | Boat4You',
  metaDesc: '7-day itinerary from Lemmer.',
  id: 'ijsselmeer-classic-week',
  startingPoint: 'Lemmer',
  otherPoints: ['Enkhuizen', 'Hoorn'],
  cardImage: { src: '/images/itinerary/netherlands/netherlands-photos/lemmer.webp', alt: 'IJsselmeer & Dutch Waters' },
  gallery: [],
  routeDays: [
    {
      id: 'ijsselmeer-classic-week-day-1',
      routeFrom: 'Lemmer',
      routeTo: 'Urk',
      day: 1,
      mapPin: { desktop: { left: 74.3, top: 54.8 }, mobile: { left: 74.3, top: 54.8 } },
      description: 'Day 1: Lemmer to Urk.',
      gallery: [],
    },
    {
      id: 'ijsselmeer-classic-week-day-2',
      routeFrom: 'Urk',
      routeTo: 'Enkhuizen',
      day: 2,
      mapPin: { desktop: { left: 39.5, top: 47.0 }, mobile: { left: 39.5, top: 47.0 } },
      description: 'Day 2: Urk to Enkhuizen.',
      gallery: [{ src: '/images/itinerary/netherlands/netherlands-photos/enkhuizen-harbour.webp', alt: 'Enkhuizen' }],
    },
    {
      id: 'ijsselmeer-classic-week-day-3',
      routeFrom: 'Enkhuizen',
      routeTo: 'Hoorn',
      day: 3,
      mapPin: { desktop: { left: 13.2, top: 59.0 }, mobile: { left: 13.2, top: 59.0 } },
      description: 'Day 3: Enkhuizen to Hoorn.',
      gallery: [{ src: '/images/itinerary/netherlands/netherlands-photos/hoorn.webp', alt: 'Hoorn' }],
    },
    {
      id: 'ijsselmeer-classic-week-day-4',
      routeFrom: 'Hoorn',
      routeTo: 'Volendam',
      day: 4,
      mapPin: { desktop: { left: 14.3, top: 86.8 }, mobile: { left: 14.3, top: 86.8 } },
      description: 'Day 4: Hoorn to Volendam.',
      gallery: [{ src: '/images/itinerary/netherlands/netherlands-photos/volendam.webp', alt: 'Volendam' }],
    },
    {
      id: 'ijsselmeer-classic-week-day-5',
      routeFrom: 'Volendam',
      routeTo: 'Medemblik',
      day: 5,
      mapPin: { desktop: { left: 18.4, top: 34.1 }, mobile: { left: 18.4, top: 34.1 } },
      description: 'Day 5: Volendam to Medemblik.',
      gallery: [{ src: '/images/itinerary/netherlands/netherlands-photos/medemblik.webp', alt: 'Medemblik' }],
    },
    {
      id: 'ijsselmeer-classic-week-day-6',
      routeFrom: 'Medemblik',
      routeTo: 'Stavoren',
      day: 6,
      mapPin: { desktop: { left: 47.3, top: 13.2 }, mobile: { left: 47.3, top: 13.2 } },
      description: 'Day 6: Medemblik to Stavoren.',
      gallery: [],
    },
    {
      id: 'ijsselmeer-classic-week-day-7',
      routeFrom: 'Stavoren',
      routeTo: 'Lemmer',
      day: 7,
      mapPin: { desktop: { left: 86.8, top: 19.9 }, mobile: { left: 86.8, top: 19.9 } },
      description: 'Day 7: Stavoren to Lemmer.',
      gallery: [{ src: '/images/itinerary/netherlands/netherlands-photos/lemmer.webp', alt: 'Lemmer' }],
    },
  ],
  map: {
    desktop: {
      image: {
        src: '/images/itinerary/netherlands/netherlands-maps/ijsselmeer-classic-week-map.webp',
        alt: 'IJsselmeer & Dutch Waters route map',
      },
      width: 1350,
      height: 1324,
    },
    mobile: {
      image: {
        src: '/images/itinerary/netherlands/netherlands-maps/ijsselmeer-classic-week-map.webp',
        alt: 'IJsselmeer & Dutch Waters route map',
      },
      width: 1350,
      height: 1324,
    },
  },
};

export default computeItineraryNumberOfDays(ijsselmeerClassicWeekRoute);
