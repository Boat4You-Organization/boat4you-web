import { getTranslations } from 'next-intl/server';

import { itineraryNamespace, resolveRouteText } from '@/helper/itineraryI18n';
import { areaForMarina, findItineraryArea } from '@/helper/itineraryMatch';
import { Itinerary } from '@/types/itinerary.type';
import { itineraryAreaName } from '@/utils/server/itineraryPlaceNames';

/** Localized route metaTitles of one area, keyed by route id. */
const routeTitlesFor = async (area: Itinerary): Promise<Record<string, string | undefined>> => {
  const tArea = await getTranslations(itineraryNamespace(area));

  return Object.fromEntries(
    area.routes.map(route => [route.id, resolveRouteText(route, 'metaTitle', route.metaTitle, tArea)])
  );
};

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

  return routeTitlesFor(area);
};

/**
 * Server-side: the name of the area a marina maps to, in the page locale
 * (itineraryAreaName) — for <SuggestedItineraries areaLabel>.
 */
export const suggestedAreaLabel = async (
  locale: string,
  marinaName?: string | null,
  countryCode?: string | null
): Promise<string | undefined> => {
  const area = findItineraryArea(areaForMarina(marinaName, countryCode));

  return area ? itineraryAreaName(locale, area) : undefined;
};

/** Route card titles and area name for a direct area target (blog posts). */
export const areaSuggestionText = async (
  locale: string,
  areaId: string
): Promise<{ routeTitles?: Record<string, string | undefined>; areaLabel?: string }> => {
  const area = findItineraryArea(areaId);

  if (!area) return {};

  const [routeTitles, areaLabel] = await Promise.all([routeTitlesFor(area), itineraryAreaName(locale, area)]);

  return { routeTitles, areaLabel };
};
