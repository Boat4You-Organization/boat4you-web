import { proxy, useSnapshot } from 'valtio';

import { PaymentInstallment, PaymentMethod } from '@/config/paymentMethods.config';

interface BookingStore {
  activeStep: number;
  bookingModalOpen: boolean;
  reservationId: number | null;
  paymentData: {
    selectedPaymentMethod: PaymentMethod;
    selectedInstallment: PaymentInstallment;
  };
}

export const bookingStore = proxy<BookingStore>({
  activeStep: 0,
  bookingModalOpen: false,
  reservationId: null,
  paymentData: {
    selectedPaymentMethod: '' as PaymentMethod,
    selectedInstallment: PaymentInstallment.FULL_PAYMENT,
  },
});

export const useBookingStore = (): BookingStore => useSnapshot(bookingStore);
