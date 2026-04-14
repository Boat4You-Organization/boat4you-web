'use client';

import { useCallback } from 'react';

import { Stack, Typography } from '@mui/material';
import cx from 'clsx';
import { useLocale, useTranslations } from 'next-intl';

import { SelectOption } from '@/components/AutocompleteMultiple/AutocompleteMultiple';
import FilterSlider from '@/components/FilterSlider';
import { currencySymbols } from '@/config/currencies.config';
import { CatalogueData, CatalogueFilters } from '@/models/catalogue.model';
import { Currency } from '@/models/user.model';
import colors from '@/styles/themes/colors';
import useAmenityAutocompleteMultiple from '@/utils/hooks/useAmenitiesAutocomplete';
import useCharterTypes from '@/utils/hooks/useCharterTypes';
import useFilterChips from '@/utils/hooks/useFilterChips';
import useMainSailType from '@/utils/hooks/useMainSailType';
import useManufacturerAutocompleteMultiple from '@/utils/hooks/useManufacturersAutocompleteMultiple';
import useModelAutocompleteMultiple from '@/utils/hooks/useModelAutocompleteMultiple';
import useQueryParams from '@/utils/hooks/useQueryParams';
import useServices from '@/utils/hooks/useServices';
import { metersToFeet } from '@/utils/static/metersToFeet';
import { useUserStore } from '@/valtio/user/user.store';

import FilterChip from './FilterChip';
import styles from './FiltersSection.module.scss';

interface FiltersSectionProps {
  catalogueData: CatalogueData;
  catalogueFilters?: CatalogueFilters | null;
  isMobile?: boolean;
}

