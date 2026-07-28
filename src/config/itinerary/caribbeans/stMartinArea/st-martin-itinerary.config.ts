import { Itinerary } from '@/types/itinerary.type';

import stMartinRoute from './routes/stMartinRoute.config';

const stmartinItinerary: Itinerary = {
  metaTitle: 'area.metaTitle',
  metaDesc: 'area.metaDescription',
  i18nNamespace: 'itineraryStMartin',
  id: 'st-martin',
  sailingArea: 'St. Martin',
  image: {
    src: '/images/itinerary/caribbeans/destinations/marigot.webp',
    alt: 'St. Martin',
  },
  title: 'area.title',
  backgroundImage: {
    src: '/images/itinerary/caribbeans/st-martin-itinerary/banner.webp',
    alt: 'St. Martin',
  },
  description: 'area.description',
  routes: [stMartinRoute],
};

export default stmartinItinerary;
