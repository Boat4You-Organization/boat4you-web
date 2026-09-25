/**
 * Pure (no fetch) identity rules for the /yachts model pages.
 *
 * MMK and NauSys describe the same boat model under different catalogue
 * rows: "Dufour 460 GL" / "Dufour 460 Grand Large", "Bavaria Cruiser 46" /
 * "Bavaria 46 Cruiser", "Elba 45" / "Fountaine Pajot Elba 45", "Lagoon 52F" /
 * "Lagoon 52 F", "Bali 4.8" / "Bali 4.8 " — and makers as "Lagoon" /
 * "Lagoon-Bénéteau". Without folding them, one model would be split over
 * several thin pages (Sailogy's "Gulet by Gulet" problem). Every name is
 * reduced to a stable key `<brand>|<model core>`, the same way for the
 * catalogue rows (modelCatalog.ts) and for a single boat's detail payload
 * (the boat page's "All {model} boats" link), so both land on one URL.
 *
 * The URL slug is built from the KEY, not from the most common display
 * spelling, so a shift in which provider spelling has more boats never moves
 * the page to a new URL.
 */

/** Manufacturer rows that are one brand (same idea as the admin's
 *  MANUFACTURER_ALIASES in boat4you-admin src/views/Offers/filters.tsx). */
const MANUFACTURER_ALIASES: { canonical: string; matches: RegExp }[] = [
  { canonical: 'Lagoon', matches: /^lagoon/i },
  { canonical: 'Bali', matches: /^(bali|catana)/i },
  { canonical: 'Beneteau', matches: /^b[eé]n[eé]teau/i },
  { canonical: 'Fountaine Pajot', matches: /^fountaine[\s-]*pajot/i },
];

/** Makers that name no model family: placeholders, a vessel type
 *  ("Motor Sailer") and charter operators whose rows rename other yards'
 *  boats ("Sunsail 454", "Moorings 4500" are Leopard builds). Folded form. */
const EXCLUDED_MANUFACTURERS = new Set([
  'unknown',
  'custom made',
  'custom',
  'other',
  'motor sailer',
  'sunsail',
  'the moorings',
  'moorings',
  'more charter d o o',
]);

/** A model core made only of these words is a vessel type ("Gulet",
 *  "Motor Yacht", "Catamaran"), not a model — no page for it. */
const GENERIC_CORE_WORDS = new Set([
  'gulet',
  'gullet',
  'caique',
  'catamaran',
  'trimaran',
  'motor',
  'motorboat',
  'motoryacht',
  'sailer',
  'sailing',
  'sail',
  'sailboat',
  'yacht',
  'yachts',
  'boat',
  'boats',
  'schooner',
  'trawler',
  'rib',
  'houseboat',
  'power',
  'luxury',
  'deluxe',
  'classic',
  'traditional',
]);

const isGenericCore = (core: string): boolean => core.split(' ').every(word => GENERIC_CORE_WORDS.has(word));

/** Spellings of one model the general rules below cannot fold safely
 *  (`<brand key>|<core>` → core). "Lagoon 450 Sport" is the 450 S
 *  (Sportop); the bare "Lagoon 450" row is NOT folded into 450 F — most of
 *  its boats were built after the 2016 F / S split, so it can be either. */
const MODEL_CORE_ALIASES: Record<string, string> = {
  'lagoon|450 sport': '450s',
  'lagoon|450 sportop': '450s',
};

/** "Dufour Yachts" → "Dufour", "Bavaria Yachtbau" → "Bavaria"; a remainder
 *  shorter than 3 letters keeps the suffix ("Le Boat", "AD Boats"). */
const BRAND_SUFFIX = /\s+(yachtbau|yachts|yacht|catamarans|catamaran|marine|boats|boat)$/i;

/** Lowercase, no diacritics, `&` → and, punctuation → single spaces. */
export const foldName = (value?: string | null): string =>
  (value ?? '')
    .toLowerCase()
    .replace(/đ/g, 'd')
    .replace(/ł/g, 'l')
    .normalize('NFD')
    .replace(/\p{M}/gu, '')
    .replace(/&/g, ' and ')
    .replace(/[^a-z0-9]+/g, ' ')
    .trim();

export const slugifyName = (value: string): string => foldName(value).replace(/\s+/g, '-');

