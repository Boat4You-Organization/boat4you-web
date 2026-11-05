import { Metadata } from 'next';
import { Locale } from 'next-intl';
import dynamic from 'next/dynamic';
import { notFound } from 'next/navigation';

import Layout from '@/components/Layout';
import { LocaleType } from '@/config/locales.config';
import { getPage } from '@/lib/page';
import { buildMetadata } from '@/utils/static/buildMetadata';

const PostDisplaySection = dynamic(() => import('@/components/PostDisplay'));

// Privacy notice for journalists (PR module, 5.11.2026): linked from the footer of every press@boat4you.com pitch
// (backend PR_PRIVACY_URL). English only, whatever the locale, like the pitches themselves.
export async function generateMetadata({ params }: { params: Promise<{ locale: Locale }> }): Promise<Metadata> {
  const { locale } = await params;

  return {
    ...buildMetadata({
      locale: locale as LocaleType,
      title: 'Privacy notice for journalists',
      description:
        'How Boat4you Group handles the contact details of journalists it sends research and story ideas to.',
      path: '/press/privacy',
      alternateLocales: [],
    }),
    robots: {
      index: false,
      follow: false,
    },
  };
}

const PressPrivacyPage = async () => {
  const content = await getPage('en', 'static', 'press-privacy');

  if (!content) {
    return notFound();
  }

  return (
    <Layout>
      <PostDisplaySection content={content} />
    </Layout>
  );
};

export default PressPrivacyPage;
