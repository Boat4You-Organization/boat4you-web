/* eslint-disable no-nested-ternary, no-void */
import { Metadata } from 'next';
import { Locale } from 'next-intl';
import { getLocale, getTranslations } from 'next-intl/server';
import { permanentRedirect } from 'next/navigation';

import Layout from '@/components/Layout';
import { AllSearchParams } from '@/config/form-models.config';
import { LocaleType } from '@/config/locales.config';
import { meta } from '@/config/meta';
import { routing } from '@/i18n/routing';
import { Currency } from '@/models/user.model';
import { YachtModelShortInfo, isVesselType } from '@/models/yacht.model';
import { fetchYachts } from '@/services/yacht.service';
import { getLandingCopy } from '@/utils/server/landingCopy';
import { evaluateLanding } from '@/utils/server/landingGate';
import { LandingCrumb, landingCrumbs, placeForDids } from '@/utils/server/landingNav';
import { loadManufacturerLookup } from '@/utils/server/manufacturerLookup';
import {
  SearchLanding,
  landingFetchRevalidate,
  landingRedirectPath,
  resolveSearchLanding,
  splitSearchParam,
  uniqueCaseInsensitive,
  withLandingDid,
  yachtFetchParams,
} from '@/utils/server/searchLanding';
import { BoatDescTranslate, buildBoatDescription } from '@/utils/static/boatMetaDescription';
import { buildMetadata, localizedUrl } from '@/utils/static/buildMetadata';
import { getBoatImageUrl } from '@/utils/static/imageUtils';
import { serializeJsonLd } from '@/utils/static/jsonLd';
import { hasListingPrice, listingPriceDays } from '@/utils/static/listingPrice';
import { buildSearchLandingPath, isLandingExpressible } from '@/utils/static/searchLandingPath';
import { ManufacturerLookup, yachtBrandName } from '@/utils/static/yachtBrand';
import { charterFactsTargetFor } from '@/views/Search/CharterFacts/charterFactsTarget';
import { ResolvedDestinationProvider } from '@/views/Search/SearchView/ResolvedDestinationContext';
import SearchView from '@/views/Search/SearchView/SearchView';

interface SearchPageProps {
  params: Promise<{ locale: Locale }>;
  searchParams: Promise<AllSearchParams>;
}

/**
 * 301 (Next answers 308) a non-canonical spelling of a landing to its one
 * canonical URL (landingRedirectPath) — called from generateMetadata and the
 * page, whichever runs first.
 */
const redirectToCanonicalLanding = (locale: string, params: AllSearchParams, landing: SearchLanding): void => {
  const target = landingRedirectPath(params, landing);

  if (target) permanentRedirect(`${locale === routing.defaultLocale ? '' : `/${locale}`}${target}`);
};

/**
 * Dynamic per-(destination × boat type) metadata. Title and description come
 * from getLandingCopy (landingCopy.ts), the same source as the page H1: with
 * both filters we lead with the boat type ("Sailing Yacht charter in the
 * Cyclades"); destination-only uses the broader yacht/boat rental phrasing;
 * pure boat-type-only falls back to the singular noun. When neither filter
 * is set we keep the legacy generic "Search for yachts" copy.
 *
 * Canonical includes the destination + boat-type query params so dual-source
 * pairs (e.g. Ionian + Ionian Islands collapsing to "Ionian Region") still
 * deduplicate to a single canonical URL across MMK and NauSYS picks.
 */
