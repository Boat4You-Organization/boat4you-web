import { NextResponse } from 'next/server';

import { getLoggedInUser } from '@/actions/auth.actions';

// Anon-friendly endpoint the client-side UserSync polls on mount. Lets us
// keep cookies()/auth fetches out of the (root) layout — that's the change
// that flips the home from forced-dynamic to ISR/static. Always no-store:
// the cookie state can flip on a logout/login mid-session.
export const dynamic = 'force-dynamic';

export async function GET() {
  const user = await getLoggedInUser();

  return NextResponse.json(
    { user },
    {
      headers: { 'Cache-Control': 'private, no-store' },
    }
  );
}
