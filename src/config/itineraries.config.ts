import { bahamasItinerary, bviItinerary, grenadaItinerary, martiniqueItinerary } from '@/config/itinerary/caribbeans';
import {
  dubrovnikItinerary,
  istriaItinerary,
  sibenikItinerary,
  splitItinerary,
  zadarItinerary,
} from '@/config/itinerary/croatia';
import { cycladesItinerary, dodecaneseItinerary, ionianItinerary, skiathosItinerary } from '@/config/itinerary/greece';
import { cataloniaItinerary, ibizaItinerary, mallorcaItinerary } from '@/config/itinerary/spain';
import { namespaceForCountry } from '@/helper/itineraryI18n';
import { Itineraries } from '@/types/itinerary.type';

import {
  atlanticFranceItinerary,
  corsicaItinerary,
  coteAzurItinerary,
  frenchCanalsItinerary,
} from './itinerary/france';
import { germanyItinerary } from './itinerary/germany';
import { amalfiItinerary, sardiniaItinerary, sicilyItinerary } from './itinerary/italy';
import { montenegroItinerary } from './itinerary/montenegro';
import { netherlandsItinerary } from './itinerary/netherlands';
import { seychellesItinerary } from './itinerary/seychelles';
import { thailandItinerary } from './itinerary/thailand';
import { bodrumItinerary, gocekItinerary } from './itinerary/turkey';

// Raw country-grouped config. Text lives in the per-country config files
// (English); per-locale copy is layered on at render time via the
// `itineraryCroatia`/`itineraryGreece`/... namespaces. Boat4You extends
// the EY five-country set with a Caribbean group (bahamas, bvi, grenada,
// martinique — st-martin stays unwired).
const rawItineraries: Itineraries[] = [
  {
    country: 'Croatia',
    itinerary: [splitItinerary, dubrovnikItinerary, sibenikItinerary, istriaItinerary, zadarItinerary],
  },
  {
    country: 'Greece',
    itinerary: [cycladesItinerary, ionianItinerary, skiathosItinerary, dodecaneseItinerary],
  },
  {
    country: 'Turkey',
    itinerary: [bodrumItinerary, gocekItinerary],
  },
  {
    country: 'Spain',
    itinerary: [cataloniaItinerary, ibizaItinerary, mallorcaItinerary],
  },
  {
    country: 'France',
    itinerary: [coteAzurItinerary, corsicaItinerary, atlanticFranceItinerary, frenchCanalsItinerary],
  },
  {
    country: 'Montenegro',
    itinerary: [montenegroItinerary],
  },
  {
    country: 'Seychelles',
    itinerary: [seychellesItinerary],
  },
  {
    country: 'Thailand',
    itinerary: [thailandItinerary],
  },
  {
    country: 'Netherlands',
    itinerary: [netherlandsItinerary],
  },
  {
    country: 'Germany',
    itinerary: [germanyItinerary],
  },
  {
    country: 'Italy',
    itinerary: [amalfiItinerary, sardiniaItinerary, sicilyItinerary],
  },
  {
    country: 'Caribbean',
    itinerary: [bahamasItinerary, bviItinerary, grenadaItinerary, martiniqueItinerary],
  },
];

/**
 * Stamp the per-country next-intl namespace onto every area + route so
 * the shared render components (and metadata/JSON-LD builders) can read
 * localized copy via `@/helper/itineraryI18n` resolve* helpers WITHOUT
 * any edit to the per-country config files. The namespace is derived
 * from the group `country` via `namespaceForCountry`. Structure (ids,
 * coords, images, day counts) is untouched — only the namespace tag is
 * added; resolve* helpers fall back to the raw config string when a key
 * is absent, so unmigrated countries render exactly as before.
 */
export const itineraries: Itineraries[] = rawItineraries.map(group => {
  const i18nNamespace = namespaceForCountry(group.country);

  return {
    ...group,
    itinerary: group.itinerary.map(area => ({
      ...area,
      i18nNamespace,
      routes: area.routes.map(route => ({ ...route, i18nNamespace })),
    })),
  };
});