export async function generateMetadata({ params: paramsPromise, searchParams }: SearchPageProps): Promise<Metadata> {
  const { locale } = await paramsPromise;
  const params = await searchParams;

  // Comma-separated / repeated values split into a list (splitSearchParam).
  const destinations = splitSearchParam(params.destinations);
  // Destination name → did, resolved on the server (the backend filters by
  // did only). Shared with the page render through React `cache`.
  const landing = await resolveSearchLanding(params);

  redirectToCanonicalLanding(locale, params, landing);

  // Title / description / H1 in the locale (landingCopy.ts, shared with the
  // page's H1 so the two never diverge).
  const { title, description } = await getLandingCopy(locale, params);

  const boatTypes = splitSearchParam(params.boatTypes);
  // An unknown `boatTypes` value used to crash the metadata (undefined map
  // entry → .replace) and 500 the page; treat it as "no boat type" + noindex.
  // Own-value check: `in` also accepted toString / constructor / __proto__.
  const hasUnknownBoatType = boatTypes.some(b => !isVesselType(b));
  const singleBoatType = boatTypes.length === 1 && isVesselType(boatTypes[0]) ? boatTypes[0] : null;

  // Canonical: include the headline filters so duplicate-sourced regions and
  // identical boat-type queries collapse to a single indexable URL. We
  // deliberately leave date params off the canonical — they don't change page
  // intent and would fragment the index across millions of variants. The
  // canonical uses the *raw* URL labels, LOWERCASED (the sitemap form) — NOT
  // the locale-specific translations — so every language and every casing
  // (`Croatia`, `croatia`) hits the same URL. did never enters the canonical;
  // buildSearchLandingPath is shared with the sitemaps and internal links.
  const uniqueRawDestinations = uniqueCaseInsensitive(destinations);
  // A single destination that resolved canonicalises to its catalogue name,
  // so aliases and member spellings (türkiye → turkey, split / ionian →
  // the popular "Split Region" / "Ionian Region") fold onto ONE URL.
  const singleResolved = uniqueRawDestinations.length === 1 && !landing.hasOwnDid ? landing.resolved[0] : null;
  const canonicalDestinations =
    singleResolved && isLandingExpressible(singleResolved.name) ? [singleResolved.name] : uniqueRawDestinations;
  const path = buildSearchLandingPath(canonicalDestinations, singleBoatType);

  // Index gating — keep crawl budget on the headline (destination ×
  // boat-type) URLs, drop the long tail.
  //   * pagination beyond page 1: noindex (canonical already points
  //     to page 1; indexing each page adds noise without unique value)
  //   * date-anchored URLs: noindex (calendar variants explode into
  //     millions of permutations, all collapsing to the same intent)
  // The canonical itself stays index-eligible because dates / page get
  // stripped on the way in.
  const pageNum = Number(params.page ?? 1) || 1;
  const hasDates = !!(params.startDate || params.endDate);
  // Only the headline destination [× single boat type] page is index-worthy
  // (it matches the location / category sitemaps). Everything beyond that —
  // marina-id "related" links (?did=), multi-destination combos, extra boat
  // types, or any sidebar filter — is a near-duplicate of the headline page
  // and was polluting the index ("Duplicate, Google chose different canonical"
  // on 50+ /search?destinations= combos + thousands of crawled ?did= URLs).
  // Noindex them; the canonical above still points back to the clean headline.
  const INDEX_BLOCKING_PARAMS = [
    'did',
    'search',
    'manufacturers',
    'models',
    'mfid',
    'mid',
    'amenities',
    'services',
    'amenityLabels',
    'servicesLabels',
    'charterType',
    'mainSailType',
    'yid',
    'sortBy',
    'sortDirection',
    'minPrice',
    'maxPrice',
    'minCabins',
    'maxCabins',
    'minPersons',
    'maxPersons',
    'minBerths',
    'maxBerths',
    'minLength',
    'maxLength',
    'minBuildYear',
    'maxBuildYear',
    'minWc',
    'maxWc',
    'minEnginePower',
    'maxEnginePower',
  ];
  const hasNonHeadlineFilter = INDEX_BLOCKING_PARAMS.some(k => {
    const v = (params as unknown as Record<string, string | string[] | undefined>)[k];

    return Array.isArray(v) ? v.length > 0 : v != null && String(v).length > 0;
  });
  // A destination landing (`?destinations=x[&boatTypes=Y]`) is only worth
  // indexing when it passes the shared landing gate (landingGate.ts — the
  // same predicate the location / category sitemaps are built from): a
  // catalogue place with boats (of that type), with curated text (for that
  // type) in this locale. Otherwise noindex,follow. hreflang lists only the
  // locales that pass.
  let weakLanding = false;
  let alternateLocales: string[] | undefined;

  if (uniqueRawDestinations.length === 1 && !landing.hasOwnDid) {
    const gate = await evaluateLanding(singleResolved, singleBoatType);

    weakLanding = !gate.indexableLocales.includes(locale);
    alternateLocales = gate.indexableLocales;
  }

  // Boat type without a destination (`/search?boatTypes=CATAMARAN`, linked
  // from the home type cards): the worldwide catalogue of one type with a
  // generic title and meta, in no sitemap. noindex,follow until these pages
  // get their own copy (owner decision 26.9.2026, audit B04) — the links
  // stay, and robots now agrees with the sitemaps (one gate).
  const typeOnly = uniqueRawDestinations.length === 0 && !landing.hasOwnDid && boatTypes.length > 0;

  if (typeOnly) alternateLocales = [];

  const noindex =
    pageNum > 1 ||
    hasDates ||
    uniqueRawDestinations.length > 1 ||
    boatTypes.length > 1 ||
    hasUnknownBoatType ||
    hasNonHeadlineFilter ||
    typeOnly ||
    weakLanding;

  return buildMetadata({
    locale: locale as LocaleType,
    title,
    description,
    path,
    robots: { noindex },
    alternateLocales,
  });
}

