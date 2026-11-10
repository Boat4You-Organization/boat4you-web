'use server';

import { KlarnaConfig, parseKlarnaCountries } from '@/models/klarna.model';

const TIMEOUT_MS = 5000;

/**
 * Whether Klarna is offered on booking payments: GET /public/payments/card/klarna.
 * 200 with a usable body → the config; 204, any other status, a timeout or a malformed body → null (no Klarna
 * option; the payment step never breaks because of this call).
 */
export async function getKlarnaConfig(): Promise<KlarnaConfig | null> {
  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_BOAT_WS_API_URL}/public/payments/card/klarna`, {
      headers: { Accept: 'application/json' },
      // Read on every payment step (one small call): switching Klarna off on the API takes effect at once.
      cache: 'no-store',
      signal: AbortSignal.timeout(TIMEOUT_MS),
    });

    if (response.status !== 200) return null;

    const json = (await response.json()) as {
      countries?: unknown;
      maxAmountMinor?: unknown;
      surchargePercent?: unknown;
    };
    const countries = parseKlarnaCountries(json?.countries);
    const { maxAmountMinor } = json;
    const surchargePercent = Number(json?.surchargePercent ?? 0);

    if (!countries || !Number.isSafeInteger(maxAmountMinor) || (maxAmountMinor as number) <= 0) return null;

    if (!Number.isFinite(surchargePercent) || surchargePercent < 0) return null;

    return { countries, maxAmountMinor: maxAmountMinor as number, surchargePercent };
  } catch {
    return null;
  }
}
