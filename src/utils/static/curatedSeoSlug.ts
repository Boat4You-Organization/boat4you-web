import { VesselType } from '@/models/yacht.model';
import { normalizeDestinationName } from '@/utils/static/searchLandingPath';

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

// Alias map — the corpus was written against an older destination list, so
// some catalogue places carry their text under another file-name prefix
// ("Alimos Marina" → `athens-alimos-marina`, "Marina Punat" →
// `marina-punat-krk` / `punat`). Keys are normalised catalogue names (see
// normalizeDestinationName); values are the file-name prefixes in
// `public/seo-content/{locale}/`, tried in order BEFORE the name's own slug.
//
// Every entry was matched by hand against /public/locations (25.9.2026): the
// key is a catalogue name without a comma (so it can carry a landing URL) and
// the prefix's text is about that place. The landing gate still requires the
// text to be unique: a key borrowing a prefix that another catalogue place
// owns by name (Liguria → `liguria-toscana`, owned by "Liguria / Toscana")
// is not indexable (landingGate.ts).
const DESTINATION_ALIAS_SOURCE: Record<string, string | string[]> = {
  'ionian region': 'ionian-islands',
  'aegean region': 'aegean',
  'aegean sea': 'aegean',
  'caribbean sea': 'caribbean',
  turkiye: 'turkiye',
  turkey: 'turkiye',
  istria: 'istria-kvarner',
  kvarner: 'istria-kvarner',
  brittany: 'bretagne',
  liguria: 'liguria-toscana',
  // Regions
  "french riviera (côte d'azur)": 'french-riviera',
  // Bases (marinas / ports) — corpus prefix = "<town>-<marina>" or the town
  'marina punat': ['marina-punat-krk', 'punat'],
  'marina kornati': 'marina-kornati-biograd',
  'marina kremik': ['marina-kremik-primosten', 'kremik-primosten'],
  'd-marin dalmacija marina': ['sukosan-d-marin-dalmacija-marina', 'dalmacija-marina', 'sukosan'],
  'alimos marina': 'athens-alimos-marina',
  'marina di portisco': ['di-portisco', 'portisco'],
  'd-marin marina mandalina': 'marina-mandalina',
  'marina polesana': 'pula-marina-polesana',
  'aci marina skradin': 'skradin',
  'marsala marina': 'marsala',
  'marina di stabia': ['castellammare-marina-di-stabia', 'castellammare-di-stabia'],
  'marina di nettuno': 'di-nettuno',
  'd-marin marina gouvia': 'gouvia',
  'sant antoni de portmany port': 'sant-antoni-de-portmany',
  'marina zeas': 'zeas',
  'marina naviera balear': ['naviera-balear', 'palma-de-mallorca-marina-naviera-balear'],
  'albatros marina': 'marmaris-albatros-marina',
  'marina villa igiea': 'villa-igiea',
  'marina portorosa': 'portorosa',
  'marina šangulin': 'marina-sangulin-biograd',
  'marina zenta': 'marina-zenta-split',
  'nikiana marina': 'lefkas-nikiana-marina',
  'aci marina dubrovnik': 'dubrovnik-komolac-aci-marina-dubrovnik',
  'marina paleros': 'paleros',
  'marina drage': 'drage',
  'ritter house marina': 'bvi-tortola-ritter-house-marina',
  "hodge's creek marina": 'bvi-hodge-s-creek-marina',
  "marina d'arechi": 'salerno-marina-d-arechi',
  'yacht club mai': 'fethiye-yacht-club-mai',
  'yes marina': 'fethiye-yes-marina',
  "marina cala de' medici": 'cala-de-medici',
  'marina kos': 'kos',
  'port pin rolland': 'cote-d-azur-port-pin-rolland',
  'aci marina pomer': ['pula-aci-marina-pomer', 'pomer'],
  'marina hramina': 'marina-hramina-murter',
  'marina betina': ['marina-betina-murter', 'betina'],
  'marina zaton': 'sibenik-marina-zaton',
  'eden island marina': 'seychelles-eden-island-marina',
  'marina delta kallithea': 'athens-marina-delta-kallithea',
  'mci marine club international': 'split-mci-marine-club-international',
  'marina kaštela': 'kastela',
  'rhodes new marina': 'rhodes',
  "capo d'orlando marina": 'capo-d-orlando',
  'marina medulin': 'medulin',
  'marina novi': 'novi',
  'ornos bay': 'ornos',
  'nydri port': 'nydri',
  'piso livadi port': ['piso-livadi-port-paros', 'piso-livadi'],
  'tourlos marina': 'tourlos',
  'puerto deportivo radazul': 'radazul',
  'les marines de cogolin': 'cogolin',
  'port grimaud': 'grimaud',
  'porto di tropea': 'tropea',
  'porto di castellammare del golfo': 'castellammare-del-golfo',
  'porto di cecina': 'cecina',
  'marina palamós': 'palamos',
  'marina di procida': 'di-procida',
  'marina lošinj': 'mali-losinj',
  'marina funtana': 'funtana',
  'marina vrsar': 'vrsar',
  'aci marina jezera': 'jezera',
  'real club nautico de vigo': 'vigo',
  'marina di cagliari': 'marina-cagliari',
  'marina solila': 'tivat-marina-solila',
  'sami port': 'sami',
  'vlichada port': 'vlichada',
  'port of aegina': 'aegina',
  'loutraki harbour': 'loutraki',
  'puerto de andratx': 'andratx',
  'marina el portet': 'el-portet',
  'vliho yacht club': 'vliho',
  'mandraki port': 'rhodes-mandraki-port',
  'lygia marina': 'lefkas-lygia-marina',
  'cleopatra marina': 'preveza-cleopatra-marina',
  'marina palma cuarentena': 'palma-de-mallorca-marina-cuarentena',
  'marseille old port': 'marseille',
  'platania marina': 'volos-platania',
  'lavrion main port': 'lavrion',
  'preveza main port': 'preveza',
};