const FiltersSection = ({ catalogueData, catalogueFilters, isMobile }: FiltersSectionProps) => {
  const { user } = useUserStore();
  const { params, setMultipleParams } = useQueryParams();
  const { filterChips } = useFilterChips(catalogueFilters);
  const locale = useLocale();
  const t = useTranslations('filters');

  const isEnglishLocale = locale === 'en';

  const urlCurrency = params.currency as Currency;
  const currentCurrency = user?.currency || urlCurrency || Currency.EUR;

  const handleManufacturersChange = useCallback(
    (newSelectedManufacturers: SelectOption[]) => {
      const manufacturerIds = newSelectedManufacturers.map(manufacturer => Number(manufacturer.id));
      const manufacturerLabels = newSelectedManufacturers.map(manufacturer => manufacturer.label);

      setMultipleParams({
        mfid: manufacturerIds,
        manufacturers: manufacturerLabels,
        page: 1,
      });
    },
    [setMultipleParams]
  );

  const handleModelsChange = useCallback(
    (newSelectedModels: SelectOption[]) => {
      const modelIds = newSelectedModels.map(model => Number(model.id));
      const modelLabels = newSelectedModels.map(model => model.label);

      setMultipleParams({
        mid: modelIds,
        models: modelLabels,
        page: 1,
      });
    },
    [setMultipleParams]
  );

  const handleAmenitiesChange = useCallback(
    (newSelectedAmenities: SelectOption[]) => {
      const amenityIds = newSelectedAmenities.map(amenity => Number(amenity.id));
      const amenityLabelCodes = newSelectedAmenities.map(amenity => {
        const amenityData = catalogueData.amenities.find(a => a.id.toString() === amenity.id);

        return amenityData ? amenityData.labelCode : amenity.id;
      });

      setMultipleParams({
        amenities: amenityIds,
        amenityLabels: amenityLabelCodes,
        page: 1,
      });
    },
    [catalogueData.amenities, setMultipleParams]
  );

  const handleCharterTypesChange = useCallback(
    (selectedCharterTypes: string[]) => {
      setMultipleParams({
        charterType: selectedCharterTypes,
        page: 1,
      });
    },
    [setMultipleParams]
  );

  const handleMainSailTypeChange = useCallback(
    (selectedMainSailTypes: string[]) => {
      setMultipleParams({
        mainSailType: selectedMainSailTypes,
        page: 1,
      });
    },
    [setMultipleParams]
  );

  const handleServicesChange = useCallback(
    (selectedServices: SelectOption[]) => {
      setMultipleParams({
        services: selectedServices.map(service => Number(service.id)),
        servicesLabels: selectedServices.map(service => service.label),
        page: 1,
      });
    },
    [setMultipleParams]
  );

  const renderManufacturerInput = useManufacturerAutocompleteMultiple({
    selectedIds: params.mfid,
    onChange: handleManufacturersChange,
    manufacturers: catalogueData.manufacturers,
  });

  const renderModelInput = useModelAutocompleteMultiple({
    manufacturerIds: params.mfid,
    selectedIds: params.mid,
    onChange: handleModelsChange,
  });

  const renderAmenityInput = useAmenityAutocompleteMultiple({
    selectedIds: params.amenities || [],
    onChange: handleAmenitiesChange,
    amenities: catalogueData.amenities,
  });

  const renderCharterTypesInput = useCharterTypes({
    selectedIds: params.charterType || [],
    onChange: handleCharterTypesChange,
    charterTypes: catalogueData.charterTypes,
  });

  const renderMainSailTypeInput = useMainSailType({
    selectedIds: params.mainSailType || [],
    onChange: handleMainSailTypeChange,
  });

  const renderServicesInput = useServices({
    selectedIds: params.services || [],
    onChange: handleServicesChange,
    services: catalogueData.services,
  });

  return (
    <Stack
      className={cx(styles.container, { [styles.mobile]: isMobile })}
      sx={{ display: { xs: isMobile ? 'flex' : 'none', lg: 'flex' }, gap: 3 }}
    >
      {filterChips.length > 0 && (
        <>
          <Typography variant="h4" component="p" color={colors.blue500}>
            {t('activeFilters')}
          </Typography>
          <Stack direction="row" gap={2} flexWrap="wrap">
            {filterChips.map(filter => (
              <FilterChip key={filter.id} label={filter.label} onDelete={filter.onDelete} />
            ))}
          </Stack>
        </>
      )}
      <Typography component="p" variant="h4" color={colors.blue500}>
        {t('filterBy')}
      </Typography>
      <FilterSlider
        minParamKey="minPrice"
        maxParamKey="maxPrice"
        min={catalogueFilters?.minPrice.amount ?? 40}
        max={46000}
        title={t('pricePerDay')}
        step={10}
        unit={currencySymbols[currentCurrency]}
        formatValue={value => value.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
        unboundedMax
      />
      <FilterSlider
        minParamKey="minCabins"
        maxParamKey="maxCabins"
        min={catalogueFilters?.minCabins ?? 0}
        max={catalogueFilters?.maxCabins ?? 20}
        title={t('cabins')}
      />
      <FilterSlider
        minParamKey="minPersons"
        maxParamKey="maxPersons"
        min={catalogueFilters?.minPersons ?? 1}
        max={catalogueFilters?.maxPersons ?? 80}
        title={t('people')}
      />
      <FilterSlider
        minParamKey="minBerths"
        maxParamKey="maxBerths"
        min={catalogueFilters?.minBerths ?? 0}
        max={catalogueFilters?.maxBerths ?? 46}
        title={t('berths')}
      />
      <FilterSlider
        minParamKey="minLength"
        maxParamKey="maxLength"
        min={catalogueFilters?.minLength.amount ?? (isEnglishLocale ? metersToFeet(0, 0) : 0)}
        max={catalogueFilters?.maxLength.amount ?? (isEnglishLocale ? metersToFeet(150, 0) : 150)}
        title={isEnglishLocale ? t('lengthFeet') : t('lengthMeters')}
        step={1}
      />
      <FilterSlider
        minParamKey="minBuildYear"
        maxParamKey="maxBuildYear"
        min={catalogueFilters?.minYear ?? 1926}
        max={catalogueFilters?.maxYear ?? 2027}
        title={t('year')}
      />
      <FilterSlider
        minParamKey="minWc"
        maxParamKey="maxWc"
        min={catalogueFilters?.minWc ?? 0}
        max={catalogueFilters?.maxWc ?? 31}
        title={t('toilets')}
      />
      <FilterSlider
        minParamKey="minEnginePower"
        maxParamKey="maxEnginePower"
        min={catalogueFilters?.minEnginePower ?? 0}
        max={catalogueFilters?.maxEnginePower ?? 32000}
        title={t('engine')}
      />
      {renderCharterTypesInput()}
      {renderManufacturerInput()}
      {renderModelInput()}
      {renderAmenityInput()}
      {renderMainSailTypeInput()}
      {renderServicesInput()}
    </Stack>
  );
};

export default FiltersSection;
