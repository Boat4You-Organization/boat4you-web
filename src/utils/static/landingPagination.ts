/**
 * Crawlable pagination of the /search destination landings (audit 7.10.2026).
 *
 * A landing showed its first 18 boats in the server HTML and paged with
 * buttons, so a crawler reached 18 of a landing's boats and never page 2
 * (Croatia catamarans: 18 of 884). Pages 2…N of a whole-set landing
 * (`/search?destinations=x[&boatTypes=Y]&page=n`, no dates or filters) are
 * now real pages: linked with `<a href>` from the pager, self-canonical,
 * indexable under the landing's own gate, titled "… – page n". They are not
 * in the sitemaps, and a page past the last one answers 404.
 *
 * No imports: `yarn test:landing-pages` runs this file with plain Node.
 */

/**
 * The URL of page `page` of a landing: the canonical landing path for page 1
 * (no `page=1` duplicate), `…&page=n` beyond. `currency` (the visitor's
 * display currency, a URL parameter on this site) is kept when given, so a
 * click from a USD listing stays in USD; the canonical never carries it.
 */
export const landingPageHref = (basePath: string, page: number, currency?: string | null): string => {
  const params: string[] = [];

  if (page > 1) params.push(`page=${page}`);

  if (currency) params.push(`currency=${encodeURIComponent(currency)}`);

  if (!params.length) return basePath;

  return `${basePath}${basePath.includes('?') ? '&' : '?'}${params.join('&')}`;
};

/** Pages a listing of `totalElements` boats fills at `pageSize` per page (0 for none). */
export const landingPageCount = (totalElements: number | null | undefined, pageSize: number): number =>
  totalElements && totalElements > 0 && pageSize > 0 ? Math.ceil(totalElements / pageSize) : 0;

/**
 * Whether the listing's pager (MUI Pagination with one boundary and one
 * sibling page) shows every page number, so no page is more than one link
 * away. Beyond that it collapses the middle into "…", and the listing adds
 * the full page list (LandingPageIndex) so a deep page is still one link
 * from every other page, not a chain of "next" links.
 */
export const pagerShowsEveryPage = (pageCount: number, boundaryCount = 1, siblingCount = 1): boolean =>
  pageCount <= 2 * boundaryCount + 2 * siblingCount + 3;
