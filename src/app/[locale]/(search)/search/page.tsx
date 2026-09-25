/* eslint-disable no-nested-ternary, no-void */
import { Metadata } from 'next';
import { Locale } from 'next-intl';
import { getLocale, getTranslations } from 'next-intl/server';

import Layout from '@/components/Layout';
import { AllSearchParams } from '@/config/form-models.config';
import { LocaleType } from '@/config/locales.config';
import { Currency } from '@/models/user.model';
import { VESSEL_TYPE_LABEL_MAP_FOR_RENTAL, YachtModelShortInfo, isVesselType } from '@/models/yacht.model';
import { fetchYachts } from '@/services/yacht.service';
import { evaluateLanding } from '@/utils/server/landingGate';
import {
  SearchLanding,
  resolveSearchLanding,
  splitSearchParam,
  uniqueCaseInsensitive,
  withLandingDid,
} from '@/utils/server/searchLanding';
import { BoatDescTranslate, buildBoatDescription } from '@/utils/static/boatMetaDescription';
import { buildMetadata, localizedUrl } from '@/utils/static/buildMetadata';
import { getBoatImageUrl } from '@/utils/static/imageUtils';
import { serializeJsonLd } from '@/utils/static/jsonLd';
import { buildSearchLandingPath, isLandingExpressible } from '@/utils/static/searchLandingPath';
import { charterFactsTargetFor } from '@/views/Search/CharterFacts/charterFactsTarget';
import { ResolvedDestinationProvider } from '@/views/Search/SearchView/ResolvedDestinationContext';
import SearchView from '@/views/Search/SearchView/SearchView';

/**
 * Maps the lowercased URL `?destinations=` value (also used by the FE
 * client lookup in BoatsSection) to the matching JSON key under
 * `home.destinationsSection.destinations` / `destinationsLocative`. Keep
 * this in sync with the analogous client-side dict in BoatsSection.tsx —
 * any new POPULAR_SEARCHES entry needs an entry in both maps so the H1
 * (server-rendered title) and the page H1 (client-rendered) agree.
 */
const DESTINATION_KEY_BY_LABEL: Record<string, string> = {
  bahamas: 'bahamas',
  caribbean: 'caribbean',
  croatia: 'croatia',
  france: 'france',
  greece: 'greece',
  italy: 'italy',
  martinique: 'martinique',
  montenegro: 'montenegro',
  seychelles: 'seychelles',
  spain: 'spain',
  turkey: 'türkiye',
  türkiye: 'türkiye',
  'virgin islands (british)': 'virginIslandsBritish',
  grenada: 'grenada',
  'split region': 'splitRegion',
  'ionian region': 'ionianRegion',
};

interface SearchPageProps {
  params: Promise<{ locale: Locale }>;
  searchParams: Promise<AllSearchParams>;
}

/**
 * Dynamic per-(destination × boat type) metadata. Mirrors the H1 strategy on
 * the page: when both filters are set we lead with the boat type ("Catamaran
 * charter in Croatia"); destination-only uses the broader yacht/boat rental
 * phrasing; pure boat-type-only falls back to the singular noun. When neither
 * filter is set we keep the legacy generic "Search for yachts" copy.
 *
 * Canonical includes the destination + boat-type query params so dual-source
 * pairs (e.g. Ionian + Ionian Islands collapsing to "Ionian Region") still
 * deduplicate to a single canonical URL across MMK and NauSYS picks.
 */
