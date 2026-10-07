/**
 * The offer's `hasMerchantReturnPolicy`, in schema.org terms of what the page
 * promises (7.10.2026): free cancellation within 72 hours of booking — a
 * finite window of 3 days, free of charge. Until now the boat page and the
 * /search listings declared `MerchantReturnNotPermitted` beside that very
 * promise ("Good to know → Cancellation policy"). The window runs from the
 * booking (cooling-off), not before check-in; schema.org has no field for
 * the start of the window, the visible policy text says it. Same values as
 * the sister sites already publish.
 *
 * `applicableCountry` stays the boat's country, as before.
 */
export const FREE_CANCELLATION_DAYS = 3;

export interface MerchantReturnPolicyLd {
  '@type': 'MerchantReturnPolicy';
  returnPolicyCategory: 'https://schema.org/MerchantReturnFiniteReturnWindow';
  merchantReturnDays: number;
  returnFees: 'https://schema.org/FreeReturn';
  applicableCountry?: string;
}

export const freeCancellationReturnPolicy = (country?: string | null): MerchantReturnPolicyLd => ({
  '@type': 'MerchantReturnPolicy',
  returnPolicyCategory: 'https://schema.org/MerchantReturnFiniteReturnWindow',
  merchantReturnDays: FREE_CANCELLATION_DAYS,
  returnFees: 'https://schema.org/FreeReturn',
  ...(country ? { applicableCountry: country } : {}),
});
