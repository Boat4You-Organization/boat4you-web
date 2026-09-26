import type { MonthPrice } from '@/utils/server/charterFacts';

/**
 * Display guards for the nightly charter-facts row (audit B11/B13,
 * 26.9.2026). The backend computes the figures; these rules decide what the
 * page may state, so a bad row can never publish a false fact:
 *
 *  - A month is shown and ranked only on a real sample: at least
 *    MIN_MONTH_SHARE of the median month's offer count. The window starts
 *    today, so the current month held a handful of last-minute offers
 *    (Sep 2026: 332 vs 10,137 in October) and was ranked "most expensive".
 *  - A weekly median under PRICE_FLOOR_EUR is a partner placeholder, not a
 *    price (Valencia: "10 €" weeks); such a month is left out, and a band
 *    whose lower quartile is under the floor is not shown.
 *  - Cheapest / priciest month are named only with MIN_RANKED_MONTHS
 *    months and a spread of at least MIN_RANK_SPREAD — otherwise the
 *    sentence picks between near-equal months (Croatia Sep 2026 = Jul 2027).
 *  - Model rows need MIN_ROW_BOATS boats (the block's own footnote) and a
 *    real model name: partner rows named after the boat type ("Motoryacht",
 *    "Gulet") or after one boat are not models.
 */
export const MIN_MONTH_SHARE = 0.25;
export const PRICE_FLOOR_EUR = 300;
export const MIN_RANKED_MONTHS = 3;
export const MIN_RANK_SPREAD = 0.1;
export const MIN_ROW_BOATS = 5;

const median = (values: number[]): number => {
  const sorted = [...values].sort((a, b) => a - b);
  const mid = Math.floor(sorted.length / 2);

  return sorted.length % 2 ? sorted[mid] : (sorted[mid - 1] + sorted[mid]) / 2;
};

/** Months with a representative sample and a real price, the band cleared when its low end is not a price. */
export const reliableMonths = (months: MonthPrice[]): MonthPrice[] => {
  const priced = months.filter(m => typeof m.median === 'number' && m.median >= PRICE_FLOOR_EUR);

  if (!priced.length) return [];

  const typicalOffers = median(priced.map(m => m.offers ?? 0));

  return priced
    .filter(m => (m.offers ?? 0) >= typicalOffers * MIN_MONTH_SHARE)
    .map(m => (m.p25 != null && m.p25 < PRICE_FLOOR_EUR ? { ...m, p25: null, p75: null } : m));
};

/** Cheapest and priciest month ("2026-10"), or null when the months do not support a ranking. */
export const monthRanking = (months: MonthPrice[]): { cheapest: string; priciest: string } | null => {
  if (months.length < MIN_RANKED_MONTHS) return null;

  // Ties → the earlier month, deterministically.
  const byPrice = [...months].sort((a, b) => (a.median as number) - (b.median as number) || a.month.localeCompare(b.month));
  const cheapest = byPrice[0];
  const priciest = [...months].sort(
    (a, b) => (b.median as number) - (a.median as number) || a.month.localeCompare(b.month)
  )[0];
  const low = cheapest.median as number;
  const high = priciest.median as number;

  return low > 0 && (high - low) / low >= MIN_RANK_SPREAD ? { cheapest: cheapest.month, priciest: priciest.month } : null;
};

const TYPE_WORDS = new Set(
  [
    'catamaran',
    'catamarans',
    'gulet',
    'gulets',
    'motoryacht',
    'motor yacht',
    'motor yachts',
    'luxury motor yacht',
    'luxury motoryacht',
    'motorboat',
    'motor boat',
    'motorsailer',
    'power catamaran',
    'sailing yacht',
    'sailboat',
    'sailing boat',
    'trimaran',
    'mini cruiser',
    'house boat',
    'houseboat',
    'rubber boat',
    'yacht',
    'boat',
  ].map(w => w.replace(/\s+/g, ''))
);

/** A partner "model" that is really a boat type ("Motoryacht", "Gulet", "Luxury Motor Yacht"). */
export const isTypeNameModel = (model: string, manufacturer?: string | null): boolean => {
  const fold = (s?: string | null) => (s ?? '').toLowerCase().replace(/[^a-z]/g, '');

  return TYPE_WORDS.has(fold(model)) || (TYPE_WORDS.has(fold(manufacturer)) && TYPE_WORDS.has(fold(model)));
};
