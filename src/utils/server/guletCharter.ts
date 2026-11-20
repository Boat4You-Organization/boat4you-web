import 'server-only';

import { GULET_COUNTRIES } from '@/config/guletCharter.config';
import { Currency } from '@/models/user.model';
import { VesselType, YachtModelShortInfo } from '@/models/yacht.model';
import { fetchYachts } from '@/services/yacht.service';
import { countryPlaceFor, hubFor } from '@/utils/server/catalogueHubs';
import { fetchCharterFacts } from '@/utils/server/charterFacts';
import { loadDestinationIndex } from '@/utils/server/destinationDid';
import { placeText } from '@/utils/server/placeText';
import { GuideTable, MIN_TYPE_TABLE_MONTHS, tableOf } from '@/utils/server/priceGuide';
import { displayPlaceName } from '@/utils/static/croatianPlaceNames';
import { isGulet } from '@/utils/static/guletCrewed';
import { isOperatorName } from '@/utils/static/operatorNames';

/** One row of cards per country (three columns from 900px, BoatCardGrid). */
const BOATS_PER_COUNTRY = 3;
/** Bases named per country. */
const MAX_BASES = 3;
/** Same window as the undated landings. */
const REVALIDATE_SECONDS = 3600;

export interface GuletCountry {
  countryCode: string;
  /** Localised name ("Türkiye") and phrase ("in Türkiye"). */
  name: string;
  where: string;
  /** Gulets behind the country's gulet landing (else the facts row's count). */
  fleet: number;
  /** Locale-prefixed gulet landing, or null when it is not indexable in this locale. */
  href: string | null;
  boats: YachtModelShortInfo[];
  /** The nightly gulet facts reduced to the months a page may state, or null. */
  table: GuideTable | null;
  /** Main home ports from the facts row; never a base named after a charter company. */
  bases: string[];
}

/**
 * The countries of the gulet page with live data: the gulet landing and its
 * count, a row of gulets from the listing (each boat's cheapest bookable
 * week, as on the landings) and the nightly gulet facts (typical week by
 * month, main bases). A country with no landing and no boats is left out;
 * every country failing throws, so ISR keeps the last good page.
 */
export const loadGuletCountries = async (locale: string): Promise<GuletCountry[]> => {
  const index = await loadDestinationIndex();

  if (!index) throw new Error('Destination index unavailable for the gulet page');

  const now = new Date();

  const rows = await Promise.all(
    GULET_COUNTRIES.map(async (countryCode): Promise<GuletCountry | null> => {
      const place = await countryPlaceFor(index, countryCode).catch(() => null);

      if (!place) return null;

      const did = place.dids.find(d => d.startsWith('c-')) ?? place.dids[0];
      const [hub, list, facts, text] = await Promise.all([
        hubFor(index, place, VesselType.GULET, locale).catch(() => null),
        fetchYachts(
          {
            locations: [],
            did: place.dids,
            boatTypes: [VesselType.GULET],
            size: BOATS_PER_COUNTRY,
            priceBasis: 'week',
          },
          Currency.EUR,
          locale,
          { revalidate: REVALIDATE_SECONDS }
        ).catch(() => null),
        did ? fetchCharterFacts(did, VesselType.GULET) : Promise.resolve(null),
        placeText(locale, place.name),
      ]);

      const boats = (list?.content ?? []).filter(boat => isGulet(boat));
      const fleet = hub?.fleet || facts?.activeBoats || list?.page?.totalElements || boats.length;

      if (!hub?.href && !boats.length) return null;

      const bases = (facts?.topBases ?? [])
        .map(base => base.name)
        .filter(name => name && !isOperatorName(name))
        .slice(0, MAX_BASES)
        .map(displayPlaceName);

      return {
        countryCode,
        name: text.name,
        where: text.where,
        fleet,
        href: hub?.href ?? null,
        boats,
        table: facts ? tableOf(facts, VesselType.GULET, countryCode, MIN_TYPE_TABLE_MONTHS, now) : null,
        bases,
      };
    })
  );

  const countries = rows.filter((row): row is GuletCountry => !!row);

  if (!countries.length) throw new Error('Gulet listing unavailable');

  return countries;
};
