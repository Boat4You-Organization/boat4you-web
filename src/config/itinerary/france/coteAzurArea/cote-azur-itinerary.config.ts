import { Itinerary } from '@/types/itinerary.type';

import { cannesLerinsStTropezRoute, rivieraEsterel14Route } from './routes';

const coteAzurItinerary: Itinerary = {
  metaTitle: "Côte d'Azur Sailing Itineraries | Boat4You",
  metaDesc: "Day-by-day charter routes in Côte d'Azur — 7- and 14-day options.",
  id: 'cote-azur',
  sailingArea: "Côte d'Azur",
  image: { src: '/images/itinerary/france/cote-azur-photos/cannes.webp', alt: "Côte d'Azur" },
  title: "Côte d'Azur sailing itineraries",
  backgroundImage: { src: '/images/itinerary/france/cote-azur-photos/cannes.webp', alt: "Côte d'Azur" },
  description: "Charter routes across Côte d'Azur with practical day-by-day notes.",
  routes: [cannesLerinsStTropezRoute, rivieraEsterel14Route],
};

export default coteAzurItinerary;
