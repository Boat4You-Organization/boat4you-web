import { YachtSearchParams } from '@/config/form-models.config';
import { Currency } from '@/models/user.model';
import { PriceCalcDto, YachtOfferModel } from '@/models/yacht-offer.model';
import { YachtAvailability, YachtModelShortInfo } from '@/models/yacht.model';
import { PaginatedResponse } from '@/types/response.type';
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

export async function fetchYachts(
  searchParams: YachtSearchParams,
  currency: Currency = Currency.EUR,
  locale: string = 'en'
): Promise<PaginatedResponse<YachtModelShortInfo>> {
  try {
    const { boatTypes, ...restParams } = searchParams;

    const paramsWithCurrency = {
      ...restParams,
      ...(boatTypes && { vesselType: boatTypes }),
      ...(currency && { currency }),
    };

    const queryParams = createYachtQueryParams(paramsWithCurrency);

    const response = await fetch(`${process.env.NEXT_PUBLIC_BOAT_WS_API_URL}/public/yachts${queryParams}`, {
      headers: {
        'Accept-Language': locale,
        'Content-Type': 'application/json',
      },
    });

    return await response.json();
  } catch {
    return { content: [] };
  }
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

    return await response.json();
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

    return data;
  } catch {
    return [];
  }
}
