import { cache } from 'react';

import 'server-only';

import { VesselType } from '@/models/yacht.model';

/**
 * Landing-page charter facts, precomputed nightly by the backend (V9_61,
 * `CharterFactsJob` 08:00 UTC) and served from one row:
 * `GET /public/charter-facts?did=c-54[&vesselType=CATAMARAN]`.
 *
 * Every figure except activeBoats / currency / window is optional — the
 * backend drops a figure computed from fewer than 5 values. 404 = no row
 * (below the backend's own ≥10-boat key rule, or before the first nightly
 * run); any failure renders no block.
 */

// The row is recomputed once a night (08:00 UTC); a six-hour window keeps a
// cached copy for stale-while-revalidate instead of a cold 2.5 s fetch that
// dropped the block on slow renders (audit B13: EN italy, ES spain, PT france).
const REVALIDATE_SECONDS = 21600;
const TIMEOUT_MS = 2500;
const DID_PATTERN = /^[clr]-\d{1,12}$/;

export interface MonthPrice {
  /** "2026-10" */
  month: string;
  p25: number | null;
  median: number | null;
  p75: number | null;
  offers: number;
}

export interface CharterFacts {
  did: string;
  vesselType: VesselType | null;
  computedAt: string;
  activeBoats: number;
  priceByMonth?: MonthPrice[];
  cheapestMonth?: string;
  priciestMonth?: string;
  skipperWeekly?: { median: number; p25: number | null; p75: number | null; n: number };
  obligatoryExtrasWeekly?: { median: number; n: number };
  deposit?: { min: number | null; median: number; max: number | null; n: number };
  /** ISO day names ("SATURDAY") with their share of week starts (0.625). */
  checkInDays?: Array<{ day: string; share: number }>;
  medianBuildYear?: number;
  topModels?: Array<{ manufacturer: string | null; model: string; count: number }>;
  topBases?: Array<{ locationId: number; name: string; count: number; did: string }>;
  currency: string;
  windowFrom?: string;
  windowTo?: string;
}

const isFacts = (value: unknown): value is CharterFacts =>
  !!value &&
  typeof value === 'object' &&
  typeof (value as CharterFacts).activeBoats === 'number' &&
  typeof (value as CharterFacts).computedAt === 'string';

/** Facts for one did (× boat type), or null — never throws, never waits past TIMEOUT_MS. */
export const fetchCharterFacts = cache(
  async (did: string, vesselType: VesselType | null): Promise<CharterFacts | null> => {
    if (!DID_PATTERN.test(did)) return null;

    const query = new URLSearchParams({ did });

    if (vesselType) query.set('vesselType', vesselType);

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_BOAT_WS_API_URL}/public/charter-facts?${query}`, {
        next: { revalidate: REVALIDATE_SECONDS },
        signal: AbortSignal.timeout(TIMEOUT_MS),
      });

      if (!response.ok) return null;

      const json: unknown = await response.json();

      return isFacts(json) && json.activeBoats > 0 ? json : null;
    } catch {
      return null;
    }
  }
);

/**
 * The one did a landing's facts are keyed by: a single did, or — for a
 * dual-source marina resolved to several same-name `l-` records — the first
 * (the backend folds same-name marinas into each `l-` key). Several regions
 * or a mix have no single facts row, so no block.
 */
export const factsDidFor = (dids: string[]): string | null => {
  if (dids.length === 1) return dids[0];

  return dids.length > 1 && dids.every(d => d.startsWith('l-')) ? [...dids].sort()[0] : null;
};
