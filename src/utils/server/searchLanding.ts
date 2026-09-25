import 'server-only';

import { AllSearchParams } from '@/config/form-models.config';
import { ResolvedDestination, resolveDestinationDids } from '@/utils/server/destinationDid';

/**
 * Next leaves a comma-separated query value as one string (`?destinations=A%2CB`
 * → "A,B") and a repeated key as an array — normalise both to a trimmed list.
 */
export const splitSearchParam = (raw: unknown): string[] => {
  let values: unknown[] = [];

  if (Array.isArray(raw)) values = raw;
  else if (raw != null) values = [raw];

  return values
    .flatMap(v => String(v).split(','))
    .map(v => v.trim())
    .filter(Boolean);
};

/** Case-insensitive dedupe that keeps the first spelling. */
export const uniqueCaseInsensitive = (values: string[]): string[] =>
  Array.from(new Map(values.map(v => [v.toLowerCase(), v])).values());

export interface SearchLanding {
  /** `?destinations=` values, deduped case-insensitively. */
  destinations: string[];
  /** The URL carries its own `did` (dropdown pick / legacy link). */
  hasOwnDid: boolean;
  /** One entry per destination; null = not a catalogue name. Empty when hasOwnDid. */
  resolved: Array<ResolvedDestination | null>;
  /** did values to filter by (resolved ones; empty when hasOwnDid or unresolved). */
  did: string[];
  /** Lowercased destination value → catalogue display name. */
  labels: Record<string, string>;
}

/**
 * Resolve a /search request's destinations to dids (see destinationDid.ts).
 * Runs per request — the URL is the state, so a filter change re-renders
 * the server component and re-resolves; the lookup lists behind it are
 * cached for an hour and React `cache` dedupes metadata + page + list.
 */
export const resolveSearchLanding = async (params: AllSearchParams): Promise<SearchLanding> => {
  const destinations = uniqueCaseInsensitive(splitSearchParam(params.destinations));
  const hasOwnDid = splitSearchParam(params.did).length > 0;

  if (hasOwnDid || destinations.length === 0) {
    return { destinations, hasOwnDid, resolved: [], did: [], labels: {} };
  }

  const resolved = await resolveDestinationDids(destinations.join(','));
  const did = Array.from(new Set(resolved.flatMap(r => r?.dids ?? [])));
  const labels: Record<string, string> = {};

  destinations.forEach((d, i) => {
    const hit = resolved[i];

    if (hit) labels[d.toLowerCase()] = hit.name;
  });

  return { destinations, hasOwnDid, resolved, did, labels };
};

/** Search params with the resolved did applied (unchanged when there is none). */
export const withLandingDid = (params: AllSearchParams, landing: SearchLanding): AllSearchParams =>
  landing.did.length ? { ...params, did: landing.did } : params;

/**
 * Data Cache window (seconds) for the yacht list of an UNDATED destination
 * landing, or undefined → `no-store`.
 *
 * Why: the landings (`/search?destinations=x[&boatTypes=Y][&page=n]`) are
 * what Googlebot crawls from the sitemaps, one URL at a time and rarely the
 * same one twice within the page's 60 s s-maxage — so nearly every crawl hit
 * the backend cold (~2 s single, far worse under parallel crawling, and
 * cusma2 is the only API node). Without dates the list is the catalogue in
 * "recommended" order with from-prices, which moves with the partner syncs,
 * not by the minute; ten minutes stale is invisible to a visitor and makes
 * repeat crawls and the page's second fetch (Product JSON-LD) warm.
 *
 * Kept `no-store` whenever the visitor asked for something specific: dates
 * (availability and the exact-period price must be live), a did of their
 * own (dropdown pick), any sidebar filter or sort, or an admin inquiry.
 * Tracking parameters (utm_*, gclid) do not count as filters.
 */
export const LANDING_FETCH_REVALIDATE_SECONDS = 600;

const USER_FILTER_PARAMS = [
  'startDate',
  'endDate',
  'dateFrom',
  'dateTo',
  'did',
  'inquiryId',
  'search',
  'manufacturers',
  'models',
  'mfid',
  'mid',
  'amenities',
  'services',
  'amenityLabels',
  'servicesLabels',
  'charterType',
  'mainSailType',
  'yid',
  'sortBy',
  'sortDirection',
  'minPrice',
  'maxPrice',
  'minCabins',
  'maxCabins',
  'minPersons',
  'maxPersons',
  'minBerths',
  'maxBerths',
  'minLength',
  'maxLength',
  'minBuildYear',
  'maxBuildYear',
  'minWc',
  'maxWc',
  'minEnginePower',
  'maxEnginePower',
];

/** Pass the ORIGINAL request params (before withLandingDid adds the resolved did). */
export const landingFetchRevalidate = (params: AllSearchParams): number | undefined => {
  const hasUserFilter = USER_FILTER_PARAMS.some(key => {
    const value = (params as unknown as Record<string, unknown>)[key];

    return Array.isArray(value) ? value.length > 0 : value != null && String(value).trim() !== '';
  });

  return hasUserFilter ? undefined : LANDING_FETCH_REVALIDATE_SECONDS;
};
