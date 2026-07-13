/**
 * Promo campaign calendar (Mario 12.7.2026, Boataround-style deals system).
 *
 * FULL-YEAR RECURRING SCHEDULE (Mario 12.7.2026: "napravi puni raspored, cijelu
 * godinu, isto na svim stranicama — jedna agencija"). Windows are annual
 * `MM-DD` ranges, so the same calendar repeats every year with NO manual date
 * refresh. The site picks the active campaign by today's MM-DD (FIRST match
 * wins), so the short event campaigns listed first (Black Friday, Christmas,
 * New Year, Flash, Hot Week) override the continuous seasonal base underneath.
 *
 * This array + all logic below is IDENTICAL on every boat4you site (one
 * agency, one calendar). Only `SITE_COUNTRY_CODES` / `SITE_VESSEL_TYPES` at the
 * bottom differ per site — the live "up to X%" is scoped by those, so the
 * percentage varies by market/boat type while the schedule stays the same.
 *
 * The "up to X%" figure is LIVE (promo.service.ts) — the biggest genuine
 * discount for the campaign's featured week, rounded DOWN to a step of 5 so we
 * never overstate. Colors come from the approved banner gallery.
 * Changing the schedule = edit this file + deploy (all sites).
 */
export interface PromoCampaign {
  /** URL slug under /deals/ and the sitemap entry. */
  slug: string;
  /** Key under the `promo.campaigns` i18n namespace. */
  i18nKey:
    | 'lastMinute'
    | 'septemberSails'
    | 'earlyBooking'
    | 'juneSails'
    | 'julySails'
    | 'hotWeek'
    | 'flashDeals'
    | 'blackFriday'
    | 'christmas'
    | 'newYear'
    | 'birthdayWeek';
  /** Annual window as `MM-DD`. When `activeFrom > activeTo` the window wraps the
   *  year end (e.g. Early Booking 10-01 → 05-24). Banner shows while today's
   *  MM-DD is inside it. */
  activeFrom: string;
  activeTo: string;
  /**
   * Featured charter week the campaign advertises. `rolling` snaps to the next
   * Saturday at least `leadDays` ahead (in-season urgency); `seasonStart` uses
   * the first Saturday of `month` this year (or next year once it has passed) —
   * for off-season "book next summer" campaigns.
   */
  window: { type: 'rolling'; leadDays: number } | { type: 'seasonStart'; month: number };
  /** Shown when the live aggregate is missing or below the 15% floor; null hides the number. */
  fallbackPct: number | null;
  colors: { bg: string; blob: string; blobText: string; shirt: string };
}

// FIRST MATCH WINS — keep the short event overrides at the TOP, the continuous
// seasonal base below. Every MM-DD of the year is covered by exactly one base
// entry, so a campaign is always active.
export const PROMO_CAMPAIGNS: PromoCampaign[] = [
  // ─── Short event overrides (checked first, sit on top of the base) ───
  {
    slug: 'black-friday',
    i18nKey: 'blackFriday',
    activeFrom: '11-24',
    activeTo: '11-30',
    window: { type: 'seasonStart', month: 5 },
    fallbackPct: 40,
    colors: { bg: '#14171c', blob: '#FFB703', blobText: '#14171c', shirt: '#FFB703' },
  },
  {
    slug: 'christmas',
    i18nKey: 'christmas',
    activeFrom: '12-18',
    activeTo: '12-27',
    window: { type: 'seasonStart', month: 5 },
    fallbackPct: 30,
    colors: { bg: '#0e5c3a', blob: '#f4d58d', blobText: '#08331f', shirt: '#f4d58d' },
  },
  {
    slug: 'new-year',
    i18nKey: 'newYear',
    activeFrom: '12-28',
    activeTo: '01-06',
    window: { type: 'seasonStart', month: 5 },
    fallbackPct: 30,
    colors: { bg: '#141a3c', blob: '#ffd60a', blobText: '#141a3c', shirt: '#ffd60a' },
  },
  {
    slug: 'flash-deals',
    i18nKey: 'flashDeals',
    activeFrom: '03-01',
    activeTo: '03-08',
    window: { type: 'seasonStart', month: 5 },
    fallbackPct: 30,
    colors: { bg: '#5b3fd6', blob: '#ffd43b', blobText: '#1e1147', shirt: '#ffd43b' },
  },
  {
    slug: 'hot-week',
    i18nKey: 'hotWeek',
    activeFrom: '07-13',
    activeTo: '07-19',
    window: { type: 'rolling', leadDays: 5 },
    fallbackPct: 30,
    colors: { bg: '#e8622a', blob: '#ffe08a', blobText: '#4a1c08', shirt: '#ffe08a' },
  },
  // ─── Continuous seasonal base (covers every day of the year) ───
  {
    slug: 'birthday-week',
    i18nKey: 'birthdayWeek',
    activeFrom: '05-25',
    activeTo: '05-31',
    window: { type: 'rolling', leadDays: 7 },
    fallbackPct: 30,
    colors: { bg: '#b5306e', blob: '#ffd60a', blobText: '#3d0f27', shirt: '#ffd60a' },
  },
  {
    slug: 'june-sails',
    i18nKey: 'juneSails',
    activeFrom: '06-01',
    activeTo: '06-30',
    window: { type: 'rolling', leadDays: 10 },
    fallbackPct: 25,
    colors: { bg: '#2a9d8f', blob: '#ffd166', blobText: '#10342e', shirt: '#ffd166' },
  },
  {
    slug: 'july-sails',
    i18nKey: 'julySails',
    activeFrom: '07-01',
    activeTo: '07-31',
    window: { type: 'rolling', leadDays: 10 },
    fallbackPct: 25,
    colors: { bg: '#1e88c9', blob: '#ffdd57', blobText: '#0a2f4a', shirt: '#ffdd57' },
  },
  {
    slug: 'last-minute',
    i18nKey: 'lastMinute',
    activeFrom: '08-01',
    activeTo: '08-31',
    window: { type: 'rolling', leadDays: 7 },
    fallbackPct: 30,
    colors: { bg: '#3572d8', blob: '#f7c948', blobText: '#14224e', shirt: '#f7c948' },
  },
  {
    slug: 'september-sails',
    i18nKey: 'septemberSails',
    activeFrom: '09-01',
    activeTo: '09-30',
    window: { type: 'rolling', leadDays: 10 },
    fallbackPct: 20,
    colors: { bg: '#0d6e6e', blob: '#f2e2bd', blobText: '#0a4747', shirt: '#f2e2bd' },
  },
  {
    slug: 'early-booking',
    i18nKey: 'earlyBooking',
    activeFrom: '10-01',
    activeTo: '05-24',
    window: { type: 'seasonStart', month: 5 },
    fallbackPct: 25,
    colors: { bg: '#0B1B2B', blob: '#FFB703', blobText: '#0B1B2B', shirt: '#FFB703' },
  },
];

