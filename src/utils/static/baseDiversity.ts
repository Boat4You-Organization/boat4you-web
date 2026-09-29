/**
 * Base diversity of a landing's first cards (audit 29.9.2026, R10).
 *
 * The default (price-ascending) order of a country or region landing let one
 * marina fill the first page: 16 of 18 Croatia cards from one Sukošan base,
 * 18/18 Split Region from Marina Kaštela, kornati 18/18, bahamas 16/18 —
 * identical in all 9 locales, so a visitor saw one partner's fleet as "the
 * catalogue of Croatia". The reorder below caps one base at BASE_CAP of the
 * first CARD_WINDOW cards: the API order is walked once, a card whose base
 * already holds BASE_CAP of the window is deferred, and the deferred cards
 * follow the window in their original order — nothing is dropped, the order
 * is deterministic (no randomness, same result on every crawl), and where
 * the catalogue has no other base (Martinique) the cards simply keep their
 * order. Applied by the web listing layer only (landingListing.ts); the API
 * is untouched.
 */

/** At most this many cards of one base among the first CARD_WINDOW. */
export const BASE_CAP = 6;
/** The first page of cards (YACHT_PAGE_SIZE). */
export const CARD_WINDOW = 18;

/**
 * The base a card belongs to, spelling-insensitive: the marina part before a
 * " | town" suffix, lower-cased, diacritics and punctuation removed — so the
 * two catalogue records "Marina Kaštela | Kaštel Gomilica" and "Marina
 * Kastela" (one marina, two sources) count as one base.
 */
export const baseKey = (location: { id?: string | number | null; name?: string | null } | null | undefined): string => {
  const name = (location?.name ?? '').split('|')[0].trim();

  if (!name) return location?.id != null ? `id:${location.id}` : '';

  return name
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '');
};

/**
 * `items` in API order with at most `cap` cards of one base among the first
 * `window`; the cards deferred from the window follow it, then the rest,
 * each group in its original order. Cards without a base never count.
 */
export const diversifyByBase = <T extends { location?: { id?: string | number | null; name?: string | null } | null }>(
  items: readonly T[],
  cap: number = BASE_CAP,
  window: number = CARD_WINDOW
): T[] => {
  const head: T[] = [];
  const deferred: T[] = [];
  const rest: T[] = [];
  const counts = new Map<string, number>();

  items.forEach(item => {
    if (head.length >= window) {
      rest.push(item);

      return;
    }

    const key = baseKey(item.location);
    const seen = key ? (counts.get(key) ?? 0) : 0;

    if (key && seen >= cap) {
      deferred.push(item);

      return;
    }

    if (key) counts.set(key, seen + 1);

    head.push(item);
  });

  return [...head, ...deferred, ...rest];
};
