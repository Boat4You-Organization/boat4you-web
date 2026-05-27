'use client';

/* eslint-disable consistent-return */
import { useEffect, useRef, useState } from 'react';

import { Box, Container, Stack } from '@mui/material';
import cx from 'clsx';
import { useRouter } from 'next/navigation';

import { previewPaymentPhases } from '@/actions/reservation.actions';
import CircularProgress from '@/components/CircularProgress';
import { PaymentInstallment, PaymentMethod } from '@/config/paymentMethods.config';
import { PaymentPhase } from '@/models/reservation.model';
import { UserModel } from '@/models/user.model';
import { ReservationData } from '@/types/reservation.type';
import { clearDataFromLocalStorage, getDataFromLocalStorage } from '@/utils/static/localStorageUtils';
import { clearDataFromSessionStorage, getDataFromSessionStorage } from '@/utils/static/sessionStorageUtils';
import { loadPaymentMethod, loadSelectedInstallment, setActiveStep } from '@/valtio/booking/booking.actions';
import { useBookingStore } from '@/valtio/booking/booking.store';

import styles from './Booking.module.scss';
import BookingHero from './BookingHero';
import DetailsStep from './BookingSteps/DetailsStep';
import OverviewStep from './BookingSteps/OverviewStep';
import PaymentStep from './BookingSteps/PaymentStep';
import UnifiedPaymentStep from './BookingSteps/UnifiedPaymentStep';
import BookingSummaryCard from './BookingSummaryCard';
import CancellationCard from './CancellationCard';
import OverviewCard from './OverviewCard';
import PaymentPoliciesCard from './PaymentPoliciesCard';
import PriceBreakdownCard from './PriceBreakdownCard';

interface BookingProps {
  isAdmin: boolean;
  user: UserModel | null;
  /**
   * Forces the booking wizard to start at a specific step regardless of
   * session storage. Driven by the page route:
   *  - /enter-your-details → 0 (DetailsStep)
   *  - /payment            → 1 (UnifiedPaymentStep)
   */
  initialStep?: number;
}

