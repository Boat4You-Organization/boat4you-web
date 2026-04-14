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
import { createYachtQueryParams } from '@/utils/static/queryParams';
import { authHeaders } from '@/utils/static/tokenUtils';

export async function getUserReservations(
  locale: string = 'en',
  currency: Currency = Currency.EUR
): Promise<PayloadResponse<ReservationShortInfo[]>> {
  try {
    const paramsWithCurrency = {
      ...(currency && { currency }),
    };

    const queryParams = createYachtQueryParams(paramsWithCurrency as YachtSearchParams);

    const response = await fetch(
      `${process.env.NEXT_PUBLIC_BOAT_WS_API_URL}/secured/reservations/my-reservations${queryParams}`,
      {
        headers: {
          ...Object.fromEntries((await authHeaders()).entries()),
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
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_BOAT_WS_API_URL}/secured/reservations/my-reservations/${id}`,
      {
        headers: {
          ...Object.fromEntries((await authHeaders()).entries()),
        },
      }
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

  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_BOAT_WS_API_URL}/secured/reservations`, {
      ...POST_REQUEST_PARAMETERS,
      headers: {
        ...Object.fromEntries((await authHeaders()).entries()),
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(requestBody),
    });

    if (!response.ok) {
      const body: ErrorModel = await response.json();

      return { payload: null, message: body.message };
    }

    return { payload: await response.json() };
  } catch (error) {
    return {
      payload: null,
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
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_BOAT_WS_API_URL}/secured/reservations/${reservationId}/cancel`,
      {
        ...POST_REQUEST_PARAMETERS,
        headers: {
          ...Object.fromEntries((await authHeaders()).entries()),
          'Content-Type': 'application/json',
        },
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

    const response = await fetch(
      `${process.env.NEXT_PUBLIC_BOAT_WS_API_URL}/secured/reservations/paymentPhases${queryParams}`,
      {
        headers: {
          ...Object.fromEntries((await authHeaders()).entries()),
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
