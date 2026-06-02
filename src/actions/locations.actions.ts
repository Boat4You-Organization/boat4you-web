'use server';

import { filterDisplayCountries, filterDisplayLocations } from '@/config/countries.config';
import { POPULAR_SEARCHES, PopularSearchMember, PopularSearchSpec } from '@/config/popular-searches.config';
import { CountryCountModel, LocationModel } from '@/models/locations.model';
import { LocationType } from '@/types/location.type';
import { PaginatedResponse } from '@/types/response.type';
import { createQueryParams } from '@/utils/static/queryParams';

export interface PopularEntry {
  /** Synthetic id — not a real backend location id. */
  id: string;
  /** Label shown in the dropdown. */
  displayLabel: string;
  /** Country code used for the flag. */
  countryCode: string | null;
  /** Type used for the inline colored tag. */
  primaryType: LocationType;
  /** Real backend locations added to the form when this entry is selected. */
  members: LocationModel[];
}

interface GetLocationsPayload {
  name: string;
  selected?: string[];
}

export async function getLocations(
  _state: unknown,
  payload: GetLocationsPayload
): Promise<PaginatedResponse<LocationModel>> {
  const { name, selected } = payload;

  try {
    const queryParams = createQueryParams({ name, selected });
    // `cache: 'no-store'` — Next.js server-action default is force-cache, which
    // memoised the autocomplete payload before regions like Paros / Mykonos
    // existed in the DB. After the regions were added the dropdown still
    // showed the stale list until the dev server was bounced; no-store keeps
    // every call fresh so DB changes surface in the UI on next type.
    const response = await fetch(`${process.env.NEXT_PUBLIC_BOAT_WS_API_URL}/public/locations${queryParams}&size=100`, {
      cache: 'no-store',
    });

    const jsonResponse: PaginatedResponse<LocationModel> = await response.json();

    return filterDisplayLocations(jsonResponse);
  } catch {
    return {
      content: [],
    };
  }
}

/**
 * Fetches `/public/locations?name=<q>` once and returns the candidate list.
 * Callers pass their own cache so multiple members sharing a search term
 * (e.g. 6 Preveza marinas → searchName "Preveza") hit the backend only once.
 */
async function fetchLocationCandidates(
  searchName: string,
  cache: Map<string, LocationModel[]>
): Promise<LocationModel[]> {
  const key = searchName.toLowerCase();

  if (cache.has(key)) return cache.get(key)!;

  try {
    const queryParams = createQueryParams({ name: searchName });
    const response = await fetch(`${process.env.NEXT_PUBLIC_BOAT_WS_API_URL}/public/locations${queryParams}&size=20`, {
      next: { revalidate: 3600 },
    });

    const jsonResponse: PaginatedResponse<LocationModel> = await response.json();
    const candidates = jsonResponse.content || [];

    cache.set(key, candidates);

    return candidates;
  } catch {
    cache.set(key, []);

    return [];
  }
}

/**
 * Resolves a PopularSearchMember against a candidate list with progressive
 * fallbacks so a minor type/name mismatch doesn't drop an entry.
 *
 * Returns an ARRAY so `all: true` members can include every matching record
 * (e.g. one "Ionian" region per external provider — MMK and NauSYS both).
 */
function pickMembersFromCandidates(member: PopularSearchMember, candidates: LocationModel[]): LocationModel[] {
  // Layered matchers, most-specific first. Each layer yields 0+ candidates.
  const exactLayer = candidates.filter(
    loc =>
      loc.locationType === member.locationType &&
      (!member.countryCode || loc.countryCode === member.countryCode) &&
      loc.name.toLowerCase() === member.name.toLowerCase()
  );

  const nameLayer = candidates.filter(
    loc =>
      (!member.countryCode || loc.countryCode === member.countryCode) &&
      loc.name.toLowerCase() === member.name.toLowerCase()
  );

  const typeLayer = candidates.filter(
    loc => loc.locationType === member.locationType && (!member.countryCode || loc.countryCode === member.countryCode)
  );

  const countryLayer = candidates.filter(loc => !member.countryCode || loc.countryCode === member.countryCode);

  // Pick the FIRST non-empty layer. "all: true" keeps every record in that
  // layer; otherwise we take just the single best match.
  const pickFirst = [exactLayer, nameLayer, typeLayer, countryLayer, candidates].find(layer => layer.length > 0) || [];

  return member.all ? pickFirst : pickFirst.slice(0, 1);
}

/**
 * Resolves the fixed "Most popular searches" list. Each entry may expand to
 * one OR MORE real LocationModel entries (see Lefkada Region). Backed by
 * Next.js data cache — shared across sessions, re-fetched on revalidation.
 */
