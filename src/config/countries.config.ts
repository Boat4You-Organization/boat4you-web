import { CountryCountModel, LocationModel } from '@/models/locations.model';
import { PaginatedResponse } from '@/types/response.type';

export const DISPLAY_COUNTRIES = [
  'BS', // Bahamas
  'ES', // Spain
  'FR', // France
  'GR', // Greece
  'HR', // Croatia
  'IT', // Italy
  'ME', // Montenegro
  'MQ', // Martinique
  'SC', // Seychelles
  'TR', // Türkiye
  'VG', // Virgin Islands (British)
  'GD', // Grenada
] as const;

export const filterDisplayCountries = (countries: CountryCountModel[]): CountryCountModel[] =>
  countries
    .filter(country => DISPLAY_COUNTRIES.includes(country.countryCode as (typeof DISPLAY_COUNTRIES)[number]))
    .sort((a, b) => b.yachtCount - a.yachtCount);

export const filterDisplayLocations = (payload: PaginatedResponse<LocationModel>): PaginatedResponse<LocationModel> => {
  const filteredLocations = payload.content.filter(
    location =>
      !location.countryCode || DISPLAY_COUNTRIES.includes(location.countryCode as (typeof DISPLAY_COUNTRIES)[number])
  );

  const originalCount = payload.content.length;
  const filteredCount = filteredLocations.length;
  const removedCount = originalCount - filteredCount;

  const updatedPage = payload.page
    ? {
        ...payload.page,
        totalElements: Math.max(0, payload.page.totalElements - removedCount),
        totalPages:
          payload.page.size > 0
            ? Math.ceil(Math.max(0, payload.page.totalElements - removedCount) / payload.page.size)
            : 0,
      }
    : undefined;

  return {
    content: filteredLocations,
    page: updatedPage,
  };
};
