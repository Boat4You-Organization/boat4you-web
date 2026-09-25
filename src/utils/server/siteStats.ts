import { cache } from 'react';

import 'server-only';

/**
 * ONE source for the catalogue size claims — /about-us counters, the home
 * hero pills, the Organization/WebSite JSON-LD description and llms.txt.
 * Before 25.9.2026 they disagreed: llms.txt "100+ countries", /about-us
 * "23,982" boats and "100" destinations (static config), the hero pinned at
 * 11,982, the /search heading 13.6K.
 *
 * Read from the backend's public count endpoints (the same ones /search
 * and the sitemaps use) and kept in the Data Cache for six hours, so the
 * numbers move with the catalogue but not between renders:
 *   - boats:     `/public/yachts?size=1` totalElements (the bookable
 *                catalogue, = the bare /search heading)
 *   - countries: `/public/countries-count` rows with boats
 *   - marinas:   `/public/locations-count` rows with boats
 * `display` rounds DOWN (boats to 100, marinas to 10) for "N+" claims, so
 * a "+" is always true.
 */

const REVALIDATE_SECONDS = 6 * 60 * 60;

export interface SiteStats {
  boats: number;
  countries: number;
  marinas: number;
  /** Rounded down, for "N+" copy. */
  display: { boats: number; countries: number; marinas: number };
}

const fetchJson = async <T>(path: string): Promise<T | null> => {
  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_BOAT_WS_API_URL}${path}`, {
      next: { revalidate: REVALIDATE_SECONDS },
    });

    return response.ok ? ((await response.json()) as T) : null;
  } catch {
    return null;
  }
};

const floorTo = (value: number, step: number): number => Math.floor(value / step) * step;

/** null when any count is unavailable — callers then omit the claim. */
export const getSiteStats = cache(async (): Promise<SiteStats | null> => {
  const [yachts, countries, marinas] = await Promise.all([
    fetchJson<{ page?: { totalElements?: number } }>('/public/yachts?size=1'),
    fetchJson<Array<{ yachtCount?: number }>>('/public/countries-count'),
    fetchJson<Array<{ yachtCount?: number }>>('/public/locations-count'),
  ]);
  const boats = yachts?.page?.totalElements ?? 0;
  const countryCount = Array.isArray(countries) ? countries.filter(c => (c.yachtCount ?? 0) > 0).length : 0;
  const marinaCount = Array.isArray(marinas) ? marinas.filter(m => (m.yachtCount ?? 0) > 0).length : 0;

  if (!boats || !countryCount || !marinaCount) return null;

  return {
    boats,
    countries: countryCount,
    marinas: marinaCount,
    display: {
      boats: boats >= 1000 ? floorTo(boats, 100) : boats,
      countries: countryCount,
      marinas: marinaCount >= 100 ? floorTo(marinaCount, 10) : marinaCount,
    },
  };
});
