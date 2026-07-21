import { LatLng, resolveLocationCoords } from '@/config/itinerary/locationCoords.config';
import { ItineraryDay } from '@/types/itinerary.type';

/**
 * Approximate per-day sailing stats (nautical miles + estimated sailing
 * hours) computed from the canonical coords of routeFrom / routeTo.
 * Returns null when either side fails to resolve so the panel can drop
 * the stat box quietly. Uses haversine for great-circle distance and a
 * baseline 5-knot cruising speed — fine for a charter overview.
 */

const EARTH_RADIUS_KM = 6371;
const KM_PER_NAUTICAL_MILE = 1.852;
const DEFAULT_CRUISE_KNOTS = 5;

export interface DayStats {
  nauticalMiles: number;
  sailingHours: number;
}

const haversineKm = (a: LatLng, b: LatLng): number => {
  const toRad = (deg: number) => (deg * Math.PI) / 180;
  const dLat = toRad(b.lat - a.lat);
  const dLng = toRad(b.lng - a.lng);
  const lat1 = toRad(a.lat);
  const lat2 = toRad(b.lat);
  const h = Math.sin(dLat / 2) ** 2 + Math.cos(lat1) * Math.cos(lat2) * Math.sin(dLng / 2) ** 2;

  return 2 * EARTH_RADIUS_KM * Math.asin(Math.sqrt(h));
};

/**
 * Resolve both endpoints, run haversine, convert km → NM, divide by
 * 5 knots for hours. Round NM to nearest integer and hours to one
 * decimal so the stat box reads cleanly. Returns null when either
 * endpoint is unmapped or the computed distance rounds to zero.
 */
export function computeDayStats(day: ItineraryDay): DayStats | null {
  const fromCoords = resolveLocationCoords(day.routeFrom);
  const toCoords = resolveLocationCoords(day.routeTo);

  if (!fromCoords || !toCoords) return null;

  const km = haversineKm(fromCoords, toCoords);

  if (km < 0.1) return null;

  const nauticalMiles = Math.round(km / KM_PER_NAUTICAL_MILE);

  if (nauticalMiles === 0) return null;

  const sailingHours = Math.round((nauticalMiles / DEFAULT_CRUISE_KNOTS) * 10) / 10;

  return { nauticalMiles, sailingHours };
}
