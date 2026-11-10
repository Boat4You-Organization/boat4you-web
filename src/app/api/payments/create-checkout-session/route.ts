import { NextRequest, NextResponse } from 'next/server';

import { POST_REQUEST_PARAMETERS } from '@/config/constants.config';
import { ErrorModel } from '@/models/error.model';
import { sanitizeKlarnaBilling } from '@/models/klarna.model';
import { clientIp } from '@/utils/server/clientIp';
import { authFetch, hasAuthToken } from '@/utils/static/authFetch';

interface CreateCheckoutSessionResponse {
  /** Hosted checkout URL of the card provider (Mollie; Stripe only behind the backend switch). */
  redirectUrl?: string;
  /** Provider reference of the checkout (Mollie payment id / Stripe session id). */
  sessionIdOrOrderCode?: string;
  status?: string;
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { reservationId, payFullAmount, paymentPhaseId, idempotencyKey, locale } = body;

    if (!reservationId) {
      return NextResponse.json({ error: 'Reservation ID is required' }, { status: 400 });
    }

    // Klarna: the billing address (personal data) goes to the backend in the request body, never in the URL.
    // Without it the call is the card checkout exactly as before.
    const klarna = body.klarna === undefined ? null : sanitizeKlarnaBilling(body.klarna);

    if (body.klarna !== undefined && !klarna) {
      return NextResponse.json({ error: 'Invalid billing address' }, { status: 400 });
    }

    const params = new URLSearchParams();

    if (paymentPhaseId) {
      params.append('paymentPhaseId', paymentPhaseId.toString());
    } else {
      params.append('payFullAmount', payFullAmount.toString());
    }

    // Idempotency key — forwarded to the backend, which passes it to the card provider. Double-clicking "Pay now"
    // then returns the same checkout instead of creating two.
    if (idempotencyKey) {
      params.append('idempotencyKey', idempotencyKey);
    }

    // The web locale: the provider sends the payer back to the success / cancel page in this language.
    if (typeof locale === 'string' && /^[a-z]{2}$/.test(locale)) {
      params.append('locale', locale);
    }

    // Logged-in customers hit /secured/ via authFetch (which transparently
    // refreshes a stale access token) so the card checkout is attributable
    // to their user id. Guests — and anyone whose refresh has also expired —
    // fall through to the public mirror.
    const hasAuth = await hasAuthToken();
    const securedUrl = `${process.env.NEXT_PUBLIC_BOAT_WS_API_URL}/secured/payments/card/create-checkout-session/${reservationId}?${params.toString()}`;
    const publicUrl = `${process.env.NEXT_PUBLIC_BOAT_WS_API_URL}/public/payments/card/create-checkout-session/${reservationId}?${params.toString()}`;
    // The visitor's IP: the backend rate-limits guest card checkouts per client IP.
    const ip = await clientIp();
    const requestInit = {
      ...POST_REQUEST_PARAMETERS,
      headers: { ...POST_REQUEST_PARAMETERS.headers, ...(ip ? { 'X-Forwarded-For': ip } : {}) },
      ...(klarna ? { body: JSON.stringify({ klarna }) } : {}),
    };

    let response = hasAuth ? await authFetch(securedUrl, requestInit) : await fetch(publicUrl, requestInit);

    if (hasAuth && (response.status === 401 || response.status === 403)) {
      response = await fetch(publicUrl, requestInit);
    }

    if (!response.ok) {
      const errorBody: ErrorModel = await response
        .json()
        .catch(() => ({ message: `HTTP ${response.status}` }) as ErrorModel);

      // `code` lets the browser tell "Klarna not available" (8107) from other refusals.
      return NextResponse.json(
        { error: errorBody.message ?? `HTTP ${response.status}`, code: errorBody.code },
        { status: response.status }
      );
    }

    const responseData: CreateCheckoutSessionResponse = await response.json();

    return NextResponse.json(responseData);
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error('Create checkout session error:', error);

    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
