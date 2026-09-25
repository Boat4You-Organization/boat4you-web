'use server';

import { headers } from 'next/headers';

import { isReviewToken } from '@/utils/static/reviewToken';

/**
 * Guest review submit (magic link from the review request e-mail). Runs on
 * the Next server like the inquiry form, so no CORS; the visitor's IP is
 * passed on as X-Forwarded-For because the backend rate-limits the submit
 * per client IP (10/min) — without it every guest would share the web
 * server's one budget.
 */

export interface ReviewSubmitPayload {
  rating: number;
  scores: Record<string, number>;
  title: string;
  text: string;
  publishConsent: boolean;
  locale: string;
}

export type ReviewSubmitResult =
  | { ok: true; edited: boolean; editableUntil: string | null }
  | {
      ok: false;
      reason: 'expired' | 'editClosed' | 'validation' | 'rateLimited' | 'error';
      /** Field keys the backend rejected ("rating", "text", "scores.cleanliness"). */
      fields?: string[];
    };

/** Keys of the backend's `{field=reason, …}` validation message (reasons are English-only, not shown). */
const parseFieldKeys = (message: unknown): string[] => {
  if (typeof message !== 'string') return [];

  const inner = message.slice(message.indexOf('{') + 1, message.lastIndexOf('}'));

  return Array.from(inner.matchAll(/(?:^|,\s*)([A-Za-z][\w.]*)=/g), m => m[1]);
};

const clientIp = async (): Promise<string | null> => {
  const h = await headers();
  const realIp = h.get('x-real-ip')?.trim();

  if (realIp) return realIp;

  // Last element = the address our own nginx appended.
  return h.get('x-forwarded-for')?.split(',').pop()?.trim() || null;
};

export async function submitReview(token: string, payload: ReviewSubmitPayload): Promise<ReviewSubmitResult> {
  if (!isReviewToken(token)) return { ok: false, reason: 'expired' };

  const scores = Object.fromEntries(
    Object.entries(payload.scores ?? {}).filter(([, v]) => Number.isInteger(v) && v >= 1 && v <= 5)
  );
  const body = {
    rating: payload.rating,
    scores,
    title: payload.title?.trim() || null,
    text: payload.text?.trim() || null,
    publishConsent: !!payload.publishConsent,
    locale: payload.locale,
  };

  try {
    const ip = await clientIp();
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_BOAT_WS_API_URL}/public/reviews/request/${encodeURIComponent(token)}`,
      {
        method: 'POST',
        cache: 'no-store',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
          ...(ip ? { 'X-Forwarded-For': ip } : {}),
        },
        body: JSON.stringify(body),
      }
    );

    if (response.status === 200 || response.status === 201) {
      const json = (await response.json().catch(() => null)) as { editableUntil?: string } | null;

      return { ok: true, edited: response.status === 200, editableUntil: json?.editableUntil ?? null };
    }

    if (response.status === 404) return { ok: false, reason: 'expired' };

    if (response.status === 409) return { ok: false, reason: 'editClosed' };

    if (response.status === 429) return { ok: false, reason: 'rateLimited' };

    if (response.status === 400) {
      const json = (await response.json().catch(() => null)) as { message?: string } | null;

      return { ok: false, reason: 'validation', fields: parseFieldKeys(json?.message) };
    }

    return { ok: false, reason: 'error' };
  } catch {
    return { ok: false, reason: 'error' };
  }
}
