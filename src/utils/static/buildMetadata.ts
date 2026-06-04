import { Metadata } from 'next';
import { getTranslations } from 'next-intl/server';

import { LocaleType } from '@/config/locales.config';
import { meta } from '@/config/meta';
import { TRIPADVISOR_RATING, TRIPADVISOR_REVIEW_COUNT } from '@/config/tripadvisor';
import { routing } from '@/i18n/routing';

type MetadataOptions = {
  /**
   * Active locale for the rendered page. Drives the canonical + openGraph
   * URLs so non-default locales get a locale-prefixed canonical
   * (`/hr/about-us` instead of `/about-us`) and don't get folded into the
   * English entry by Google's deduplication.
   */
  locale: LocaleType;
  title: string;
  description: string;
  path: string;
  image?: {
    src?: string;
    alt?: string;
  };
  titleAbsolute?: string;
  /**
   * Per-page robots overrides. Pass `{ noindex: true }` to flag deeply
   * filtered URLs (pagination > 1, date-anchored search) so Google doesn't
   * spend crawl budget on them. We always default to follow:true so link
   * equity still flows. Defaults also enable rich-result helpers
   * (`max-image-preview: large`, `max-snippet: -1`) that let the SERP show
   * full Product image + unrestricted description text.
   */
  robots?: { noindex?: boolean };
};

/**
 * Compose the public URL for a (locale, path) pair. Mirrors the segment
 * layout next-intl ships with `localePrefix: 'as-needed'` — default locale
 * is served at the root, the rest under `/{locale}/...`. Empty / "/" path
 * collapses to no trailing segment so the home URL stays slash-free
 * (`https://.../hr` not `https://.../hr/`).
 */
export const localizedUrl = (locale: LocaleType, path: string): string => {
  const normalized = !path || path === '/' ? '' : path;
  const prefix = locale === routing.defaultLocale ? '' : `/${locale}`;

  return `${meta.url}${prefix}${normalized}`;
};

export const buildAlternateLanguages = (path: string) =>
  Object.fromEntries([
    ...routing.locales.map(locale => [
      locale,
      locale === routing.defaultLocale ? `${meta.url}${path}` : `${meta.url}/${locale}${path}`,
    ]),
    ['x-default', `${meta.url}${path}`],
  ]);

