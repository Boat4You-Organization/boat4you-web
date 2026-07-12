'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';

import {
  Box,
  Grid as MuiGrid,
  Stack,
  Tab,
  Tabs,
  ToggleButton,
  ToggleButtonGroup,
  Tooltip,
  Typography,
} from '@mui/material';
import { useTranslations } from 'next-intl';

import { PopularDestination } from '@/actions/locations.actions';
import BoatListingItemCard from '@/components/BoatListingItemCard';
import FloatingButton from '@/components/FloatingButton';
import ListEmptyState from '@/components/ListEmptyState';
import Pagination from '@/components/Pagination';
import PromoBanner from '@/components/PromoBanner';
import SeoTextSection from '@/components/SeoTextSection/SeoTextSection';
import Grid from '@/components/SvgIcons/Grid';
import List from '@/components/SvgIcons/List';
import { YACHT_PAGE_SIZE } from '@/config/constants.config';
import { boatsTabs } from '@/config/tabs.config';
import { InquiriesModel } from '@/models/inquiries.model';
import { UserModel } from '@/models/user.model';
import {
  VESSEL_TYPE_LABEL_MAP,
  VESSEL_TYPE_LABEL_MAP_FOR_RENTAL,
  VESSEL_TYPE_LABEL_MAP_PLURAL,
  VesselType,
  YachtModelShortInfo,
} from '@/models/yacht.model';
import colors from '@/styles/themes/colors';
import { PaginatedResponse } from '@/types/response.type';
import { SortByValue } from '@/types/sort.type';
import useBreakpoint from '@/utils/hooks/useBreakpoint';
import { useLocalStorage } from '@/utils/hooks/useLocalStorage';
import useQueryParams, { getTabValueFromParams } from '@/utils/hooks/useQueryParams';
import { formatListWithTranslation } from '@/utils/static/formatList';
import {
  resetData,
  setSearchResults,
  setSearchTotalCount,
  setSelectedYachtIds,
  toggleAdminInquiryModalOpen,
} from '@/valtio/yacht/yacht.actions';
import { useYachtStore } from '@/valtio/yacht/yacht.store';
import AdminInquiryModal from '@/views/Search/SearchView/AdminInquiryModal';
import { AiHintStrip, AppliedFilterChips, useRelaxSuggestion } from '@/views/Search/SearchView/FiltersSectionV2';

import styles from './BoatsSection.module.scss';

interface BoatsSectionProps {
  data: PaginatedResponse<YachtModelShortInfo>;
  user: UserModel | null;
  inquiry: InquiriesModel | null;
  /** Pre-fetched server-side internal-link block. Empty array hides the
   *  block — only country-level URLs return a non-empty list today. */
  popularDestinations?: PopularDestination[];
  /** Human-readable area label for the popular-destinations heading
   *  ("Most popular destinations in **{areaLabel}**"). */
  popularDestinationsArea?: string;
}

