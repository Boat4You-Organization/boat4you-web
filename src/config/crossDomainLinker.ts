/**
 * Google tag cross-domain measurement (audit N6, 1.10.2026).
 *
 * The six sister sites send their visitors here to book (the boat page's
 * "Reserve" button) and decorate that link with the Google linker parameter
 * `_gl`, which carries the visitor's GA client id and the Google Ads click id
 * of the ad they came from. With the linker set on this side as well, the
 * Google tag on boat4you accepts `_gl` on arrival, so a booking here is
 * credited to the sister-site ad click (the Ads tag AW-11060948992 is the
 * same on all seven sites) instead of starting as a new, unattributed visit.
 *
 * Consent Mode still decides: under `denied` the tag writes no cookie from
 * the linker either. Listing a domain also decorates our own links to it
 * (footer network links), which is how the sister sites receive it back.
 */
export const LINKER_DOMAINS = [
  'boat4you.com',
  'europe-yachts.com',
  'catamaran-charter-greece.com',
  'catamaran-croatia-charter.com',
  'catamarancharteritaly.com',
  'catamaran-charter-caribbean.com',
  'croatia-yachting.com',
] as const;

/** `gtag('set', 'linker', …)` for the inline head script; it has to run
 *  before gtag.js processes the first `config`. */
export const LINKER_SET_SNIPPET = `gtag('set','linker',${JSON.stringify({
  domains: LINKER_DOMAINS,
  accept_incoming: true,
})});`;