export async function getPopularLocations(): Promise<PopularEntry[]> {
  // Shared cache across the whole popular-searches resolution — members that
  // use the same `searchName` hit the backend only once.
  const candidateCache = new Map<string, LocationModel[]>();

  const entries = await Promise.all(
    POPULAR_SEARCHES.map(async (spec: PopularSearchSpec): Promise<PopularEntry | null> => {
      const resolvedMembers = (
        await Promise.all(
          spec.members.map(async member => {
            const searchTerm = member.searchName || member.name;
            const candidates = await fetchLocationCandidates(searchTerm, candidateCache);

            return pickMembersFromCandidates(member, candidates);
          })
        )
      ).flat();

      // Dedupe by real id — if several members/providers resolve to the same
      // backend record (fallback overlap) keep just one copy.
      const seen = new Set<string>();
      const members = resolvedMembers.filter(loc => {
        if (seen.has(loc.id)) return false;

        seen.add(loc.id);

        return true;
      });

      if (members.length === 0) return null;

      return {
        id: `popular:${spec.key}`,
        displayLabel: spec.displayLabel,
        countryCode: spec.countryCode || members[0]?.countryCode || null,
        primaryType: spec.primaryType,
        members,
      };
    })
  );

  return entries.filter((entry): entry is PopularEntry => entry !== null);
}

export async function getLocationsCount(): Promise<CountryCountModel[]> {
  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_BOAT_WS_API_URL}/public/locations-count`, {
      next: { revalidate: 60 },
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch locations: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    return [];
  }
}

export async function getAllCountriesCount(): Promise<CountryCountModel[]> {
  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_BOAT_WS_API_URL}/public/countries-count`, {
      next: { revalidate: 60 },
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch countries: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    return [];
  }
}

export default async function getCountriesCount(): Promise<CountryCountModel[]> {
  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_BOAT_WS_API_URL}/public/countries-count`, {
      next: { revalidate: 60 },
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch countries: ${response.status}`);
    }

    const allCountries = await response.json();

    return filterDisplayCountries(allCountries);
  } catch (error) {
    return [];
  }
}

/**
 * Hero trust line stats — total yacht count + total distinct marinas.
 * Mirrors the "27,102 yachts · 2,607 marinas" trust pills competitors
 * (Boataround) place between the page H1 and the search bar.
 *
 * - yachts: drawn from `/public/yachts?size=1` page.totalElements
 * - marinas: length of `/public/locations-count` (which today returns
 *   marina-tier locations only — IDs all `l-*`)
 *
 * Both endpoints already exist; we read them in parallel and fail soft so
 * a slow upstream doesn't push the whole hero into an error state.
 * Cached for 5 minutes — stats move slowly enough that fresh-on-every-hit
 * isn't worth the request volume.
 */
export type HeroStats = { yachts: number; marinas: number };

export async function getHeroStats(): Promise<HeroStats> {
  // Hardcoded hero trust stats (Mario, 2026-06-02): pinned to their current
  // values so the numbers never drift between renders and the home no longer
  // makes two upstream fetches (/public/yachts + /public/locations-count) just
  // to render the pills. Bump these by hand if the headline figures change.
  return { yachts: 11982, marinas: 647 };
}

/**
 * Internal-link block for the bottom of `/search?destinations=X` pages.
 * Boataround calls this "Our most popular destinations" — 10 anchor links
 * to sub-destinations of the active country/region, each phrased
 * differently ("yacht charter X", "X yacht charter", "rent boat X", …)
 * so the block stacks long-tail keyword variations without looking like
 * keyword stuffing. We mirror that pattern but vary phrasing per locale.
 *
 * Today's scope (MVP — Mario asked for one working example before
 * expanding): country-level only. Calling this with a country code
 * returns top regions of that country + a couple of high-volume marinas
 * to fill out a 10-link block.
 *
 * Output: an array of `{ name, href, templateIdx }` objects. The
 * `templateIdx` is a deterministic 0..N index — the renderer uses it to
 * rotate phrasing templates so URL #3 reads differently from URL #4 even
 * though they're the same component. Deterministic (not random) so SEO
 * bots see stable text on every crawl.
 */
export interface PopularDestination {
  /** Raw destination name as it appears in the location-count payload —
   *  used both as the URL `?destinations=` value and as the template
   *  placeholder. */
  name: string;
  /** Pre-built href for the next-level search results page, with the
   *  active boat-type filter preserved. */
  href: string;
  /** 0..7 index into the locale's phrase template array. Stable per
   *  destination (hash of name) so the same place always renders with
   *  the same phrasing on subsequent crawls. */
  templateIdx: number;
}

const POPULAR_DESTS_LIMIT = 10;
const POPULAR_TEMPLATE_COUNT = 8;

/**
 * Cheap hash → 0..(POPULAR_TEMPLATE_COUNT-1). Used to assign each
 * destination a stable phrase template across renders.
 */
