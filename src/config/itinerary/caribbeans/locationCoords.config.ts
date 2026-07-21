/**
 * Canonical lat/lon for every Caribbean sailing destination referenced
 * by route configs. The lookup function below normalises route-day
 * labels and returns the matching coords — or null when no anchor
 * fits, in which case the Leaflet map silently skips the pin.
 *
 * Source: OpenStreetMap canonical place coordinates, cross-referenced
 * with NGA charts (BVI), Bahamas Hydrographic Office (Abaco/Exumas),
 * SHOM (French Antilles) and Eastern Caribbean Hydrographic charts
 * (Grenadines). Good enough for the route map (zoom level ~9-11);
 * not survey-grade.
 *
 * To add a new destination:
 *   1. Add an entry to LOCATION_COORDS keyed on lower-case ASCII base
 *      name (no accents, no parentheticals, no Bay/Town/Island/Marina
 *      suffix).
 *   2. If the route config uses an alias (e.g. "Sint Maarten" →
 *      "Philipsburg"), add it to ALIAS_MAP.
 */

export interface LatLng {
  lat: number;
  lng: number;
}

const LOCATION_COORDS: Record<string, LatLng> = {
  // ───────── British Virgin Islands ─────────
  tortola: { lat: 18.4207, lng: -64.6399 },
  'the baths': { lat: 18.4287, lng: -64.4453 },
  'spanish town': { lat: 18.4478, lng: -64.4304 },
  'north sound': { lat: 18.4989, lng: -64.3712 },
  'leverick bay': { lat: 18.4972, lng: -64.3853 },
  anegada: { lat: 18.727, lng: -64.3944 },
  'rodney bay': { lat: 14.0755, lng: -60.9498 },
  'marigot bay': { lat: 13.9662, lng: -61.0249 }, // St. Lucia — NE St-Martin Marigot
  soufriere: { lat: 13.856, lng: -61.0573 },
  'pigeon island': { lat: 14.0922, lng: -60.9682 },
  grenada: { lat: 12.1165, lng: -61.679 },
  'cane garden bay': { lat: 18.4274, lng: -64.6628 },
  'jost van dyke': { lat: 18.4486, lng: -64.7508 },
  'norman island': { lat: 18.3247, lng: -64.6175 },
  'peter island': { lat: 18.3672, lng: -64.5775 },
  'cooper island': { lat: 18.3833, lng: -64.5333 },
  'scrub island': { lat: 18.4869, lng: -64.5347 },
  'virgin gorda': { lat: 18.4419, lng: -64.4406 },

  // ───────── Bahamas (Abacos) ─────────
  'marsh harbour': { lat: 26.5412, lng: -77.0636 },
  'hope town': { lat: 26.5363, lng: -76.9606 },
  'great guana cay': { lat: 26.6606, lng: -77.1253 },
  'green turtle cay': { lat: 26.7644, lng: -77.3372 },
  'man-o-war cay': { lat: 26.5908, lng: -77.0036 },
  nassau: { lat: 25.0443, lng: -77.3504 },

  // ───────── Sint Maarten / Saint Martin / St. Barths ─────────
  philipsburg: { lat: 18.0263, lng: -63.0458 },
  marigot: { lat: 18.0708, lng: -63.0867 },
  'anse marcel': { lat: 18.1147, lng: -63.0533 },
  'tintamarre island': { lat: 18.1228, lng: -62.9789 },
  gustavia: { lat: 17.8975, lng: -62.8511 },
  'st barthélemy': { lat: 17.8975, lng: -62.8511 },
  'st barthelemy': { lat: 17.8975, lng: -62.8511 },
  'île fourchue': { lat: 17.9572, lng: -62.8911 },
  'ile fourchue': { lat: 17.9572, lng: -62.8911 },

  // ───────── Martinique ─────────
  'le marin': { lat: 14.4736, lng: -60.8703 },
  'saint-anne': { lat: 14.4406, lng: -60.8842 },
  'sainte-anne': { lat: 14.4406, lng: -60.8842 },
  "grande anse d'arlet": { lat: 14.4936, lng: -61.0856 },
  'grande anse darlet': { lat: 14.4936, lng: -61.0856 },
  "anse d'arlet": { lat: 14.4936, lng: -61.0856 },
  "anses d'arlet": { lat: 14.4936, lng: -61.0856 },
  'saint-pierre': { lat: 14.7383, lng: -61.1747 },
  'anse couleuvre': { lat: 14.8447, lng: -61.2231 },
  'anse dufour': { lat: 14.5306, lng: -61.0853 },

  // ───────── Grenada / Carriacou / Tobago Cays ─────────
  "st. george's": { lat: 12.0561, lng: -61.7488 },
  'st. georges': { lat: 12.0561, lng: -61.7488 },
  "saint george's": { lat: 12.0561, lng: -61.7488 },
  'port louis marina': { lat: 12.05, lng: -61.7567 },
  'dragon bay': { lat: 12.0792, lng: -61.7533 },
  'tyrrel bay': { lat: 12.4561, lng: -61.4828 },
  'tyrell bay': { lat: 12.4561, lng: -61.4828 },
  carriacou: { lat: 12.4583, lng: -61.45 },
  'sandy island': { lat: 12.4933, lng: -61.4942 },
  'tobago cays': { lat: 12.6333, lng: -61.35 },
  'salt whistle bay': { lat: 12.6447, lng: -61.4014 },
  mayreau: { lat: 12.6383, lng: -61.3947 },
};

