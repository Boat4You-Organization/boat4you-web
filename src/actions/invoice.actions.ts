'use server';

import { ErrorModel } from '@/models/error.model';
import { InvoiceModel } from '@/models/invoices.model';
import { PayloadResponse } from '@/types/response.type';
import { authFetch } from '@/utils/static/authFetch';
import { createQueryParams } from '@/utils/static/queryParams';

export async function getInvoiceByReservation(reservationId: number): Promise<PayloadResponse<InvoiceModel>> {
  try {
    const queryParams = createQueryParams({ reservationId });

    const response = await authFetch(
      `${process.env.NEXT_PUBLIC_BOAT_WS_API_URL}/secured/invoices${queryParams}`,
    );

    if (!response.ok) {
      const body: ErrorModel = await response.json();

      return { payload: {} as InvoiceModel, message: body.message };
    }

    const payload = await response.json();

    return { payload };
  } catch (error) {
    return {
      payload: {} as InvoiceModel,
      message: 'An unexpected error occurred while fetching invoice details',
    };
  }
}

export async function getInvoiceById(id: number): Promise<PayloadResponse<InvoiceModel>> {
  try {
    const response = await authFetch(`${process.env.NEXT_PUBLIC_BOAT_WS_API_URL}/secured/invoices/${id}`);

    if (!response.ok) {
      const body: ErrorModel = await response.json();

      return { payload: {} as InvoiceModel, message: body.message };
    }

    const payload = await response.json();

    return { payload };
  } catch (error) {
    return {
      payload: {} as InvoiceModel,
      message: 'An unexpected error occurred while fetching invoice details',
    };
  }
}
