import { Metadata } from 'next';
import { getTranslations } from 'next-intl/server';
import dynamic from 'next/dynamic';

import { getYachtFleet } from '@/actions/yacht.actions';
import Layout from '@/components/Layout';
import { buildMetadata } from '@/utils/static/buildMetadata';

const HeroSection = dynamic(() => import('@/components/HeroSection'));
const StatsSection = dynamic(() => import('@/views/AboutUs/StatsSection'));
const WhoWeAreSection = dynamic(() => import('@/views/AboutUs/WhoWeAreSection'));
const WhyChooseUsSection = dynamic(() => import('@/views/AboutUs/WhyChooseUsSection'));
const OurPromiseSection = dynamic(() => import('@/views/AboutUs/OurPromiseSection'));
const OurFleetSection = dynamic(() => import('@/views/AboutUs/OurFleetSection'));

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations('metadata.metadata.aboutUs');

  return buildMetadata({
    title: t('title'),
    description: t('description'),
    path: t('path'),
  });
}

const AboutUsPage = async () => {
  const fleet = await getYachtFleet();

  return (
    <Layout>
      <HeroSection namespace="about" image={{ src: '/images/howWeWork/hero.webp', alt: 'How we work' }} />
      <StatsSection />
      <WhoWeAreSection />
      <WhyChooseUsSection />
      <OurPromiseSection />
      <OurFleetSection fleet={fleet} />
    </Layout>
  );
};

export default AboutUsPage;
