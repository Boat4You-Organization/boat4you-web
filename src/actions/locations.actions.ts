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
    const response = await fetch(`${process.env.NEXT_PUBLIC_BOAT_WS_API_URL}/public/locations${queryParams}&size=100`);

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
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_BOAT_WS_API_URL}/public/locations${queryParams}&size=20`,
      { next: { revalidate: 3600 } }
    );

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
    loc =>
      loc.locationType === member.locationType &&
      (!member.countryCode || loc.countryCode === member.countryCode)
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
