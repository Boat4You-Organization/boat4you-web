/* eslint-disable react/no-danger */
import { Metadata } from 'next';
import { Locale, hasLocale } from 'next-intl';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import { notFound } from 'next/navigation';

import Layout from '@/components/Layout';
import { GULET_CHARTER_PATH } from '@/config/guletCharter.config';
import { LocaleType } from '@/config/locales.config';
import { meta } from '@/config/meta';
import { routing } from '@/i18n/routing';
import { loadGuletCountries } from '@/utils/server/guletCharter';
import { buildMetadata, localizedUrl } from '@/utils/static/buildMetadata';
import { serializeJsonLd } from '@/utils/static/jsonLd';
import GuletCharterView from '@/views/GuletCharter/GuletCharterView';
import { buildGuletText } from '@/views/GuletCharter/guletText';
import { Crumb } from '@/views/Models/ModelsBreadcrumb';
import { modelsFaqSchema } from '@/views/Models/ModelsFaq';

/**
 * /gulet-charter: the general gulet page (Gap Finder 20.11.2026, B#2) above
 * the country gulet landings. ISR on the landings' window: the counts, the
 * gulets shown and the facts move with the partner syncs and the nightly run.
 */
export const revalidate = 3600;

interface GuletCharterPageProps {
  params: Promise<{ locale: Locale }>;
}

const loadPage = async (locale: string) => {
  const countries = await loadGuletCountries(locale);
  const text = await buildGuletText(countries, locale);

  return { countries, text };
};

export async function generateMetadata({ params }: GuletCharterPageProps): Promise<Metadata> {
  const { locale } = await params;

  if (!hasLocale(routing.locales, locale)) notFound();

  setRequestLocale(locale);

  const { text } = await loadPage(locale);

  // No titleAbsolute: the root layout's "%s | Boat4You" template applies.
  return buildMetadata({
    locale: locale as LocaleType,
    title: text.title,
    description: text.description,
    path: GULET_CHARTER_PATH,
  });
}

const GuletCharterPage = async ({ params }: GuletCharterPageProps) => {
  const { locale } = await params;

  if (!hasLocale(routing.locales, locale)) notFound();

  setRequestLocale(locale);

  const [{ countries, text }, t, tCommon] = await Promise.all([
    loadPage(locale),
    getTranslations({ locale, namespace: 'guletCharter' }),
    getTranslations({ locale, namespace: 'common' }),
  ]);

  const url = localizedUrl(locale as LocaleType, GULET_CHARTER_PATH);
  const breadcrumb: Crumb[] = [{ name: tCommon('home'), href: '/' }, { name: t('crumb') }];
  const breadcrumbLd = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: breadcrumb.map((crumb, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name: crumb.name,
      item: localizedUrl(locale as LocaleType, crumb.href ?? GULET_CHARTER_PATH),
    })),
  };
  const webPageLd = {
    '@context': 'https://schema.org',
    '@type': 'WebPage',
    '@id': `${url}#webpage`,
    url,
    name: text.h1,
    description: text.description,
    inLanguage: locale,
    isPartOf: { '@id': `${meta.url}/#website` },
    publisher: { '@id': `${meta.url}/#organization` },
  };
  const faqLd = modelsFaqSchema(text.faq);

  return (
    <Layout>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: serializeJsonLd(breadcrumbLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: serializeJsonLd(webPageLd) }} />
      {faqLd && <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: serializeJsonLd(faqLd) }} />}
      <GuletCharterView locale={locale} countries={countries} text={text} breadcrumb={breadcrumb} />
    </Layout>
  );
};

export default GuletCharterPage;
