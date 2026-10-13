'use server';

import { routing } from '@/i18n/routing';
import {
  CUSTOM_PAYMENT_STATUSES,
  PayConfig,
  PaymentStatusInfo,
  isPayReference,
  isPaymentRef,
} from '@/models/pay.model';
import { clientIp } from '@/utils/server/clientIp';
import { isPayLinkKey } from '@/utils/server/payLinkKey';

/**
 * Secret /pay/<key> page (backend /public/payments/custom). Plain fetch on the
 * Next server like the review form: no CORS, never cached, the visitor's IP
 * passed on as X-Forwarded-For because the backend rate-limits per client IP.
 * Results carry a reason code only — never a backend message.
 */

const SITE = 'boat4you';
const API = `${process.env.NEXT_PUBLIC_BOAT_WS_API_URL}/public/payments/custom`;
const TIMEOUT_MS = 5000;
const CREATE_TIMEOUT_MS = 20000;

export type PayFailureReason = 'validation' | 'notFound' | 'rateLimited' | 'unavailable' | 'provider' | 'error';

/** Form fields the backend can reject (its `amountMinor` is the form's `amount`). */
export type PayFormField = 'email' | 'reference' | 'amount';

export type PayConfigResult = { ok: true; config: PayConfig } | { ok: false; reason: PayFailureReason };

export type CreateCustomPaymentResult =
  | { ok: true; redirectUrl: string; ref: string }
  | { ok: false; reason: PayFailureReason; fields?: PayFormField[] };

export type CustomPaymentStatusResult = ({ ok: true } & PaymentStatusInfo) | { ok: false; reason: PayFailureReason };

export interface CreateCustomPaymentInput {
  linkKey: string;
  reference: string;
  amountMinor: number;
  email: string;
  locale: string;
}

const failureReason = (status: number): PayFailureReason => {
  switch (status) {
    case 400:
      return 'validation';
    case 404:
      return 'notFound';
    case 429:
      return 'rateLimited';
    case 502:
      return 'provider';
    case 503:
      return 'unavailable';
    default:
      return 'error';
  }
};

const BACKEND_FIELDS = new Map<string, PayFormField>([
  ['email', 'email'],
  ['reference', 'reference'],
  ['amountMinor', 'amount'],
]);

/** Form fields named in the backend's `{field=reason, …}` validation message (reasons are not shown). */
const rejectedFields = (message: unknown): PayFormField[] => {
  if (typeof message !== 'string') return [];

  const inner = message.slice(message.indexOf('{') + 1, message.lastIndexOf('}'));

  return Array.from(inner.matchAll(/(?:^|,\s*)([A-Za-z][\w.]*)=/g), m => BACKEND_FIELDS.get(m[1])).filter(
    (field): field is PayFormField => !!field
  );
};

const isMinorAmount = (value: unknown): value is number => Number.isSafeInteger(value) && (value as number) >= 0;

const requestHeaders = async (json = false): Promise<Record<string, string>> => {
  const ip = await clientIp();

  return {
    Accept: 'application/json',
    ...(json ? { 'Content-Type': 'application/json' } : {}),
    ...(ip ? { 'X-Forwarded-For': ip } : {}),
  };
};

export async function getPayConfig(linkKey: string): Promise<PayConfigResult> {
  if (!isPayLinkKey(linkKey)) return { ok: false, reason: 'notFound' };

  try {
    const query = new URLSearchParams({ site: SITE, linkKey });
    const response = await fetch(`${API}/config?${query}`, {
      cache: 'no-store',
      headers: await requestHeaders(),
      signal: AbortSignal.timeout(TIMEOUT_MS),
    });

    if (!response.ok) return { ok: false, reason: failureReason(response.status) };

    const { enabled, minAmountMinor, maxAmountMinor } = (await response.json()) as Partial<PayConfig>;

    if (!isMinorAmount(minAmountMinor) || !isMinorAmount(maxAmountMinor)) return { ok: false, reason: 'error' };

    return { ok: true, config: { enabled: enabled === true, minAmountMinor, maxAmountMinor } };
  } catch {
    return { ok: false, reason: 'error' };
  }
}

export async function createCustomPayment(input: CreateCustomPaymentInput): Promise<CreateCustomPaymentResult> {
  if (!isPayLinkKey(input?.linkKey)) return { ok: false, reason: 'notFound' };

  const reference = typeof input.reference === 'string' ? input.reference.trim() : '';
  const email = typeof input.email === 'string' ? input.email.trim() : '';
  const locale = routing.locales.find(l => l === input.locale) ?? routing.defaultLocale;
  const fields: PayFormField[] = [];

  if (!isPayReference(reference)) fields.push('reference');

  if (!email || email.length > 254) fields.push('email');

  if (!isMinorAmount(input.amountMinor) || input.amountMinor === 0) fields.push('amount');

  if (fields.length) return { ok: false, reason: 'validation', fields };

  try {
    const response = await fetch(`${API}/orders`, {
      method: 'POST',
      cache: 'no-store',
      headers: await requestHeaders(true),
      body: JSON.stringify({
        reference,
        amountMinor: input.amountMinor,
        email,
        acceptTerms: true,
        locale,
        site: SITE,
        linkKey: input.linkKey,
      }),
      // Creating the Revolut order is part of this call; the backend's own
      // client allows 15 s, so this waits a little longer than that.
      signal: AbortSignal.timeout(CREATE_TIMEOUT_MS),
    });

    if (response.ok) {
      const json = (await response.json().catch(() => null)) as { redirectUrl?: unknown; ref?: unknown } | null;

      if (typeof json?.redirectUrl !== 'string' || !isPaymentRef(json.ref)) return { ok: false, reason: 'error' };

      return { ok: true, redirectUrl: json.redirectUrl, ref: json.ref };
    }

    if (response.status === 400) {
      const json = (await response.json().catch(() => null)) as { message?: string } | null;

      return { ok: false, reason: 'validation', fields: rejectedFields(json?.message) };
    }

    return { ok: false, reason: failureReason(response.status) };
  } catch {
    return { ok: false, reason: 'error' };
  }
}

export async function getCustomPaymentStatus(ref: string): Promise<CustomPaymentStatusResult> {
  if (!isPaymentRef(ref)) return { ok: false, reason: 'notFound' };

  try {
    const response = await fetch(`${API}/orders/${ref}`, {
      cache: 'no-store',
      headers: await requestHeaders(),
      signal: AbortSignal.timeout(TIMEOUT_MS),
    });

    if (!response.ok) return { ok: false, reason: failureReason(response.status) };

    const json = (await response.json()) as { status?: unknown; amountMinor?: unknown; reference?: unknown };
    const status = CUSTOM_PAYMENT_STATUSES.find(s => s === json.status);

    if (!status || !isMinorAmount(json.amountMinor) || typeof json.reference !== 'string') {
      return { ok: false, reason: 'error' };
    }

    return { ok: true, status, amountMinor: json.amountMinor, reference: json.reference };
  } catch {
    return { ok: false, reason: 'error' };
  }
}