/**
 * BreadcrumbList for a destination landing: Home › Country › Region › Place
 * [› Type], the same crumbs as the visible trail above the H1 (landingCrumbs
 * in landingNav.ts — each an indexable landing in its canonical URL, the
 * last one this page's canonical). Other searches (several destinations, a
 * did link, a boat type alone) have no place in the hierarchy to crumb.
 */
function buildSearchBreadcrumb(locale: LocaleType, crumbs: LandingCrumb[]) {
  if (crumbs.length < 2) return null;

  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: crumbs.map((crumb, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name: crumb.label,
      item: localizedUrl(locale, crumb.path),
    })),
  };
}

/**
 * Top-of-page `Product` schema for the first N yachts in the search
 * result. Boataround does the same thing — it gives Google an explicit
 * carousel of yachts (each with price, image, brand) that can render as
 * a rich result block under the main listing. Without it the SERP entry
 * is just a plain blue link; with it we win SERP real estate even when
 * we rank below.
 *
 * We wrap the products in an `ItemList` so the position in the result
 * list is preserved (Google uses this for "Products" rich result
 * eligibility). Cap at 10 — Google ignores more, and emitting 100+ JSON
 * objects per page would bloat the SSR payload for negligible gain.
 *
 * Output is a `<script type="application/ld+json">` tag — entirely
 * invisible in the rendered page. Zero UI / layout impact.
 */
const PRODUCT_SCHEMA_LIMIT = 10;

