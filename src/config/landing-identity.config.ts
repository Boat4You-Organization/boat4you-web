import { LocationType } from '@/types/location.type';

/**
 * Pinned destination landings: the URL identity of a landing is tied to the
 * catalogue's STABLE ids (did), never to the name a partner sync last wrote.
 *
 * Why (audit 26.9.2026, B01/B05): the MMK and NauSYS syncs both write
 * `Region.name` of the same mapped row, so "Zadar" ↔ "Zadar region",
 * "Šibenik" ↔ "Šibenik region" and "Istria / Kvarner" ↔ "Kvarner" swapped
 * with every sync. The landing URL, canonical, sitemap entry and index gate
 * were all derived from that name, so 144 sitemap URLs flipped between index
 * and noindex three times in 13 hours, and the old spelling rendered the
 * whole catalogue as noindex. Separately, two provider records of one area
 * (BVI region vs country, the two Athens regions, the two Dubrovnik regions)
 * were two indexable landings with the same boats.
 *
 * Each entry fixes:
 *   - `name`: the landing's canonical name — its lowercase form IS the URL
 *     (`/search?destinations=<name>`, buildSearchLandingPath), the sitemap
 *     entry, and the name the copy is built from. Never change a published
 *     name: that changes the URL.
 *   - `dids`: every catalogue record the landing lists (both providers'
 *     records of one area are unioned, like the "Split Region" popular entry).
 *   - `aliases`: every other spelling — names the syncs have written into
 *     these rows and the other provider's record. They resolve to this
 *     landing and 301 to its URL (search/page.tsx), so an old sitemap or
 *     external link never renders a noindex catalogue again.
 *
 * Names and aliases are matched with normalizeDestinationName (case,
 * diacritics and punctuation insensitive). A catalogue rename of a pinned row
 * changes nothing here; an unpinned region renamed by a sync is still found
 * by the rename fallback in destinationDid.ts ("X region" ↔ "X", one part of
 * "A / B") and 301s to its current name.
 */
export interface LandingIdentity {
  name: string;
  dids: string[];
  kind: LocationType;
  countryCode?: string;
  aliases: string[];
}

export const LANDING_IDENTITIES: LandingIdentity[] = [
  {
    // r-3: NauSYS "Zadar", MMK "Zadar region". 25.9 sitemap and today's name.
    name: 'Zadar',
    dids: ['r-3'],
    kind: LocationType.REGION,
    countryCode: 'HR',
    aliases: ['Zadar region', 'Zadar area'],
  },
  {
    // r-4: NauSYS "Šibenik", MMK "Šibenik region".
    name: 'Šibenik',
    dids: ['r-4'],
    kind: LocationType.REGION,
    countryCode: 'HR',
    aliases: ['Šibenik region', 'Sibenik region', 'Šibenik area'],
  },
  {
    // r-193: NauSYS "Istria / Kvarner", MMK "Kvarner".
    name: 'Istria / Kvarner',
    dids: ['r-193'],
    kind: LocationType.REGION,
    countryCode: 'HR',
    aliases: ['Kvarner', 'Istria', 'Istria and Kvarner', 'Istria & Kvarner', 'Istria-Kvarner', 'Kvarner region'],
  },
  {
    // r-6 (NauSYS, HR) and r-188 (MMK, no country): the same Dubrovnik fleet
    // — identical first 18 catamarans on both landings (B05).
    name: 'Dubrovnik region',
    dids: ['r-6', 'r-188'],
    kind: LocationType.REGION,
    countryCode: 'HR',
    aliases: ['Dubrovnik / Montenegro', 'Dubrovnik area'],
  },
  {
    // r-165 (MMK) and r-24 (NauSYS): one sailing area, both built around
    // Alimos; 9 of the first 18 boats shared, both linked from Greece (B05).
    name: 'Athens / Saronic Gulf',
    dids: ['r-165', 'r-24'],
    kind: LocationType.REGION,
    countryCode: 'GR',
    aliases: ['Athens area/Saronic/Peloponese', 'Athens area / Saronic / Peloponnese', 'Saronic Gulf'],
  },
  {
    // c-242 (the country record) and r-97 (the region record): identical
    // title, H1, meta and first 18 boats — 27 exact-duplicate URL pairs (B05).
    // A promoted country, so the landing keeps the country rule.
    name: 'British Virgin Islands',
    dids: ['c-242', 'r-97'],
    kind: LocationType.COUNTRY,
    countryCode: 'VG',
    aliases: ['Virgin Islands (British)', 'BVI', 'Virgin Islands British'],
  },
];
