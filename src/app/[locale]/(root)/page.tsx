import { Suspense } from 'react';

import dynamic from 'next/dynamic';

import getCountriesCount from '@/actions/locations.actions';
import { getYachtFleet } from '@/actions/yacht.actions';
import Layout from '@/components/Layout';
import LoadingSection from '@/components/LoadingSection';
import { PAGE_SIZE } from '@/config/constants.config';
import whyChooseUs from '@/config/whyChooseUs';
import { getBlogs } from '@/lib/api';
import DestinationsSection from '@/views/Home/DestinationsSection';

const HeroSection = dynamic(() => import('@/views/Home/HeroSection'));
const WhyChooseUsSection = dynamic(() => import('@/components/WhyChooseUsSection'));
const OurFleetSection = dynamic(() => import('@/views/Home/OurFleetSection'));
const RiskFreeCTA = dynamic(() => import('@/components/RiskFreeCTA'));
const AllDestinationsSection = dynamic(() => import('@/views/Home/AllDestinationsSection'));
const BlogSection = dynamic(() => import('@/views/Home/BlogSection'));

export default async function HomePage() {
  const [blogs, countriesCount, fleet] = await Promise.all([getBlogs(PAGE_SIZE), getCountriesCount(), getYachtFleet()]);

  return (
    <Suspense fallback={<LoadingSection />}>
      <Layout>
        <HeroSection />
        <DestinationsSection countries={countriesCount} />
        <WhyChooseUsSection translation="home" data={whyChooseUs} />
        <OurFleetSection fleet={fleet} />
        <RiskFreeCTA />
        <BlogSection posts={blogs.nodes} />
        <AllDestinationsSection countries={countriesCount} />
      </Layout>
    </Suspense>
  );
}
