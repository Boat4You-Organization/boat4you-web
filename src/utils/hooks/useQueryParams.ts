'use client';

import { useCallback, useContext, useEffect, useMemo, useState } from 'react';

import { useLocale } from 'next-intl';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';

import { PAGE_NUMBER, SortDirection } from '@/config/constants.config';
import { Currency } from '@/models/user.model';
import { SortByValue } from '@/types/sort.type';
import { NavigationWrapperContext } from '@/utils/context/NavigationWrapperContext';
import { metersToFeet } from '@/utils/static/metersToFeet';

export interface SearchParams {
  search: string;
  destinations: string[];
  startDate: string;
  endDate: string;
  minCabins: number;
  maxCabins: number;
  minPersons: number;
  maxPersons: number;
  minBerths: number;
  maxBerths: number;
  minLength: number;
  maxLength: number;
  minBuildYear: number;
  maxBuildYear: number;
  minWc: number;
  maxWc: number;
  minPrice: number;
  maxPrice: number;
  minEnginePower: number;
  maxEnginePower: number;
  boatTypes: string[];
  charterType: string[];
  mainSailType: string[];
  did: string[];
  manufacturers: string[];
  models: string[];
  amenityLabels: string[];
  servicesLabels: string[];
  mfid: number[];
  mid: number[];
  amenities: number[];
  services: number[];
  page: number;
  sortBy: string;
  sortDirection: SortDirection;
  yid: number[];
  currency: string;
}