const BoatsSection = ({
  data,
  user,
  inquiry,
  popularDestinations = [],
  popularDestinationsArea = '',
}: BoatsSectionProps) => {
  const { content, page } = data;
  const { totalElements = 0 } = page || {};
  const { params, setParam, setMultipleParams } = useQueryParams();
  const [tabValue, setTabValue] = useState<number>(() => getTabValueFromParams(params.sortBy as SortByValue));
  const [viewType, setViewType] = useLocalStorage<'list' | 'grid'>('searchViewType', 'list');
  // Below the lg breakpoint (≤1199px) the tab row collapses to two
  // primary sorts — Mario's call: a wide row of five tabs scrolls
  // sideways on phones / tablets and looks cluttered.
  const { isBelowLg } = useBreakpoint();
  const visibleTabs = isBelowLg ? boatsTabs.slice(0, 2) : boatsTabs;
  const visibleTabValue = isBelowLg && tabValue >= visibleTabs.length ? 0 : tabValue;
  const { adminInquiryModalOpen, selectedYachtIds } = useYachtStore();
  const tFilters = useTranslations('filters');
  const tCommon = useTranslations('common');
  const tHome = useTranslations('home');
  const t = useTranslations();

  const isGridView = viewType === 'grid';
  const isEmpty = content?.length === 0;

  // V2: server-side relax suggestion for the AI hint strip. Returns
  // null until the backend endpoint exists or no filter is restrictive
  // enough to surface (delta < 20). Hint strip only renders when set.
  const relaxSuggestion = useRelaxSuggestion();
  const handleRelaxFilter = useCallback(() => {
    if (!relaxSuggestion) return;

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const updates: Record<string, any> = { page: 1 };

    relaxSuggestion.paramKeys.forEach(k => {
      updates[k] = undefined;
    });
    setMultipleParams(updates);
  }, [relaxSuggestion, setMultipleParams]);

  const destinationTranslations: Record<string, string> = useMemo(
    () => ({
      bahamas: tHome('destinationsSection.destinations.bahamas'),
      caribbean: tHome('destinationsSection.destinations.caribbean'),
      croatia: tHome('destinationsSection.destinations.croatia'),
      france: tHome('destinationsSection.destinations.france'),
      greece: tHome('destinationsSection.destinations.greece'),
      italy: tHome('destinationsSection.destinations.italy'),
      martinique: tHome('destinationsSection.destinations.martinique'),
      montenegro: tHome('destinationsSection.destinations.montenegro'),
      seychelles: tHome('destinationsSection.destinations.seychelles'),
      spain: tHome('destinationsSection.destinations.spain'),
      turkey: tHome('destinationsSection.destinations.türkiye'),
      türkiye: tHome('destinationsSection.destinations.türkiye'),
      'virgin islands (british)': tHome('destinationsSection.destinations.virginIslandsBritish'),
      grenada: tHome('destinationsSection.destinations.grenada'),
      // POPULAR_SEARCHES regions — keys mirror the lowercased displayLabel
      // shown in the location dropdown. Ionian/Split appear here because the
      // dropdown label and the URL `?destinations=` value differ from their
      // raw backend names (which are HR-only and not localised by the API).
      'split region': tHome('destinationsSection.destinations.splitRegion'),
      'ionian region': tHome('destinationsSection.destinations.ionianRegion'),
    }),
    [tHome]
  );

  // Locative ("u Hrvatskoj", "à Croatie") form used by the H1 sentence.
  // For locales that don't decline (EN/FR/IT/ES/PT/NL/DE) the value
  // mirrors the nominative label, so the H1 reads correctly. For HR/PL
  // the per-locale home.json exposes the actual locative — see
  // `home.destinationsSection.destinationsLocative`. Falls back through
  // (locative ➜ nominative ➜ raw) so a missing key never crashes the page.
  const destinationLocativeTranslations: Record<string, string> = useMemo(
    () => ({
      bahamas: tHome('destinationsSection.destinationsLocative.bahamas'),
      caribbean: tHome('destinationsSection.destinationsLocative.caribbean'),
      croatia: tHome('destinationsSection.destinationsLocative.croatia'),
      france: tHome('destinationsSection.destinationsLocative.france'),
      greece: tHome('destinationsSection.destinationsLocative.greece'),
      italy: tHome('destinationsSection.destinationsLocative.italy'),
      martinique: tHome('destinationsSection.destinationsLocative.martinique'),
      montenegro: tHome('destinationsSection.destinationsLocative.montenegro'),
      seychelles: tHome('destinationsSection.destinationsLocative.seychelles'),
      spain: tHome('destinationsSection.destinationsLocative.spain'),
      turkey: tHome('destinationsSection.destinationsLocative.türkiye'),
      türkiye: tHome('destinationsSection.destinationsLocative.türkiye'),
      'virgin islands (british)': tHome('destinationsSection.destinationsLocative.virginIslandsBritish'),
      grenada: tHome('destinationsSection.destinationsLocative.grenada'),
      'split region': tHome('destinationsSection.destinationsLocative.splitRegion'),
      'ionian region': tHome('destinationsSection.destinationsLocative.ionianRegion'),
    }),
    [tHome]
  );

  const translateDestination = useCallback(
    (destination: string) => {
      const key = destination.toLowerCase();

      return destinationTranslations[key] || destination;
    },
    [destinationTranslations]
  );

  const translateDestinationLocative = useCallback(
    (destination: string) => {
      const key = destination.toLowerCase();

      return destinationLocativeTranslations[key] || destinationTranslations[key] || destination;
    },
    [destinationLocativeTranslations, destinationTranslations]
  );

  const translatedDestinations = useMemo(() => {
    // Dedupe identical labels — popular dual-source regions (e.g. "Ionian
    // Region") expand to two backend ids that share the same display label,
    // and we don't want the H1 to read "X and X". Case-insensitive Set.
    const seen = new Set<string>();
    const out: string[] = [];

    (params.destinations || []).forEach(raw => {
      const label = translateDestination(raw);
      const key = label.toLowerCase();

      if (seen.has(key)) return;

      seen.add(key);
      out.push(label);
    });

    return out;
  }, [params.destinations, translateDestination]);

  // Same dedupe pattern but with locative forms — used only by the H1
  // sentence so it composes grammatically ("u Hrvatskoj", not "u Hrvatska").
  const translatedDestinationsLocative = useMemo(() => {
    const seen = new Set<string>();
    const out: string[] = [];

    (params.destinations || []).forEach(raw => {
      const label = translateDestinationLocative(raw);
      const key = label.toLowerCase();

      if (seen.has(key)) return;

      seen.add(key);
      out.push(label);
    });

    return out;
  }, [params.destinations, translateDestinationLocative]);

  const translatedBoatType = useMemo(() => {
    if (params.boatTypes?.length === 1) {
      const boatType = params.boatTypes[0] as VesselType;
      const translationKey = VESSEL_TYPE_LABEL_MAP_PLURAL[boatType];

      if (translationKey) {
        return t(translationKey);
      }
    }

    return null;
  }, [params.boatTypes, t]);

  // Singular variant for SEO H1 like "Catamaran charter in Sukošan" — the
  // `_PLURAL` map is reused for the legacy "boat-type-only" path which still
  // reads as a plural noun ("Catamarans"). When at least one destination is
  // also selected we want the singular form to slot into the H1 sentence.
  const translatedBoatTypeSingular = useMemo(() => {
    if (params.boatTypes?.length === 1) {
      const boatType = params.boatTypes[0] as VesselType;
      const translationKey = VESSEL_TYPE_LABEL_MAP[boatType];

      if (translationKey) {
        return t(translationKey);
      }
    }

    return null;
  }, [params.boatTypes, t]);

  // Rental-context (genitive in HR/PL, nominative elsewhere) variant fed
  // into the H1 template `searchH1WithBoatType`. Locales like HR turn this
  // sentence into "Najam katamarana u Hrvatskoj" — the boat type slot is
  // genitive ("katamarana"), not the chip-style nominative ("Katamaran").
  // Non-inflecting locales mirror the nominative value so EN/FR/IT/etc.
  // read identically to before.
  const translatedBoatTypeForRental = useMemo(() => {
    if (params.boatTypes?.length === 1) {
      const boatType = params.boatTypes[0] as VesselType;
      const translationKey = VESSEL_TYPE_LABEL_MAP_FOR_RENTAL[boatType];

      if (translationKey) {
        return t(translationKey);
      }
    }

    return null;
  }, [params.boatTypes, t]);

  const isBoatTypeOnly = useMemo(() => !params.destinations || params.destinations.length === 0, [params.destinations]);

  const applySort = useCallback(
    (newValue: number) => {
      const selectedTab = boatsTabs[newValue];

      // Price sort needs concrete date range to compute per-day values server-side.
      if ((selectedTab === 'highestPrice' || selectedTab === 'lowestPrice') && (!params.startDate || !params.endDate)) {
        return;
      }

      setTabValue(newValue);

      switch (selectedTab) {
        case 'recommended':
          setParam('sortBy', '');
          break;
        case 'highestPrice':
          setParam('sortBy', 'desc');
          break;
        case 'lowestPrice':
          setParam('sortBy', 'asc');
          break;
        case 'minLength':
          setParam('sortBy', 'lengthAsc');
          break;
        case 'maxLength':
          setParam('sortBy', 'lengthDesc');
          break;
        default:
          break;
      }
    },
    [params.startDate, params.endDate, setParam]
  );

  const handleTabChange = useCallback(
    (_event: React.SyntheticEvent, newValue: number) => applySort(newValue),
    [applySort]
  );

  const handleViewType = useCallback(
    (event: React.MouseEvent<HTMLElement>, newViewType: string | null) => {
      if (newViewType === 'list' || newViewType === 'grid') {
        setViewType(newViewType);
      }
    },
    [setViewType]
  );

  const handlePageChange = useCallback(
    (newPage: number) => {
      window.scrollTo({ top: 0 });
      setParam('page', newPage);
    },
    [setParam]
  );

  useEffect(() => {
    const newTabValue = getTabValueFromParams(params.sortBy as SortByValue);

    if (newTabValue !== tabValue) {
      setTabValue(newTabValue);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [params.sortBy]);

  useEffect(() => {
    // Price-based tabs (Lowest price = 1, Highest price = 2) require a concrete
    // date range. If the user clears dates, bounce them back to Recommended.
    // Length tabs (3, 4) don't depend on dates so they stay as-is.
    if ((!params.startDate || !params.endDate) && (tabValue === 1 || tabValue === 2)) {
      setTabValue(0);
      setParam('sortBy', '');
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [params.startDate, params.endDate]);

  useEffect(() => {
    setSearchResults(content);
    setSearchTotalCount(totalElements);
  }, [content, totalElements]);

  useEffect(() => {
    if (inquiry) {
      setSelectedYachtIds([inquiry.yachtId]);
    }
  }, [inquiry]);

  useEffect(() => {
    resetData();
  }, []);

  return (
    <>
      <AdminInquiryModal
        isOpen={adminInquiryModalOpen}
        onOpen={toggleAdminInquiryModalOpen}
        onClose={toggleAdminInquiryModalOpen}
        selectedYachtIds={selectedYachtIds}
      />
      <Box className={styles.container}>
        {relaxSuggestion && (
          <Box sx={{ px: 3, pt: 2 }}>
            <AiHintStrip
              filterLabel={relaxSuggestion.label}
              delta={relaxSuggestion.delta}
              onRelax={handleRelaxFilter}
            />
          </Box>
        )}
        <Stack className={styles.content}>
          <Stack width="100%" direction="row" justifyContent="space-between" alignItems="flex-start">
            <Stack>
              <Typography variant="h2" component="h1" fontWeight={700}>
                {(() => {
                  // SEO H1 strategy:
                  //   - destinations + boat type → "{BoatType} charter in {Destinations}"
                  //   - destinations only       → "Yacht charter and Boat rental in {Destinations}"
                  //   - boat type only          → plural label ("Catamarans") — legacy
                  //   - neither                 → "All Destinations" fallback
                  if (isBoatTypeOnly) {
                    return (
                      translatedBoatType ?? formatListWithTranslation([], () => tCommon('and'), 'All Destinations')
                    );
                  }

                  // H1 uses the *locative* destination list ("u Hrvatskoj") so
                  // the inflected sentence reads correctly in HR/PL. Chips and
                  // sidebar (nominative) keep using `translatedDestinations`.
                  const destLocative = formatListWithTranslation(
                    translatedDestinationsLocative,
                    () => tCommon('and'),
                    'All Destinations'
                  );

                  if (translatedBoatTypeForRental) {
                    return tCommon('searchH1WithBoatType', {
                      boatType: translatedBoatTypeForRental,
                      destination: destLocative,
                    });
                  }

                  return tCommon('searchH1NoBoatType', { destination: destLocative });
                })()}
              </Typography>
            </Stack>
            <ToggleButtonGroup
              value={viewType}
              exclusive
              onChange={handleViewType}
              aria-label="view type"
              sx={{ display: { xs: 'none', lg: 'flex' } }}
            >
              <ToggleButton value="list" aria-label="list">
                <List size={24} />
              </ToggleButton>
              <ToggleButton value="grid" aria-label="grid">
                <Grid size={24} />
              </ToggleButton>
            </ToggleButtonGroup>
          </Stack>
          <Box sx={{ width: '100%', mt: 3 }}>
            <Box sx={{ borderBottom: 1, borderColor: colors.black200 }}>
              <Tabs
                value={visibleTabValue}
                onChange={handleTabChange}
                variant="scrollable"
                aria-label="all destinations tabs"
              >
                {visibleTabs.map(item => {
                  const isDisabled =
                    (item === 'highestPrice' || item === 'lowestPrice') && (!params.startDate || !params.endDate);

                  const tabComponent = (
                    <Tab
                      key={item}
                      label={tFilters(item)}
                      className={styles.tab}
                      sx={{
                        color: colors.black400,
                        width: 'auto',
                        cursor: isDisabled ? 'not-allowed' : 'pointer',
                      }}
                    />
                  );

                  if (isDisabled) {
                    return (
                      <Tooltip
                        key={item}
                        title={tCommon('sortByPriceTabMessage')}
                        placement="top"
                        slotProps={{
                          transition: { timeout: 0 },
                        }}
                      >
                        {tabComponent}
                      </Tooltip>
                    );
                  }

                  return tabComponent;
                })}
              </Tabs>
            </Box>
          </Box>
          {/* Active filter chips — render under the Recommended/Lowest price
              tab row so user sees what's applied and can clear individual
              filters with a single click. Hidden when no filter is active. */}
          <AppliedFilterChips params={params} setMultipleParams={setMultipleParams} t={t as (key: string) => string} />
          {/* Campaign promo strip (replaced RiskFreeCTA, Mario 12.7.2026) —
              links to the active /deals landing; free-cancellation messaging
              lives on the cards' badge + the 72h seal. */}
          <PromoBanner compact />
          {/* Count headline as a real <h2> — anchors the heading hierarchy
              between the page H1 and the per-yacht H3 cards. Without it
              Screaming Frog (and Google) flag a "skipped heading level"
              warning (H1 → H3). Mirror Boataround's "932 boats available"
              pattern. Only renders when there's a non-empty result so an
              "0 boats available" line never sits above ListEmptyState.
              Visually muted (small font, secondary colour) — keeps the
              UX subtle while giving crawlers the structural anchor. */}
          {!isEmpty && totalElements > 0 && (
            <Typography component="h2" variant="body2" fontWeight={700} color={colors.black700} sx={{ mt: 1, mb: 1 }}>
              {translatedBoatType
                ? tCommon('boatsAvailableHeading', { count: totalElements, type: translatedBoatType })
                : tCommon('boatsAvailableHeadingGeneric', { count: totalElements })}
            </Typography>
          )}
          {isEmpty ? (
            <ListEmptyState title={tCommon('noExactMatches')} description={tCommon('noExactMatchesDescription')} />
          ) : (
            <MuiGrid container columnSpacing={2} rowSpacing={3}>
              {content?.map((yacht, index) => (
                <MuiGrid key={`${yacht.id}-${index + 1}`} size={{ xs: 12, md: isGridView ? 4 : 12 }}>
                  <BoatListingItemCard
                    isGridView={isGridView}
                    {...yacht}
                    user={user}
                    isSelected={selectedYachtIds.includes(yacht.id)}
                  />
                </MuiGrid>
              ))}
            </MuiGrid>
          )}
        </Stack>
        {!isEmpty && (
          <Pagination
            page={params.page}
            onChange={handlePageChange}
            count={data.page?.totalPages ?? Math.ceil(totalElements / YACHT_PAGE_SIZE)}
          />
        )}
        {/* SEO block — long-form content below the listings for organic
            traffic. Pop-destinations link cluster is rendered INSIDE
            this section's collapse so a single Show more toggle reveals
            both at once (no two competing toggles on the same page). */}
        <SeoTextSection
          destination={Array.isArray(params.destinations) ? params.destinations[0] : params.destinations}
          boatType={params.boatTypes?.length === 1 ? (params.boatTypes[0] as VesselType) : null}
          popularDestinations={popularDestinations}
          popularDestinationsArea={popularDestinationsArea}
        />
        {selectedYachtIds.length > 0 && (
          <FloatingButton selectedItems={selectedYachtIds.length} onClick={toggleAdminInquiryModalOpen} />
        )}
      </Box>
    </>
  );
};

export default BoatsSection;