const stableTemplateIdx = (s: string): number => {
  let h = 0;

  // eslint-disable-next-line no-bitwise
  for (let i = 0; i < s.length; i += 1) h = (h * 31 + s.charCodeAt(i)) | 0;

  return Math.abs(h) % POPULAR_TEMPLATE_COUNT;
};

/**
 * Build the popular-destinations block for a single country page.
 * Returns an empty array on missing data so the caller can skip the
 * render without an error path.
 *
 * @param countryCode  ISO country code (e.g. "HR"). Pulled from the
 *                     URL's `did=c-X` segment + a country lookup; if the
 *                     URL has no country filter, callers shouldn't call
 *                     this.
 * @param boatType     Active single-boat-type filter (preserved in the
 *                     output hrefs so `Croatia + Catamaran` → links land
 *                     on `Split Region + Catamaran` etc).
 */
export async function getPopularDestinationsForCountry(
  countryCode: string,
  boatType: string | null
): Promise<PopularDestination[]> {
  const base = process.env.NEXT_PUBLIC_BOAT_WS_API_URL;
  const REVALIDATE = 600;

  try {
    const [regionsRes, marinasRes] = await Promise.all([
      fetch(`${base}/public/regions?countryCode=${countryCode}`, { next: { revalidate: REVALIDATE } }),
      fetch(`${base}/public/locations-count`, { next: { revalidate: REVALIDATE } }),
    ]);

    if (!regionsRes.ok) return [];

    const regions = (await regionsRes.json()) as Array<{ id: string; name: string }>;
    const marinas = marinasRes.ok
      ? ((await marinasRes.json()) as Array<{ id: string; name: string; countryCode: string; yachtCount: number }>)
      : [];

    const boatTypeQuery = boatType ? `&boatTypes=${encodeURIComponent(boatType)}` : '';
    // Regions first — they're the higher-tier sub-destinations and the
    // ones a country page should funnel traffic to. Cap at 6 (typical
    // country has 5-6 regions; we leave room for 4 marina links to round
    // the block out to 10 entries).
    const regionEntries: PopularDestination[] = regions.slice(0, 6).map(r => ({
      name: r.name,
      href: `/search?destinations=${encodeURIComponent(r.name)}&did=${encodeURIComponent(r.id)}${boatTypeQuery}`,
      templateIdx: stableTemplateIdx(r.name),
    }));

    // Top-yacht-count marinas in this country fill the remaining slots
    // (10 − region count). Skip any marina whose name was already used
    // by a region entry (rare, but possible — e.g. "Split" marina vs
    // "Split region").
    const usedNames = new Set(regionEntries.map(r => r.name.toLowerCase()));
    const marinaEntries: PopularDestination[] = marinas
      .filter(m => m.countryCode === countryCode && !usedNames.has(m.name.toLowerCase()))
      .sort((a, b) => b.yachtCount - a.yachtCount)
      .slice(0, POPULAR_DESTS_LIMIT - regionEntries.length)
      .map(m => ({
        name: m.name,
        href: `/search?destinations=${encodeURIComponent(m.name)}&did=${encodeURIComponent(m.id)}${boatTypeQuery}`,
        templateIdx: stableTemplateIdx(m.name),
      }));

    return [...regionEntries, ...marinaEntries];
  } catch {
    return [];
  }
}

/**
 * Region-level variant of [getPopularDestinationsForCountry]. Powers
 * the "Most popular destinations in {region}" block on URLs like
 * `?destinations=Split+Region&did=r-5`. Backend filter (`regionId=`
 * query param on `/locations-count`) returns only the marinas/cities
 * inside that region — without the filter we'd dump all of Croatia.
 *
 * @param regionRealId  Numeric region id stripped from the `r-<id>`
 *                      URL slug (e.g. r-5 → 5). Backend uses this as
 *                      the `Region.id` in the JPA m2m join.
 */
export async function getPopularDestinationsForRegion(
  regionRealId: string,
  boatType: string | null
): Promise<PopularDestination[]> {
  const base = process.env.NEXT_PUBLIC_BOAT_WS_API_URL;
  const REVALIDATE = 600;

  try {
    const res = await fetch(`${base}/public/locations-count?regionId=${encodeURIComponent(regionRealId)}`, {
      next: { revalidate: REVALIDATE },
    });

    if (!res.ok) return [];

    const locations = (await res.json()) as Array<{ id: string; name: string; yachtCount: number }>;

    const boatTypeQuery = boatType ? `&boatTypes=${encodeURIComponent(boatType)}` : '';

    return locations
      .sort((a, b) => b.yachtCount - a.yachtCount)
      .slice(0, POPULAR_DESTS_LIMIT)
      .map(l => ({
        name: l.name,
        href: `/search?destinations=${encodeURIComponent(l.name)}&did=${encodeURIComponent(l.id)}${boatTypeQuery}`,
        templateIdx: stableTemplateIdx(l.name),
      }));
  } catch {
    return [];
  }
}
