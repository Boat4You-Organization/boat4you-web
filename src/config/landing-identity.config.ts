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
    // l-63 (NauSYS "Marina Kastela", no town) and l-1935 (MMK "Marina Kaštela |
    // Kaštel Gomilica") are one marina (owner 13.10.2026: "to je isto"). The
    // landings are indexed under the ASCII spelling; the backend rename of
    // l-63 to the Croatian spelling (V9_77) must not move that URL, and both
    // records' boats list together.
    name: 'Marina Kastela',
    dids: ['l-63', 'l-1935'],
    kind: LocationType.MARINA,
    countryCode: 'HR',
    aliases: ['Marina Kaštela', 'Marina Kaštela | Kaštel Gomilica', 'Marina Kaštela, Kaštel Gomilica'],
  },
  {
    // l-72 (NauSYS "Marina Lav - Podstrana") and l-1423 (MMK "Marina Lav |
    // Podstrana") are one marina, 70 m apart (owner 13.10.2026: "spoji sve
    // duple marine"). The landings are indexed under the NauSYS name; the
    // backend rename of l-72 to "Marina Lav" (V9_78) must not move that URL.
    name: 'Marina Lav - Podstrana',
    dids: ['l-72', 'l-1423'],
    kind: LocationType.MARINA,
    countryCode: 'HR',
    aliases: ['Marina Lav', 'Marina Lav | Podstrana', 'Marina Lav, Podstrana'],
  },
  {
    // l-150 (NauSYS "Lavrion, main port"), l-1069 (MMK "Lavrion Main Port |
    // Lavrion") and l-2022 (MMK "Lavrion Marina | Lavrion"): one port, one
    // name since V9_78 / V9_79 (owner 13.10.2026).
    name: 'Lavrion Main Port',
    dids: ['l-150', 'l-1069', 'l-2022'],
    kind: LocationType.MARINA,
    countryCode: 'GR',
    aliases: [
      'Lavrion, main port',
      'Lavrion Main Port | Lavrion',
      'Lavrion Main Port, Lavrion',
      'Lavrion Marina',
      'Lavrion Marina | Lavrion',
      'Lavrion Marina, Lavrion',
    ],
  },
  {
    // l-134 (NauSYS "Preveza, Main Port") and l-835 (MMK "Preveza Main Port |
    // Preveza"), 400 m apart; one name since V9_78.
    name: 'Preveza Main Port',
    dids: ['l-134', 'l-835'],
    kind: LocationType.MARINA,
    countryCode: 'GR',
    aliases: ['Preveza, Main Port', 'Preveza Main Port | Preveza', 'Preveza Main Port, Preveza'],
  },
  {
    // l-160 (NauSYS "Skiathos") and l-2017 (MMK "Skiathos | Skiathos"), 363 m
    // apart; one place since V9_78.
    name: 'Skiathos',
    dids: ['l-160', 'l-2017'],
    kind: LocationType.MARINA,
    countryCode: 'GR',
    aliases: ['Skiathos | Skiathos', 'Skiathos, Skiathos'],
  },
  {
    // l-204 (NauSYS "Marmaris Adakoy Marina") and l-904 (MMK "Adaköy Marina |
    // Marmaris"), 523 m apart; one name since V9_78.
    name: 'Adaköy Marina',
    dids: ['l-204', 'l-904'],
    kind: LocationType.MARINA,
    countryCode: 'TR',
    aliases: ['Marmaris Adakoy Marina', 'Adaköy Marina | Marmaris', 'Adaköy Marina, Marmaris'],
  },
  {
    // l-13 (NauSYS "Marina Admiral Opatija") and l-1950 (MMK "Marina Admiral |
    // Opatija"); one name since V9_78, the old spelling 308s instead of 404.
    name: 'Marina Admiral',
    dids: ['l-13', 'l-1950'],
    kind: LocationType.MARINA,
    countryCode: 'HR',
    aliases: ['Marina Admiral Opatija', 'Marina Admiral | Opatija', 'Marina Admiral, Opatija'],
  },
  {
    // l-502 (NauSYS "Göcek/Skopea Marina") and l-780 (MMK "Skopea Marina |
    // Göcek"); one name since V9_78, the old spelling 308s instead of 404.
    name: 'Skopea Marina',
    dids: ['l-502', 'l-780'],
    kind: LocationType.MARINA,
    countryCode: 'TR',
    aliases: ['Göcek/Skopea Marina', 'Skopea Marina | Göcek', 'Skopea Marina, Göcek'],
  },
  {
    // l-27 (NauSYS "Marina Zadar (ex. Tankerkomerc)") and l-1941 (MMK "Marina
    // Zadar | Zadar"), 21 m apart; one name since V9_79. Owner 13.10.2026: the
    // landing moves to "marina zadar", the old spelling 308s.
    name: 'Marina Zadar',
    dids: ['l-27', 'l-1941'],
    kind: LocationType.MARINA,
    countryCode: 'HR',
    aliases: ['Marina Zadar (ex. Tankerkomerc)', 'Marina Zadar | Zadar', 'Marina Zadar, Zadar'],
  },
  {
    // l-135 (NauSYS "Palairos") and l-828 (MMK "Marina Paleros | Palairos"),
    // 25 m apart; one name since V9_79. Owner 13.10.2026: "palairos" 308s.
    name: 'Marina Paleros',
    dids: ['l-135', 'l-828'],
    kind: LocationType.MARINA,
    countryCode: 'GR',
    aliases: ['Palairos', 'Marina Paleros | Palairos', 'Marina Paleros, Palairos'],
  },
  {
    // l-411 (NauSYS) and l-1550 (MMK, named after a charter agency until
    // V9_79 - an agency name is never public), 27 m apart. Owner 13.10.2026:
    // the old URL 308s. Server-only alias; never rendered.
    name: 'Marina di Golfo Aranci',
    dids: ['l-411', 'l-1550'],
    kind: LocationType.MARINA,
    countryCode: 'IT',
    aliases: [
      'Mare Fun Charter & Marina',
      'Marina di Golfo Aranci | Golfo Aranci',
      'Marina di Golfo Aranci, Golfo Aranci',
    ],
  },
  {
    // l-710 (MMK "Olympic Marina | Lavrion") and l-139 (NauSYS "Lavrion -
    // Olympic Marine", coordinates were the town port): one marina (owner
    // 13.10.2026: "sigurno da, spoji"). The catalogue name is the marina's own
    // "Olympic Marine" since V9_79; the landing keeps its indexed URL.
    name: 'Olympic Marina',
    dids: ['l-139', 'l-710'],
    kind: LocationType.MARINA,
    countryCode: 'GR',
    aliases: [
      'Olympic Marine',
      'Lavrion - Olympic Marine',
      'Olympic Marine | Lavrion',
      'Olympic Marine, Lavrion',
      'Olympic Marina | Lavrion',
      'Olympic Marina, Lavrion',
    ],
  },
  {
    // l-222 (NauSYS "Olbia") is Marina di Olbia = l-609 (MMK), owner
    // 13.10.2026 "JE, SPOJI"; l-225 (NauSYS "Marina di Olbia Yachting
    // Services", no active boats) is already one row with l-609 in the list.
    // Catalogue name "Marina di Olbia" since V9_79; the landing keeps its
    // indexed URL. Molo Brin (l-1208) stays apart.
    name: 'Olbia',
    dids: ['l-222', 'l-609', 'l-225'],
    kind: LocationType.MARINA,
    countryCode: 'IT',
    aliases: [
      'Marina di Olbia',
      'Marina di Olbia Yachting Services',
      'Marina di Olbia | Olbia',
      'Marina di Olbia, Olbia',
    ],
  },
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
