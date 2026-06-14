'use server';

import { POST_REQUEST_PARAMETERS } from '@/config/constants.config';
import { YachtSearchParams } from '@/config/form-models.config';
import { ErrorModel } from '@/models/error.model';
import { InquiriesModel } from '@/models/inquiries.model';
import { Currency } from '@/models/user.model';
import { PriceCalcDto, YachtOfferModel } from '@/models/yacht-offer.model';
import { YachtAvailability, YachtFleet, YachtModel } from '@/models/yacht.model';
import { PayloadResponse } from '@/types/response.type';
import { authFetch } from '@/utils/static/authFetch';
import { getBoatImageBaseUrl } from '@/utils/static/imageUtils';
import { createYachtQueryParams } from '@/utils/static/queryParams';

/* eslint-disable @typescript-eslint/no-explicit-any */

export interface YachtImageParams {
  imageId: number;
  width?: number;
  height?: number;
}
export interface YachtOffersParams {
  yachtSlug: string;
  dateFrom?: string;
  dateTo?: string;
  currency?: string;
  offerId?: number;
  selectedExtrasKeys?: string[];
}

export interface YachtAvailabilityParams {
  yachtSlug: string;
  month?: number;
  year?: number;
}

export interface BrochureResult {
  success: boolean;
  url?: string;
  error?: string;
}

export async function getSingleYacth(
  slug: string,
  searchParams: YachtSearchParams,
  currency: Currency = Currency.EUR,
  language: string = 'en'
): Promise<YachtModel | null> {
  try {
    // The detail endpoint expects dateFrom/dateTo, but URL search params are
    // startDate/endDate (shared with the listing). Rename so the backend can
    // actually find matching offers for the user's requested week.
    const { startDate, endDate, ...filteredSearchParams } = searchParams;

    const paramsWithCurrency = {
      ...filteredSearchParams,
      ...(startDate && { dateFrom: startDate }),
      ...(endDate && { dateTo: endDate }),
      ...(currency && { currency }),
    };

    const queryParams = createYachtQueryParams(paramsWithCurrency);

    const response = await fetch(`${process.env.NEXT_PUBLIC_BOAT_WS_API_URL}/public/yachts/${slug}${queryParams}`, {
      headers: {
        'Accept-Language': language,
      },
    });

    if (!response.ok) {
      return null;
    }

    return await response.json();
  } catch {
    return null;
  }
}

