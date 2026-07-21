import { computeItineraryNumberOfDays } from '@/helper/itineraryDaysHelper';
import { ItineraryRoute } from '@/types/itinerary.type';

const morbihanQuiberonRoute: ItineraryRoute = {
  metaTitle: '7-Day Le Crouesty Route | Boat4You',
  metaDesc: '7-day itinerary from Le Crouesty.',
  id: 'morbihan-quiberon',
  startingPoint: 'Le Crouesty',
  otherPoints: ['Belle-Ile (Le Palais)', 'Houat'],
  cardImage: {
    src: '/images/itinerary/france/atlantic-france-photos/golfe-du-morbihan.webp',
    alt: 'Brittany & Atlantic',
  },
  gallery: [],
  routeDays: [
    {
      id: 'morbihan-quiberon-day-1',
      routeFrom: 'Le Crouesty',
      routeTo: 'Ile aux Moines',
      day: 1,
      mapPin: { desktop: { left: 72.2, top: 27.0 }, mobile: { left: 72.2, top: 27.0 } },
      description: 'Day 1: Le Crouesty to Ile aux Moines.',
      gallery: [],
    },
    {
      id: 'morbihan-quiberon-day-2',
      routeFrom: 'Ile aux Moines',
      routeTo: 'Vannes',
      day: 2,
      mapPin: { desktop: { left: 86.8, top: 13.2 }, mobile: { left: 86.8, top: 13.2 } },
      description: 'Day 2: Ile aux Moines to Vannes.',
      gallery: [{ src: '/images/itinerary/france/atlantic-france-photos/vannes.webp', alt: 'Vannes' }],
    },
    {
      id: 'morbihan-quiberon-day-3',
      routeFrom: 'Vannes',
      routeTo: 'Houat',
      day: 3,
      mapPin: { desktop: { left: 55.5, top: 75.1 }, mobile: { left: 55.5, top: 75.1 } },
      description: 'Day 3: Vannes to Houat.',
      gallery: [{ src: '/images/itinerary/france/atlantic-france-photos/houat.webp', alt: 'Houat' }],
    },
    {
      id: 'morbihan-quiberon-day-4',
      routeFrom: 'Houat',
      routeTo: 'Belle-Ile (Le Palais)',
      day: 4,
      mapPin: { desktop: { left: 24.0, top: 84.9 }, mobile: { left: 24.0, top: 84.9 } },
      description: 'Day 4: Houat to Belle-Ile (Le Palais).',
      gallery: [
        { src: '/images/itinerary/france/atlantic-france-photos/belle-ile.webp', alt: 'Belle-Ile (Le Palais)' },
      ],
    },
    {
      id: 'morbihan-quiberon-day-5',
      routeFrom: 'Belle-Ile (Le Palais)',
      routeTo: 'Sauzon',
      day: 5,
      mapPin: { desktop: { left: 13.2, top: 79.3 }, mobile: { left: 13.2, top: 79.3 } },
      description: 'Day 5: Belle-Ile (Le Palais) to Sauzon.',
      gallery: [{ src: '/images/itinerary/france/atlantic-france-photos/sauzon.webp', alt: 'Sauzon' }],
    },
    {
      id: 'morbihan-quiberon-day-6',
      routeFrom: 'Sauzon',
      routeTo: 'Hoedic',
      day: 6,
      mapPin: { desktop: { left: 67.9, top: 86.8 }, mobile: { left: 67.9, top: 86.8 } },
      description: 'Day 6: Sauzon to Hoedic.',
      gallery: [],
    },
    {
      id: 'morbihan-quiberon-day-7',
      routeFrom: 'Hoedic',
      routeTo: 'Le Crouesty',
      day: 7,
      mapPin: { desktop: { left: 65.1, top: 39.7 }, mobile: { left: 65.1, top: 39.7 } },
      description: 'Day 7: Hoedic to Le Crouesty.',
      gallery: [],
    },
  ],
  map: {
    desktop: {
      image: {
        src: '/images/itinerary/france/atlantic-france-maps/morbihan-quiberon-map.webp',
        alt: 'Brittany & Atlantic route map',
      },
      width: 1350,
      height: 1371,
    },
    mobile: {
      image: {
        src: '/images/itinerary/france/atlantic-france-maps/morbihan-quiberon-map.webp',
        alt: 'Brittany & Atlantic route map',
      },
      width: 1350,
      height: 1371,
    },
  },
};

export default computeItineraryNumberOfDays(morbihanQuiberonRoute);
