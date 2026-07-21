/* eslint-disable no-nested-ternary */
import { Container } from '@mui/material';
import { Metadata } from 'next';
import { Locale } from 'next-intl';
import { getTranslations } from 'next-intl/server';
import { notFound } from 'next/navigation';

import { getLoggedInUser } from '@/actions/auth.actions';
import { getSingleYacth } from '@/actions/yacht.actions';
import Layout from '@/components/Layout';
import SuggestedItineraries from '@/components/SuggestedItineraries';
import { AllSearchParams } from '@/config/form-models.config';
import { LocaleType } from '@/config/locales.config';
import { meta } from '@/config/meta';
import { Currency } from '@/models/user.model';
import { CHARTER_TYPE_LABEL_MAP, CharterType, YachtModel } from '@/models/yacht.model';
import { buildMetadata, localizedUrl } from '@/utils/static/buildMetadata';
import { toTitleCase } from '@/utils/static/toTitleCase';
import BoatContentSection from '@/views/Boat/BoatContentSection';
import BoatHeroSection from '@/views/Boat/BoatHeroSection';
import BoatMobileNavigation from '@/views/Boat/BoatMobileNavigation';
import { BoatTransitionProvider } from '@/views/Boat/BoatTransitionProvider';
import RelatedBoats from '@/views/Boat/RelatedBoats';

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
 *   - `brand` — manufacturer name (Lagoon, Bavaria, Beneteau …)
 *   - `category` — vessel type (Catamaran, Sailing yacht …)
 *   - `additionalProperty` — yacht specs (year, cabins, berths, max persons,
 *     length) so Google's product knowledge graph can match facets
 *   - `offers` — `AggregateOffer` with min/max charter price across the loaded
 *     date range; populated only when at least one offer carries a price >0
 *
 * `aggregateRating` is intentionally OMITTED — Google flags fake/empty review
 * markup as spam and removes the rich result entirely. Re-add only when a
 * real review platform (Trustpilot / Google Reviews / internal) is wired up.
 */
