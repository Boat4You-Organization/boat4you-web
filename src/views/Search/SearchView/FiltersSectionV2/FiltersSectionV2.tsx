'use client';

import { useCallback, useEffect, useMemo, useRef, useState } from 'react';

import { Box, Stack } from '@mui/material';
import { useLocale, useTranslations } from 'next-intl';

import { SelectOption } from '@/components/AutocompleteMultiple/AutocompleteMultiple';
import { currencySymbols } from '@/config/currencies.config';
import { CatalogueData, CatalogueFilters } from '@/models/catalogue.model';
import { Currency } from '@/models/user.model';
import { CharterType, MainSailType, VesselType } from '@/models/yacht.model';
import { searchV2, searchV2Layout, searchV2Type } from '@/styles/themes/searchV2';
import useAmenityAutocompleteMultiple from '@/utils/hooks/useAmenitiesAutocomplete';
import useManufacturerAutocompleteMultiple from '@/utils/hooks/useManufacturersAutocompleteMultiple';
import useModelAutocompleteMultiple from '@/utils/hooks/useModelAutocompleteMultiple';
import useQueryParams from '@/utils/hooks/useQueryParams';
import DateTime from '@/utils/static/DateTime';
import { metersToFeet } from '@/utils/static/metersToFeet';
import { useUserStore } from '@/valtio/user/user.store';
import { useYachtStore } from '@/valtio/yacht/yacht.store';

import CabinsPillSegment from './atoms/CabinsPillSegment';
import CheckV2 from './atoms/CheckV2';
import FilterGroup from './atoms/FilterGroup';
import FilterRangeSliderV2 from './atoms/FilterRangeSliderV2';
import SearchSummaryCard from './atoms/SearchSummaryCard';
import YachtTypeGrid from './atoms/YachtTypeGrid';
import { useFilterDistribution } from './useFilterDistribution';

interface FiltersSectionV2Props {
  catalogueData: CatalogueData;
  catalogueFilters?: CatalogueFilters | null;
  isMobile?: boolean;
}

/**
 * V2 search filter sidebar — implements
 * `~/Downloads/design_handoff_filter/README.md` on top of the existing
 * URL-state contract (`useQueryParams`). The atoms are presentational;
 * this master component holds local "in-flight" state for sliders so
 * they don't push a router transition on every drag tick (debounce
 * ~250ms before committing).
 *
 * Catalogue autocomplete fields (Manufacturer, Model, Amenities) reuse
 * the existing hooks — they're wrapped in V2 `<FilterGroup>` shells
 * but the input visuals are still the legacy MUI autocomplete style.
 * Tightening those to the handoff `<SearchInput>` shape is a separate
 * polish task; the functional contract (URL params, cascading) stays
 * intact.
 */
