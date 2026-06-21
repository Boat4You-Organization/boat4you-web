'use client';

import { useEffect } from 'react';

import { GoogleAnalytics } from '@next/third-parties/google';

import { shouldShowAnalytics, shouldShowMarketing } from '@/lib/cookie-consent';

interface GoogleAnalyticsConsentProps {
  gaId: string;
  gAdsIds?: string[];
}

type GtagFn = (...args: unknown[]) => void;

const getGtag = (): GtagFn | undefined =>
  typeof window === 'undefined' ? undefined : (window as unknown as { gtag?: GtagFn }).gtag;

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

    if (!gaId || !gtag || !gAdsIds?.length) return;

    gAdsIds.forEach(id => gtag('config', id));
  }, [gaId, gAdsIds]);

  if (!gaId) return null;

  return <GoogleAnalytics gaId={gaId} />;
}
