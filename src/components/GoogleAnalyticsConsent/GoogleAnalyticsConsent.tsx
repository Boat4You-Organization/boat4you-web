'use client';

import { useEffect } from 'react';

import { GoogleAnalytics } from '@next/third-parties/google';
import { usePathname } from 'next/navigation';
import { useReportWebVitals } from 'next/web-vitals';

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

/** The part of a web-vitals metric used here (next/web-vitals hands the
 *  library's Metric). */
interface VitalsMetric {
  name: string;
  id: string;
  value: number;
  delta: number;
  rating?: string;
  entries: PerformanceEntry[];
}

type VitalsEntry = PerformanceEntry & {
  target?: Node | null;
  element?: Element | null;
  value?: number;
  sources?: Array<{ node?: Node | null }>;
};

const REPORTED_VITALS = new Set(['INP', 'LCP', 'CLS']);

/** "button#book.cta" — enough to find the element, short enough for a GA
 *  parameter (100 characters). */
const selectorOf = (node: Node | null | undefined): string | undefined => {
  if (!(node instanceof Element)) return undefined;

  const id = node.id ? `#${node.id}` : '';
  const classes =
    typeof node.className === 'string' && node.className.trim()
      ? `.${node.className.trim().split(/\s+/).slice(0, 2).join('.')}`
      : '';

  return `${node.tagName.toLowerCase()}${id}${classes}`.slice(0, 100);
};

/** The element behind the metric: the INP interaction's target, the LCP
 *  element, the node of the largest layout shift. */
const vitalsTarget = (metric: VitalsMetric): string | undefined => {
  const entries = metric.entries as VitalsEntry[];

  if (metric.name === 'INP') return selectorOf(entries[0]?.target);

  if (metric.name === 'LCP') return selectorOf(entries[entries.length - 1]?.element);

  const largest = entries.reduce<VitalsEntry | undefined>(
    (max, e) => ((e.value ?? 0) > (max?.value ?? 0) ? e : max),
    undefined
  );

  return selectorOf(largest?.sources?.[0]?.node);
};

/**
 * Field Core Web Vitals (INP, LCP, CLS) from real visitors to GA4 (audit E5,
 * 1.10.2026: the CrUX/PSI data could not say which interaction is slow).
 * One event per metric update, named after the metric, in the shape Google
 * documents for GA4 (value = delta, CLS × 1000; metric_id groups the updates
 * of one page view). Sent only with the visitor's ANALYTICS consent — the
 * tag would otherwise send cookieless consent-mode pings — and never on the
 * review magic-link pages. The observers are the ones Next ships
 * (next/web-vitals); nothing here runs before the page is interactive.
 */
const reportWebVital = (metric: VitalsMetric): void => {
  if (!REPORTED_VITALS.has(metric.name) || NO_ANALYTICS_PATH.test(window.location.pathname)) return;

  if (!shouldShowAnalytics()) return;

  const gtag = getGtag();

  if (!gtag) return;

  const target = vitalsTarget(metric);
  const eventType = metric.name === 'INP' ? metric.entries[0]?.name : undefined;

  gtag('event', metric.name, {
    value: Math.round(metric.name === 'CLS' ? metric.delta * 1000 : metric.delta),
    metric_id: metric.id,
    metric_value: metric.value,
    metric_delta: metric.delta,
    metric_rating: metric.rating,
    ...(target ? { debug_target: target } : {}),
    ...(eventType ? { debug_event: eventType } : {}),
    non_interaction: true,
  });
};

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

  useReportWebVitals(reportWebVital);

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
