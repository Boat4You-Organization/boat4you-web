import { computeItineraryNumberOfDays } from '@/helper/itineraryDaysHelper';
import { ItineraryRoute } from '@/types/itinerary.type';

const ajaccioSouthCorsicaRoute: ItineraryRoute = {
  metaTitle: '7-Day Ajaccio Route | Boat4You',
  metaDesc: '7-day itinerary from Ajaccio.',
  id: 'ajaccio-south-corsica',
  startingPoint: 'Ajaccio',
  otherPoints: ['Bonifacio', 'Iles Lavezzi'],
  cardImage: { src: '/images/itinerary/france/corsica-photos/ajaccio.webp', alt: 'Corsica' },
  gallery: [],
  routeDays: [
    {
      id: 'ajaccio-south-corsica-day-1',
      routeFrom: 'Ajaccio',
      routeTo: 'Porto Pollo',
      day: 1,
      mapPin: { desktop: { left: 21.6, top: 40.1 }, mobile: { left: 21.6, top: 40.1 } },
      description: 'Day 1: Ajaccio to Porto Pollo.',
      gallery: [],
    },
    {
      id: 'ajaccio-south-corsica-day-2',
      routeFrom: 'Porto Pollo',
      routeTo: 'Campomoro',
      day: 2,
      mapPin: { desktop: { left: 23.4, top: 49.3 }, mobile: { left: 23.4, top: 49.3 } },
      description: 'Day 2: Porto Pollo to Campomoro.',
      gallery: [],
    },
    {
      id: 'ajaccio-south-corsica-day-3',
      routeFrom: 'Campomoro',
      routeTo: 'Tizzano',
      day: 3,
      mapPin: { desktop: { left: 29.1, top: 60.8 }, mobile: { left: 29.1, top: 60.8 } },
      description: 'Day 3: Campomoro to Tizzano.',
      gallery: [],
    },
    {
      id: 'ajaccio-south-corsica-day-4',
      routeFrom: 'Tizzano',
      routeTo: 'Bonifacio',
      day: 4,
      mapPin: { desktop: { left: 72.9, top: 80.4 }, mobile: { left: 72.9, top: 80.4 } },
      description: 'Day 4: Tizzano to Bonifacio.',
      gallery: [{ src: '/images/itinerary/france/corsica-photos/bonifacio-cliffs.webp', alt: 'Bonifacio' }],
    },
    {
      id: 'ajaccio-south-corsica-day-5',
      routeFrom: 'Bonifacio',
      routeTo: 'Iles Lavezzi',
      day: 5,
      mapPin: { desktop: { left: 86.8, top: 86.8 }, mobile: { left: 86.8, top: 86.8 } },
      description: 'Day 5: Bonifacio to Iles Lavezzi.',
      gallery: [{ src: '/images/itinerary/france/corsica-photos/lavezzi-islands.webp', alt: 'Iles Lavezzi' }],
    },
    {
      id: 'ajaccio-south-corsica-day-6',
      routeFrom: 'Iles Lavezzi',
      routeTo: 'Propriano',
      day: 6,
      mapPin: { desktop: { left: 36.2, top: 43.9 }, mobile: { left: 36.2, top: 43.9 } },
      description: 'Day 6: Iles Lavezzi to Propriano.',
      gallery: [{ src: '/images/itinerary/france/corsica-photos/propriano.webp', alt: 'Propriano' }],
    },
    {
      id: 'ajaccio-south-corsica-day-7',
      routeFrom: 'Propriano',
      routeTo: 'Ajaccio',
      day: 7,
      mapPin: { desktop: { left: 13.2, top: 13.2 }, mobile: { left: 13.2, top: 13.2 } },
      description: 'Day 7: Propriano to Ajaccio.',
      gallery: [{ src: '/images/itinerary/france/corsica-photos/ajaccio.webp', alt: 'Ajaccio' }],
    },
  ],
  map: {
    desktop: {
      image: { src: '/images/itinerary/france/corsica-maps/ajaccio-south-corsica-map.webp', alt: 'Corsica route map' },
      width: 1350,
      height: 2031,
    },
    mobile: {
      image: { src: '/images/itinerary/france/corsica-maps/ajaccio-south-corsica-map.webp', alt: 'Corsica route map' },
      width: 1350,
      height: 2031,
    },
  },
};

export default computeItineraryNumberOfDays(ajaccioSouthCorsicaRoute);