export async function generateMetadata({ params: paramsPromise, searchParams }: SearchPageProps): Promise<Metadata> {
  const { locale } = await paramsPromise;
  const params = await searchParams;
  const tCommon = await getTranslations('common');
  const tMeta = await getTranslations('metadata.metadata.search');
  const tHome = await getTranslations('home');

  // Comma-separated / repeated values split into a list (splitSearchParam);
  // the popular dual-source regions share one display label, so the list is
  // deduped case-insensitively further down before joining.
  const destinations = splitSearchParam(params.destinations);
  // Destination name → did, resolved on the server (the backend filters by
  // did only). Shared with the page render through React `cache`.
  const landing = await resolveSearchLanding(params);
  // Lookup helper — translates a raw URL label into the locale's
  // nominative / locative form. Falls back through (locative ➜ nominative
  // ➜ catalogue name ➜ raw) so a label without a JSON entry still renders
  // "ACI Marina Split" rather than the lowercased URL value.
  const translate = (raw: string, useLocative: boolean): string => {
    const key = DESTINATION_KEY_BY_LABEL[raw.toLowerCase()];

    if (!key) return landing.labels[raw.toLowerCase()] ?? raw;

    const ns = useLocative
      ? `destinationsSection.destinationsLocative.${key}`
      : `destinationsSection.destinations.${key}`;

    try {
      return tHome.raw(ns as Parameters<typeof tHome.raw>[0]) as string;
    } catch {
      return raw;
    }
  };

  const translatedNominative = destinations.map(d => translate(d, false));
  const translatedLocative = destinations.map(d => translate(d, true));
  const uniqueLocative: string[] = Array.from(new Map(translatedLocative.map(d => [d.toLowerCase(), d])).values());
  const uniqueNominative: string[] = Array.from(new Map(translatedNominative.map(d => [d.toLowerCase(), d])).values());
  const joinedLocative = uniqueLocative.join(` ${tCommon('and')} `);
  const joinedNominative = uniqueNominative.join(` ${tCommon('and')} `);

  const boatTypes = splitSearchParam(params.boatTypes);
  // An unknown `boatTypes` value used to crash the metadata (undefined map
  // entry → .replace) and 500 the page; treat it as "no boat type" + noindex.
  // Own-value check: `in` also accepted toString / constructor / __proto__.
  const hasUnknownBoatType = boatTypes.some(b => !isVesselType(b));
  const singleBoatType = boatTypes.length === 1 && isVesselType(boatTypes[0]) ? boatTypes[0] : null;
  // VESSEL_TYPE_LABEL_MAP_FOR_RENTAL feeds the H1 sentence ("Najam
  // katamarana u Hrvatskoj" — genitive in HR, nominative in non-inflecting
  // locales, all driven by the per-locale common.json `*ForRental` keys).
  const boatTypeForRental = singleBoatType
    ? (tCommon.raw(
        VESSEL_TYPE_LABEL_MAP_FOR_RENTAL[singleBoatType].replace(/^common\./, '') as Parameters<typeof tCommon.raw>[0]
      ) as string)
    : null;

  let title: string;
  let description: string;

  if (joinedLocative && boatTypeForRental) {
    title = tCommon('searchH1WithBoatType', { boatType: boatTypeForRental, destination: joinedLocative });
    description = tCommon('searchMetaDescWithBoatType', { boatType: boatTypeForRental, destination: joinedLocative });
  } else if (joinedLocative) {
    title = tCommon('searchH1NoBoatType', { destination: joinedLocative });
    description = tCommon('searchMetaDescNoBoatType', { destination: joinedLocative });
  } else if (boatTypeForRental) {
    title = boatTypeForRental;
    description = tMeta('description');
  } else {
    title = tMeta('title');
    description = tMeta('description');
  }

  // Suppress unused-var lint — joinedNominative is exposed as a hook for
  // future copy that needs the chip-style label (e.g. og:title variant).
  void joinedNominative;

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

  const noindex =
    pageNum > 1 ||
    hasDates ||
    uniqueRawDestinations.length > 1 ||
    boatTypes.length > 1 ||
    hasUnknownBoatType ||
    hasNonHeadlineFilter ||
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
 * BreadcrumbList for the search page. Surfaces "Home › Catamaran ›
 * Croatia" navigation chip in the SERP and helps Google understand the
 * page's place in the site hierarchy. We only emit when at least one
 * filter (destination or boat type) is present — a bare `/search` page
 * is the search root and has nothing to crumb to.
 *
 * Item names use the catalogue display name ("Croatia", "ACI Marina
 * Split"); item URLs use the same canonical landing form as the page's
 * <link rel="canonical"> and the sitemaps (lowercased destination, no did,
 * locale-prefixed), so the last crumb IS the canonical URL.
 */
function buildSearchBreadcrumb(args: {
  locale: LocaleType;
  destinations: string[];
  destinationLabel: string;
  singleBoatType: string | null;
}) {
  const { locale, destinations, destinationLabel, singleBoatType } = args;
  const items: Array<{ name: string; item: string }> = [{ name: 'Boat4You', item: localizedUrl(locale, '/') }];

  if (singleBoatType) {
    items.push({
      name: singleBoatType
        .replace(/_/g, ' ')
        .toLowerCase()
        .replace(/\b\w/g, c => c.toUpperCase()),
      item: localizedUrl(locale, buildSearchLandingPath(null, singleBoatType)),
    });
  }

  if (destinations.length) {
    items.push({
      name: destinationLabel,
      item: localizedUrl(locale, buildSearchLandingPath(destinations, singleBoatType)),
    });
  }

  if (items.length <= 1) return null;

  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((b, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name: b.name,
      item: b.item,
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
  baseUrl: string,
  currency: string,
  tDesc: BoatDescTranslate
) {
  if (!yachts?.length) return null;

  // Google requires `offers` (or reviews) on every merchant-listing Product,
  // and a 0 € price is sync noise, not a bookable offer — keep only yachts
  // with a real price in the ItemList, mirroring the boat-detail schema.
  const priced = yachts.filter(y => y.clientPriceEur != null && y.clientPriceEur > 0);

  if (!priced.length) return null;

  const items = priced.slice(0, PRODUCT_SCHEMA_LIMIT).map((y, idx) => {
    const yachtUrl = `${baseUrl}/boat/${y.slug}`;
    const fullName =
      [y.modelName, y.name].filter(Boolean).join(' ').replace(/\s+/g, ' ').trim() || y.name?.trim() || 'Yacht';
    const brandFirstWord = (y.modelName || '').trim().split(/\s+/)[0] || null;
    // Google Merchant listings REQUIRES `image` on every Product — a missing
    // field is a critical GSC error. Always set it, falling back to the site
    // OG image when the yacht has no photo (a valid fallback beats no image),
    // mirroring the boat-detail Product schema.
    const imageUrl = y.mainImageId ? getBoatImageUrl(y.mainImageId, 1200) : `${baseUrl}/meta/og-image.png`;
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

    if (brandFirstWord) product.brand = { '@type': 'Brand', name: brandFirstWord };

    product.offers = {
      '@type': 'Offer',
      url: yachtUrl,
      // Per-day price the search card shows. Round to integer so the
      // SERP doesn't render trailing decimals where they aren't useful.
      price: String(Math.round(y.clientPriceEur)),
      priceCurrency: (currency || 'EUR').toUpperCase(),
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
  const effectiveParams = withLandingDid(params, landing);

  const boatTypes = splitSearchParam(params.boatTypes);
  const singleBoatType = boatTypes.length === 1 && isVesselType(boatTypes[0]) ? boatTypes[0] : null;

  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://www.boat4you.com';
  const currency = (params.currency as Currency) || Currency.EUR;
  // Charter facts block — only on landings the index gate lets Google index here.
  const charterFacts = await charterFactsTargetFor(landing, singleBoatType, boatTypes.length, locale);

  // Destination crumb only from catalogue names that can carry a landing URL:
  // an unresolved value is raw URL input (it was reflected into the JSON-LD)
  // and has no landing page to crumb to.
  const crumbNames = landing.resolved.map(r => r?.name ?? '');
  const crumbDestinations = crumbNames.every(n => n && isLandingExpressible(n)) ? crumbNames : [];
  const breadcrumbSchema = buildSearchBreadcrumb({
    locale: locale as LocaleType,
    destinations: crumbDestinations,
    destinationLabel: crumbDestinations.join(' and '),
    singleBoatType,
  });

  // Fetch the top-N yachts here so we can emit Product schema in the
  // initial HTML. This is a separate fetch from the one that powers the
  // visible list (BoatsWrapper inside SearchView) — both go through the
  // same backend endpoint with `next.revalidate`, so any deduping that
  // Next.js's HTTP fetch cache can do happens automatically. We fail
  // soft: a backend hiccup just means no Product LD this render.
  let productsLd: ReturnType<typeof buildSearchProductsLd> = null;

  try {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const yachtsResp = await fetchYachts(effectiveParams as any, currency, locale);
    const tBoatMeta = await getTranslations({ locale, namespace: 'metadata.boat' });

    productsLd = buildSearchProductsLd(yachtsResp?.content, baseUrl, currency, (key, values) =>
      tBoatMeta(key as never, values as never)
    );
  } catch {
    // Soft fail — page still renders without Product schema.
  }

  // The provider wraps the whole Layout, not just SearchView: the mobile
  // header's filter modal (FiltersSectionV2 → distribution fetch) lives in
  // the header and must see the resolved did too.
  return (
    <ResolvedDestinationProvider value={{ did: landing.did, labels: landing.labels }}>
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
        <SearchView searchParams={effectiveParams} destinationLabels={landing.labels} charterFacts={charterFacts} />
      </Layout>
    </ResolvedDestinationProvider>
  );
}
