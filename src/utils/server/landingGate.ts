import 'server-only';

import { POPULAR_SEARCHES } from '@/config/popular-searches.config';
import { PROMOTED_COUNTRY_CODES, isPromotedCountry } from '@/config/promoted-countries.config';
import { routing } from '@/i18n/routing';
import { VesselType } from '@/models/yacht.model';
import { LocationType } from '@/types/location.type';
import { curatedFileFor } from '@/utils/server/curatedSeoContent';
import {
  DestinationIndex,
  ResolvedDestination,
  fleetCountForDid,
  fleetTotalForDid,
  loadDestinationIndex,
  resolveDestinationName,
} from '@/utils/server/destinationDid';
import { aliasNamesForDestSlug, parseCuratedFileSlug, slugifyDestination } from '@/utils/static/curatedSeoSlug';
import { destinationSlug, isLandingExpressible } from '@/utils/static/searchLandingPath';

/**
 * ONE index predicate for the destination landing pages, shared by the
 * /search generateMetadata (robots + hreflang), the location / category
 * sitemaps and every internal link that should only point at indexable hubs
 * (boat breadcrumb, blog and itinerary link blocks), so the sitemaps submit
 * exactly the URLs the page lets Google index.
 *
 * Owner decision 25.9.2026:
 *   - the 12 promoted countries are always landings (any boats at all);
 *   - every other generated landing — region, base/marina, destination ×
 *     boat type — needs at least MIN_LANDING_FLEET active boats (of that
 *     type, for a type landing) AND unique curated text in that locale.
 *
 * "Unique" means the text is this landing's own: a type landing needs a
 * type page (not the destination overview it falls back to for display),
 * and a place that reads its text through an alias (curatedSeoSlug.ts)
 * loses it when another catalogue place owns that file by name.
 *
 * Only places in the offer (the promoted countries) qualify; a region the
 * catalogue lists without a country (MMK's "Dubrovnik / Montenegro") counts
 * when its whole fleet lies in promoted countries.
 */
export const MIN_LANDING_FLEET = 10;

export interface LandingGate {
  /** Fleet behind the landing (of the boat type, when there is one). */
  fleet: number;
  /** Locales whose landing passes the gate (empty → noindex everywhere). */
  indexableLocales: string[];
}

const NOT_INDEXABLE: LandingGate = { fleet: 0, indexableLocales: [] };
const ALL_LOCALES: string[] = [...routing.locales];
const PROMOTED_CODES = Array.from(PROMOTED_COUNTRY_CODES).join(',');

/** Whole fleet behind `dids` sits in promoted countries (for regions listed
 *  without a country). One cached size=1 query with the backend's country
 *  whitelist, compared with the unfiltered count. */
const fleetIsPromoted = async (dids: string, total: number): Promise<boolean> => {
  if (total <= 0) return false;

  const promoted = await fleetCountForDid(dids, null, PROMOTED_CODES);

  return promoted === total;
};

const slugOwners = new WeakMap<DestinationIndex, Map<string, string[]>>();

/** File-name prefix → catalogue names (and popular labels) that read it by
 *  their own slug. Built once per index. */
export const directOwnersOf = (index: DestinationIndex, destSlug: string): string[] => {
  let map = slugOwners.get(index);

  if (!map) {
    map = new Map();

    const add = (name: string) => {
      const slug = slugifyDestination(name);
      const list = map!.get(slug) ?? [];

      if (!list.includes(name)) list.push(name);

      map!.set(slug, list);
    };

    // byName keys are normalised names ("marina kastela"), which slugify to
    // the same prefix as the display name.
    index.byName.forEach((_, key) => add(key));
    POPULAR_SEARCHES.forEach(spec => add(spec.displayLabel));
    slugOwners.set(index, map);
  }

  return map.get(destSlug) ?? [];
};

/**
 * Whether the text in `file` belongs to the landing `name`. A place that
 * reads the file under its own slug owns it. A place that borrows it through
 * an alias owns it only when no other place resolves to it by name, and —
 * among several borrowers — when it sorts first (deterministic, so exactly
 * one landing carries each text).
 */
