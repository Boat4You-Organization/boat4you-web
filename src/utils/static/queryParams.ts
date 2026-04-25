import { SortDirection } from '@mui/material';

import { YACHT_PAGE_SIZE } from '@/config/constants.config';
import { YachtSearchParams } from '@/config/form-models.config';

export interface PageableParams {
  page?: number;
  size?: number;
  sort?: string[];
}

export const createQueryParams = ({
  page,
  search = '',
  sortBy,
  sortDirection,
  destinations,
  selected,
  startDate,
  endDate,
  boatTypes,
  name,
  reservationId,
}: {
  search?: string;
  startDate?: string;
  destinations?: string[];
  selected?: string[];
  endDate?: string;
  sort?: string;
  boatTypes?: string[];
  page?: number;
  sortBy?: string;
  sortDirection?: SortDirection;
  name?: string;
  reservationId?: number;
}): string => {
  const params = new URLSearchParams(
    Object.entries({
      page,
      search: search.trim() || undefined,
      sortBy: sortBy || undefined,
      sortDirection: sortBy ? sortDirection && sortDirection?.toUpperCase() : undefined,
      destinations,
      selected,
      startDate,
      endDate,
      boatTypes,
      name: name ? name.trim() : undefined,
      reservationId,
    })
      .filter(([, value]) => {
        if (value === undefined) return false;

        if (Array.isArray(value) && value.length === 0) return false;

        return true;
      })
      .map(([key, value]) => {
        if (Array.isArray(value)) {
          return [key, value.join(',')];
        }

        return [key, String(value)];
      })
  );

  return `?${params.toString()}`;
};

export const createYachtQueryParams = (values: YachtSearchParams): string => {
  const apiPage = values.page != null && values.page >= 1 ? values.page - 1 : 0;

  const paramsForApi = { ...values, page: apiPage };

  if (paramsForApi.size == null) {
    paramsForApi.size = YACHT_PAGE_SIZE;
  }

  try {
    const params = new URLSearchParams(
      Object.entries(paramsForApi)
        .filter(([, value]) => {
          if (value === undefined || value === null) return false;

          if (Array.isArray(value) && value.length === 0) return false;

          if (typeof value === 'string' && value.trim() === '') return false;

          return true;
        })
        .map(([key, value]) => {
          if (Array.isArray(value)) {
            return [key, value.join(',')];
          }

          return [key, String(value)];
        })
    );

    return params.toString() ? `?${params.toString()}` : '';
  } catch (error) {
    return '';
  }
};

export const createResourceParams = (
  params: {
    manufacturerIds?: number[];
    name?: string;
    manufacturerId?: string;
  },
  pageable?: PageableParams
): string => {
  const baseParams = {
    name: params.name?.trim(),
    manufacturerId: params.manufacturerId?.trim(),
    page: pageable?.page,
    size: pageable?.size,
  };

  const urlParams = new URLSearchParams(
    Object.entries(baseParams)
      .filter(([, value]) => value !== undefined && value !== '')
      .map(([key, value]) => [key, String(value)])
  );

  if (params.manufacturerIds && params.manufacturerIds.length > 0) {
    params.manufacturerIds.forEach(id => {
      urlParams.append('manufacturerIds', id.toString());
    });
  }

  pageable?.sort?.forEach(sortParam => {
    urlParams.append('sort', sortParam);
  });

  return urlParams.toString() ? `?${urlParams.toString()}` : '';
};
