'use server';

import { revalidatePath } from 'next/cache';
import { cookies } from 'next/headers';

import { AuthKeys, POST_REQUEST_PARAMETERS, PUT_REQUEST_PARAMETERS } from '@/config/constants.config';
import { ErrorModel } from '@/models/error.model';
import { UserModel } from '@/models/user.model';
import { PayloadResponse } from '@/types/response.type';
import { authFetch } from '@/utils/static/authFetch';
import { authHeaders } from '@/utils/static/tokenUtils';

/* eslint-disable @typescript-eslint/no-explicit-any */

export type LoginResponse = {
  token: string;
  refreshToken: string;
  userId: string;
};

export type LoginResult = {
  success: boolean;
  message?: string;
  user?: UserModel;
};

export type LogoutResult = {
  success: boolean;
  message?: string;
};

interface ResetPasswordPayload {
  passwordResetCode: string;
  formData: FormData;
}

export type UpdatePasswordParams = {
  oldPassword: string;
  newPassword: string;
};

export type RefreshTokenResult = {
  success: boolean;
  message?: string;
  user?: UserModel;
};

export async function getLoggedInUser(): Promise<UserModel | null> {
  const cookieStore = await cookies();
  const accessToken = cookieStore.get(AuthKeys.ACCESS_TOKEN)?.value;

  if (!accessToken) {
    return null;
  }

  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_BOAT_WS_API_URL}/auth/me`, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });

    if (!response.ok) {
      await response.text();

      return null;
    }

    const user = await response.json();

    return user;
  } catch (error) {
    return null;
  }
}

export async function login(state: any, formData: FormData): Promise<LoginResult> {
  const email = formData.get('email');
  const password = formData.get('password');

  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_BOAT_WS_API_URL}/auth/login`, {
      ...POST_REQUEST_PARAMETERS,
      body: JSON.stringify({ email, password }),
    });

    if (!response.ok) {
      const errorData = await response.json();

      return {
        success: false,
        message: errorData.message || 'Login failed',
      };
    }

    const data: LoginResponse = await response.json();

    const cookieStore = await cookies();
    // `secure: true` blocks cookies over plain HTTP. In local dev we run on
    // http://localhost:3000 and the browser silently drops the cookie, so
    // the session never forms even though the API returned a valid token.
    const isProd = process.env.NODE_ENV === 'production';

    cookieStore.set(AuthKeys.ACCESS_TOKEN, data.token, {
      httpOnly: true,
      secure: isProd,
      maxAge: 60 * 60 * 24 * 7,
      sameSite: 'lax',
      path: '/',
    });

    cookieStore.set(AuthKeys.REFRESH_TOKEN, data.refreshToken, {
      httpOnly: true,
      secure: isProd,
      maxAge: 60 * 60 * 24 * 30,
      sameSite: 'lax',
      path: '/',
    });

    // Fetch the user DIRECTLY with the fresh token. We can't use
    // `getLoggedInUser()` here because `cookieStore.set()` isn't visible
    // within the same server action tick — the new cookie only becomes
    // readable on the NEXT request. Without this, `state.user` ends up
    // undefined and the LoginModal useEffect never fires (no modal close,
    // no toast, no setUser) — producing the "login does nothing" symptom.
    try {
      const meResponse = await fetch(`${process.env.NEXT_PUBLIC_BOAT_WS_API_URL}/auth/me`, {
        headers: {
          Authorization: `Bearer ${data.token}`,
        },
      });

      if (meResponse.ok) {
        const user: UserModel = await meResponse.json();

        return { success: true, user };
      }
    } catch (userError) {
      // Skip user fetch error — session is valid, just missing user data
    }

    return { success: true };
  } catch (error) {
    return {
      success: false,
      message: 'An unexpected error occurred during login',
    };
  }
}

/** Account info readout for /my-profile (member-since, last login, bookings, email verified). */
export async function getMyAccountInfo(): Promise<{
  memberSince: string;
  lastLoginAt: string | null;
  totalBookings: number;
  emailVerified: boolean;
} | null> {
  try {
    const response = await authFetch(`${process.env.NEXT_PUBLIC_BOAT_WS_API_URL}/users/me/account-info`, {
      method: 'GET',
    });

    if (!response.ok) return null;

    return await response.json();
  } catch {
    return null;
  }
}

