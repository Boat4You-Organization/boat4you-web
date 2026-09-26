import type { CharterFacts, MonthPrice } from '@/utils/server/charterFacts';

/**
 * Display guards for the nightly charter-facts row (audit B11/B13,
 * 26.9.2026). The backend computes the figures; these rules decide what the
 * page may state, so a bad row can never publish a false fact. They hold for
 * rows of either backend version (before and after its own B11 fix):
 *
 *  - Full months only. The window of an older row starts on the day it was
 *    computed, so its first month held the last few days of that month (Sep
 *    2026: 332 offers against 10,137 in October) and was ranked "most
 *    expensive". The month of windowFrom counts only when windowFrom is the
 *    1st; months already past at render time (a stale row) are left out too.
 *  - A month whose weekly median or lower quartile is under PRICE_FLOOR_EUR is
 *    left out whole: at least a quarter of its weeks are partner placeholders
 *    ("10 €" in Valencia), so its median is not a price either.
 *  - A month is shown only when it is priced for at least MONTH_COVERAGE of
 *    the best-covered season month's boats (older rows: weeks) — the
 *    backend's own rule. Thin off-season months describe another fleet (the
 *    few crewed yachts that publish winter prices: Greece gulets 48,844 € in
 *    January against 21,280 € in August). The first NEAR_TERM_MONTHS do not
 *    set that bar: their counts mix this year's full price lists with next
 *    year's partial ones.
 *  - Cheapest / priciest month are named only when every rule below holds,
 *    each claim on its own:
 *      · at least MIN_RANKED_MONTHS shown months (half the year) and a
 *        spread of MIN_RANK_SPREAD over them;
 *      · one month at that price (a tie names no month);
 *      · the month is not one of the first NEAR_TERM_MONTHS: their prices are
 *        the weeks left over once the popular boats are booked (Turkey Oct
 *        2026: 6,632 € against 4,748 € in July 2027). Such a month stays in
 *        the table, and no later month is named in its place, so the sentence
 *        never contradicts the table under it;
 *      · the month fits the sailing season of the page's country
 *        (SEASONS): no Mediterranean "most expensive month" between October
 *        and April or "cheapest month" in June – August, no Caribbean
 *        "most expensive month" in June – October or "cheapest month" in
 *        December – April. A ranking against the season is a sample
 *        artefact, never a fact worth stating.
 *    The row's own cheapestMonth / priciestMonth are not read: the sentence
 *    must be about the months the table under it shows. The backend's B11
 *    fix (full months, like-for-like prices, a boats count per month)
 *    reaches the page through priceByMonth.
 *  - Model rows need MIN_ROW_BOATS boats (the block's own footnote) and a
 *    real model name: partner rows named after the boat type ("Motoryacht",
 *    "Gulet") or after one boat are not models.
 */
export const MONTH_COVERAGE = 0.5;
export const MIN_MONTH_SAMPLE = 5;
export const PRICE_FLOOR_EUR = 300;
export const NEAR_TERM_MONTHS = 2;
export const MIN_RANKED_MONTHS = 6;
export const MIN_RANK_SPREAD = 0.1;
export const MIN_ROW_BOATS = 5;

type Kind = 'cheapest' | 'priciest';

const MEDITERRANEAN = new Set(['AL', 'CY', 'ES', 'FR', 'GR', 'HR', 'IT', 'MC', 'ME', 'MT', 'PT', 'SI', 'TR']);
const CARIBBEAN = new Set([
  'AG',
  'AI',
  'BL',
  'BQ',
  'BS',
  'CW',
  'DM',
  'GD',
  'GP',
  'KN',
  'KY',
  'LC',
  'MF',
  'MQ',
  'SX',
  'TC',
  'VC',
  'VG',
  'VI',
]);

/** Calendar months (1–12) a claim may name, per sailing-season zone. */
const SEASONS: Array<{ countries: Set<string>; allowed: Record<Kind, (month: number) => boolean> }> = [
  // High season July–August, shoulder May–June and September.
  { countries: MEDITERRANEAN, allowed: { cheapest: m => m < 6 || m > 8, priciest: m => m >= 5 && m <= 9 } },
  // High season December–April, hurricane season June–October.
  { countries: CARIBBEAN, allowed: { cheapest: m => m >= 5 && m <= 11, priciest: m => m <= 5 || m >= 11 } },
];

