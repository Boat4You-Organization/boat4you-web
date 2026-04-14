'use client';

import { useEffect, useState } from 'react';

import { GoogleAnalytics } from '@next/third-parties/google';

import { shouldShowAnalytics } from '@/lib/cookie-consent';

interface GoogleAnalyticsConsentProps {
  gaId: string;
  gAdsId?: string;
}

export function GoogleAnalyticsConsent({ gaId, gAdsId }: GoogleAnalyticsConsentProps) {
  const [analyticsConsent, setAnalyticsConsent] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setAnalyticsConsent(shouldShowAnalytics());
    setMounted(true);
  }, []);

  useEffect(() => {
    const handleConsentChange = (): void => {
      const newAnalyticsConsent = shouldShowAnalytics();

      setAnalyticsConsent(newAnalyticsConsent);

      if (typeof window !== 'undefined' && window.gtag) {
        window.gtag('consent', 'update', {
          analytics_storage: newAnalyticsConsent ? 'granted' : 'denied',
        });
      }
    };

    window.addEventListener('storage', handleConsentChange);
    window.addEventListener('consentUpdated', handleConsentChange);

    return () => {
      window.removeEventListener('storage', handleConsentChange);
      window.removeEventListener('consentUpdated', handleConsentChange);
    };
  }, []);

  useEffect(() => {
    if (!mounted || !gaId) return;

    if (!window.dataLayer) {
      window.dataLayer = [];
    }

    if (!window.gtag) {
      window.gtag = function gtagFunction(
        command: 'config' | 'event' | 'consent' | 'js',
        targetOrAction: string | 'default' | 'update' | Date,
        config?: {
          analytics_storage?: 'granted' | 'denied';
          ad_storage?: 'granted' | 'denied';
          functionality_storage?: 'granted' | 'denied';
          security_storage?: 'granted' | 'denied';
          [key: string]: string | number | boolean | undefined;
        }
      ) {
        if (window.dataLayer) {
          window.dataLayer.push({ command, target: targetOrAction, ...config });
        }
      };
    }

    if (window.gtag) {
      window.gtag('consent', 'default', {
        analytics_storage: analyticsConsent ? 'granted' : 'denied',
        ad_storage: analyticsConsent ? 'granted' : 'denied',
        functionality_storage: 'granted',
        security_storage: 'granted',
      });

      if (gAdsId && analyticsConsent) {
        window.gtag('config', gAdsId);
      }
    }
  }, [gaId, gAdsId, analyticsConsent, mounted]);

  if (!gaId || !mounted) return null;

  return analyticsConsent ? <GoogleAnalytics gaId={gaId} /> : null;
}
