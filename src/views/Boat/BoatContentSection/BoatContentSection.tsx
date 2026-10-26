'use client';

import React, { useContext, useEffect, useMemo, useRef, useState } from 'react';

import { Box, Container, Divider, Grid, Stack, Tab, Tabs } from '@mui/material';
import { useTranslations } from 'next-intl';

import BoatCalendar from '@/components/BoatCalendar';
import CircularProgress from '@/components/CircularProgress';
import { OFFSET } from '@/config/constants.config';
import { singleBoatTabsFor } from '@/config/tabs.config';
import { PriceCalcDto, YachtOfferModel } from '@/models/yacht-offer.model';
import { YachtImage, YachtModel } from '@/models/yacht.model';
import colors from '@/styles/themes/colors';
import useScrollSpy from '@/utils/hooks/useScrollSpy';
import { cancelPendingPriceCalculation, useYachtPriceCalculation } from '@/utils/hooks/useYachtPriceCalculation';
import { isInquiryOnlyBoat } from '@/utils/static/inquiryOnlyBoat';
import { clearDataFromLocalStorage } from '@/utils/static/localStorageUtils';
import { clearDataFromSessionStorage } from '@/utils/static/sessionStorageUtils';
import type { Capacity } from '@/utils/static/yachtCapacity';
import { YachtFaqEntry } from '@/utils/static/yachtFaq';
import { yachtPhotoName } from '@/utils/static/yachtPhotoName';
import {
  setCalculatedPrice,
  setCalculatingPrice,
  setOffersToDisplay,
  setPriceSettled,
  setselectedOffer,
  toggleBoatInquiryModalOpen,
} from '@/valtio/yacht/yacht.actions';
import { useYachtStore } from '@/valtio/yacht/yacht.store';
import { BoatTransitionContext } from '@/views/Boat/BoatTransitionProvider';

import AmenitiesTab from './AmenitiesTab';
import AvailabilityTab from './AvailabilityTab';
import type { InitialCalendar } from './AvailabilityTab/LiveCalendar/AvailabilitySlider';
import styles from './BoatContentSection.module.scss';
import BoatInquiryModal from './BoatInquiryModal';
import DetailsTab from './DetailsTab';
import ExtrasTab from './ExtrasTab';
import FAQTab from './FAQTab';
import GoodToKnowTab from './GoodToKnowTab';
import LayoutSection from './LayoutSection';
import PriceDetailsTab from './PriceDetailsTab';
import VideoTab from './VideoTab';

interface BoatContentSectionProps {
  yachtFaq?: YachtFaqEntry[];
  yacht: YachtModel;
  /** Capacity resolved on the server for the page locale (yachtCapacity.ts). */
  capacity?: Capacity;
  /** The boat's layout drawings, not in `yacht.yachtImages` (yachtLayout.ts): a block of their own above Amenities. */
  layoutImages?: YachtImage[];
  /** The week a dated link names and its price, from the server (initialWeekOffer.ts); null otherwise. */
  initialOffer?: YachtOfferModel | null;
  initialPrice?: PriceCalcDto | null;
  /** The availability calendar's weeks, looked up on the server; null: the browser loads them. */
  initialCalendar?: InitialCalendar | null;
}