const DAY_MS = 86_400_000;

// All date math runs in a single UTC frame so a CET/CEST server rendering just
// after local midnight can't emit a Friday-Friday "week": snapping
// (getUTCDay/setUTCDate) and the ISO label (toISOString) share the frame.
const toIsoDate = (d: Date) => d.toISOString().slice(0, 10);

/** Today's `MM-DD` in the UTC frame. */
const monthDay = (d: Date) => toIsoDate(d).slice(5);

/** Next Saturday on/after the given date, in UTC (a Saturday stays as-is). */
const snapToSaturday = (d: Date) => {
  const r = new Date(d);

  r.setUTCDate(r.getUTCDate() + ((6 - r.getUTCDay() + 7) % 7));
  r.setUTCHours(0, 0, 0, 0);

  return r;
};

/** Is `md` (MM-DD) inside [from, to]? A window with from > to wraps the year. */
const inAnnualWindow = (md: string, from: string, to: string) =>
  from <= to ? md >= from && md <= to : md >= from || md <= to;

export const getActiveCampaign = (today = new Date()): PromoCampaign | null => {
  const md = monthDay(today);

  return PROMO_CAMPAIGNS.find(c => inAnnualWindow(md, c.activeFrom, c.activeTo)) ?? null;
};

export const getCampaignBySlug = (slug: string): PromoCampaign | null =>
  PROMO_CAMPAIGNS.find(c => c.slug === slug) ?? null;

/** The Sat–Sat week the campaign's banner/landing advertises, as ISO dates.
 *  `rolling`: next Saturday at least `leadDays` out (the active month, in
 *  season). `seasonStart`: the first Saturday of `month` this year, or next
 *  year once that week has passed — off-season campaigns advertise next
 *  summer's opening week. */
export const resolveFeaturedWeek = (
  campaign: PromoCampaign,
  today = new Date()
): { startDate: string; endDate: string } => {
  let start: Date;

  if (campaign.window.type === 'rolling') {
    start = snapToSaturday(new Date(today.getTime() + campaign.window.leadDays * DAY_MS));
  } else {
    const { month } = campaign.window;
    const year = today.getUTCFullYear();
    const thisYear = snapToSaturday(new Date(Date.UTC(year, month - 1, 1)));

    // Use this year's first-Saturday week if it's still a few days out;
    // otherwise the target month has passed → advertise next year's.
    start =
      thisYear.getTime() > today.getTime() + 3 * DAY_MS
        ? thisYear
        : snapToSaturday(new Date(Date.UTC(year + 1, month - 1, 1)));
  }

  const end = new Date(start.getTime() + 7 * DAY_MS);

  return { startDate: toIsoDate(start), endDate: toIsoDate(end) };
};
