'use client';

import { useCallback, useState } from 'react';

import { AppBar, Box, Container, Icon, IconButton, Stack, Typography } from '@mui/material';
import dayjs from 'dayjs';
import { useLocale, useTranslations } from 'next-intl';
import { usePathname, useRouter } from 'next/navigation';

import FiltersModal from '@/components/HeaderSearchMobile/FiltersModal';
import ChevronLeft from '@/components/SvgIcons/ChevronLeft';
import Filters from '@/components/SvgIcons/Filters';
import { getTranslationKeyByDestinationName } from '@/config/destinations.config';
import { CatalogueData, CatalogueFilters } from '@/models/catalogue.model';
import { VESSEL_TYPE_LABEL_MAP_PLURAL, isVesselType } from '@/models/yacht.model';
import colors from '@/styles/themes/colors';
import useQueryParams from '@/utils/hooks/useQueryParams';
import { useResolvedDestination } from '@/views/Search/SearchView/ResolvedDestinationContext';

import GeneralSearchBarModal from './GeneralSearchBarModal';
import styles from './HeaderSearchMobile.module.scss';

interface HeaderSearchMobileProps {
  catalogueData: CatalogueData;
  catalogueFilters?: CatalogueFilters | null;
}

const HeaderSearchMobile = ({ catalogueData, catalogueFilters }: HeaderSearchMobileProps) => {
  const { params } = useQueryParams();
  const [filtersModalOpen, setFiltersModalOpen] = useState<boolean>(false);
  const [generalSearchModalOpen, setGeneralSearchModalOpen] = useState<boolean>(false);
  const router = useRouter();
  const pathname = usePathname();

  const isBoatDetailPage = /^\/[a-z]{2}\/boat\/.+$|^\/boat\/.+$/.test(pathname);
  const t = useTranslations();
  const locale = useLocale();
  const { labels } = useResolvedDestination();

  // The pill read "croatia | - | • | CATAMARAN" on phones (raw URL values,
  // placeholder dashes, enum names — audit B47): show display names, and
  // leave out a part that is not set instead of printing "-".
  const destinationText = (params.destinations ?? [])
    .map(raw => {
      const name = labels[raw.toLowerCase()] ?? raw;
      const key = getTranslationKeyByDestinationName(name);

      return key ? t(`home.${key}` as never) : name;
    })
    .join(', ');
  const shortDate = (iso: string) =>
    new Intl.DateTimeFormat(locale, { day: 'numeric', month: 'short' }).format(dayjs(iso).toDate());
  const dateText =
    params.startDate && params.endDate ? `${shortDate(params.startDate)} – ${shortDate(params.endDate)}` : null;
  const typeText = (params.boatTypes ?? [])
    .map(type => (isVesselType(type) ? t(VESSEL_TYPE_LABEL_MAP_PLURAL[type]) : type))
    .join(', ');
  const detailText = [dateText, typeText].filter(Boolean).join(' • ');

  const showFilterButton = !isBoatDetailPage;

  const handleOpenFiltersModal = () => {
    setFiltersModalOpen(true);
  };

  const handleCloseFiltersModal = () => {
    setFiltersModalOpen(false);
  };

  const handleOpenGeneralSearchModal = () => {
    setGeneralSearchModalOpen(true);
  };

  const handleCloseGeneralSearchModal = () => {
    setGeneralSearchModalOpen(false);
  };

  const handleGoBack = useCallback(() => {
    const hasNextJsState = window.history.state && window.history.state.__N;

    if (hasNextJsState) {
      router.back();
    } else {
      router.push('/');
    }
  }, [router]);

  return (
    <>
      <FiltersModal
        isOpen={filtersModalOpen}
        onOpen={handleOpenFiltersModal}
        onClose={handleCloseFiltersModal}
        catalogueData={catalogueData}
        catalogueFilters={catalogueFilters}
      />
      <GeneralSearchBarModal isOpen={generalSearchModalOpen} onClose={handleCloseGeneralSearchModal} />
      <AppBar elevation={0} classes={{ root: styles.root }} className={styles.container}>
        <Container disableGutters maxWidth="xl" className={styles.header}>
          <IconButton size="large" onClick={handleGoBack} aria-label={t('common.goBack')}>
            <Icon>
              <ChevronLeft size={24} />
            </Icon>
          </IconButton>
          <Box
            className={styles.searchBar}
            onClick={handleOpenGeneralSearchModal}
            role="button"
            aria-label={t('common.editSearch')}
          >
            <Stack direction="column" justifyContent="center" alignItems="center" padding="6px 26px">
              <Typography
                variant="body1"
                color={colors.black950}
                sx={{
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  whiteSpace: 'nowrap',
                  width: 'fit-content',
                  maxWidth: '200px',
                }}
              >
                {destinationText || t('filters.allDestinations')}
              </Typography>

              {detailText && (
                <Typography
                  variant="body2"
                  color={colors.black400}
                  sx={{
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    whiteSpace: 'nowrap',
                    maxWidth: '200px',
                  }}
                >
                  {detailText}
                </Typography>
              )}
            </Stack>
          </Box>
          {showFilterButton ? (
            <IconButton size="large" onClick={handleOpenFiltersModal} aria-label={t('common.openFilters')}>
              <Icon>
                <Filters size={24} />
              </Icon>
            </IconButton>
          ) : (
            <Box
              sx={{
                width: 58,
                height: 42,
                backgroundColor: 'transparent',
              }}
            />
          )}
        </Container>
      </AppBar>
    </>
  );
};

export default HeaderSearchMobile;
