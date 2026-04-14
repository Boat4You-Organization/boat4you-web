import { loadStripe } from '@stripe/stripe-js';

import { showToast } from '@/valtio/global/global.actions';

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_KEY || '');

export const useStripeCheckout = () => {
  const redirectToCheckout = async (sessionId: string) => {
    try {
      const stripe = await stripePromise;

      if (!stripe) {
        throw new Error('Stripe failed to initialize');
      }

      const { error } = await stripe.redirectToCheckout({
        sessionId,
      });

      if (error) {
        showToast({
          status: 'error',
          text: error.message || 'Failed to initialize payment system',
        });

        return { success: false, error };
      }

      return { success: true };
    } catch (error) {
      showToast({
        status: 'error',
        text: 'Failed to initialize payment system',
      });

      return { success: false, error };
    }
  };

  return { redirectToCheckout };
};
