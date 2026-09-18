/** Keys inside the `common` i18n namespace (messages/<locale>/common.json). */
type PolicyMessageKey = '100PercentBookingPrepayment' | 'freeCancellationWithin72Hours' | 'bestPriceOnTheMarket';

export interface PolicyItem {
  titleKey: PolicyMessageKey;
  tooltipKey?: PolicyMessageKey;
  textColor?: 'default' | 'success';
}

export interface BookingInfo {
  paymentPolicies: PolicyItem[];
}

/**
 * Payment policies shown on every boat page.
 *
 * i18n keys, not literals: the strings used to be hard-coded English and the
 * middle one carried a placeholder date ("…before 14 Feb 2025") left over from
 * the initial commit — it rendered on every boat page in all 9 locales
 * (found during the 16.9.2026 cusma2 load incident review). Free cancellation
 * is a 72-hour cooling-off window counted from the moment of booking, and on a
 * boat page no booking or option exists yet, so no date may be shown here.
 */
export const availabilityCardConfig: BookingInfo = {
  paymentPolicies: [
    {
      titleKey: '100PercentBookingPrepayment',
      tooltipKey: '100PercentBookingPrepayment',
      textColor: 'default',
    },
    {
      titleKey: 'freeCancellationWithin72Hours',
      tooltipKey: 'freeCancellationWithin72Hours',
      textColor: 'success',
    },
    {
      titleKey: 'bestPriceOnTheMarket',
      tooltipKey: 'bestPriceOnTheMarket',
      textColor: 'default',
    },
  ],
};
