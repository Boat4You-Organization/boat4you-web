import { getTranslations } from 'next-intl/server';

import { itineraryNamespace, resolveRouteText } from '@/helper/itineraryI18n';
import { areaForMarina, findItineraryArea } from '@/helper/itineraryMatch';

/**
 * Server-side: localized route metaTitles for the area a marina maps to.
 * The per-country itinerary namespaces are no longer shipped to the client
 * outside /itineraries, so server pages resolve the card labels here and
 * pass them to <SuggestedItineraries routeTitles>.
 */
export const suggestedRouteTitles = async (
  marinaName?: string | null,
  countryCode?: string | null
): Promise<Record<string, string | undefined> | undefined> => {
  const area = findItineraryArea(areaForMarina(marinaName, countryCode));

  if (!area) return undefined;

  const tArea = await getTranslations(itineraryNamespace(area));

  return Object.fromEntries(
    area.routes.map(route => [route.id, resolveRouteText(route, 'metaTitle', route.metaTitle, tArea)])
  );
};