function buildSearchProductsLd(
  yachts: YachtModelShortInfo[] | undefined,
  locale: LocaleType,
  tDesc: BoatDescTranslate,
  manufacturers: ManufacturerLookup | null
) {
  if (!yachts?.length) return null;

  // Google requires `offers` (or reviews) on every merchant-listing Product,
  // and the Offer must carry the price the page shows — so only the yachts
  // whose card shows a price (hasListingPrice; the rest read "Price on
  // request"): no 0 € sync noise, no boat without a bookable week.
  const priced = yachts.filter(y => hasListingPrice(y));

  if (!priced.length) return null;

  const items = priced.slice(0, PRODUCT_SCHEMA_LIMIT).map((y, idx) => {
    // The page's own locale (audit B31): /de landings listed English boat URLs.
    const yachtUrl = localizedUrl(locale, `/boat/${y.slug}`);
    const fullName =
      [y.modelName, y.name].filter(Boolean).join(' ').replace(/\s+/g, ' ').trim() || y.name?.trim() || 'Yacht';
    // The builder, from data (yachtBrand.ts) — not the model's first word,
    // which read "Sun", "Oceanis", "Sunsail" on 32 % of products (B40).
    const brand = yachtBrandName(y, manufacturers);
    // Google Merchant listings REQUIRES `image` on every Product — a missing
    // field is a critical GSC error. Always set it, falling back to the site
    // OG image when the yacht has no photo (a valid fallback beats no image),
    // mirroring the boat-detail Product schema.
    const imageUrl = y.mainImageId ? getBoatImageUrl(y.mainImageId, 1200) : `${meta.url}/meta/og-image.png`;
    const country = y.location?.countryCode;
    const product: Record<string, unknown> = {
      '@type': 'Product',
      '@id': yachtUrl,
      name: fullName,
      image: imageUrl,
      url: yachtUrl,
      description: buildBoatDescription(tDesc, {
        name: `${fullName}${y.buildYear ? ` (${y.buildYear})` : ''}`,
        marina: y.location?.name,
        cabins: y.cabins || null,
        guests: y.maxPersons || null,
      }),
    };

    if (brand) product.brand = { '@type': 'Brand', name: brand };

    // The card's own figure: the TOTAL for the period ("Price for 7 days
    // 1,900 €" — per-day rate × days, rounded, in the page currency), not the
    // per-day rate the API returns (the markup read 271 for that card). The
    // period is stated as the reference quantity of a UnitPriceSpecification.
    const days = listingPriceDays(y);
    const info = y.clientPriceInfo;
    const inPageCurrency = info?.amount != null && !!info.currency;
    const total = Math.round((inPageCurrency ? info.amount : y.clientPriceEur) * days);
    const priceCurrency = (inPageCurrency ? info.currency : 'EUR').toUpperCase();

    product.offers = {
      '@type': 'Offer',
      url: yachtUrl,
      price: String(total),
      priceCurrency,
      priceSpecification: {
        '@type': 'UnitPriceSpecification',
        price: total,
        priceCurrency,
        referenceQuantity: { '@type': 'QuantitativeValue', value: days, unitCode: 'DAY' },
      },
      availability:
        y.offerStatus === 'FREE' || y.offerStatus === 'OPTION_EXPIRED'
          ? 'https://schema.org/InStock'
          : 'https://schema.org/PreOrder',
      // A charter isn't a shipped/returnable good, but Google's merchant
      // listing asks for both fields — declare them accurately (nothing
      // ships, no product returns), same as the boat-detail schema.
      shippingDetails: {
        '@type': 'OfferShippingDetails',
        shippingRate: { '@type': 'MonetaryAmount', value: 0, currency: 'EUR' },
        // Google requires deliveryTime whenever shippingDetails is present (GSC
        // "Missing field deliveryTime", 18.7.2026). Booking confirmation is
        // issued instantly and nothing physically ships → handling + transit 0.
        deliveryTime: {
          '@type': 'ShippingDeliveryTime',
          handlingTime: { '@type': 'QuantitativeValue', minValue: 0, maxValue: 0, unitCode: 'DAY' },
          transitTime: { '@type': 'QuantitativeValue', minValue: 0, maxValue: 0, unitCode: 'DAY' },
        },
        ...(country ? { shippingDestination: { '@type': 'DefinedRegion', addressCountry: country } } : {}),
      },
      hasMerchantReturnPolicy: {
        '@type': 'MerchantReturnPolicy',
        returnPolicyCategory: 'https://schema.org/MerchantReturnNotPermitted',
        ...(country ? { applicableCountry: country } : {}),
      },
    };

    return {
      '@type': 'ListItem',
      position: idx + 1,
      item: product,
    };
  });

  return {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    itemListElement: items,
  };
}

