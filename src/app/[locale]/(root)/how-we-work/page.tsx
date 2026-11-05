import { Metadata } from 'next';
import { Locale } from 'next-intl';
import { getTranslations } from 'next-intl/server';
import dynamic from 'next/dynamic';

import ExtraClientMessages from '@/components/ExtraClientMessages';
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
  // The FAQ accordion is a client component and reads `howWeWork`, which is not in the site-wide client set.
  <ExtraClientMessages namespaces={['howWeWork']}>
    <Layout>
      <HeroSection namespace="howWeWork" imageSrc="/images/howWeWork/hero.webp" />
      <HowWeWorkSection />
      <WhyChooseUsSection translation="howWeWork" data={whyChooseUs} />
      <ContactUsSection />
      <FaqSection />
    </Layout>
  </ExtraClientMessages>
);

export default HowWeWorkPage;
