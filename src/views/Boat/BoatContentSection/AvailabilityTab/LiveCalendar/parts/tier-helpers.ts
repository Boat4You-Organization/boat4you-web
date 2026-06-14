// Pure logic utilities — extracted from Mario's availability-widget handoff
// so the React components stay declarative. No JSX here.
/* eslint-disable no-nested-ternary -- vendored price-tier + label logic */
import { CURRENCY_SYMBOL_MAP, Currency } from '@/models/user.model';

import { T } from './tokens';

// 'booked'  → RESERVATION (partner reservation) — hard-block.
// 'service' → SERVICE (maintenance / owner block) — hard-block, distinct tier.
// 'option'  → live partner option — selectable, routes to inquiry.
export type WeekStatus = 'available' | 'option' | 'booked' | 'service' | 'selected';

export interface WeekData {
  /** Stable identifier — used as React key + backend offer id. */
  id: string;
  /** Display label for the start date, e.g. "Apr 25". */
  from: string;
  /** Display label for the end date, e.g. "May 02". */
  to: string;
  /** Short month name of the start date (used for the X-axis under the heatmap), e.g. "Apr". */
  fromMonth: string;
  /** Final (broker / discounted) per-week price in EUR — what the customer
   *  actually pays. Formatted via `fmtPrice`. */
  price: number;
  /** Optional regular / list price BEFORE discount. When present and
   *  greater than `price`, the card renders `regularPrice` struck through
   *  with the % savings beside it. From backend's `totalPriceEur`. */
  regularPrice?: number;
  /** ISO-4217 currency of `price`/`regularPrice` (e.g. 'AUD', 'USD'). When set,
   *  `fmtPrice` renders that currency's symbol; undefined falls back to EUR.
   *  Sourced from the offer's `clientPriceInfo.currency` (the backend converts
   *  when the offer fetch passes ?currency=). */
  currency?: string;
  /** Visual state — drives badge + heatmap cell. */
  status: WeekStatus;
  /** Optional pre-computed price tier (0..3). If absent, `withTiers` derives it. */
  tier?: 0 | 1 | 2 | 3;
  /** Raw backend offer references — passed through so click handlers can hand them to `calculatePriceForOffer`. */
  raw?: unknown;
  /** ISO `dateFrom` / `dateTo` so click handlers can hydrate valtio store. */
  dateFromIso?: string;
  dateToIso?: string;
}

/** Human-readable status label rendered inside the pill badge. */
export const statusLabel = (s: WeekStatus): string =>
  s === 'booked'
    ? 'Reserved'
    : s === 'service'
      ? 'Unavailable'
      : s === 'option'
        ? 'Pre-reserved'
        : s === 'selected'
          ? 'Selected'
          : 'Available';

/** Foreground + background colour pair for the status pill. */
export const statusColor = (s: WeekStatus): { fg: string; bg: string } => {
  if (s === 'booked') return { fg: '#B91C1C', bg: '#FEE2E2' };

  // SERVICE — slate hard-block, visually distinct from a red RESERVATION.
  if (s === 'service') return { fg: '#475569', bg: '#E2E8F0' };

  if (s === 'option') return { fg: T.amber, bg: T.amberSoft };

  if (s === 'selected') return { fg: T.navy, bg: '#E0E7FF' };

  return { fg: T.greenDeep, bg: T.greenSoft };
};

/** Price-tier → heatmap cell background. */
export const tierBg = (t: 0 | 1 | 2 | 3): string => [T.tierLow, T.tierMid, T.tierHigh, T.tierPeak][t];

/** Croatian-locale price formatter — `9.945 €`, or `15.745 A$` when a currency
 *  is given. `maximumFractionDigits: 0` strips any trailing `.00` the Italy
 *  backend ships (Mario rule 12.5.2026 — "na italy, cijena bez .00"). The
 *  symbol mirrors `formatPriceWithCurrency` (CURRENCY_SYMBOL_MAP) so the week
 *  cards match the detail box + booking panel for AUD/USD/etc.; no `currency`
 *  → EUR. */
export const fmtPrice = (n: number, currency?: string): string => {
  const symbol = currency ? (CURRENCY_SYMBOL_MAP[currency as Currency] ?? currency) : '€';

  return `${new Intl.NumberFormat('hr-HR', { maximumFractionDigits: 0 }).format(n)} ${symbol}`;
};

/**
 * Auto-derive a price tier (0..3) per week relative to the min/max of the
 * full season. Buckets: `< 25 %`, `< 50 %`, `< 85 %`, else top. Skipped when
 * the caller already provided a tier.
 */
export const withTiers = (weeks: WeekData[]): WeekData[] => {
  if (weeks.length === 0) return weeks;

  const prices = weeks.map(w => w.price).filter(p => Number.isFinite(p) && p > 0);

  if (prices.length === 0) {
    return weeks.map(w => ({ ...w, tier: w.tier ?? 0 }));
  }

  const min = Math.min(...prices);
  const max = Math.max(...prices);
  const range = max - min;

  return weeks.map(w => {
    if (w.tier !== undefined) return w;

    if (!Number.isFinite(w.price) || w.price <= 0 || range === 0) return { ...w, tier: 0 };

    const f = (w.price - min) / range;
    const tier: 0 | 1 | 2 | 3 = f < 0.25 ? 0 : f < 0.5 ? 1 : f < 0.85 ? 2 : 3;

    return { ...w, tier };
  });
};

/** Unique month labels in order — feeds the axis underneath the heatmap strip. */
export const monthAxis = (weeks: WeekData[]): string[] => {
  const months: string[] = [];

  weeks.forEach(w => {
    if (!months.includes(w.fromMonth)) months.push(w.fromMonth);
  });

  return months;
};
