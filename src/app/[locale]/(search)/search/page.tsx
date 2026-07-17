/* eslint-disable no-nested-ternary, no-void */
import { Metadata } from 'next';
import { Locale } from 'next-intl';
import { getLocale, getTranslations } from 'next-intl/server';

import Layout from '@/components/Layout';
import { AllSearchParams } from '@/config/form-models.config';
import { LocaleType } from '@/config/locales.config';
import { Currency } from '@/models/user.model';
import { VESSEL_TYPE_LABEL_MAP_FOR_RENTAL, VesselType, YachtModelShortInfo } from '@/models/yacht.model';
import { fetchYachts } from '@/services/yacht.service';
import { buildMetadata } from '@/utils/static/buildMetadata';
import { getBoatImageUrl } from '@/utils/static/imageUtils';
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

  // Next.js leaves comma-separated query values as a single string (e.g.
  // `?destinations=A%2CB` → "A,B") rather than splitting into an array, so
  // we explicitly split on `,` here. The popular dual-source regions also
  // expand to two backend ids that share the same display label, so the
  // resulting list is deduped case-insensitively before joining.
  const destinationsRaw = params.destinations;
  const destinations: string[] = Array.isArray(destinationsRaw)
    ? destinationsRaw
        .flatMap(d => String(d).split(','))
        .map(d => d.trim())
        .filter(Boolean)
    : destinationsRaw
      ? String(destinationsRaw)
          .split(',')
          .map(d => d.trim())
          .filter(Boolean)
      : [];
  // Lookup helper — translates a raw URL label into the locale's
  // nominative / locative form. Falls back through (locative ➜ nominative
  // ➜ raw) so a label without a JSON entry still renders something sane.
  const translate = (raw: string, useLocative: boolean): string => {
    const key = DESTINATION_KEY_BY_LABEL[raw.toLowerCase()];

    if (!key) return raw;

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

  const boatTypesRaw = params.boatTypes;
  const boatTypes: string[] = Array.isArray(boatTypesRaw)
    ? boatTypesRaw.flatMap(b => String(b).split(',')).filter(Boolean)
    : boatTypesRaw
      ? String(boatTypesRaw).split(',').filter(Boolean)
      : [];
  const singleBoatType = boatTypes.length === 1 ? (boatTypes[0] as VesselType) : null;
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
  // canonical uses the *raw* URL labels (deduped case-insensitively) — NOT
  // the locale-specific translations — so every language hits the same URL
  // and Google indexes one canonical per (raw destination × boat type) pair.
  const uniqueRawDestinations: string[] = Array.from(new Map(destinations.map(d => [d.toLowerCase(), d])).values());
  const canonicalParams = new URLSearchParams();

  if (uniqueRawDestinations.length) canonicalParams.set('destinations', uniqueRawDestinations.join(','));

  if (singleBoatType) canonicalParams.set('boatTypes', singleBoatType);

  const canonicalQuery = canonicalParams.toString();
  const path = canonicalQuery ? `${tMeta('path')}?${canonicalQuery}` : tMeta('path');

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
  const noindex =
    pageNum > 1 || hasDates || uniqueRawDestinations.length > 1 || boatTypes.length > 1 || hasNonHeadlineFilter;

  return buildMetadata({
    locale: locale as LocaleType,
    title,
    description,
    path,
    robots: { noindex },
  });
}

/**
 * BreadcrumbList for the search page. Surfaces "Home › Catamaran ›
 * Croatia" navigation chip in the SERP and helps Google understand the
 * page's place in the site hierarchy. We only emit when at least one
 * filter (destination or boat type) is present — a bare `/search` page
 * is the search root and has nothing to crumb to.
 *
 * Items use the *nominative* destination form (chip-style "Croatia",
 * not locative "Hrvatskoj") because that's the URL slug equivalent and
 * matches the visible link target.
 */
