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

import BoatListingItemCard from '@/components/BoatListingItemCard';
import FloatingButton from '@/components/FloatingButton';
import ListEmptyState from '@/components/ListEmptyState';
import Pagination from '@/components/Pagination';
import SeoTextSection from '@/components/SeoTextSection/SeoTextSection';
import RiskFreeCTA from '@/components/RiskFreeCTA';
import Grid from '@/components/SvgIcons/Grid';
import List from '@/components/SvgIcons/List';
import { YACHT_PAGE_SIZE } from '@/config/constants.config';
import { boatsTabs } from '@/config/tabs.config';
import { InquiriesModel } from '@/models/inquiries.model';
import { UserModel } from '@/models/user.model';
import { VESSEL_TYPE_LABEL_MAP_PLURAL, VesselType, YachtModelShortInfo } from '@/models/yacht.model';
import colors from '@/styles/themes/colors';
import { PaginatedResponse } from '@/types/response.type';
import { SortByValue } from '@/types/sort.type';
import { useLocalStorage } from '@/utils/hooks/useLocalStorage';
import useQueryParams, { getTabValueFromParams } from '@/utils/hooks/useQueryParams';
import { formatListWithTranslation } from '@/utils/static/formatList';
import {
  resetData,
  setSearchResults,
  setSelectedYachtIds,
  toggleAdminInquiryModalOpen,
} from '@/valtio/yacht/yacht.actions';
import { useYachtStore } from '@/valtio/yacht/yacht.store';
import AdminInquiryModal from '@/views/Search/SearchView/AdminInquiryModal';

import styles from './BoatsSection.module.scss';

interface BoatsSectionProps {
  data: PaginatedResponse<YachtModelShortInfo>;
  user: UserModel | null;
  inquiry: InquiriesModel | null;
}

const BoatsSection = ({ data, user, inquiry }: BoatsSectionProps) => {
  const { content, page } = data;
  const { totalElements = 0 } = page || {};
  const { params, setParam } = useQueryParams();
  const [tabValue, setTabValue] = useState<number>(() => getTabValueFromParams(params.sortBy as SortByValue));
  const [viewType, setViewType] = useLocalStorage<'list' | 'grid'>('searchViewType', 'list');
  const { adminInquiryModalOpen, selectedYachtIds } = useYachtStore();
  const tFilters = useTranslations('filters');
  const tCommon = useTranslations('common');
  const tHome = useTranslations('home');
  const t = useTranslations();

  const isGridView = viewType === 'grid';
  const isEmpty = content?.length === 0;

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

  const translatedDestinations = useMemo(
    () => params.destinations?.map(translateDestination) || [],
    [params.destinations, translateDestination]
  );

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

  const isBoatTypeOnly = useMemo(() => !params.destinations || params.destinations.length === 0, [params.destinations]);

  const handleTabChange = useCallback(
    (event: React.SyntheticEvent, newValue: number) => {
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
  }, [content]);

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
        <Stack className={styles.content}>
          <Stack width="100%" direction="row" justifyContent="space-between" alignItems="flex-start">
            <Stack>
              <Typography variant="h2" component="h1" fontWeight={700}>
                {isBoatTypeOnly && translatedBoatType ? (
                  translatedBoatType
                ) : (
                  <>
                    {tCommon('boatsIn')}{' '}
                    <Typography variant="h2" component="span" fontWeight={700}>
                      {formatListWithTranslation(translatedDestinations, () => tCommon('and'), 'All Destinations')}
                    </Typography>
                  </>
                )}
              </Typography>
              <Typography variant="body2" color={colors.black600}>
                {`${tCommon('boatsAvailable')}: ${totalElements}`}
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
              <Tabs value={tabValue} onChange={handleTabChange} variant="scrollable" aria-label="all destinations tabs">
                {boatsTabs.map(item => {
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
          <RiskFreeCTA searchPage disableGutters />
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
        {/* SEO block — long-form content below the listings for organic traffic. */}
        <SeoTextSection destination={Array.isArray(params.destinations) ? params.destinations[0] : params.destinations} />
        {selectedYachtIds.length > 0 && (
          <FloatingButton selectedItems={selectedYachtIds.length} onClick={toggleAdminInquiryModalOpen} />
        )}
      </Box>
    </>
  );
};

export default BoatsSection;
