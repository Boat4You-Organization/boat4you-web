import { BRAND_SUFFIX_LENGTH, cutAtWord } from '@/utils/static/metaLength';
import { nameRepeatsModel } from '@/utils/static/toTitleCase';

/**
 * <title> of a boat page within 60 characters (audit 26.9.2026, B42: 1,348
 * of 1,798 boat titles were over 70, the longest, 156, carrying the
 * partner's equipment list — "Libertà - Luxury Catamaran, A/c, Generator,
 * Water Maker, Solar Panel"; audit 15.11.2026, S4: 44 % still over 60, which
 * Google cuts on mobile). The H1 keeps the full partner name.
 *
 *   "{model} {name} ({year}) — {tail}" + " | Boat4You" when it fits;
 *   else without the brand suffix; else without the year; else the name cut
 *   at a word boundary; else the model and the place without the name; else
 *   cut at a word boundary. The place (tail) goes last.
 *
 * The name follows the model without quotes (7.10.2026): "Lagoon 42
 * Masterpiece", the words people search for, not "Lagoon 42 'Masterpiece'".
 */

// A dash-separated tail that is an equipment / refit note, not part of the name.
const NOTE_WORDS =
  /\b(?:a\/?c|air[\s-]?cond\w*|generator|water\s?maker|watermaker|solar|refit\w*|new|engine|sails?|wi-?fi|luxury|premium|crewed|skipper|thruster|inverter|heating|equipped|catamaran|yacht)\b/i;

/** The boat's own name, without partner notes in brackets or after a dash. */
export const titleBoatName = (name: string): string => {
  let short = name
    .replace(/\s*\([^)]*\)\s*/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
  const dash = /^(.+?)\s+[-–—]\s+(.+)$/.exec(short);

  if (dash && (dash[2].includes(',') || NOTE_WORDS.test(dash[2]))) short = dash[1].trim();

  const comma = short.indexOf(',');

  if (comma > 1) short = short.slice(0, comma).trim();

  return short || name.trim();
};

/**
 * The town of a base for the title tail: the part after " | " ("Marina di
 * Stabia | Castellammare di Stabia" → "Castellammare di Stabia"), else the
 * part before the first comma ("Lefkas, D-Marin" → "Lefkas").
 */
export const titlePlace = (locationName?: string | null): string => {
  const raw = (locationName ?? '').trim();

  if (!raw) return '';

  if (raw.includes('|')) {
    const parts = raw
      .split('|')
      .map(p => p.trim())
      .filter(Boolean);

    return parts[parts.length - 1] ?? '';
  }

  return raw.split(',')[0].trim();
};

/** Longest boat page <title>, the " | Boat4You" suffix included when it is shown. */
export const BOAT_TITLE_MAX = 60;

export interface BoatTitle {
  title: string;
  /** Serve without the " | Boat4You" template suffix. */
  absolute: boolean;
}

const squash = (value: string): string => value.replace(/\s+/g, ' ').trim();

// " bavaria cruiser 34 " — lower case, punctuation as spaces, padded, for a
// whole-word match.
const wordsOf = (value: string): string =>
  ` ${value
    .toLowerCase()
    .replace(/[^\p{L}\p{N}]+/gu, ' ')
    .trim()} `;

// "Bavaria Cruiser 40 'Bavaria Cruiser 40'", "MS Custom Aurum Sky 'M/S Aurum Sky'" — a name
// that repeats the model says nothing. Whole words only: "Aria" inside "Bavaria" or "Essi"
// inside "Impression" is the boat's own name and stays (live check 8.10.2026).
const addsToModel = (cleanModel: string, cleanName: string): boolean =>
  !!cleanName && !wordsOf(cleanModel).includes(wordsOf(cleanName)) && !nameRepeatsModel(cleanModel, cleanName);

/**
 * The boat as the title names it, for the other SEO strings of the page (the
 * meta / og / twitter description): "{model} {name} ({year})", no quotes,
 * the name left out when it only repeats the model. "Charter the Lagoon 42
 * Masterpiece (2018) from …" — the description used to read "Lagoon 42
 * 'Masterpiece' (2018)" after the title had dropped the quotes (live check
 * 7.10.2026).
 */
export const boatSeoName = ({ model, name, year }: { model: string; name: string; year?: number | null }): string => {
  const cleanModel = squash(model);
  const cleanName = squash(name);
  const label = addsToModel(cleanModel, cleanName) ? [cleanModel, cleanName].filter(Boolean).join(' ') : cleanModel;

  return `${label}${year ? ` (${year})` : ''}`;
};

export const buildBoatTitle = ({
  model,
  name,
  year,
  tail,
}: {
  model: string;
  name: string;
  year?: number | null;
  tail: string;
}): BoatTitle => {
  const cleanModel = squash(model);
  const cleanName = squash(name);
  const hasName = addsToModel(cleanModel, cleanName);
  const namePart = hasName ? ` ${cleanName}` : '';
  const yearPart = year ? ` (${year})` : '';
  const withTail = (head: string) => (tail ? `${head} — ${tail}` : head);
  const full = withTail(`${cleanModel}${namePart}${yearPart}`);
  // A name that already carries the house brand ("Boat4You 424/4/4 Premium", V9_87) gets no " | Boat4You" suffix.
  const brandInName = hasName && /\bboat4you\b/iu.test(cleanName);

  if (!brandInName && full.length + BRAND_SUFFIX_LENGTH <= BOAT_TITLE_MAX) return { title: full, absolute: false };

  if (full.length <= BOAT_TITLE_MAX) return { title: full, absolute: true };

  const noYear = withTail(`${cleanModel}${namePart}`);

  if (noYear.length <= BOAT_TITLE_MAX) return { title: noYear, absolute: true };

  const room = BOAT_TITLE_MAX - withTail(`${cleanModel} `).length;

  if (hasName && room >= 8) return { title: withTail(`${cleanModel} ${cutAtWord(cleanName, room)}`), absolute: true };

  const modelOnly = withTail(cleanModel);

  if (hasName && modelOnly.length <= BOAT_TITLE_MAX) return { title: modelOnly, absolute: true };

  return { title: cutAtWord(noYear, BOAT_TITLE_MAX), absolute: true };
};
