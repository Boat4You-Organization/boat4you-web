import { YachtSearchParams } from '@/config/form-models.config';
import { Currency } from '@/models/user.model';
import { PriceCalcDto, YachtOfferModel } from '@/models/yacht-offer.model';
import { YachtAvailability, YachtModelShortInfo } from '@/models/yacht.model';
import { PaginatedResponse } from '@/types/response.type';
import { fetchWithRetry } from '@/utils/server/fetchWithRetry';
import { withoutPartnerIds } from '@/utils/static/partnerIds';
import { withSafeExtraNames } from '@/utils/static/partnerText';
import { createYachtQueryParams } from '@/utils/static/queryParams';

interface YachtAvailabilityParams {
  yachtSlug: string;
  month?: number;
  year?: number;
}

interface YachtOffersParams {
  yachtSlug: string;
  dateFrom: string;
  dateTo: string;
  currency?: string;
}

interface YachtPriceParams {
  yachtSlug: string;
  offerId: number;
  selectedExtrasKeys?: string[];
  currency?: string;
}

export interface FetchYachtsOptions {
  /**
   * Seconds to keep this exact query in the Next Data Cache. Omitted =
   * `no-store` (the default: dated / filtered searches must mirror partner
   * state). Only the undated destination landings pass it — see
   * landingFetchRevalidate in src/utils/server/searchLanding.ts.
   */
  revalidate?: number;
}

export async function fetchYachts(
  searchParams: YachtSearchParams,
  currency: Currency = Currency.EUR,
  locale: string = 'en',
  options: FetchYachtsOptions = {}
): Promise<PaginatedResponse<YachtModelShortInfo>> {
  const { boatTypes, ...restParams } = searchParams;

  const paramsWithCurrency = {
    ...restParams,
    // Default sort is "Recommended" — backend treats empty/missing sortBy
    // as the recommended-agency boost path. Earlier this defaulted to
    // 'asc' (Lowest price) which silently bypassed the boost for any URL
    // that didn't explicitly set sortBy. The tab UI already defaults to
    // Recommended when sortBy is missing, so aligning the fetch default
    // keeps tab + result list consistent.
    sortBy: restParams.sortBy ?? '',
    ...(boatTypes && { vesselType: boatTypes }),
    ...(currency && { currency }),
  };

  const queryParams = createYachtQueryParams(paramsWithCurrency);

  // A 5xx / 429 / network error is retried (0.5 s, 1 s, 2 s) before it throws.
  const response = await fetchWithRetry(`${process.env.NEXT_PUBLIC_BOAT_WS_API_URL}/public/yachts${queryParams}`, {
    // Yacht catalogue + offer state changes constantly (partner sync,
    // dual-source dedup, manual price overrides). Cached SSR responses
    // make the search page lag behind reality (e.g. a freshly-mapped
    // Sardinia marina taking up to an hour to surface), so by default go to
    // the backend; the backend itself has its own short-window cache for
    // the expensive joins. The caller opts into a short Data Cache window
    // for the undated landing pages only (options.revalidate).
    ...(options.revalidate ? { next: { revalidate: options.revalidate } } : { cache: 'no-store' as const }),
    headers: {
      'Accept-Language': locale,
      'Content-Type': 'application/json',
    },
  });

  // Throws on HTTP/network failure (no more silent `{ content: [] }`): the
  // sitemaps answer 503 so GSC retries; listing callers catch and fall back.
  if (!response.ok) {
    throw new Error(`Failed to fetch yachts: ${response.status}`);
  }

  // No agency / commission / source system on a listing row (partnerIds.ts).
  return withoutPartnerIds((await response.json()) as PaginatedResponse<YachtModelShortInfo>);
}

/** How long a fleet-directory chunk stays in the Data Cache (6 h). */
export const FLEET_REVALIDATE_SECONDS = 21600;

