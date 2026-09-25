import { Range } from '@/utils/static/modelFleetStats';

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
