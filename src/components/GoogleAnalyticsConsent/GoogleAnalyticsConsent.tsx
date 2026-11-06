'use client';

import { useCallback, useEffect } from 'react';

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
 * review magic-link pages. `send_to` keeps the event on the GA4 property:
 * without it gtag sends it to every configured target, the Google Ads tag
 * included (review 1.10.2026: LCP/INP/CLS arrived in Ads as remarketing
 * events). The observers are the ones Next ships (next/web-vitals); nothing
 * here runs before the page is interactive.
 */
const reportWebVital = (metric: VitalsMetric, gaId: string): void => {
  if (!gaId || !REPORTED_VITALS.has(metric.name) || NO_ANALYTICS_PATH.test(window.location.pathname)) return;

  if (!shouldShowAnalytics()) return;

  const gtag = getGtag();

  if (!gtag) return;

  const target = vitalsTarget(metric);
  const eventType = metric.name === 'INP' ? metric.entries[0]?.name : undefined;

  gtag('event', metric.name, {
    send_to: gaId,
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

/**
 * A visit that carries a click, linker or campaign id in its address: a Google Ads click (gclid, gclsrc, gbraid,
 * wbraid, gad_source), a visit handed over by a sister site (_gl, crossDomainLinker.ts), another ad network's click
 * id, or campaign tags (utm_*: social posts, e-mail, Bing without auto-tagging). gtag.js reads these from the address
 * when it starts and keeps them for the whole visit, so for such a visit it has to start before the first in-app
 * navigation rewrites the address.
 */
const CLICK_ID_IN_URL = /[?&](?:gclid|gclsrc|gbraid|wbraid|gad_source|_gl|dclid|msclkid|fbclid|utm_[a-z]+)=/;

/** How long after the page has loaded the tag waits for an idle moment before it loads anyway. */
const TAG_IDLE_TIMEOUT_MS = 3000;

/** Browsers without requestIdleCallback (Safari): a short pause after load instead of the full idle timeout. */
const TAG_NO_IDLE_DELAY_MS = 300;

const TAG_SCRIPT_ID = 'b4y-gtag-js';

/** `gtag('config', …)` sends a page view each time it runs, so the tag is configured once per document. */
let tagConfigured = false;

// Google Consent Mode v2.
//
// The denied-by-default consent state is set by an inline <head> script in the
// layout that runs BEFORE gtag.js loads (see RootLayout). That ordering is what
// keeps us compliant: the tag is loaded without waiting for consent so Google
// can DETECT it, but in `denied` state it sets NO cookies and tracks nothing —
// only anonymous, cookieless consent signals — until the visitor accepts. After
// consent we flip to `granted` here.
//
// Granular mapping (GDPR: separate purposes): analytics_storage follows the
// ANALYTICS choice; ad_storage / ad_user_data / ad_personalization follow the
// MARKETING choice. GA4 and the Google Ads conversion id(s) are configured here.
//
// When gtag.js itself loads (6.11.2026, mobile speed): the GA4 tag and the two
// Ads destinations of that day were three scripts (one Ads destination is left,
// see the layout), about 520 KB and ~450 ms of main thread on
// a phone, and next/script preloaded the first one in <head>, ahead of the page's
// own resources. The commands are queued in dataLayer at once, as before; only
// the script waits:
// - a visit with a click, linker or campaign id in the address (CLICK_ID_IN_URL)
//   loads it right after hydration, exactly as before, so attribution is untouched;
// - every other visit loads it once the page has finished loading and the
//   browser is idle (at most TAG_IDLE_TIMEOUT_MS later; TAG_NO_IDLE_DELAY_MS
//   where there is no idle callback). A visitor who leaves before that is not
//   counted as a page view (owner's decision, 6.11.2026).
// Conversions (inquiry, begin checkout) fire long after either moment.
export function GoogleAnalyticsConsent({ gaId, gAdsIds }: GoogleAnalyticsConsentProps) {
  const disabled = NO_ANALYTICS_PATH.test(usePathname() ?? '');

  // Stable per gaId: useReportWebVitals registers its observers again
  // whenever the callback changes.
  const reportVital = useCallback((metric: VitalsMetric) => reportWebVital(metric, gaId), [gaId]);

  useReportWebVitals(reportVital);

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

  // Queue the tag's start-up commands (what @next/third-parties' <GoogleAnalytics> did inline) and the Ads
  // destinations. `window.gtag` is the queueing stub from the layout's consent script.
  useEffect(() => {
    const gtag = getGtag();

    if (disabled || !gaId || !gtag || tagConfigured) return;

    tagConfigured = true;
    gtag('js', new Date());
    gtag('config', gaId);
    gAdsIds?.forEach(id => gtag('config', id));
  }, [disabled, gaId, gAdsIds]);

  // Load gtag.js: at once for a visit with a click id, otherwise when the page is loaded and idle.
  useEffect(() => {
    if (disabled || !gaId || document.getElementById(TAG_SCRIPT_ID)) return undefined;

    const load = (): void => {
      if (document.getElementById(TAG_SCRIPT_ID)) return;

      const script = document.createElement('script');

      script.id = TAG_SCRIPT_ID;
      script.async = true;
      script.src = `https://www.googletagmanager.com/gtag/js?id=${encodeURIComponent(gaId)}`;
      document.head.appendChild(script);
    };

    if (CLICK_ID_IN_URL.test(window.location.search)) {
      load();

      return undefined;
    }

    let idleId: number | undefined;
    let timerId: number | undefined;
    const whenIdle = (): void => {
      if (typeof window.requestIdleCallback === 'function') {
        idleId = window.requestIdleCallback(load, { timeout: TAG_IDLE_TIMEOUT_MS });
      } else {
        timerId = window.setTimeout(load, TAG_NO_IDLE_DELAY_MS);
      }
    };

    if (document.readyState === 'complete') whenIdle();
    else window.addEventListener('load', whenIdle, { once: true });

    return () => {
      window.removeEventListener('load', whenIdle);

      if (idleId !== undefined) window.cancelIdleCallback(idleId);

      if (timerId !== undefined) window.clearTimeout(timerId);
    };
  }, [disabled, gaId]);

  return null;
}