const BoatContentSection = ({
  yacht,
  yachtFaq,
  capacity,
  layoutImages = [],
  initialOffer = null,
  initialPrice = null,
  initialCalendar = null,
}: BoatContentSectionProps) => {
  const { selectedOffer, boatInquiryModalOpen } = useYachtStore();
  const { calculatePrice } = useYachtPriceCalculation();
  const boatTransition = useContext(BoatTransitionContext);
  const isPending = boatTransition?.isPending ?? false;
  const sectionRefs = useRef<(HTMLElement | null)[]>([]);
  // The offer the server priced (initialPrice) until its first calculation is
  // skipped: the same request would bring the same answer.
  const serverPricedOfferId = useRef<number | null>(null);
  const t = useTranslations('common');

  useEffect(() => {
    clearDataFromLocalStorage('yachtReservation');
    clearDataFromSessionStorage('reservationId');
    clearDataFromSessionStorage('activeStep');
    clearDataFromSessionStorage('selectedPaymentMethod');
    clearDataFromSessionStorage('selectedInstallment');
  }, []);

  const currentTabs = singleBoatTabsFor(yacht);
  // Amenities and Extras are folded until pressed (owner 13.10.2026, every
  // boat); choosing their tab opens them, so the scroll lands on content.
  const [expanded, setExpanded] = useState<Record<string, boolean>>({});
  const isFolded = (tabName: string) => tabName === 'ammenities' || tabName === 'extras';
  const toggleSection = (tabName: string) => setExpanded(prev => ({ ...prev, [tabName]: !prev[tabName] }));
  const sectionIds = useMemo(() => currentTabs.map((_, index) => `section-${index}`), [currentTabs]);

  const activeSectionId = useScrollSpy(sectionIds, 0.2);
  const activeIndex = sectionIds.indexOf(activeSectionId);

  useEffect(() => {
    serverPricedOfferId.current = null;

    // An inquiry-only boat prices nothing — no offer to select or calculate
    // (the PDF brochure then reads "On request" too).
    if (isInquiryOnlyBoat(yacht)) {
      setOffersToDisplay([]);
      setselectedOffer(null);

      return;
    }

    if (yacht && Array.isArray(yacht.offers)) {
      setOffersToDisplay(yacht.offers);

      if (yacht.offers.length > 0) {
        setselectedOffer(yacht.offers[0]);

        // Priced on the server: the answer is known from the first paint, and
        // no request still in flight for other dates may replace it.
        if (initialPrice && initialOffer?.id === yacht.offers[0].id) {
          serverPricedOfferId.current = initialOffer.id;
          cancelPendingPriceCalculation();
          setCalculatingPrice(false);
          setCalculatedPrice(initialPrice);
          setPriceSettled(yacht.slug, initialOffer.id);
        }
      } else {
        setselectedOffer(null);
      }
    }
  }, [yacht, initialOffer, initialPrice]);

  useEffect(() => {
    if (selectedOffer && serverPricedOfferId.current === selectedOffer.id) {
      // The server's price stands; one the first render still asked for
      // (with the store's previous offer) must not replace it.
      serverPricedOfferId.current = null;
      cancelPendingPriceCalculation();
      setCalculatingPrice(false);
    } else if (selectedOffer) {
      const obligatoryExtrasKeys = selectedOffer.obligatoryExtrasKeys || [];

      calculatePrice(yacht.slug, obligatoryExtrasKeys);
    } else if (serverPricedOfferId.current === null) {
      // No offer for these dates: nothing to ask, the answer is "not available".
      // A price request still in flight for the previous dates must not
      // overwrite that answer, and its cancelled `finally` no longer clears
      // "calculating" — so it is cleared here (review 6.10.2026). Not while a
      // server-priced offer is on its way: this is the first render's empty
      // store, the offer arrives with the next one.
      cancelPendingPriceCalculation();
      setCalculatingPrice(false);
      setCalculatedPrice(null);
      setPriceSettled(yacht.slug, null);
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
    const tabName = currentTabs[newValue];

    if (tabName && isFolded(tabName)) setExpanded(prev => ({ ...prev, [tabName]: true }));

    scrollToSection(newValue);
  };

  const renderTabContent = (tabName: string) => {
    switch (tabName) {
      case 'details':
        return <DetailsTab yacht={yacht} capacity={capacity} />;
      case 'ammenities':
        return <AmenitiesTab yacht={yacht} open={!!expanded.ammenities} onToggle={() => toggleSection('ammenities')} />;
      case 'availability':
        return <AvailabilityTab yacht={yacht} initialCalendar={initialCalendar} />;
      case 'extras':
        return <ExtrasTab yacht={yacht} open={!!expanded.extras} onToggle={() => toggleSection('extras')} />;
      case 'priceDetails':
        return <PriceDetailsTab yacht={yacht} />;
      case 'goodToKnow':
        return <GoodToKnowTab yacht={yacht} />;
      case 'video':
        return <VideoTab yacht={yacht} />;
      case 'faq':
        return <FAQTab yacht={yacht} yachtFaq={yachtFaq} />;
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
                  {/* The layout on its own, right above Amenities (not a tab). */}
                  {tabName === 'ammenities' && layoutImages.length > 0 && (
                    <>
                      <LayoutSection images={layoutImages} photoName={yachtPhotoName(yacht) || yacht.model} />
                      <Divider className={styles.divier} />
                    </>
                  )}
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
              <BoatCalendar
                variant={yacht.custom ? 'crewed' : 'inner'}
                yacht={yacht}
                initialOffer={initialOffer}
                initialPrice={initialPrice}
              />
            </Box>
          </Grid>
        </Grid>
      </Container>
    </>
  );
};

export default BoatContentSection;
