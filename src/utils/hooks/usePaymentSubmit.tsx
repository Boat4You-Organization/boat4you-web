import { useState } from 'react';

import { loadStripe } from '@stripe/stripe-js';
import { useRouter } from 'next/navigation';

import { PaymentMethod } from '@/config/paymentMethods.config';
import { showToast } from '@/valtio/global/global.actions';

// Initialize once at module scope so the loader script is fetched a single time.
const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_KEY || '');

interface UsePaymentSubmitParams {
  paymentMethod: string;
  reservationId: string;
  payFullAmount?: boolean;
  paymentPhaseId?: number;
}

export const usePaymentSubmit = ({
  paymentMethod,
  reservationId,
  payFullAmount,
  paymentPhaseId,
}: UsePaymentSubmitParams) => {
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async () => {
    if (paymentMethod === PaymentMethod.BANK_TRANSFER) {
      router.replace('/payment-pending');

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