/** Resends the email-verification code to the logged-in user. */
export async function resendMyVerification(): Promise<{ success: boolean; message?: string }> {
  try {
    const response = await authFetch(`${process.env.NEXT_PUBLIC_BOAT_WS_API_URL}/users/me/resend-verification`, {
      method: 'POST',
    });

    if (!response.ok) {
      let message = `Resend failed (HTTP ${response.status})`;

      try {
        const body = await response.json();

        message = body?.message ?? message;
      } catch {
        /* ignore */
      }

      return { success: false, message };
    }

    return { success: true };
  } catch (error) {
    return { success: false, message: error instanceof Error ? error.message : 'Unexpected error' };
  }
}

/**
 * GDPR Article 20 — Right to Data Portability. Calls backend
 * `GET /users/me/export` and triggers a browser download of the resulting
 * JSON file (everything the system holds about the customer: profile,
 * reservations, payment phases, custom offers, GDPR activity log).
 */
export async function downloadMyData(): Promise<{ success: boolean; message?: string }> {
  try {
    const response = await authFetch(`${process.env.NEXT_PUBLIC_BOAT_WS_API_URL}/users/me/export`, {
      method: 'GET',
    });

    if (!response.ok) {
      return { success: false, message: `Export failed (HTTP ${response.status})` };
    }

    // Server-side: stream the body back to the browser by re-emitting it as
    // a Response. We can't return a Blob from a server action — instead pass
    // the raw text and the filename header so the client wrapper can build
    // the download URL there. (Implemented in `useDataExportDownload` hook
    // on the client.)
    const filename =
      response.headers.get('content-disposition')?.match(/filename="?([^";]+)"?/)?.[1] ??
      `boat4you-data-export-${Date.now()}.json`;
    const body = await response.text();

    return { success: true, message: JSON.stringify({ filename, body }) };
  } catch (error) {
    return {
      success: false,
      message: error instanceof Error ? error.message : 'Unexpected error',
    };
  }
}

/**
 * GDPR right-to-erasure (Article 17). Calls backend `DELETE /users/me` which
 * anonymizes PII (name/surname/email/phone/address → blanked or tombstoned),
 * revokes auth tokens, drops role assignments, and stamps `deleted_at`.
 *
 * Reservation history (`reservation_flow.user_id` FK) is preserved so the
 * agency keeps the financial/audit trail — only the customer identity is
 * detached. After a 200 response we clear local cookies (the backend has
 * already invalidated tokens, but the cookie still holds the now-stale JWT
 * until we clear it).
 */
export async function deleteMyAccount(): Promise<{ success: boolean; message?: string }> {
  const cookieStore = await cookies();

  try {
    const response = await authFetch(`${process.env.NEXT_PUBLIC_BOAT_WS_API_URL}/users/me`, {
      method: 'DELETE',
    });

    if (!response.ok) {
      let message = 'Failed to delete account';

      try {
        const body = await response.json();

        message = body?.message ?? message;
      } catch {
        // ignore
      }

      return { success: false, message };
    }
  } catch (error) {
    return {
      success: false,
      message: error instanceof Error ? error.message : 'Unexpected error',
    };
  }

  cookieStore.delete(AuthKeys.ACCESS_TOKEN);
  cookieStore.delete(AuthKeys.REFRESH_TOKEN);
  cookieStore.delete(AuthKeys.USER_ID);
  revalidatePath('/', 'layout');

  return { success: true };
}

export async function logout(): Promise<{ success: boolean }> {
  const cookieStore = await cookies();

  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_BOAT_WS_API_URL}/auth/logout`, {
      method: 'GET',
      headers: await authHeaders(),
    });

    if (response.ok) {
      await response.text();
    }
  } catch (error) {
    // Ignore API errors
  }

  cookieStore.delete(AuthKeys.ACCESS_TOKEN);
  cookieStore.delete(AuthKeys.REFRESH_TOKEN);
  cookieStore.delete(AuthKeys.USER_ID);

  revalidatePath('/', 'layout');

  return { success: true };
}

export async function updatePassword(payload: UpdatePasswordParams): Promise<PayloadResponse<boolean>> {
  try {
    const response = await authFetch(`${process.env.NEXT_PUBLIC_BOAT_WS_API_URL}/auth/updatePassword`, {
      ...POST_REQUEST_PARAMETERS,
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      const body: ErrorModel = await response.json();

      return { payload: false, message: body.message };
    }

    return { payload: true };
  } catch (error) {
    return { payload: false };
  }
}

export async function requestPasswordReset(state: any, formData: FormData) {
  const email = formData.get('email');

  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_BOAT_WS_API_URL}/auth/requestPasswordReset`, {
      ...POST_REQUEST_PARAMETERS,
      body: JSON.stringify({ email }),
    });

    if (!response.ok) {
      const errorData = await response.json();

      return {
        message: errorData.message || 'Request password failed',
      };
    }

    return { success: true };
  } catch (error) {
    return {
      message: 'An unexpected error occurred during request password',
    };
  }
}

