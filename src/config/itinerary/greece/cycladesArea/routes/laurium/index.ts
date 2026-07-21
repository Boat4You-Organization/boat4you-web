import { ItineraryRoute } from '@/types/itinerary.type';

import lavrionKeaKythnosSifnosRouteRoute from './lavrionKeaKythnosSifnosRoute.config';
import lavrionMilosSifnos14DaysRouteRoute from './lavrionMilosSifnos14DaysRoute.config';
import lavrionMykonosParosRouteRoute from './lavrionMykonosParosRoute.config';
import lavrionMykonosSantorini14DaysRoute from './lavrionMykonosSantorini14DaysRoute.config';
import mykonosKeaSyrosRouteRoute from './mykonosKeaSyrosRoute.config';
import mykonosNaxosParosKea14DaysRouteRoute from './mykonosNaxosParosKea14DaysRoute.config';
import mykonosNaxosParosRouteRoute from './mykonosNaxosParosRoute.config';

const lauriumSubarea: ItineraryRoute[] = [
  lavrionMilosSifnos14DaysRouteRoute,
  lavrionMykonosSantorini14DaysRoute,
  mykonosNaxosParosKea14DaysRouteRoute,
  lavrionKeaKythnosSifnosRouteRoute,
  lavrionMykonosParosRouteRoute,
  mykonosKeaSyrosRouteRoute,
  mykonosNaxosParosRouteRoute,
];

export default lauriumSubarea;
