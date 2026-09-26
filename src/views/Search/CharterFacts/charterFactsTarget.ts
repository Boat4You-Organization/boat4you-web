import { getTranslations } from 'next-intl/server';
import 'server-only';

import { VesselType } from '@/models/yacht.model';
import { LocationType } from '@/types/location.type';
import { factsDidFor } from '@/utils/server/charterFacts';
import { evaluateLanding } from '@/utils/server/landingGate';
import { placeText } from '@/utils/server/placeText';
import { SearchLanding } from '@/utils/server/searchLanding';
import { COUNTRY_LABEL_KEY } from '@/views/Models/modelsText';

import type { CharterFactsTarget } from './CharterFactsBlock';

/**
 * The charter facts block goes on gated landings only: one destination
 * resolved from `?destinations=` (not a did link), at most one boat type,
 * and the landing passes the shared index gate in this locale (landingGate).
 */
export const charterFactsTargetFor = async (
  landing: SearchLanding,
  boatType: VesselType | null,
  boatTypeCount: number,
  locale: string
): Promise<CharterFactsTarget | null> => {
  // Several boat types, or one the catalogue does not know: not a landing.
  if (landing.hasOwnDid || landing.destinations.length !== 1 || boatTypeCount > (boatType ? 1 : 0)) return null;

  const resolved = landing.resolved[0];
  const did = resolved ? factsDidFor(resolved.dids) : null;

  if (!resolved || !did) return null;

  const gate = await evaluateLanding(resolved, boatType);

  if (!gate.indexableLocales.includes(locale)) return null;

  const countryKey =
    resolved.kind === LocationType.COUNTRY && resolved.countryCode ? COUNTRY_LABEL_KEY[resolved.countryCode] : null;
  const tHome = countryKey ? await getTranslations({ locale, namespace: 'home' }) : null;
  // Countries by ISO code; regions and bases by name (placeText.ts, the
  // same names as the landing title and H1).
  const areaLabel =
    countryKey && tHome
      ? tHome(`destinationsSection.destinations.${countryKey}` as never)
      : (await placeText(locale, resolved.name)).name;

  return { did, vesselType: boatType, areaLabel, placeDids: resolved.dids };
};
