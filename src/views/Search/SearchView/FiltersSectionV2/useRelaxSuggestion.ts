'use client';

import { useEffect, useState } from 'react';

import { useSearchParams } from 'next/navigation';

/**
 * Server-side suggestion of which active filter, if dropped, would
 * unlock the most additional boats for the current candidate set.
 * Drives the AI hint strip per design handoff. Backend endpoint:
 *   GET /public/yachts/relax-suggest?{currentParams}
 *
 * Response shape:
 *   { paramKeys: ["minBuildYear","maxBuildYear"],
 *     label: "Year ≥ 2018",
 *     delta: 47 }
 *
 * Hook returns `null` when:
 *   - the suggestion endpoint isn't deployed (404 / network error)
 *   - the delta is below the surface threshold (server-side ≥ 20)
 *   - no filters are active (no relaxation possible)
 *
 * The hint UI is purely additive — the rest of the sidebar works
 * regardless of whether suggestions arrive.
 */
export interface RelaxSuggestion {
  /** URL param keys to clear when the user clicks "Relax filter". */
  paramKeys: string[];
  /** Human-readable label shown in the hint strip. */
  label: string;
  /** Boats that would appear if the named filter were removed. */
  delta: number;
}

export const useRelaxSuggestion = (): RelaxSuggestion | null => {
  const searchParams = useSearchParams();
  // Next.js 16 + Turbopack returns a new `URLSearchParams` ref on every render
  // even when the URL hasn't changed. Depend on the serialized string instead
  // so the effect only fires on real URL changes (avoids fetch loop).
  const qs = searchParams.toString();
  const [suggestion, setSuggestion] = useState<RelaxSuggestion | null>(null);

  useEffect(() => {
    let cancelled = false;
    const url = `${process.env.NEXT_PUBLIC_BOAT_WS_API_URL}/public/yachts/relax-suggest${qs ? `?${qs}` : ''}`;

    fetch(url)
      .then(res => (res.ok ? res.json() : null))
      .then((data: RelaxSuggestion | null) => {
        if (cancelled) return;

        if (!data || data.delta < 20) {
          setSuggestion(null);
        } else {
          setSuggestion(data);
        }
      })
      .catch(() => {
        if (!cancelled) setSuggestion(null);
      });

    return () => {
      cancelled = true;
    };
  }, [qs]);

  return suggestion;
};