const ownsCuratedFile = async (index: DestinationIndex, name: string, file: string): Promise<boolean> => {
  const key = parseCuratedFileSlug(file);

  if (!key) return false;

  const self = destinationSlug(name);
  const others = async (names: string[]) =>
    (await Promise.all(names.map(n => resolveDestinationName(index, n)))).filter(
      (r): r is ResolvedDestination => !!r && destinationSlug(r.name) !== self && isLandingExpressible(r.name)
    );

  if ((await others(directOwnersOf(index, key.dest))).length) return false;

  if (slugifyDestination(name) === key.dest) return true;

  const borrowers = await others(aliasNamesForDestSlug(key.dest));

  return borrowers.every(b => destinationSlug(b.name) > self);
};

const inOffer = async (resolved: ResolvedDestination): Promise<boolean> => {
  if (resolved.countryCode) return isPromotedCountry(resolved.countryCode);

  // Countries always carry a code; a code-less region qualifies when its
  // whole fleet is in promoted countries.
  return resolved.kind !== LocationType.COUNTRY && fleetIsPromoted(resolved.dids.join(','), resolved.count);
};

export const evaluateLanding = async (
  resolved: ResolvedDestination | null,
  boatType: VesselType | null,
  indexArg?: DestinationIndex | null
): Promise<LandingGate> => {
  if (!resolved || !isLandingExpressible(resolved.name)) return NOT_INDEXABLE;

  if (!(await inOffer(resolved))) return NOT_INDEXABLE;

  const dids = resolved.dids.join(',');

  // A promoted country is always a landing (owner rule) — as long as the
  // catalogue has boats there at all (0 = API trouble or an empty page).
  // `resolved.count` comes from /public/countries-count, which also counts
  // boats outside the bookable catalogue (Croatia 5,658 vs 3,866 listed), so
  // the fleet reported (and shown next to links) is the listing total; the
  // count endpoint is only the fallback when that query fails.
  if (!boatType && resolved.kind === LocationType.COUNTRY) {
    const fleet = (await fleetTotalForDid(dids)) ?? resolved.count;

    return { fleet, indexableLocales: fleet > 0 ? ALL_LOCALES : [] };
  }

  // The text check is a directory lookup — do it before the fleet query, so
  // a place × type without its own page costs no API call (the fleet is then
  // reported as unknown: 0 for a type landing; the count endpoint's figure
  // for a place, which callers never display for a hub without a link).
  const files = await Promise.all(
    routing.locales.map(locale => curatedFileFor(locale, resolved.name, boatType, { typeSpecificOnly: !!boatType }))
  );

  if (!files.some(Boolean)) return { fleet: boatType ? 0 : resolved.count, indexableLocales: [] };

  // The gate counts what the landing lists (/public/yachts totalElements):
  // /public/locations-count disagrees both ways (Paros l-151: 10 there, 29
  // listed; Paros port l-1845: 70 there, 44 listed). One cached size=1 query.
  const fleet = await fleetCountForDid(dids, boatType);

  if (fleet < MIN_LANDING_FLEET) return { fleet, indexableLocales: [] };

  const index = indexArg ?? (await loadDestinationIndex());

  if (!index) return { fleet, indexableLocales: [] };

  const owned = await Promise.all(files.map(file => (file ? ownsCuratedFile(index, resolved.name, file) : false)));

  return { fleet, indexableLocales: routing.locales.filter((_, i) => owned[i]) };
};

/**
 * Map with at most `limit` promises in flight — the sitemaps evaluate a few
 * hundred landings, and cusma2 (the only API node) should not get them all at
 * once on a cold Data Cache.
 */
export const mapWithLimit = async <T, R>(items: T[], limit: number, fn: (item: T) => Promise<R>): Promise<R[]> => {
  const results: R[] = new Array(items.length);
  let next = 0;

  const worker = async (): Promise<void> => {
    while (next < items.length) {
      const i = next;

      next += 1;
      // Sequential per worker by design (bounded concurrency).
      // eslint-disable-next-line no-await-in-loop
      results[i] = await fn(items[i]);
    }
  };

  await Promise.all(Array.from({ length: Math.min(limit, items.length) }, worker));

  return results;
};