function buildSearchBreadcrumb(args: { baseUrl: string; joinedNominative: string; singleBoatType: string | null }) {
  const { baseUrl, joinedNominative, singleBoatType } = args;
  const items: Array<{ name: string; item: string }> = [{ name: 'Boat4You', item: baseUrl }];

  if (singleBoatType) {
    items.push({
      name: singleBoatType
        .replace(/_/g, ' ')
        .toLowerCase()
        .replace(/\b\w/g, c => c.toUpperCase()),
      item: `${baseUrl}/search?boatTypes=${singleBoatType}`,
    });
  }

  if (joinedNominative) {
    items.push({
      name: joinedNominative,
      item: `${baseUrl}/search?destinations=${encodeURIComponent(joinedNominative)}`,
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

function buildSearchProductsLd(yachts: YachtModelShortInfo[] | undefined, baseUrl: string, currency: string) {
  if (!yachts?.length) return null;

  // Google requires `offers` (or reviews) on every merchant-listing Product,
  // and a 0 € price is sync noise, not a bookable offer — keep only yachts
  // with a real price in the ItemList, mirroring the boat-detail schema.
  const priced = yachts.filter(y => y.clientPriceEur != null && y.clientPriceEur > 0);

  if (!priced.length) return null;

  const items = priced.slice(0, PRODUCT_SCHEMA_LIMIT).map((y, idx) => {
    const yachtUrl = `${baseUrl}/boat/${y.slug}`;
    const fullName = [y.modelName, y.name].filter(Boolean).join(' ').trim() || y.name || 'Yacht';
    const brandFirstWord = (y.modelName || '').trim().split(/\s+/)[0] || null;
    // Google Merchant listings REQUIRES `image` on every Product — a missing
    // field is a critical GSC error. Always set it, falling back to the site
    // OG image when the yacht has no photo (a valid fallback beats no image),
    // mirroring the boat-detail Product schema.
    const imageUrl = y.mainImageId ? getBoatImageUrl(y.mainImageId, 1200) : `${baseUrl}/meta/og-image.png`;
    const specs: string[] = [];

    if (y.cabins) specs.push(`${y.cabins} cabin${y.cabins === 1 ? '' : 's'}`);

    if (y.maxPersons) specs.push(`up to ${y.maxPersons} guests`);

    const country = y.location?.countryCode;
    const product: Record<string, unknown> = {
      '@type': 'Product',
      '@id': yachtUrl,
      name: fullName,
      image: imageUrl,
      url: yachtUrl,
      description:
        `Charter the ${fullName}${y.buildYear ? ` (${y.buildYear})` : ''}` +
        `${y.location?.name ? ` from ${y.location.name}` : ''}.` +
        `${specs.length ? ` ${specs.join(', ')}.` : ''} Check availability and book directly on boat4you.com.`,
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

  // Re-derive the nominative destination + single boat type for
  // breadcrumbs — generateMetadata already does this, but it runs in a
  // separate request lifecycle and we don't want to thread the values
  // through global state. Cheap to recompute (string ops only).
  const destinationsRaw = params.destinations;
  const destinations: string[] = Array.isArray(destinationsRaw)
    ? destinationsRaw
        .flatMap(d => String(d).split(','))
        .map(d => d.trim())
        .filter(Boolean)
    : destinationsRaw
      ? String(destinationsRaw)
          .split(',')
          .map(d => d.trim())
          .filter(Boolean)
      : [];
  const uniqueDestinations: string[] = Array.from(new Map(destinations.map(d => [d.toLowerCase(), d])).values());
  const boatTypesRaw = params.boatTypes;
  const boatTypes: string[] = Array.isArray(boatTypesRaw)
    ? boatTypesRaw.flatMap(b => String(b).split(',')).filter(Boolean)
    : boatTypesRaw
      ? String(boatTypesRaw).split(',').filter(Boolean)
      : [];
  const singleBoatType = boatTypes.length === 1 ? boatTypes[0] : null;

  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://www.boat4you.com';
  const currency = (params.currency as Currency) || Currency.EUR;

  const breadcrumbSchema = buildSearchBreadcrumb({
    baseUrl,
    joinedNominative: uniqueDestinations.join(' and '),
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
    const yachtsResp = await fetchYachts(params as any, currency, locale);

    productsLd = buildSearchProductsLd(yachtsResp?.content, baseUrl, currency);
  } catch {
    // Soft fail — page still renders without Product schema.
  }

  return (
    <Layout>
      {breadcrumbSchema && (
        <script
          type="application/ld+json"
          // eslint-disable-next-line react/no-danger
          dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
        />
      )}
      {productsLd && (
        <script
          type="application/ld+json"
          // eslint-disable-next-line react/no-danger
          dangerouslySetInnerHTML={{ __html: JSON.stringify(productsLd) }}
        />
      )}
      <SearchView searchParams={params} />
    </Layout>
  );
}
