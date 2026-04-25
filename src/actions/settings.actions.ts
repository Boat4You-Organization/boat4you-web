'use server';

/**
 * Fetches the configured card-payment surcharge as a percentage (0 if unset).
 * Backend endpoint: GET /public/settings/card-surcharge → { percentage: "5.00" }
 *
 * Returned as a plain number so callers can use it directly:
 *   const pct = await getCardSurchargePercentage();
 *   const total = base * (1 + pct / 100);
 */
export async function getCardSurchargePercentage(): Promise<number> {
  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_BOAT_WS_API_URL}/public/settings/card-surcharge`, {
      // Pricing setting changes rarely — cache for 5 minutes to avoid hammering backend.
      next: { revalidate: 300 },
    });

    if (!response.ok) return 0;

    const data: { percentage?: string } = await response.json();
    const parsed = Number(data.percentage);

    return Number.isFinite(parsed) && parsed >= 0 ? parsed : 0;
  } catch {
    // Fail-soft: if the setting can't be loaded, show base price (existing behavior).
    return 0;
  }
}

/**
 * Fetches the configured bank-transfer flat fee in EUR (0 if unset).
 * Backend endpoint: GET /public/settings/bank-transfer-fee → { amountEur: "32.00" }
 */
export async function getBankTransferFee(): Promise<number> {
  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_BOAT_WS_API_URL}/public/settings/bank-transfer-fee`, {
      next: { revalidate: 300 },
    });

    if (!response.ok) return 0;

    const data: { amountEur?: string } = await response.json();
    const parsed = Number(data.amountEur);

    return Number.isFinite(parsed) && parsed >= 0 ? parsed : 0;
  } catch {
    return 0;
  }
}
