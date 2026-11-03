/**
 * The checkout shows the reservation the boat page saved in this browser (localStorage, up to 24 h). A link for
 * another boat or other dates must not open it (bug 2.11.2026: a link for 7-21 Aug opened a reservation saved
 * earlier for other dates). The boat page builds the checkout link from the reservation it saves ([checkoutQuery]),
 * so a normal checkout always matches. Dates are compared only when the link carries both; the boat only when both
 * sides know it (reservations saved before the slug was stored compare by dates). Damaged saved data never matches
 * a dated link.
 */
export const savedReservationMatchesLink = (
  saved: { slug?: string; dateFrom?: string; dateTo?: string },
  linkSlug: string | null | undefined,
  startDate: string | null | undefined,
  endDate: string | null | undefined
): boolean => {
  const sameBoat = !saved.slug || !linkSlug || saved.slug === linkSlug;
  const sameDates =
    !startDate ||
    !endDate ||
    (saved.dateFrom?.slice(0, 10) === startDate.slice(0, 10) && saved.dateTo?.slice(0, 10) === endDate.slice(0, 10));

  return sameBoat && sameDates;
};

/**
 * The checkout link's query: the boat page's query with the dates of the reservation being saved. On a phone the URL
 * may still show the previous week when Reserve is tapped right after picking another one (review 3.11.2026).
 */
export const checkoutQuery = (boatPageQuery: string, dateFrom?: string | null, dateTo?: string | null): string => {
  const query = new URLSearchParams(boatPageQuery);

  if (dateFrom && dateTo) {
    query.set('startDate', dateFrom.slice(0, 10));
    query.set('endDate', dateTo.slice(0, 10));
  }

  return query.toString();
};

/** The boat page for a checkout link, same locale prefix and query: there the visitor sees the real availability. */
export const boatPageForCheckout = (checkoutPath: string, query: string): string =>
  `${checkoutPath.replace('/enter-your-details/', '/boat/')}${query ? `?${query}` : ''}`;
