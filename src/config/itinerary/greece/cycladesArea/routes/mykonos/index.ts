import { ItineraryRoute } from '@/types/itinerary.type';

import athensKeySyrosHydraRoute from './athensKeySyrosHydraRoute.config';
import athensMykonosParosRoute from './athensMykonosParosRoute.config';
import athensMykonosSantoriniParosRoute from './athensMykonosSantoriniParosRoute.config';

const mykonosSubarea: ItineraryRoute[] = [
  athensMykonosParosRoute,
  athensKeySyrosHydraRoute,
  athensMykonosSantoriniParosRoute,
];

export default mykonosSubarea;
