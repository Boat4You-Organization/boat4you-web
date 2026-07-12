/**
 * Promo campaign calendar (Mario 12.7.2026, Boataround-style deals system).
 *
 * The site picks the active campaign by today's date (first match wins) and
 * renders it as the hero banner on the home page and the search listing, both
 * linking to /deals/{slug}. The "up to X%" figure is LIVE — resolved from the
 * backend's maxDiscountPerc aggregate for the campaign's featured week and
 * rounded DOWN to a step of 5 so we never overstate a discount
 * (see promo.service.ts). Changing campaigns = edit this file + deploy.
 *
 * Colors come from the approved banner gallery (H-BLUE50, H-TEAL20, H-NAVY30…).
 */
export interface PromoCampaign {
  /** URL slug under /deals/ and the sitemap entry. */
  slug: string;
  /** Key under the `promo.campaigns` i18n namespace. */
  i18nKey: 'lastMinute' | 'septemberSails' | 'earlyBooking';
  /** Banner is shown on home + listing while today is inside [from, to]. */
  activeFrom: string;
  activeTo: string;
  /**
   * Featured charter week the campaign advertises. `rolling` snaps to the
   * next Saturday at least `leadDays` ahead (last-minute style); `absolute`
   * uses the first Saturday inside the fixed window (seasonal campaigns).
   */
  window: { type: 'rolling'; leadDays: number } | { type: 'absolute'; from: string; to: string };
  /** Shown when the live aggregate is missing or below the 15% floor; null hides the number. */
  fallbackPct: number | null;
  colors: { bg: string; blob: string; blobText: string; shirt: string };
}

export const PROMO_CAMPAIGNS: PromoCampaign[] = [
  {
    slug: 'last-minute',
    i18nKey: 'lastMinute',
    activeFrom: '2026-06-01',
    activeTo: '2026-08-20',
    window: { type: 'rolling', leadDays: 10 },
    fallbackPct: 30,
    colors: { bg: '#3572d8', blob: '#f7c948', blobText: '#14224e', shirt: '#f7c948' },
  },
  {
    slug: 'september-sails',
    i18nKey: 'septemberSails',
    activeFrom: '2026-08-21',
    activeTo: '2026-09-25',
    window: { type: 'absolute', from: '2026-09-01', to: '2026-10-03' },
    fallbackPct: 20,
    colors: { bg: '#0d6e6e', blob: '#f2e2bd', blobText: '#0a4747', shirt: '#f2e2bd' },
  },
  {
    slug: 'early-booking',
    i18nKey: 'earlyBooking',
    activeFrom: '2026-09-26',
    activeTo: '2027-04-30',
    window: { type: 'absolute', from: '2027-05-01', to: '2027-10-02' },
    fallbackPct: 25,
    colors: { bg: '#0B1B2B', blob: '#FFB703', blobText: '#0B1B2B', shirt: '#FFB703' },
  },
];

const DAY_MS = 86_400_000;

// All date math runs in a single UTC frame so a CET/CEST server rendering
// just after local midnight can't emit a Friday-Friday "week": snapping
// (getUTCDay/setUTCDate) and the ISO label (toISOString) share the frame.
const toIsoDate = (d: Date) => d.toISOString().slice(0, 10);

/** UTC midnight of the calendar day of `iso` ('YYYY-MM-DD' parses as UTC). */
const parseUtcDate = (iso: string) => new Date(`${iso}T00:00:00.000Z`);

/** Next Saturday on/after the given date, in UTC (a Saturday stays as-is). */
const snapToSaturday = (d: Date) => {
  const r = new Date(d);

  r.setUTCDate(r.getUTCDate() + ((6 - r.getUTCDay() + 7) % 7));
  r.setUTCHours(0, 0, 0, 0);

  return r;
};

export const getActiveCampaign = (today = new Date()): PromoCampaign | null => {
  const iso = toIsoDate(today);

  return PROMO_CAMPAIGNS.find(c => iso >= c.activeFrom && iso <= c.activeTo) ?? null;
};

export const getCampaignBySlug = (slug: string): PromoCampaign | null =>
  PROMO_CAMPAIGNS.find(c => c.slug === slug) ?? null;

/** The Sat–Sat week the campaign's banner/landing advertises, as ISO dates.
 *  Rolling: next Saturday at least `leadDays` out. Absolute: first Saturday
 *  inside [from, to] that still leaves a full 7-day week before `to` — as the
 *  active window ends the featured week is clamped back so it never spills
 *  past the configured window (`to` is the last check-in + 7d bound). */
export const resolveFeaturedWeek = (
  campaign: PromoCampaign,
  today = new Date()
): { startDate: string; endDate: string } => {
  let start: Date;

  if (campaign.window.type === 'rolling') {
    start = snapToSaturday(new Date(today.getTime() + campaign.window.leadDays * DAY_MS));
  } else {
    const from = parseUtcDate(campaign.window.from);
    const to = parseUtcDate(campaign.window.to);
    const earliest = new Date(Math.max(today.getTime() + 3 * DAY_MS, from.getTime()));

    start = snapToSaturday(earliest);

    // Last Saturday whose Sat–Sat week still fits before `to`; if the natural
    // snap overshoots, fall back to it so the week stays inside the window.
    const latestStartMs = to.getTime() - 7 * DAY_MS;

    if (start.getTime() > latestStartMs) {
      const latest = new Date(latestStartMs);

      latest.setUTCDate(latest.getUTCDate() - ((latest.getUTCDay() - 6 + 7) % 7));
      latest.setUTCHours(0, 0, 0, 0);
      start = latest;
    }
  }

  const end = new Date(start.getTime() + 7 * DAY_MS);

  return { startDate: toIsoDate(start), endDate: toIsoDate(end) };
};
