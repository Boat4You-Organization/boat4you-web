import { displayBaseName } from '@/utils/static/croatianPlaceNames';
import { BaseCount, Range } from '@/utils/static/modelFleetStats';

/** ISO code → key under home.destinationsSection.destinations (the 12 promoted countries). */
export const COUNTRY_LABEL_KEY: Record<string, string> = {
  BS: 'bahamas',
  ES: 'spain',
  FR: 'france',
  GD: 'grenada',
  GR: 'greece',
  HR: 'croatia',
  IT: 'italy',
  ME: 'montenegro',
  MQ: 'martinique',
  SC: 'seychelles',
  TR: 'türkiye',
  VG: 'virginIslandsBritish',
};

/**
 * "3–6", or "4" when both ends format to the same text — compared after
 * formatting, so 13.9–14 m does not become "46–46 ft".
 */
export const formatRange = (range: Range | null, format: (n: number) => string = String): string | null => {
  if (!range) return null;

  const min = format(range.min);
  const max = format(range.max);

  return min === max ? min : `${min}–${max}`;
};

export const M_PER_FT = 0.3048;

export interface WhereBase {
  name: string;
  count: number;
  href: string | null;
}

/**
 * A country's biggest bases in the "Where" table, named as the boat page names
 * them ("Alimos Marina, Athens", not the partner's "Alimos Marina | Athens");
 * the landing link is still resolved from the catalogue name.
 */
export const whereBases = (
  bases: BaseCount[],
  limit: number,
  landingPath: (base: BaseCount) => Promise<string | null>
): Promise<WhereBase[]> =>
  Promise.all(
    bases.slice(0, limit).map(async base => ({
      name: displayBaseName(base.name),
      count: base.count,
      href: await landingPath(base),
    }))
  );

/** The FAQ's biggest bases across all countries: "Alimos Marina, Athens (12)". */
export const topBaseLabels = (
  rows: Array<{ bases: WhereBase[] }>,
  format: (n: number) => string,
  limit = 3
): string[] =>
  rows
    .flatMap(row => row.bases)
    .sort((a, b) => b.count - a.count)
    .slice(0, limit)
    .map(base => `${base.name} (${format(base.count)})`);
