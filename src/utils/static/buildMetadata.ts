import { Metadata } from 'next';
import { getTranslations } from 'next-intl/server';

import { LocaleType } from '@/config/locales.config';
import { meta } from '@/config/meta';
import { routing } from '@/i18n/routing';

type MetadataOptions = {
  title: string;
  description: string;
  path: string;
  image?: {
    src?: string;
    alt?: string;
  };
  titleAbsolute?: string;
};

export const buildAlternateLanguages = (path: string) =>
  Object.fromEntries([
    ...routing.locales.map(locale => [
      locale,
      locale === routing.defaultLocale ? `${meta.url}${path}` : `${meta.url}/${locale}${path}`,
    ]),
    ['x-default', `${meta.url}${path}`],
  ]);

export const buildMetadata = ({ title, description, path, image, titleAbsolute }: MetadataOptions): Metadata => {
  const fullUrl = `${meta.url}${path}`;
  const ogImage = image?.src || `${meta.url}/meta/og-image.png`;

  return {
    title: titleAbsolute ? { absolute: titleAbsolute } : title,
    description,
    alternates: {
      canonical: fullUrl,
      languages: buildAlternateLanguages(path),
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
      },
      {
        '@type': 'Organization',
        '@id': `${meta.url}/#organization`,
        name: meta.name,
        url: meta.url,
        logo: `${meta.url}/meta/logo.svg`,
        email: 'help@boat4you.com',
        description: t(meta.description),
        address: {
          '@type': 'PostalAddress',
          streetAddress: 'Vrboran 37',
          addressLocality: 'Split',
          postalCode: '21000',
          addressCountry: 'Croatia',
        },
        telephone: '+385 98 360 398',
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
