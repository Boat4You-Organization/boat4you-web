'use client';

import { useCallback, useState } from 'react';

import { AppBar, Box, Container, Icon, IconButton, Stack, Typography } from '@mui/material';
import dayjs from 'dayjs';
import { usePathname, useRouter } from 'next/navigation';

import FiltersModal from '@/components/HeaderSearchMobile/FiltersModal';
import ChevronLeft from '@/components/SvgIcons/ChevronLeft';
import Filters from '@/components/SvgIcons/Filters';
import { CatalogueData, CatalogueFilters } from '@/models/catalogue.model';
import colors from '@/styles/themes/colors';
import useQueryParams from '@/utils/hooks/useQueryParams';
import DateTime from '@/utils/static/DateTime';

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
          <IconButton size="large" onClick={handleGoBack} aria-label="Go back">
            <Icon>
              <ChevronLeft size={24} />
            </Icon>
          </IconButton>
          <Box className={styles.searchBar} onClick={handleOpenGeneralSearchModal}>
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
                {params.destinations ? params.destinations.map(dest => dest).join(', ') : '-'}
              </Typography>

              <Stack direction="row" alignItems="center" spacing={1} width="fit-content" sx={{ minWidth: 0 }}>
                <Typography
                  variant="body2"
                  color={colors.black400}
                  sx={{
                    whiteSpace: 'nowrap',
                    flexShrink: 0,
                    width: 'fit-content',
                  }}
                >
                  {params.startDate && params.endDate ? (
                    <>
                      {DateTime.formatShortWithoutYear(dayjs(params.startDate))} -{' '}
                      {DateTime.formatShortWithoutYear(dayjs(params.endDate))}
                    </>
                  ) : (
                    '-'
                  )}
                </Typography>

                {params.boatTypes && params.boatTypes.length > 0 ? (
                  <>
                    <Typography variant="body2" color={colors.black400} sx={{ flexShrink: 0 }}>
                      •
                    </Typography>
                    <Typography
                      variant="body2"
                      color={colors.black400}
                      sx={{
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        whiteSpace: 'nowrap',
                        width: { xs: '75px', sm: 'fit-content' },
                        minWidth: 0,
                      }}
                    >
                      {params.boatTypes.map(dest => dest).join(', ')}
                    </Typography>
                  </>
                ) : (
                  '-'
                )}
              </Stack>
            </Stack>
          </Box>
          {showFilterButton ? (
            <IconButton size="large" onClick={handleOpenFiltersModal} aria-label="Open filters">
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