export default async function SearchPage({ searchParams }: SearchPageProps) {
  const params = await searchParams;
  const locale = await getLocale();

  // Destination name → did on the server: the backend filters by did only,
  // so `/search?destinations=greece` needs `did=c-86` on every yacht fetch
  // (Product LD below AND the visible list in SearchView → BoatsWrapper).
  // Re-resolved on every request — filter changes re-render this component.
  const landing: SearchLanding = await resolveSearchLanding(params);

  redirectToCanonicalLanding(locale, params, landing);

  const effectiveParams = withLandingDid(params, landing);
  // Undated landings read the yacht list through a 10-minute Data Cache
  // window (see landingFetchRevalidate); anything dated/filtered stays live.
  const fetchRevalidate = landingFetchRevalidate(params, landing);

  const boatTypes = splitSearchParam(params.boatTypes);
  const singleBoatType = boatTypes.length === 1 && isVesselType(boatTypes[0]) ? boatTypes[0] : null;

  const currency = (params.currency as Currency) || Currency.EUR;
  // Charter facts block — only on landings the index gate lets Google index here.
  const charterFacts = await charterFactsTargetFor(landing, singleBoatType, boatTypes.length, locale);

  // A destination landing: one catalogue place that can carry a landing URL
  // (an unresolved value is raw URL input), at most one known boat type — or
  // a dropdown search whose own did is exactly one such place. Its breadcrumb
  // and link blocks (landingNav.ts) are built from that place.
  let place = !landing.hasOwnDid && landing.destinations.length === 1 ? landing.resolved[0] : null;

  if (landing.hasOwnDid) {
    place = await placeForDids(splitSearchParam(params.did)).catch(() => null);
  }

  const landingPlace =
    place && isLandingExpressible(place.name) && boatTypes.length === (singleBoatType ? 1 : 0)
      ? { name: place.name, boatType: singleBoatType }
      : null;
  const breadcrumbSchema = buildSearchBreadcrumb(
    locale as LocaleType,
    landingPlace ? await landingCrumbs(landingPlace.name, landingPlace.boatType, locale).catch(() => []) : []
  );
  // H1 from the same source as the <title> (landingCopy.ts); null keeps the
  // page's own heading (no destination).
  const { h1 } = await getLandingCopy(locale, params);

  // Fetch the top-N yachts here so we can emit Product schema in the
  // initial HTML. This is a separate fetch from the one that powers the
  // visible list (BoatsWrapper inside SearchView) — both go through the
  // same backend endpoint with `next.revalidate`, so any deduping that
  // Next.js's HTTP fetch cache can do happens automatically. We fail
  // soft: a backend hiccup just means no Product LD this render.
  let productsLd: ReturnType<typeof buildSearchProductsLd> = null;
  // The listing total, rendered by the sidebar's "N boats available" pill in
  // the SSR HTML (it read "0 boats available · live" until hydration).
  let totalCount: number | null = null;

  const yachtsResp = await fetchYachts(yachtFetchParams(effectiveParams, !!fetchRevalidate), currency, locale, {
    revalidate: fetchRevalidate,
  }).catch(error => {
    // An undated landing (fetchRevalidate set) without its boats is not a
    // page to show Google: answer 500 (retried) rather than an indexable
    // landing with an empty list (audit B02, same rule as the boat pages).
    // Other searches soft-fail as before — the list below retries on its own.
    if (fetchRevalidate) throw error;

    return null;
  });

  try {
    const [tBoatMeta, manufacturers] = await Promise.all([
      getTranslations({ locale, namespace: 'metadata.boat' }),
      loadManufacturerLookup(),
    ]);

    totalCount = yachtsResp?.page?.totalElements ?? null;
    productsLd = buildSearchProductsLd(
      yachtsResp?.content,
      locale as LocaleType,
      (key, values) => tBoatMeta(key as never, values as never),
      manufacturers
    );
  } catch {
    // Soft fail — page still renders without Product schema.
  }

  // The provider wraps the whole Layout, not just SearchView: the mobile
  // header's filter modal (FiltersSectionV2 → distribution fetch) lives in
  // the header and must see the resolved did too.
  return (
    <ResolvedDestinationProvider value={{ did: landing.did, labels: landing.labels, heading: h1 }}>
      <Layout>
        {breadcrumbSchema && (
          <script
            type="application/ld+json"
            // eslint-disable-next-line react/no-danger
            dangerouslySetInnerHTML={{ __html: serializeJsonLd(breadcrumbSchema) }}
          />
        )}
        {productsLd && (
          <script
            type="application/ld+json"
            // eslint-disable-next-line react/no-danger
            dangerouslySetInnerHTML={{ __html: serializeJsonLd(productsLd) }}
          />
        )}
        <SearchView
          searchParams={effectiveParams}
          destinationLabels={landing.labels}
          fetchRevalidate={fetchRevalidate}
          charterFacts={charterFacts}
          landingPlace={landingPlace}
          totalCount={totalCount}
        />
      </Layout>
    </ResolvedDestinationProvider>
  );
}
