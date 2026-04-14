import { Metadata } from 'next';
import { getLocale, getTranslations } from 'next-intl/server';
import dynamic from 'next/dynamic';

import { getLoggedInUser } from '@/actions/auth.actions';
import Layout from '@/components/Layout';
import { getFAQPage } from '@/lib/page';
import { buildMetadata } from '@/utils/static/buildMetadata';

const QuestionsSection = dynamic(() => import('@/views/Faq/QuestionsSection'));
const ContactUsSection = dynamic(() => import('@/views/Faq/ContactUsSection'));

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations('metadata.metadata.faq');

  return buildMetadata({
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
