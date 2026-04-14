import createIntlMiddleware from 'next-intl/middleware';
import { NextRequest, NextResponse } from 'next/server';

import { AuthKeys, POST_REQUEST_PARAMETERS } from './config/constants.config';
import { routing } from './i18n/routing';

const intlMiddleware = createIntlMiddleware(routing);
const protectedRoutes = [
  '/my-profile',
  '/my-bookings',
  '/enter-your-details',
  '/payment-success',
  '/payment-cancelled',
  '/payment-pending',
  '/cancel-booking',
];

async function refreshAccessToken(refreshToken: string): Promise<string | null> {
  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_BOAT_WS_API_URL}/auth/refreshToken`, {
      ...POST_REQUEST_PARAMETERS,
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
        Authorization: `Bearer ${refreshToken}`,
      },
    });

    if (response.ok) {
      const { token: newAccessToken } = await response.json();

      return newAccessToken;
    }
  } catch (error) {
    // Skip
  }

  return null;
}

export async function proxy(req: NextRequest) {
  const { pathname } = req.nextUrl;
  const pathnameWithoutLocale = pathname.replace(/^\/[a-z]{2}(?=\/|$)/, '') || '/';

  const isProtectedRoute = protectedRoutes.some(route => pathnameWithoutLocale.startsWith(route));

  const localeMatch = pathname.match(/^\/([a-z]{2})(?=\/|$)/);
  const currentLocale = localeMatch?.[1] || routing.defaultLocale;

  const accessToken = req.cookies.get(AuthKeys.ACCESS_TOKEN)?.value;
  const refreshToken = req.cookies.get(AuthKeys.REFRESH_TOKEN)?.value;

  if (!accessToken && refreshToken) {
    const newAccessToken = await refreshAccessToken(refreshToken);

    if (newAccessToken) {
      const response = intlMiddleware(req) || NextResponse.next();

      response.cookies.set(AuthKeys.ACCESS_TOKEN, newAccessToken, {
        httpOnly: true,
        secure: true,
        sameSite: 'lax',
        path: '/',
        maxAge: 60 * 60 * 24 * 7,
      });

      return response;
    }

    if (isProtectedRoute) {
      return NextResponse.redirect(new URL(`/${currentLocale}`, req.url));
    }
  }

  if (isProtectedRoute && !accessToken) {
    return NextResponse.redirect(new URL(`/${currentLocale}`, req.url));
  }

  return intlMiddleware(req) || NextResponse.next();
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon|favicons|robots|sitemap|manifest|.*\\..*$).*)'],
};