export async function getYachtBrochureUrl(state: unknown, slug: string): Promise<BrochureResult> {
  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_BOAT_WS_API_URL}/public/yachts/${slug}/brochure`);

    if (!response.ok) {
      return { success: false, error: `HTTP error! status: ${response.status}` };
    }

    return { success: true, url: response.url };
  } catch (error) {
    return { success: false, error: error instanceof Error ? error.message : 'Unknown error' };
  }
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export async function getYachtImage(state: any, { imageId, width, height }: YachtImageParams): Promise<string | null> {
  try {
    const params = new URLSearchParams();

    if (width) params.append('width', width.toString());

    if (height) params.append('height', height.toString());

    const response = await fetch(`${getBoatImageBaseUrl(imageId)}${params && `?${params.toString()}`}`, {
      headers: {
        Accept: 'image/*',
      },
    });

    if (!response.ok) {
      return null;
    }

    const contentLength = Number(response.headers.get('content-length'));

    const contentType = response.headers.get('content-type');

    if (!contentType || !contentType.startsWith('image/') || contentLength <= 0) {
      return null;
    }

    return response.url;
  } catch {
    return null;
  }
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export async function getSingleYachtAvailability(
  state: unknown,
  { yachtSlug, month, year }: YachtAvailabilityParams
): Promise<YachtAvailability[]> {
  try {
    const params = new URLSearchParams();

    if (month) params.append('month', month.toString());

    if (year) params.append('year', year.toString());

    const response = await fetch(
      `${process.env.NEXT_PUBLIC_BOAT_WS_API_URL}/public/yachts/${yachtSlug}/availability${params && `?${params.toString()}`}`
    );

    return await response.json();
  } catch {
    return [];
  }
}

// Standard Saturday→Saturday offers across a date window — used by the live
// availability calendar (LiveCalendar/AvailabilitySlider) via useActionState.
// Thin wrapper over the same /standard-offers endpoint the legacy week-cards
// hook hits.
export async function getSingleYachtStandardOffers(
  _state: unknown,
  { yachtSlug, dateFrom, dateTo, currency }: YachtOffersParams
): Promise<YachtOfferModel[]> {
  try {
    const params = new URLSearchParams();

    if (dateFrom) params.append('dateFrom', dateFrom);

    if (dateTo) params.append('dateTo', dateTo);

    // Pass the selected currency so the backend converts clientPriceInfo /
    // listPriceInfo amounts (AUD/USD/...). Without it the calendar week cards
    // stayed in EUR while the detail box + booking panel showed the chosen
    // currency.
    if (currency) params.append('currency', currency);

    const response = await fetch(
      `${process.env.NEXT_PUBLIC_BOAT_WS_API_URL}/public/yachts/${yachtSlug}/standard-offers?${params.toString()}`
    );

    return await response.json();
  } catch {
    return [];
  }
}

export async function getYachtFleet(): Promise<YachtFleet[]> {
  try {
    // Home OurFleetSection — counts shift daily as partner sync adjusts the
    // catalogue, but per-request hits stack onto a backend cold path that
    // dominates TTFB on PSI cold runs. 60s SWR keeps the numbers fresh and
    // the home cacheable.
    const response = await fetch(`${process.env.NEXT_PUBLIC_BOAT_WS_API_URL}/public/catalogue/type-count`, {
      next: { revalidate: 60 },
    });

    return await response.json();
  } catch {
    return [];
  }
}

export async function getSingleYachtPrice({
  yachtSlug,
  offerId,
  selectedExtrasKeys,
  currency = Currency.EUR,
}: YachtOffersParams): Promise<PriceCalcDto | null> {
  try {
    const params = new URLSearchParams();

    if (selectedExtrasKeys && selectedExtrasKeys.length > 0) {
      selectedExtrasKeys.forEach(extraId => {
        params.append('selectedExtras', extraId);
      });
    }

    if (currency) {
      params.append('currency', currency);
    }

    const queryString = params.toString();
    const url = `${process.env.NEXT_PUBLIC_BOAT_WS_API_URL}/public/yachts/${yachtSlug}/offer/${offerId}/calculate${queryString ? `?${queryString}` : ''}`;

    const response = await fetch(url);

    if (!response.ok) {
      return null;
    }

    return await response.json();
  } catch (error) {
    return null;
  }
}

export async function sendYachtInquiry(state: any, formData: FormData): Promise<PayloadResponse<boolean>> {
  const inquiryData = {
    yachtId: Number(formData.get('yachtId')),
    dateFrom: formData.get('dateFrom'),
    dateTo: formData.get('dateTo'),
    name: formData.get('name'),
    surname: formData.get('surname'),
    email: formData.get('email'),
    phone: formData.get('phone'),
    message: formData.get('message'),
  };

  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_BOAT_WS_API_URL}/public/inquiries`, {
      ...POST_REQUEST_PARAMETERS,
      body: JSON.stringify(inquiryData),
    });

    if (!response.ok) {
      const body: ErrorModel = await response.json();

      return { payload: false, message: body.message };
    }

    return { payload: true };
  } catch (error) {
    return { payload: false };
  }
}

export async function sendCustomOffer(state: any, formData: FormData): Promise<PayloadResponse<boolean>> {
  const inquiryData = {
    email: formData.get('email'),
    yachtIds: JSON.parse(formData.get('yachtIds') as string),
    dateFrom: formData.get('dateFrom'),
    dateTo: formData.get('dateTo'),
    did: JSON.parse(formData.get('did') as string),
    message: formData.get('message'),
  };

  try {
    const response = await authFetch(`${process.env.NEXT_PUBLIC_BOAT_WS_API_URL}/admin/custom-offers`, {
      ...POST_REQUEST_PARAMETERS,
      body: JSON.stringify(inquiryData),
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      const body: ErrorModel = await response.json();

      return { payload: false, message: body.message };
    }

    return { payload: true };
  } catch (error) {
    return { payload: false };
  }
}

export async function getInquiry(id: number): Promise<InquiriesModel | null> {
  try {
    const url = `${process.env.NEXT_PUBLIC_BOAT_WS_API_URL}/admin/inquiries/${id}`;
    const response = await authFetch(url, {
      headers: {
        'Content-Type': 'application/json',
      },
    });
    const inquiry: InquiriesModel = await response.json();

    if (!inquiry) {
      return null;
    }

    return inquiry;
  } catch {
    return null;
  }
}

export async function getCustomOfferRedirectUrl(hash: string): Promise<PayloadResponse<string | null>> {
  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_BOAT_WS_API_URL}/public/custom-offers/${hash}`, {
      redirect: 'manual',
    });

    if (response.status === 301 || response.status === 302) {
      const redirectUrl = response.headers.get('Location');

      if (redirectUrl) {
        return { payload: redirectUrl };
      }
    }

    return { payload: null };
  } catch (error) {
    return { payload: null };
  }
}