/** Display brand for a raw manufacturer name, or null for placeholders. */
export const canonicalManufacturer = (raw?: string | null): string | null => {
  const name = (raw ?? '').replace(/\s+/g, ' ').trim();

  if (!name || EXCLUDED_MANUFACTURERS.has(foldName(name))) return null;

  const alias = MANUFACTURER_ALIASES.find(a => a.matches.test(name));

  if (alias) return alias.canonical;

  const stripped = name.replace(BRAND_SUFFIX, '').trim();

  return stripped.length >= 3 ? stripped : name;
};

/** Partner model names sometimes carry a cabin layout ("Oceanis 46.1 - 4 cab."). */
export const cleanModelName = (raw?: string | null): string =>
  (raw ?? '')
    .replace(/\s*[-,|]?\s*\d+\s*\+\s*\d+\s*cab\.?$/i, '')
    .replace(/\s*[-,|]?\s*\d+\s*cab\.?$/i, '')
    .replace(/\s+/g, ' ')
    .trim();

const stripPrefix = (key: string, prefix: string): string =>
  prefix && key.startsWith(`${prefix} `) ? key.slice(prefix.length + 1) : key;

/**
 * Model core without the maker, in folded form:
 *   "Dufour 460 Grand Large" (Dufour Yachts) → "460 gl"
 *   "Bavaria 46 Cruiser" (Bavaria Yachtbau)  → "cruiser 46"
 *   "Lagoon 450 Fly" / "Lagoon 450 F"         → "450f"
 */
export const modelCore = (rawManufacturer: string | null | undefined, brand: string, rawModel: string): string => {
  let key = foldName(cleanModelName(rawModel));

  // Drop the maker in front: the display brand, the full catalogue name
  // ("fountaine pajot", "bavaria yachtbau"), and then the brand again for
  // names like "Bavaria Yachtbau Bavaria C42".
  [foldName(rawManufacturer), foldName(brand)].forEach(prefix => {
    key = stripPrefix(key, prefix);
  });
  key = stripPrefix(key, foldName(brand));

  key = key
    .replace(/\bgrand large\b/g, 'gl')
    .replace(/(\d) fly\b/g, '$1 f')
    // "52 f" → "52f", "450 f" → "450f", "40 s2" → "40s2" (suffix glued to the size)
    .replace(/(\d) ([a-z]\d?)\b/g, '$1$2')
    // "46 cruiser" → "cruiser 46" (Bavaria lists both orders)
    .replace(/^(\d+) cruiser\b/, 'cruiser $1')
    .trim();

  return key;
};

export interface ModelIdentity {
  /** `<brand key>|<model core>` — the grouping key. */
  key: string;
  brand: string;
  brandSlug: string;
  modelSlug: string;
}

/** Identity of one (manufacturer, model) pair, or null when it names no model family. */
export const modelIdentity = (rawManufacturer?: string | null, rawModel?: string | null): ModelIdentity | null => {
  const brand = canonicalManufacturer(rawManufacturer);

  if (!brand || !rawModel?.trim()) return null;

  const brandKey = foldName(brand);
  const rawCore = modelCore(rawManufacturer, brand, rawModel);
  const core = MODEL_CORE_ALIASES[`${brandKey}|${rawCore}`] ?? rawCore;

  if (!core || isGenericCore(core)) return null;

  const brandSlug = slugifyName(brand);

  return {
    key: `${brandKey}|${core}`,
    brand,
    brandSlug,
    modelSlug: slugifyName(`${brandKey} ${core}`),
  };
};

/**
 * Display name: the provider spelling, prefixed with the brand unless it
 * already starts with it ("Lagoon 42", "Beneteau Oceanis 46.1",
 * "Fountaine Pajot Elba 45").
 */
export const modelDisplayName = (brand: string, rawModel: string): string => {
  const model = cleanModelName(rawModel);

  return foldName(model).startsWith(`${foldName(brand)} `) || foldName(model) === foldName(brand)
    ? model
    : `${brand} ${model}`;
};

export const yachtsIndexPath = (): string => '/yachts';

export const manufacturerPath = (brandSlug: string): string => `/yachts/${brandSlug}`;

export const modelPagePath = (brandSlug: string, modelSlug: string): string => `/yachts/${brandSlug}/${modelSlug}`;

/** Route segment guard: only slugs this module can produce reach the catalogue. */
export const isModelSlug = (value: string): boolean => /^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(value) && value.length <= 80;
