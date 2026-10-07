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

/**
 * The cheapest bookable future offer of any length with a price above 0
 * (lower price, then the earlier start), or null. Its price is that
 * period's total — shown as "Price for N days", never "/ week".
 */
export const cheapestBookableOffer = <T extends WeeklyOfferInput>(
  offers: readonly T[] | null | undefined,
  today: string
): T | null =>
  (offers ?? []).reduce<T | null>((best, offer) => {
    const from = offer.dateFrom?.slice(0, 10) ?? '';
    const price = offer.clientPriceEur;
    const nights = offerNights(offer);

    if (!isBookableOffer(offer) || !from || from < today || nights == null || nights <= 0) return best;

    if (typeof price !== 'number' || !Number.isFinite(price) || Math.round(price) <= 0) return best;

    if (!best) return offer;

    const bestPrice = priceOf(best);

    return price < bestPrice || (price === bestPrice && from < (best.dateFrom?.slice(0, 10) ?? '')) ? offer : best;
  }, null);

/**
 * The offer behind the boat's price before any dates are chosen (the phone
 * bar, 7.10.2026): the cheapest bookable 7-night week — "From … / week",
 * the JSON-LD lowPrice. When no week is bookable but a period of another
 * length is (Sun Odyssey 42 i Waterproof, Poros: every week reserved, 14, 21
 * and 28 nights free), the cheapest of those, as "Price for N days" and its
 * total. Null only when nothing bookable carries a price — "Price on request".
 */
export const fromPriceOffer = <T extends WeeklyOfferInput>(
  offers: readonly T[] | null | undefined,
  today: string,
  summary: WeeklyOfferSummary<T> | null = weeklyOfferSummary(offers, today)
): T | null => summary?.cheapestBookable ?? cheapestBookableOffer(offers, today);

/**
 * True when `selected` is the offer `quoted` names: the same days and the
 * same price in whole euros. The phone bar opens the price details (which
 * break down the selected offer) from its quoted price only then.
 */
export const isQuotedOffer = (
  selected: WeeklyOfferInput | null | undefined,
  quoted: Pick<WeeklyOfferInput, 'dateFrom' | 'dateTo' | 'clientPriceEur'> | null | undefined
): boolean =>
  !!selected &&
  !!quoted &&
  !!selected.dateFrom &&
  selected.dateFrom.slice(0, 10) === quoted.dateFrom?.slice(0, 10) &&
  !!selected.dateTo &&
  selected.dateTo.slice(0, 10) === quoted.dateTo?.slice(0, 10) &&
  typeof selected.clientPriceEur === 'number' &&
  typeof quoted.clientPriceEur === 'number' &&
  Math.round(selected.clientPriceEur) === Math.round(quoted.clientPriceEur);

/** Today as an ISO day in UTC — the day the summary's "future" starts. */
export const todayIso = (): string => new Date().toISOString().slice(0, 10);
