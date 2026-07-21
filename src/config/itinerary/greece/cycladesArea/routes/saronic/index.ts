import { ItineraryRoute } from '@/types/itinerary.type';

import athensSaronicGulf14DaysRoute from './athensSaronicGulf14DaysRoute.config';
import athensSaronicGulfPorosRoute from './athensSaronicGulfPorosRoute.config';
import athensSaronicGulfRoute from './athensSaronicGulfRoute.config';

const saronicSubarea: ItineraryRoute[] = [
  athensSaronicGulfRoute,
  athensSaronicGulfPorosRoute,
  athensSaronicGulf14DaysRoute,
];

export default saronicSubarea;
