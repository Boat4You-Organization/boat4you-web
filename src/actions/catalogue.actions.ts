'use server';

import {
  AmenityModel,
  BoatModel,
  CatalogueFilters,
  CharterTypeModel,
  ManufacturerModel,
  ServiceModel,
} from '@/models/catalogue.model';
import { PaginatedResponse } from '@/types/response.type';
import { PageableParams, createResourceParams } from '@/utils/static/queryParams';

interface ModelsActionState {
  models: BoatModel[];
  loading: boolean;
  error: string | null;
}

export async function getManufacturers(
  name?: string,
  pageable?: PageableParams
): Promise<PaginatedResponse<ManufacturerModel>> {
  try {
    const queryParams = createResourceParams({ name }, pageable);
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_BOAT_WS_API_URL}/public/catalogue/manufacturers${queryParams}`
    );

    if (!response.ok) {
      throw new Error(`Failed to fetch manufacturers: ${response.status}`);
    }

    return response.json();
  } catch {
    return {
      content: [],
    };
  }
}

/**
 * Top-N most popular manufacturers across the catalogue, joined with their
 * yacht counts so the home-page link grid can render
 * "Lagoon · 2,010 yachts / Bavaria · 1,994 yachts / …".
 *
 * Drives the SEO internal-link section that every charter aggregator
 * (Boataround, SamBoat, etc.) places on the home page — long-tail brand
 * queries ("Lagoon yacht charter", "Bavaria boat rental") collectively
 * out-perform any single home-page block; the per-brand link earns Google
 * crawl budget and link equity for filtered `/search?mfid=X` URLs.
 *
 * Composition:
 *   1. `/public/yachts/distribution` (faceted counts) → byManufacturer map
 *      `{ id: count }` — already covers the entire indexable catalogue
 *   2. `/public/catalogue/manufacturers?size=400` → id + name lookup
 *   3. Sort by count desc, slice top N, drop entries we couldn't name
 *
 * Cached 1 hour — manufacturer counts move slowly; refreshing on every
 * home-page hit would burn the distribution endpoint unnecessarily.
 */
export type ManufacturerCount = { id: number; name: string; count: number };

export async function getTopManufacturers(limit = 24): Promise<ManufacturerCount[]> {
  const base = process.env.NEXT_PUBLIC_BOAT_WS_API_URL;
  const REVALIDATE = 3600;

  try {
    const [distRes, mansRes] = await Promise.all([
      fetch(`${base}/public/yachts/distribution`, { next: { revalidate: REVALIDATE } }),
      fetch(`${base}/public/catalogue/manufacturers?size=400`, { next: { revalidate: REVALIDATE } }),
    ]);

    if (!distRes.ok || !mansRes.ok) return [];

    const distJson = (await distRes.json()) as { byManufacturer?: Record<string, number> };
    const mansJson = (await mansRes.json()) as PaginatedResponse<ManufacturerModel>;

    const byManufacturer = distJson.byManufacturer || {};
    const nameById = new Map<number, string>((mansJson.content || []).map(m => [m.id as number, m.name as string]));

    return Object.entries(byManufacturer)
      .map(([id, count]) => ({ id: Number(id), name: nameById.get(Number(id)) || '', count }))
      .filter(m => m.name && m.count > 0)
      .sort((a, b) => b.count - a.count)
      .slice(0, limit);
  } catch {
    return [];
  }
}

export async function getModels(
  prevState: ModelsActionState,
  params: {
    manufacturerIds: number[];
    searchString?: string;
    pageable?: PageableParams;
  }
): Promise<ModelsActionState> {
  const { manufacturerIds, searchString, pageable } = params;

  if (manufacturerIds.length === 0) {
    return {
      models: [],
      loading: false,
      error: null,
    };
  }

  try {
    const queryParams = createResourceParams({ manufacturerIds, name: searchString }, pageable);
    const response = await fetch(`${process.env.NEXT_PUBLIC_BOAT_WS_API_URL}/public/catalogue/models${queryParams}`);

    if (!response.ok) {
      throw new Error(`Failed to fetch models: ${response.status}`);
    }

    const result = await response.json();

    return {
      models: result.content || [],
      loading: false,
      error: null,
    };
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error('Request failed:', error);

    return {
      models: [],
      loading: false,
      error: error instanceof Error ? error.message : 'Failed to fetch models',
    };
  }
}

export async function getAmenities(): Promise<AmenityModel[]> {
  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_BOAT_WS_API_URL}/public/catalogue/amenities`);

    if (!response.ok) {
      throw new Error(`Failed to fetch models: ${response.status}`);
    }

    return response.json();
  } catch {
    return [];
  }
}

export async function getCharterTypes(): Promise<CharterTypeModel[]> {
  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_BOAT_WS_API_URL}/public/catalogue/charterTypes`);

    if (!response.ok) {
      throw new Error(`Failed to fetch charter types: ${response.status}`);
    }

    return response.json();
  } catch {
    return [];
  }
}

export async function getServices(): Promise<ServiceModel[]> {
  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_BOAT_WS_API_URL}/public/catalogue/services`);

    if (!response.ok) {
      throw new Error(`Failed to fetch services: ${response.status}`);
    }

    return response.json();
  } catch {
    return [];
  }
}

export async function getFilters(currency?: string, locale?: string): Promise<CatalogueFilters | null> {
  try {
    const query = currency ? `?currency=${currency}` : '';
    const url = `${process.env.NEXT_PUBLIC_BOAT_WS_API_URL}/public/catalogue/filters${query}`;

    const response = await fetch(url, {
      headers: {
        ...(locale && { 'Accept-Language': locale }),
      },
      next: { revalidate: 3600 },
    });

    if (!response.ok) {
      // eslint-disable-next-line no-console
      console.error(`[getFilters] ${response.status} ${response.statusText}`);

      return null;
    }

    const data = await response.json();

    return data;
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error('[getFilters] fetch failed:', error);

    return null;
  }
}
