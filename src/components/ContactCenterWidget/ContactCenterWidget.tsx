'use client';

import { usePathname } from 'next/navigation';
import Script from 'next/script';

import { PRIVATE_LINK_PATH } from '@/utils/static/privateLinkPath';

interface ContactCenterWidgetProps {
  locale: string;
}

/**
 * The Contact Center widget loader (Iris chat, visit statistics, session recorder; P3b, 30.10.2026). Visit statistics
 * only with the Analytics consent (the widget reads boat4you_cookie_consent itself). Not on a page whose URL is a
 * secret (PRIVATE_LINK_PATH: the /pay/<key> card payment link, the /review/<token> link): the widget's chat and visit
 * statistics send the page address to the backend. Those pages are entered by a full page load, so the loader never
 * runs there; a visitor who leaves through the header gets the widget on the next page.
 */
const ContactCenterWidget = ({ locale }: ContactCenterWidgetProps) => {
  const pathname = usePathname();

  if (PRIVATE_LINK_PATH.test(pathname ?? '')) return null;

  return (
    <Script
      id="b4y-cc"
      src={process.env.NEXT_PUBLIC_CC_WIDGET_URL || 'https://www.boat4you.com/cc-widget/loader.js'}
      strategy="afterInteractive"
      data-site="boat4you"
      data-locale={locale}
      data-api={process.env.NEXT_PUBLIC_BOAT_WS_API_URL}
    />
  );
};

export default ContactCenterWidget;
