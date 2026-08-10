'use server';

export interface VoucherValidation {
  valid: boolean;
  value?: number;
  currency?: string;
  validTo?: string;
  /** NOT_FOUND | NOT_ACTIVE | EXPIRED | MIN_TOTAL_NOT_MET — set when invalid. */
  reason?: string;
}

/**
 * Pre-redemption check for the checkout voucher field. Public endpoint on
 * purpose — the voucher is transferable (the code is the credential) and
 * guest checkout has no auth cookie at all. The atomic claim happens
 * server-side inside reservation creation, so this is display-only.
 */
export async function validateVoucher(code: string, total: number): Promise<VoucherValidation> {
  try {
    const params = new URLSearchParams({ code: code.trim().toUpperCase(), total: String(total) });
    const response = await fetch(`${process.env.NEXT_PUBLIC_BOAT_WS_API_URL}/public/vouchers/validate?${params}`, {
      cache: 'no-store',
    });

    if (!response.ok) {
      return { valid: false, reason: 'NOT_FOUND' };
    }

    return (await response.json()) as VoucherValidation;
  } catch {
    return { valid: false, reason: 'NOT_FOUND' };
  }
}
