import { cache } from 'react';

import { unstable_cache } from 'next/cache';
import 'server-only';

/**
 * ONE source for the catalogue size claims — /about-us counters, the home
 * hero pills, the Organization/WebSite JSON-LD description and llms.txt.
 * Before 25.9.2026 they disagreed: llms.txt "100+ countries", /about-us
 * "23,982" boats and "100" destinations (static config), the hero pinned at
 * 11,982, the /search heading 13.6K.
 *
 * All three numbers count the BOOKABLE catalogue, the one /search lists
 * (`/public/yachts` totalElements):
 *   - boats:     `/public/yachts?size=1` (= the bare /search heading)
 *   - countries: rows of `/public/countries-count` whose own listing
 *                (`/public/yachts?did=c-X&size=1`) is not empty
 *   - marinas:   the same for `/public/locations-count` rows
 * The count endpoints alone are not enough: they also count boats outside
 * the catalogue (20,094 vs 13,757 listed), which claimed 62 countries where
 * 58 have bookable boats (Czechia, Fiji, Monaco, Sri Lanka list none) and
 * ~830 marinas where ~720 do.
 *
 * That is ~900 small queries, so the result is computed once per six hours
 * (unstable_cache, one entry; single-flight per process) under one overall
 * deadline, and a failed or incomplete run throws instead of caching a
 * wrong figure. `display` rounds DOWN (boats to 100, marinas to 10) for
 * "N+" claims, so a "+" is always true.
 */

const REVALIDATE_SECONDS = 6 * 60 * 60;
/** Whole computation, all queries included — a hanging API fails it, not the page. */
const COMPUTE_DEADLINE_MS = 45_000;
const CONCURRENCY = 6;

export interface SiteStats {
  boats: number;
  countries: number;
  marinas: number;
  /** Rounded down, for "N+" copy. */
  display: { boats: number; countries: number; marinas: number };
}

type CountRow = { id?: string; yachtCount?: number };

const fetchJson = async <T>(path: string, signal: AbortSignal): Promise<T> => {
  // no-store: the one cached thing is the finished result (unstable_cache
  // below), not ~900 per-row entries.
  const response = await fetch(`${process.env.NEXT_PUBLIC_BOAT_WS_API_URL}${path}`, { cache: 'no-store', signal });

  if (!response.ok) throw new Error(`siteStats ${path}: ${response.status}`);

  return (await response.json()) as T;
};

const listingTotal = async (did: string, signal: AbortSignal): Promise<number> => {
  const json = await fetchJson<{ page?: { totalElements?: number } }>(
    `/public/yachts?did=${encodeURIComponent(did)}&size=1`,
    signal
  );

  return json.page?.totalElements ?? 0;
};

/** Rows (with boats per the count endpoint) whose listing is not empty. */
const countBookable = async (rows: CountRow[] | null, signal: AbortSignal): Promise<number> => {
  const ids = (Array.isArray(rows) ? rows : []).filter(r => r.id && (r.yachtCount ?? 0) > 0).map(r => r.id!);
  let next = 0;
  let bookable = 0;

  const worker = async (): Promise<void> => {
    while (next < ids.length) {
      const id = ids[next];

      next += 1;

      // Sequential per worker by design (bounded concurrency on cusma2).
      // eslint-disable-next-line no-await-in-loop
      if ((await listingTotal(id, signal)) > 0) bookable += 1;
    }
  };

  await Promise.all(Array.from({ length: Math.min(CONCURRENCY, ids.length) }, worker));

  return bookable;
};

const floorTo = (value: number, step: number): number => Math.floor(value / step) * step;

const computeSiteStats = async (): Promise<SiteStats> => {
  const signal = AbortSignal.timeout(COMPUTE_DEADLINE_MS);
  const [yachts, countryRows, marinaRows] = await Promise.all([
    fetchJson<{ page?: { totalElements?: number } }>('/public/yachts?size=1', signal),
    fetchJson<CountRow[]>('/public/countries-count', signal),
    fetchJson<CountRow[]>('/public/locations-count', signal),
  ]);
  const boats = yachts.page?.totalElements ?? 0;
  const countries = await countBookable(countryRows, signal);
  const marinas = await countBookable(marinaRows, signal);

  if (!boats || !countries || !marinas) throw new Error('siteStats: empty catalogue count');

  return {
    boats,
    countries,
    marinas,
    display: {
      boats: boats >= 1000 ? floorTo(boats, 100) : boats,
      countries,
      marinas: marinas >= 100 ? floorTo(marinas, 10) : marinas,
    },
  };
};

// One run at a time per process: a cold cache must not start a walk per request.
let inFlight: Promise<SiteStats> | null = null;

const computeOnce = (): Promise<SiteStats> => {
  inFlight ??= computeSiteStats().finally(() => {
    inFlight = null;
  });

  return inFlight;
};

const cachedSiteStats = unstable_cache(computeOnce, ['site-stats', 'bookable-v2'], {
  revalidate: REVALIDATE_SECONDS,
});

/** null when the counts are unavailable — callers then omit the claim. */
export const getSiteStats = cache(async (): Promise<SiteStats | null> => cachedSiteStats().catch(() => null));

/**
 * getSiteStats for render paths that must never wait on the API (the root
 * layout's JSON-LD on every page): null after `ms`, while the computation
 * carries on and fills the cache for the next render.
 */
export const getSiteStatsWithin = async (ms: number): Promise<SiteStats | null> => {
  let timer: ReturnType<typeof setTimeout> | undefined;
  const timeout = new Promise<null>(resolve => {
    timer = setTimeout(() => resolve(null), ms);
  });

  try {
    return await Promise.race([getSiteStats(), timeout]);
  } finally {
    clearTimeout(timer);
  }
};
