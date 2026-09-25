import { cache } from 'react';

import 'server-only';

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

interface IndexedLocation {
  id: string;
  name: string;
  kind: LocationType;
  countryCode?: string;
}

interface DestinationIndex {
  byName: Map<string, IndexedLocation[]>;
  counts: Map<string, number>;
}

export interface ResolvedDestination {
  /** Backend did values (several for dual-source popular regions). */
  dids: string[];
  /** Display name from the catalogue ("ACI Marina Split"), for headings. */
  name: string;
  /** Fleet size behind `dids` (0 → empty landing page). */
  count: number;
}

// URL-slug spellings that differ from the catalogue name. Keys and values
// are normalised (see normalizeDestinationName).
const NAME_ALIAS: Record<string, string> = {
  turkiye: 'turkey',
};

const apiBase = () => process.env.NEXT_PUBLIC_BOAT_WS_API_URL;

const fetchJson = async <T>(url: string): Promise<T | null> => {
  try {
    const response = await fetch(url, { next: { revalidate: REVALIDATE_SECONDS } });

    return response.ok ? ((await response.json()) as T) : null;
  } catch {
    return null;
  }
};

const kindOf = (id: string, locationType?: string): LocationType => {
  if (locationType === LocationType.COUNTRY || id.startsWith('c-')) return LocationType.COUNTRY;

  if (locationType === LocationType.REGION || id.startsWith('r-')) return LocationType.REGION;

  return LocationType.MARINA;
};

const getDestinationIndex = cache(async (): Promise<DestinationIndex | null> => {
  const [locations, countryCounts, marinaCounts] = await Promise.all([
    fetchJson<{
      content?: Array<{ id: string; name?: string; locationType?: string; countryCode?: string }>;
    }>(`${apiBase()}/public/locations?size=${LOCATIONS_PAGE_SIZE}`),
    fetchJson<Array<{ id: string; yachtCount?: number }>>(`${apiBase()}/public/countries-count`),
    fetchJson<Array<{ id: string; yachtCount?: number }>>(`${apiBase()}/public/locations-count`),
  ]);

  if (!locations?.content?.length) return null;

  const byName = new Map<string, IndexedLocation[]>();

  locations.content.forEach(location => {
    if (!location.id || !location.name) return;

    const key = normalizeDestinationName(location.name);
    const list = byName.get(key) ?? [];

    list.push({
      id: location.id,
      name: location.name,
      kind: kindOf(location.id, location.locationType),
      countryCode: location.countryCode,
    });
    byName.set(key, list);
  });

  const counts = new Map<string, number>();

  [...(countryCounts ?? []), ...(marinaCounts ?? [])].forEach(row => {
    if (row?.id) counts.set(row.id, row.yachtCount ?? 0);
  });

  return { byName, counts };
});

/** Fleet size behind one did — shared with the itinerary CTA resolver. */
export const fleetCountForDid = async (did: string): Promise<number> => {
  const json = await fetchJson<{ page?: { totalElements?: number }; totalElements?: number }>(
    `${apiBase()}/public/yachts?did=${encodeURIComponent(did)}&size=1`
  );

  return json?.page?.totalElements ?? json?.totalElements ?? 0;
};

const countFor = async (index: DestinationIndex, location: IndexedLocation): Promise<number> => {
  // Countries and marinas come with a count; a country/marina missing from
  // the *-count lists has no boats. Regions are counted on demand.
  if (location.kind !== LocationType.REGION) return index.counts.get(location.id) ?? 0;

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
 */
const resolvePopular = async (index: DestinationIndex, key: string): Promise<ResolvedDestination | null> => {
  const spec = POPULAR_SEARCHES.find(s => normalizeDestinationName(s.displayLabel) === key);

  if (!spec || spec.members.length < 2) return null;

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

  const dids = [...picked.keys()].sort();
  const count = await fleetCountForDid(dids.join(','));

  return { dids, name: spec.displayLabel, count };
};

const resolveOne = async (index: DestinationIndex, raw: string): Promise<ResolvedDestination | null> => {
  const normalized = normalizeDestinationName(raw);

  if (!normalized) return null;

  const key = NAME_ALIAS[normalized] ?? normalized;
  const popular = await resolvePopular(index, key);

  if (popular) return popular;

  const candidates = index.byName.get(key);

  if (!candidates?.length) return null;

  // Same scoring as the itinerary CTA resolver: biggest fleet wins, regions
  // preferred on ties (the "Split" region holds the fleet, the "Split"
  // marina row holds two boats).
  const scored = await Promise.all(candidates.map(async c => ({ c, count: await countFor(index, c) })));

  scored.sort((a, b) => b.count - a.count || kindRank(b.c.kind) - kindRank(a.c.kind));

  const best = scored[0];

  return { dids: [best.c.id], name: best.c.name, count: best.count };
};

/**
 * Resolve the `?destinations=` values of one request. Returns one entry per
 * input value (null when the name is unknown). Keyed on a joined string so
 * React `cache` dedupes generateMetadata + page + list within a request.
 */
export const resolveDestinationDids = cache(
  async (joinedDestinations: string): Promise<Array<ResolvedDestination | null>> => {
    const values = joinedDestinations
      .split(',')
      .map(v => v.trim())
      .filter(Boolean);

    if (!values.length) return [];

    const index = await getDestinationIndex();

    if (!index) return values.map(() => null);

    return Promise.all(values.map(v => resolveOne(index, v)));
  }
);
