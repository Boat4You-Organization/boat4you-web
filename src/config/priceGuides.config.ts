/**
 * Yacht charter price guides (SEO plan 25.9.2026, "price guide as a citable
 * asset"): one data-driven page per country at
 * /yacht-charter-prices/{slug}, built from the nightly charter facts of the
 * country's did (src/utils/server/charterFacts.ts), plus the hub at
 * /yacht-charter-prices. The slug is the same in every locale, like the
 * other routes of the site.
 */
export interface PriceGuideCountry {
  slug: string;
  /** English catalogue name: placeText reads the localised name and phrase by it. */
  name: string;
  /** The country's did — the charter-facts key. */
  did: string;
  /** ISO code: the sailing season a month ranking must fit (factsMath.ts) and the landing links. */
  countryCode: string;
}

export const PRICE_GUIDES: readonly PriceGuideCountry[] = [
  { slug: 'croatia', name: 'Croatia', did: 'c-54', countryCode: 'HR' },
  { slug: 'greece', name: 'Greece', did: 'c-86', countryCode: 'GR' },
  { slug: 'italy', name: 'Italy', did: 'c-110', countryCode: 'IT' },
];

export const PRICE_GUIDE_HUB_PATH = '/yacht-charter-prices';

/** Locale-less path of one guide. */
export const priceGuidePath = (slug: string): string => `${PRICE_GUIDE_HUB_PATH}/${slug}`;

export const priceGuideBySlug = (slug: string): PriceGuideCountry | null =>
  PRICE_GUIDES.find(g => g.slug === slug) ?? null;

export const priceGuideByDid = (did: string): PriceGuideCountry | null => PRICE_GUIDES.find(g => g.did === did) ?? null;

export const priceGuideByCountry = (countryCode?: string | null): PriceGuideCountry | null =>
  (countryCode && PRICE_GUIDES.find(g => g.countryCode === countryCode.toUpperCase())) || null;