export async function checkPasswordResetCode(state: any, passwordResetCode: string) {
  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_BOAT_WS_API_URL}/auth/resetPassword?passwordResetCode=${encodeURIComponent(passwordResetCode)}`
    );

    if (!response.ok) {
      const body: ErrorModel = await response.json();

      return { payload: false, message: body.message };
    }

    return { payload: true };
  } catch (error) {
    return { payload: false };
  }
}

export async function resetPassword(state: any, payload: ResetPasswordPayload) {
  const { formData, passwordResetCode } = payload;
  const password = formData.get('password');

  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_BOAT_WS_API_URL}/auth/resetPassword?passwordResetCode=${encodeURIComponent(passwordResetCode)}`,
      {
        ...POST_REQUEST_PARAMETERS,
        body: JSON.stringify({ password }),
      }
    );

    if (!response.ok) {
      const errorData = await response.json();

      return {
        message: errorData.message,
      };
    }

    return { success: true };
  } catch (error) {
    return {
      message: 'An unexpected error occurred during reset password',
    };
  }
}

export async function register(state: any, formData: FormData): Promise<PayloadResponse<{ email: string } | null>> {
  const name = formData.get('name');
  const surname = formData.get('surname');
  const password = formData.get('password');
  const email = formData.get('email');

  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_BOAT_WS_API_URL}/auth/register`, {
      ...PUT_REQUEST_PARAMETERS,
      body: JSON.stringify({ name, surname, password, email }),
    });

    if (!response.ok) {
      const errorData: ErrorModel = await response.json();

      return { payload: null, message: errorData.message };
    }

    // Enumeration-safe backend returns 204 (no body) whether or not the email
    // already has an account. Echo the email back so the confirm step knows
    // which address to verify; if the account already existed the user instead
    // receives a "you already have an account" email and any code entered just
    // fails — no existence signal reaches the client.
    return { payload: { email: String(email ?? '') } };
  } catch (error) {
    return { payload: null, message: 'An unexpected error occurred during registration' };
  }
}

export async function verifyEmail(state: any, formData: FormData): Promise<LoginResult> {
  const cookieStore = await cookies();
  const email = formData.get('email');
  const verificationCode = formData.get('verificationCode');

  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_BOAT_WS_API_URL}/auth/register/verifyEmail`, {
      ...POST_REQUEST_PARAMETERS,
      body: JSON.stringify({ email, verificationCode }),
    });

    if (!response.ok) {
      const errorData: ErrorModel = await response.json();

      return { success: false, message: errorData.message };
    }

    const data: LoginResponse = await response.json();
    const isProd = process.env.NODE_ENV === 'production';

    cookieStore.set(AuthKeys.ACCESS_TOKEN, data.token, {
      httpOnly: true,
      secure: isProd,
      maxAge: 60 * 60 * 24 * 7,
      sameSite: 'lax',
      path: '/',
    });

    cookieStore.set(AuthKeys.REFRESH_TOKEN, data.refreshToken, {
      httpOnly: true,
      secure: isProd,
      maxAge: 60 * 60 * 24 * 30,
      sameSite: 'lax',
      path: '/',
    });

    // Fetch the user DIRECTLY with the fresh token. `getLoggedInUser()` reads the cookie we
    // just set, which isn't visible within the same server-action tick — it would return null,
    // leaving state.user undefined so the header stays logged-out and the user "logs in" again.
    // Mirrors login().
    try {
      const meResponse = await fetch(`${process.env.NEXT_PUBLIC_BOAT_WS_API_URL}/auth/me`, {
        headers: {
          Authorization: `Bearer ${data.token}`,
        },
      });

      if (meResponse.ok) {
        const user: UserModel = await meResponse.json();

        return { success: true, user };
      }
    } catch (userError) {
      // Skip user fetch error — session is valid, just missing user data
    }

    return { success: true };
  } catch (error) {
    return { success: false, message: 'An unexpected error occurred during email verification' };
  }
}

export async function resendVerificationCode(state: any, formData: FormData): Promise<PayloadResponse<boolean>> {
  const email = formData.get('email');

  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_BOAT_WS_API_URL}/auth/register/resendVerificationCode`, {
      ...POST_REQUEST_PARAMETERS,
      body: JSON.stringify({ email }),
    });

    if (!response.ok) {
      const errorData: ErrorModel = await response.json();

      return { payload: false, message: errorData.message };
    }

    return { payload: true };
  } catch (error) {
    return { payload: false, message: 'An unexpected error occurred during resend verification code' };
  }
}
