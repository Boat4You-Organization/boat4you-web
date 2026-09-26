import { cache } from 'react';

import 'server-only';

import { LANDING_IDENTITIES, LandingIdentity } from '@/config/landing-identity.config';
import { POPULAR_SEARCHES } from '@/config/popular-searches.config';
import { LocationType } from '@/types/location.type';
import { normalizeDestinationName } from '@/utils/static/searchLandingPath';

/**
 * Server-side `?destinations=<name>` → `did` resolution for /search.
 *
 * The backend `/public/yachts` filters ONLY by `did` (c-<country>,
 * r-<region>, l-<marina>). The indexable landing URLs carry just the
 * lowercased name (`/search?destinations=greece`), so before 25.9.2026 they
 * rendered the whole 13.6K catalogue (Croatian boats first) under a Greece
 * heading — for Googlebot and for visitors. The search page now resolves the
 * name here and passes the did on to every yacht fetch.
 *
 * Lookup lists: `/public/locations` (every country, region and marina, one
 * call), plus the fleet sizes from `/public/countries-count` and
 * `/public/locations-count` — the same lists the location sitemap reads.
 * All cached in the Data Cache for an hour, so a landing request does not
 * refetch them. Regions have no count endpoint; when a region is among the
 * same-named candidates its fleet is counted with a size=1 yacht query
 * (also cached an hour), exactly like the itinerary CTA resolver.
 */

const REVALIDATE_SECONDS = 3600;
const LOCATIONS_PAGE_SIZE = 5000;

export interface IndexedLocation {
  /** Catalogue id; the backend already merges some dual-source marinas into
   *  one row with a combined id ("l-1912,l-158"). */
  id: string;
  name: string;
  kind: LocationType;
  countryCode?: string;
}

export interface DestinationIndex {
  byName: Map<string, IndexedLocation[]>;
  /** Every single did (the parts of combined ids too) → its catalogue row. */
  byDid: Map<string, IndexedLocation>;
  counts: Map<string, number>;
  /** Per-index memo of name resolutions (the index itself is per request in
   *  RSC, and built once per run in the sitemap route handlers). */
  resolved: Map<string, Promise<ResolvedDestination | null>>;
}

export interface ResolvedDestination {
  /** Backend did values (several for dual-source places). */
  dids: string[];
  /** Display name from the catalogue ("ACI Marina Split") or the popular
   *  label ("Split Region"). Also the ONE canonical spelling of the landing
   *  URL: every alias / member / case variant resolves to the same name. */
  name: string;
  /** Fleet size behind `dids` (0 → empty landing page). */
  count: number;
  kind: LocationType;
  countryCode?: string;
}

// URL-slug spellings that differ from the catalogue name. Keys and values
// are normalised (see normalizeDestinationName).
const NAME_ALIAS: Record<string, string> = {
  turkiye: 'turkey',
};

const apiBase = () => process.env.NEXT_PUBLIC_BOAT_WS_API_URL;

/** Longest a catalogue lookup waits before it counts as an outage. */
const FETCH_TIMEOUT_MS = 20_000;

/**
 * The catalogue API could not answer (network error, timeout, 5xx). Thrown,
 * never folded into "no such place" / "0 boats": before 26.9.2026 a failed
 * lookup read as an unknown destination or an empty fleet, and the landing
 * rendered the whole catalogue as noindex, or failed its fleet gate and went
 * noindex, and the sitemaps dropped it for an hour (audit B01/B02/B08).
 * Callers that can do without the catalogue catch it; the /search landing
 * and the sitemaps let it through (500 / keep the last good copy).
 */
export class CatalogueUnavailableError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'CatalogueUnavailableError';
  }
}