const useQueryParams = () => {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const locale = useLocale();
  const wrapNavigation = useContext(NavigationWrapperContext);
  const navigate = useCallback((fn: () => void) => (wrapNavigation ? wrapNavigation(fn) : fn()), [wrapNavigation]);
  const isEnglishLocale = locale === 'en';

  const defaultParams = useMemo(
    () => ({
      search: '',
      destinations: [],
      startDate: '',
      endDate: '',
      minCabins: 0,
      maxCabins: 0,
      minPersons: 0,
      maxPersons: 0,
      minBerths: 0,
      maxBerths: 0,
      minLength: 0,
      maxLength: isEnglishLocale ? metersToFeet(0, 0) : 0,
      minBuildYear: 0,
      maxBuildYear: 0,
      minWc: 0,
      maxWc: 0,
      minPrice: 0,
      maxPrice: 0,
      minEnginePower: 0,
      maxEnginePower: 0,
      boatTypes: [],
      charterType: [],
      mainSailType: [],
      did: [],
      manufacturers: [],
      models: [],
      amenityLabels: [],
      servicesLabels: [],
      mfid: [],
      mid: [],
      amenities: [],
      services: [],
      page: PAGE_NUMBER,
      sortBy: '',
      sortDirection: 'asc' as SortDirection,
      yid: [],
      currency: Currency.EUR,
    }),
    [isEnglishLocale]
  );

  const getParamsFromUrl = useCallback((): SearchParams => {
    const minLengthParam = searchParams.get('minLength');
    const maxLengthParam = searchParams.get('maxLength');

    const minLength = minLengthParam !== null ? Number(minLengthParam) : defaultParams.minLength;
    const maxLength = maxLengthParam !== null ? Number(maxLengthParam) : defaultParams.maxLength;

    return {
      search: searchParams.get('search') || defaultParams.search,
      destinations: searchParams.get('destinations')?.split(',').filter(Boolean) || defaultParams.destinations,
      did: searchParams.get('did')?.split(',').filter(Boolean) || defaultParams.did,
      currency: searchParams.get('currency') || defaultParams.currency,
      startDate: searchParams.get('startDate') || defaultParams.startDate,
      endDate: searchParams.get('endDate') || defaultParams.endDate,
      minCabins:
        searchParams.get('minCabins') !== null ? Number(searchParams.get('minCabins')) : defaultParams.minCabins,
      maxCabins:
        searchParams.get('maxCabins') !== null ? Number(searchParams.get('maxCabins')) : defaultParams.maxCabins,
      minPersons:
        searchParams.get('minPersons') !== null ? Number(searchParams.get('minPersons')) : defaultParams.minPersons,
      maxPersons:
        searchParams.get('maxPersons') !== null ? Number(searchParams.get('maxPersons')) : defaultParams.maxPersons,
      minBerths:
        searchParams.get('minBerths') !== null ? Number(searchParams.get('minBerths')) : defaultParams.minBerths,
      maxBerths:
        searchParams.get('maxBerths') !== null ? Number(searchParams.get('maxBerths')) : defaultParams.maxBerths,
      minLength,
      maxLength,
      minBuildYear:
        searchParams.get('minBuildYear') !== null
          ? Number(searchParams.get('minBuildYear'))
          : defaultParams.minBuildYear,
      maxBuildYear:
        searchParams.get('maxBuildYear') !== null
          ? Number(searchParams.get('maxBuildYear'))
          : defaultParams.maxBuildYear,
      minWc: searchParams.get('minWc') !== null ? Number(searchParams.get('minWc')) : defaultParams.minWc,
      maxWc: searchParams.get('maxWc') !== null ? Number(searchParams.get('maxWc')) : defaultParams.maxWc,
      minPrice: searchParams.get('minPrice') !== null ? Number(searchParams.get('minPrice')) : defaultParams.minPrice,
      maxPrice: searchParams.get('maxPrice') !== null ? Number(searchParams.get('maxPrice')) : defaultParams.maxPrice,
      minEnginePower:
        searchParams.get('minEnginePower') !== null
          ? Number(searchParams.get('minEnginePower'))
          : defaultParams.minEnginePower,
      maxEnginePower:
        searchParams.get('maxEnginePower') !== null
          ? Number(searchParams.get('maxEnginePower'))
          : defaultParams.maxEnginePower,
      boatTypes: searchParams.get('boatTypes')?.split(',').filter(Boolean) || defaultParams.boatTypes,
      charterType: searchParams.get('charterType')?.split(',').filter(Boolean) || defaultParams.charterType,
      mainSailType: searchParams.get('mainSailType')?.split(',').filter(Boolean) || defaultParams.mainSailType,
      manufacturers: searchParams.get('manufacturers')?.split(',').filter(Boolean) || defaultParams.manufacturers,
      models: searchParams.get('models')?.split(',').filter(Boolean) || defaultParams.models,
      amenityLabels: searchParams.get('amenityLabels')?.split(',').filter(Boolean) || defaultParams.amenityLabels,
      servicesLabels: searchParams.get('servicesLabels')?.split(',').filter(Boolean) || defaultParams.servicesLabels,
      mfid: searchParams.get('mfid')?.split(',').filter(Boolean).map(Number) || defaultParams.mfid,
      mid: searchParams.get('mid')?.split(',').filter(Boolean).map(Number) || defaultParams.mid,
      amenities: searchParams.get('amenities')?.split(',').filter(Boolean).map(Number) || defaultParams.amenities,
      services: searchParams.get('services')?.split(',').filter(Boolean).map(Number) || defaultParams.services,
      page: Number(searchParams.get('page')) || defaultParams.page,
      // Empty string `sortBy=` in the URL is an intentional value (Recommended),
      // not "missing". Use `??` to preserve it instead of falling back to the
      // default — `||` would re-map '' to the default and cause a feedback loop
      // with BoatsSection's "no dates → bounce sortBy" effect.
      sortBy: searchParams.get('sortBy') ?? defaultParams.sortBy,
      sortDirection: (searchParams.get('sortDirection') as SortDirection) || defaultParams.sortDirection,
      yid: searchParams.get('yid')?.split(',').filter(Boolean).map(Number) || defaultParams.yid,
    };
  }, [searchParams, defaultParams]);

  const [params, setParams] = useState<SearchParams>(getParamsFromUrl);

  const updateUrl = (updates: Partial<SearchParams>) => {
    const updatedState = { ...params, ...updates };

    setParams(updatedState);

    const newParams = new URLSearchParams();

    Object.entries(updatedState).forEach(([key, value]) => {
      const defaultValue = defaultParams[key as keyof SearchParams];

      if (value === defaultValue) return;

      if (Array.isArray(value)) {
        if (value.length > 0) {
          newParams.set(key, value.join(','));
        }
      } else if (typeof value === 'number') {
        newParams.set(key, String(Math.round(value)));
      } else if (typeof value === 'string') {
        newParams.set(key, value);
      }
    });

    const queryString = newParams.toString();
    const newUrl = queryString ? `${pathname}?${queryString}` : pathname;

    const scrollOption = wrapNavigation ? { scroll: false } : undefined;

    navigate(() => router.push(newUrl, scrollOption));
  };
  const setParam = <K extends keyof SearchParams>(key: K, value: SearchParams[K]) => {
    updateUrl({ [key]: value });
  };

  const setMultipleParams = (updates: Partial<SearchParams>) => {
    updateUrl(updates);
  };

  const resetParams = () => {
    const scrollOption = wrapNavigation ? { scroll: false } : undefined;

    navigate(() => router.replace(pathname, scrollOption));
  };

  const createQueryParams = (inputParams: Partial<SearchParams>, defaults = defaultParams): string => {
    const qs = new URLSearchParams();

    Object.entries(inputParams).forEach(([key, value]) => {
      const defaultValue = defaults[key as keyof SearchParams];

      if (value === undefined || value === defaultValue) return;

      if (Array.isArray(value)) {
        if (value.length > 0) {
          qs.set(key, value.join(','));
        }
      } else if (typeof value === 'number' || typeof value === 'string') {
        qs.set(key, String(value));
      }
    });

    return qs.toString();
  };

  const hasActiveFilters = Object.entries(params).some(([key, value]) => {
    const defaultValue = defaultParams[key as keyof SearchParams];

    return Array.isArray(value) ? value.length > 0 : value !== defaultValue;
  });

  // Sync local state when URL actually changes. Depend on the serialized URL
  // (string) instead of the `URLSearchParams` reference — in Next.js 16 +
  // Turbopack, `useSearchParams()` can return a new object each render even
  // when the URL hasn't changed, which would otherwise cause an infinite
  // re-render loop (setParams → re-render → new ref → useEffect fires again).
  const searchParamsKey = searchParams.toString();

  useEffect(() => {
    setParams(getParamsFromUrl());
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchParamsKey]);

  return {
    params,
    setParam,
    setMultipleParams,
    resetParams,
    createQueryParams,
    queryParams: createQueryParams(params),
    hasActiveFilters,
  };
};

export default useQueryParams;

/**
 * Maps the URL `sortBy` param to the matching tab index.
 * Order must stay in sync with `boatsTabs` in `config/tabs.config.ts`:
 *   0 → Recommended   (sortBy '')
 *   1 → Lowest price  (sortBy 'asc')
 *   2 → Highest price (sortBy 'desc')
 *   3 → Min length    (sortBy 'lengthAsc')
 *   4 → Max length    (sortBy 'lengthDesc')
 */
export const getTabValueFromParams = (sortBy: SortByValue): number => {
  switch (sortBy) {
    case 'asc':
      return 1;
    case 'desc':
      return 2;
    case 'lengthAsc':
      return 3;
    case 'lengthDesc':
      return 4;
    default:
      // includes '' (recommended) and legacy 'lowestPrepayment' which no
      // longer has a dedicated tab — fall back to Recommended.
      return 0;
  }
};
