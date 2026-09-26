import { getTranslations } from 'next-intl/server';
import 'server-only';

import { itineraryNamespace, resolveAreaText } from '@/helper/itineraryI18n';
import { Itinerary } from '@/types/itinerary.type';
import { placeText } from '@/utils/server/placeText';

/**
 * The names the itinerary pages give a sailing area and its country in one
 * locale ("Kykladen", "Griechenland"; "Istra", "Hrvatska"). The config names
 * are English and were rendered verbatim in every locale's headings ("Wählen
 * Sie Ihre Woche ab Cyclades. Greece · Segelrevier Cyclades", audit B16).
 *
 * Source: the area's own `areas.<id>.name` in its country's itinerary
 * namespace when it has one — the areas whose name is no landing place
 * ("Istria", "Ionian", "Brittany & Atlantic") — else the landing name
 * (placeText: the name the search landings, breadcrumbs and link blocks
 * use). A proper noun no locale translates (Split, Amalfi) keeps its config
 * name.
 */
export const itineraryAreaName = async (locale: string, area: Itinerary): Promise<string> => {
  const tArea = await getTranslations({ locale, namespace: itineraryNamespace(area) });

  return resolveAreaText(area, 'name', undefined, tArea) ?? (await placeText(locale, area.sailingArea)).name;
};

/** The itinerary group's country ("Croatia", "Caribbean") as the landings name it in the locale. */
export const itineraryCountryName = async (locale: string, country: string): Promise<string> =>
  (await placeText(locale, country)).name;
