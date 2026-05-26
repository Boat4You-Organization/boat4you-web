'use server';

import { POST_REQUEST_PARAMETERS } from '@/config/constants.config';
import { YachtSearchParams } from '@/config/form-models.config';
import { ErrorModel } from '@/models/error.model';
import {
  CreateReservationResponse,
  PaymentPhase,
  ReservationDetails,
  ReservationShortInfo,
} from '@/models/reservation.model';
import { Currency } from '@/models/user.model';
import { PayloadResponse } from '@/types/response.type';
import { authFetch, hasAuthToken } from '@/utils/static/authFetch';
import { createYachtQueryParams } from '@/utils/static/queryParams';

export async function getUserReservations(
  locale: string = 'en',
  currency: Currency = Currency.EUR
): Promise<PayloadResponse<ReservationShortInfo[]>> {
  try {
    const paramsWithCurrency = {
      ...(currency && { currency }),
    };

    const queryParams = createYachtQueryParams(paramsWithCurrency as YachtSearchParams);

    const response = await authFetch(
      `${process.env.NEXT_PUBLIC_BOAT_WS_API_URL}/secured/reservations/my-reservations${queryParams}`,
      {
        headers: {
          'Accept-Language': locale,
        },
      }
    );

    if (!response.ok) {
      const body: ErrorModel = await response.json();

      return { payload: [], message: body.message };
    }

    const payload = await response.json();

    return { payload };
  } catch (error) {
    return { payload: [], message: 'An unexpected error occurred while fetching user reservations' };
  }
}

export async function getReservationDetails(id: number): Promise<PayloadResponse<ReservationDetails>> {
  try {
    const response = await authFetch(
      `${process.env.NEXT_PUBLIC_BOAT_WS_API_URL}/secured/reservations/my-reservations/${id}`
    );

    if (!response.ok) {
      const body: ErrorModel = await response.json();

      return { payload: {} as ReservationDetails, message: body.message };
    }

    const payload = await response.json();

    return { payload };
  } catch (error) {
    return {
      payload: {} as ReservationDetails,
      message: 'An unexpected error occurred while fetching reservation details',
    };
  }
}

export async function createReservation(
  _state: unknown,
  data: FormData
): Promise<PayloadResponse<CreateReservationResponse | null>> {
  const requestBody = {
    yachtId: Number(data.get('yachtId')),
    offerId: Number(data.get('offerId')),
    name: data.get('name'),
    surname: data.get('surname'),
    email: data.get('email'),
    phoneNumber: data.get('phoneNumber'),
    specialRequest: data.get('specialRequest'),
    selectedExtras: JSON.parse((data.get('selectedExtras') as string) || '[]'),
  };

  // Logged-in customers go through /secured/ so the booking is attributed to
  // their account; guests hit /public/ where the backend finds-or-creates a
  // user from the email. authFetch transparently refreshes a stale access
  // token before we ever consider falling back.
  const hasAuth = await hasAuthToken();

  const securedUrl = `${process.env.NEXT_PUBLIC_BOAT_WS_API_URL}/secured/reservations`;
  const publicUrl = `${process.env.NEXT_PUBLIC_BOAT_WS_API_URL}/public/reservations`;
  const requestInit = {
    ...POST_REQUEST_PARAMETERS,
    body: JSON.stringify(requestBody),
  };

  try {
    let response = hasAuth ? await authFetch(securedUrl, requestInit) : await fetch(publicUrl, requestInit);

    // Refresh failed too (or somehow else 401/403). Final defense: book as
    // guest so the flow doesn't deadlock — backend matches by email.
    if (hasAuth && (response.status === 401 || response.status === 403)) {
      response = await fetch(publicUrl, requestInit);
    }

    if (!response.ok) {
      const body: ErrorModel = await response
        .json()
        .catch(() => ({ message: `HTTP ${response.status}` }) as ErrorModel);

      return { payload: null, message: body.message ?? `HTTP ${response.status}` };
    }

    return { payload: await response.json() };
  } catch (error) {
    return {
      payload: null,
      message: error instanceof Error ? error.message : 'Reservation request failed',
    };
  }
}

