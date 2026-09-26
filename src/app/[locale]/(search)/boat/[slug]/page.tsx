/* eslint-disable no-nested-ternary */
import { Container } from '@mui/material';
import { Metadata } from 'next';
import { Locale } from 'next-intl';
import { getTranslations } from 'next-intl/server';
import { notFound, permanentRedirect } from 'next/navigation';

import { getLoggedInUser } from '@/actions/auth.actions';
import { getSingleYacth } from '@/actions/yacht.actions';
import Layout from '@/components/Layout';
import SuggestedItineraries from '@/components/SuggestedItineraries';
import { suggestedAreaLabel, suggestedRouteTitles } from '@/components/SuggestedItineraries/suggestedRouteTitles';
import { AllSearchParams } from '@/config/form-models.config';
import { LocaleType } from '@/config/locales.config';
import { meta } from '@/config/meta';
import { routing } from '@/i18n/routing';
import { Currency } from '@/models/user.model';
import { CHARTER_TYPE_LABEL_MAP, CharterType, YachtModel } from '@/models/yacht.model';
import { boatHubs } from '@/utils/server/catalogueHubs';
import { loadManufacturerLookup } from '@/utils/server/manufacturerLookup';
import { BoatDescTranslate, buildBoatDescription } from '@/utils/static/boatMetaDescription';
import { buildBoatTitle, titleBoatName, titlePlace } from '@/utils/static/boatTitle';
import { buildMetadata, localizedUrl } from '@/utils/static/buildMetadata';
import { getBoatImageUrl } from '@/utils/static/imageUtils';
import { serializeJsonLd } from '@/utils/static/jsonLd';
import { toTitleCase } from '@/utils/static/toTitleCase';
import { ManufacturerLookup, yachtBrandName } from '@/utils/static/yachtBrand';
import { buildYachtFaq, buildYachtFaqSchema } from '@/utils/static/yachtFaq';
import { cleanModelName } from '@/utils/static/yachtModelKey';
import BoatContentSection from '@/views/Boat/BoatContentSection';
import BoatHeroSection from '@/views/Boat/BoatHeroSection';
import BoatHubLinks from '@/views/Boat/BoatHubLinks';
import BoatMobileNavigation from '@/views/Boat/BoatMobileNavigation';
import { BoatTransitionProvider } from '@/views/Boat/BoatTransitionProvider';
import ModelPageLink from '@/views/Boat/ModelPageLink';
import RelatedBoats from '@/views/Boat/RelatedBoats';

/**
 * Absolute CDN URL of the yacht photo used for sharing + rich results, or
 * null when the yacht has no media synced (~5-10% of the catalogue at any
 * time) so callers can fall back to the site-wide OG asset.
 *
 * The detail payload ships `yachtImages[].url = null` — only the id is
 * populated (same partner-sync quirk the listing cards work around), so
 * reading `.url` silently yielded undefined and both og:image and the
 * Product schema fell back to the boat4you logo on EVERY yacht page: a
 * shared link showed our logo instead of the boat, and Google's Product
 * rich result did the same (found 2.8.2026). Build the URL from the id
 * instead. 1200px matches the OG recommendation and is a width Bunny
 * already caches for the listing cards.
 */
const yachtShareImageUrl = (yacht: YachtModel): string | null => {
  const images = yacht.yachtImages || [];
  const imageId = images.find(i => i.mainImage)?.id ?? images[0]?.id;

  if (!imageId) return null;

  const url = getBoatImageUrl(imageId, 1200);

  // The image origin comes from a build-time env var, so a build with the
  // wrong (or no) env bakes a localhost or `undefined/...` URL into every
  // yacht page. Crawlers cache og:image for weeks — far longer than it takes
  // to notice and roll back — so anything that isn't a public https origin
  // falls back to the site-wide asset instead. See the env-bake gotcha in
  // DEPLOY_NOTES: local builds resolve this to https://localhost:8443.
  const isPubliclyFetchable = /^https:\/\//.test(url) && !/localhost|127\.0\.0\.1/.test(url);

  return isPubliclyFetchable ? url : null;
};

