/* eslint-disable no-nested-ternary */
import React from 'react';

import { getLocale } from 'next-intl/server';

import { getLoggedInUser } from '@/actions/auth.actions';
import { getInquiry } from '@/actions/yacht.actions';
import { AllSearchParams } from '@/config/form-models.config';
import { Currency, UserRoleName } from '@/models/user.model';
import { VesselType, YachtModelShortInfo } from '@/models/yacht.model';
import { fetchYachts } from '@/services/yacht.service';
import { PaginatedResponse } from '@/types/response.type';
import { getCuratedSeoHtml } from '@/utils/server/curatedSeoContent';
import { landingCrumbs, landingNav } from '@/utils/server/landingNav';
import { placeText } from '@/utils/server/placeText';
import { yachtFetchParams } from '@/utils/server/searchLanding';
import CharterFactsBlock, { CharterFactsTarget } from '@/views/Search/CharterFacts';
import LandingLinks, { LandingBreadcrumb } from '@/views/Search/LandingLinks';

import BoatsSection from './BoatsSection';

/** A destination landing: one resolved catalogue place [× one boat type]. */
export interface LandingPlace {
  name: string;
  boatType: VesselType | null;
}

interface BoatsWrapperProps {
  /** Request params; `did` is already filled in from `?destinations=` by the page. */
  searchParams: AllSearchParams;
  /** Lowercased `?destinations=` value → catalogue display name. */
  destinationLabels?: Record<string, string>;
  /** Data Cache window for the yacht list; undefined = no-store. */
  fetchRevalidate?: number;
  /** Charter facts block for a gated landing (null → none). */
  charterFacts?: CharterFactsTarget | null;
  /** Set when the request is a destination landing: its link blocks and breadcrumb. */
  landingPlace?: LandingPlace | null;
}

const extractSingleBoatType = (searchParams: AllSearchParams): string | null => {
  const raw = searchParams.boatTypes;
  const types = Array.isArray(raw) ? raw.flatMap(b => String(b).split(',')) : raw ? String(raw).split(',') : [];

  return types.length === 1 ? types[0] : null;
};

const BoatsWrapper = async ({
  searchParams,
  destinationLabels = {},
  fetchRevalidate,
  charterFacts = null,
  landingPlace = null,
}: BoatsWrapperProps) => {
  const locale = await getLocale();
  const user = await getLoggedInUser();

  const currency = user?.currency || (searchParams.currency as Currency) || Currency.EUR;

  const boatType = extractSingleBoatType(searchParams);

  // The landing's link blocks (popular destinations, boat types, models,
  // itineraries — landingNav.ts) and breadcrumb are built alongside the yacht
  // listing; the model row reads the listed cards when they arrive.
  // Backend blip → empty list (pre-existing soft behaviour; fetchYachts now throws).
  const dataPromise = fetchYachts(yachtFetchParams(searchParams, !!fetchRevalidate), currency, locale, {
    revalidate: fetchRevalidate,
  }).catch((): PaginatedResponse<YachtModelShortInfo> => ({ content: [] }));

  const [data, nav, crumbs] = await Promise.all([
    dataPromise,
    landingPlace
      ? landingNav(
          landingPlace.name,
          landingPlace.boatType,
          locale,
          dataPromise.then(d => d.content ?? [])
        ).catch(() => null)
      : Promise.resolve(null),
    landingPlace
      ? landingCrumbs(landingPlace.name, landingPlace.boatType, locale).catch(() => [])
      : Promise.resolve([]),
  ]);

  let inquiry = null;

  if (user && user.roles[0].roleName !== UserRoleName.USER && searchParams.inquiryId) {
    inquiry = await getInquiry(searchParams.inquiryId);
  }

  // The first destination by its catalogue name, and as the localized
  // phrase the SEO block heading uses ("in the Cyclades", "u Hrvatskoj" —
  // placeText.ts; the English catalogue name used to go into "…Reiseziele
  // in Croatia"). The popular-destinations heading names the area its links
  // cover (landingNav: the country when the place has too few of its own).
  const destRaw = searchParams.destinations;
  const firstDestination = (Array.isArray(destRaw) ? destRaw[0] : destRaw ? String(destRaw).split(',')[0] : '').trim();
  const destLabel = destinationLabels[firstDestination.toLowerCase()] ?? firstDestination;
  const destWhere = destLabel ? (await placeText(locale, destLabel)).where : '';

  // Curated long-form SEO text, read from public/seo-content on the server
  // so it ships in the SSR HTML (it used to be fetched client-side after
  // hydration, leaving crawlers a generic template).
  // Looked up by the catalogue name, so alias / member spellings (split →
  // "Split Region") show the text of the canonical landing they fold onto.
  const curatedSeoHtml = firstDestination ? await getCuratedSeoHtml(locale, destLabel, boatType) : null;

  // EUR → page currency rate as the listing reports it (clientPriceInfo is
  // the backend's own conversion), so the facts read in the page currency.
  const priceInfo = data.content?.find(y => y.clientPriceInfo?.currency === currency)?.clientPriceInfo;
  const factsRate = priceInfo?.rate && priceInfo.rate > 0 ? priceInfo.rate : null;

  return (
    <BoatsSection
      data={data}
      user={user}
      inquiry={inquiry}
      popularDestinations={nav?.popular.links ?? []}
      destinationWhere={destWhere}
      popularDestinationsWhere={nav?.popular.where}
      curatedSeoHtml={curatedSeoHtml}
      charterFactsSlot={
        charterFacts ? (
          <CharterFactsBlock target={charterFacts} locale={locale} currency={currency} rate={factsRate} />
        ) : null
      }
      breadcrumbSlot={crumbs.length ? <LandingBreadcrumb crumbs={crumbs} locale={locale} /> : null}
      landingLinksSlot={nav ? <LandingLinks nav={nav} locale={locale} /> : null}
    />
  );
};

export default BoatsWrapper;
