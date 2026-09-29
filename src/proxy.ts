import createIntlMiddleware from 'next-intl/middleware';
import { NextRequest, NextResponse } from 'next/server';

import { AuthKeys, POST_REQUEST_PARAMETERS } from './config/constants.config';
import { routing } from './i18n/routing';
import { GEO_COUNTRY_COOKIE_NAME, normalizeCountryCode } from './utils/static/geoCountryCookie';
import { isEnglishOnlyPath } from './utils/static/englishOnlyRoutes';

const intlMiddleware = createIntlMiddleware(routing);
// `/enter-your-details`, `/payment`, `/payment-pending`, `/payment-success` and
// `/payment-cancelled` are all public — guests must be able to complete the
// whole guest checkout flow (enter details → pay → confirmation) without an
// authenticated session. Pages that need richer reservation data fetch it via
// the authenticated API when possible, but gracefully fall back to the local
// reservation payload for guests.
const protectedRoutes = ['/my-profile', '/my-bookings', '/cancel-booking'];

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

// The name next-intl's middleware puts the resolved locale under for the
// request config (the same header createIntlMiddleware sets on rewrites).
const INTL_LOCALE_HEADER = 'X-NEXT-INTL-LOCALE';
const LOCALE_COOKIE_NAME = 'NEXT_LOCALE';
const LOCALE_PREFIX_PATTERN = /^\/[a-z]{2}(?=\/|$)/;

/**
 * Cache semantics of a response that went through locale detection (audit
 * 29.9.2026, R55). next.config's headers() gives every HTML response
 * `public, s-maxage=60`, but what this middleware answers depends on the
 * request: an un-prefixed URL is a 307 to `/de/…` for a visitor whose
 * NEXT_LOCALE cookie (or Accept-Language) says German and a 200 for everyone
 * else; a prefixed URL sets the cookie when it differs; the auth cookies
 * personalise the page. Nothing caches HTML today (nginx proxies straight
 * through), but the Bunny CDN plan would have served one visitor's redirect
 * to the next. So: `Vary: Cookie` on every response (plus Accept-Language
 * where the locale is negotiated from it), and a private response whenever
 * the request carries a cookie of ours — the public s-maxage stays for
 * cookie-less requests only. A shared cache must still key on the GeoIP
 * country (b4y_country) or leave HTML out.
 */
function withCacheHeaders(req: NextRequest, response: NextResponse): NextResponse {
  const hasLocalePrefix = LOCALE_PREFIX_PATTERN.test(req.nextUrl.pathname);
  const isRedirect = response.status >= 300 && response.status < 400;

  response.headers.append('Vary', hasLocalePrefix ? 'Cookie' : 'Cookie, Accept-Language');

  const hasOwnCookie =
    req.cookies.has(LOCALE_COOKIE_NAME) || req.cookies.has(AuthKeys.ACCESS_TOKEN) || req.cookies.has(AuthKeys.REFRESH_TOKEN);

  if (isRedirect || hasOwnCookie) {
    // Overrides next.config's public rule for this response (the router
    // applies middleware headers after the config headers).
    response.headers.set('Cache-Control', 'private, max-age=0');
  }

  return response;
}

// nginx GeoIP2 sends `X-Country-Code` on every proxied request. Mirror it into
// a cookie the browser can read (NOT httpOnly) so client components — the phone
// field's dial-code default — know the visitor's country without a third-party
// lookup. Absent header (dev, no nginx) → leave whatever cookie is there.
function withGeoCountryCookie(req: NextRequest, response: NextResponse): NextResponse {
  const country = normalizeCountryCode(req.headers.get('x-country-code'));

  if (country && req.cookies.get(GEO_COUNTRY_COOKIE_NAME)?.value !== country) {
    response.cookies.set(GEO_COUNTRY_COOKIE_NAME, country, {
      path: '/',
      maxAge: 60 * 60 * 24 * 365,
      sameSite: 'lax',
      secure: true,
    });
  }

  return withCacheHeaders(req, response);
}

/**
 * English-only content (the blog posts, englishOnlyRoutes.ts) is served on
 * its un-prefixed URL to every visitor: the page itself answers 308 from a
 * locale copy (`/de/blog/x` → `/blog/x`, audit R40), so the locale detection
 * must not send a visitor with a German cookie straight back to `/de/blog/x`
 * (an endless 307 ↔ 308 loop). These requests skip next-intl's detection and
 * are rewritten to the default locale, the way the intl middleware rewrites
 * an un-prefixed EN request — without touching the visitor's locale cookie.
 */
function englishOnlyResponse(req: NextRequest): NextResponse {
  const url = req.nextUrl.clone();

  url.pathname = `/${routing.defaultLocale}${req.nextUrl.pathname}`;

  const headers = new Headers(req.headers);

  headers.set(INTL_LOCALE_HEADER, routing.defaultLocale);

  return NextResponse.rewrite(url, { request: { headers } });
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

      return withGeoCountryCookie(req, response);
    }

    if (isProtectedRoute) {
      return withGeoCountryCookie(req, NextResponse.redirect(new URL(`/${currentLocale}`, req.url)));
    }
  }

  if (isProtectedRoute && !accessToken) {
    return withGeoCountryCookie(req, NextResponse.redirect(new URL(`/${currentLocale}`, req.url)));
  }

  if (isEnglishOnlyPath(pathname)) {
    return withGeoCountryCookie(req, englishOnlyResponse(req));
  }

  return withGeoCountryCookie(req, intlMiddleware(req) || NextResponse.next());
}

export const config = {
  matcher: ['/((?!api|trip|pdf-image|_next/static|_next/image|favicon|favicons|robots|sitemap|manifest|.*\\..*$).*)'],
};