/** JSON of a catalogue GET; null only when the API answers "not found" (4xx). */
const fetchJson = async <T>(url: string): Promise<T | null> => {
  let response: Response;

  try {
    response = await fetch(url, {
      next: { revalidate: REVALIDATE_SECONDS },
      signal: AbortSignal.timeout(FETCH_TIMEOUT_MS),
    });
  } catch (error) {
    throw new CatalogueUnavailableError(`${url}: ${error instanceof Error ? error.message : 'fetch failed'}`);
  }

  if (response.status >= 400 && response.status < 500) return null;

  if (!response.ok) throw new CatalogueUnavailableError(`${url}: HTTP ${response.status}`);

  try {
    return (await response.json()) as T;
  } catch {
    throw new CatalogueUnavailableError(`${url}: unreadable body`);
  }
};

const kindOf = (id: string, locationType?: string): LocationType => {
  if (locationType === LocationType.COUNTRY || id.startsWith('c-')) return LocationType.COUNTRY;

  if (locationType === LocationType.REGION || id.startsWith('r-')) return LocationType.REGION;

  return LocationType.MARINA;
};

const splitDids = (id: string): string[] =>
  id
    .split(',')
    .map(d => d.trim())
    .filter(Boolean);

/**
 * The lookup lists, loaded once. React `cache` makes it once per RSC request;
 * route handlers (sitemaps) call it once and pass the index around.
 *
 * Throws CatalogueUnavailableError when any of the three lists fails or the
 * catalogue comes back empty: a partial index resolves names wrongly (a
 * region without its count loses to a same-named marina) — the flip class
 * this file must never produce.
 */
export const requireDestinationIndex = cache(async (): Promise<DestinationIndex> => {
  const [locations, countryCounts, marinaCounts] = await Promise.all([
    fetchJson<{
      content?: Array<{
        id: string;
        name?: string;
        locationType?: string;
        countryCode?: string;
        aliases?: string[] | null;
      }>;
    }>(`${apiBase()}/public/locations?size=${LOCATIONS_PAGE_SIZE}`),
    fetchJson<Array<{ id: string; name?: string; yachtCount?: number }>>(`${apiBase()}/public/countries-count`),
    fetchJson<Array<{ id: string; name?: string; yachtCount?: number }>>(`${apiBase()}/public/locations-count`),
  ]);

  if (!locations?.content?.length || !countryCounts || !marinaCounts) {
    throw new CatalogueUnavailableError('destination index: empty or missing catalogue lists');
  }

  const byName = new Map<string, IndexedLocation[]>();
  const byDid = new Map<string, IndexedLocation>();

  locations.content.forEach(location => {
    if (!location.id || !location.name) return;

    const key = normalizeDestinationName(location.name);
    const list = byName.get(key) ?? [];
    const indexed: IndexedLocation = {
      id: location.id,
      name: location.name,
      kind: kindOf(location.id, location.locationType),
      countryCode: location.countryCode ?? undefined,
    };

    list.push(indexed);
    byName.set(key, list);
    splitDids(location.id).forEach(did => byDid.set(did, indexed));
  });

  // Region aliases from the backend (region_alias, V9_68): the spellings a
  // region carried before its name became canonical and the partners'
  // current names ("Zadar region" for r-3 "Zadar"). Each one finds its
  // region, so an old URL resolves and 301s to the canonical landing. Never
  // over a real catalogue name.
  locations.content.forEach(location => {
    const target = location.id ? byDid.get(splitDids(location.id)[0]) : undefined;

    if (!target || !Array.isArray(location.aliases)) return;

    location.aliases.forEach(alias => {
      const key = normalizeDestinationName(alias);

      if (key && !byName.has(key)) byName.set(key, [target]);
    });
  });

  const counts = new Map<string, number>();

  [...(countryCounts ?? []), ...(marinaCounts ?? [])].forEach(row => {
    if (!row?.id) return;

    counts.set(row.id, row.yachtCount ?? 0);

    // The count lists (the sitemap's source) sometimes carry the provider's
    // short name for a row /public/locations lists under a longer or merged
    // one ("Mykonos" l-158 → "Port of Mykonos", "Marina Baotić" l-1749 →
    // "Trogir, Yachtclub Seget (Marina Baotić)"). Index that spelling too, so
    // the URL filters instead of showing the whole catalogue.
    const key = row.name ? normalizeDestinationName(row.name) : '';
    const target = byDid.get(row.id);

    if (key && target && !byName.has(key)) byName.set(key, [target]);
  });

  // Pinned landings (landing-identity.config.ts): their canonical name and
  // every alias must be findable by name even when the catalogue currently
  // spells the row differently — the corpus manifest looks places up by the
  // file-name prefix (directOwnersOf), and each spelling then resolves to
  // the pinned landing.
  LANDING_IDENTITIES.forEach(identity => {
    const rows = identity.dids.map(did => byDid.get(did)).filter((r): r is IndexedLocation => !!r);

    if (!rows.length) return;

    [identity.name, ...identity.aliases].forEach(spelling => {
      const key = normalizeDestinationName(spelling);

      if (key && !byName.has(key)) byName.set(key, [rows[0]]);
    });
  });

  return { byName, byDid, counts, resolved: new Map() };
});

