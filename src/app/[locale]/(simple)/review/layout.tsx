import React from 'react';

import { NextIntlClientProvider } from 'next-intl';
import { getMessages, setRequestLocale } from 'next-intl/server';

import { CLIENT_NAMESPACES, REVIEW_NAMESPACES, pickMessages } from '@/i18n/clientMessages';

interface ReviewLayoutProps {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}

// The review form is a client component; its copy is not in the site-wide
// client bundle, so this segment provides it. A nested provider REPLACES
// messages (no merge) — pass the client set too (same as /itineraries).
const ReviewLayout = async ({ children, params }: ReviewLayoutProps) => {
  const { locale } = await params;

  setRequestLocale(locale);

  const messages = await getMessages();

  return (
    <NextIntlClientProvider messages={pickMessages(messages, [...CLIENT_NAMESPACES, ...REVIEW_NAMESPACES])}>
      {children}
    </NextIntlClientProvider>
  );
};

export default ReviewLayout;
