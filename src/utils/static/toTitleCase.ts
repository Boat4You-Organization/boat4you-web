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

export const toTitleCase = (value: string | null | undefined): string => {
  if (value == null) return '';

  return value
    .trim()
    .split(/(\s+)/)
    .map(part => {
      if (/^\s+$/.test(part)) return ' ';

      if (part.length === 0) return part;

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
