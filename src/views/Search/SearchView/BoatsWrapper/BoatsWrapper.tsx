/* eslint-disable no-nested-ternary */
import React from 'react';

import { getLocale, getTranslations } from 'next-intl/server';

import { getLoggedInUser } from '@/actions/auth.actions';
import { getInquiry } from '@/actions/yacht.actions';
import { getActiveCampaign } from '@/config/campaigns.config';
import { AllSearchParams } from '@/config/form-models.config';
import { Currency, UserRoleName } from '@/models/user.model';
import { VesselType, YachtModelShortInfo } from '@/models/yacht.model';
import { fetchCampaignMaxPct } from '@/services/promo.service';
import { PaginatedResponse } from '@/types/response.type';
import { getCuratedSeoHtml } from '@/utils/server/curatedSeoContent';
import { fetchLandingListing } from '@/utils/server/landingListing';
import { landingCrumbs, landingNav } from '@/utils/server/landingNav';
import { placeText } from '@/utils/server/placeText';
import { isUndatedSearch } from '@/utils/static/listingPrice';
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
  /** Reorder the first cards for base diversity (searchLanding.ts diversifiesBases). */
  diversifyBases?: boolean;
  /** Charter facts block for a gated landing listing its whole set — no
   *  dates or filters (search page, listsWholeLanding) — so the listing total
   *  below is the landing's own. Null → none. */
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
  diversifyBases = false,
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
  const dataPromise = fetchLandingListing(searchParams, currency, locale, {
    revalidate: fetchRevalidate,
    diversify: diversifyBases,
  }).catch((): PaginatedResponse<YachtModelShortInfo> => ({ content: [] }));

  // The listing's campaign strip, resolved here so the server and the browser render the same campaign (a clock
  // on either side of a campaign switch would not) and the "up to X%" arrives with the page (no no-discount
  // state first). The aggregate is a Data Cache read (15 min).
  const promoCampaign = getActiveCampaign();

  const [data, nav, crumbs, promoPct] = await Promise.all([
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
    promoCampaign ? fetchCampaignMaxPct(promoCampaign) : Promise.resolve(null),
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

  // Which week the undated cards are priced for (audit B19): each boat's
  // cheapest bookable 7-night week (priceBasis=week, yachtFetchParams) — said
  // once above the grid. A dated search prices the searched dates instead.
  const priceNote = isUndatedSearch(searchParams)
    ? (await getTranslations({ locale, namespace: 'landing' }))('weeklyPriceNote')
    : null;

  // EUR → page currency rate as the listing reports it (clientPriceInfo is
  // the backend's own conversion), so the facts read in the page currency.
  const priceInfo = data.content?.find(y => y.clientPriceInfo?.currency === currency)?.clientPriceInfo;
  const factsRate = priceInfo?.rate && priceInfo.rate > 0 ? priceInfo.rate : null;

  return (
    <BoatsSection
      data={data}
      promoCampaign={promoCampaign}
      promoPct={promoPct}
      user={user}
      inquiry={inquiry}
      popularDestinations={nav?.popular.links ?? []}
      destinationWhere={destWhere}
      popularDestinationsWhere={nav?.popular.where}
      curatedSeoHtml={curatedSeoHtml}
      priceNote={priceNote}
      charterFactsSlot={
        charterFacts ? (
          <CharterFactsBlock
            target={charterFacts}
            locale={locale}
            currency={currency}
            rate={factsRate}
            listingTotal={data.page?.totalElements ?? null}
          />
        ) : null
      }
      breadcrumbSlot={crumbs.length ? <LandingBreadcrumb crumbs={crumbs} locale={locale} /> : null}
      landingLinksSlot={nav ? <LandingLinks nav={nav} locale={locale} /> : null}
    />
  );
};

export default BoatsWrapper;
