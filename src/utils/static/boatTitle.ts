import { TITLE_MAX, cutAtWord, fitsWithBrandSuffix } from '@/utils/static/metaLength';

/**
 * <title> of a boat page within the 70-character SERP window (audit
 * 26.9.2026, B42: 1,348 of 1,798 boat titles were longer; the longest, 156,
 * carried the partner's equipment list — "Libertà - Luxury Catamaran, A/c,
 * Generator, Water Maker, Solar Panel"). The H1 keeps the full partner name.
 *
 *   "{model} '{name}' ({year}) — {tail}" + " | Boat4You" when it fits;
 *   else without the brand suffix; else without the year; else the name cut
 *   at a word boundary.
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

export interface BoatTitle {
  title: string;
  /** Serve without the " | Boat4You" template suffix. */
  absolute: boolean;
}

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
  const cleanModel = model.replace(/\s+/g, ' ').trim();
  const cleanName = name.replace(/\s+/g, ' ').trim();
  // "Bavaria Cruiser 40 'Bavaria Cruiser 40'" — a name that repeats the model says nothing.
  const hasName = !!cleanName && !cleanModel.toLowerCase().includes(cleanName.toLowerCase());
  const quoted = hasName ? ` '${cleanName}'` : '';
  const yearPart = year ? ` (${year})` : '';
  const withTail = (head: string) => (tail ? `${head} — ${tail}` : head);
  const full = withTail(`${cleanModel}${quoted}${yearPart}`);

  if (fitsWithBrandSuffix(full)) return { title: full, absolute: false };

  if (full.length <= TITLE_MAX) return { title: full, absolute: true };

  const noYear = withTail(`${cleanModel}${quoted}`);

  if (noYear.length <= TITLE_MAX) return { title: noYear, absolute: true };

  const room = TITLE_MAX - withTail(`${cleanModel} ''`).length;

  if (hasName && room >= 8) return { title: withTail(`${cleanModel} '${cutAtWord(cleanName, room)}'`), absolute: true };

  return { title: cutAtWord(noYear, TITLE_MAX), absolute: true };
};
