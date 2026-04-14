'use server';

import { revalidatePath } from 'next/cache';
import { cookies } from 'next/headers';

import { AuthKeys, POST_REQUEST_PARAMETERS, PUT_REQUEST_PARAMETERS } from '@/config/constants.config';
import { ErrorModel } from '@/models/error.model';
import { UserModel } from '@/models/user.model';
import { PayloadResponse } from '@/types/response.type';
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

    cookieStore.set(AuthKeys.ACCESS_TOKEN, data.token, {
      httpOnly: true,
      secure: true,
      maxAge: 60 * 60 * 24 * 7,
      sameSite: 'lax',
      path: '/',
    });

    cookieStore.set(AuthKeys.REFRESH_TOKEN, data.refreshToken, {
      httpOnly: true,
      secure: true,
      maxAge: 60 * 60 * 24 * 30,
      sameSite: 'lax',
      path: '/',
    });

    try {
      const user = await getLoggedInUser();

      if (user) {
        return { success: true, user };
      }
    } catch (userError) {
      // Skip user fetch error
    }

    return { success: true };
  } catch (error) {
    return {
      success: false,
      message: 'An unexpected error occurred during login',
    };
  }
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
    const response = await fetch(`${process.env.NEXT_PUBLIC_BOAT_WS_API_URL}/auth/updatePassword`, {
      ...POST_REQUEST_PARAMETERS,
      headers: {
        ...POST_REQUEST_PARAMETERS.headers,
        ...Object.fromEntries((await authHeaders()).entries()),
      },
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

export async function register(state: any, formData: FormData): Promise<PayloadResponse<UserModel | null>> {
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

    const result: UserModel = await response.json();

    return { payload: result };
  } catch (error) {
    return { payload: null, message: 'An unexpected error occurred during registration' };
  }
}

export async function verifyEmail(state: any, formData: FormData): Promise<LoginResult> {
  const cookieStore = await cookies();
  const userId = formData.get('userId');
  const verificationCode = formData.get('verificationCode');

  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_BOAT_WS_API_URL}/auth/register/verifyEmail`, {
      ...POST_REQUEST_PARAMETERS,
      body: JSON.stringify({ userId, verificationCode }),
    });

    if (!response.ok) {
      const errorData: ErrorModel = await response.json();

      return { success: false, message: errorData.message };
    }

    const data: LoginResponse = await response.json();

    cookieStore.set(AuthKeys.ACCESS_TOKEN, data.token, {
      httpOnly: true,
      secure: true,
      maxAge: 60 * 60 * 24 * 7,
      sameSite: 'lax',
      path: '/',
    });

    cookieStore.set(AuthKeys.REFRESH_TOKEN, data.refreshToken, {
      httpOnly: true,
      secure: true,
      maxAge: 60 * 60 * 24 * 30,
      sameSite: 'lax',
      path: '/',
    });

    try {
      const user = await getLoggedInUser();

      if (user) {
        return { success: true, user };
      }
    } catch (userError) {
      // Skip user fetch error
    }

    return { success: true };
  } catch (error) {
    return { success: false, message: 'An unexpected error occurred during email verification' };
  }
}

export async function resendVerificationCode(state: any, formData: FormData): Promise<PayloadResponse<boolean>> {
  const userId = formData.get('userId');

  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_BOAT_WS_API_URL}/auth/register/resendVerificationCode/${userId}`,
      {
        ...POST_REQUEST_PARAMETERS,
      }
    );

    if (!response.ok) {
      const errorData: ErrorModel = await response.json();

      return { payload: false, message: errorData.message };
    }

    return { payload: true };
  } catch (error) {
    return { payload: false, message: 'An unexpected error occurred during resend verification code' };
  }
}
