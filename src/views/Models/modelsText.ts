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

/** "3–6", or "4" when the range is one value. */
export const formatRange = (range: Range | null, format: (n: number) => string = String): string | null => {
  if (!range) return null;

  return range.min === range.max ? format(range.min) : `${format(range.min)}–${format(range.max)}`;
};

export const M_PER_FT = 0.3048;
