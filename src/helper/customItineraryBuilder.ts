import { CUSTOM_LEGS, CUSTOM_STOPS, CustomLeg, CustomStop } from '@/config/itinerary/customLegs.config';

/**
 * Suggestion engine for the tailor-made itinerary builder (Mario +
 * colleague, 7.8.2026). Every offered hop is REALISTIC by construction:
 * primary candidates are actual day-legs sailed by our curated routes
 * (with their day copy attached), topped up with same-country stops a
 * sensible day-sail away when the graph is thin. A trip must be able to
 * close back at its start marina, so every suggestion keeps the return
 * reachable within the remaining days.
 */

/** Comfortable single-day range under sail (NM over ground, coastal). */
export const MIN_DAY_NM = 3;
export const MAX_DAY_NM = 42;

/** Planning ceiling used for the "can we still get home" feasibility check. */
const MAX_RETURN_DAY_NM = 38;

const STOP_BY_KEY: Map<string, CustomStop> = new Map(CUSTOM_STOPS.map(s => [s.key, s]));
const LEGS_FROM: Map<string, CustomLeg[]> = (() => {
  const map = new Map<string, CustomLeg[]>();

  CUSTOM_LEGS.forEach(leg => {
    const list = map.get(leg.from) ?? [];

    list.push(leg);
    map.set(leg.from, list);
  });

  return map;
})();

export const stopByKey = (key: string): CustomStop | undefined => STOP_BY_KEY.get(key);

/** First curated day that ARRIVES at a stop — its copy describes that
 *  destination, so days without an exact curated leg still carry our
 *  existing texts on the PDF (Mario 7.8: no new texts, reuse what we have). */
const CONTENT_BY_STOP: Map<string, { ns: string; routeId: string; day: number }> = (() => {
  const map = new Map<string, { ns: string; routeId: string; day: number }>();

  CUSTOM_LEGS.forEach(leg => {
    if (leg.ns && leg.routeId && leg.day !== undefined && !map.has(leg.to)) {
      map.set(leg.to, { ns: leg.ns, routeId: leg.routeId, day: leg.day });
    }
  });

  return map;
})();

export const stopContentRef = (stopKey: string): { ns: string; routeId: string; day: number } | undefined =>
  CONTENT_BY_STOP.get(stopKey);

const toRad = (deg: number) => (deg * Math.PI) / 180;

/** Great-circle distance with a 1.15 coastal-detour factor, in NM. */
export const legNm = (a: CustomStop, b: CustomStop): number => {
  const R = 3440.065;
  const h =
    Math.sin(toRad(b.lat - a.lat) / 2) ** 2 +
    Math.cos(toRad(a.lat)) * Math.cos(toRad(b.lat)) * Math.sin(toRad(b.lng - a.lng) / 2) ** 2;

  return Math.max(2, Math.round(2 * R * Math.asin(Math.sqrt(h)) * 1.15));
};

export interface Suggestion {
  stop: CustomStop;
  nm: number;
  /** Curated-route day describing this exact hop (localized copy lives in
   *  the referenced message namespace); undefined = distance-based hop. */
  content?: { ns: string; routeId: string; day: number };
  /** True when this suggestion is the start marina (closing the loop). */
  isReturn: boolean;
}

/**
 * Rank next-stop options from `currentKey`. Guarantees: within day-sail
 * range, not just visited, same charter waters, and the start marina
 * stays reachable in the remaining days. On the final day only the
 * return to start is offered.
 */
export const suggestNext = (
  currentKey: string,
  startKey: string,
  visitedKeys: string[],
  remainingDays: number
): Suggestion[] => {
  const current = STOP_BY_KEY.get(currentKey);
  const start = STOP_BY_KEY.get(startKey);

  if (!current || !start || remainingDays < 1) return [];

  const contentByTarget = new Map<string, CustomLeg>();

  (LEGS_FROM.get(currentKey) ?? []).forEach(leg => contentByTarget.set(leg.to, leg));

  // Block only immediate ping-pong (A→B→A) — revisiting a hub island a few
  // days later is perfectly normal sailing, and blocking every visited stop
  // paints week-long trips into dead ends.
  const recentlyVisited = new Set(visitedKeys.slice(-2));
  const candidates: Suggestion[] = [];

  if (remainingDays === 1) {
    // Last day: home run only.
    const nm = contentByTarget.get(startKey)?.nm ?? legNm(current, start);

    if (nm <= MAX_DAY_NM + 6) {
      const leg = contentByTarget.get(startKey);

      candidates.push({
        stop: start,
        nm,
        content: leg?.ns ? { ns: leg.ns, routeId: leg.routeId!, day: leg.day! } : undefined,
        isReturn: true,
      });
    }

    return candidates;
  }

  CUSTOM_STOPS.forEach(stop => {
    if (stop.key === currentKey || stop.country !== current.country) return;

    if (recentlyVisited.has(stop.key) && stop.key !== startKey) return;

    const leg = contentByTarget.get(stop.key);
    const nm = leg?.nm ?? legNm(current, stop);

    if (nm < MIN_DAY_NM || nm > MAX_DAY_NM) return;

    // Keep the loop closeable: after sailing there, home must remain
    // reachable in the days left (minus this one).
    const homeNm = legNm(stop, start);

    if (homeNm > (remainingDays - 1) * MAX_RETURN_DAY_NM) return;

    candidates.push({
      stop,
      nm,
      content: leg?.ns ? { ns: leg.ns, routeId: leg.routeId!, day: leg.day! } : undefined,
      isReturn: stop.key === startKey,
    });
  });

  // One-step lookahead: never suggest a stop the trip cannot leave again
  // (random-walk sim: dead ends drop from 5.3% to 0.8% of trips).
  const hasOnwardMove = (from: CustomStop, blockKey: string, remaining: number): boolean =>
    legNm(from, start) <= MAX_DAY_NM + 6 ||
    CUSTOM_STOPS.some(next => {
      if (next.key === from.key || next.key === blockKey || next.country !== from.country) return false;

      const d = legNm(from, next);

      return d >= MIN_DAY_NM && d <= MAX_DAY_NM && legNm(next, start) <= (remaining - 1) * MAX_RETURN_DAY_NM;
    });

  const viable =
    remainingDays > 2 ? candidates.filter(sug => hasOnwardMove(sug.stop, currentKey, remainingDays - 1)) : candidates;

  // Proven-with-copy hops first, then proven, then distance-based; inside
  // each band prefer the ~18 NM sweet spot. Cap the list so the UI breathes.
  const band = (sug: Suggestion) => {
    if (sug.content) return 0;

    if (contentByTarget.has(sug.stop.key)) return 1;

    return 2;
  };

  viable.sort((a, b) => band(a) - band(b) || Math.abs(a.nm - 18) - Math.abs(b.nm - 18));

  return viable.slice(0, 12);
};

export interface StartOption {
  stop: CustomStop;
  country: string;
}

/** Marinas our curated routes actually start from, grouped for the picker. */
export const startOptions = (startKeys: string[]): StartOption[] =>
  startKeys
    .map(key => STOP_BY_KEY.get(key))
    .filter((s): s is CustomStop => !!s)
    .map(stop => ({ stop, country: stop.country }))
    .sort((a, b) => a.country.localeCompare(b.country) || a.stop.label.localeCompare(b.stop.label));
