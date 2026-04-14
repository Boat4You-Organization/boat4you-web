import { NextRequest, NextResponse } from 'next/server';

import { POST_REQUEST_PARAMETERS } from '@/config/constants.config';
import { ErrorModel } from '@/models/error.model';
import { authHeaders } from '@/utils/static/tokenUtils';

interface CreateCheckoutSessionResponse {
  /** Stripe-hosted Checkout URL. Populated when the backend runs the new DTO
   *  (`CheckoutSessionDto.redirectUrl`). Older builds won't include this. */
  redirectUrl?: string;
  /** Present on the newer backend build for backwards-compat (Viva-style). */
  orderCode?: string;
  /** Always present — Stripe session id the frontend can use with Stripe.js
   *  `redirectToCheckout({sessionId})` when a direct URL isn't available. */
  sessionIdOrOrderCode?: string;
  status?: string;
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { reservationId, payFullAmount, paymentPhaseId } = body;

    if (!reservationId) {
      return NextResponse.json({ error: 'Reservation ID is required' }, { status: 400 });
    }

    const params = new URLSearchParams();

    if (paymentPhaseId) {
      params.append('paymentPhaseId', paymentPhaseId.toString());
    } else {
      params.append('payFullAmount', payFullAmount.toString());
    }

    const response = await fetch(
      // Card payments now go through Stripe (Viva has been retired — its
      // backend routes still exist for historical compatibility but nothing
      // on the web frontend calls them).
      `${process.env.NEXT_PUBLIC_BOAT_WS_API_URL}/secured/payments/stripe/create-checkout-session/${reservationId}?${params.toString()}`,
      {
        ...POST_REQUEST_PARAMETERS,
        headers: {
          ...Object.fromEntries((await authHeaders()).entries()),
          'Content-Type': 'application/json',
        },
      }
    );

    if (!response.ok) {
      const errorBody: ErrorModel = await response.json();

      return NextResponse.json({ error: errorBody.message }, { status: response.status });
    }

    const responseData: CreateCheckoutSessionResponse = await response.json();

    return NextResponse.json(responseData);
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error('Create checkout session error:', error);

    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