/**
 * The boat's canonical path. A second listing of a boat another channel
 * already lists (two partner systems, or an owner and a broker agency) names
 * the copy the listings and the sitemap show: the backend sets
 * `listingCanonicalSlug` on it (yacht_listing_twin, V9_69). Before, both
 * copies were 200, index and self-canonical under one title
 * (`…-ilia-8079` / `…-ilia-3528`, audit B05/B17). A canonical, not a
 * redirect: dated searches keep both copies, and their availability can
 * differ. canonical, og:url, hreflang, the Product URL and the last
 * breadcrumb all use it.
 */
const canonicalBoatPath = (yacht: YachtModel): string => `/boat/${yacht.listingCanonicalSlug?.trim() || yacht.slug}`;

/**
 * Build a `Product` JSON-LD schema for a yacht detail page.
 *
 * Yacht charter is a hybrid commerce object — Schema.org doesn't have a
 * dedicated "yacht charter" type. `Product` gives the broadest rich-result
 * coverage (price snippet + image thumbnail + brand chip in SERP), which is
 * what Boataround uses on equivalent pages and what Google rewards with the
 * highest CTR uplift on bookable listings.
 *
 * Fields populated:
 *   - `name` / `description` — same shape as the visible H1 / meta description
 *     so SERP and on-page content stay aligned
 *   - `image` — main yacht photo URL (already absolute from CDN)
 *   - `brand` — the builder (Lagoon, Bavaria, Beneteau …), yachtBrand.ts
 *   - `category` — vessel type (Catamaran, Sailing yacht …)
 *   - `additionalProperty` — yacht specs (year, cabins, berths, max persons,
 *     length) so Google's product knowledge graph can match facets
 *   - `offers` — `AggregateOffer` with the min/max 7-night price of the
 *     upcoming weeks; populated only when a week carries a price >0
 *
 * `aggregateRating` is intentionally OMITTED — Google flags fake/empty review
 * markup as spam and removes the rich result entirely. Re-add only when a
 * real review platform (Trustpilot / Google Reviews / internal) is wired up.
 */
/** Nights of one offer (dateFrom → dateTo), or null when unreadable. */
const offerNights = (offer: { dateFrom?: string; dateTo?: string; numberOfDays?: number | null }): number | null => {
  const from = Date.parse(offer.dateFrom?.slice(0, 10) ?? '');
  const to = Date.parse(offer.dateTo?.slice(0, 10) ?? '');

  if (Number.isFinite(from) && Number.isFinite(to)) return Math.round((to - from) / 86_400_000);

  return offer.numberOfDays ?? null;
};

