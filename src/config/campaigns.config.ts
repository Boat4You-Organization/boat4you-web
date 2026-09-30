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
 * never overstate. Colors (bright gradients, sticker, sun) and the scene art
 * (character, boat, sky effects) come from the approved animated banner
 * prototype (Mario 30.9.2026); the art files live in public/promo.
 * Changing the schedule = edit this file + deploy (all sites).
 */

/** Animated character loop: public/promo/<name>.webp + <name>_poster.webp (static first frame). */
export type PromoCharacter =
  | 'september'
  | 'early'
  | 'bf'
  | 'xmas'
  | 'ny'
  | 'flash'
  | 'bday'
  | 'june'
  | 'july'
  | 'hot'
  | 'last';

/** Animated boat loop: public/promo/<name>.webp + <name>_poster.webp. */
export type PromoBoat = 'boat_september' | 'boat_early' | 'boat_last' | 'boat_xmas';

/** Sky of the banner scene. Positions are pseudo-random from `seed` (the
 *  prototype's seed, so every campaign matches the approved renders) and the
 *  same on the server and in the browser. Counts are numbers of elements. */
export interface PromoSky {
  seed: number;
  glow?: boolean;
  sun?: 'plain' | 'big' | 'rise';
  clouds?: number;
  gulls?: number;
  stars?: number;
  snow?: number;
  confetti?: number;
  balloons?: number;
  tags?: number;
  bolts?: number;
  fireworks?: number;
  heat?: boolean;
}

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
  /** `bg` is a CSS background (gradient); `blob`/`blobText` the discount
   *  sticker and CTA button; `sun` the sun disc (unused without a sun). */
  colors: { bg: string; blob: string; blobText: string; sun: string };
  /** `wideBoat`: the flat speedboat artwork, drawn lower and wider. */
  art: { character: PromoCharacter; boat: PromoBoat; wideBoat?: boolean; sky: PromoSky };
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
    colors: {
      bg: 'linear-gradient(100deg,#1f2233 0%,#3b2f70 55%,#8a45b0 100%)',
      blob: '#FFB703',
      blobText: '#14171c',
      sun: '#fff4c2',
    },
    art: { character: 'bf', boat: 'boat_last', wideBoat: true, sky: { seed: 209, glow: true, stars: 16, tags: 9 } },
  },
  {
    slug: 'christmas',
    i18nKey: 'christmas',
    activeFrom: '12-18',
    activeTo: '12-27',
    window: { type: 'seasonStart', month: 5 },
    fallbackPct: 30,
    colors: {
      bg: 'linear-gradient(100deg,#178a55 0%,#25a86a 50%,#72d19c 100%)',
      blob: '#ffe08a',
      blobText: '#0b3d25',
      sun: '#fff4c2',
    },
    art: { character: 'xmas', boat: 'boat_xmas', sky: { seed: 310, glow: true, snow: 40 } },
  },
  {
    slug: 'new-year',
    i18nKey: 'newYear',
    activeFrom: '12-28',
    activeTo: '01-06',
    window: { type: 'seasonStart', month: 5 },
    fallbackPct: 30,
    colors: {
      bg: 'linear-gradient(100deg,#2a3a8f 0%,#5b4bc4 55%,#b16fd8 100%)',
      blob: '#ffd60a',
      blobText: '#141a3c',
      sun: '#fff4c2',
    },
    art: { character: 'ny', boat: 'boat_early', sky: { seed: 411, glow: true, stars: 26, fireworks: 4 } },
  },
  {
    slug: 'flash-deals',
    i18nKey: 'flashDeals',
    activeFrom: '03-01',
    activeTo: '03-08',
    window: { type: 'seasonStart', month: 5 },
    fallbackPct: 30,
    colors: {
      bg: 'linear-gradient(100deg,#6a4be3 0%,#8f6bf5 50%,#c79dff 100%)',
      blob: '#ffd43b',
      blobText: '#1e1147',
      sun: '#fff4c2',
    },
    art: { character: 'flash', boat: 'boat_last', wideBoat: true, sky: { seed: 512, glow: true, clouds: 2, bolts: 3 } },
  },
  {
    slug: 'hot-week',
    i18nKey: 'hotWeek',
    activeFrom: '07-13',
    activeTo: '07-19',
    window: { type: 'rolling', leadDays: 5 },
    fallbackPct: 30,
    colors: {
      bg: 'linear-gradient(100deg,#ee6428 0%,#ff8c3f 50%,#ffc56e 100%)',
      blob: '#fff3b0',
      blobText: '#5a2208',
      sun: '#fff3b0',
    },
    art: { character: 'hot', boat: 'boat_september', sky: { seed: 916, glow: true, sun: 'big', gulls: 2, heat: true } },
  },
  // ─── Continuous seasonal base (covers every day of the year) ───
  {
    slug: 'birthday-week',
    i18nKey: 'birthdayWeek',
    activeFrom: '05-25',
    activeTo: '05-31',
    window: { type: 'rolling', leadDays: 7 },
    fallbackPct: 30,
    colors: {
      bg: 'linear-gradient(100deg,#d0417f 0%,#ea6aa0 50%,#ffa9c9 100%)',
      blob: '#ffd60a',
      blobText: '#3d0f27',
      sun: '#fff4c2',
    },
    art: { character: 'bday', boat: 'boat_early', sky: { seed: 613, glow: true, balloons: 6, confetti: 26 } },
  },
  {
    slug: 'june-sails',
    i18nKey: 'juneSails',
    activeFrom: '06-01',
    activeTo: '06-30',
    window: { type: 'rolling', leadDays: 10 },
    fallbackPct: 25,
    colors: {
      bg: 'linear-gradient(100deg,#1f9a8b 0%,#35b8a6 50%,#90e0cf 100%)',
      blob: '#ffd166',
      blobText: '#10342e',
      sun: '#ffe08a',
    },
    art: {
      character: 'june',
      boat: 'boat_september',
      sky: { seed: 714, glow: true, sun: 'plain', clouds: 3, gulls: 2 },
    },
  },
  {
    slug: 'july-sails',
    i18nKey: 'julySails',
    activeFrom: '07-01',
    activeTo: '07-31',
    window: { type: 'rolling', leadDays: 10 },
    fallbackPct: 25,
    colors: {
      bg: 'linear-gradient(100deg,#1a86d0 0%,#3aa6ea 50%,#8ed3ff 100%)',
      blob: '#ffdd57',
      blobText: '#0a2f4a',
      sun: '#fff1a6',
    },
    art: { character: 'july', boat: 'boat_early', sky: { seed: 815, glow: true, sun: 'plain', clouds: 3, gulls: 3 } },
  },
  {
    slug: 'last-minute',
    i18nKey: 'lastMinute',
    activeFrom: '08-01',
    activeTo: '08-31',
    window: { type: 'rolling', leadDays: 7 },
    fallbackPct: 30,
    colors: {
      bg: 'linear-gradient(100deg,#2780e3 0%,#3f9cf0 50%,#86c9ff 100%)',
      blob: '#ffd23f',
      blobText: '#143063',
      sun: '#fff1a6',
    },
    art: {
      character: 'last',
      boat: 'boat_last',
      wideBoat: true,
      sky: { seed: 1017, glow: true, sun: 'plain', clouds: 3, gulls: 2 },
    },
  },
  {
    slug: 'september-sails',
    i18nKey: 'septemberSails',
    activeFrom: '09-01',
    activeTo: '09-30',
    window: { type: 'rolling', leadDays: 10 },
    fallbackPct: 20,
    colors: {
      bg: 'linear-gradient(100deg,#0e8f8a 0%,#19aaa2 45%,#63d3c6 100%)',
      blob: '#fff0c9',
      blobText: '#0a4f4c',
      sun: '#ffd98a',
    },
    art: {
      character: 'september',
      boat: 'boat_september',
      sky: { seed: 7, glow: true, sun: 'plain', clouds: 3, gulls: 3 },
    },
  },
  {
    slug: 'early-booking',
    i18nKey: 'earlyBooking',
    activeFrom: '10-01',
    activeTo: '05-24',
    window: { type: 'seasonStart', month: 5 },
    fallbackPct: 25,
    colors: {
      bg: 'linear-gradient(100deg,#3f59c9 0%,#7866d6 48%,#ff9f82 100%)',
      blob: '#FFB703',
      blobText: '#1b1f4b',
      sun: '#ffd3a3',
    },
    art: {
      character: 'early',
      boat: 'boat_early',
      sky: { seed: 108, glow: true, sun: 'rise', clouds: 3, gulls: 2, stars: 10 },
    },
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