const DESTINATION_ALIAS = new Map<string, string[]>(
  Object.entries(DESTINATION_ALIAS_SOURCE).map(([name, slugs]) => [
    normalizeDestinationName(name),
    Array.isArray(slugs) ? slugs : [slugs],
  ])
);

/** Corpus file-name prefixes that are not a place (never a landing). */
export const CORPUS_DEST_DENYLIST = new Set(['no-region']);

/**
 * File-name prefixes whose text a destination reads, in priority order: its
 * alias prefixes first, then its own slug.
 */
export const curatedDestSlugsFor = (destination: string): string[] => {
  const own = slugifyDestination(destination);
  const aliased = DESTINATION_ALIAS.get(normalizeDestinationName(destination)) ?? [];

  return Array.from(new Set([...aliased, own].filter(d => !!d && !CORPUS_DEST_DENYLIST.has(d))));
};

/** Catalogue names (normalised alias keys) that borrow `destSlug` through the alias map. */
export const aliasNamesForDestSlug = (destSlug: string): string[] =>
  Array.from(DESTINATION_ALIAS.entries())
    .filter(([, slugs]) => slugs.includes(destSlug))
    .map(([name]) => name);

const vesselSlugFor = (boatType: VesselType): string | undefined =>
  // Own-key lookup: `boatTypes=constructor` must not pick up Object.prototype.
  Object.prototype.hasOwnProperty.call(VESSEL_SLUG, boatType) ? VESSEL_SLUG[boatType] : undefined;

/**
 * Candidate slugs for a (destination × boat type) query, in priority order.
 * The corpus uses four file-naming patterns:
 *   (a) `{area}-{boattype}-charter`                 (country/region/city + boat)
 *   (b) `{boattype}-charter-{marina}`               (marina + boat)
 *   (c) `{area}-sailing-area-yacht-charter-and-boat-rental` (region overview)
 *   (d) `{area}-yacht-charter-and-boat-rental`      (country overview)
 *
 * Most specific (boat-type-bearing) patterns first, broader overviews after;
 * within a pattern the alias prefixes before the own slug. The first
 * existing file wins.
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
  const dests = curatedDestSlugsFor(destination);

  if (!dests.length) return [];

  const candidates: string[] = [];
  const bt = boatType ? vesselSlugFor(boatType) : undefined;

  if (bt) {
    dests.forEach(dest => {
      candidates.push(`${dest}-${bt}-charter`); // (a) area-boat
      candidates.push(`${bt}-charter-${dest}`); // (b) boat-marina
    });
  }

  if (typeSpecificOnly && boatType) return candidates;

  dests.forEach(dest => {
    candidates.push(`${dest}-sailing-area-yacht-charter-and-boat-rental`); // (c) region overview
    candidates.push(`${dest}-yacht-charter-and-boat-rental`); // (d) country/city overview
  });

  return candidates;
};

export interface CuratedFileKey {
  /** File-name prefix naming the place ("split-region", "marina-punat-krk"). */
  dest: string;
  /** Boat type of a type page; null for an overview. */
  boatType: VesselType | null;
}

const VESSEL_BY_SLUG = new Map<string, VesselType>(
  (Object.entries(VESSEL_SLUG) as Array<[VesselType, string]>).map(([type, slug]) => [slug, type])
);
// Longest first, so "power-catamaran" is not read as "catamaran" and
// "luxury-motor-yacht" not as "motor-yacht".
const VESSEL_SLUGS_BY_LENGTH = Array.from(VESSEL_BY_SLUG.keys()).sort((a, b) => b.length - a.length);

/**
 * Inverse of resolveCuratedSlugCandidates: which place (and boat type) a
 * corpus file is about, from its name. null for a name that follows none of
 * the four patterns.
 */
export const parseCuratedFileSlug = (slug: string): CuratedFileKey | null => {
  const overview = /^(.+?)-(?:sailing-area-)?yacht-charter-and-boat-rental$/.exec(slug);

  if (overview) return { dest: overview[1], boatType: null };

  const type = VESSEL_SLUGS_BY_LENGTH.find(bt => slug.startsWith(`${bt}-charter-`) || slug.endsWith(`-${bt}-charter`));

  if (!type) return null;

  const dest = slug.startsWith(`${type}-charter-`)
    ? slug.slice(`${type}-charter-`.length)
    : slug.slice(0, -`-${type}-charter`.length);

  return dest ? { dest, boatType: VESSEL_BY_SLUG.get(type) ?? null } : null;
};

/**
 * Strip everything outside `<body>...</body>`, then remove the first `<h1>`
 * (the search page renders its own H1 above the SEO block). A file cut off
 * before `</body>` still drops its `<head>` (title/meta must not render).
 */
export const sanitizeCuratedHtml = (raw: string): string => {
  const bodyMatch = raw.match(/<body[^>]*>([\s\S]*?)(?:<\/body>|$)/i);
  let html = bodyMatch ? bodyMatch[1] : raw;

  // Drop the first H1 — duplicates the page title already rendered above.
  html = html.replace(/<h1\b[^>]*>[\s\S]*?<\/h1>/i, '');

  return html.trim();
};
