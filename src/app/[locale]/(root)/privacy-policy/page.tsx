import { Metadata } from 'next';
import { Locale } from 'next-intl';
import { getLocale, getTranslations } from 'next-intl/server';
import dynamic from 'next/dynamic';
import { notFound } from 'next/navigation';

import Layout from '@/components/Layout';
import { LocaleType } from '@/config/locales.config';
import { getPage } from '@/lib/page';
import { buildMetadata } from '@/utils/static/buildMetadata';

const PostDisplaySection = dynamic(() => import('@/components/PostDisplay'));

export async function generateMetadata({ params }: { params: Promise<{ locale: Locale }> }): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations('metadata.metadata.privacyPolicy');

  return {
    ...buildMetadata({
      locale: locale as LocaleType,
      title: t('title'),
      description: t('description'),
      path: t('path'),
    }),
    robots: {
      index: false,
      follow: false,
    },
  };
}

const PrivacyPolicyPage = async () => {
  const locale = await getLocale();
  const content = await getPage(locale, 'static', 'privacy-policy');

  if (!content) {
    return notFound();
  }

  return (
    <Layout>
      <PostDisplaySection content={content} />
    </Layout>
  );
};

export default PrivacyPolicyPage;