function buildYachtProductSchema(
  yacht: YachtModel,
  locale: LocaleType,
  tDesc: BoatDescTranslate,
  manufacturers: ManufacturerLookup | null
) {
  const url = localizedUrl(locale, canonicalBoatPath(yacht));
  const mainImage = yachtShareImageUrl(yacht) || `${meta.url}/meta/og-image.png`;

  // The builder from data (yachtBrand.ts): the payload's manufacturer, else
  // the catalogue manufacturer the model name starts with — canonicalised,
  // and never a charter operator ("Sunsail 424" has no builder in the
  // payload; the first-word guess used to publish brand "Sunsail").
  const brandName = yachtBrandName(yacht, manufacturers);

  // Weekly figures only (audit B26): the range used to span every offer
  // length — 3,116 € to 45,317 € over 233 mixed 7/14/21/28-night offers —
  // while the page and the landings price by the week. Future Saturday-style
  // 7-night offers with a real price; the bookable ones (FREE, or an expired
  // option) when there are any, else the booked weeks as SoldOut.
  const today = new Date().toISOString().slice(0, 10);
  const weekly = (yacht.offers || []).filter(
    o =>
      typeof o.clientPriceEur === 'number' &&
      o.clientPriceEur > 0 &&
      offerNights(o) === 7 &&
      (o.dateFrom ?? '').slice(0, 10) >= today
  );
  const bookable = weekly.filter(o => (o.status as string) === 'FREE' || (o.status as string) === 'OPTION_EXPIRED');
  const priced = bookable.length ? bookable : weekly;
  const offerPrices = priced.map(o => Math.round(o.clientPriceEur));

  const lowPrice = offerPrices.length ? Math.min(...offerPrices) : null;
  const highPrice = offerPrices.length ? Math.max(...offerPrices) : null;

  // No bookable offer with a real price → we can't form a VALID Product. Google
  // requires `offers`, `review`, or `aggregateRating` on a Product, and for an
  // unavailable yacht we have none (no price, no reviews). Emitting a Product
  // without them makes the page "invalid" in Search Console (175 such pages,
  // 6/2/26). Skip the Product schema entirely for these — the page stays
  // indexable with its BreadcrumbList + the site-wide WebSite/Organization
  // schema, just without a Product rich-result. Available yachts (with offers)
  // are unaffected and keep their valid Product below.
  if (!lowPrice || !highPrice) return null;

  // Google Merchant-listing validation wants a `description` on every Product.
  // ~5-10% of synced yachts have no description/sysDescription, which tripped
  // the "Missing field description" warning in Search Console — build a
  // spec-based fallback so the field is always present.
  const productName = [yacht.model, yacht.name].filter(Boolean).join(' ').replace(/\s+/g, ' ').trim();
  const fallbackDescription = buildBoatDescription(tDesc, {
    name: `${productName}${yacht.buildYear ? ` (${yacht.buildYear})` : ''}`,
    marina: yacht.location?.name,
    cabins: yacht.cabins || null,
    berths: yacht.berths || null,
  });
  const description = (yacht.description || yacht.sysDescription || fallbackDescription).slice(0, 5000);

  // Charter country (used for the offer's return/shipping region declarations).
  const country = yacht.location?.countryCode;

  // A yacht charter isn't a shipped/returnable physical good, but Google's
  // Merchant-listing enhancement still asks for these on the offer. Declare
  // them accurately: no shipping cost (nothing ships) + no returns (bookings
  // follow a cancellation policy, not product returns). Clears the two
  // non-critical Search Console warnings.
  const offerShippingDetails = {
    '@type': 'OfferShippingDetails',
    shippingRate: { '@type': 'MonetaryAmount', value: 0, currency: 'EUR' },
    // Google requires deliveryTime whenever shippingDetails is present (GSC
    // "Missing field deliveryTime", 18.7.2026). Booking confirmation is issued
    // instantly and nothing physically ships, so handling + transit are zero.
    deliveryTime: {
      '@type': 'ShippingDeliveryTime',
      handlingTime: { '@type': 'QuantitativeValue', minValue: 0, maxValue: 0, unitCode: 'DAY' },
      transitTime: { '@type': 'QuantitativeValue', minValue: 0, maxValue: 0, unitCode: 'DAY' },
    },
    ...(country ? { shippingDestination: { '@type': 'DefinedRegion', addressCountry: country } } : {}),
  };
  const merchantReturnPolicy = {
    '@type': 'MerchantReturnPolicy',
    returnPolicyCategory: 'https://schema.org/MerchantReturnNotPermitted',
    ...(country ? { applicableCountry: country } : {}),
  };

  // Build a non-empty `additionalProperty` array — Google validates each
  // entry has a numeric/string value, so we filter undefined fields out.
  const propertyEntries: Array<{ name: string; value: number | string; unitCode?: string }> = [];

  if (yacht.buildYear) propertyEntries.push({ name: 'Year built', value: yacht.buildYear });

  if (yacht.cabins) propertyEntries.push({ name: 'Cabins', value: yacht.cabins });

  if (yacht.berths) propertyEntries.push({ name: 'Berths', value: yacht.berths });

  if (yacht.maxPersons) propertyEntries.push({ name: 'Max persons', value: yacht.maxPersons });

  if (yacht.length) propertyEntries.push({ name: 'Length', value: yacht.length, unitCode: 'MTR' });

  const schema: Record<string, unknown> = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    productID: String(yacht.id),
    name: productName,
    url,
    image: mainImage,
    description,
    ...(brandName ? { brand: { '@type': 'Brand', name: brandName } } : {}),
    ...(yacht.vesselType ? { category: yacht.vesselType } : {}),
    ...(propertyEntries.length
      ? {
          additionalProperty: propertyEntries.map(e => ({
            '@type': 'PropertyValue',
            ...e,
          })),
        }
      : {}),
    ...(lowPrice && highPrice
      ? {
          offers: {
            '@type': 'AggregateOffer',
            priceCurrency: 'EUR',
            lowPrice,
            highPrice,
            offerCount: offerPrices.length,
            availability: bookable.length ? 'https://schema.org/InStock' : 'https://schema.org/SoldOut',
            url,
            shippingDetails: offerShippingDetails,
            hasMerchantReturnPolicy: merchantReturnPolicy,
          },
        }
      : {}),
  };

  return schema;
}

