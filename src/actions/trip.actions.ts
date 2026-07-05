'use server';

import { authFetch, hasAuthToken } from '@/utils/static/authFetch';

export interface TripOwnerCredentials {
  participantId: number;
  participantKey: string;
  name: string;
  role: string;
}

/**
 * Claims (or re-fetches) the OWNER participant of a trip for the logged-in
 * booking owner. Called from the /trip SSR page — the backend verifies the
 * reservation really belongs to the session user. Fail-soft null: the
 * visitor simply gets the guest join flow instead.
 */
export async function claimTripOwner(token: string): Promise<TripOwnerCredentials | null> {
  try {
    if (!(await hasAuthToken())) return null;

    const response = await authFetch(
      `${process.env.NEXT_PUBLIC_BOAT_WS_API_URL}/secured/trip/${encodeURIComponent(token)}/owner`,
      { method: 'POST' }
    );

    if (!response.ok) return null;

    return (await response.json()) as TripOwnerCredentials;
  } catch {
    return null;
  }
}
