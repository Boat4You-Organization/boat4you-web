import { Locale } from 'next-intl';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import dynamic from 'next/dynamic';

import { getTopManufacturers } from '@/actions/catalogue.actions';
import getCountriesCount, { getHeroStats } from '@/actions/locations.actions';
import { getYachtFleet } from '@/actions/yacht.actions';
import Layout from '@/components/Layout';
import { PAGE_SIZE } from '@/config/constants.config';
import whyChooseUs from '@/config/whyChooseUs';
import { routing } from '@/i18n/routing';
import { getBlogs } from '@/lib/api';
import DestinationsSection from '@/views/Home/DestinationsSection';
// Server components (plain HTML, no client JS) — static-imported so they
// render to HTML and never hydrate on the client. Pulling these out of
// `dynamic()` is what removes their main-thread cost on mobile.
import FAQSection from '@/views/Home/FAQSection';
// Hero is the LCP element — static import (not `dynamic()`) so the title +
// search bar land in the initial server-rendered HTML. The legacy
// `dynamic()` wrapper waited for client JS before rendering, costing
// 800-1200ms LCP on slow connections (Google flags any home with LCP > 2.5s).
import HeroSection from '@/views/Home/HeroSection';

// ISR — every 60s the next request rebuilds the home in the background and
// stale visitors get the previous build until then. Combined with the root
// layout dropping cookies() this turns PSI cold runs (previously 860ms
// TTFB) into ~CDN-fast hits.
export const revalidate = 60;

export function generateStaticParams() {
  return routing.locales.map(locale => ({ locale }));
}

const WhyChooseUsSection = dynamic(() => import('@/components/WhyChooseUsSection'));
const OurFleetSection = dynamic(() => import('@/views/Home/OurFleetSection'));
const ManufacturersSection = dynamic(() => import('@/views/Home/ManufacturersSection'));
const RiskFreeCTA = dynamic(() => import('@/components/RiskFreeCTA'));
const AllDestinationsSection = dynamic(() => import('@/views/Home/AllDestinationsSection'));
const BlogSection = dynamic(() => import('@/views/Home/BlogSection'));

/**
 * Build the FAQPage JSON-LD from the same translation source the client
 * FAQSection renders. Google validates that the schema's questions and
 * the visible page text match verbatim, so we read the array once on the
 * server and inject it as schema; the client component reads the
 * identical key. Per-locale, server-rendered.
 */
async function buildFaqSchema(locale: Locale) {
  try {
    const t = await getTranslations({ locale, namespace: 'home.faqSection' });
    const questions = (t.raw('questions') as Array<{ q: string; a: string }> | undefined) || [];

    if (!questions.length) return null;

    return {
      '@context': 'https://schema.org',
      '@type': 'FAQPage',
      mainEntity: questions.map(qa => ({
        '@type': 'Question',
        name: qa.q,
        acceptedAnswer: {
          '@type': 'Answer',
          text: qa.a,
        },
      })),
    };
  } catch {
    return null;
  }
}

export default async function HomePage({ params }: { params: Promise<{ locale: Locale }> }) {
  const { locale } = await params;

  setRequestLocale(locale);

  // Hero trust stats + top manufacturers + FAQ schema run alongside the
  // existing fetches so the rendered HTML is complete on the first paint.
  // Each helper fails soft (empty/zero/null) — a slow upstream never
  // blocks the rest of the page.
  const [blogs, countriesCount, fleet, heroStats, manufacturers, faqSchema] = await Promise.all([
    getBlogs(PAGE_SIZE),
    getCountriesCount(),
    getYachtFleet(),
    getHeroStats(),
    getTopManufacturers(24),
    buildFaqSchema(locale),
  ]);

  return (
    <Layout>
      {faqSchema && (
        <script
          type="application/ld+json"
          // eslint-disable-next-line react/no-danger
          dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
        />
      )}
      <HeroSection stats={heroStats} />
      <DestinationsSection countries={countriesCount} />
      <WhyChooseUsSection translation="home" data={whyChooseUs} />
      <OurFleetSection fleet={fleet} />
      <ManufacturersSection manufacturers={manufacturers} />
      <FAQSection />
      <RiskFreeCTA />
      <BlogSection posts={blogs.nodes} />
      <AllDestinationsSection countries={countriesCount} />
    </Layout>
  );
}