/**
 * 301 (Next answers 308) to the boat's own slug when the API answers a
 * request with another one: an older slug of a renamed boat, or the id of a
 * dual-source record the backend merged into its canonical boat
 * (`…-desafinado-13163` → `…-desafinado-481`). Before, both URLs answered 200
 * and both sat in the sitemap, the duplicate only declaring a canonical
 * (audit B05). The query (the searched dates) is kept.
 */
const redirectToCanonicalBoat = (
  locale: string,
  requestedSlug: string,
  yacht: YachtModel,
  query: Record<string, string | string[] | undefined>
): void => {
  if (!yacht.slug || yacht.slug === requestedSlug) return;

  const qs = new URLSearchParams();

  Object.entries(query).forEach(([key, value]) => {
    (Array.isArray(value) ? value : [value]).forEach(v => {
      if (v != null) qs.append(key, String(v));
    });
  });

  const prefix = locale === routing.defaultLocale ? '' : `/${locale}`;
  const search = qs.toString();

  permanentRedirect(`${prefix}/boat/${yacht.slug}${search ? `?${search}` : ''}`);
};

export async function generateMetadata({
  params,
  searchParams,
}: {
  params: Promise<{ slug: string; locale: Locale }>;
  searchParams: Promise<AllSearchParams>;
}): Promise<Metadata> {
  const tBoat = await getTranslations('metadata.boat');
  const t = await getTranslations();
  const { slug, locale } = await params;

  const searchParamsData = await searchParams;
  const requestQuery = { ...(searchParamsData as unknown as Record<string, string | string[] | undefined>) };

  if (searchParamsData.startDate) {
    searchParamsData.dateFrom = searchParamsData.startDate;
  }

  if (searchParamsData.endDate) {
    searchParamsData.dateTo = searchParamsData.endDate;
  }

  const yacht = await getSingleYacth(slug, searchParamsData);

  if (!yacht) {
    return {
      title: 'Yacht Not Found',
    };
  }

  redirectToCanonicalBoat(locale, slug, yacht, requestQuery);

  const getCharterTypeLabel = (charterType: string) => {
    const labelKey = CHARTER_TYPE_LABEL_MAP[charterType as CharterType];

    if (!labelKey) return '';

    const label = t(labelKey);

    return label && label !== labelKey ? label : '';
  };

  const charterTypeLabel = getCharterTypeLabel(yacht.charterType[0]);
  // Yacht name comes from partner systems uppercase ("GIN TONIC", "AF-LAG40AN") —
  // title-case it for SEO display so SERP previews don't shout. Same util the
  // detail page H1 uses (memory: project_yacht_name_title_case).
  const displayName = toTitleCase(yacht.name) || yacht.name?.trim() || '';
  const fullName = [yacht.model, displayName ? `'${displayName}'` : null].filter(Boolean).join(' ').trim();
  const yearSuffix = yacht.buildYear ? ` (${yacht.buildYear})` : '';
  const locationFull = yacht.location?.name ?? '';

  // SERP windows: title ≤ 70 characters with " | Boat4You", description
  // ≤ 160 (buildMetadata trims). The title uses the boat's own name without
  // the partner's equipment notes and the base's town, dropping the brand
  // suffix, then the year, when it would not fit (boatTitle.ts, audit B42).
  const cabins = yacht.cabins ?? null;
  const berths = yacht.berths ?? yacht.maxPersons ?? null;

  // Title tail comes from the metadata.boat catalog so both the charter word
  // AND the word order localize per locale (the old hard-coded map shipped
  // English "Charter" + English word order to de/it/nl — the strongest SERP /
  // Google Ads headline signal read English on every non-EN page):
  //   EN: "Lagoon 39 'Gin Tonic' (2017) — Sukosan Charter"
  //   DE: "Lagoon 39 'Gin Tonic' (2017) — Yachtcharter Sukosan"
  //   HR: "Lagoon 39 'Gin Tonic' (2017) — Najam Sukosan"
  //   FR: "Lagoon 39 'Gin Tonic' (2017) — Location Sukosan"
  //   IT/NL/ES/PT/PL: "Noleggio / Jachtcharter / Alquiler / Aluguer / Czarter Sukosan"
  const town = titlePlace(locationFull);
  const titleTail = town ? tBoat('titleTail', { city: town }) : tBoat('titleTailNoCity');
  const boatTitle = buildBoatTitle({
    model: cleanModelName(yacht.model) || yacht.model || '',
    name: titleBoatName(displayName),
    year: yacht.buildYear,
    tail: titleTail,
  });

  // Description — native in every locale from `metadata.boat.desc*` (only EN
  // and HR were native before; the other seven showed English in the SERP
  // snippet). Keep under ~155 chars even with specs added.
  const description = buildBoatDescription((key, values) => tBoat(key as never, values as never), {
    name: `${fullName}${yearSuffix}`,
    marina: locationFull,
    cabins,
    berths,
  });

  return buildMetadata({
    locale: locale as LocaleType,
    title: boatTitle.title,
    ...(boatTitle.absolute ? { titleAbsolute: boatTitle.title } : {}),
    description,
    path: canonicalBoatPath(yacht),
    image: {
      src: yachtShareImageUrl(yacht) ?? undefined,
      alt: `${yacht.modelName} ${yacht.name || ''} boat image`,
    },
  });
}

