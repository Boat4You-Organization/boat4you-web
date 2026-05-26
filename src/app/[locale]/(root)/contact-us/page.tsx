import { Metadata } from 'next';
import { Locale } from 'next-intl';
import { getTranslations } from 'next-intl/server';
import dynamic from 'next/dynamic';

import Layout from '@/components/Layout';
import { whyChooseUs } from '@/config/howWeWork.config';
import { LocaleType } from '@/config/locales.config';
import { buildMetadata } from '@/utils/static/buildMetadata';

const HeroSection = dynamic(() => import('@/components/HeroSection'));
const ContactSection = dynamic(() => import('@/views/ContactUs/ContactSection'));
const InternationalSupportSection = dynamic(() => import('@/views/ContactUs/InternationalSupportSection'));
const WhyChooseUsSection = dynamic(() => import('@/components/WhyChooseUsSection'));
const RiskFreeCtaSection = dynamic(() => import('@/components/RiskFreeCTA'));
const FaqSection = dynamic(() => import('@/views/ContactUs/FaqSection'));

export async function generateMetadata({ params }: { params: Promise<{ locale: Locale }> }): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations('metadata.metadata.contactUs');

  return buildMetadata({
    locale: locale as LocaleType,
    title: t('title'),
    description: t('description'),
    path: t('path'),
  });
}

const ContactUsPage = () => (
  <Layout>
    <HeroSection namespace="contact" image={{ src: '/images/howWeWork/hero.webp', alt: 'Contact us' }} />
    <ContactSection />
    <InternationalSupportSection />
    <WhyChooseUsSection translation="howWeWork" data={whyChooseUs} />
    <RiskFreeCtaSection />
    <FaqSection />
  </Layout>
);

export default ContactUsPage;
