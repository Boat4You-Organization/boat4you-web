// Partner agencies feed yacht names in whatever case they happened to type
// them into their own admin UI — "FIND US", "find us", "Fortuna", "rara AVIS".
// Normalize at every display point so the same boat reads consistently across
// listing, hero, reservation and PDF surfaces. Keep existing hyphens, Roman
// numerals ("II", "III") and embedded digits intact; just fold each word to
// initial-cap + lower.
//
// Edge cases:
//  - Null/undefined input → pass through (caller handles fallback).
//  - Roman numeral suffix ("II", "III", "IV", "XL") → stays upper so
//    "Find Us Ii" doesn't happen.
//  - Tokens that are entirely digits / entirely punctuation → left alone.
//  - Stray whitespace is dropped: partner names arrive as " Sunny", "BARNEY "
//    or "FILIPPOS I  Boat location…" (342 of 12,100 boats, 24.9.2026), which
//    the boat page's quoted title rendered as "' Sunny'" / "'Barney '".
//    Leading/trailing space is trimmed and inner runs collapse to one space.
// A real Roman numeral ("II", "IV", "XIX"), not merely a word spelt with the
// letters M/D/C/L/X/V/I — "LILI" or "MIMI" must become "Lili" / "Mimi".
const ROMAN_NUMERAL_RE = /^M{0,3}(?:CM|CD|D?C{0,3})(?:XC|XL|L?X{0,3})(?:IX|IV|V?I{0,3})$/;
// Single-letter elision keeps the next word capitalised: "L'AVVENTURA" →
// "L'Avventura", "O'NEILL" → "O'Neill" (while "OCEAN'S" → "Ocean's").
const ELISION_RE = /^([A-Za-zÀ-ž])(['’])([A-Za-zÀ-ž].*)$/;
// Vessel-type abbreviations stay in capitals: "M/S", "S/Y", "M/Y" anywhere
// (the card read "M/s Aurum Sky"), and a leading "MS", "MY", "SY", "MSY",
// "MV", "SV" that the partner typed in capitals in an otherwise mixed-case
// name ("MY Custom Anthea", not "My Custom Anthea"); an all-caps "MY WAY"
// still reads "My Way".
const SLASH_ABBREVIATION_RE = /^[A-Za-z]\/[A-Za-z]\.?$/;
const VESSEL_PREFIXES = new Set(['MS', 'MY', 'SY', 'MSY', 'MV', 'SV']);

export const toTitleCase = (value: string | null | undefined): string => {
  if (value == null) return '';

  const trimmed = value.trim();
  const allCaps = trimmed === trimmed.toUpperCase();

  return trimmed
    .split(/(\s+)/)
    .map((part, index, parts) => {
      if (/^\s+$/.test(part)) return ' ';

      if (part.length === 0) return part;

      if (SLASH_ABBREVIATION_RE.test(part)) return part.toUpperCase();

      if (index === 0 && parts.length > 1 && !allCaps && VESSEL_PREFIXES.has(part)) return part;

      const elision = ELISION_RE.exec(part);

      if (elision) {
        const [, initial, apostrophe, rest] = elision;

        return `${initial.toUpperCase()}${apostrophe}${rest.charAt(0).toUpperCase()}${rest.slice(1).toLowerCase()}`;
      }

      const upper = part.toUpperCase();

      if (ROMAN_NUMERAL_RE.test(upper) && upper.length >= 2) return upper;

      return part.charAt(0).toUpperCase() + part.slice(1).toLowerCase();
    })
    .join('');
};

// Name comparison form: lowercase, no accents, punctuation → spaces, and no
// vessel-type prefix ("M/S", "MS", "M/Y", "MY", "S/Y", "SY", "MSY", "M/V",
// "MV", "S/V", "SV").
const VESSEL_PREFIX_FOLDED = /^(?:m s|m y|s y|m v|s v|msy|ms|my|sy|mv|sv)\s+/;

const nameCore = (value: string | null | undefined): string =>
  (value ?? '')
    .toLowerCase()
    .normalize('NFD')
    .replace(/\p{M}/gu, '')
    .replace(/[^\p{L}\p{N}]+/gu, ' ')
    .trim()
    .replace(VESSEL_PREFIX_FOLDED, '');

/**
 * True when the boat's name adds nothing to its model: the same words, or
 * the model's last words — case, punctuation and a vessel-type prefix
 * ignored. Gulets and custom builds carry the name in the model: "Acapella" /
 * "Acapella", "MY Custom Anthea" / "Anthea", "MS Custom Aurum Sky" / "M/S
 * Aurum Sky" read "MY Custom Anthea | Anthea" on cards, the H1, the
 * breadcrumb and the JSON-LD (SEO regression 29.9.2026). "Lagoon 42" / "My
 * Lagoon" keeps its name.
 */
export const nameRepeatsModel = (model: string | null | undefined, name: string | null | undefined): boolean => {
  const modelCore = nameCore(model);
  const ownName = nameCore(name);

  return !!modelCore && !!ownName && (modelCore === ownName || modelCore.endsWith(` ${ownName}`));
};

/**
 * A yacht's label: "{model}{separator}{name}", the name left out when it
 * repeats the model ("MS Custom Aurum Sky", not "MS Custom Aurum Sky | M/S
 * Aurum Sky"). Callers pass both parts already formatted (title case,
 * cleaned model).
 */
export const yachtLabel = (
  model: string | null | undefined,
  name: string | null | undefined,
  separator = ' | '
): string => {
  const cleanModel = (model ?? '').trim();
  const cleanName = (name ?? '').trim();

  if (!cleanName || nameRepeatsModel(cleanModel, cleanName)) return cleanModel || cleanName;

  return cleanModel ? `${cleanModel}${separator}${cleanName}` : cleanName;
};
