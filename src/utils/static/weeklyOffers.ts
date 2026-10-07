/**
 * The boat page's weekly prices, decided in ONE place (7.10.2026): the
 * Product JSON-LD (`AggregateOffer` lowPrice / highPrice / offerCount), the
 * "From … / week" line of the server HTML and the FAQ's "from … for a week"
 * answer all read this summary, so the three can no longer disagree. Before,
 * the server HTML said "Price on request" while the JSON-LD said 1,922 €.
 *
 * What counts:
 *   - a future offer (starts today or later) of exactly 7 nights — the price
 *     is the partner's total for that week (`clientPriceEur`), never a
 *     per-day rate, so "/ week" stays true when the boat is also offered for
 *     14 or 21 nights (those are left out);
 *   - with a real price (above 0);
 *   - one entry per week: two rows for the same dates (route or product
 *     variants) count once, a bookable row before a blocked one, then the
 *     lower price — the availability calendar shows one card per week too;
 *   - the bookable weeks (FREE; OPTION_EXPIRED from older payloads) when the
 *     boat has any. Only when every priced week is taken do the taken weeks
 *     describe the boat, as sold out — and then no "from" price is shown.
 */

export interface WeeklyOfferInput {
  dateFrom?: string | null;
  dateTo?: string | null;
  numberOfDays?: number | null;
  status?: string | null;
  clientPriceEur?: number | null;
}

export interface WeeklyOfferSummary<T extends WeeklyOfferInput> {
  /** The weeks the summary describes, one per week, earliest first. */
  weeks: T[];
  /** True when `weeks` are bookable; false when every priced week is taken (sold out). */
  bookable: boolean;
  /** Whole euros, as the JSON-LD prints them. */
  lowPrice: number;
  highPrice: number;
  offerCount: number;
  /** The bookable week behind "From … / week", or null when no week is bookable. */
  cheapestBookable: T | null;
}

const DAY_MS = 86_400_000;

const BOOKABLE_STATUSES = new Set(['FREE', 'OPTION_EXPIRED']);

/** Nights of one offer (dateFrom → dateTo), or `numberOfDays` when the dates are unreadable. */
export const offerNights = (offer: WeeklyOfferInput): number | null => {
  const from = Date.parse(offer.dateFrom?.slice(0, 10) ?? '');
  const to = Date.parse(offer.dateTo?.slice(0, 10) ?? '');

  if (Number.isFinite(from) && Number.isFinite(to)) return Math.round((to - from) / DAY_MS);

  return offer.numberOfDays ?? null;
};

export const isBookableOffer = (offer: WeeklyOfferInput): boolean => BOOKABLE_STATUSES.has(offer.status ?? '');

const priceOf = (offer: WeeklyOfferInput): number => offer.clientPriceEur as number;

/** `a` speaks for its week before `b`: bookable first, then the lower price. */
const betterForWeek = (a: WeeklyOfferInput, b: WeeklyOfferInput): boolean => {
  const bookableA = isBookableOffer(a);
  const bookableB = isBookableOffer(b);

  if (bookableA !== bookableB) return bookableA;

  return priceOf(a) < priceOf(b);
};

/**
 * The weekly summary of a boat's offers, or null when no future 7-night week
 * carries a price (the page then shows "Price on request" and emits no
 * Product). `today` is an ISO day (YYYY-MM-DD).
 */
export const weeklyOfferSummary = <T extends WeeklyOfferInput>(
  offers: readonly T[] | null | undefined,
  today: string
): WeeklyOfferSummary<T> | null => {
  const byWeek = new Map<string, T>();

  (offers ?? []).forEach(offer => {
    const from = offer.dateFrom?.slice(0, 10) ?? '';
    const price = offer.clientPriceEur;

    if (typeof price !== 'number' || !Number.isFinite(price) || Math.round(price) <= 0) return;

    if (offerNights(offer) !== 7 || !from || from < today) return;

    const key = `${from}|${offer.dateTo?.slice(0, 10) ?? ''}`;
    const seen = byWeek.get(key);

    if (!seen || betterForWeek(offer, seen)) byWeek.set(key, offer);
  });

  const all = [...byWeek.entries()].sort(([a], [b]) => a.localeCompare(b)).map(([, offer]) => offer);

  if (!all.length) return null;

  const bookableWeeks = all.filter(isBookableOffer);
  const weeks = bookableWeeks.length ? bookableWeeks : all;
  const prices = weeks.map(offer => Math.round(priceOf(offer)));
  const cheapestBookable = bookableWeeks.reduce<T | null>(
    (best, offer) => (!best || priceOf(offer) < priceOf(best) ? offer : best),
    null
  );

  return {
    weeks,
    bookable: bookableWeeks.length > 0,
    lowPrice: Math.min(...prices),
    highPrice: Math.max(...prices),
    offerCount: weeks.length,
    cheapestBookable,
  };
};

/** Today as an ISO day in UTC — the day the summary's "future" starts. */
export const todayIso = (): string => new Date().toISOString().slice(0, 10);
