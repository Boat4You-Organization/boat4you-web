import { computeItineraryNumberOfDays } from '@/helper/itineraryDaysHelper';
import { ItineraryRoute } from '@/types/itinerary.type';

const phuketPhangNgaWeekRoute: ItineraryRoute = {
  metaTitle: '7-Day Yacht Haven (Phuket) Route | Boat4You',
  metaDesc: '7-day itinerary from Yacht Haven (Phuket).',
  id: 'phuket-phang-nga-week',
  startingPoint: 'Yacht Haven (Phuket)',
  otherPoints: ['Ko Hong (Phang Nga)', 'Ko Phi Phi Don'],
  cardImage: { src: '/images/itinerary/thailand/thailand-photos/thailand-andaman.webp', alt: 'Thailand (Andaman Sea)' },
  gallery: [],
  routeDays: [
    {
      id: 'phuket-phang-nga-week-day-1',
      routeFrom: 'Yacht Haven (Phuket)',
      routeTo: 'Ko Phanak',
      day: 1,
      mapPin: { desktop: { left: 35.0, top: 18.2 }, mobile: { left: 35.0, top: 18.2 } },
      description: 'Day 1: Yacht Haven (Phuket) to Ko Phanak.',
      gallery: [],
    },
    {
      id: 'phuket-phang-nga-week-day-2',
      routeFrom: 'Ko Phanak',
      routeTo: 'Ko Hong (Phang Nga)',
      day: 2,
      mapPin: { desktop: { left: 36.8, top: 13.2 }, mobile: { left: 36.8, top: 13.2 } },
      description: 'Day 2: Ko Phanak to Ko Hong (Phang Nga).',
      gallery: [
        { src: '/images/itinerary/thailand/thailand-photos/phang-nga-bay-karsts.webp', alt: 'Ko Hong (Phang Nga)' },
      ],
    },
    {
      id: 'phuket-phang-nga-week-day-3',
      routeFrom: 'Ko Hong (Phang Nga)',
      routeTo: 'Ko Yao Noi',
      day: 3,
      mapPin: { desktop: { left: 51.5, top: 31.3 }, mobile: { left: 51.5, top: 31.3 } },
      description: 'Day 3: Ko Hong (Phang Nga) to Ko Yao Noi.',
      gallery: [],
    },
    {
      id: 'phuket-phang-nga-week-day-4',
      routeFrom: 'Ko Yao Noi',
      routeTo: 'Railay (Krabi)',
      day: 4,
      mapPin: { desktop: { left: 86.8, top: 46.2 }, mobile: { left: 86.8, top: 46.2 } },
      description: 'Day 4: Ko Yao Noi to Railay (Krabi).',
      gallery: [{ src: '/images/itinerary/thailand/thailand-photos/railay-krabi.webp', alt: 'Railay (Krabi)' }],
    },
    {
      id: 'phuket-phang-nga-week-day-5',
      routeFrom: 'Railay (Krabi)',
      routeTo: 'Ko Phi Phi Don',
      day: 5,
      mapPin: { desktop: { left: 78.0, top: 86.8 }, mobile: { left: 78.0, top: 86.8 } },
      description: 'Day 5: Railay (Krabi) to Ko Phi Phi Don.',
      gallery: [],
    },
    {
      id: 'phuket-phang-nga-week-day-6',
      routeFrom: 'Ko Phi Phi Don',
      routeTo: 'Ko Rang Yai',
      day: 6,
      mapPin: { desktop: { left: 29.3, top: 53.8 }, mobile: { left: 29.3, top: 53.8 } },
      description: 'Day 6: Ko Phi Phi Don to Ko Rang Yai.',
      gallery: [],
    },
    {
      id: 'phuket-phang-nga-week-day-7',
      routeFrom: 'Ko Rang Yai',
      routeTo: 'Yacht Haven (Phuket)',
      day: 7,
      mapPin: { desktop: { left: 13.2, top: 21.2 }, mobile: { left: 13.2, top: 21.2 } },
      description: 'Day 7: Ko Rang Yai to Yacht Haven (Phuket).',
      gallery: [],
    },
  ],
  map: {
    desktop: {
      image: {
        src: '/images/itinerary/thailand/thailand-maps/phuket-phang-nga-week-map.webp',
        alt: 'Thailand (Andaman Sea) route map',
      },
      width: 1350,
      height: 1346,
    },
    mobile: {
      image: {
        src: '/images/itinerary/thailand/thailand-maps/phuket-phang-nga-week-map.webp',
        alt: 'Thailand (Andaman Sea) route map',
      },
      width: 1350,
      height: 1346,
    },
  },
};

export default computeItineraryNumberOfDays(phuketPhangNgaWeekRoute);
