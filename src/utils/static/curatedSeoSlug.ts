import { VesselType } from '@/models/yacht.model';

/**
 * Pure (no fs, no fetch) resolver for the curated SEO corpus in
 * `public/seo-content/{locale}/{slug}.html`. Moved out of the client
 * SeoTextSection (25.9.2026) so the search page can resolve and read the
 * file on the server and ship the text in the SSR HTML.
 *
 * File-naming conventions in the source corpus (per `Desktop/TEKSTOVI BOAT4YOU`):
 *   country/region/city + boat-type → `{area}-{boattype}-charter.html`
 *   country/region/city overview    → `{area}-yacht-charter-and-boat-rental.html`
 *   region overview                 → `{area}-sailing-area-yacht-charter-and-boat-rental.html`
 *   marina + boat-type              → `{boattype}-charter-{marina}.html`
 */
const VESSEL_SLUG: Partial<Record<VesselType, string>> = {
  [VesselType.CATAMARAN]: 'catamaran',
  [VesselType.SAILING_YACHT]: 'sailing-yacht',
  [VesselType.MOTOR_YACHT]: 'motor-yacht',
  [VesselType.LUXURY_MOTOR_YACHT]: 'luxury-motor-yacht',
  [VesselType.MOTORBOAT]: 'motorboat',
  [VesselType.MOTORSAILER]: 'motorsailer',
  [VesselType.GULET]: 'gulet',
  [VesselType.POWER_CATAMARAN]: 'power-catamaran',
};

export const slugifyDestination = (name: string): string =>
  name
    .toLowerCase()
    // Slavic diacritics that don't decompose via NFD — explicit map so
    // "Šibenik" → "sibenik" (instead of "ibenik" after the strip below).
    .replace(/[čć]/g, 'c')
    .replace(/đ/g, 'd')
    .replace(/š/g, 's')
    .replace(/ž/g, 'z')
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    // Treat slashes, ampersands, commas and apostrophes as word breaks BEFORE
    // stripping non-alphanumerics. Without this, "Athens area/Saronic/Peloponese"
    // collapses to "athens-areasaronicpeloponese", and "Côte d'Azur" produces
    // "cote-dazur" instead of the corpus's "cote-d-azur".
    .replace(/[/&,'’]+/g, ' ')
    .replace(/[^a-z0-9\s-]/g, '')
    .trim()
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-');

// Alias map — our DB names some destinations with a longer/different label
// than the slug used in the curated SEO corpus. Add entries as gaps surface
// in the search → file matching. Keys are lowercased DB display names; values
// are the matching file-name prefix from `public/seo-content/{locale}/`.
const DESTINATION_ALIAS: Record<string, string> = {
  'ionian region': 'ionian-islands',
  'aegean region': 'aegean',
  'aegean sea': 'aegean',
  'caribbean sea': 'caribbean',
  türkiye: 'turkiye',
  turkey: 'turkiye',
  istria: 'istria-kvarner',
  kvarner: 'istria-kvarner',
  brittany: 'bretagne',
  liguria: 'liguria-toscana',
};

/**
 * Candidate slugs for a (destination × boat type) query, in priority order.
 * The corpus uses four file-naming patterns:
 *   (a) `{area}-{boattype}-charter`                 (country/region/city + boat)
 *   (b) `{boattype}-charter-{marina}`               (marina + boat)
 *   (c) `{area}-sailing-area-yacht-charter-and-boat-rental` (region overview)
 *   (d) `{area}-yacht-charter-and-boat-rental`      (country overview)
 *
 * Most specific (boat-type-bearing) patterns first, broader overviews after.
 * The first existing file wins.
 *
 * `typeSpecificOnly` returns just (a)/(b): a boat-type landing that only has
 * the destination overview is the same text as the destination landing, so
 * the index gate must not count the overview fallback as "curated" for it.
 */
export const resolveCuratedSlugCandidates = (
  destination: string,
  boatType?: VesselType | null,
  { typeSpecificOnly = false }: { typeSpecificOnly?: boolean } = {}
): string[] => {
  const aliasKey = destination.trim().toLowerCase();
  const aliased = Object.prototype.hasOwnProperty.call(DESTINATION_ALIAS, aliasKey)
    ? DESTINATION_ALIAS[aliasKey]
    : undefined;
  const dest = aliased ?? slugifyDestination(destination);

  if (!dest) return [];

  const candidates: string[] = [];

  if (boatType) {
    // Own-key lookup: `boatTypes=constructor` must not pick up Object.prototype.
    const bt = Object.prototype.hasOwnProperty.call(VESSEL_SLUG, boatType) ? VESSEL_SLUG[boatType] : undefined;

    if (bt) {
      candidates.push(`${dest}-${bt}-charter`); // (a) area-boat
      candidates.push(`${bt}-charter-${dest}`); // (b) boat-marina
    }
  }

  if (typeSpecificOnly && boatType) return candidates;

  candidates.push(`${dest}-sailing-area-yacht-charter-and-boat-rental`); // (c) region overview
  candidates.push(`${dest}-yacht-charter-and-boat-rental`); // (d) country/city overview

  return candidates;
};

/**
 * Strip everything outside `<body>...</body>`, then remove the first `<h1>`
 * (the search page renders its own H1 above the SEO block).
 */
export const sanitizeCuratedHtml = (raw: string): string => {
  const bodyMatch = raw.match(/<body[^>]*>([\s\S]*?)<\/body>/i);
  let html = bodyMatch ? bodyMatch[1] : raw;

  // Drop the first H1 — duplicates the page title already rendered above.
  html = html.replace(/<h1\b[^>]*>[\s\S]*?<\/h1>/i, '');

  return html.trim();
};
