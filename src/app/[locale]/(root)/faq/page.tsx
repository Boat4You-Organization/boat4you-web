import { Metadata } from 'next';
import { Locale } from 'next-intl';
import { getLocale, getTranslations } from 'next-intl/server';
import dynamic from 'next/dynamic';

import { getLoggedInUser } from '@/actions/auth.actions';
import Layout from '@/components/Layout';
import { LocaleType } from '@/config/locales.config';
import { getFAQPage } from '@/lib/page';
import { buildMetadata } from '@/utils/static/buildMetadata';

const QuestionsSection = dynamic(() => import('@/views/Faq/QuestionsSection'));
const ContactUsSection = dynamic(() => import('@/views/Faq/ContactUsSection'));

export async function generateMetadata({ params }: { params: Promise<{ locale: Locale }> }): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations('metadata.metadata.faq');

  return buildMetadata({
    locale: locale as LocaleType,
    title: t('title'),
    description: t('description'),
    path: t('path'),
  });
}

const FaqPage = async () => {
  const locale = await getLocale();
  const user = await getLoggedInUser();
  const faqGroups = await getFAQPage(locale, 'static', 'faq');

  return (
    <Layout>
      <QuestionsSection user={user} faqGroups={faqGroups} />
      <ContactUsSection />
    </Layout>
  );
};

export default FaqPage;
