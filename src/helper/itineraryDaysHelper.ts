import { ItineraryRoute } from '@/types/itinerary.type';

export function computeItineraryNumberOfDays(route: ItineraryRoute): ItineraryRoute {
  return {
    ...route,
    numberOfDays: route.routeDays.length,
  };
}
