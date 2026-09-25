import 'server-only';

import { AllSearchParams } from '@/config/form-models.config';
import { Currency } from '@/models/user.model';
import { isVesselType } from '@/models/yacht.model';
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
 * ALLOWLIST, not a filter denylist: the Data Cache is keyed on the backend
 * URL and the self-hosted filesystem cache has no eviction, so a request is
 * cached only when it is a real landing — every parameter it carries is a
 * landing parameter with a valid value (a resolved destination, known boat
 * types, a plain page number, a known currency) or a tracking parameter —
 * and the backend query is then rebuilt from the canonical values alone
 * (yachtFetchParams), so spelling variants and gclid/utm_* share one entry.
 * Anything else — dates, a did of the visitor's own, a sidebar filter, sort,
 * an admin inquiry, an unknown destination or a made-up parameter — stays
 * `no-store`, as before this cache existed, so no query string can mint new
 * cache entries.
 */
export const LANDING_FETCH_REVALIDATE_SECONDS = 600;

const LANDING_CACHE_PARAMS = new Set(['destinations', 'boatTypes', 'page', 'currency']);
const MAX_CACHED_PAGE = 500;

// Ad-click and campaign identifiers: every Google Ads click carries a unique
// gclid. They never change the yacht list, so they are never sent to the
// backend (cached or not).
const TRACKING_PARAMS = new Set([
  'gclid',
  'gbraid',
  'wbraid',
  'gclsrc',
  'gad_source',
  'gad_campaignid',
  'dclid',
  'fbclid',
  'msclkid',
  'ttclid',
  'twclid',
  'li_fat_id',
  'igshid',
  'yclid',
  'mc_cid',
  'mc_eid',
  'srsltid',
  '_gl',
]);

const isTrackingParam = (key: string): boolean => key.startsWith('utm_') || TRACKING_PARAMS.has(key);

const hasValue = (value: unknown): boolean =>
  Array.isArray(value)
    ? value.some(v => v != null && String(v).trim() !== '')
    : value != null && String(value).trim() !== '';

const CURRENCIES = new Set<string>(Object.values(Currency));

/** `page` as a landing page number (1…MAX_CACHED_PAGE), else null. */
const landingPage = (raw: unknown): number | null => {
  const value = splitSearchParam(raw);

  if (value.length !== 1 || !/^[1-9]\d{0,2}$/.test(value[0])) return null;

  const page = Number(value[0]);

  return page <= MAX_CACHED_PAGE ? page : null;
};

/**
 * Pass the ORIGINAL request params (before withLandingDid adds the resolved
 * did) and the resolved landing.
 */
export const landingFetchRevalidate = (params: AllSearchParams, landing: SearchLanding): number | undefined => {
  const entries = Object.entries(params as unknown as Record<string, unknown>).filter(([, v]) => hasValue(v));

  if (!entries.every(([key]) => LANDING_CACHE_PARAMS.has(key) || isTrackingParam(key))) return undefined;

  // A destination must resolve (an unknown one lists the whole catalogue
  // under a URL anyone can vary).
  if (landing.destinations.length && (!landing.did.length || landing.resolved.some(r => !r))) return undefined;

  if (!splitSearchParam(params.boatTypes).every(isVesselType)) return undefined;

  if (hasValue(params.page) && landingPage(params.page) == null) return undefined;

  if (hasValue(params.currency) && !splitSearchParam(params.currency).every(c => CURRENCIES.has(c))) return undefined;

  return LANDING_FETCH_REVALIDATE_SECONDS;
};

/**
 * The params to send to `/public/yachts`. Cached landing (see
 * landingFetchRevalidate): only the canonical filter — resolved did, sorted
 * boat types, page, currency — so every spelling of one landing shares one
 * cache entry (the backend filters by did and ignores `destinations`).
 * Otherwise the request's own params minus tracking parameters.
 */
export const yachtFetchParams = (params: AllSearchParams, cached: boolean): AllSearchParams => {
  if (cached) {
    const boatTypes = Array.from(new Set(splitSearchParam(params.boatTypes))).sort();
    const page = landingPage(params.page);

    return {
      locations: [],
      ...(params.did?.length ? { did: [...params.did].sort() } : {}),
      ...(boatTypes.length ? { boatTypes } : {}),
      ...(page ? { page } : {}),
      ...(hasValue(params.currency) ? { currency: splitSearchParam(params.currency)[0] } : {}),
    } as unknown as AllSearchParams;
  }

  return Object.fromEntries(
    Object.entries(params as unknown as Record<string, unknown>).filter(([key]) => !isTrackingParam(key))
  ) as unknown as AllSearchParams;
};
