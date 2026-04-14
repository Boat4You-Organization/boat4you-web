'use client';

import { useState } from 'react';

import { Box, Grid as MuiGrid, Skeleton, Stack, Tab, Tabs, ToggleButton, ToggleButtonGroup } from '@mui/material';
import { useTranslations } from 'next-intl';

import RiskFreeCTA from '@/components/RiskFreeCTA';
import Grid from '@/components/SvgIcons/Grid';
import List from '@/components/SvgIcons/List';
import { boatsTabs } from '@/config/tabs.config';
import colors from '@/styles/themes/colors';
import { SortByValue } from '@/types/sort.type';
import useBreakpoint from '@/utils/hooks/useBreakpoint';
import { useLocalStorage } from '@/utils/hooks/useLocalStorage';
import useQueryParams, { getTabValueFromParams } from '@/utils/hooks/useQueryParams';

import BoatListingCardItem from './BoatListingItemCard';
import styles from './BoatsSection.module.scss';

const BoatsSection = () => {
  const tFilters = useTranslations('filters');
  const { params } = useQueryParams();
  const { isMobile } = useBreakpoint();
  const [tabValue] = useState<number>(() => getTabValueFromParams(params.sortBy as SortByValue));
  const [viewType] = useLocalStorage<'list' | 'grid'>('searchViewType', 'list');

  const isGridView = viewType === 'grid';

  const getRowSpacing = () => {
    if (viewType === 'grid') return 3;

    if (isMobile) return 3;

    return 1.5;
  };

  return (
    <Box className={styles.container}>
      <Stack className={styles.content}>
        <Stack width="100%" direction="row" justifyContent="space-between" alignItems="flex-start">
          <Stack>
            <Skeleton variant="text" width={240} height={34} />
            <Skeleton variant="text" width={100} height={20} />
          </Stack>
          <ToggleButtonGroup
            value={viewType}
            exclusive
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
            <Tabs value={tabValue} variant="scrollable" aria-label="all destinations tabs">
              {boatsTabs.map(item => (
                <Tab key={item} label={tFilters(item)} sx={{ color: colors.black400, width: 'auto' }} />
              ))}
            </Tabs>
          </Box>
        </Box>
        <RiskFreeCTA searchPage disableGutters />
        <MuiGrid container columnSpacing={2} rowSpacing={getRowSpacing()}>
          {Array.from({ length: 9 }, (_, index) => (
            <MuiGrid key={`${index + 1}`} size={{ xs: 12, md: isGridView ? 4 : 12 }}>
              <BoatListingCardItem isGridView={isGridView} />
            </MuiGrid>
          ))}
        </MuiGrid>
      </Stack>
    </Box>
  );
};

export default BoatsSection;
