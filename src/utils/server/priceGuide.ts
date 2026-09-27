import { cache } from 'react';

import 'server-only';

import { PRICE_GUIDES, PriceGuideCountry } from '@/config/priceGuides.config';
import { VesselType } from '@/models/yacht.model';
import { LocationType } from '@/types/location.type';
import { countryPlaceFor } from '@/utils/server/catalogueHubs';
import { CharterFacts, MonthPrice, fetchCharterFacts } from '@/utils/server/charterFacts';
import {
  DestinationIndex,
  ResolvedDestination,
  loadDestinationIndex,
  resolveDestinationName,
} from '@/utils/server/destinationDid';
import { evaluateLanding } from '@/utils/server/landingGate';
import { LandingManifest, landingManifestWithin } from '@/utils/server/landingManifest';
import { buildSearchLandingPath } from '@/utils/static/searchLandingPath';
import { MIN_RANKED_MONTHS, ShownMonths, monthRanking, reliableMonths } from '@/views/Search/CharterFacts/factsMath';

/**
 * Data of the yacht charter price guides (/yacht-charter-prices/{country}):
 * the country's nightly charter-facts row for all boats plus one per main
 * boat type, reduced to what the page may state (factsMath.ts: full months,
 * real prices, comparable samples, season-true month rankings).
 */

/** Boat types with their own month table, when their row has one. */
export const GUIDE_TYPES: readonly VesselType[] = [
  VesselType.SAILING_YACHT,
  VesselType.CATAMARAN,
  VesselType.MOTOR_YACHT,
];

/**
 * A boat type gets its own table only when its shown months cover half the
 * year: Greece's and Italy's motor-yacht rows price October – December only
 * (the few crewed yachts that publish winter prices), which is not what a
 * week on one costs.
 */
export const MIN_TYPE_TABLE_MONTHS = MIN_RANKED_MONTHS;

export interface GuideTable {
  vesselType: VesselType | null;
  facts: CharterFacts;
  months: MonthPrice[];
  ranking: { cheapest: string | null; priciest: string | null } | null;
  /** Lowest and highest typical (median) week of the shown months. */
  low: number;
  high: number;
}

export interface PriceGuideData {
  guide: PriceGuideCountry;
  /** The all-boats row (activeBoats, skipper, deposit, bases, models…). */
  facts: CharterFacts;
  /** The all-boats month table, or null when no month may be shown. */
  all: GuideTable | null;
  /** Main boat types with a table of their own (GUIDE_TYPES order). */
  types: GuideTable[];
}

const tableOf = (
  facts: CharterFacts,
  vesselType: VesselType | null,
  countryCode: string,
  minMonths: number,
  now: Date
): GuideTable | null => {
  const shown: ShownMonths = reliableMonths(facts, now);

  if (shown.months.length < Math.max(1, minMonths)) return null;

  const medians = shown.months.map(m => Math.round(m.median as number));

  return {
    vesselType,
    facts,
    months: shown.months,
    ranking: monthRanking(shown, countryCode),
    low: Math.min(...medians),
    high: Math.max(...medians),
  };
};

/** One guide's data, or null when the backend has no row for the country (or the fetch failed). */
export const loadPriceGuide = cache(async (guide: PriceGuideCountry): Promise<PriceGuideData | null> => {
  const [facts, ...typeFacts] = await Promise.all([
    fetchCharterFacts(guide.did, null),
    ...GUIDE_TYPES.map(type => fetchCharterFacts(guide.did, type)),
  ]);

  if (!facts) return null;

  const now = new Date();

  return {
    guide,
    facts,
    all: tableOf(facts, null, guide.countryCode, 1, now),
    types: typeFacts
      .map((f, i) => (f ? tableOf(f, GUIDE_TYPES[i], guide.countryCode, MIN_TYPE_TABLE_MONTHS, now) : null))
      .filter((table): table is GuideTable => !!table),
  };
});