/** Aliases — labels that should map to a different canonical key. */
const ALIAS_MAP: Record<string, string> = {
  'st barths': 'gustavia',
  'st-barths': 'gustavia',
  'saint barthelemy': 'gustavia',
  'sint maarten': 'philipsburg',
  'sint maarten dutch side': 'philipsburg',
  'saint martin french side': 'marigot',
  'st martin': 'marigot',
  // Country-name fallbacks so `${spot}, Grenada` style labels resolve
  // even after the comma split — Grenada → St. George's, Bahamas → Nassau.
  grenada: "st. george's",
  bahamas: 'nassau',
  'st vincent': 'mayreau',
  'saint vincent': 'mayreau',
};

/** Strip diacritics (à→a, è→e, ò→o, …), normalise typographic quotes, and lowercase. */
function normaliseDiacritics(s: string): string {
  return (
    s
      .toLowerCase()
      .replace(/\u2019/g, "'")
      .normalize('NFD')
      .replace(/[̀-ͯ]/g, '')
      // Normalise curly/typographic quotes to ASCII so route-config labels
      // like `Grande Anse d’Arlet` and `St. George’s` match keys written
      // with the straight `'`.
      .replace(/[‘’ʼ]/g, "'")
      .replace(/[“”]/g, '"')
  );
}

function stripParentheses(s: string): string {
  return s.replace(/\s*\(.*?\)\s*/g, ' ').trim();
}

function stripSuffixes(s: string): string {
  return s
    .replace(/\b(bay|town|island|harbour|harbor|marina|peninsula|nature park|national park|cay|cove|reef)\b/gi, '')
    .replace(/\s+/g, ' ')
    .trim();
}

/**
 * Resolve any route-day label to its canonical lat/lon. Tries a series
 * of progressively looser matches: exact key → alias → strip parens →
 * strip suffixes → comma split → first word. Returns null when nothing
 * fits, leaving the map to render the route without that pin.
 */
export function resolveLocationCoords(label: string): LatLng | null {
  if (!label) return null;

  const tryLookup = (key: string): LatLng | null => {
    const normalised = normaliseDiacritics(key).trim();

    if (LOCATION_COORDS[normalised]) return LOCATION_COORDS[normalised];

    const aliased = ALIAS_MAP[normalised];

    if (aliased && LOCATION_COORDS[aliased]) return LOCATION_COORDS[aliased];

    return null;
  };

  let hit = tryLookup(label);

  if (hit) return hit;

  const noParens = stripParentheses(label);

  if (noParens !== label) {
    hit = tryLookup(noParens);

    if (hit) return hit;

    const insideMatch = label.match(/\(([^)]+)\)/);

    if (insideMatch) {
      hit = tryLookup(insideMatch[1]);

      if (hit) return hit;
    }
  }

  // Comma split BEFORE stripping suffixes — `Dragon Bay, Grenada` should
  // try `Dragon Bay` (which is a key) before suffix-stripping reduces it
  // to a bare `Dragon` (no match). Also stops `Tyrell Bay, Carriacou`
  // from collapsing into the wrong island.
  if (noParens.includes(',')) {
    // eslint-disable-next-line no-restricted-syntax
    for (const part of noParens
      .split(',')
      .map(s => s.trim())
      .filter(Boolean)) {
      hit = tryLookup(part);

      if (hit) return hit;

      const partNoSuffix = stripSuffixes(part);

      if (partNoSuffix !== part) {
        hit = tryLookup(partNoSuffix);

        if (hit) return hit;
      }
    }
  }

  const noSuffix = stripSuffixes(noParens);

  if (noSuffix !== noParens) {
    hit = tryLookup(noSuffix);

    if (hit) return hit;
  }

  const firstWord = noSuffix.split(/[\s,]+/)[0];

  if (firstWord) {
    hit = tryLookup(firstWord);

    if (hit) return hit;
  }

  return null;
}
