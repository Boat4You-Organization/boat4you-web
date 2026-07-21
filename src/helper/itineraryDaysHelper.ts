import { ItineraryRoute } from '@/types/itinerary.type';

export function computeItineraryNumberOfDays(route: ItineraryRoute): ItineraryRoute {
  return {
    ...route,
    numberOfDays: route.routeDays.length,
  };
}

const normalizePlace = (value: string) =>
  value
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .trim();

/**
 * A route is one-way only when its last sailing leg ends in a different
 * marina than it started from. Derived from routeDays (the actual legs),
 * not from otherPoints (highlight stops, which rarely include the return
 * to base). Trailing "Check-out" pseudo-legs are skipped.
 */
export function isOneWayItinerary(route: ItineraryRoute): boolean {
  const legs = (route.routeDays ?? []).filter(day => day.routeTo && !normalizePlace(day.routeTo).includes('check'));
  const lastLeg = legs[legs.length - 1];

  if (!lastLeg || !route.startingPoint) return false;

  const start = normalizePlace(route.startingPoint);
  const end = normalizePlace(lastLeg.routeTo);

  return !(end.includes(start) || start.includes(end));
}
