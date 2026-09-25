'use client';

import { useEffect } from 'react';

import { GoogleAnalytics } from '@next/third-parties/google';
import { usePathname } from 'next/navigation';

import { shouldShowAnalytics, shouldShowMarketing } from '@/lib/cookie-consent';

interface GoogleAnalyticsConsentProps {
  gaId: string;
  gAdsIds?: string[];
}

type GtagFn = (...args: unknown[]) => void;

const getGtag = (): GtagFn | undefined =>
  typeof window === 'undefined' ? undefined : (window as unknown as { gtag?: GtagFn }).gtag;

/**
 * Pages whose URL is a secret (the e-mailed review magic link, which also
 * carries ?rating=). gtag.js is not loaded there at all: GA's page_view sends
 * page_location = location.href, and even consent-denied cookieless pings
 * carry it. Entry is always a full page load from the e-mail, so skipping
 * the loader keeps the token out of every analytics hit.
 */
const NO_ANALYTICS_PATH = /^(?:\/[a-z]{2})?\/review(?:\/|$)/;

// Google Consent Mode v2.
//
// The denied-by-default consent state is set by an inline <head> script in the
// layout that runs BEFORE gtag.js loads (see RootLayout). That ordering is what
// keeps us compliant: the tag is loaded eagerly so Google can DETECT it, but in
// `denied` state it sets NO cookies and tracks nothing — only anonymous,
// cookieless consent signals — until the visitor accepts. After consent we flip
// to `granted` here.
//
// Granular mapping (GDPR: separate purposes): analytics_storage follows the
// ANALYTICS choice; ad_storage / ad_user_data / ad_personalization follow the
// MARKETING choice. GA4 is loaded eagerly by <GoogleAnalytics>; the Google Ads
// conversion id(s) are configured here.
export function GoogleAnalyticsConsent({ gaId, gAdsIds }: GoogleAnalyticsConsentProps) {
  const disabled = NO_ANALYTICS_PATH.test(usePathname() ?? '');

  useEffect(() => {
    const sync = (): void => {
      const analytics = shouldShowAnalytics() ? 'granted' : 'denied';
      const marketing = shouldShowMarketing() ? 'granted' : 'denied';

      getGtag()?.('consent', 'update', {
        analytics_storage: analytics,
        ad_storage: marketing,
        ad_user_data: marketing,
        ad_personalization: marketing,
      });
    };

    sync();
    window.addEventListener('storage', sync);
    window.addEventListener('consentUpdated', sync);

    return () => {
      window.removeEventListener('storage', sync);
      window.removeEventListener('consentUpdated', sync);
    };
  }, []);

  useEffect(() => {
    const gtag = getGtag();

    if (disabled || !gaId || !gtag || !gAdsIds?.length) return;

    gAdsIds.forEach(id => gtag('config', id));
  }, [disabled, gaId, gAdsIds]);

  if (!gaId || disabled) return null;

  return <GoogleAnalytics gaId={gaId} />;
}