export const buildMetadata = ({
  locale,
  title,
  description,
  path,
  image,
  titleAbsolute,
  robots,
}: MetadataOptions): Metadata => {
  const fullUrl = localizedUrl(locale, path);
  const ogImage = image?.src || `${meta.url}/meta/og-image.png`;

  return {
    title: titleAbsolute ? { absolute: titleAbsolute } : title,
    description,
    alternates: {
      canonical: fullUrl,
      languages: buildAlternateLanguages(path),
    },
    robots: {
      // index defaults to true; noindex flag flips it for deep-filter URLs
      // (e.g. paginated search beyond page 1). follow stays true so the
      // link equity from those pages still flows out to the canonical.
      index: !robots?.noindex,
      follow: true,
      // Rich-result enablers — Google won't show the Product carousel /
      // large image preview unless these are explicitly granted. Safe to
      // set globally; they only take effect on pages that have qualifying
      // content (Product schema, large hero images).
      'max-image-preview': 'large',
      'max-snippet': -1,
      'max-video-preview': -1,
    },
    openGraph: {
      type: 'website',
      url: fullUrl,
      title,
      description,
      images: [
        {
          url: ogImage,
          alt: image?.alt || title,
          width: 1200,
          height: 630,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [ogImage],
    },
  };
};

const localeToLanguageTag: Record<string, string> = {
  en: 'en-US',
  de: 'de-DE',
  fr: 'fr-FR',
  es: 'es-ES',
  hr: 'hr-HR',
  it: 'it-IT',
  pt: 'pt-PT',
  pl: 'pl-PL',
  nl: 'nl-NL',
};

export const getLocalizedJsonLd = async (locale: LocaleType) => {
  const t = await getTranslations({ locale, namespace: 'metadata' });

  return {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'WebSite',
        '@id': `${meta.url}/#website`,
        name: t(meta.title),
        url: meta.url,
        description: t(meta.description),
        image: `${meta.url}/meta/og-image.png`,
        inLanguage: localeToLanguageTag[locale] || 'en-US',
        // Sitelinks Searchbox eligibility — when a user searches the brand
        // ("Boat4You") on Google, this lets the SERP render a small search
        // input directly under the result that lands on our /search page.
        // Target uses the same `?destinations=` param the dropdown writes,
        // so a typed query becomes a normal landing on the search results.
        // See https://developers.google.com/search/docs/appearance/structured-data/sitelinks-searchbox
        potentialAction: {
          '@type': 'SearchAction',
          target: {
            '@type': 'EntryPoint',
            urlTemplate: `${meta.url}/search?destinations={search_term_string}`,
          },
          // Note: per Schema.org / Google docs this property name uses a
          // dash and gets dropped by JSON.stringify if defined as `'query-input'`
          // accessor on a regular object — but JS object literals accept any
          // string as a key, so quoting it works the same.
          'query-input': 'required name=search_term_string',
        },
      },
      {
        '@type': 'Organization',
        '@id': `${meta.url}/#organization`,
        name: meta.name,
        url: meta.url,
        logo: `${meta.url}/meta/logo.svg`,
        email: 'info@boat4you.com',
        description: t(meta.description),
        address: {
          '@type': 'PostalAddress',
          streetAddress: 'Vrboran 37',
          addressLocality: 'Split',
          postalCode: '21000',
          addressCountry: 'Croatia',
        },
        telephone: '+385 98 360 398',
        // Structured customer-support entry — Google can surface this in
        // the Knowledge Panel ("Customer service: ...") when the brand's
        // entity has enough authority. The `availableLanguage` array
        // mirrors our locale list; `contactType: customer support` is the
        // canonical Schema.org value Google reads.
        contactPoint: {
          '@type': 'ContactPoint',
          telephone: '+385 98 360 398',
          email: 'info@boat4you.com',
          contactType: 'customer support',
          availableLanguage: ['en', 'hr', 'de', 'fr', 'it', 'es', 'pt', 'nl', 'pl'],
        },
        // sameAs links the Organization entity to its social profiles —
        // Google uses this signal to (a) cluster brand mentions across the
        // web into a single Knowledge Graph entity, (b) surface the social
        // icons in the Knowledge Panel, and (c) reinforce brand authority.
        // Drop / re-add a profile here whenever a new platform launches.
        sameAs: [
          'https://www.facebook.com/boat4youcom',
          'https://www.instagram.com/boat4you_/',
          'https://x.com/Boat4you_com',
          'https://www.youtube.com/@Boat4you_com',
        ],
        // Review signal for AI / LLM answer engines (and the Knowledge Graph):
        // the group's TripAdvisor rating (Europe Yachts Charter — the operating
        // brand, same profile linked in the footer + hero). Self-serving on an
        // Organization, so Google won't render review stars from it, but it
        // reinforces entity authority and is read by AI search (matches the AEO
        // sister-site setup). Keep in sync with TripAdvisorRating component.
        aggregateRating: {
          '@type': 'AggregateRating',
          ratingValue: TRIPADVISOR_RATING,
          reviewCount: TRIPADVISOR_REVIEW_COUNT,
          bestRating: '5',
          worstRating: '1',
        },
      },
      {
        '@type': ['Service', 'TravelAgency'],
        '@id': `${meta.url}/#service`,
        name: meta.name,
        description: t(meta.description),
        serviceType: 'Yacht Booking Platform',
        provider: {
          '@id': `${meta.url}/#organization`,
        },
        areaServed: [
          {
            '@type': 'Country',
            name: 'Croatia',
          },
          {
            '@type': 'Country',
            name: 'Greece',
          },
          {
            '@type': 'Country',
            name: 'France',
          },
          {
            '@type': 'Country',
            name: 'Italy',
          },
          {
            '@type': 'Country',
            name: 'Spain',
          },
          {
            '@type': 'Country',
            name: 'Bahamas',
          },
        ],
      },
    ],
  };
};