/** Every guide with data (the hub); guides without a row are left out. */
export const loadPriceGuides = async (): Promise<PriceGuideData[]> =>
  (await Promise.all(PRICE_GUIDES.map(guide => loadPriceGuide(guide)))).filter(
    (data): data is PriceGuideData => !!data
  );

export interface GuideLanding {
  /** Locale-less canonical landing path. */
  href: string;
  boatType: VesselType | null;
  /** Boats behind the landing (of the type). */
  fleet: number;
}

const MANIFEST_BUDGET_MS = 4000;

/** A catalogue outage (the gate throws CatalogueUnavailableError) drops the link, never the page. */
const orNull = <T>(promise: Promise<T | null>): Promise<T | null> => promise.catch(() => null);

/**
 * Whether a landing is linked from a guide: in the landing manifest (the
 * list the location / category sitemaps are built from) for this locale;
 * while the manifest is not built yet (cold process), the same index gate
 * it is built from (landingGate.ts). Never a noindex landing.
 */
const landingIn = async (
  manifest: LandingManifest | null,
  index: DestinationIndex,
  place: ResolvedDestination,
  boatType: VesselType | null,
  locale: string
): Promise<GuideLanding | null> => {
  if (manifest) {
    const entry = (boatType ? manifest.typed : manifest.destinations).find(
      e => e.name === place.name && (e.boatType ?? null) === boatType && e.locales.includes(locale)
    );

    return entry ? { href: buildSearchLandingPath(entry.name, boatType), boatType, fleet: entry.fleet } : null;
  }

  const gate = await evaluateLanding(place, boatType, index);

  return gate.indexableLocales.includes(locale)
    ? { href: buildSearchLandingPath(place.name, boatType), boatType, fleet: gate.fleet }
    : null;
};

export interface GuideLandings {
  /** The country landing. */
  country: GuideLanding | null;
  /** Its boat-type landings, biggest fleet first. */
  types: GuideLanding[];
  manifest: LandingManifest | null;
  index: DestinationIndex | null;
}

/** The country landing and its indexable boat-type landings in `locale`. */
export const guideLandings = async (guide: PriceGuideCountry, locale: string): Promise<GuideLandings> => {
  const index = await loadDestinationIndex().catch(() => null);
  const place = index ? await countryPlaceFor(index, guide.countryCode).catch(() => null) : null;

  if (!index || !place || place.kind !== LocationType.COUNTRY) {
    return { country: null, types: [], manifest: null, index };
  }

  const manifest = await landingManifestWithin(index, MANIFEST_BUDGET_MS);
  const types: VesselType[] = manifest
    ? manifest.typed.filter(e => e.name === place.name && e.boatType).map(e => e.boatType as VesselType)
    : Object.values(VesselType);
  const [country, ...typed] = await Promise.all([
    orNull(landingIn(manifest, index, place, null, locale)),
    ...types.map(type => orNull(landingIn(manifest, index, place, type, locale))),
  ]);

  return {
    country,
    types: typed.filter((l): l is GuideLanding => !!l).sort((a, b) => b.fleet - a.fleet),
    manifest,
    index,
  };
};

/**
 * Landing of one base (the facts row's did of a catalogue place): the
 * manifest entry of that place in `locale`, else — while the manifest is
 * not built — the index gate. Locale-less path or null.
 */
export const guideBaseLanding = async (
  landings: GuideLandings,
  name: string,
  dids: string[],
  locale: string
): Promise<string | null> => {
  const { manifest, index } = landings;

  if (!index) return null;

  // The name must resolve back to this place — otherwise the landing would
  // list another place's boats (landingLinks.ts, the same rule).
  const hit = await resolveDestinationName(index, name).catch(() => null);
  const place = hit && dids.some(d => hit.dids.includes(d)) ? hit : null;

  if (!place) return null;

  return (await orNull(landingIn(manifest, index, place, null, locale)))?.href ?? null;
};