/**
 * The index, or null when the catalogue API is unavailable — for page blocks
 * that can render without it (link blocks, breadcrumbs, blog links). The
 * /search landing and the sitemaps use requireDestinationIndex.
 */
export const loadDestinationIndex = cache(
  async (): Promise<DestinationIndex | null> => requireDestinationIndex().catch(() => null)
);

/**
 * Fleet size behind one did (or a comma-joined did list), optionally for one
 * boat type and/or restricted to a country whitelist (comma-joined ISO
 * codes): the `/public/yachts` totalElements, i.e. exactly the number the
 * landing lists — unlike `/public/countries-count` / `locations-count`,
 * which also count boats outside the bookable catalogue. Shared with the
 * itinerary CTA resolver and the landing gate. Throws
 * CatalogueUnavailableError when the API fails (never a silent 0 — that
 * failed the fleet gate and flipped landings to noindex); null only for a
 * 4xx. The backend reads the boat type as `vesselType` (see fetchYachts).
 */
export const fleetTotalForDid = async (
  did: string,
  boatType?: string | null,
  countryCodes?: string | null
): Promise<number | null> => {
  const typeQuery = boatType ? `&vesselType=${encodeURIComponent(boatType)}` : '';
  const countryQuery = countryCodes ? `&countryCodes=${encodeURIComponent(countryCodes)}` : '';
  const json = await fetchJson<{ page?: { totalElements?: number }; totalElements?: number }>(
    `${apiBase()}/public/yachts?did=${encodeURIComponent(did)}${typeQuery}${countryQuery}&size=1`
  );

  return json ? (json.page?.totalElements ?? json.totalElements ?? 0) : null;
};

/** fleetTotalForDid as a number (a 4xx reads as 0; an outage still throws). */
export const fleetCountForDid = async (
  did: string,
  boatType?: string | null,
  countryCodes?: string | null
): Promise<number> => (await fleetTotalForDid(did, boatType, countryCodes)) ?? 0;

const countFor = async (index: DestinationIndex, location: IndexedLocation): Promise<number> => {
  // Countries and marinas come with a count; a country/marina missing from
  // the *-count lists has no boats. Regions are counted on demand.
  if (location.kind !== LocationType.REGION) {
    const direct = index.counts.get(location.id);

    if (direct != null) return direct;

    // A combined row ("l-1912,l-158") is listed per part in the count lists.
    return splitDids(location.id).reduce((sum, did) => sum + (index.counts.get(did) ?? 0), 0);
  }

  return fleetCountForDid(location.id);
};

const kindRank = (kind: LocationType): number => {
  if (kind === LocationType.REGION) return 2;

  if (kind === LocationType.COUNTRY) return 1;

  return 0;
};

