'use client';

import { useEffect, useState } from 'react';

import { useSearchParams } from 'next/navigation';

import { CharterType, MainSailType, VesselType } from '@/models/yacht.model';

/**
 * Bucket aggregates for the V2 filter sidebar — feeds histograms and
 * per-option counts. Backend endpoint is `/public/yachts/distribution`
 * (added in Phase 2). This file holds the contract + a passthrough
 * hook so V2 atoms can already consume it; if the request fails or
 * the endpoint isn't deployed yet, the hook just returns `null` and
 * atoms render with no histograms / `—` counts.
 */
export interface FilterDistribution {
  /** Bar heights for the price slider, normalized externally. ~50 bars. */
  priceHistogram?: number[];
  /** Median EUR price across the candidate set, used as the "median €X"
   *  hint next to the slider's current value. */
  priceMedian?: number;
  /** Min / max EUR price across the candidate set. Drives the price
   *  slider's dynamic upper bound so bars span the full track instead of
   *  crowding the cheap end (gulets / luxury yachts can exceed €100k). */
  priceMin?: number;
  priceMax?: number;
  /** Bar heights for the length slider. ~25 bars. */
  lengthHistogram?: number[];
  /** Bar heights for the engine slider. ~25 bars. */
  engineHistogram?: number[];
  /** Per-yacht-type count, used inside YachtTypeGrid tiles. */
  byVesselType?: Partial<Record<VesselType, number>>;
  /** Per-charter-type count, used in the Rental type checks. */
  byCharterType?: Partial<Record<CharterType, number>>;
  /** Per-mainsail count for the mainsail checks. */
  byMainsailType?: Partial<Record<MainSailType, number>>;
  /** Cabins-N → count, for the pill segment hover/popover (future). */
  byCabins?: Record<number, number>;
  /** manufacturer.id → distinct yacht count under the other active filters.
   *  Manufacturer dropdown greys out entries missing from this map. */
  byManufacturer?: Record<number, number>;
  /** model.id → distinct yacht count (other filters applied). Model dropdown
   *  greys out entries missing from this map. */
  byModel?: Record<number, number>;
  /** equipment.id → distinct yacht count (other filters applied). Amenities
   *  dropdown greys out entries missing from this map. */
  byAmenity?: Record<number, number>;
}

/**
 * Re-fetches the distribution whenever the search querystring changes.
 * Server-side caches by querystring hash so the hot loop (drag a
 * slider → debounced search refresh + this) stays cheap. When the
 * endpoint is unavailable (404 / network error / pre-Phase-2 backend),
 * the hook returns `null` and the sidebar still renders functionally
 * — just without histograms and per-option counts.
 */
export const useFilterDistribution = (): FilterDistribution | null => {
  const searchParams = useSearchParams();
  // Next.js 16 + Turbopack returns a new `URLSearchParams` ref on every render
  // even when the URL hasn't changed. Depend on the serialized string instead
  // so the effect only fires on real URL changes (avoids fetch loop).
  const qs = searchParams.toString();
  const [distribution, setDistribution] = useState<FilterDistribution | null>(null);

  useEffect(() => {
    let cancelled = false;
    const url = `${process.env.NEXT_PUBLIC_BOAT_WS_API_URL}/public/yachts/distribution${qs ? `?${qs}` : ''}`;

    fetch(url)
      .then(res => (res.ok ? res.json() : null))
      .then((data: FilterDistribution | null) => {
        if (!cancelled) setDistribution(data);
      })
      .catch(() => {
        if (!cancelled) setDistribution(null);
      });

    return () => {
      cancelled = true;
    };
  }, [qs]);

  return distribution;
};
