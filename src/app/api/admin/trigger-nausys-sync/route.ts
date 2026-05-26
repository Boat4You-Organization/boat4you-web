import { NextResponse } from 'next/server';

import { authFetch } from '@/utils/static/authFetch';

/**
 * Dev-only convenience route to manually trigger NauSys offer sync from a
 * logged-in admin browser session. The actual admin endpoint
 * (`/admin/nausys/offer`) requires a SYSTEM_ADMIN JWT, which lives in an
 * HttpOnly cookie — so client-side `fetch` from DevTools can't reach it.
 * This route runs server-side, where `authFetch` reads the cookie, attaches
 * the Bearer header, and forwards to the backend.
 *
 * Usage: open http://localhost:3000/api/admin/trigger-nausys-sync in a
 * browser tab where you're already logged in as admin. Backend returns
 * immediately (sync runs in the background — watch backend logs for
 * progress). Safe to remove once the post-deploy backfill is done.
 */
export async function GET() {
  try {
    const response = await authFetch(`${process.env.NEXT_PUBLIC_BOAT_WS_API_URL}/admin/nausys/offer`, {
      method: 'GET',
    });

    if (!response.ok) {
      const body = await response.text();

      return NextResponse.json({ status: 'error', httpStatus: response.status, body }, { status: response.status });
    }

    return NextResponse.json({
      status: 'triggered',
      message: 'NauSys offer sync started — watch backend logs for progress (~30-40 min).',
    });
  } catch (error) {
    return NextResponse.json(
      { status: 'error', message: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}
