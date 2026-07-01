import React, { useMemo, useRef } from 'react';

import { Box, Container, Divider, Grid, Stack, Tab, Tabs } from '@mui/material';
import { useTranslations } from 'next-intl';

import { OFFSET } from '@/config/constants.config';
import { reservationTabs } from '@/config/tabs.config';
import { ReservationDetails } from '@/models/reservation.model';
import { Currency } from '@/models/user.model';
import colors from '@/styles/themes/colors';
import useScrollSpy from '@/utils/hooks/useScrollSpy';
import DateTime from '@/utils/static/DateTime';

import AmenitiesTab from './AmenitiesTab';
import CancellationTab from './CancellationTab';
import DetailsTab from './DetailsTab';
import FaqTab from './FaqTab';
import GoodToKnowTab from './GoodToKnowTab';
import MainInfoTab from './MainInfoTab';
import PaymentTab from './PaymentTab';
import styles from './ReservationInfoSection.module.scss';

interface ReservationInfoSectionProps {
  reservationDetails: ReservationDetails;
  userCurrency: Currency;
}

const ReservationInfoSection = ({ reservationDetails, userCurrency }: ReservationInfoSectionProps) => {
  const sectionRefs = useRef<(HTMLElement | null)[]>([]);
  const sectionIds = useMemo(() => reservationTabs.map((_, index) => `section-${index}`), []);
  const {
    dateFrom,
    dateTo,
    locationFrom,
    selectedExtras,
    totalPrice,
    totalPriceInfo,
    clientPricePerDayEur,
    clientPricePerDayInfo,
    checkin,
    checkout,
    specialRequest,
    numberOfDays: backendNumberOfDays,
    services,
    obligatoryExtrasKeys,
    securityDeposit,
    insuredSecurityDeposit,
    depositCurrency,
  } = reservationDetails;
  // Prefer the backend-provided number (matches BookingSummaryCard on
  // /enter-your-details); only fall back to the locally calculated span if
  // the backend didn't populate it for legacy rows.
  const numberOfDays =
    backendNumberOfDays && backendNumberOfDays > 0
      ? backendNumberOfDays
      : DateTime.daysBetween(DateTime.date(dateFrom), DateTime.date(dateTo));
  const t = useTranslations('common');

  const activeSectionId = useScrollSpy(sectionIds, 0.2);
  const activeIndex = sectionIds.indexOf(activeSectionId);

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

  const renderContent = (tabIndex: number) => {
    switch (tabIndex) {
      case 0:
        return (
          <MainInfoTab
            dateFrom={dateFrom}
            dateTo={dateTo}
            locationFrom={locationFrom}
            defaultCheckin={checkin}
            defaultCheckout={checkout}
            numberOfDays={numberOfDays}
            specialRequest={specialRequest}
          />
        );

      case 1:
        return <DetailsTab reservationDetails={reservationDetails} />;

      case 2:
        return <AmenitiesTab reservationDetails={reservationDetails} />;

      // Indices follow `reservationTabs` in tabs.config.ts — cancellation
      // deliberately sits just above FAQ (Mario 2.7.2026: don't open the
      // page by planting the idea of cancelling).
      case 3:
        return (
          <PaymentTab
            selectedExtras={selectedExtras}
            totalPrice={totalPrice}
            totalPriceInfo={totalPriceInfo}
            numberOfDays={numberOfDays}
            clientPricePerDayEur={clientPricePerDayEur}
            clientPricePerDayInfo={clientPricePerDayInfo}
            userCurrency={userCurrency}
            services={services}
            obligatoryExtrasKeys={obligatoryExtrasKeys}
            securityDeposit={securityDeposit}
            insuredSecurityDeposit={insuredSecurityDeposit}
            depositCurrency={depositCurrency}
            dateFrom={dateFrom}
          />
        );

      case 4:
        return <GoodToKnowTab />;

      case 5:
        return <CancellationTab dateFrom={dateFrom} />;

      case 6:
        return <FaqTab />;

      default:
        return null;
    }
  };

  return (
    <Container
      component="section"
      maxWidth="xl"
      disableGutters
      classes={{ root: styles.root }}
      className={styles.container}
    >
      <Grid container pt={{ xs: 3, md: 4 }} spacing={2.5}>
        <Grid size={{ xs: 12 }}>
          <Box className={styles.tabsWrapper}>
            <Tabs
              value={activeIndex === -1 ? 0 : activeIndex}
              onChange={handleTabChange}
              variant="scrollable"
              aria-label={t('allSingleBoatTabs')}
            >
              {reservationTabs.map(tabContent => (
                <Tab key={tabContent} label={t(tabContent)} sx={{ color: colors.black400, width: 'auto' }} />
              ))}
            </Tabs>
          </Box>
          <Box pt={6} pb={8} className={styles.contentWrapper}>
            {reservationTabs.map((label, index) => (
              <React.Fragment key={label}>
                <Stack
                  id={`section-${index}`}
                  ref={setSectionRef(index)}
                  data-index={index}
                  className={styles.section}
                  sx={{ scrollMarginTop: OFFSET }}
                >
                  {renderContent(index)}
                </Stack>
                {index < reservationTabs.length - 2 && <Divider className={styles.divier} />}
              </React.Fragment>
            ))}
          </Box>
        </Grid>
      </Grid>
    </Container>
  );
};

export default ReservationInfoSection;
