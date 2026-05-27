/* eslint-disable no-nested-ternary */
import React from 'react';

import { getLocale } from 'next-intl/server';

import { getLoggedInUser } from '@/actions/auth.actions';
import {
  PopularDestination,
  getPopularDestinationsForCountry,
  getPopularDestinationsForRegion,
} from '@/actions/locations.actions';
import { getInquiry } from '@/actions/yacht.actions';
import { AllSearchParams } from '@/config/form-models.config';
import { Currency, UserRoleName } from '@/models/user.model';
import { fetchYachts } from '@/services/yacht.service';

import BoatsSection from './BoatsSection';

interface BoatsWrapperProps {
  searchParams: AllSearchParams;
}

/**
 * Pull the country-code component out of the `did` param. URL convention:
 *   c-{realId}  → country (e.g. c-54 = Croatia, realId 54)
 *   r-{realId}  → region
 *   l-{realId}  → location/marina
 * Country lookup is cheap on the backend (`/public/countries`) and
 * already cached upstream of the country-popular-destinations fetch,
 * but we map locally for the MVP scope (Croatia only). Returns null when
 * the URL has no country segment or it doesn't match the seed list.
 */
const COUNTRY_REAL_ID_TO_CODE: Record<string, string> = {
  // Maps `c-{realId}` URL slugs → ISO 3166-1 alpha-2 codes so the country
  // search page can pull the matching popular-destinations block (regions
  // + top marinas) from the backend. Keep in sync with DISPLAY_COUNTRIES
  // in src/config/countries.config.ts — every country we surface in the
  // UI dropdown should land here, otherwise its country search page renders
  // without the internal-link block.
  //
  // realIds verified against `/public/countries` on 2026-04-29.
  '16': 'BS', // Bahamas
  '54': 'HR', // Croatia
  '76': 'FR', // France
  '86': 'GR', // Greece
  '88': 'GD', // Grenada
  '110': 'IT', // Italy
  '139': 'MQ', // Martinique
  '148': 'ME', // Montenegro
  '198': 'SC', // Seychelles
  '209': 'ES', // Spain
  '230': 'TR', // Türkiye
  '242': 'VG', // Virgin Islands (British)
};

const extractCountryCode = (searchParams: AllSearchParams): string | null => {
  const raw = searchParams.did;
  const dids = Array.isArray(raw) ? raw.flatMap(d => String(d).split(',')) : raw ? String(raw).split(',') : [];
  const countryDid = dids.find(d => d.startsWith('c-'));

  if (!countryDid) return null;

  const realId = countryDid.slice(2);

  return COUNTRY_REAL_ID_TO_CODE[realId] ?? null;
};

/**
 * Pull the first region real-id out of the URL's `did` param. The
 * popular dual-source regions (Split, Ionian) carry two `r-X` ids — we
 * only need one of them for the region filter; the m2m `location_region`
 * joins through both since the underlying Location rows are shared.
 */
const extractRegionRealId = (searchParams: AllSearchParams): string | null => {
  const raw = searchParams.did;
  const dids = Array.isArray(raw) ? raw.flatMap(d => String(d).split(',')) : raw ? String(raw).split(',') : [];
  const regionDid = dids.find(d => d.startsWith('r-'));

  return regionDid ? regionDid.slice(2) : null;
};

const extractSingleBoatType = (searchParams: AllSearchParams): string | null => {
  const raw = searchParams.boatTypes;
  const types = Array.isArray(raw) ? raw.flatMap(b => String(b).split(',')) : raw ? String(raw).split(',') : [];

  return types.length === 1 ? types[0] : null;
};

const BoatsWrapper = async ({ searchParams }: BoatsWrapperProps) => {
  const locale = await getLocale();
  const user = await getLoggedInUser();

  const currency = user?.currency || (searchParams.currency as Currency) || Currency.EUR;

  // Popular-destinations block fetch runs in parallel with the yacht
  // listing. Two fetch shapes:
  //   - country URL (`did=c-X`): pull regions of that country + top
  //     marinas to round out a 10-link block.
  //   - region URL (`did=r-X`): pull marinas/cities INSIDE that region.
  // Region detection wins when both prefixes appear (a region URL can
  // legitimately also carry a country filter for legacy reasons).
  const countryCode = extractCountryCode(searchParams);
  const regionRealId = extractRegionRealId(searchParams);
  const boatType = extractSingleBoatType(searchParams);

  const popularDestinationsPromise: Promise<PopularDestination[]> = regionRealId
    ? getPopularDestinationsForRegion(regionRealId, boatType)
    : countryCode
      ? getPopularDestinationsForCountry(countryCode, boatType)
      : Promise.resolve([]);

  const [data, popularDestinations] = await Promise.all([
    fetchYachts(searchParams, currency, locale),
    popularDestinationsPromise,
  ]);

  let inquiry = null;

  if (user && user.roles[0].roleName !== UserRoleName.USER && searchParams.inquiryId) {
    inquiry = await getInquiry(searchParams.inquiryId);
  }

  // Build the human-readable area label for the block heading. We use
  // the raw `?destinations=` value the user already chose — that way
  // the heading reads "Most popular destinations in Croatia" / "in
  // Hrvatska" depending on what the chip carried, without re-fetching
  // a localised country name on the server.
  const destRaw = searchParams.destinations;
  const destLabel = Array.isArray(destRaw) ? destRaw[0] : destRaw ? String(destRaw).split(',')[0] : '';

  return (
    <BoatsSection
      data={data}
      user={user}
      inquiry={inquiry}
      popularDestinations={popularDestinations}
      popularDestinationsArea={destLabel || ''}
    />
  );
};

export default BoatsWrapper;
