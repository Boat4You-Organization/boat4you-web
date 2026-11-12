/**
 * A charter that starts within two weeks carries no "72 h free cancellation"
 * promise (owner rule, 12.11.2026): a last-minute booking is paid in full and
 * passed on to the charter company at once, and the company does not take the
 * boat back two days later.
 *
 * No dependencies on purpose — the listing card imports this.
 */
export const FREE_CANCELLATION_MIN_DAYS_AHEAD = 14;

const DAY_MS = 24 * 60 * 60 * 1000;

/**
 * Whether a charter starting on `dateFrom` (YYYY-MM-DD, the offer's first day)
 * still gets the promise: only when that day is more than 14 days away.
 * Without a usable date (no offer period known) the promise stands, as before.
 * Compared as absolute time against the day's UTC midnight, so the server and
 * a browser in any time zone give the same answer.
 */
export const offersFreeCancellation = (dateFrom?: string | null, now: number = Date.now()): boolean => {
  const start = dateFrom ? Date.parse(`${dateFrom.slice(0, 10)}T00:00:00Z`) : NaN;

  return Number.isNaN(start) || start - now > FREE_CANCELLATION_MIN_DAYS_AHEAD * DAY_MS;
};
