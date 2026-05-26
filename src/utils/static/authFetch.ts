import { cookies } from 'next/headers';
import 'server-only';

import { AuthKeys } from '@/config/constants.config';

interface RefreshTokenResponse {
  token: string;
  refreshToken: string;
  userId?: string | number;
}

async function tryRefresh(refreshToken: string): Promise<string | null> {
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_BOAT_WS_API_URL}/auth/refreshToken`, {
      method: 'POST',
      headers: { Authorization: `Bearer ${refreshToken}` },
    });

    if (!res.ok) return null;

    const data = (await res.json()) as RefreshTokenResponse;

    return data.token ?? null;
  } catch {
    return null;
  }
}

function buildHeaders(init: RequestInit | undefined, accessToken: string | null): Headers {
  const headers = new Headers(init?.headers);

  if (accessToken) headers.set('Authorization', `Bearer ${accessToken}`);

  return headers;
}

/**
 * Authenticated server-side fetch with transparent JWT refresh.
 *
 * Reads the access + refresh token cookies, attaches `Authorization: Bearer
 * <access>`, and on a 401/403 calls `/auth/refreshToken` with the refresh
 * token. If refresh succeeds, the request is retried with the new access
 * token; the new token is also persisted to the cookie when the calling
 * context allows it (Server Action / Route Handler). If refresh fails, the
 * original failed response is returned so the caller can fall back to a
 * /public/ mirror or surface the error.
 *
 * Cookie writes throw inside RSC render — that path is swallowed and the
 * fresh token only lives for this request. The next call will re-refresh,
 * which is acceptable since refresh is fast and only triggers after the
 * access token has been invalidated (e.g. backend restart / token rotation).
 */
export async function authFetch(input: string | URL, init?: RequestInit): Promise<Response> {
  const cookieStore = await cookies();
  const accessToken = cookieStore.get(AuthKeys.ACCESS_TOKEN)?.value ?? null;
  const refreshToken = cookieStore.get(AuthKeys.REFRESH_TOKEN)?.value ?? null;

  const firstResponse = await fetch(input, { ...init, headers: buildHeaders(init, accessToken) });

  const isAuthFailure = firstResponse.status === 401 || firstResponse.status === 403;

  if (!isAuthFailure || !refreshToken) {
    return firstResponse;
  }

  const newAccessToken = await tryRefresh(refreshToken);

  if (!newAccessToken) {
    return firstResponse;
  }

  try {
    cookieStore.set(AuthKeys.ACCESS_TOKEN, newAccessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      maxAge: 60 * 60 * 24 * 7,
      sameSite: 'lax',
      path: '/',
    });
  } catch {
    // RSC render — cookies are read-only here. The retry below still uses
    // the new token in-memory; the next request will refresh again.
  }

  return fetch(input, { ...init, headers: buildHeaders(init, newAccessToken) });
}

/** Whether the current request carries an access-token cookie. Useful for
 *  callers with a guest fallback that decide /secured/ vs /public/ before
 *  the fetch happens. */
export async function hasAuthToken(): Promise<boolean> {
  return Boolean((await cookies()).get(AuthKeys.ACCESS_TOKEN)?.value);
}