/**
 * Popular dual-source entries ("Split Region", "Ionian Region") expand to
 * every member record, the same way the location dropdown expands them, so
 * the landing page shows both providers' fleets.
 *
 * A popular entry also owns its members' spellings: `?destinations=split`,
 * `ionian` and `ionian islands` resolve to the same popular entry (same did
 * set, same name), so they share one canonical URL instead of being several
 * indexable pages with one boat list (review 25.9.2026).
 */
const popularSpecFor = (key: string) =>
  POPULAR_SEARCHES.find(
    s =>
      s.members.length >= 2 &&
      (normalizeDestinationName(s.displayLabel) === key ||
        s.members.some(m => normalizeDestinationName(m.name) === key))
  );

const resolvePopular = async (index: DestinationIndex, key: string): Promise<ResolvedDestination | null> => {
  const spec = popularSpecFor(key);

  if (!spec) return null;

  const picked = new Map<string, IndexedLocation>();

  await Promise.all(
    spec.members.map(async member => {
      const matches = (index.byName.get(normalizeDestinationName(member.name)) ?? []).filter(
        l =>
          l.kind === member.locationType &&
          (!member.countryCode || !l.countryCode || l.countryCode === member.countryCode)
      );

      if (!matches.length) return;

      if (member.all) {
        matches.forEach(m => picked.set(m.id, m));

        return;
      }

      const scored = await Promise.all(matches.map(async m => ({ m, count: await countFor(index, m) })));

      scored.sort((a, b) => b.count - a.count);
      picked.set(scored[0].m.id, scored[0].m);
    })
  );

  if (!picked.size) return null;

  const dids = Array.from(new Set([...picked.keys()].flatMap(splitDids))).sort();
  const count = await fleetCountForDid(dids.join(','));

  return { dids, name: spec.displayLabel, count, kind: spec.primaryType, countryCode: spec.countryCode };
};

const PINNED_BY_KEY = new Map<string, LandingIdentity>(
  LANDING_IDENTITIES.flatMap(identity =>
    [identity.name, ...identity.aliases].map(spelling => [normalizeDestinationName(spelling), identity] as const)
  )
);

/** A pinned landing (landing-identity.config.ts), whatever the catalogue calls its rows today. */
const resolvePinned = async (
  index: DestinationIndex,
  identity: LandingIdentity
): Promise<ResolvedDestination | null> => {
  // Only the records the catalogue still has (a removed record drops out;
  // none left → the name resolves like any other).
  const dids = identity.dids.filter(did => index.byDid.has(did)).sort();

  if (!dids.length) return null;

  const count = await fleetCountForDid(dids.join(','));

  return { dids, name: identity.name, count, kind: identity.kind, countryCode: identity.countryCode };
};

const GENERIC_AREA_SUFFIX = / (?:region|area|sailing area)$/;

/**
 * Rename fallback for a name the catalogue no longer lists: the partner
 * syncs rewrite region names between two spellings of one place ("Zadar" ↔
 * "Zadar region", "Istria / Kvarner" ↔ "Kvarner"). A sitemap or external
 * link to the old spelling must reach the region under its new name (and
 * 301 there, search/page.tsx) instead of rendering the whole catalogue as
 * noindex. Only REGION rows, and only a single unambiguous match:
 *   "x region" / "x area" → "x";  "x" → "x region";
 *   "x" → the region "a / x" (a part of a slash name);
 *   "a / x" → the region "x" (a part of the requested name).
 */
const renamedRegionCandidates = (index: DestinationIndex, raw: string, key: string): IndexedLocation[] => {
  const regionsNamed = (name: string) => (index.byName.get(name) ?? []).filter(l => l.kind === LocationType.REGION);
  const parts = (value: string) =>
    value
      .split('/')
      .map(p => normalizeDestinationName(p))
      .filter(Boolean);

  const bySuffix = GENERIC_AREA_SUFFIX.test(key) ? regionsNamed(key.replace(GENERIC_AREA_SUFFIX, '')) : [];
  const withSuffix = regionsNamed(`${key} region`);
  const containing = Array.from(index.byDid.values()).filter(
    l => l.kind === LocationType.REGION && l.name.includes('/') && parts(l.name).includes(key)
  );
  const rawParts = raw.includes('/') ? parts(raw).flatMap(p => regionsNamed(p)) : [];

  const unique = new Map<string, IndexedLocation>();

  [...bySuffix, ...withSuffix, ...containing, ...rawParts].forEach(l => unique.set(l.id, l));

  return Array.from(unique.values());
};

