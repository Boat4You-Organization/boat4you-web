import 'server-only';

import { YACHT_PAGE_SIZE } from '@/config/constants.config';
import { AllSearchParams } from '@/config/form-models.config';
import { Currency } from '@/models/user.model';
import { YachtModelShortInfo } from '@/models/yacht.model';
import { fetchYachts } from '@/services/yacht.service';
import { PaginatedResponse } from '@/types/response.type';
import { BASE_DIVERSITY_PAGES, landingPageNumber, yachtFetchParams } from '@/utils/server/searchLanding';
import { BASE_CAP, CARD_WINDOW, diversifyByBase } from '@/utils/static/baseDiversity';

/**
 * The yacht list of a /search request as the page shows it — the same list
 * for the visible cards (BoatsWrapper) and the Product JSON-LD (search page),
 * both built from one memoised fetch.
 *
 * On a diversified landing (searchLanding.ts `diversifiesBases`: a country or
 * region landing in its default order, whole set, first pages) the first
 * BASE_DIVERSITY_PAGES pages are cut from ONE window of BASE_DIVERSITY_PAGES ×
 * YACHT_PAGE_SIZE cards, reordered by base (baseDiversity.ts): one API call
 * (Data Cache, same window as the landing) instead of one per page, no card
 * shown twice or skipped across those pages, and page 1 holds at most
 * BASE_CAP cards of one base. Later pages, every other search and a marina
 * (`l-`) landing read the API page as before.
 */
export interface LandingListingOptions {
  /** Data Cache window of the fetch (undated landings only); undefined = no-store. */
  revalidate?: number;
  /** Apply the base-diversity reorder (diversifiesBases). */
  diversify?: boolean;
}

export const fetchLandingListing = async (
  params: AllSearchParams,
  currency: Currency,
  locale: string,
  { revalidate, diversify = false }: LandingListingOptions
): Promise<PaginatedResponse<YachtModelShortInfo>> => {
  const cached = !!revalidate;

  if (!diversify || !cached) {
    return fetchYachts(yachtFetchParams(params, cached), currency, locale, { revalidate });
  }

  const page = landingPageNumber(params.page) ?? 1;
  const windowSize = BASE_DIVERSITY_PAGES * YACHT_PAGE_SIZE;
  const firstPage: AllSearchParams = { ...params, page: undefined };
  const result = await fetchYachts(yachtFetchParams(firstPage, true, windowSize), currency, locale, {
    revalidate,
  });
  const ordered = diversifyByBase(result.content ?? [], BASE_CAP, CARD_WINDOW);
  const start = (page - 1) * YACHT_PAGE_SIZE;
  const totalElements = result.page?.totalElements ?? ordered.length;

  return {
    content: ordered.slice(start, start + YACHT_PAGE_SIZE),
    page: {
      size: YACHT_PAGE_SIZE,
      number: page - 1,
      totalElements,
      totalPages: Math.ceil(totalElements / YACHT_PAGE_SIZE),
    },
  };
};
