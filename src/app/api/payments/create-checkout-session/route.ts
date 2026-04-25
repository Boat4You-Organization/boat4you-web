import { NextRequest, NextResponse } from 'next/server';

import { POST_REQUEST_PARAMETERS } from '@/config/constants.config';
import { ErrorModel } from '@/models/error.model';
import { authFetch, hasAuthToken } from '@/utils/static/authFetch';

interface CreateCheckoutSessionResponse {
  /** Stripe-hosted Checkout URL. Populated when the backend runs the new DTO
   *  (`CheckoutSessionDto.redirectUrl`). Older builds won't include this. */
  redirectUrl?: string;
  /** Always present — Stripe session id the frontend can use with Stripe.js
   *  `redirectToCheckout({sessionId})` when a direct URL isn't available. */
  sessionIdOrOrderCode?: string;
  status?: string;
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { reservationId, payFullAmount, paymentPhaseId, idempotencyKey } = body;

    if (!reservationId) {
      return NextResponse.json({ error: 'Reservation ID is required' }, { status: 400 });
    }

    const params = new URLSearchParams();

    if (paymentPhaseId) {
      params.append('paymentPhaseId', paymentPhaseId.toString());
    } else {
      params.append('payFullAmount', payFullAmount.toString());
    }

    // Stripe Idempotency-Key — forward to the backend which passes it to
    // `Session.create(params, RequestOptions)`. Double-clicking "Pay now" then
    // returns the same Session instead of creating two.
    if (idempotencyKey) {
      params.append('idempotencyKey', idempotencyKey);
    }

    // Logged-in customers hit /secured/ via authFetch (which transparently
    // refreshes a stale access token) so the Stripe session is attributable
    // to their user id. Guests — and anyone whose refresh has also expired —
    // fall through to the public mirror.
    const hasAuth = await hasAuthToken();
    const securedUrl = `${process.env.NEXT_PUBLIC_BOAT_WS_API_URL}/secured/payments/stripe/create-checkout-session/${reservationId}?${params.toString()}`;
    const publicUrl = `${process.env.NEXT_PUBLIC_BOAT_WS_API_URL}/public/payments/stripe/create-checkout-session/${reservationId}?${params.toString()}`;
    const requestInit = { ...POST_REQUEST_PARAMETERS };

    let response = hasAuth ? await authFetch(securedUrl, requestInit) : await fetch(publicUrl, requestInit);

    if (hasAuth && (response.status === 401 || response.status === 403)) {
      response = await fetch(publicUrl, requestInit);
    }

    if (!response.ok) {
      const errorBody: ErrorModel = await response.json().catch(() => ({ message: `HTTP ${response.status}` }) as ErrorModel);

      return NextResponse.json({ error: errorBody.message ?? `HTTP ${response.status}` }, { status: response.status });
    }

    const responseData: CreateCheckoutSessionResponse = await response.json();

    return NextResponse.json(responseData);
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error('Create checkout session error:', error);

    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
