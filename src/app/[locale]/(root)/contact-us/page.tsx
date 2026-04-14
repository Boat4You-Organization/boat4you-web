import { Metadata } from 'next';
import { getTranslations } from 'next-intl/server';
import dynamic from 'next/dynamic';

import Layout from '@/components/Layout';
import { whyChooseUs } from '@/config/howWeWork.config';
import { buildMetadata } from '@/utils/static/buildMetadata';

const HeroSection = dynamic(() => import('@/components/HeroSection'));
const ContactSection = dynamic(() => import('@/views/ContactUs/ContactSection'));
const InternationalSupportSection = dynamic(() => import('@/views/ContactUs/InternationalSupportSection'));
const WhyChooseUsSection = dynamic(() => import('@/components/WhyChooseUsSection'));
const RiskFreeCtaSection = dynamic(() => import('@/components/RiskFreeCTA'));
const FaqSection = dynamic(() => import('@/views/ContactUs/FaqSection'));

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations('metadata.metadata.contactUs');

  return buildMetadata({
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
