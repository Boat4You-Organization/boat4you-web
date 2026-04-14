import { LocationType } from '@/types/location.type';

export interface PopularSearchMember {
  /** Exact name to match against LocationView.name (case-insensitive). */
  name: string;
  /**
   * Query term sent to the backend `?name=` param. Defaults to `name`.
   * Useful when several members share one API lookup — e.g. all Preveza marinas
   * share `searchName: "Preveza"` so the backend is hit once, not N times.
   */
  searchName?: string;
  /** Preferred location type (fallbacks relax this if the backend classifies differently). */
  locationType: LocationType;
  /** Optional country code filter for extra precision. */
  countryCode?: string;
  /**
   * When true, include EVERY candidate matching (name + type + country),
   * not just the first. Needed when the backend stores the same place once
   * per external provider (e.g. "Ionian" region exists as separate records
   * for MMK and NauSYS) — we want all of them so the search covers both.
   */
  all?: boolean;
}

export interface PopularSearchSpec {
  /** Stable key for the entry — used as a synthetic option id in the dropdown. */
  key: string;
  /** Label rendered in the dropdown (may differ from raw API names). */
  displayLabel: string;
  /** Country code for the flag next to the label. */
  countryCode?: string;
  /** Type used for the inline coloured tag next to the label. */
  primaryType: LocationType;
  /** One or more real locations added to the form when this entry is picked. */
  members: PopularSearchMember[];
}

/**
 * Fixed "Most popular searches" shown in the location dropdown.
 * Order here is the order rendered in the UI. An entry may have multiple
 * members — clicking the entry selects all of them at once.
 */
export const POPULAR_SEARCHES: PopularSearchSpec[] = [
  {
    key: 'croatia',
    displayLabel: 'Croatia',
    countryCode: 'HR',
    primaryType: LocationType.COUNTRY,
    members: [{ name: 'Croatia', locationType: LocationType.COUNTRY, countryCode: 'HR' }],
  },
  {
    key: 'greece',
    displayLabel: 'Greece',
    countryCode: 'GR',
    primaryType: LocationType.COUNTRY,
    members: [{ name: 'Greece', locationType: LocationType.COUNTRY, countryCode: 'GR' }],
  },
  {
    key: 'split-region',
    displayLabel: 'Split Region',
    countryCode: 'HR',
    primaryType: LocationType.REGION,
    members: [{ name: 'Split', locationType: LocationType.REGION, countryCode: 'HR' }],
  },
  {
    key: 'italy',
    displayLabel: 'Italy',
    countryCode: 'IT',
    primaryType: LocationType.COUNTRY,
    members: [{ name: 'Italy', locationType: LocationType.COUNTRY, countryCode: 'IT' }],
  },
  {
    key: 'ionian-region',
    displayLabel: 'Ionian Region',
    countryCode: 'GR',
    primaryType: LocationType.REGION,
    // The Ionian region covers Lefkas, Preveza, Corfu, Zakynthos etc.
    // `all: true` pulls EVERY Ionian region record — the backend aggregates
    // two external providers (MMK + NauSYS), each registering its own
    // "Ionian" region. Taking both means yachts from both providers show up.
    members: [{ name: 'Ionian', locationType: LocationType.REGION, countryCode: 'GR', all: true }],
  },
];
