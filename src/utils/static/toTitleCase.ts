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
const ROMAN_NUMERAL_RE = /^(?:[MDCLXVI]+)$/;

export const toTitleCase = (value: string | null | undefined): string => {
  if (value == null) return '';
  return value
    .split(/(\s+)/)
    .map(part => {
      if (/^\s+$/.test(part)) return part;
      if (part.length === 0) return part;
      const upper = part.toUpperCase();
      if (ROMAN_NUMERAL_RE.test(upper) && upper.length >= 2) return upper;
      return part.charAt(0).toUpperCase() + part.slice(1).toLowerCase();
    })
    .join('');
};
