import { ItineraryRoute } from '@/types/itinerary.type';

import mykanosSirosMilosIos14DaysRoute from './mykanosSirosMilosIos14DaysRoute.config';
import parosIosSantoriniRoute from './parosIosSantoriniRoute.config';
import parosMilosSantoriniSyrosRoute14DaysRoute from './parosMilosSantoriniSyrosRoute14Days.config';
import parosNaxosSchoinousaRoute from './parosNaxosSchoinousaRoute.config';
import parosSyrosMykonosRoute from './parosSyrosMykonosRoute.config';
import santoriniMilosParosRouteRoute from './santoriniMilosParosRoute.config';
import santoriniMykonosMilos14DaysRoute from './santoriniMykonosMilos14Days.config';

const parosSubarea: ItineraryRoute[] = [
  mykanosSirosMilosIos14DaysRoute,
  parosMilosSantoriniSyrosRoute14DaysRoute,
  santoriniMykonosMilos14DaysRoute,
  parosIosSantoriniRoute,
  parosNaxosSchoinousaRoute,
  parosSyrosMykonosRoute,
  santoriniMilosParosRouteRoute,
];

export default parosSubarea;
