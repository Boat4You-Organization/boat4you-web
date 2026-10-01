import type { Messages } from 'next-intl';

import type { VesselType } from '@/models/yacht.model';

/**
 * Link hub at the bottom of the home page ("Explore boat rental
 * destinations", Mario 30.9.2026, after Borrow a Boat's "Explore Boating
 * Adventures"): keyword anchors to our indexable pages, every link in the
 * server-rendered HTML (tabs and "Show more" are CSS only), so Google reads
 * each anchor and its target. Rendered by src/views/Home/HomeLinkHub.
 *
 * Curated list (verified 30.9.2026: every target 200, index, self-canonical
 * and in its sitemap in all 9 locales). At render time a link is dropped
 * when its page stops being indexable in that locale (homeHubLinks.ts):
 *   - `landing` — a /search destination landing, by its canonical
 *     destination name (lower case, as in the sitemap <loc>) and optional
 *     boat type; linked only while the landing manifest lists it for the
 *     locale, through the sitemap's URL builder (searchLandingPath.ts);
 *   - `path` — an itinerary area, a price guide or a /yachts model page;
 *     linked only while that page exists (itineraries / price guide
 *     config, the model catalogue).
 *
 * Anchors live in messages/<locale>/homeHub.json under `links.<id>`.
 * Keyword ownership (hard rule): no anchor or heading in any locale names a
 * sister site's head term ("catamaran charter Croatia/Greece/Italy/
 * Caribbean/BVI", "yacht charter Croatia/Greece/Italy/Spain/Türkiye") or its
 * translation — `yarn check:home-hub` (scripts/check-home-hub.mjs) enforces
 * it, plus complete and unique anchors per locale. "Yacht charter Split" is
 * ours. No counts in anchors, no title attributes, no nofollow.
 *
 * This file must stay free of runtime imports (type-only imports): the
 * check script transpiles and evaluates it on its own.
 */

export type HomeHubTabKey = keyof Messages['homeHub']['tabs'];

export type HomeHubLinkId = keyof Messages['homeHub']['links'];

export type HomeHubLink =
  | {
      id: HomeHubLinkId;
      kind: 'landing';
      /** Canonical destination name, lower case ("split region", "šibenik"). */
      destinations: string;
      boatType?: `${VesselType}`;
    }
  | {
      id: HomeHubLinkId;
      kind: 'path';
      /** Locale-less path ("/itineraries/split"). */
      path: string;
    };

export interface HomeHubTab {
  key: HomeHubTabKey;
  links: readonly HomeHubLink[];
}

/** Links of a tab shown before "Show more" (the rest stay in the HTML). */
export const HOME_HUB_VISIBLE_LINKS = 12;

