'use client';

import { type ReactNode, useMemo } from 'react';

import { type Messages, NextIntlClientProvider, useLocale, useMessages } from 'next-intl';

interface MergedMessagesProps {
  messages: Partial<Messages>;
  children: ReactNode;
}

/**
 * Client half of ExtraClientMessages: the messages the browser already has from the provider above, plus the
 * ones this subtree adds. A nested NextIntlClientProvider replaces `messages` instead of merging them, so the
 * merge happens here, in memory; only the added namespaces travel in the page's payload. Locale is passed on
 * explicitly (the client provider requires it); time zone, formats and the rest are inherited.
 */
const MergedMessages = ({ messages, children }: MergedMessagesProps) => {
  const inherited = useMessages();
  const locale = useLocale();
  const merged = useMemo(() => ({ ...inherited, ...messages }), [inherited, messages]);

  return (
    <NextIntlClientProvider locale={locale} messages={merged}>
      {children}
    </NextIntlClientProvider>
  );
};

export default MergedMessages;
