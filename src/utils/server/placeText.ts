import { getTranslations } from 'next-intl/server';
import 'server-only';

import { DESTINATION_KEY_BY_LABEL } from '@/utils/static/destinationLabelKey';
import { REGION_KEY_BY_NAME } from '@/utils/static/placeKeys';
import { normalizeDestinationName } from '@/utils/static/searchLandingPath';

/**
 * A catalogue place as the landing copy names it in one locale. Countries and
 * the two popular regions read their name from home.destinationsSection
 * (the names every other surface uses), the landing regions from
 * `landing.names`; marinas and bases keep their catalogue name. `where` is
 * the full prepositional phrase ("in the Cyclades", "en Croatie",
 * "na Kikladima"), so templates never glue a fixed "in" / "à" / "u" to a
 * name that needs an article or a case ending; a place without its own
 * phrase gets the locale's `landing.inFallback` (HR/PL use a dash there,
 * since a base name cannot be declined automatically).
 */
export interface PlaceText {
  /** `landing.in` key (country, popular region or region); null for a base. */
  key: string | null;
  name: string;
  where: string;
}

const homeKeyFor = (name: string): string | null => DESTINATION_KEY_BY_LABEL[name.trim().toLowerCase()] ?? null;

export const placeText = async (locale: string, name: string): Promise<PlaceText> => {
  const tLanding = await getTranslations({ locale, namespace: 'landing' });
  const homeKey = homeKeyFor(name);
  const regionKey = homeKey ? null : (REGION_KEY_BY_NAME[normalizeDestinationName(name)] ?? null);
  const names = tLanding.raw('names' as never) as Record<string, string>;
  const phrases = tLanding.raw('in' as never) as Record<string, string>;
  let display = name.trim();

  if (homeKey) {
    const tHome = await getTranslations({ locale, namespace: 'home' });

    display = tHome.raw(`destinationsSection.destinations.${homeKey}` as never) || display;
  } else if (regionKey && names[regionKey]) {
    display = names[regionKey];
  }

  const key = homeKey ?? regionKey;

  return { key, name: display, where: (key && phrases[key]) || tLanding('inFallback', { name: display }) };
};
