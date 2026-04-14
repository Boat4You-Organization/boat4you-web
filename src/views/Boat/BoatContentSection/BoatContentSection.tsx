'use client';

import React, { useContext, useEffect, useMemo, useRef } from 'react';

import { Box, Container, Divider, Grid, Stack, Tab, Tabs } from '@mui/material';
import { useTranslations } from 'next-intl';

import BoatCalendar from '@/components/BoatCalendar';
import CircularProgress from '@/components/CircularProgress';
import { OFFSET } from '@/config/constants.config';
import { singleBoatTabs, singleCustomBoatTabs } from '@/config/tabs.config';
import { YachtModel } from '@/models/yacht.model';
import colors from '@/styles/themes/colors';
import useScrollSpy from '@/utils/hooks/useScrollSpy';
import { useYachtPriceCalculation } from '@/utils/hooks/useYachtPriceCalculation';
import { clearDataFromLocalStorage } from '@/utils/static/localStorageUtils';
import { clearDataFromSessionStorage } from '@/utils/static/sessionStorageUtils';
import {
  setCalculatedPrice,
  setOffersToDisplay,
  setselectedOffer,
  toggleBoatInquiryModalOpen,
} from '@/valtio/yacht/yacht.actions';
import { useYachtStore } from '@/valtio/yacht/yacht.store';
import { BoatTransitionContext } from '@/views/Boat/BoatTransitionProvider';

import AmenitiesTab from './AmenitiesTab';
import AvailabilityTab from './AvailabilityTab';
import styles from './BoatContentSection.module.scss';
import BoatInquiryModal from './BoatInquiryModal';
import DetailsTab from './DetailsTab';
import ExtrasTab from './ExtrasTab';
import FAQTab from './FAQTab';
import GoodToKnowTab from './GoodToKnowTab';

interface BoatContentSectionProps {
  yacht: YachtModel;
}

const BoatContentSection = ({ yacht }: BoatContentSectionProps) => {
  const { selectedOffer, boatInquiryModalOpen } = useYachtStore();
  const { calculatePrice } = useYachtPriceCalculation();
  const boatTransition = useContext(BoatTransitionContext);
  const isPending = boatTransition?.isPending ?? false;
  const sectionRefs = useRef<(HTMLElement | null)[]>([]);
  const t = useTranslations('common');

  useEffect(() => {
    clearDataFromLocalStorage('yachtReservation');
    clearDataFromSessionStorage('reservationId');
    clearDataFromSessionStorage('activeStep');
    clearDataFromSessionStorage('selectedPaymentMethod');
    clearDataFromSessionStorage('selectedInstallment');
  }, []);

  const currentTabs = yacht.custom ? singleCustomBoatTabs : singleBoatTabs;
  const sectionIds = useMemo(() => singleBoatTabs.map((_, index) => `section-${index}`), []);

  const activeSectionId = useScrollSpy(sectionIds, 0.2);
  const activeIndex = sectionIds.indexOf(activeSectionId);

  useEffect(() => {
    if (yacht && Array.isArray(yacht.offers)) {
      setOffersToDisplay(yacht.offers);

      if (yacht.offers.length > 0) {
        setselectedOffer(yacht.offers[0]);
      } else {
        setselectedOffer(null);
      }
    }
  }, [yacht]);

  useEffect(() => {
    if (selectedOffer) {
      const obligatoryExtrasKeys = selectedOffer.obligatoryExtrasKeys || [];

      calculatePrice(yacht.slug, obligatoryExtrasKeys);
    } else {
      setCalculatedPrice(null);
    }
  }, [selectedOffer, yacht.slug, calculatePrice]);

  const scrollToSection = (index: number) => {
    const section = sectionRefs.current[index];

    if (section) {
      const yOffset = -OFFSET - 48;
      const y = section.getBoundingClientRect().top + window.scrollY + yOffset;

      window.scrollTo({ top: y, behavior: 'smooth' });
    }
  };

  const setSectionRef = (index: number) => (el: HTMLElement | null) => {
    sectionRefs.current[index] = el;
  };

  const handleTabChange = (_: React.SyntheticEvent, newValue: number) => {
    scrollToSection(newValue);
  };

  const renderTabContent = (tabName: string) => {
    switch (tabName) {
      case 'details':
        return <DetailsTab yacht={yacht} />;
      case 'ammenities':
        return <AmenitiesTab yacht={yacht} />;
      case 'availability':
        return <AvailabilityTab yacht={yacht} />;
      case 'extras':
        return <ExtrasTab yacht={yacht} />;
      case 'goodToKnow':
        return <GoodToKnowTab yacht={yacht} />;
      case 'faq':
        return <FAQTab yacht={yacht} />;
      default:
        return null;
    }
  };

  return (
    <>
      <BoatInquiryModal
        isOpen={boatInquiryModalOpen}
        onOpen={toggleBoatInquiryModalOpen}
        onClose={toggleBoatInquiryModalOpen}
        yacht={yacht}
      />
      <Container
        component="section"
        maxWidth="xl"
        disableGutters
        classes={{ root: styles.root }}
        className={styles.container}
      >
        <Grid container pt={{ xs: 3, md: 4 }} spacing={2.5} sx={{ position: 'relative' }}>
          {isPending && (
            <Box
              sx={{
                position: 'fixed',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                zIndex: 10,
                pointerEvents: 'none',
              }}
            >
              <CircularProgress size={48} />
            </Box>
          )}
          <Grid
            size={{ xs: 12, md: 7, lg: 8.5 }}
            sx={{
              opacity: isPending ? 0.5 : 1,
              pointerEvents: isPending ? 'none' : 'auto',
              transition: 'opacity 0.2s ease',
            }}
          >
            <Box className={styles.tabsWrapper}>
              <Tabs
                value={activeIndex === -1 ? 0 : activeIndex}
                onChange={handleTabChange}
                variant="scrollable"
                aria-label={t('allSingleBoatTabs')}
              >
                {currentTabs.map(tabName => (
                  <Tab key={tabName} label={t(tabName)} sx={{ color: colors.black400, width: 'auto' }} />
                ))}
              </Tabs>
            </Box>
            <Box pt={6} pb={8} className={styles.contentWrapper}>
              {currentTabs.map((tabName, index) => (
                <React.Fragment key={tabName}>
                  <Stack
                    id={`section-${index}`}
                    ref={setSectionRef(index)}
                    data-index={index}
                    className={styles.section}
                    sx={{ scrollMarginTop: OFFSET }}
                  >
                    {renderTabContent(tabName)}
                  </Stack>
                  {index < currentTabs.length - 2 && <Divider className={styles.divier} />}
                </React.Fragment>
              ))}
            </Box>
          </Grid>
          <Grid
            container
            direction="column"
            display={{ xs: 'none', md: 'flex' }}
            size={{ xs: 12, md: 5, lg: 3.5 }}
            flex={1}
            alignItems="end"
            sx={{
              opacity: isPending ? 0.5 : 1,
              pointerEvents: isPending ? 'none' : 'auto',
              transition: 'opacity 0.2s ease',
            }}
          >
            <Box pb={8} className={styles.calendarWrapper}>
              <BoatCalendar variant={yacht.custom ? 'crewed' : 'inner'} yacht={yacht} />
            </Box>
          </Grid>
        </Grid>
      </Container>
    </>
  );
};

export default BoatContentSection;