const Booking = ({ isAdmin, user, initialStep = 0 }: BookingProps) => {
  const { activeStep } = useBookingStore();
  const [reservationData, setReservationData] = useState<ReservationData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [previewPhases, setPreviewPhases] = useState<PaymentPhase[]>([]);
  const [isLoadingPreviewPhases, setIsLoadingPreviewPhases] = useState(false);
  const router = useRouter();
  const isInitialMount = useRef(true);

  const isLastStep = isAdmin ? false : activeStep === 2;

  useEffect(() => {
    if (isInitialMount.current) {
      isInitialMount.current = false;

      return;
    }

    requestAnimationFrame(() => {
      window.scrollTo({ top: 0, behavior: 'auto' });
    });
  }, [activeStep]);

  useEffect(() => {
    const savedReservation = getDataFromLocalStorage<ReservationData>('yachtReservation');
    const savedActiveStep = getDataFromSessionStorage<number>('activeStep');
    const savedPaymentMethod = getDataFromSessionStorage<PaymentMethod>('selectedPaymentMethod');
    const savedInstallment = getDataFromSessionStorage<PaymentInstallment>('selectedInstallment');
    const savedReservationId = getDataFromSessionStorage<number>('reservationId');

    setReservationData(savedReservation);

    if (!savedReservation) {
      router.back();

      return;
    }

    const savedAt = new Date(savedReservation.savedAt);
    const now = new Date();
    const hoursSinceSaved = (now.getTime() - savedAt.getTime()) / (1000 * 60 * 60);

    if (hoursSinceSaved > 24) {
      clearDataFromLocalStorage('yachtReservation');
      clearDataFromSessionStorage('reservationId');
      clearDataFromSessionStorage('activeStep');
      clearDataFromSessionStorage('selectedPaymentMethod');
      clearDataFromSessionStorage('selectedInstallment');

      router.push('/');

      return;
    }

    // /payment requires a reservation that was already created in /enter-your-details.
    // If the user lands there directly or session got cleared, send them back.
    if (initialStep >= 1 && !savedReservationId) {
      router.replace('/');

      return;
    }

    if (!savedReservationId) {
      setActiveStep(0);
      clearDataFromSessionStorage('activeStep');
      clearDataFromSessionStorage('selectedPaymentMethod');
      clearDataFromSessionStorage('selectedInstallment');
      loadPaymentMethod('' as PaymentMethod);
      loadSelectedInstallment(PaymentInstallment.FULL_PAYMENT);
      setIsLoading(false);

      return;
    }

    // URL-driven step (prop from the route) takes precedence over saved state so
    // navigating back to /enter-your-details always lands on step 0, and /payment
    // always lands on step 1.
    setActiveStep(initialStep);

    if (savedPaymentMethod) {
      loadPaymentMethod(savedPaymentMethod);
    } else {
      loadPaymentMethod('' as PaymentMethod);
    }

    if (savedInstallment !== null) {
      loadSelectedInstallment(savedInstallment);
    }

    setIsLoading(false);
  }, [router, initialStep]);

  // Pull partner-aware payment phases (with B4Y discount applied) so the
  // /enter-your-details Price breakdown shows the same schedule the customer
  // will be billed against — instead of the client-side A/B/C fallback that
  // ignores partner installment ratios.
  useEffect(() => {
    if (!reservationData) return;

    const { yachtId, dateFrom, dateTo, totalPriceEur } = reservationData;

    if (!yachtId || !dateFrom || !dateTo || !(totalPriceEur > 0)) return;

    let cancelled = false;

    setIsLoadingPreviewPhases(true);
    previewPaymentPhases(yachtId, dateFrom, dateTo, totalPriceEur)
      .then(({ payload }) => {
        if (cancelled) return;

        setPreviewPhases(payload ?? []);
      })
      .finally(() => {
        if (!cancelled) setIsLoadingPreviewPhases(false);
      });

    return () => {
      cancelled = true;
    };
  }, [reservationData]);

  if (isLoading || !reservationData) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <CircularProgress size={64} />
      </Box>
    );
  }

  const renderStepPanel = () => {
    switch (activeStep) {
      case 0:
        return <DetailsStep reservationData={reservationData} isAdmin={isAdmin} user={user} />;
      case 1:
        return <UnifiedPaymentStep reservationData={reservationData} />;
      case 2:
        // Legacy 3-step wizard path — kept for admin/internal flows that still
        // call handleNextStep() through to the overview. Guest + registered
        // guests on the public site now use the unified step 1 screen and
        // never reach this branch.
        return (
          <OverviewStep
            isLastStep={isLastStep}
            reservationData={reservationData}
            selectedExtrasInPrice={reservationData.selectedExtrasInPrice}
            selectedExtrasAtBase={reservationData.selectedExtrasAtBase}
            dateFrom={reservationData.dateFrom}
          />
        );
      default:
        return null;
    }
  };

  return (
    <Container maxWidth="xl" disableGutters classes={{ root: styles.root }} className={styles.container}>
      {!isLastStep && <BookingHero reservationData={reservationData} />}
      <Stack className={cx(styles.form, { [styles.lastStep]: isLastStep })}>
        <Stack className={styles.leftPanel}>
          {isLastStep ? (
            <OverviewCard reservationData={reservationData} isLastStep={isLastStep} />
          ) : (
            <>
              <BookingSummaryCard reservationData={reservationData} />
              <Box className={styles.divider} />
              <PriceBreakdownCard
                reservationData={reservationData}
                paymentPhases={previewPhases}
                isLoadingPhases={isLoadingPreviewPhases}
              />
              <Box className={styles.divider} />
              <PaymentPoliciesCard
                selectedExtrasInPrice={reservationData.selectedExtrasInPrice}
                selectedExtrasAtBase={reservationData.selectedExtrasAtBase}
                dateFrom={reservationData.dateFrom}
                securityDeposit={reservationData.securityDeposit}
              />
              <Box className={styles.divider} />
              <CancellationCard dateFrom={reservationData.dateFrom} />
            </>
          )}
        </Stack>
        <Box className={styles.rightPanel}>{renderStepPanel()}</Box>
      </Stack>
    </Container>
  );
};

export default Booking;
