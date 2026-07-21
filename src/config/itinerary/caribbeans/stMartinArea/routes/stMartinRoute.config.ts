import { computeItineraryNumberOfDays } from '@/helper/itineraryDaysHelper';
import { ItineraryRoute } from '@/types/itinerary.type';

const stMartinRoute: ItineraryRoute = {
  metaTitle: 'routes.st-martin-route.metaTitle',
  metaDesc: 'routes.st-martin-route.metaDescription',
  i18nNamespace: 'itineraryStMartin',
  id: 'st-martin-route',
  startingPoint: 'Marigot',
  otherPoints: [],
  cardImage: {
    src: '/images/itinerary/caribbeans/st-martin-itinerary/itinerary-card.webp',
    alt: 'St. Martin route card',
  },
  gallery: [
    {
      src: '/images/itinerary/caribbeans/banners/st-martin-banner-large.webp',
      alt: 'St. Martin banner',
    },
    {
      src: '/images/itinerary/caribbeans/banners/st-martin-harbor-banner-large.webp',
      alt: 'St. Martin harbour banner',
    },
    {
      src: '/images/itinerary/caribbeans/banners/st-martin-banner.webp',
      alt: 'St. Martin town banner',
    },
    {
      src: '/images/itinerary/caribbeans/banners/marigot-banner.webp',
      alt: 'Marigot banner',
    },
  ],
  routeDays: [
    {
      id: 'marigot-anse-marcel',
      routeFrom: 'Marigot',
      routeTo: 'Anse Marcel',
      day: 1,
      shortDescription: 'routes.st-martin-route.days.1.shortDescription',
      description: 'routes.st-martin-route.days.1.description',
      thingsToDo: ['routes.st-martin-route.days.1.thingsToDo'],
      mooringTip: 'routes.st-martin-route.days.1.mooringTip',
      gallery: [
        {
          src: '/images/itinerary/caribbeans/destinations/anse-marcel.webp',
          alt: 'Anse Marcel',
        },
      ],
    },
    {
      id: 'anse-marcel-tintamarre-island',
      routeFrom: 'Anse Marcel',
      routeTo: 'Tintamarre Island',
      day: 2,
      shortDescription: 'routes.st-martin-route.days.2.shortDescription',
      description: 'routes.st-martin-route.days.2.description',
      thingsToDo: ['routes.st-martin-route.days.2.thingsToDo'],
      mooringTip: 'routes.st-martin-route.days.2.mooringTip',
      gallery: [
        {
          src: '/images/itinerary/caribbeans/destinations/tintamarre-island.webp',
          alt: 'Tintamarre Island',
        },
      ],
    },
    {
      id: 'tintamarre-island-ile-fourchue',
      routeFrom: 'Tintamarre Island',
      routeTo: 'Île Fourchue',
      day: 3,
      shortDescription: 'routes.st-martin-route.days.3.shortDescription',
      description: 'routes.st-martin-route.days.3.description',
      thingsToDo: ['routes.st-martin-route.days.3.thingsToDo'],
      mooringTip: 'routes.st-martin-route.days.3.mooringTip',
      gallery: [
        {
          src: '/images/itinerary/caribbeans/destinations/ile-fourchue.webp',
          alt: 'Île Fourchue',
        },
      ],
    },
    {
      id: 'ile-fourchue-st-barthelemy-gustavia',
      routeFrom: 'Île Fourchue',
      routeTo: 'St Barthélemy (Gustavia)',
      day: 4,
      shortDescription: 'routes.st-martin-route.days.4.shortDescription',
      description: 'routes.st-martin-route.days.4.description',
      thingsToDo: ['routes.st-martin-route.days.4.thingsToDo'],
      mooringTip: 'routes.st-martin-route.days.4.mooringTip',
      gallery: [
        {
          src: '/images/itinerary/caribbeans/destinations/gustavia.webp',
          alt: 'Gustavia',
        },
      ],
    },
    {
      id: 'gustavia-philipsburg',
      routeFrom: 'Gustavia',
      routeTo: 'Philipsburg',
      day: 5,
      shortDescription: 'routes.st-martin-route.days.5.shortDescription',
      description: 'routes.st-martin-route.days.5.description',
      thingsToDo: ['routes.st-martin-route.days.5.thingsToDo'],
      mooringTip: 'routes.st-martin-route.days.5.mooringTip',
      gallery: [
        {
          src: '/images/itinerary/caribbeans/destinations/philipsburg.webp',
          alt: 'Philipsburg',
        },
      ],
    },
    {
      id: 'philipsburg-marigot',
      routeFrom: 'Philipsburg',
      routeTo: 'Marigot',
      day: 6,
      shortDescription: 'routes.st-martin-route.days.6.shortDescription',
      description: 'routes.st-martin-route.days.6.description',
      thingsToDo: ['routes.st-martin-route.days.6.thingsToDo'],
      mooringTip: 'routes.st-martin-route.days.6.mooringTip',
      gallery: [
        {
          src: '/images/itinerary/caribbeans/destinations/marigot.webp',
          alt: 'Marigot',
        },
      ],
    },
    {
      id: 'marigot-check-out',
      routeFrom: 'Marigot',
      routeTo: 'Check Out',
      day: 7,
      shortDescription: 'routes.st-martin-route.days.7.shortDescription',
      description: 'routes.st-martin-route.days.7.description',
      thingsToDo: ['routes.st-martin-route.days.7.thingsToDo'],
      mooringTip: 'routes.st-martin-route.days.7.mooringTip',
      gallery: [
        {
          src: '/images/itinerary/caribbeans/destinations/marigot.webp',
          alt: 'Marigot',
        },
      ],
    },
  ],
  map: {
    desktop: {
      image: {
        src: '/images/itinerary/caribbeans/st-martin-itinerary/map.webp',
        alt: 'St. Martin Route map',
      },
      width: 1255,
      height: 1009,
    },
    mobile: {
      image: {
        src: '/images/itinerary/caribbeans/st-martin-itinerary/mobile-map.webp',
        alt: 'St. Martin Route map',
      },
      width: 1255,
      height: 1009,
    },
  },
};

export default computeItineraryNumberOfDays(stMartinRoute);
