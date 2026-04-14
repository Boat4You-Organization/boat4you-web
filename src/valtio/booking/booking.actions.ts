import { PaymentInstallment, PaymentMethod } from '@/config/paymentMethods.config';
import { clearDataFromSessionStorage, saveDataToSessionStorage } from '@/utils/static/sessionStorageUtils';

import { bookingStore } from './booking.store';

export const handleNextStep = () => {
  bookingStore.activeStep += 1;
  saveDataToSessionStorage('activeStep', bookingStore.activeStep);
};

export const handleBackStep = () => {
  bookingStore.activeStep -= 1;
  saveDataToSessionStorage('activeStep', bookingStore.activeStep);
};

export const setActiveStep = (step: number) => {
  bookingStore.activeStep = step;
  saveDataToSessionStorage('activeStep', step);
};

export const toggleBookingModalOpen = (isOpen?: boolean | React.MouseEvent): void => {
  bookingStore.bookingModalOpen = typeof isOpen === 'boolean' ? isOpen : !bookingStore.bookingModalOpen;
};

export const setReservationId = (reservationId: number | null): void => {
  bookingStore.reservationId = reservationId;
};

export const setPaymentMethod = (paymentMethod: PaymentMethod): void => {
  bookingStore.paymentData.selectedPaymentMethod = paymentMethod;
  saveDataToSessionStorage('selectedPaymentMethod', paymentMethod);
};

export const setSelectedInstallment = (installment: PaymentInstallment): void => {
  bookingStore.paymentData.selectedInstallment = installment;
  saveDataToSessionStorage('selectedInstallment', installment);
};

export const loadPaymentMethod = (paymentMethod: PaymentMethod): void => {
  bookingStore.paymentData.selectedPaymentMethod = paymentMethod;
};

export const loadSelectedInstallment = (installment: PaymentInstallment): void => {
  bookingStore.paymentData.selectedInstallment = installment;
};

export const resetPaymentData = (): void => {
  bookingStore.paymentData = {
    selectedPaymentMethod: PaymentMethod.CREDIT_CARD,
    selectedInstallment: PaymentInstallment.FULL_PAYMENT,
  };
  clearDataFromSessionStorage('selectedPaymentMethod');
  clearDataFromSessionStorage('selectedInstallment');
};

export const resetActiveStep = (): void => {
  bookingStore.activeStep = 0;
  clearDataFromSessionStorage('activeStep');
};
