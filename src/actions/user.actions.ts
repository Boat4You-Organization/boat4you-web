'use server';

import { revalidatePath } from 'next/cache';

import { PATCH_REQUEST_PARAMETERS, POST_REQUEST_PARAMETERS } from '@/config/constants.config';
import { ProfileFormValues, SignUpFormValues } from '@/config/form-models.config';
import { ErrorModel } from '@/models/error.model';
import { Currency, Language, UserModel } from '@/models/user.model';
import { PayloadResponse } from '@/types/response.type';
import { authFetch } from '@/utils/static/authFetch';

export interface UpdateUserParams {
  id: number;
  updateData: ProfileFormValues;
  path: string;
}

export interface UpdateMyProfileParams {
  id: number;
  name: string;
  surname: string;
  email: string;
  phoneNumber?: string | null;
  address?: string | null;
  city?: string | null;
  country?: string | null;
  /** ISO yyyy-MM-dd. Backend accepts LocalDate; null/undefined leaves the
   *  existing value untouched (PATCH semantics). */
  birthday?: string | null;
  path?: string;
}
export interface UpdateUserPreferencesParams {
  id: number;
  language: Language;
  currency: Currency;
  path: string;
}

export async function updateUser(params: UpdateUserParams): Promise<PayloadResponse<boolean>> {
  const { id, updateData, path } = params;

  try {
    const response = await authFetch(`${process.env.NEXT_PUBLIC_BOAT_WS_API_URL}/users/${id}`, {
      ...POST_REQUEST_PARAMETERS,
      body: JSON.stringify(updateData),
    });

    if (!response.ok) {
      const body: ErrorModel = await response.json();

      return { payload: false, message: body.message };
    }

    revalidatePath(path);

    return { payload: true };
  } catch (error) {
    return { payload: false, message: 'An unexpected error occurred while updating user data' };
  }
}

// Self-service profile edit — only sends basic contact fields (name, surname,
// email, phoneNumber). Unlike `updateUser` (which requires admin), this one
// lets the logged-in user edit their own record.
export async function updateMyProfile(params: UpdateMyProfileParams): Promise<PayloadResponse<boolean>> {
  const { id, name, surname, email, phoneNumber, address, city, country, birthday, path } = params;

  try {
    const response = await authFetch(`${process.env.NEXT_PUBLIC_BOAT_WS_API_URL}/users/${id}/profile`, {
      ...PATCH_REQUEST_PARAMETERS,
      body: JSON.stringify({ name, surname, email, phoneNumber, address, city, country, birthday }),
    });

    if (!response.ok) {
      const body: ErrorModel = await response.json();

      return { payload: false, message: body.message };
    }

    if (path) revalidatePath(path);

    return { payload: true };
  } catch (error) {
    return { payload: false, message: 'An unexpected error occurred while updating your profile' };
  }
}

export async function updateUserPreferences(params: UpdateUserPreferencesParams): Promise<PayloadResponse<boolean>> {
  const { id, language, currency, path } = params;

  try {
    const queryParams = new URLSearchParams({ language, currency });
    const response = await authFetch(
      `${process.env.NEXT_PUBLIC_BOAT_WS_API_URL}/users/${id}/updatePreferences?${queryParams.toString()}`,
      PATCH_REQUEST_PARAMETERS
    );

    if (!response.ok) {
      const body: ErrorModel = await response.json();

      return { payload: false, message: body.message };
    }

    revalidatePath(path);

    return { payload: true };
  } catch (error) {
    return {
      payload: false,
      message: 'An unexpected error occurred while updating user preferences',
    };
  }
}

export async function checkInviteCode(inviteCode: string): Promise<PayloadResponse<boolean>> {
  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_BOAT_WS_API_URL}/users/invite?inviteCode=${encodeURIComponent(inviteCode)}`
    );

    if (!response.ok) {
      const body: ErrorModel = await response.json();

      return { payload: false, message: body.message };
    }

    return { payload: true };
  } catch (error) {
    return { payload: false, message: 'An unexpected error occurred while checking invite code' };
  }
}

export async function signUpUser(
  inviteCode: string,
  payload: Pick<SignUpFormValues, 'password'>
): Promise<PayloadResponse<UserModel | null>> {
  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_BOAT_WS_API_URL}/users/invite?inviteCode=${encodeURIComponent(inviteCode)}`,
      {
        ...POST_REQUEST_PARAMETERS,
        body: JSON.stringify(payload),
      }
    );

    if (!response.ok) {
      const body: ErrorModel = await response.json();

      return { payload: null, message: body.message };
    }

    return { payload: await response.json() };
  } catch (error) {
    return { payload: null, message: 'An unexpected error occurred while signing up user' };
  }
}

// Guest password setup after a successful booking — replaces the invite-code
// flow when a guest has just finished paying and wants to create an account.
// The reservation id + email pair proves ownership of the booking (the email
// must match the one on the reservation, case-insensitive).
export async function setPasswordForReservation(params: {
  reservationId: number;
  email: string;
  password: string;
}): Promise<PayloadResponse<boolean>> {
  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_BOAT_WS_API_URL}/public/users/set-password-for-reservation`,
      {
        ...POST_REQUEST_PARAMETERS,
        body: JSON.stringify(params),
      }
    );

    if (!response.ok) {
      const body: ErrorModel = await response.json();

      return { payload: false, message: body.message };
    }

    return { payload: true };
  } catch (error) {
    return {
      payload: false,
      message: 'An unexpected error occurred while setting your password',
    };
  }
}
