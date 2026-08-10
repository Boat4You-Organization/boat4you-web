/** Loyalty voucher applied at checkout — persisted in sessionStorage as `appliedVoucher`. */
export interface AppliedVoucher {
  code: string;
  value: number;
}
