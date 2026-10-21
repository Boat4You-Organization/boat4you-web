// Fires the "Request quote" conversion on a SUCCESSFUL yacht inquiry.
//
// Every inquiry on the site goes through BoatInquiryModal (the /boat page, the
// mobile bar, the inquiry-only panel and the booking details step all open the
// same form), so this is called once from that modal's success branch. Until
// now nothing fired there, so Google Ads reported 0 conversions for campaigns
// that actually produced inquiries (the vessel-name campaign above all).
//
// Both events go through the gtag instance that GoogleAnalyticsConsent
// configures, so Google Consent Mode v2 governs them: nothing with personal
// data fires until the visitor accepts cookies (Google models the rest).
//   • a Google Ads 'conversion' event sent to the "Request quote (boat4you)"
//     conversion action — what Google Ads counts and optimises bidding toward.
//   • generate_lead — the GA4 recommended lead event (funnel + reporting).
//
// `transaction_id` lets Google Ads de-duplicate if the effect ever re-fires,
// so one inquiry is never counted twice.

type Gtag = (command: string, action: string, params?: Record<string, unknown>) => void;

// Google Ads "Request quote (boat4you)" conversion action (account AW-11060948992).
const GADS_CONVERSION_SEND_TO = 'AW-11060948992/2C4nCIW6tKQdEIDgopop';

export const trackInquiry = ({ ref }: { ref?: string | number } = {}): void => {
  if (typeof window === 'undefined') return;

  const { gtag } = window as unknown as { gtag?: Gtag };

  if (typeof gtag !== 'function') return;

  const txId = ref !== undefined && ref !== null ? String(ref) : undefined;

  gtag('event', 'conversion', { send_to: GADS_CONVERSION_SEND_TO, transaction_id: txId });
  gtag('event', 'generate_lead', { transaction_id: txId });
};
