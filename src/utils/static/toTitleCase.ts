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
//  - Words joined by "&", "/" or "-" without spaces are each capitalised:
//    "LADIES&GENTLEMEN" → "Ladies&Gentlemen" (it read "Ladies&gentlemen" on
//    the cards, live check 8.10.2026), "SUN/SEA" → "Sun/Sea", "SEA-BREEZE" →
//    "Sea-Breeze", "ALPHA-II" → "Alpha-II".
//  - Apostrophes and dots: see APOSTROPHES_RE and the "." joiner below.
// A real Roman numeral ("II", "IV", "XIX"), not merely a word spelt with the
// letters M/D/C/L/X/V/I — "LILI" or "MIMI" must become "Lili" / "Mimi".
const ROMAN_NUMERAL_RE = /^M{0,3}(?:CM|CD|D?C{0,3})(?:XC|XL|L?X{0,3})(?:IX|IV|V?I{0,3})$/;
// A word with an apostrophe is cased segment by segment (live check
// 9.10.2026: "I'm Alone" read "I'M Alone", "C's The Day" "C'S The Day",
// "Nauti T's" "Nauti T'S", "Plume d'Ange" "Plume D'Ange"):
//  - a contraction or plural stays lower after the apostrophe: "I'm", "C's",
//    "Nauti T's", "Let's", "I'll", "Seas’d", "Susano'o" (and "FOUR C'S"
//    reads "Four C's");
//  - a name the partner typed in mixed case keeps the partner's case of the
//    letter after the apostrophe: "C'est la vie" → "C'est La Vie", "P’tit Loup",
//    "Rev'Anou", "L'Albatros";
//  - in a name typed all in capitals (or all lower case) a one-letter
//    elision starts a new word, "L'AVVENTURA" → "L'Avventura", "O'NEILL" →
//    "O'Neill", and anything longer goes on, "OCEAN'S" → "Ocean's";
//  - the particle "d'" or "l'" the partner typed lower case inside a name
//    stays lower: "Plume d'Ange", "Valle d'Aosta", "Ti Tengo d'Okkio".
const APOSTROPHES_RE = /(['’]+)/;
const CONTRACTION_TAIL_RE = /^(?:\p{L}|ll|re|ve)$/iu;
const SINGLE_LETTER_RE = /^\p{L}$/u;
const PARTICLE_RE = /^[dl]$/;
// Vessel-type abbreviations stay in capitals: "M/S", "S/Y", "M/Y" anywhere
// (the card read "M/s Aurum Sky"), and a leading "MS", "MY", "SY", "MSY",
// "MV", "SV" that the partner typed in capitals in an otherwise mixed-case
// name ("MY Custom Anthea", not "My Custom Anthea"); an all-caps "MY WAY"
// still reads "My Way".
const SLASH_ABBREVIATION_RE = /^[A-Za-z]\/[A-Za-z]\.?$/;
const VESSEL_PREFIXES = new Set(['MS', 'MY', 'SY', 'MSY', 'MV', 'SV']);
// Joiners inside a word; the parts on either side are cased on their own. A
// dot joins too: "E.S." and "M.P. Prestige" stay in capitals (they read
// "E.s." and "M.p."), "GEN.+A.C." reads "Gen.+A.C."; after a dot a word the
// partner typed in mixed case keeps the partner's case of the next letter
// ("Kos 46.Cat", "Mr.Si", "Alfa.bm2").
const WORD_JOINER_RE = /([&/.-])/;
// "ex" before a boat's former name reads lower case inside a name, and a
// short former name the partner typed in capitals in an otherwise mixed-case
// name stays in capitals: "Concord's 6 ex.OMR Group" (it read "Ex.omr"),
// "Concord's 6 ex. OMR Group", "Rosalu ex Shakti", "Esko (ex Manca)".
const EX_MARKER_RE = /^\P{L}*ex\.?$/iu;
const EX_PREFIX_RE = /^(\P{L}*ex\.)(\p{L}.*)$/iu;
const ACRONYM_RE = /^\p{Lu}{2,4}\P{L}*$/u;
// Punctuation in front of a word ("(A/C", "\"SUNNY\"") is kept and the word
// after it is cased: "Daddy (A/C, Generator)", not "Daddy (a/C, Generator)".
const LEADING_PUNCTUATION_RE = /^[^\p{L}\p{N}]+/u;
// ...except the "'n'" of "Rock 'n' Roll" / "Jays 'n Seas", which stays lower.
const AND_CONTRACTION_RE = /^['’]n['’]?$/i;
// A number with a unit before "/": "160L" in "160L/h", "10kVA".
const NUMBER_WITH_UNIT_RE = /^\p{N}[\p{N}.,]*\p{L}+$/u;
// Inside a joined word only a numeral of I, V and X stays upper ("Alpha-II",
// "Ti-Bo III"): "DEUX-MI" and "MIX-UP" are words, not 1001 and 1009 — they
// read "Deux-Mi" and "Mix-Up" (boat 9300 "DEUX-MI", review 8.10.2026).
const JOINED_ROMAN_NUMERAL_RE = /^[IVX]+$/;

interface WordCase {
  /** A part of a word joined by "&", "/", "-" or ".". */
  joined: boolean;
  /** The name's first word (its first part): always starts with a capital. */
  first: boolean;
  /** The partner typed this word in mixed case, so its case is deliberate. */
  typedCase: boolean;
  /** Keep the case of the first letter as typed (a part after a dot). */
  keepInitial: boolean;
}

const initialOf = (segment: string, wordCase: WordCase): string =>
  wordCase.keepInitial ? segment.charAt(0) : segment.charAt(0).toUpperCase();

// A word with one or more apostrophes, segment by segment (APOSTROPHES_RE).
const caseApostropheWord = (word: string, wordCase: WordCase): string => {
  const segments = word.split(APOSTROPHES_RE);

  return segments
    .map((segment, at) => {
      if (at % 2 === 1 || segment.length === 0) return segment;

      const rest = segment.slice(1).toLowerCase();

      if (at === 0) {
        const tail = segments[2] ?? '';
        const particle =
          !wordCase.first && PARTICLE_RE.test(segment) && tail.length > 1 && !CONTRACTION_TAIL_RE.test(tail);

        return particle ? segment : initialOf(segment, wordCase) + rest;
      }

      if (CONTRACTION_TAIL_RE.test(segment)) return segment.toLowerCase();

      const initial = segment.charAt(0);

      if (wordCase.typedCase) return initial + rest;

      return (SINGLE_LETTER_RE.test(segments[at - 2]) ? initial.toUpperCase() : initial.toLowerCase()) + rest;
    })
    .join('');
};

// One word (or one part of a joined word): Roman numerals stay upper, a word
// with an apostrophe is cased segment by segment, the rest folds to
// initial-cap + lower.
const caseWord = (word: string, wordCase: WordCase): string => {
  if (word.length === 0) return word;

  if (AND_CONTRACTION_RE.test(word)) return word.toLowerCase();

  const lead = LEADING_PUNCTUATION_RE.exec(word)?.[0] ?? '';

  if (lead) return lead + caseWord(word.slice(lead.length), wordCase);

  if (APOSTROPHES_RE.test(word)) return caseApostropheWord(word, wordCase);

  const upper = word.toUpperCase();

  if (ROMAN_NUMERAL_RE.test(upper) && upper.length >= 2 && (!wordCase.joined || JOINED_ROMAN_NUMERAL_RE.test(upper))) {
    return upper;
  }

  return initialOf(word, wordCase) + word.slice(1).toLowerCase();
};

// One space-separated word: split at "&", "/", "-" and "." and cased part
// by part.
const caseJoinedWord = (word: string, first: boolean): string => {
  const pieces = word.split(WORD_JOINER_RE);
  const joined = pieces.length > 1;
  const typedCase = /\p{Lu}/u.test(word) && /\p{Ll}/u.test(word);

  return pieces
    .map((piece, at) => {
      if (WORD_JOINER_RE.test(piece)) return piece;

      // A unit after a number with a unit stays lower, like that unit:
      // "160L/h" reads "160l/h" as before, not "160l/H" ("3/AMIGOS"
      // still reads "3/Amigos").
      if (at >= 2 && pieces[at - 1] === '/' && NUMBER_WITH_UNIT_RE.test(pieces[at - 2])) {
        return piece.toLowerCase();
      }

      return caseWord(piece, {
        joined,
        first: first && at === 0,
        typedCase,
        keepInitial: typedCase && at >= 2 && pieces[at - 1] === '.',
      });
    })
    .join('');
};

export const toTitleCase = (value: string | null | undefined): string => {
  if (value == null) return '';

  const trimmed = value.trim();
  const allCaps = trimmed === trimmed.toUpperCase();
  const words = trimmed.split(/\s+/);

  return words
    .map((word, index) => {
      if (word.length === 0) return word;

      if (SLASH_ABBREVIATION_RE.test(word)) return word.toUpperCase();

      if (index === 0 && words.length > 1 && !allCaps && VESSEL_PREFIXES.has(word)) return word;

      if (index > 0 && EX_MARKER_RE.test(word)) return word.toLowerCase();

      if (index > 1 && !allCaps && EX_MARKER_RE.test(words[index - 1]) && ACRONYM_RE.test(word)) return word;

      const formerName = index > 0 ? EX_PREFIX_RE.exec(word) : null;

      if (formerName) {
        const [, marker, name] = formerName;

        return marker.toLowerCase() + (!allCaps && ACRONYM_RE.test(name) ? name : caseJoinedWord(name, false));
      }

      return caseJoinedWord(word, index === 0);
    })
    .join(' ');
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
