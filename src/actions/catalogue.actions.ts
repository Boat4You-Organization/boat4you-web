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
