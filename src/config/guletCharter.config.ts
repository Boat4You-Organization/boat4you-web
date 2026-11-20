/**
 * The general gulet page (Gap Finder 20.11.2026, B#2): "gulet", "gulet
 * charter turkey / greece" had no page of their own, only the country gulet
 * landings (/search?destinations=x&boatTypes=GULET). The page sits above
 * those landings and links down to them. A gulet is always chartered with
 * its crew (guletCrewed.ts).
 */
export const GULET_CHARTER_PATH = '/gulet-charter';

/**
 * Countries of the page, in this order: the countries with an indexable gulet
 * landing in sitemap-categories on 20.11.2026. A country whose landing and
 * listing are both empty drops out at render time.
 */
export const GULET_COUNTRIES: readonly string[] = ['TR', 'GR', 'HR', 'IT'];
