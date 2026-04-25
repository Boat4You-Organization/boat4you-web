import { useState } from 'react';

import { loadStripe } from '@stripe/stripe-js';
import { useRouter } from 'next/navigation';

import { PaymentMethod } from '@/config/paymentMethods.config';
import { showToast } from '@/valtio/global/global.actions';
import { useUserStore } from '@/valtio/user/user.store';
import { getDataFromSessionStorage } from '@/utils/static/sessionStorageUtils';

interface BookingContact {
  name: string;
  surname: string;
  email: string;
  phoneNumber: string;
  specialRequest: string;
}

// Initialize once at module scope so the loader script is fetched a single time.
const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_KEY || '');

interface UsePaymentSubmitParams {
  paymentMethod: string;
  reservationId: string;
  payFullAmount?: boolean;
  paymentPhaseId?: number;
  /** Stripe idempotency key generated once per /payment page mount. */
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
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();

        throw new Error(errorData.error || 'Failed to create checkout session');
      }

      const data = await response.json();

      // Primary path: backend already returns the full Stripe Checkout URL.
      // Works with the updated `CheckoutSessionDto.redirectUrl` field.
      if (typeof data.redirectUrl === 'string' && data.redirectUrl.startsWith('http')) {
        window.location.href = data.redirectUrl;

        return;
      }

      // Fallback: older backend builds only return `sessionIdOrOrderCode`
      // (the Stripe session id). Use @stripe/stripe-js to perform the
      // redirect client-side — this requires NEXT_PUBLIC_STRIPE_KEY.
      const sessionId: string | undefined = data.sessionIdOrOrderCode;

      if (sessionId && sessionId.startsWith('cs_')) {
        const stripe = await stripePromise;

        if (!stripe) {
          throw new Error('Stripe.js failed to initialize. Check NEXT_PUBLIC_STRIPE_KEY.');
        }

        const { error } = await stripe.redirectToCheckout({ sessionId });

        if (error) {
          throw new Error(error.message || 'Stripe redirect failed');
        }

        return;
      }

      throw new Error('Payment provider did not return a checkout URL. Check backend logs / Stripe configuration.');
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