const BoatPage = async ({
  params,
  searchParams,
}: {
  params: Promise<{ slug: string; locale: string }>;
  searchParams: Promise<AllSearchParams>;
}) => {
  const user = await getLoggedInUser();
  const { slug, locale } = await params;

  const searchParamsData = await searchParams;
  const requestQuery = { ...(searchParamsData as unknown as Record<string, string | string[] | undefined>) };

  if (searchParamsData.startDate) {
    searchParamsData.dateFrom = searchParamsData.startDate;
  }

  if (searchParamsData.endDate) {
    searchParamsData.dateTo = searchParamsData.endDate;
  }

  const currency = user?.currency || (searchParamsData.currency as Currency) || Currency.EUR;

  const yacht = await getSingleYacth(slug, searchParamsData, currency, locale);

  if (!yacht) {
    return notFound();
  }

  redirectToCanonicalBoat(locale, slug, yacht, requestQuery);

  const [tBoatMeta, manufacturers] = await Promise.all([
    getTranslations({ locale, namespace: 'metadata.boat' }),
    loadManufacturerLookup(),
  ]);
  const productSchema = buildYachtProductSchema(
    yacht,
    locale as LocaleType,
    (key, values) => tBoatMeta(key as never, values as never),
    manufacturers
  );

  // Hubs above this boat (country, region/base, boat type) — linked only
  // when their landing passes the index gate. The visible breadcrumb
  // (BoatHubLinks) and the BreadcrumbList JSON-LD use the same URLs, so the
  // SERP chip and the page point at the indexable landing pages (before
  // 25.9.2026 wave 2 the JSON-LD linked `/search?boatTypes=X` and
  // `?destinations=<city>`, both noindex, and the page body linked neither).
  const hubs = await boatHubs(yacht.location, yacht.vesselType ?? null, locale);
  const boatName = [yacht.model, toTitleCase(yacht.name) || yacht.name]
    .filter(Boolean)
    .join(' ')
    .replace(/\s+/g, ' ')
    .trim();
  const breadcrumbItems: Array<{ name: string; item: string }> = [
    { name: 'Boat4You', item: localizedUrl(locale as LocaleType, '/') },
  ];

  [hubs.country, hubs.area, hubs.typeHub].forEach(hub => {
    if (!hub?.href) return;

    breadcrumbItems.push({
      name: hub === hubs.typeHub && hubs.typeLabel ? hubs.typeLabel : hub.label,
      item: `${meta.url}${hub.href}`,
    });
  });

  breadcrumbItems.push({
    name: boatName,
    item: localizedUrl(locale as LocaleType, canonicalBoatPath(yacht)),
  });

  // Per-yacht FAQ — server-built so the questions/answers are in the SSR
  // HTML (unique indexable content, variant-rotated per yacht id) and the
  // FAQPage JSON-LD below always mirrors the visible accordion.
  const tYacht = await getTranslations({ locale, namespace: 'yacht' });
  const yachtFaq = buildYachtFaq(yacht, (key, values) => tYacht(key as never, values as never), locale);
  const yachtFaqSchema = buildYachtFaqSchema(yachtFaq);

  const breadcrumbSchema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: breadcrumbItems.map((b, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name: b.name,
      item: b.item,
    })),
  };

  return (
    <Layout isBoat>
      {/* Per-yacht Product JSON-LD — qualifies the boat detail page for
          Google's rich-result snippet (image thumbnail + price range +
          brand chip in SERP). Server-rendered so the crawler picks it up
          on the first hit; the root WebSite/Organization/Service schema
          (in [locale]/layout.tsx) coexists alongside this one. */}
      {productSchema && (
        <script
          type="application/ld+json"
          // eslint-disable-next-line react/no-danger
          dangerouslySetInnerHTML={{ __html: serializeJsonLd(productSchema) }}
        />
      )}
      <script
        type="application/ld+json"
        // eslint-disable-next-line react/no-danger
        dangerouslySetInnerHTML={{ __html: serializeJsonLd(breadcrumbSchema) }}
      />
      {yachtFaqSchema && (
        <script
          type="application/ld+json"
          // eslint-disable-next-line react/no-danger
          dangerouslySetInnerHTML={{ __html: serializeJsonLd(yachtFaqSchema) }}
        />
      )}
      <BoatTransitionProvider>
        <BoatHeroSection yacht={yacht} />
        <BoatContentSection yacht={yacht} yachtFaq={yachtFaq} />
        <BoatHubLinks hubs={hubs} boatName={boatName} locale={locale} />
        <ModelPageLink
          manufacturerName={yacht.manufacturerName}
          modelName={yacht.model}
          countryCode={yacht.location?.countryCode}
          locale={locale}
        />
        {/* Post-content upsell order fixed by Mario (21.7.2026): similar
            boats FIRST, day-by-day itineraries for the marina below. */}
        <RelatedBoats yacht={yacht} user={user} locale={locale} currency={currency} />
        {/* SuggestedItineraries has no Container of its own (it was born
            inside BoatContentSection's) — wrap it or it bleeds full-width. */}
        <Container maxWidth="xl">
          <SuggestedItineraries
            marinaName={yacht.location?.name}
            countryCode={yacht.location?.countryCode}
            variant="full"
            routeTitles={await suggestedRouteTitles(yacht.location?.name, yacht.location?.countryCode)}
            areaLabel={await suggestedAreaLabel(locale, yacht.location?.name, yacht.location?.countryCode)}
          />
        </Container>
        <BoatMobileNavigation yacht={yacht} />
      </BoatTransitionProvider>
    </Layout>
  );
};

export default BoatPage;