const resolveUncached = async (index: DestinationIndex, raw: string): Promise<ResolvedDestination | null> => {
  const normalized = normalizeDestinationName(raw);

  if (!normalized) return null;

  const key = NAME_ALIAS[normalized] ?? normalized;
  const pinned = PINNED_BY_KEY.get(key);
  const pinnedHit = pinned ? await resolvePinned(index, pinned) : null;

  if (pinnedHit) return pinnedHit;

  const popular = await resolvePopular(index, key);

  if (popular) return popular;

  const candidates = index.byName.get(key);

  if (!candidates?.length) {
    const renamed = renamedRegionCandidates(index, raw, key);

    // One region under its new name: resolve that name (pins, popular
    // entries and dual-source siblings apply as usual).
    // eslint-disable-next-line @typescript-eslint/no-use-before-define
    return renamed.length === 1 ? resolveDestinationName(index, renamed[0].name) : null;
  }

  // Same scoring as the itinerary CTA resolver: biggest fleet wins, regions
  // preferred on ties (the "Split" region holds the fleet, the "Split"
  // marina row holds two boats).
  const scored = await Promise.all(candidates.map(async c => ({ c, count: await countFor(index, c) })));

  scored.sort((a, b) => b.count - a.count || kindRank(b.c.kind) - kindRank(a.c.kind));

  const best = scored[0];
  // Dual-source places the backend did not merge ("Lavrion Main Port" l-1069
  // and "Lavrion, main port" l-150): same name, same kind, same country —
  // one place, two provider records. Filter by all of them, or the landing
  // shows half the fleet (77 of 148).
  const siblings = best.count
    ? scored.filter(
        s => s.count > 0 && s.c.kind === best.c.kind && (s.c.countryCode ?? '') === (best.c.countryCode ?? '')
      )
    : [best];
  const dids = Array.from(new Set(siblings.flatMap(s => splitDids(s.c.id)))).sort();
  const count = dids.length > splitDids(best.c.id).length ? await fleetCountForDid(dids.join(',')) : best.count;

  return { dids, name: best.c.name.trim(), count, kind: best.c.kind, countryCode: best.c.countryCode };
};

/** Resolve one destination name against a loaded index (memoised on it). */
export const resolveDestinationName = (index: DestinationIndex, raw: string): Promise<ResolvedDestination | null> => {
  const key = normalizeDestinationName(raw);
  const hit = index.resolved.get(key);

  if (hit) return hit;

  const pending = resolveUncached(index, raw);

  index.resolved.set(key, pending);

  return pending;
};

/** The catalogue row behind one did, if the index knows it. */
export const locationForDid = (index: DestinationIndex, did: string): IndexedLocation | null =>
  index.byDid.get(did.trim()) ?? null;

/**
 * Resolve the `?destinations=` values of one request. Returns one entry per
 * input value (null when the name is unknown). Keyed on a joined string so
 * React `cache` dedupes generateMetadata + page + list within a request.
 *
 * Throws CatalogueUnavailableError when the catalogue cannot be read: the
 * landing answers 500 (retried) instead of treating a known place as an
 * unknown name — the whole catalogue as noindex (audit B01/B02).
 */
export const resolveDestinationDids = cache(
  async (joinedDestinations: string): Promise<Array<ResolvedDestination | null>> => {
    const values = joinedDestinations
      .split(',')
      .map(v => v.trim())
      .filter(Boolean);

    if (!values.length) return [];

    const index = await requireDestinationIndex();

    return Promise.all(values.map(v => resolveDestinationName(index, v)));
  }
);