const FiltersSectionV2 = ({ catalogueData, catalogueFilters, isMobile }: FiltersSectionV2Props) => {
  const { user } = useUserStore();
  const { params, setMultipleParams } = useQueryParams();
  const liveCount = useYachtStore().searchTotalCount;
  const distribution = useFilterDistribution();
  const locale = useLocale();
  const isEnglishLocale = locale === 'en';
  const t = useTranslations('filters');
  const tHome = useTranslations('home');

  const urlCurrency = params.currency as Currency;
  const currentCurrency = user?.currency || urlCurrency || Currency.EUR;
  const currencySymbol = currencySymbols[currentCurrency];

  // ── Slider local state ────────────────────────────────────────────
  // Range sliders push every tick to local state, then a 250ms
  // debounced effect commits the *latest* values to the URL. Direct
  // dispatch on every tick saturates the router with transitions and
  // makes the sidebar visibly stutter.
  type Range = [number, number];

  // `catalogueFilters` can report values outside the slider's hard bounds
  // (e.g. maxPersons=80 or a 515m yacht length anomaly), which would render
  // the handle off the track and force a page-level horizontal scroll. Clamp
  // every initial / synced value to the slider's [min, max].
  const clamp = (v: number, lo: number, hi: number) => Math.max(lo, Math.min(hi, v));
  // Hardcoded weekly slider bounds — €500 → €200,000 (Mario, 2026-04-26:
  // "fiksno, samo se treba prikazivati plovila ponuđena gdje su u tom rasponu").
  // Backend mirrors these in `YachtDistributionService.PRICE_MIN_WEEKLY/MAX_WEEKLY`
  // and `YachtController` divides URL minPrice/maxPrice / 7 before the WHERE clause
  // so the per-day `client_price` column matches the weekly slider value.
  const minPrice = 500;
  const maxPrice = 200_000;
  const [priceRange, setPriceRange] = useState<Range>([
    clamp(Math.round(params.minPrice || 0), minPrice, maxPrice),
    clamp(Math.round(params.maxPrice || maxPrice), minPrice, maxPrice),
  ]);
  const [people, setPeople] = useState<Range>([
    clamp(params.minPersons || (catalogueFilters?.minPersons ?? 0), 0, 42),
    clamp(params.maxPersons || (catalogueFilters?.maxPersons ?? 42), 0, 42),
  ]);
  const [berths, setBerths] = useState<Range>([
    clamp(params.minBerths || (catalogueFilters?.minBerths ?? 0), 0, 42),
    clamp(params.maxBerths || (catalogueFilters?.maxBerths ?? 42), 0, 42),
  ]);
  const [length, setLength] = useState<Range>([
    clamp(params.minLength || (catalogueFilters?.minLength.amount ?? 4), 4, 56),
    clamp(
      params.maxLength || (catalogueFilters?.maxLength.amount ?? (isEnglishLocale ? metersToFeet(56, 0) : 56)),
      4,
      56
    ),
  ]);
  const yearMax = DateTime.getMaxBuildYear(catalogueFilters?.maxYear);
  const [year, setYear] = useState<Range>([
    clamp(params.minBuildYear || (catalogueFilters?.minYear ?? 2000), 2000, yearMax),
    clamp(params.maxBuildYear || (catalogueFilters?.maxYear ?? yearMax), 2000, yearMax),
  ]);
  const [toilets, setToilets] = useState<Range>([
    clamp(params.minWc || (catalogueFilters?.minWc ?? 0), 0, 20),
    clamp(params.maxWc || (catalogueFilters?.maxWc ?? 20), 0, 20),
  ]);
  const [engine, setEngine] = useState<Range>([
    clamp(params.minEnginePower || (catalogueFilters?.minEnginePower ?? 5), 5, 7296),
    clamp(params.maxEnginePower || (catalogueFilters?.maxEnginePower ?? 7296), 5, 7296),
  ]);

  // Sync local state when URL changes externally (chip removal, back
  // button, route from a yacht detail page that mutated params).
  useEffect(() => {
    setPriceRange([
      clamp(Math.round(params.minPrice || 0), minPrice, maxPrice),
      clamp(Math.round(params.maxPrice || maxPrice), minPrice, maxPrice),
    ]);
    setPeople([clamp(params.minPersons || 0, 0, 42), clamp(params.maxPersons || 42, 0, 42)]);
    setBerths([clamp(params.minBerths || 0, 0, 42), clamp(params.maxBerths || 42, 0, 42)]);
    setLength([clamp(params.minLength || 4, 4, 56), clamp(params.maxLength || 56, 4, 56)]);
    setYear([clamp(params.minBuildYear || 2000, 2000, yearMax), clamp(params.maxBuildYear || yearMax, 2000, yearMax)]);
    setToilets([clamp(params.minWc || 0, 0, 20), clamp(params.maxWc || 20, 0, 20)]);
    setEngine([clamp(params.minEnginePower || 5, 5, 7296), clamp(params.maxEnginePower || 7296, 5, 7296)]);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    params.minPrice,
    params.maxPrice,
    params.minPersons,
    params.maxPersons,
    params.minBerths,
    params.maxBerths,
    params.minLength,
    params.maxLength,
    params.minBuildYear,
    params.maxBuildYear,
    params.minWc,
    params.maxWc,
    params.minEnginePower,
    params.maxEnginePower,
  ]);

  // Debounced commit ─────────────────────────────────────────────────
  const commitTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const commitDebounced = useCallback(
    (updates: Record<string, number | string | string[] | number[] | undefined>) => {
      if (commitTimer.current) clearTimeout(commitTimer.current);

      commitTimer.current = setTimeout(() => {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        setMultipleParams({ ...(updates as any), page: 1 });
      }, 250);
    },
    [setMultipleParams]
  );

  // Cabins ──────────────────────────────────────────────────────────
  // Map between the V1 `minCabins`/`maxCabins` params and the V2 single
  // pill state. Convention used here:
  //   "Any"  → minCabins=0, maxCabins=0 (no constraint)
  //   1..5   → minCabins=N, maxCabins=N
  //   "6+"   → minCabins=6, maxCabins=0 (open-ended)
  const cabinsValue = useMemo<number | null>(() => {
    const lo = params.minCabins;
    const hi = params.maxCabins;

    if (!lo && !hi) return null;

    if (lo === hi && lo > 0 && lo <= 5) return lo;

    if (lo >= 6 && !hi) return 6;

    return null;
  }, [params.minCabins, params.maxCabins]);

  const handleCabinsChange = (next: number | null) => {
    if (next == null) {
      setMultipleParams({ minCabins: 0, maxCabins: 0, page: 1 });
    } else if (next === 6) {
      setMultipleParams({ minCabins: 6, maxCabins: 0, page: 1 });
    } else {
      setMultipleParams({ minCabins: next, maxCabins: next, page: 1 });
    }
  };

  // Yacht type ──────────────────────────────────────────────────────
  const selectedTypes = (params.boatTypes || []) as VesselType[];
  const handleTypeToggle = (type: VesselType) => {
    const next = selectedTypes.includes(type) ? selectedTypes.filter(t => t !== type) : [...selectedTypes, type];

    setMultipleParams({ boatTypes: next, page: 1 });
  };

  // Rental type (charter type as Bareboat / Skippered checkbox pair) ─
  const selectedCharterTypes = new Set(params.charterType || []);
  const handleCharterToggle = (id: CharterType) => {
    const next = new Set(selectedCharterTypes);

    next.has(id) ? next.delete(id) : next.add(id);
    setMultipleParams({ charterType: Array.from(next), page: 1 });
  };

  // Mainsail ─────────────────────────────────────────────────────────
  const selectedMainsail = new Set(params.mainSailType || []);
  const handleMainsailToggle = (id: MainSailType) => {
    const next = new Set(selectedMainsail);

    next.has(id) ? next.delete(id) : next.add(id);
    setMultipleParams({ mainSailType: Array.from(next), page: 1 });
  };

  // Manufacturer / Model / Amenities — reuse legacy hooks ───────────
  const handleManufacturersChange = useCallback(
    (selected: SelectOption[]) => {
      setMultipleParams({
        mfid: selected.map(m => Number(m.id)),
        manufacturers: selected.map(m => m.label),
        page: 1,
      });
    },
    [setMultipleParams]
  );
  const handleModelsChange = useCallback(
    (selected: SelectOption[]) => {
      setMultipleParams({
        mid: selected.map(m => Number(m.id)),
        models: selected.map(m => m.label),
        page: 1,
      });
    },
    [setMultipleParams]
  );
  const handleAmenitiesChange = useCallback(
    (selected: SelectOption[]) => {
      const labelCodes = selected.map(amenity => {
        const data = catalogueData.amenities.find(a => a.id.toString() === amenity.id);

        return data ? data.labelCode : amenity.id;
      });

      setMultipleParams({
        amenities: selected.map(a => Number(a.id)),
        amenityLabels: labelCodes,
        page: 1,
      });
    },
    [catalogueData.amenities, setMultipleParams]
  );

  // Manufacturer / model / amenity ids that have ≥1 yacht in the current
  // filter context. Source: distribution endpoint (`byManufacturer` /
  // `byModel` / `byAmenity` — facet pattern, computed with all active
  // filters EXCEPT the dimension itself). When distribution hasn't returned
  // yet we leave them undefined so every option stays enabled instead of
  // all-greyed-out flicker.
  const enabledManufacturerIds = useMemo(() => {
    if (!distribution?.byManufacturer) return undefined;

    return new Set(Object.keys(distribution.byManufacturer).map(Number));
  }, [distribution?.byManufacturer]);

  const enabledModelIds = useMemo(() => {
    if (!distribution?.byModel) return undefined;

    return new Set(Object.keys(distribution.byModel).map(Number));
  }, [distribution?.byModel]);

  const enabledAmenityIds = useMemo(() => {
    if (!distribution?.byAmenity) return undefined;

    return new Set(Object.keys(distribution.byAmenity).map(Number));
  }, [distribution?.byAmenity]);

  const renderManufacturerInput = useManufacturerAutocompleteMultiple({
    selectedIds: params.mfid,
    onChange: handleManufacturersChange,
    manufacturers: catalogueData.manufacturers,
    enabledIds: enabledManufacturerIds,
  });
  const renderModelInput = useModelAutocompleteMultiple({
    manufacturerIds: params.mfid,
    selectedIds: params.mid,
    onChange: handleModelsChange,
    enabledIds: enabledModelIds,
  });
  const renderAmenityInput = useAmenityAutocompleteMultiple({
    selectedIds: params.amenities || [],
    onChange: handleAmenitiesChange,
    amenities: catalogueData.amenities,
    enabledIds: enabledAmenityIds,
  });

  // Translate the URL `?destinations=` value into the active locale before
  // rendering it in the sidebar summary card. Same key set as BoatsSection
  // and the `generateMetadata` server helper — keep the three in sync when
  // POPULAR_SEARCHES gains an entry. Falls back to the raw URL value if
  // the label isn't a known popular destination (custom autocomplete picks).
  const destinationKeyByLabel: Record<string, string> = {
    bahamas: 'bahamas',
    caribbean: 'caribbean',
    croatia: 'croatia',
    france: 'france',
    greece: 'greece',
    italy: 'italy',
    martinique: 'martinique',
    montenegro: 'montenegro',
    seychelles: 'seychelles',
    spain: 'spain',
    turkey: 'türkiye',
    türkiye: 'türkiye',
    'virgin islands (british)': 'virginIslandsBritish',
    grenada: 'grenada',
    'split region': 'splitRegion',
    'ionian region': 'ionianRegion',
  };
  const rawDestination = (params.destinations && params.destinations[0]) || '';
  const destinationKey = destinationKeyByLabel[rawDestination.toLowerCase()];
  const destinationLabel = destinationKey
    ? (tHome.raw(`destinationsSection.destinations.${destinationKey}` as Parameters<typeof tHome.raw>[0]) as string)
    : rawDestination;

  return (
    <Stack
      sx={{
        display: { xs: isMobile ? 'flex' : 'none', lg: 'flex' },
        // Mobile filter is rendered inside a full-screen drawer — let it fill
        // the available width so content (tiles, sliders, chips) breathes
        // across the whole viewport instead of cramming into a 340px column.
        width: isMobile ? '100%' : searchV2Layout.sidebarWidth,
        flexShrink: 0,
        alignSelf: 'flex-start',
        background: searchV2.paper,
        borderRight: isMobile ? 'none' : `1px solid ${searchV2.line}`,
        // No sticky / fixed — the sidebar scrolls with the page, matching the
        // production behavior on boat4you.com. `overflowX: hidden` is kept so
        // a slider handle that lands at the edge can't introduce a page-level
        // horizontal scroll.
        overflowX: 'hidden',
        fontFamily: searchV2Type.fontFamily,
        color: searchV2.ink,
      }}
    >
      <SearchSummaryCard
        destination={destinationLabel}
        startDate={params.startDate}
        endDate={params.endDate}
        liveCount={liveCount}
      />

      <Box sx={{ px: `${searchV2Layout.sidebarPaddingX}px` }}>
        {/* Yacht type ─────────────────────────────────────────── */}
        <FilterGroup title={t('yachtType')} count={selectedTypes.length || undefined}>
          <YachtTypeGrid selected={selectedTypes} onToggle={handleTypeToggle} counts={distribution?.byVesselType} />
        </FilterGroup>

        {/* Price per week ─────────────────────────────────────── */}
        <FilterGroup title={t('pricePerWeek')}>
          <Box sx={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', mb: '6px' }}>
            <Box sx={searchV2Type.numericBig}>
              {currencySymbol}
              {priceRange[0].toLocaleString('en-US')} – {currencySymbol}
              {priceRange[1].toLocaleString('en-US')}
            </Box>
            <Box sx={{ fontSize: 11, color: searchV2.inkSoft }}>
              {distribution?.priceMedian != null
                ? t('medianPrice', {
                    amount: `${currencySymbol}${Math.round(Number(distribution.priceMedian)).toLocaleString('en-US')}`,
                  })
                : ''}
            </Box>
          </Box>
          <FilterRangeSliderV2
            min={minPrice}
            max={maxPrice}
            step={50}
            vMin={priceRange[0]}
            vMax={priceRange[1]}
            onChange={next => {
              setPriceRange(next);
              commitDebounced({
                minPrice: next[0] === minPrice ? undefined : next[0],
                maxPrice: next[1] === maxPrice ? undefined : next[1],
              });
            }}
            hist={distribution?.priceHistogram}
            format={v => `${currencySymbol}${v >= 1000 ? `${(v / 1000).toFixed(0)}k` : v.toLocaleString('en-US')}`}
          />
        </FilterGroup>

        {/* Cabins ─────────────────────────────────────────────── */}
        <FilterGroup title={t('cabins')} count={cabinsValue != null ? 1 : undefined}>
          <CabinsPillSegment value={cabinsValue} onChange={handleCabinsChange} />
        </FilterGroup>

        {/* People ─────────────────────────────────────────────── */}
        <FilterGroup title={t('peopleMaxGuests')}>
          <Box sx={{ ...searchV2Type.numericValue, mb: '6px' }}>
            {t('guestsRange', { min: String(people[0]), max: String(people[1]) })}
          </Box>
          <FilterRangeSliderV2
            min={0}
            max={42}
            vMin={people[0]}
            vMax={people[1]}
            onChange={next => {
              setPeople(next);
              commitDebounced({
                minPersons: next[0] === 0 ? undefined : next[0],
                maxPersons: next[1] === 42 ? undefined : next[1],
              });
            }}
          />
        </FilterGroup>

        {/* Berths ─────────────────────────────────────────────── */}
        <FilterGroup title={t('berths')}>
          <Box sx={{ ...searchV2Type.numericValue, mb: '6px' }}>
            {t('berthsRange', { min: String(berths[0]), max: String(berths[1]) })}
          </Box>
          <FilterRangeSliderV2
            min={0}
            max={42}
            vMin={berths[0]}
            vMax={berths[1]}
            onChange={next => {
              setBerths(next);
              commitDebounced({
                minBerths: next[0] === 0 ? undefined : next[0],
                maxBerths: next[1] === 42 ? undefined : next[1],
              });
            }}
          />
        </FilterGroup>

        {/* Length ─────────────────────────────────────────────── */}
        <FilterGroup title={t('length')}>
          <Box sx={{ ...searchV2Type.numericValue, mb: '6px' }}>
            {length[0]} – {length[1]} m
            <Box component="span" sx={{ fontWeight: 400, color: searchV2.inkSoft, ml: '6px', fontSize: 11 }}>
              ({Math.round(length[0] * 3.28)}–{Math.round(length[1] * 3.28)} ft)
            </Box>
          </Box>
          <FilterRangeSliderV2
            min={4}
            max={56}
            vMin={length[0]}
            vMax={length[1]}
            onChange={next => {
              setLength(next);
              commitDebounced({
                minLength: next[0] === 4 ? undefined : next[0],
                maxLength: next[1] === 56 ? undefined : next[1],
              });
            }}
            hist={distribution?.lengthHistogram}
            format={v => `${v} m`}
          />
        </FilterGroup>

        {/* Year built ─────────────────────────────────────────── */}
        <FilterGroup title={t('yearBuilt')}>
          <Box sx={{ ...searchV2Type.numericValue, mb: '6px' }}>
            {year[0]} – {year[1]}
          </Box>
          <FilterRangeSliderV2
            min={2000}
            max={yearMax}
            vMin={year[0]}
            vMax={year[1]}
            onChange={next => {
              setYear(next);
              commitDebounced({
                minBuildYear: next[0] === 2000 ? undefined : next[0],
                maxBuildYear: next[1] === yearMax ? undefined : next[1],
              });
            }}
          />
        </FilterGroup>

        {/* Toilets ────────────────────────────────────────────── */}
        <FilterGroup title={t('toilets')}>
          <Box sx={{ ...searchV2Type.numericValue, mb: '6px' }}>
            {t('toiletsRange', { min: String(toilets[0]), max: String(toilets[1]), count: toilets[1] })}
          </Box>
          <FilterRangeSliderV2
            min={0}
            max={20}
            vMin={toilets[0]}
            vMax={toilets[1]}
            onChange={next => {
              setToilets(next);
              commitDebounced({
                minWc: next[0] === 0 ? undefined : next[0],
                maxWc: next[1] === 20 ? undefined : next[1],
              });
            }}
          />
          {/* Electric toilets — handoff shows it as a nested check;
              not yet a backend-recognized filter on /yachts. Kept as
              a visual placeholder hidden until the param exists, so
              the V2 sidebar doesn't promise a feature we can't yet
              honour. */}
        </FilterGroup>

        {/* Rental type ────────────────────────────────────────── */}
        <FilterGroup title={t('rentalType')} count={selectedCharterTypes.size || undefined}>
          <CheckV2
            label={t('bareboat')}
            count={distribution?.byCharterType?.[CharterType.BAREBOAT] ?? null}
            checked={selectedCharterTypes.has(CharterType.BAREBOAT)}
            onToggle={() => handleCharterToggle(CharterType.BAREBOAT)}
          />
          <CheckV2
            label={t('skippered')}
            count={distribution?.byCharterType?.[CharterType.CREWED] ?? null}
            checked={selectedCharterTypes.has(CharterType.CREWED)}
            onToggle={() => handleCharterToggle(CharterType.CREWED)}
          />
        </FilterGroup>

        {/* Manufacturer & model ───────────────────────────────── */}
        <FilterGroup
          title={t('manufacturerAndModel')}
          count={(params.mfid?.length || 0) + (params.mid?.length || 0) || undefined}
        >
          {/* Inner FormLabels (Manufacturer / Model) come from legacy MUI
              autocomplete hooks — restyle to match V2 section-label spec
              (uppercase, tracked, 11px) instead of the default oversized
              MUI label so the visual hierarchy stays consistent. */}
          <Box
            sx={{
              mb: '10px',
              '& .MuiFormLabel-root': {
                ...searchV2Type.sectionLabel,
                color: searchV2.inkSoft,
                mb: '4px',
              },
            }}
          >
            {renderManufacturerInput()}
          </Box>
          <Box
            sx={{
              '& .MuiFormLabel-root': {
                ...searchV2Type.sectionLabel,
                color: searchV2.inkSoft,
                mb: '4px',
              },
            }}
          >
            {renderModelInput()}
          </Box>
        </FilterGroup>

        {/* Amenities ──────────────────────────────────────────── */}
        <FilterGroup title={t('amenities')} count={params.amenities?.length || undefined}>
          {/* Hide the autocomplete's inner FormLabel — it duplicates the
              FilterGroup heading. (Manufacturer & Model keep their inner
              labels because that group hosts two distinct fields.) */}
          <Box sx={{ '& .MuiFormLabel-root': { display: 'none' } }}>{renderAmenityInput()}</Box>
        </FilterGroup>

        {/* Type of mainsail ───────────────────────────────────── */}
        <FilterGroup title={t('typeOfMainsail')} count={selectedMainsail.size || undefined}>
          <CheckV2
            label={t('classicMainsail')}
            count={distribution?.byMainsailType?.[MainSailType.CLASSIC_SAIL] ?? null}
            checked={selectedMainsail.has(MainSailType.CLASSIC_SAIL)}
            onToggle={() => handleMainsailToggle(MainSailType.CLASSIC_SAIL)}
          />
          <CheckV2
            label={t('rollingMainsail')}
            count={distribution?.byMainsailType?.[MainSailType.ROLLING_SAIL] ?? null}
            checked={selectedMainsail.has(MainSailType.ROLLING_SAIL)}
            onToggle={() => handleMainsailToggle(MainSailType.ROLLING_SAIL)}
          />
        </FilterGroup>

        {/* Engine power ──────────────────────────────────────── */}
        <FilterGroup title={t('enginePower')}>
          <Box sx={{ ...searchV2Type.numericValue, mb: '6px' }}>
            {t('engineRangeHp', { min: String(engine[0]), max: engine[1].toLocaleString('en-US') })}
            <Box component="span" sx={{ fontWeight: 400, color: searchV2.inkSoft, ml: '6px', fontSize: 11 }}>
              ({(engine[0] * 0.745).toFixed(1)}–{(engine[1] * 0.745).toFixed(0)} kW)
            </Box>
          </Box>
          <FilterRangeSliderV2
            min={5}
            max={7296}
            vMin={engine[0]}
            vMax={engine[1]}
            step={5}
            onChange={next => {
              setEngine(next);
              commitDebounced({
                minEnginePower: next[0] === 5 ? undefined : next[0],
                maxEnginePower: next[1] === 7296 ? undefined : next[1],
              });
            }}
            hist={distribution?.engineHistogram}
            format={v => `${v.toLocaleString('en-US')} hp`}
          />
        </FilterGroup>
      </Box>
    </Stack>
  );
};

export default FiltersSectionV2;
