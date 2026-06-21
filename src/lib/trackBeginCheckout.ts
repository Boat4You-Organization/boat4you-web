// Fires the "begin checkout" conversion the moment a customer has filled in
// their contact details and a reservation/option was successfully created —
// i.e. right before they land on /payment. This is the conversion Boat4You
// optimises Google Ads bidding toward (a real, qualified booking intent).
//
// Two events are sent through the same gtag instance that GoogleAnalyticsConsent
// configures, so Google Consent Mode v2 governs them automatically: nothing
// with personal data fires until the visitor accepts cookies (Google models the
// conversion when denied).
//   • ads_conversion_begin_checkout — the Google Ads conversion. Create it in
//     Google Ads by importing the GA4 key event of the SAME name (GA4 is linked
//     to the Ads account). Do NOT rename without updating the Google Ads
//     conversion action.
//   • begin_checkout — the GA4 standard ecommerce event (funnel + reporting).
//
// `transaction_id` (the reservation id) lets Google Ads de-duplicate if the
// effect re-fires, so a single booking is never counted twice.

type Gtag = (command: string, action: string, params?: Record<string, unknown>) => void;

const GADS_BEGIN_CHECKOUT_EVENT = 'ads_conversion_begin_checkout';

export const trackBeginCheckout = ({
  ref,
  value,
  currency = 'EUR',
}: {
  ref?: string | number;
  value?: number;
  currency?: string;
}): void => {
  if (typeof window === 'undefined') return;

  const { gtag } = window as unknown as { gtag?: Gtag };

  if (typeof gtag !== 'function') return;

  const txId = ref !== undefined && ref !== null ? String(ref) : undefined;
  const valueParams = typeof value === 'number' && value > 0 ? { value, currency } : {};

  gtag('event', GADS_BEGIN_CHECKOUT_EVENT, { transaction_id: txId, ...valueParams });
  gtag('event', 'begin_checkout', { transaction_id: txId, ...valueParams });
};