function buildYachtProductSchema(yacht: YachtModel, locale: LocaleType) {
  const url = localizedUrl(locale, `/boat/${yacht.slug}`);
  // Image fallback: yachts synced from a partner without a media payload
  // (~5-10% of catalogue at any given time) leave `yachtImages` empty. We
  // fall back to the site-wide OG image so Google still has *something*
  // to render in rich results — better than a missing image and a Schema
  // validator warning. The fallback URL is the same one Layout uses for
  // og:image when the page omits a custom one.
  const mainImage =
    yacht.yachtImages.find(i => i.mainImage)?.url || yacht.yachtImages[0]?.url || `${meta.url}/meta/og-image.png`;

  // Brand fallback: partner sync occasionally lands `manufacturerName` as
  // null even when the model name carries the brand (e.g. model="Lagoon 42"
  // with manufacturer null). Extract the first whitespace-separated token
  // from `model` as the brand — works for the dominant catalogue patterns
  // (Lagoon 42, Bavaria 51, Beneteau Oceanis 45, Bali 4.6 …). Only use the
  // fallback when the token is alphabetic — purely numeric models like
  // "60 Sunreef" would otherwise return "60" which is meaningless.
  const brandName = (() => {
    if (yacht.manufacturerName) return yacht.manufacturerName;

    const firstToken = (yacht.model || '').trim().split(/\s+/)[0];

    return /^[A-Za-zÀ-ž][A-Za-zÀ-ž'’.-]*$/.test(firstToken) ? firstToken : null;
  })();

  // Pull every offer with a real EUR price; drop zero/null entries (sync
  // partners occasionally emit them as placeholders for future weeks).
  const offerPrices = (yacht.offers || [])
    .map(o => o.clientPriceEur)
    .filter((p): p is number => typeof p === 'number' && p > 0);

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
  const productName = [yacht.model, yacht.name].filter(Boolean).join(' ').trim();
  const descSpecs: string[] = [];

  if (yacht.cabins) descSpecs.push(`${yacht.cabins} cabin${yacht.cabins === 1 ? '' : 's'}`);

  if (yacht.berths) descSpecs.push(`${yacht.berths} berth${yacht.berths === 1 ? '' : 's'}`);

  const descMarina = yacht.location?.name ? ` from ${yacht.location.name}` : '';
  const fallbackDescription =
    `Charter the ${productName}${yacht.buildYear ? ` (${yacht.buildYear})` : ''}${descMarina}.` +
    `${descSpecs.length ? ` ${descSpecs.join(', ')}.` : ''} Check availability and book directly on boat4you.com.`;
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
            availability: 'https://schema.org/InStock',
            url,
            shippingDetails: offerShippingDetails,
            hasMerchantReturnPolicy: merchantReturnPolicy,
          },
        }
      : {}),
  };

  return schema;
}

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
  const displayName = toTitleCase(yacht.name) || yacht.name || '';
  const fullName = [yacht.model, displayName ? `'${displayName}'` : null].filter(Boolean).join(' ').trim();
  const yearSuffix = yacht.buildYear ? ` (${yacht.buildYear})` : '';
  const cityOnly = yacht.location?.name?.split(',')[0]?.trim() ?? '';
  const locationFull = yacht.location?.name ?? '';

  // Locale-aware meta builder. EN + HR get fully native phrasing (Mario's
  // primary markets); the other 7 locales fall back to EN charter-vocab so
  // we don't ship hybrid HR/EN strings to a German reader (regression Mario
  // flagged on /hr/boat where description leaked "charter in" mid-sentence).
  // SERP windows: title ~60 chars, description ~155 chars. Keep within both
  // even when year+specs add ~12 chars to the body.
  const cabins = yacht.cabins ?? null;
  const berths = yacht.berths ?? yacht.maxPersons ?? null;

  const pluralizeHR = (n: number, sg: string, pl2to4: string, pl5plus: string): string => {
    const last2 = n % 100;
    const last1 = n % 10;

    if (last2 >= 11 && last2 <= 14) return `${n} ${pl5plus}`;

    if (last1 === 1) return `${n} ${sg}`;

    if (last1 >= 2 && last1 <= 4) return `${n} ${pl2to4}`;

    return `${n} ${pl5plus}`;
  };

  type MetaLocale = 'en' | 'hr' | 'de' | 'fr' | 'es' | 'it' | 'pt' | 'pl' | 'nl';

  const lc = (locale as MetaLocale) || 'en';
  const titleSuffixCharter: Record<MetaLocale, string> = {
    en: 'Charter',
    hr: 'Najam',
    de: 'Charter',
    fr: 'Location',
    es: 'Alquiler',
    it: 'Charter',
    pt: 'Aluguer',
    pl: 'Czarter',
    nl: 'Charter',
  };
  const charterWord = titleSuffixCharter[lc] ?? 'Charter';

  // Title pattern by locale:
  //   EN/DE/IT/NL: "Lagoon 39 'Gin Tonic' (2017) — Sukosan Charter"
  //   HR:          "Lagoon 39 'Gin Tonic' (2017) — Najam Sukosan"
  //   FR:          "Lagoon 39 'Gin Tonic' (2017) — Location Sukosan"
  //   ES/PT:       "Lagoon 39 'Gin Tonic' (2017) — Alquiler Sukosan" / "Aluguer …"
  //   PL:          "Lagoon 39 'Gin Tonic' (2017) — Czarter Sukosan"
  const verbBeforeCity = lc === 'hr' || lc === 'fr' || lc === 'es' || lc === 'pt' || lc === 'pl';
  const titleTail = cityOnly
    ? verbBeforeCity
      ? `${charterWord} ${cityOnly}`
      : `${cityOnly} ${charterWord}`
    : charterWord;
  const title = [`${fullName}${yearSuffix}`, titleTail].filter(Boolean).join(' — ');

  // Description — fully localised for EN+HR, EN-fallback for others. Keep
  // under ~155 chars even when specs added.
  const buildDescriptionEN = (): string => {
    const specs: string[] = [];

    if (cabins != null) specs.push(`${cabins} cabin${cabins === 1 ? '' : 's'}`);

    if (berths != null) specs.push(`${berths} berth${berths === 1 ? '' : 's'}`);

    const specsStr = specs.length ? ` ${specs.join(', ')}.` : '';
    const fromMarina = locationFull ? ` from ${locationFull}` : '';

    return `Charter the ${fullName}${yearSuffix}${fromMarina}.${specsStr} Check availability and book directly on boat4you.com.`;
  };
  const buildDescriptionHR = (): string => {
    const specs: string[] = [];

    if (cabins != null) specs.push(pluralizeHR(cabins, 'kabina', 'kabine', 'kabina'));

    if (berths != null) specs.push(pluralizeHR(berths, 'osoba', 'osobe', 'osoba'));

    const specsStr = specs.length ? ` ${specs.join(', ')}.` : '';
    const fromMarina = locationFull ? ` iz marine ${locationFull}` : '';

    return `Najam ${fullName}${yearSuffix}${fromMarina}.${specsStr} Provjerite raspoloživost i rezervirajte direktno na boat4you.com.`;
  };
  const description = lc === 'hr' ? buildDescriptionHR() : buildDescriptionEN();

  return buildMetadata({
    locale: locale as LocaleType,
    title,
    description,
    path: `/boat/${yacht.slug}`,
    image: {
      src: yacht.yachtImages.find(el => el.mainImage)?.url,
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

  const productSchema = buildYachtProductSchema(yacht, locale as LocaleType);

  // BreadcrumbList — surfaces a navigation chip in the SERP
  // ("Home › Catamaran › Marina Kastela › Lagoon 42 …") and helps
  // Google understand the page's place in the site hierarchy. Items
  // are server-rendered so the crawler reads them on first hit. URLs
  // pick up the active locale prefix so the breadcrumb chip in the SERP
  // points at the same language the user landed on.
  const cityName = yacht.location?.name?.split(',')[0]?.trim() || '';
  const breadcrumbItems: Array<{ name: string; item: string }> = [
    { name: 'Boat4You', item: localizedUrl(locale as LocaleType, '/') },
  ];

  if (yacht.vesselType) {
    breadcrumbItems.push({
      name: yacht.vesselType
        .replace(/_/g, ' ')
        .toLowerCase()
        .replace(/\b\w/g, c => c.toUpperCase()),
      item: localizedUrl(locale as LocaleType, `/search?boatTypes=${yacht.vesselType}`),
    });
  }

  if (cityName) {
    breadcrumbItems.push({
      name: cityName,
      item: localizedUrl(locale as LocaleType, `/search?destinations=${encodeURIComponent(cityName)}`),
    });
  }

  breadcrumbItems.push({
    name: [yacht.model, yacht.name].filter(Boolean).join(' ').trim(),
    item: localizedUrl(locale as LocaleType, `/boat/${yacht.slug}`),
  });

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
          dangerouslySetInnerHTML={{ __html: JSON.stringify(productSchema) }}
        />
      )}
      <script
        type="application/ld+json"
        // eslint-disable-next-line react/no-danger
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />
      <BoatTransitionProvider>
        <BoatHeroSection yacht={yacht} />
        <BoatContentSection yacht={yacht} />
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
          />
        </Container>
        <BoatMobileNavigation yacht={yacht} />
      </BoatTransitionProvider>
    </Layout>
  );
};

export default BoatPage;