const monthOf = (date: Date): string => `${date.getUTCFullYear()}-${String(date.getUTCMonth() + 1).padStart(2, '0')}`;

/** "2026-11" + 2 → "2027-01". */
export const addMonths = (month: string, count: number): string => {
  const [year, m] = month.split('-').map(Number);

  return monthOf(new Date(Date.UTC(year, m - 1 + count, 1)));
};

const ISO_DATE = /^\d{4}-\d{2}-\d{2}/;

/**
 * The first month a row's figures cover in full ("2026-10"): the month of
 * windowFrom (else computedAt) when that is the 1st, otherwise the next one —
 * and never a month already past at render time.
 */
export const firstFullMonth = (facts: Pick<CharterFacts, 'windowFrom' | 'computedAt'>, now: Date): string => {
  const start = [facts.windowFrom, facts.computedAt].find(v => v && ISO_DATE.test(v)) ?? now.toISOString();
  const own = start.slice(0, 7);
  const first = start.slice(8, 10) === '01' ? own : addMonths(own, 1);
  const current = monthOf(now);

  return first > current ? first : current;
};

export interface ShownMonths {
  /** The months the table shows, in calendar order. */
  months: MonthPrice[];
  /** The first month a cheapest / priciest claim may name. */
  firstRankable: string;
}

const isPrice = (value: number | null | undefined): value is number =>
  typeof value === 'number' && value >= PRICE_FLOOR_EUR;

/** Months with a full calendar month, a real price and a comparable sample (see the rules above). */
export const reliableMonths = (
  facts: Pick<CharterFacts, 'priceByMonth' | 'windowFrom' | 'computedAt'>,
  now: Date = new Date()
): ShownMonths => {
  const first = firstFullMonth(facts, now);
  const firstRankable = addMonths(first, NEAR_TERM_MONTHS);
  const count = (m: MonthPrice): number => m.boats ?? m.offers ?? 0;
  const priced = (facts.priceByMonth ?? []).filter(
    m => m.month >= first && isPrice(m.median) && (m.p25 == null || isPrice(m.p25))
  );
  const season = priced.filter(m => m.month >= firstRankable);
  const best = Math.max(0, ...(season.length ? season : priced).map(count));
  const months = priced
    .filter(m => count(m) >= MIN_MONTH_SAMPLE && count(m) >= best * MONTH_COVERAGE)
    .sort((a, b) => a.month.localeCompare(b.month));

  return { months, firstRankable };
};

/**
 * The cheapest and the priciest shown month ("2027-03"), each null when it
 * may not be named; null when neither may.
 */
export const monthRanking = (
  { months, firstRankable }: ShownMonths,
  countryCode?: string | null
): { cheapest: string | null; priciest: string | null } | null => {
  // "The cheapest month" of the next twelve needs most of them to compare:
  // Catalonia's table is Oct – Dec 2026 only, and the BVI sailing table May –
  // July 2027 only (its winter high season was too thin to show), where
  // "most expensive month: May 2027" would be false.
  if (months.length < MIN_RANKED_MONTHS) return null;

  const medians = months.map(m => Math.round(m.median as number));
  const low = Math.min(...medians);
  const high = Math.max(...medians);

  if (low <= 0 || (high - low) / low < MIN_RANK_SPREAD) return null;

  const season = SEASONS.find(z => countryCode && z.countries.has(countryCode.toUpperCase()));
  const pick = (value: number, kind: Kind): string | null => {
    const at = months.filter((_, i) => medians[i] === value);

    if (at.length !== 1) return null;

    const { month } = at[0];

    if (month < firstRankable) return null;

    return !season || season.allowed[kind](Number(month.slice(5, 7))) ? month : null;
  };
  const cheapest = pick(low, 'cheapest');
  const priciest = pick(high, 'priciest');

  return cheapest || priciest ? { cheapest, priciest } : null;
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
