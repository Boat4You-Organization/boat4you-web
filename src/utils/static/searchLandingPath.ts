/**
 * ONE canonical form for the destination landing pages:
 *
 *   /search?destinations=<lowercased destination name>[&boatTypes=<VESSEL_TYPE>]
 *
 * The location / category sitemaps, the search page canonical, its
 * breadcrumb JSON-LD and every internal link (homepage cards, related
 * destinations, itinerary CTAs) must build the URL through this helper so
 * Google sees exactly one spelling per page — before 25.9.2026 the sitemap
 * listed `croatia`, the canonical said `Croatia` and the homepage linked
 * `Croatia&did=c-54` (noindex), three URLs for one page.
 *
 * No `did`: the search page resolves the destination name to its did on
 * the server (src/utils/server/destinationDid.ts), so the clean URL filters.
 * Values are encoded with encodeURIComponent (space → %20, comma → %2C) so
 * the canonical string matches the sitemap <loc> byte for byte.
 */
export const destinationSlug = (name: string): string => name.trim().toLowerCase();

export const buildSearchLandingPath = (
  destinations?: string | readonly string[] | null,
  boatType?: string | null
): string => {
  // A string is ONE destination name (catalogue names may contain commas);
  // an array is one name per element.
  const list = (typeof destinations === 'string' ? [destinations] : (destinations ?? []))
    .map(destinationSlug)
    .filter(Boolean);
  const unique = Array.from(new Set(list));
  const query: string[] = [];

  // `'` is left alone by encodeURIComponent but percent-encoded by the URL
  // parser in a query (WHATWG "special-query" set), so the canonical Next
  // renders read `%27` while the sitemap said `'` — encode it here too.
  if (unique.length) query.push(`destinations=${encodeURIComponent(unique.join(',')).replace(/'/g, '%27')}`);

  if (boatType) query.push(`boatTypes=${encodeURIComponent(boatType)}`);

  return query.length ? `/search?${query.join('&')}` : '/search';
};

/**
 * `?destinations=` is a comma-separated list, so a catalogue name that
 * itself contains a comma ("Marina Spinut, Split" — ~90 promoted marinas)
 * cannot be expressed as a single-destination landing URL: /search would
 * read it as two places. Such names can only be addressed by did.
 */
export const isLandingExpressible = (name: string): boolean => !name.includes(',');

/**
 * The did form (`?destinations=Name&did=…`): noindex, but it always lands on
 * exactly the boats behind `did`. For places whose name cannot carry a
 * landing URL, or whose name resolves to a different place than the did.
 */
export const buildDidHref = (name: string, did: string, boatType?: string | null): string => {
  const boatTypeQuery = boatType ? `&boatTypes=${encodeURIComponent(boatType)}` : '';

  return `/search?destinations=${encodeURIComponent(name)}&did=${encodeURIComponent(did)}${boatTypeQuery}`;
};

/**
 * Internal link to a known catalogue location: the canonical landing form
 * when the name can carry it, otherwise the did form (noindex, but it lands
 * on the right boats).
 */
export const buildDestinationHref = (name: string, did: string, boatType?: string | null): string =>
  isLandingExpressible(name) ? buildSearchLandingPath(name, boatType) : buildDidHref(name, did, boatType);

/**
 * Case-, diacritics- and punctuation-insensitive key for matching a URL
 * destination value against catalogue names ("Istria / Kvarner" ≡
 * "istria/kvarner", "Marina Kaštela" ≡ "marina kastela"). đ and ł do not
 * decompose under NFD, so they are mapped explicitly first.
 */
export const normalizeDestinationName = (value?: string | null): string =>
  (value ?? '')
    .toLowerCase()
    .replace(/đ/g, 'd')
    .replace(/ł/g, 'l')
    .normalize('NFD')
    .replace(/\p{M}/gu, '')
    .replace(/[^a-z0-9]+/g, ' ')
    .trim();
