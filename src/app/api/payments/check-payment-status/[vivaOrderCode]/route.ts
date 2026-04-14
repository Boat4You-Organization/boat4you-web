import { NextRequest, NextResponse } from 'next/server';

import { POST_REQUEST_PARAMETERS } from '@/config/constants.config';
import { ErrorModel } from '@/models/error.model';
import { PaymentStatusResponse } from '@/types/response.type';
import { authHeaders } from '@/utils/static/tokenUtils';

export async function POST(_: NextRequest, { params }: { params: Promise<{ vivaOrderCode: string }> }) {
  try {
    const { vivaOrderCode } = await params;

    if (!vivaOrderCode) {
      return NextResponse.json({ error: 'Viva Order Code is required' }, { status: 400 });
    }

    const response = await fetch(
      // Payment status is now resolved via Stripe (Viva retired). The path
      // parameter keeps its old name for route-shape backward compatibility;
      // the value it carries is a Stripe orderCode/sessionId at runtime.
      `${process.env.NEXT_PUBLIC_BOAT_WS_API_URL}/secured/payments/stripe/checkPaymentStatus/${vivaOrderCode}`,
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

      return NextResponse.json(
        {
          error: errorBody.message || 'Failed to verify payment status',
        },
        { status: response.status }
      );
    }

    const paymentData: PaymentStatusResponse = await response.json();

    return NextResponse.json({
      vivaOrderCode: paymentData.sessionIdOrOrderCode,
      status: paymentData.status,
    });
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error('Payment verification error:', error);

    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
