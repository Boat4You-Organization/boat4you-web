import { Suspense } from 'react';

import { Locale } from 'next-intl';
import { getTranslations } from 'next-intl/server';
import dynamic from 'next/dynamic';

import { getTopManufacturers } from '@/actions/catalogue.actions';
import getCountriesCount, { getHeroStats } from '@/actions/locations.actions';
import { getYachtFleet } from '@/actions/yacht.actions';
import Layout from '@/components/Layout';
import LoadingSection from '@/components/LoadingSection';
import { PAGE_SIZE } from '@/config/constants.config';
import whyChooseUs from '@/config/whyChooseUs';
import { getBlogs } from '@/lib/api';
import DestinationsSection from '@/views/Home/DestinationsSection';
// Hero is the LCP element — static import (not `dynamic()`) so the title +
// search bar land in the initial server-rendered HTML. The legacy
// `dynamic()` wrapper waited for client JS before rendering, costing
// 800-1200ms LCP on slow connections (Google flags any home with LCP > 2.5s).
import HeroSection from '@/views/Home/HeroSection';

// OurFleetSection stays SSR — mid-fold but the vessel-type cards
// (Catamaran / Sailing / Motor / …) carry the home's organic search
// signal. The other six sections (WhyChooseUs / Manufacturers / FAQ
// / RiskFreeCTA / Blog / AllDestinations) moved into HomeBelowFold
// client wrapper with ssr:false so they don't bloat the SSR HTML or
// the initial hydration. Their structured data (FAQ JSON-LD) is still
// emitted server-side below, so SEO is preserved.
const OurFleetSection = dynamic(() => import('@/views/Home/OurFleetSection'));
const HomeBelowFold = dynamic(() => import('@/views/Home/HomeBelowFold.client'));

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
    <Suspense fallback={<LoadingSection />}>
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
        <OurFleetSection fleet={fleet} />
        <HomeBelowFold
          whyChooseUs={whyChooseUs}
          manufacturers={manufacturers}
          blogs={blogs.nodes}
          countriesCount={countriesCount}
        />
      </Layout>
    </Suspense>
  );
}
