import { VesselType, YachtModelShortInfo } from '@/models/yacht.model';

/**
 * Figures a model page shows, computed from the boats /public/yachts lists
 * for the model (no extra backend work). Prices follow the site rule: a
 * weekly period total, never a per-day figure — the list price is per day
 * of the boat's next / cheapest offer, so ×7.
 */

/** A price band from fewer boats than this is noise, so it is left out. */
export const MIN_PRICE_SAMPLE = 5;

export interface Range {
  min: number;
  max: number;
}

export interface BaseCount {
  /** Catalogue did of the base ("l-2026"). */
  did: string;
  name: string;
  count: number;
}

export interface CountryCount {
  countryCode: string;
  count: number;
  bases: BaseCount[];
}

export interface ModelFleetStats {
  boats: number;
  lengthM: Range | null;
  cabins: Range | null;
  guests: Range | null;
  buildYear: Range | null;
  /** Weekly price p25–p75 in EUR, whole euros. */
  weeklyPrice: { p25: number; p75: number; n: number } | null;
  countries: CountryCount[];
  /** Most common boat type of the fleet (links go to that type's landings when they exist). */
  vesselType: VesselType | null;
}

const rangeOf = (values: Array<number | null | undefined>): Range | null => {
  const clean = values.filter((v): v is number => typeof v === 'number' && Number.isFinite(v) && v > 0);

  return clean.length ? { min: Math.min(...clean), max: Math.max(...clean) } : null;
};

/** Linear-interpolated percentile of a sorted list (0 ≤ q ≤ 1). */
export const percentile = (sorted: number[], q: number): number => {
  if (!sorted.length) return NaN;

  const pos = (sorted.length - 1) * q;
  const lo = Math.floor(pos);
  const hi = Math.ceil(pos);

  return sorted[lo] + (sorted[hi] - sorted[lo]) * (pos - lo);
};

export const weeklyPriceEur = (boat: YachtModelShortInfo): number | null =>
  typeof boat.clientPriceEur === 'number' && boat.clientPriceEur > 0 ? boat.clientPriceEur * 7 : null;

export const computeModelFleetStats = (
  boats: YachtModelShortInfo[],
  total: number,
  isCountryShown: (countryCode: string) => boolean
): ModelFleetStats => {
  const weekly = boats
    .map(weeklyPriceEur)
    .filter((v): v is number => v != null)
    .sort((a, b) => a - b);

  const byCountry = new Map<string, { count: number; bases: Map<string, BaseCount> }>();

  boats.forEach(boat => {
    const code = boat.location?.countryCode;

    if (!code || !isCountryShown(code)) return;

    const entry = byCountry.get(code) ?? { count: 0, bases: new Map<string, BaseCount>() };

    entry.count += 1;

    const id = boat.location?.id != null ? String(boat.location.id) : '';
    const name = boat.location?.name?.trim();

    if (id && name) {
      const did = id.includes('-') ? id : `l-${id}`;
      const base = entry.bases.get(did) ?? { did, name, count: 0 };

      base.count += 1;
      entry.bases.set(did, base);
    }

    byCountry.set(code, entry);
  });

  const typeCounts = new Map<VesselType, number>();

  boats.forEach(boat => {
    if (boat.vesselType) typeCounts.set(boat.vesselType, (typeCounts.get(boat.vesselType) ?? 0) + 1);
  });

  const vesselType = Array.from(typeCounts.entries()).sort((a, b) => b[1] - a[1])[0]?.[0] ?? null;

  const countries: CountryCount[] = Array.from(byCountry.entries())
    .map(([countryCode, entry]) => ({
      countryCode,
      count: entry.count,
      bases: Array.from(entry.bases.values()).sort((a, b) => b.count - a.count || a.name.localeCompare(b.name)),
    }))
    .sort((a, b) => b.count - a.count || a.countryCode.localeCompare(b.countryCode));

  return {
    boats: total,
    lengthM: rangeOf(boats.map(b => b.length)),
    cabins: rangeOf(boats.map(b => b.cabins)),
    guests: rangeOf(boats.map(b => b.maxPersons)),
    buildYear: rangeOf(boats.map(b => b.buildYear)),
    weeklyPrice:
      weekly.length >= MIN_PRICE_SAMPLE
        ? {
            p25: Math.round(percentile(weekly, 0.25)),
            p75: Math.round(percentile(weekly, 0.75)),
            n: weekly.length,
          }
        : null,
    countries,
    vesselType,
  };
};
