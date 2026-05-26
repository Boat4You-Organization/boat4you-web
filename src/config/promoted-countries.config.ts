/**
 * Countries Boat4You actively markets — used to gate sitemap entries so
 * Google doesn't crawl pages we don't want to rank for. Yachts in other
 * partner-supplied countries (Norway, Australia, etc.) still resolve via
 * direct deep-link, but they're not promoted in the index.
 *
 * Mario decision (4.5.2026): the promoted set is the 12 countries below.
 * To change the list, edit this constant — no other config needs touching;
 * sitemap-locations and sitemap-yachts both read from here.
 */
export const PROMOTED_COUNTRY_CODES = new Set<string>([
  'BS', // Bahamas
  'ES', // Spain
  'FR', // France
  'GD', // Grenada
  'GR', // Greece
  'HR', // Croatia
  'IT', // Italy
  'ME', // Montenegro
  'MQ', // Martinique
  'SC', // Seychelles
  'TR', // Türkiye
  'VG', // Virgin Islands (British)
]);

export const isPromotedCountry = (countryCode?: string | null): boolean =>
  !!countryCode && PROMOTED_COUNTRY_CODES.has(countryCode);
