'use client';

import { useEffect, useRef, useState } from 'react';

import { Box, Container, Stack } from '@mui/material';
import cx from 'clsx';
import { useRouter } from 'next/navigation';

import CircularProgress from '@/components/CircularProgress';
import { PaymentInstallment, PaymentMethod } from '@/config/paymentMethods.config';
import { UserModel } from '@/models/user.model';
import { ReservationData } from '@/types/reservation.type';
import { clearDataFromLocalStorage, getDataFromLocalStorage } from '@/utils/static/localStorageUtils';
import { clearDataFromSessionStorage, getDataFromSessionStorage } from '@/utils/static/sessionStorageUtils';
import { loadPaymentMethod, loadSelectedInstallment, setActiveStep } from '@/valtio/booking/booking.actions';
import { useBookingStore } from '@/valtio/booking/booking.store';

import styles from './Booking.module.scss';
import DetailsStep from './BookingSteps/DetailsStep';
import OverviewStep from './BookingSteps/OverviewStep';
import PaymentStep from './BookingSteps/PaymentStep';
import CancellationCard from './CancellationCard';
import OverviewCard from './OverviewCard';
import PaymentPoliciesCard from './PaymentPoliciesCard';
import PriceBreakdownCard from './PriceBreakdownCard';

interface BookingProps {
  isAdmin: boolean;
  user: UserModel;
}

const Booking = ({ isAdmin, user }: BookingProps) => {
  const { activeStep } = useBookingStore();
  const [reservationData, setReservationData] = useState<ReservationData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
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

    if (savedActiveStep !== null) {
      setActiveStep(savedActiveStep);
    }

    if (savedPaymentMethod) {
      loadPaymentMethod(savedPaymentMethod);
    } else {
      loadPaymentMethod('' as PaymentMethod);
    }

    if (savedInstallment !== null) {
      loadSelectedInstallment(savedInstallment);
    }

    setIsLoading(false);
  }, [router]);

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
        return <PaymentStep reservationData={reservationData} />;
      case 2:
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
      <Stack className={cx(styles.form, { [styles.lastStep]: isLastStep })}>
        <Stack className={styles.leftPanel}>
          {isLastStep ? (
            <OverviewCard reservationData={reservationData} isLastStep={isLastStep} />
          ) : (
            <>
              <Box className={styles.divider} />
              <PriceBreakdownCard reservationData={reservationData} />
              <Box className={styles.divider} />
              <PaymentPoliciesCard
                selectedExtrasInPrice={reservationData.selectedExtrasInPrice}
                selectedExtrasAtBase={reservationData.selectedExtrasAtBase}
                dateFrom={reservationData.dateFrom}
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
