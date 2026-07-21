import { computeItineraryNumberOfDays } from '@/helper/itineraryDaysHelper';
import { ItineraryRoute } from '@/types/itinerary.type';

const cannesLerinsStTropezRoute: ItineraryRoute = {
  metaTitle: '7-Day Cannes Route | Boat4You',
  metaDesc: '7-day itinerary from Cannes.',
  id: 'cannes-lerins-st-tropez',
  startingPoint: 'Cannes',
  otherPoints: ['Saint-Tropez', 'Porquerolles'],
  cardImage: { src: '/images/itinerary/france/cote-azur-photos/cannes.webp', alt: "Côte d'Azur" },
  gallery: [],
  routeDays: [
    {
      id: 'cannes-lerins-st-tropez-day-1',
      routeFrom: 'Cannes',
      routeTo: 'Iles de Lerins',
      day: 1,
      mapPin: { desktop: { left: 86.8, top: 17.1 }, mobile: { left: 86.8, top: 17.1 } },
      description: 'Day 1: Cannes to Iles de Lerins.',
      gallery: [{ src: '/images/itinerary/france/cote-azur-photos/iles-de-lerins.webp', alt: 'Iles de Lerins' }],
    },
    {
      id: 'cannes-lerins-st-tropez-day-2',
      routeFrom: 'Iles de Lerins',
      routeTo: 'Saint-Tropez',
      day: 2,
      mapPin: { desktop: { left: 51.5, top: 50.5 }, mobile: { left: 51.5, top: 50.5 } },
      description: 'Day 2: Iles de Lerins to Saint-Tropez.',
      gallery: [{ src: '/images/itinerary/france/cote-azur-photos/saint-tropez.webp', alt: 'Saint-Tropez' }],
    },
    {
      id: 'cannes-lerins-st-tropez-day-3',
      routeFrom: 'Saint-Tropez',
      routeTo: 'Cavalaire',
      day: 3,
      mapPin: { desktop: { left: 42.0, top: 64.2 }, mobile: { left: 42.0, top: 64.2 } },
      description: 'Day 3: Saint-Tropez to Cavalaire.',
      gallery: [],
    },
    {
      id: 'cannes-lerins-st-tropez-day-4',
      routeFrom: 'Cavalaire',
      routeTo: 'Porquerolles',
      day: 4,
      mapPin: { desktop: { left: 13.2, top: 86.8 }, mobile: { left: 13.2, top: 86.8 } },
      description: 'Day 4: Cavalaire to Porquerolles.',
      gallery: [{ src: '/images/itinerary/france/cote-azur-photos/porquerolles.webp', alt: 'Porquerolles' }],
    },
    {
      id: 'cannes-lerins-st-tropez-day-5',
      routeFrom: 'Porquerolles',
      routeTo: 'Port-Cros',
      day: 5,
      mapPin: { desktop: { left: 29.2, top: 85.8 }, mobile: { left: 29.2, top: 85.8 } },
      description: 'Day 5: Porquerolles to Port-Cros.',
      gallery: [{ src: '/images/itinerary/france/cote-azur-photos/port-cros.webp', alt: 'Port-Cros' }],
    },
    {
      id: 'cannes-lerins-st-tropez-day-6',
      routeFrom: 'Port-Cros',
      routeTo: 'Theoule-sur-Mer',
      day: 6,
      mapPin: { desktop: { left: 77.6, top: 18.9 }, mobile: { left: 77.6, top: 18.9 } },
      description: 'Day 6: Port-Cros to Theoule-sur-Mer.',
      gallery: [],
    },
    {
      id: 'cannes-lerins-st-tropez-day-7',
      routeFrom: 'Theoule-sur-Mer',
      routeTo: 'Cannes',
      day: 7,
      mapPin: { desktop: { left: 84.3, top: 13.2 }, mobile: { left: 84.3, top: 13.2 } },
      description: 'Day 7: Theoule-sur-Mer to Cannes.',
      gallery: [{ src: '/images/itinerary/france/cote-azur-photos/cannes.webp', alt: 'Cannes' }],
    },
  ],
  map: {
    desktop: {
      image: {
        src: '/images/itinerary/france/cote-azur-maps/cannes-lerins-st-tropez-map.webp',
        alt: "Côte d'Azur route map",
      },
      width: 1350,
      height: 1202,
    },
    mobile: {
      image: {
        src: '/images/itinerary/france/cote-azur-maps/cannes-lerins-st-tropez-map.webp',
        alt: "Côte d'Azur route map",
      },
      width: 1350,
      height: 1202,
    },
  },
};

export default computeItineraryNumberOfDays(cannesLerinsStTropezRoute);
