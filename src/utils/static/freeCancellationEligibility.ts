/**
 * A booking made 14 days or less before the charter starts carries no "72 h
 * free cancellation" (owner rule, 12.11.2026; Terms 7.1): a last-minute
 * booking is paid in full and passed on to the charter company at once, and
 * the company does not take the boat back two days later.
 *
 * One rule for the listing card, the boat page, the checkout and My Bookings.
 * No dependencies on purpose — the listing card imports this.
 */
export const FREE_CANCELLATION_MIN_DAYS_AHEAD = 14;

/**
 * The moment the rule came into force (the deploy that also changed Terms
 * 7.1). A booking made before it keeps the 72 hours it was promised, so My
 * Bookings never rewrites the terms of an existing reservation.
 */
export const FREE_CANCELLATION_RULE_SINCE = Date.parse('2026-11-12T00:00:00Z');

const DAY_MS = 24 * 60 * 60 * 1000;

/**
 * Whether a charter starting on `dateFrom` (YYYY-MM-DD, its first day) gets
 * the free-cancellation promise when booked at `bookedAt` (ms; now for a
 * listing, a boat page or the checkout, the reservation's creation time in My
 * Bookings): only when that day is more than 14 days after the booking moment.
 * Without a usable date (no offer period known) the promise stands, as before.
 * Compared as absolute time against the day's UTC midnight, so the server and
 * a browser in any time zone give the same answer.
 */
export const offersFreeCancellation = (dateFrom?: string | null, bookedAt: number = Date.now()): boolean => {
  if (bookedAt < FREE_CANCELLATION_RULE_SINCE) return true;

  const start = dateFrom ? Date.parse(`${dateFrom.slice(0, 10)}T00:00:00Z`) : NaN;

  return Number.isNaN(start) || start - bookedAt > FREE_CANCELLATION_MIN_DAYS_AHEAD * DAY_MS;
};