/**
 * Catalogue read for the crawlable /fleet directory — deliberately NOT
 * `fetchYachts`.
 *
 * `fetchYachts` above is `cache: 'no-store'` on purpose: search results must
 * mirror partner state minute by minute. The directory has the opposite
 * requirement — it lists the whole promoted catalogue and must not re-hit
 * the backend per visitor or per locale.
 *
 * Locale and currency are pinned here so all 9 locales share ONE Data Cache
 * entry per API page: the directory renders no prices and no
 * partner-translated copy, only manufacturer/model + vessel name, so the
 * response is locale-independent. Without pinning, a walk would cost 9 × 122
 * backend calls instead of 122.
 *
 * Throws on a bad response (same contract as `fetchYachts`) so a partial
 * page can never silently replace the good cached directory with a shorter
 * one — see `getFleetPage`.
 */
export async function fetchFleetChunk(
  searchParams: YachtSearchParams
): Promise<PaginatedResponse<YachtModelShortInfo>> {
  const queryParams = createYachtQueryParams({ ...searchParams, currency: Currency.EUR });
  const url = `${process.env.NEXT_PUBLIC_BOAT_WS_API_URL}/public/yachts${queryParams}`;

  // Retried (fetchWithRetry), because throwing is the right contract but a
  // transient 429/502 from the API should not take a whole directory page
  // down with it. (The plain second fetch() here before 29.9.2026 could get
  // the first failed response back: Next memoises signal-less GETs per render.)
  const response = await fetchWithRetry(url, {
    next: { revalidate: FLEET_REVALIDATE_SECONDS },
    headers: {
      'Accept-Language': 'en',
      'Content-Type': 'application/json',
    },
  });

  if (!response.ok) {
    throw new Error(`Failed to fetch fleet chunk: ${response.status}`);
  }

  return withoutPartnerIds((await response.json()) as PaginatedResponse<YachtModelShortInfo>);
}

export async function fetchYachtAvailability(params: YachtAvailabilityParams): Promise<YachtAvailability[]> {
  try {
    const query = new URLSearchParams();

    if (params.month !== undefined) {
      query.append('month', params.month.toString());
    }

    if (params.year !== undefined) {
      query.append('year', params.year.toString());
    }

    const url = `${process.env.NEXT_PUBLIC_BOAT_WS_API_URL}/public/yachts/${params.yachtSlug}/availability${query.toString() ? `?${query.toString()}` : ''}`;

    const response = await fetch(url);

    if (!response.ok) {
      throw new Error(`Failed to fetch availability: ${response.statusText}`);
    }

    const data: YachtAvailability[] = await response.json();

    return data;
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error('Error fetching yacht availability:', error);

    return [];
  }
}

export async function fetchSingleYachtPrice(params: YachtPriceParams): Promise<PriceCalcDto | null> {
  try {
    const query = new URLSearchParams();

    if (params.selectedExtrasKeys && params.selectedExtrasKeys.length > 0) {
      params.selectedExtrasKeys.forEach(extraKey => {
        query.append('selectedExtras', extraKey);
      });
    }

    if (params.currency) {
      query.append('currency', params.currency);
    }

    const queryString = query.toString();
    const url = `${process.env.NEXT_PUBLIC_BOAT_WS_API_URL}/public/yachts/${params.yachtSlug}/offer/${params.offerId}/calculate${queryString ? `?${queryString}` : ''}`;

    const response = await fetch(url);

    if (!response.ok) {
      return null;
    }

    // Extra names reach the recap, the phone price sheet and the booking
    // without partner-only parts (partnerText.ts).
    const price = (await response.json()) as PriceCalcDto | null;

    return price ? withSafeExtraNames(price) : price;
  } catch (error) {
    return null;
  }
}

export async function fetchSingleYachtStandardOffers(params: YachtOffersParams): Promise<YachtOfferModel[]> {
  try {
    const query = new URLSearchParams();

    query.append('dateFrom', params.dateFrom);
    query.append('dateTo', params.dateTo);

    if (params.currency) {
      query.append('currency', params.currency);
    }

    const url = `${process.env.NEXT_PUBLIC_BOAT_WS_API_URL}/public/yachts/${params.yachtSlug}/standard-offers?${query.toString()}`;

    const response = await fetch(url);

    if (!response.ok) {
      throw new Error(`Failed to fetch standard offers: ${response.statusText}`);
    }

    const data: YachtOfferModel[] = await response.json();

    return withoutPartnerIds(data);
  } catch {
    return [];
  }
}
