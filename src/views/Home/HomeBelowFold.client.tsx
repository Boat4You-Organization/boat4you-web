'use client';

import dynamic from 'next/dynamic';

import type { BlogTeaser } from '@/types/blog.type';

// Mark the "below the fold" sections as client-only (ssr: false) so they
// don't bloat the SSR HTML / inline RSC payload and don't pile onto the
// initial hydration cost. PSI mobile flagged ~8 s of script eval coming
// almost entirely from the React DOM reconciler chunk hydrating the
// home page — hydration scales with rendered DOM size, and these six
// sections together account for the bulk of the home DOM that the
// crawler doesn't actually need in the SSR HTML (the FAQ JSON-LD is
// emitted server-side separately, so structured data SEO is unaffected;
// the visible cards are pure marketing / repeat lists).
//
// Sections that DO stay SSR (in page.tsx): Hero (LCP target),
// DestinationsSection (above the fold, SEO), OurFleetSection (mid fold,
// vessel-type SEO).
const WhyChooseUsSection = dynamic(() => import('@/components/WhyChooseUsSection'), { ssr: false });
const ManufacturersSection = dynamic(() => import('@/views/Home/ManufacturersSection'), { ssr: false });
const FAQSection = dynamic(() => import('@/views/Home/FAQSection'), { ssr: false });
const RiskFreeCTA = dynamic(() => import('@/components/RiskFreeCTA'), { ssr: false });
const BlogSection = dynamic(() => import('@/views/Home/BlogSection'), { ssr: false });
const AllDestinationsSection = dynamic(() => import('@/views/Home/AllDestinationsSection'), { ssr: false });

interface HomeBelowFoldProps {
  // Each prop is forwarded verbatim to the matching dynamic section.
  // We intentionally don't re-type them here — the page.tsx caller pulls
  // them from the action return types, and the section components have
  // their own prop interfaces. Adding a narrow type here would just
  // duplicate (and need to be kept in sync with) those.
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  whyChooseUs: any;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  manufacturers: any;
  blogs: BlogTeaser[];
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  countriesCount: any;
}

const HomeBelowFold = ({ whyChooseUs, manufacturers, blogs, countriesCount }: HomeBelowFoldProps) => (
  <>
    <WhyChooseUsSection translation="home" data={whyChooseUs} />
    <ManufacturersSection manufacturers={manufacturers} />
    <FAQSection />
    <RiskFreeCTA />
    <BlogSection posts={blogs} />
    <AllDestinationsSection countries={countriesCount} />
  </>
);

export default HomeBelowFold;
