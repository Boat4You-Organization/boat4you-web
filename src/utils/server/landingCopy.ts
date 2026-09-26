import { getTranslations } from 'next-intl/server';
import 'server-only';

import { AllSearchParams } from '@/config/form-models.config';
import {
  VESSEL_TYPE_LABEL_MAP_FOR_RENTAL,
  VESSEL_TYPE_LABEL_MAP_PLURAL,
  VesselType,
  isVesselType,
} from '@/models/yacht.model';
import { PlaceText, placeText } from '@/utils/server/placeText';
import { resolveSearchLanding, splitSearchParam, uniqueCaseInsensitive } from '@/utils/server/searchLanding';

/**
 * ONE source for a /search page's title, meta description and H1 (the H1
 * used to be rebuilt client-side from a 16-name map, so every region and base
 * rendered its English catalogue name in all nine locales).
 *
 *   - destination (× boat type) → "{BoatType} charter {where}" /
 *     "Yacht charter and Boat rental {where}" with the place's own phrase;
 *   - a place with a `landing.lead` (Split Region, owner decision 25.9.2026)
 *     leads with that keyword: "Yacht charter Split – boat rental in the
 *     Split Region";
 *   - `landing.override` (EN only) replaces a phrase another site of the
 *     group owns: "Catamaran charter Croatia" is catamaran-croatia-charter.com's
 *     keyword, so the boat4you page reads "Catamaran rental in Croatia";
 *   - boat type only → the type label; neither → the generic search copy.
 *
 * `h1` is null when the page keeps its own heading (no destination).
 */
export interface LandingCopy {
  title: string;
  description: string;
  h1: string | null;
}

type Override = { h1: string; metaDesc: string };

/** Rental-context label: genitive in HR/PL ("Najam katamarana"), the
 *  nominative elsewhere (common.json `*ForRental`). */
const rentalLabel = async (locale: string, type: VesselType): Promise<string> => {
  const tCommon = await getTranslations({ locale, namespace: 'common' });

  return tCommon.raw(
    VESSEL_TYPE_LABEL_MAP_FOR_RENTAL[type].replace(/^common\./, '') as Parameters<typeof tCommon.raw>[0]
  ) as string;
};

/** Plural type label, the heading of a boat-type-only page (common.json `*Plural`). */
const pluralLabel = async (locale: string, type: VesselType): Promise<string> => {
  const tCommon = await getTranslations({ locale, namespace: 'common' });

  return tCommon.raw(
    VESSEL_TYPE_LABEL_MAP_PLURAL[type].replace(/^common\./, '') as Parameters<typeof tCommon.raw>[0]
  ) as string;
};

/** Title, description and H1 of a landing whose places are resolved (at least one). */
const copyForPlaces = async (
  locale: string,
  places: PlaceText[],
  singleBoatType: VesselType | null
): Promise<LandingCopy & { h1: string }> => {
  const [tCommon, tLanding] = await Promise.all([
    getTranslations({ locale, namespace: 'common' }),
    getTranslations({ locale, namespace: 'landing' }),
  ]);
  const boatType = singleBoatType ? await rentalLabel(locale, singleBoatType) : null;
  const where = places.map(p => p.where).join(` ${tCommon('and')} `);
  const single = places.length === 1 ? places[0] : null;
  const lead = single?.key ? (tLanding.raw('lead' as never) as Record<string, string>)[single.key] : undefined;
  const overrides = tLanding.raw('override' as never) as Record<string, Partial<Record<VesselType, Override>>>;
  const override = single?.key && singleBoatType ? overrides[single.key]?.[singleBoatType] : undefined;

  if (override) return { title: override.h1, description: override.metaDesc, h1: override.h1 };

  if (boatType) {
    const h1 =
      lead && single
        ? tLanding('leadH1WithBoatType', { boatType, lead, name: single.name })
        : tLanding('h1WithBoatType', { boatType, where });

    return { title: h1, description: tLanding('metaDescWithBoatType', { boatType, where }), h1 };
  }

  const h1 = lead ? tLanding('leadH1NoBoatType', { lead, where }) : tLanding('h1NoBoatType', { where });

  return { title: h1, description: tLanding('metaDescNoBoatType', { where }), h1 };
};

export const getLandingCopy = async (locale: string, params: AllSearchParams): Promise<LandingCopy> => {
  const [tMeta, landing] = await Promise.all([
    getTranslations({ locale, namespace: 'metadata.metadata.search' }),
    resolveSearchLanding(params),
  ]);

  const boatTypes = splitSearchParam(params.boatTypes);
  const singleBoatType: VesselType | null = boatTypes.length === 1 && isVesselType(boatTypes[0]) ? boatTypes[0] : null;

  // Catalogue name for resolved values (aliases fold: split → Split Region),
  // the raw URL value otherwise — only a did link's own label reaches here
  // unresolved, an unknown name without a did answers 404 (search/page.tsx);
  // dual-source pairs share one phrase.
  const rawPlaces = await Promise.all(
    uniqueCaseInsensitive(splitSearchParam(params.destinations)).map(d =>
      placeText(locale, landing.labels[d.toLowerCase()] ?? d)
    )
  );
  const places = Array.from(new Map(rawPlaces.map(p => [p.where.toLowerCase(), p])).values());

  if (!places.length) {
    // Boat type only: the title is the page's own heading, the plural type
    // label ("Catamarans", "Katamarani") — the rental label is a genitive in
    // HR/PL ("katamarana | Boat4You") and lower case in the Romance locales.
    const typeTitle = singleBoatType ? await pluralLabel(locale, singleBoatType) : null;

    return typeTitle
      ? { title: typeTitle, description: tMeta('description'), h1: null }
      : { title: tMeta('title'), description: tMeta('description'), h1: null };
  }

  return copyForPlaces(locale, places, singleBoatType);
};

/**
 * H1 of the landing of one catalogue place [× one boat type], built from the
 * same templates as that page (lead, override, `landing.h1*`): the anchor
 * text other pages link the landing by, so a link never names a page
 * differently from its own heading.
 */
export const landingHeading = async (locale: string, name: string, boatType: VesselType | null): Promise<string> =>
  (await copyForPlaces(locale, [await placeText(locale, name)], boatType)).h1;
