import { Metadata } from 'next';
import { Locale } from 'next-intl';
import { getTranslations } from 'next-intl/server';
import dynamic from 'next/dynamic';

import Layout from '@/components/Layout';
import { whyChooseUs } from '@/config/howWeWork.config';
import { LocaleType } from '@/config/locales.config';
import { buildMetadata } from '@/utils/static/buildMetadata';

const HeroSection = dynamic(() => import('@/components/HeroSection'));
const HowWeWorkSection = dynamic(() => import('@/views/HowWeWork/HowWeWorkSection'));
const WhyChooseUsSection = dynamic(() => import('@/components/WhyChooseUsSection'));
const ContactUsSection = dynamic(() => import('@/views/HowWeWork/ContactUsSection'));
const FaqSection = dynamic(() => import('@/views/HowWeWork/FaqSection'));

export async function generateMetadata({ params }: { params: Promise<{ locale: Locale }> }): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations('metadata.metadata.howWeWork');

  return buildMetadata({
    locale: locale as LocaleType,
    title: t('title'),
    description: t('description'),
    path: t('path'),
  });
}

const HowWeWorkPage = () => (
  <Layout>
    <HeroSection namespace="howWeWork" image={{ src: '/images/howWeWork/hero.webp', alt: 'How we work' }} />
    <HowWeWorkSection />
    <WhyChooseUsSection translation="howWeWork" data={whyChooseUs} />
    <ContactUsSection />
    <FaqSection />
  </Layout>
);

export default HowWeWorkPage;
