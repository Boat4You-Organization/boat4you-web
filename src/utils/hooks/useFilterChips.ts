import { useCallback, useMemo } from 'react';

import { useLocale, useTranslations } from 'next-intl';
import { useSearchParams } from 'next/navigation';

import { CatalogueFilters } from '@/models/catalogue.model';
import { CHARTER_TYPE_LABEL_MAP, MAIN_SAIL_TYPE_LABEL_MAP } from '@/models/yacht.model';
import { metersToFeet } from '@/utils/static/metersToFeet';

import useQueryParams, { SearchParams } from './useQueryParams';

interface FilterChipData {
  id: string;
  label: string;
  onDelete: () => void;
}

interface FilterConfig {
  id: string;
  minKey: keyof SearchParams;
  maxKey: keyof SearchParams;
  minDefault: number;
  maxDefault: number;
  translationKey: string;
  formatLabel: (min: number, max: number) => string;
}

interface ArrayFilterConfig {
  id: string;
  labelsKey: keyof SearchParams;
  idsKey: keyof SearchParams;
  translationKey: string;
}

interface SimpleArrayFilterConfig {
  id: string;
  key: keyof SearchParams;
  translationKey: string;
  getLabel: (value: string) => string;
}

const useFilterChips = (catalogueFilters?: CatalogueFilters | null) => {
  const { params, setMultipleParams } = useQueryParams();
  const rawSearchParams = useSearchParams();
  const tFilters = useTranslations('filters');
  const t = useTranslations();
  const locale = useLocale();
  const isEnglishLocale = locale === 'en';

  const rangeFilters: FilterConfig[] = useMemo(
    () => [
      {
        id: 'price',
        minKey: 'minPrice',
        maxKey: 'maxPrice',
        minDefault: catalogueFilters?.minPrice.amount ?? 40,
        maxDefault: 46000,
        translationKey: 'pricePerDay',
        formatLabel: (min, max) => {
          const formatPrice = (value: number) =>
            value.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
          const maxLabel = max === 46000 ? `${formatPrice(max)}+€` : `${formatPrice(max)}€`;

          return `${formatPrice(min)}€ - ${maxLabel}`;
        },
      },
      {
        id: 'cabins',
        minKey: 'minCabins',
        maxKey: 'maxCabins',
        minDefault: catalogueFilters?.minCabins ?? 0,
        maxDefault: catalogueFilters?.maxCabins ?? 20,
        translationKey: 'cabins',
        formatLabel: (min, max) => `${tFilters('cabins')}: ${min}-${max}`,
      },
      {
        id: 'people',
        minKey: 'minPersons',
        maxKey: 'maxPersons',
        minDefault: catalogueFilters?.minPersons ?? 1,
        maxDefault: catalogueFilters?.maxPersons ?? 80,
        translationKey: 'people',
        formatLabel: (min, max) => `${tFilters('people')}: ${min}-${max}`,
      },
      {
        id: 'berths',
        minKey: 'minBerths',
        maxKey: 'maxBerths',
        minDefault: catalogueFilters?.minBerths ?? 0,
        maxDefault: catalogueFilters?.maxBerths ?? 46,
        translationKey: 'berths',
        formatLabel: (min, max) => `${tFilters('berths')}: ${min}-${max}`,
      },
      {
        id: 'year',
        minKey: 'minBuildYear',
        maxKey: 'maxBuildYear',
        minDefault: catalogueFilters?.minYear ?? 1926,
        maxDefault: catalogueFilters?.maxYear ?? new Date().getFullYear(),
        translationKey: 'year',
        formatLabel: (min, max) => `${tFilters('year')}: ${min}-${max}`,
      },
      {
        id: 'toilets',
        minKey: 'minWc',
        maxKey: 'maxWc',
        minDefault: catalogueFilters?.minWc ?? 0,
        maxDefault: catalogueFilters?.maxWc ?? 31,
        translationKey: 'toilets',
        formatLabel: (min, max) => `${tFilters('toilets')}: ${min}-${max}`,
      },
      {
        id: 'length',
        minKey: 'minLength',
        maxKey: 'maxLength',
        minDefault: catalogueFilters?.minLength.amount ?? 0,
        maxDefault: catalogueFilters?.maxLength.amount ?? (isEnglishLocale ? metersToFeet(157, 0) : 157),
        translationKey: isEnglishLocale ? 'lengthFeet' : 'lengthMeters',
        formatLabel: (min, max) => `${tFilters(isEnglishLocale ? 'lengthFeet' : 'lengthMeters')}: ${min}-${max}`,
      },
      {
        id: 'engine',
        minKey: 'minEnginePower',
        maxKey: 'maxEnginePower',
        minDefault: catalogueFilters?.minEnginePower ?? 0,
        maxDefault: catalogueFilters?.maxEnginePower ?? 32000,
        translationKey: 'engine',
        formatLabel: (min, max) => `${tFilters('engine')}: ${min}-${max}`,
      },
    ],
    [tFilters, isEnglishLocale, catalogueFilters]
  );

  const arrayFilters: ArrayFilterConfig[] = useMemo(
    () => [
      {
        id: 'manufacturer',
        labelsKey: 'manufacturers',
        idsKey: 'mfid',
        translationKey: 'manufacturers',
      },
      {
        id: 'model',
        labelsKey: 'models',
        idsKey: 'mid',
        translationKey: 'models',
      },
      {
        id: 'amenity',
        labelsKey: 'amenityLabels',
        idsKey: 'amenities',
        translationKey: 'amenities',
      },
      {
        id: 'service',
        labelsKey: 'servicesLabels',
        idsKey: 'services',
        translationKey: 'services',
      },
    ],
    []
  );

  const simpleArrayFilters: SimpleArrayFilterConfig[] = useMemo(
    () => [
      {
        id: 'charterType',
        key: 'charterType',
        translationKey: 'charterType',
        getLabel: value => t(CHARTER_TYPE_LABEL_MAP[value as keyof typeof CHARTER_TYPE_LABEL_MAP]),
      },
      {
        id: 'mainSailType',
        key: 'mainSailType',
        translationKey: 'mainSailType',
        getLabel: value => t(MAIN_SAIL_TYPE_LABEL_MAP[value as keyof typeof MAIN_SAIL_TYPE_LABEL_MAP]),
      },
    ],
    [t]
  );

  const createRangeFilterDeleteHandler = useCallback(
    (minKey: keyof SearchParams, maxKey: keyof SearchParams) => () => {
      setMultipleParams({
        [minKey]: undefined,
        [maxKey]: undefined,
      });
    },
    [setMultipleParams]
  );

  const createArrayFilterDeleteHandler = useCallback(
    (labelsKey: keyof SearchParams, idsKey: keyof SearchParams, index: number) => () => {
      const currentLabels = params[labelsKey] as string[];
      const currentIds = params[idsKey] as number[];

      const newLabels = currentLabels.filter((_, i) => i !== index);
      const newIds = currentIds.filter((_, i) => i !== index);

      setMultipleParams({
        [labelsKey]: newLabels,
        [idsKey]: newIds,
      });
    },
    [params, setMultipleParams]
  );

  const createSimpleArrayFilterDeleteHandler = useCallback(
    (key: keyof SearchParams, index: number) => () => {
      const currentValues = params[key] as string[];
      const newValues = currentValues.filter((_, i) => i !== index);

      setMultipleParams({
        [key]: newValues,
      });
    },
    [params, setMultipleParams]
  );

  const filterChips = useMemo((): FilterChipData[] => {
    const chips: FilterChipData[] = [];

    rangeFilters.forEach(({ id, minKey, maxKey, minDefault, maxDefault, formatLabel }) => {
      const rawMin = rawSearchParams.get(minKey as string);
      const rawMax = rawSearchParams.get(maxKey as string);

      const minValue = rawMin !== null ? Number(rawMin) : minDefault;
      const maxValue = rawMax !== null ? Number(rawMax) : maxDefault;

      if (minValue !== minDefault || maxValue !== maxDefault) {
        chips.push({
          id,
          label: formatLabel(minValue, maxValue),
          onDelete: createRangeFilterDeleteHandler(minKey, maxKey),
        });
      }
    });

    arrayFilters.forEach(({ id, labelsKey, idsKey }) => {
      const labels = params[labelsKey] as string[];

      if (labels && labels.length > 0) {
        labels.forEach((label, index) => {
          chips.push({
            id: `${id}-${index}`,
            label,
            onDelete: createArrayFilterDeleteHandler(labelsKey, idsKey, index),
          });
        });
      }
    });

    simpleArrayFilters.forEach(({ id, key, getLabel }) => {
      const values = params[key] as string[];

      if (values && values.length > 0) {
        values.forEach((value, index) => {
          chips.push({
            id: `${id}-${index}`,
            label: getLabel(value),
            onDelete: createSimpleArrayFilterDeleteHandler(key, index),
          });
        });
      }
    });

    return chips;
  }, [
    params,
    rawSearchParams,
    rangeFilters,
    arrayFilters,
    simpleArrayFilters,
    createRangeFilterDeleteHandler,
    createArrayFilterDeleteHandler,
    createSimpleArrayFilterDeleteHandler,
  ]);

  return {
    filterChips,
  };
};

export default useFilterChips;
