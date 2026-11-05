import { type ReactNode } from 'react';

import { type Messages } from 'next-intl';
import { getMessages } from 'next-intl/server';

import { pickMessages } from '@/i18n/clientMessages';

import MergedMessages from './MergedMessages';

interface ExtraClientMessagesProps {
  /** Namespaces the client components below read that are not in the site-wide client set. */
  namespaces: readonly (keyof Messages)[];
  children: ReactNode;
}

/**
 * Gives the client components of one page or segment the namespaces only they read, on top of the site-wide
 * set from the root layout (i18n/clientMessages.ts). Everything a provider holds is serialized into the page,
 * so a namespace that one page needs is added here, on that page, instead of being sent with every page.
 */
const ExtraClientMessages = async ({ namespaces, children }: ExtraClientMessagesProps) => {
  const messages = await getMessages();

  return <MergedMessages messages={pickMessages(messages, namespaces)}>{children}</MergedMessages>;
};

export default ExtraClientMessages;