export async function cancelReservation(
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  state: any,
  { formData, reservationId }: { formData: FormData; reservationId: string }
): Promise<PayloadResponse<boolean>> {
  const specialRequest = formData.get('specialRequest');

  try {
    const response = await authFetch(
      `${process.env.NEXT_PUBLIC_BOAT_WS_API_URL}/secured/reservations/${reservationId}/cancel`,
      {
        ...POST_REQUEST_PARAMETERS,
        body: JSON.stringify({ specialRequest }),
      }
    );

    if (!response.ok) {
      const body: ErrorModel = await response.json();

      return { payload: false, message: body.message };
    }

    return { payload: true };
  } catch (error) {
    return {
      payload: false,
      message: error instanceof Error ? error.message : 'An unexpected error occurred',
    };
  }
}

export interface YachtSwapInfo {
  detectedAt: string;
  previousYachtId: number;
  previousYachtName: string | null;
  newYachtId: number | null;
  newYachtName: string | null;
  action: 'LOGGED_ONLY' | 'AUTO_UPDATED' | 'MANUAL_REVIEW';
  acknowledged: boolean;
  notes: string | null;
}

export async function getYachtSwapInfo(reservationId: number): Promise<PayloadResponse<YachtSwapInfo | null>> {
  try {
    const response = await authFetch(
      `${process.env.NEXT_PUBLIC_BOAT_WS_API_URL}/secured/reservations/${reservationId}/yacht-swap`
    );

    if (response.status === 204) {
      return { payload: null };
    }

    if (!response.ok) {
      const body: ErrorModel = await response.json();

      return { payload: null, message: body.message };
    }

    const payload = await response.json();

    return { payload };
  } catch (error) {
    return { payload: null, message: 'An unexpected error occurred while fetching yacht-swap info' };
  }
}

export async function acknowledgeYachtSwap(reservationId: number): Promise<PayloadResponse<boolean>> {
  try {
    const response = await authFetch(
      `${process.env.NEXT_PUBLIC_BOAT_WS_API_URL}/secured/reservations/${reservationId}/yacht-swap/acknowledge`,
      POST_REQUEST_PARAMETERS
    );

    if (!response.ok) {
      const body: ErrorModel = await response.json();

      return { payload: false, message: body.message };
    }

    return { payload: true };
  } catch (error) {
    return {
      payload: false,
      message: error instanceof Error ? error.message : 'An unexpected error occurred',
    };
  }
}

export async function calculatePaymentPhases(
  currentDate: string,
  reservationDateFrom: string,
  price: number,
  locale: string = 'en'
): Promise<PayloadResponse<PaymentPhase[]>> {
  try {
    const queryParams = createYachtQueryParams({
      currentDate,
      reservationDateFrom,
      price,
    } as YachtSearchParams);

    const response = await authFetch(
      `${process.env.NEXT_PUBLIC_BOAT_WS_API_URL}/secured/reservations/paymentPhases${queryParams}`,
      {
        headers: {
          'Accept-Language': locale,
        },
      }
    );

    if (!response.ok) {
      const body: ErrorModel = await response.json();

      return { payload: [], message: body.message };
    }

    const payload = await response.json();

    return { payload };
  } catch (error) {
    return { payload: [], message: 'An unexpected error occurred while fetching payment phases' };
  }
}

/**
 * Partner-aware payment-phase preview for the /enter-your-details screen,
 * before any reservation has been created. Backend looks up the offer by
 * (yachtId, dateFrom, dateTo) and applies partner-supplied installment ratios
 * against `clientTotalPrice` (which already includes any B4Y agency discount).
 *
 * Falls back to A/B/C internal rules server-side when no offer matches —
 * we still return phases so the UI never shows nothing.
 *
 * Public endpoint (no auth) so guest checkout works.
 */
export async function previewPaymentPhases(
  yachtId: number,
  dateFrom: string,
  dateTo: string,
  clientTotalPrice: number
): Promise<PayloadResponse<PaymentPhase[]>> {
  try {
    const params = new URLSearchParams({
      yachtId: yachtId.toString(),
      dateFrom,
      dateTo,
      clientTotalPrice: clientTotalPrice.toString(),
    });

    const response = await fetch(
      `${process.env.NEXT_PUBLIC_BOAT_WS_API_URL}/public/reservations/payment-phases-preview?${params.toString()}`
    );

    if (!response.ok) {
      const body: ErrorModel = await response.json();

      return { payload: [], message: body.message };
    }

    const payload = await response.json();

    return { payload };
  } catch (error) {
    return { payload: [], message: 'An unexpected error occurred while fetching payment phases preview' };
  }
}
