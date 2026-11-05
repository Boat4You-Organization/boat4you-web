import React from 'react';

import { setRequestLocale } from 'next-intl/server';

import ExtraClientMessages from '@/components/ExtraClientMessages';
import { REVIEW_NAMESPACES } from '@/i18n/clientMessages';

interface ReviewLayoutProps {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}

// The review form is a client component; its copy is not in the site-wide
// client set, so this segment adds it (ExtraClientMessages merges it with
// the set from the root layout).
const ReviewLayout = async ({ children, params }: ReviewLayoutProps) => {
  const { locale } = await params;

  setRequestLocale(locale);

  return <ExtraClientMessages namespaces={REVIEW_NAMESPACES}>{children}</ExtraClientMessages>;
};

export default ReviewLayout;