export const HOME_HUB_TABS: readonly HomeHubTab[] = [
  {
    key: 'regions',
    links: [
      { id: 'split-region', kind: 'landing', destinations: 'split region' },
      { id: 'kornati', kind: 'landing', destinations: 'kornati' },
      { id: 'zadar', kind: 'landing', destinations: 'zadar' },
      { id: 'sibenik', kind: 'landing', destinations: 'šibenik' },
      { id: 'istria-kvarner', kind: 'landing', destinations: 'istria / kvarner' },
      { id: 'dubrovnik-region', kind: 'landing', destinations: 'dubrovnik region' },
      { id: 'ionian-region', kind: 'landing', destinations: 'ionian region' },
      { id: 'athens-saronic-gulf', kind: 'landing', destinations: 'athens / saronic gulf' },
      { id: 'cyclades', kind: 'landing', destinations: 'cyclades' },
      { id: 'dodecanese', kind: 'landing', destinations: 'dodecanese' },
      { id: 'sporades', kind: 'landing', destinations: 'sporades' },
      { id: 'sardinia', kind: 'landing', destinations: 'sardinia' },
      { id: 'sicily', kind: 'landing', destinations: 'sicily' },
      { id: 'campania', kind: 'landing', destinations: 'campania' },
      { id: 'liguria-toscana', kind: 'landing', destinations: 'liguria / toscana' },
      { id: 'balearic-islands', kind: 'landing', destinations: 'balearic islands' },
      { id: 'mallorca', kind: 'landing', destinations: 'mallorca' },
      { id: 'ibiza', kind: 'landing', destinations: 'ibiza' },
      { id: 'catalonia', kind: 'landing', destinations: 'catalonia' },
      { id: 'canary-islands', kind: 'landing', destinations: 'canary islands' },
      { id: 'french-riviera-cote-d-azur', kind: 'landing', destinations: "french riviera (côte d'azur)" },
      { id: 'corsica', kind: 'landing', destinations: 'corsica' },
      { id: 'bretagne', kind: 'landing', destinations: 'bretagne' },
      { id: 'marmaris-fethiye-gocek', kind: 'landing', destinations: 'marmaris / fethiye / gocek' },
      { id: 'bodrum', kind: 'landing', destinations: 'bodrum' },
    ],
  },
  {
    key: 'boatsByCountry',
    links: [
      { id: 'croatia-sailing-yacht', kind: 'landing', destinations: 'croatia', boatType: 'SAILING_YACHT' },
      { id: 'croatia-catamaran', kind: 'landing', destinations: 'croatia', boatType: 'CATAMARAN' },
      { id: 'croatia-motorboat', kind: 'landing', destinations: 'croatia', boatType: 'MOTORBOAT' },
      { id: 'croatia-motor-yacht', kind: 'landing', destinations: 'croatia', boatType: 'MOTOR_YACHT' },
      { id: 'croatia-gulet', kind: 'landing', destinations: 'croatia', boatType: 'GULET' },
      { id: 'greece-sailing-yacht', kind: 'landing', destinations: 'greece', boatType: 'SAILING_YACHT' },
      { id: 'greece-catamaran', kind: 'landing', destinations: 'greece', boatType: 'CATAMARAN' },
      { id: 'greece-motor-yacht', kind: 'landing', destinations: 'greece', boatType: 'MOTOR_YACHT' },
      { id: 'greece-motorboat', kind: 'landing', destinations: 'greece', boatType: 'MOTORBOAT' },
      { id: 'italy-sailing-yacht', kind: 'landing', destinations: 'italy', boatType: 'SAILING_YACHT' },
      { id: 'italy-catamaran', kind: 'landing', destinations: 'italy', boatType: 'CATAMARAN' },
      { id: 'italy-motorboat', kind: 'landing', destinations: 'italy', boatType: 'MOTORBOAT' },
      { id: 'italy-motor-yacht', kind: 'landing', destinations: 'italy', boatType: 'MOTOR_YACHT' },
      { id: 'turkey-gulet', kind: 'landing', destinations: 'turkey', boatType: 'GULET' },
      { id: 'turkey-sailing-yacht', kind: 'landing', destinations: 'turkey', boatType: 'SAILING_YACHT' },
      { id: 'turkey-catamaran', kind: 'landing', destinations: 'turkey', boatType: 'CATAMARAN' },
      { id: 'spain-sailing-yacht', kind: 'landing', destinations: 'spain', boatType: 'SAILING_YACHT' },
      { id: 'spain-catamaran', kind: 'landing', destinations: 'spain', boatType: 'CATAMARAN' },
      { id: 'spain-motorboat', kind: 'landing', destinations: 'spain', boatType: 'MOTORBOAT' },
      { id: 'france-sailing-yacht', kind: 'landing', destinations: 'france', boatType: 'SAILING_YACHT' },
      { id: 'france-catamaran', kind: 'landing', destinations: 'france', boatType: 'CATAMARAN' },
      {
        id: 'british-virgin-islands-sailing-yacht',
        kind: 'landing',
        destinations: 'british virgin islands',
        boatType: 'SAILING_YACHT',
      },
      {
        id: 'british-virgin-islands-catamaran',
        kind: 'landing',
        destinations: 'british virgin islands',
        boatType: 'CATAMARAN',
      },
      { id: 'seychelles-catamaran', kind: 'landing', destinations: 'seychelles', boatType: 'CATAMARAN' },
      { id: 'martinique-catamaran', kind: 'landing', destinations: 'martinique', boatType: 'CATAMARAN' },
    ],
  },
  {
    key: 'boatsByRegion',
    links: [
      { id: 'split-region-sailing-yacht', kind: 'landing', destinations: 'split region', boatType: 'SAILING_YACHT' },
      { id: 'split-region-catamaran', kind: 'landing', destinations: 'split region', boatType: 'CATAMARAN' },
      { id: 'split-region-motorboat', kind: 'landing', destinations: 'split region', boatType: 'MOTORBOAT' },
      { id: 'kornati-sailing-yacht', kind: 'landing', destinations: 'kornati', boatType: 'SAILING_YACHT' },
      { id: 'zadar-sailing-yacht', kind: 'landing', destinations: 'zadar', boatType: 'SAILING_YACHT' },
      { id: 'sibenik-sailing-yacht', kind: 'landing', destinations: 'šibenik', boatType: 'SAILING_YACHT' },
      { id: 'sibenik-catamaran', kind: 'landing', destinations: 'šibenik', boatType: 'CATAMARAN' },
      {
        id: 'istria-kvarner-sailing-yacht',
        kind: 'landing',
        destinations: 'istria / kvarner',
        boatType: 'SAILING_YACHT',
      },
      {
        id: 'dubrovnik-region-sailing-yacht',
        kind: 'landing',
        destinations: 'dubrovnik region',
        boatType: 'SAILING_YACHT',
      },
      { id: 'ionian-region-sailing-yacht', kind: 'landing', destinations: 'ionian region', boatType: 'SAILING_YACHT' },
      { id: 'ionian-region-catamaran', kind: 'landing', destinations: 'ionian region', boatType: 'CATAMARAN' },
      {
        id: 'athens-saronic-gulf-sailing-yacht',
        kind: 'landing',
        destinations: 'athens / saronic gulf',
        boatType: 'SAILING_YACHT',
      },
      {
        id: 'athens-saronic-gulf-catamaran',
        kind: 'landing',
        destinations: 'athens / saronic gulf',
        boatType: 'CATAMARAN',
      },
      { id: 'cyclades-sailing-yacht', kind: 'landing', destinations: 'cyclades', boatType: 'SAILING_YACHT' },
      { id: 'cyclades-catamaran', kind: 'landing', destinations: 'cyclades', boatType: 'CATAMARAN' },
      { id: 'dodecanese-sailing-yacht', kind: 'landing', destinations: 'dodecanese', boatType: 'SAILING_YACHT' },
      { id: 'sporades-sailing-yacht', kind: 'landing', destinations: 'sporades', boatType: 'SAILING_YACHT' },
      { id: 'sicily-sailing-yacht', kind: 'landing', destinations: 'sicily', boatType: 'SAILING_YACHT' },
      { id: 'sicily-catamaran', kind: 'landing', destinations: 'sicily', boatType: 'CATAMARAN' },
      { id: 'sardinia-sailing-yacht', kind: 'landing', destinations: 'sardinia', boatType: 'SAILING_YACHT' },
      { id: 'sardinia-catamaran', kind: 'landing', destinations: 'sardinia', boatType: 'CATAMARAN' },
      {
        id: 'balearic-islands-sailing-yacht',
        kind: 'landing',
        destinations: 'balearic islands',
        boatType: 'SAILING_YACHT',
      },
      { id: 'balearic-islands-catamaran', kind: 'landing', destinations: 'balearic islands', boatType: 'CATAMARAN' },
      {
        id: 'marmaris-fethiye-gocek-sailing-yacht',
        kind: 'landing',
        destinations: 'marmaris / fethiye / gocek',
        boatType: 'SAILING_YACHT',
      },
      {
        id: 'marmaris-fethiye-gocek-gulet',
        kind: 'landing',
        destinations: 'marmaris / fethiye / gocek',
        boatType: 'GULET',
      },
    ],
  },
  {
    key: 'marinas',
    links: [
      {
        id: 'd-marin-dalmacija-marina-sailing-yacht',
        kind: 'landing',
        destinations: 'd-marin dalmacija marina',
        boatType: 'SAILING_YACHT',
      },
      {
        id: 'marina-kornati-sailing-yacht',
        kind: 'landing',
        destinations: 'marina kornati',
        boatType: 'SAILING_YACHT',
      },
      {
        id: 'marina-kastela-sailing-yacht',
        kind: 'landing',
        destinations: 'marina kastela',
        boatType: 'SAILING_YACHT',
      },
      {
        id: 'aci-marina-split-sailing-yacht',
        kind: 'landing',
        destinations: 'aci marina split',
        boatType: 'SAILING_YACHT',
      },
      {
        id: 'aci-marina-trogir-sailing-yacht',
        kind: 'landing',
        destinations: 'aci marina trogir',
        boatType: 'SAILING_YACHT',
      },
      { id: 'marina-punat-sailing-yacht', kind: 'landing', destinations: 'marina punat', boatType: 'SAILING_YACHT' },
      {
        id: 'd-marin-marina-mandalina-sailing-yacht',
        kind: 'landing',
        destinations: 'd-marin marina mandalina',
        boatType: 'SAILING_YACHT',
      },
      { id: 'marina-kremik-sailing-yacht', kind: 'landing', destinations: 'marina kremik', boatType: 'SAILING_YACHT' },
      { id: 'marina-frapa-catamaran', kind: 'landing', destinations: 'marina frapa', boatType: 'CATAMARAN' },
      {
        id: 'aci-marina-dubrovnik-catamaran',
        kind: 'landing',
        destinations: 'aci marina dubrovnik',
        boatType: 'CATAMARAN',
      },
      { id: 'alimos-marina-sailing-yacht', kind: 'landing', destinations: 'alimos marina', boatType: 'SAILING_YACHT' },
      { id: 'alimos-marina-catamaran', kind: 'landing', destinations: 'alimos marina', boatType: 'CATAMARAN' },
      {
        id: 'd-marin-marina-lefkas-sailing-yacht',
        kind: 'landing',
        destinations: 'd-marin marina lefkas',
        boatType: 'SAILING_YACHT',
      },
      {
        id: 'd-marin-marina-gouvia-sailing-yacht',
        kind: 'landing',
        destinations: 'd-marin marina gouvia',
        boatType: 'SAILING_YACHT',
      },
      { id: 'port-of-volos-sailing-yacht', kind: 'landing', destinations: 'port of volos', boatType: 'SAILING_YACHT' },
      {
        id: 'marina-portorosa-sailing-yacht',
        kind: 'landing',
        destinations: 'marina portorosa',
        boatType: 'SAILING_YACHT',
      },
      {
        id: 'capo-d-orlando-marina-catamaran',
        kind: 'landing',
        destinations: "capo d'orlando marina",
        boatType: 'CATAMARAN',
      },
      {
        id: 'marina-di-portisco-sailing-yacht',
        kind: 'landing',
        destinations: 'marina di portisco',
        boatType: 'SAILING_YACHT',
      },
      { id: 'ece-marina-sailing-yacht', kind: 'landing', destinations: 'ece marina', boatType: 'SAILING_YACHT' },
      {
        id: 'la-lonja-marina-charter-sailing-yacht',
        kind: 'landing',
        destinations: 'la lonja marina charter',
        boatType: 'SAILING_YACHT',
      },
    ],
  },
  {
    key: 'routesPrices',
    links: [
      { id: 'yacht-charter-prices-croatia', kind: 'path', path: '/yacht-charter-prices/croatia' },
      { id: 'yacht-charter-prices-greece', kind: 'path', path: '/yacht-charter-prices/greece' },
      { id: 'yacht-charter-prices-italy', kind: 'path', path: '/yacht-charter-prices/italy' },
      { id: 'itineraries-split', kind: 'path', path: '/itineraries/split' },
      { id: 'itineraries-dubrovnik', kind: 'path', path: '/itineraries/dubrovnik' },
      { id: 'itineraries-sibenik', kind: 'path', path: '/itineraries/sibenik' },
      { id: 'itineraries-istria', kind: 'path', path: '/itineraries/istria' },
      { id: 'itineraries-zadar', kind: 'path', path: '/itineraries/zadar' },
      { id: 'itineraries-cyclades', kind: 'path', path: '/itineraries/cyclades' },
      { id: 'itineraries-ionian', kind: 'path', path: '/itineraries/ionian' },
      { id: 'itineraries-sporades', kind: 'path', path: '/itineraries/sporades' },
      { id: 'itineraries-dodecanese', kind: 'path', path: '/itineraries/dodecanese' },
      { id: 'itineraries-bodrum', kind: 'path', path: '/itineraries/bodrum' },
      { id: 'itineraries-gocek', kind: 'path', path: '/itineraries/gocek' },
      { id: 'itineraries-catalonia', kind: 'path', path: '/itineraries/catalonia' },
      { id: 'itineraries-ibiza', kind: 'path', path: '/itineraries/ibiza' },
      { id: 'itineraries-mallorca', kind: 'path', path: '/itineraries/mallorca' },
      { id: 'itineraries-cote-azur', kind: 'path', path: '/itineraries/cote-azur' },
      { id: 'itineraries-montenegro', kind: 'path', path: '/itineraries/montenegro' },
      { id: 'itineraries-seychelles', kind: 'path', path: '/itineraries/seychelles' },
      { id: 'itineraries-amalfi', kind: 'path', path: '/itineraries/amalfi' },
      { id: 'itineraries-sardinia', kind: 'path', path: '/itineraries/sardinia' },
      { id: 'itineraries-sicily', kind: 'path', path: '/itineraries/sicily' },
      { id: 'itineraries-bvi', kind: 'path', path: '/itineraries/bvi' },
      { id: 'itineraries-martinique', kind: 'path', path: '/itineraries/martinique' },
    ],
  },
  {
    key: 'models',
    links: [
      { id: 'yachts-lagoon-lagoon-42', kind: 'path', path: '/yachts/lagoon/lagoon-42' },
      { id: 'yachts-bavaria-bavaria-cruiser-46', kind: 'path', path: '/yachts/bavaria/bavaria-cruiser-46' },
      { id: 'yachts-lagoon-lagoon-46', kind: 'path', path: '/yachts/lagoon/lagoon-46' },
      { id: 'yachts-beneteau-beneteau-oceanis-46-1', kind: 'path', path: '/yachts/beneteau/beneteau-oceanis-46-1' },
      {
        id: 'yachts-jeanneau-jeanneau-sun-odyssey-410',
        kind: 'path',
        path: '/yachts/jeanneau/jeanneau-sun-odyssey-410',
      },
      {
        id: 'yachts-jeanneau-jeanneau-sun-odyssey-440',
        kind: 'path',
        path: '/yachts/jeanneau/jeanneau-sun-odyssey-440',
      },
      { id: 'yachts-lagoon-lagoon-40', kind: 'path', path: '/yachts/lagoon/lagoon-40' },
      { id: 'yachts-beneteau-beneteau-oceanis-51-1', kind: 'path', path: '/yachts/beneteau/beneteau-oceanis-51-1' },
      { id: 'yachts-beneteau-beneteau-oceanis-40-1', kind: 'path', path: '/yachts/beneteau/beneteau-oceanis-40-1' },
      { id: 'yachts-dufour-dufour-460-gl', kind: 'path', path: '/yachts/dufour/dufour-460-gl' },
      { id: 'yachts-bali-bali-catspace', kind: 'path', path: '/yachts/bali/bali-catspace' },
      { id: 'yachts-bali-bali-4-6', kind: 'path', path: '/yachts/bali/bali-4-6' },
      { id: 'yachts-bali-bali-4-2', kind: 'path', path: '/yachts/bali/bali-4-2' },
      { id: 'yachts-dufour-dufour-470', kind: 'path', path: '/yachts/dufour/dufour-470' },
      { id: 'yachts-bavaria-bavaria-cruiser-41', kind: 'path', path: '/yachts/bavaria/bavaria-cruiser-41' },
      { id: 'yachts-lagoon-lagoon-450f', kind: 'path', path: '/yachts/lagoon/lagoon-450f' },
      { id: 'yachts-bavaria-bavaria-cruiser-51', kind: 'path', path: '/yachts/bavaria/bavaria-cruiser-51' },
      {
        id: 'yachts-jeanneau-jeanneau-sun-odyssey-490',
        kind: 'path',
        path: '/yachts/jeanneau/jeanneau-sun-odyssey-490',
      },
      { id: 'yachts-dufour-dufour-41', kind: 'path', path: '/yachts/dufour/dufour-41' },
      { id: 'yachts-bavaria-bavaria-cruiser-37', kind: 'path', path: '/yachts/bavaria/bavaria-cruiser-37' },
    ],
  },
];
