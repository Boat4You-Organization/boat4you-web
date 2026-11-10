import { useState } from 'react';

import { useLocale } from 'next-intl';
import { useRouter } from 'next/navigation';

import { PaymentMethod } from '@/config/paymentMethods.config';
import { getDataFromSessionStorage } from '@/utils/static/sessionStorageUtils';
import { showToast } from '@/valtio/global/global.actions';
import { useUserStore } from '@/valtio/user/user.store';

interface BookingContact {
  name: string;
  surname: string;
  email: string;
  phoneNumber: string;
  specialRequest: string;
}

/**
 * Hosted card checkouts the browser may be sent to: Mollie (the card provider) and Stripe (kept behind the backend
 * switch as an emergency fallback). Anything else is never opened.
 */
const CARD_CHECKOUT_ORIGINS = ['https://www.mollie.com', 'https://checkout.stripe.com'];

const isCardCheckoutUrl = (url: unknown): url is string => {
  if (typeof url !== 'string') return false;

  try {
    return CARD_CHECKOUT_ORIGINS.includes(new URL(url).origin);
  } catch {
    return false;
  }
};

interface UsePaymentSubmitParams {
  paymentMethod: string;
  reservationId: string;
  payFullAmount?: boolean;
  paymentPhaseId?: number;
  /** Idempotency key generated once per /payment page mount (a double click returns the same checkout). */
  idempotencyKey?: string;
}

export const usePaymentSubmit = ({
  paymentMethod,
  reservationId,
  payFullAmount,
  paymentPhaseId,
  idempotencyKey,
}: UsePaymentSubmitParams) => {
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const locale = useLocale();
  const { user } = useUserStore();

  const handleSubmit = async () => {
    if (paymentMethod === PaymentMethod.BANK_TRANSFER) {
      // No hosted-payment handoff for bank transfer — the wire instructions
      // already landed in the customer's inbox when the reservation was
      // created (sendOptionCreatedEmail in the backend). Here we just park
      // them on a page where they can pick up the booking.
      //
      //   • Logged-in customer → /my-bookings (they can see the pending row
      //     and re-open the reference number any time).
      //   • Guest → /signup?email=…&reservationId=… so they immediately set
      //     a password and turn their PENDING account into REGISTERED. Same
      //     flow the payment-success page uses for card guests.
      if (user) {
        router.replace('/my-bookings');

        return;
      }

      const contact = getDataFromSessionStorage<BookingContact>('bookingContact');
      const email = contact?.email ?? '';
      const query = new URLSearchParams({
        email,
        reservationId: reservationId.toString(),
      }).toString();

      router.replace(`/signup?${query}`);

      return;
    }

    setIsLoading(true);

    try {
      const response = await fetch('/api/payments/create-checkout-session', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          reservationId,
          payFullAmount,
          paymentPhaseId,
          idempotencyKey,
          locale,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();

        throw new Error(errorData.error || 'Failed to create checkout session');
      }

      const data = await response.json();

      // The backend returns the provider's hosted checkout URL (Mollie; Stripe only behind the backend switch).
      if (isCardCheckoutUrl(data.redirectUrl)) {
        window.location.href = data.redirectUrl;

        return;
      }

      throw new Error("We couldn't start the card payment. Please try again in a moment.");
    } catch (error) {
      showToast({
        status: 'error',
        text: error instanceof Error ? error.message : 'An unexpected error occurred',
      });
    } finally {
      setIsLoading(false);
    }
  };

  return { handleSubmit, isLoading };
};
