'use server';

import { filterDisplayCountries, filterDisplayLocations } from '@/config/countries.config';
import { POPULAR_SEARCHES, PopularSearchMember, PopularSearchSpec } from '@/config/popular-searches.config';
import { CountryCountModel, LocationModel } from '@/models/locations.model';
import { LocationType } from '@/types/location.type';
import { PaginatedResponse } from '@/types/response.type';
import { fleetTotalForDid } from '@/utils/server/destinationDid';
import { getSiteStats } from '@/utils/server/siteStats';
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

/**
 * The promoted countries for the home destination cards (and the "All of our
 * destinations" block), each with the number its landing lists.
 *
 * `/public/countries-count` counts every yacht whose HOME marina is in the
 * country — inactive agencies, deactivated and offer-less boats included —
 * so the cards drifted far from the landings they link to (25.9.2026: France
 * 1,587 vs 428 on /search?destinations=france, Croatia 5,658 vs 3,864; the
 * 12 cards summed to 17,815 vs 12,158 on /search). The card figure is now the
 * landing's own total — `/public/yachts?did=c-X` totalElements, the very
 * query the landing gate runs (fleetTotalForDid, Data Cache 1 h, shared) —
 * and the count endpoint only picks the countries and fills in when that
 * query fails. The order follows the corrected figures.
 */
export default async function getCountriesCount(): Promise<CountryCountModel[]> {
  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_BOAT_WS_API_URL}/public/countries-count`, {
      next: { revalidate: 60 },
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch countries: ${response.status}`);
    }

    const countries = filterDisplayCountries(await response.json());
    // One failed count falls back to the count endpoint's figure for that card.
    const listed = await Promise.all(countries.map(country => fleetTotalForDid(country.id).catch(() => null)));

    return countries
      .map((country, i) => ({ ...country, yachtCount: listed[i] ?? country.yachtCount }))
      .sort((a, b) => b.yachtCount - a.yachtCount);
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
  // One count source (siteStats.ts, 25.9.2026): the pills were pinned by
  // hand at 11,982 / 647 on 2.6.2026 (no drift between renders, no extra
  // fetches) and drifted from the catalogue instead. The shared helper keeps
  // both properties — six-hour Data Cache, one fetch set for every surface —
  // and matches /about-us, the JSON-LD and llms.txt. 0 hides the pills.
  const stats = await getSiteStats();

  return { yachts: stats?.boats ?? 0, marinas: stats?.marinas ?? 0 };
}

/**
 * One link of the "Our most popular destinations in {area}" block at the
 * bottom of `/search?destinations=X` landings (Boataround pattern: each link
 * phrased differently — "yacht charter X", "X yacht charter", "rent boat X"
 * … — deterministic per place so crawlers see stable anchors). Built on the
 * server from the landing manifest (src/utils/server/landingNav.ts), so
 * every link is an indexable landing in its canonical URL.
 */
export interface PopularDestination {
  /** Localized place name, the `{dest}` of the phrase template. */
  name: string;
  /** Locale-less canonical landing path (the locale-aware Link adds the prefix). */
  href: string;
  /** 0..7 index into the locale's phrase template array (stable per place). */
  templateIdx: number;
  /** Full anchor text instead of the template (boat-type landings use their H1). */
  label?: string;
}
