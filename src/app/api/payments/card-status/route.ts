import { NextRequest, NextResponse } from 'next/server';

import { POST_REQUEST_PARAMETERS } from '@/config/constants.config';

/** Our checkout token (`?paymentRef=` of the success page) — anything else never reaches the backend. */
const PAYMENT_REF = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

/**
 * Status of an online-booking card checkout for /payment-success: the card provider (Mollie) also sends payers who
 * did NOT pay back to the success URL, so the page asks first. Answers `{ status }` =
 * PAYMENT_SUCCESS | PAYMENT_PENDING | PAYMENT_NOT_COMPLETED, or `{ status: 'UNKNOWN' }`.
 */
export async function POST(request: NextRequest) {
  try {
    const { paymentRef } = (await request.json()) as { paymentRef?: unknown };

    if (typeof paymentRef !== 'string' || !PAYMENT_REF.test(paymentRef)) {
      return NextResponse.json({ status: 'UNKNOWN' }, { status: 400 });
    }

    const response = await fetch(
      `${process.env.NEXT_PUBLIC_BOAT_WS_API_URL}/public/payments/card/checkPaymentStatus/${paymentRef}`,
      { ...POST_REQUEST_PARAMETERS, cache: 'no-store', signal: AbortSignal.timeout(8000) }
    );

    if (!response.ok) return NextResponse.json({ status: 'UNKNOWN' });

    const data = (await response.json()) as { status?: unknown };
    const status = typeof data.status === 'string' ? data.status : 'UNKNOWN';

    return NextResponse.json({ status }, { headers: { 'Cache-Control': 'no-store' } });
  } catch {
    return NextResponse.json({ status: 'UNKNOWN' });
  }
}
