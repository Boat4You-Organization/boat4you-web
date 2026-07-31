// Fires the completed-booking conversion once the customer lands on
// /payment-success, i.e. the payment went through and the reservation exists.
//
// Why this exists: until now the only thing Google Ads ever heard from this
// site was `begin_checkout` (see trackBeginCheckout) — the moment someone
// filled in their details. The actual sale, the event worth optimising and
// bidding toward, was never sent, so no campaign could be measured against
// revenue and Display remarketing had no purchase signal at all.
//
// GA4's standard `purchase` event is what goes out here; once it starts
// arriving it can be marked a key event in GA4 and imported into Google Ads
// through the property's Ads link. It runs on the same gtag instance that
// GoogleAnalyticsConsent configures, so Consent Mode v2 governs it — nothing
// personal fires before the visitor accepts cookies (Google models the
// conversion when denied).
//
// `transaction_id` is the reservation id, so a refresh of the success page
// cannot count the same booking twice.

type Gtag = (command: string, action: string, params?: Record<string, unknown>) => void;

export const trackPurchase = ({
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

  gtag('event', 'purchase', { transaction_id: txId, ...valueParams });
};
