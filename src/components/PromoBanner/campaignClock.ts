import type { PromoCampaign } from '@/config/campaigns.config';

const DAY_MS = 86_400_000;
const HOUR_MS = 3_600_000;
const MINUTE_MS = 60_000;

/** Below this many days left the sticker shows a ticking countdown instead of the end date. */
export const COUNTDOWN_DAYS = 14;

export type CampaignClock =
  | { kind: 'startsOn'; date: number }
  | { kind: 'bookBy'; date: number }
  | { kind: 'endsIn'; days: number; time: string }
  | { kind: 'ended' };

const parseMonthDay = (md: string) => md.split('-').map(Number);

/**
 * The campaign's running annual window, or its next one when it is not running (timestamps). Candidates start
 * last year, this year and next year, so windows that wrap the year end (Early Booking 10-01 → 05-24, New Year
 * 12-28 → 01-06) resolve like the others; the window ends at 23:59:59 of `activeTo`. Same algorithm as the
 * prototype, in the UTC frame getActiveCampaign uses, so the countdown runs out when the site switches campaigns.
 */
export const campaignWindow = (campaign: PromoCampaign, now: number) => {
  const year = new Date(now).getUTCFullYear();
  const [fromMonth, fromDay] = parseMonthDay(campaign.activeFrom);
  const [toMonth, toDay] = parseMonthDay(campaign.activeTo);
  const wraps = fromMonth * 100 + fromDay > toMonth * 100 + toDay;
  const candidates = [year - 1, year, year + 1].map(y => ({
    start: Date.UTC(y, fromMonth - 1, fromDay),
    end: Date.UTC(wraps ? y + 1 : y, toMonth - 1, toDay, 23, 59, 59),
  }));
  const running = candidates.find(w => now >= w.start && now <= w.end);

  if (running) return { active: true as const, ...running };

  // The year+1 candidate always starts in the future, so there is a next window.
  const next = candidates.find(w => w.start > now) ?? candidates[2];
  // End of the window that ran last (with none running, last year's has always ended): campaignClock's 'ended'.
  const previousEnd = Math.max(...candidates.filter(w => w.end < now).map(w => w.end), -Infinity);

  return { active: false as const, ...next, previousEnd };
};

const pad2 = (n: number) => String(n).padStart(2, '0');

/**
 * "Book by <end>" while 14+ days are left, a countdown in the last 14 days, "Starts <start>" otherwise. `current`:
 * the page showed this campaign as the running one (every banner except the deals landing), so once its window has
 * passed (a cached page, or a tab left open over the switch) the clock stops at zero ('ended') instead of announcing
 * next year's start. A device clock that is behind (closer to the next start than to the last end) still says "Starts".
 */
export const campaignClock = (campaign: PromoCampaign, now: number, current = false): CampaignClock => {
  const w = campaignWindow(campaign, now);

  if (!w.active) {
    return current && now - w.previousEnd < w.start - now ? { kind: 'ended' } : { kind: 'startsOn', date: w.start };
  }

  const ms = w.end - now;
  const days = Math.floor(ms / DAY_MS);

  if (days >= COUNTDOWN_DAYS) return { kind: 'bookBy', date: w.end };

  const time = `${pad2(Math.floor(ms / HOUR_MS) % 24)}:${pad2(Math.floor(ms / MINUTE_MS) % 60)}:${pad2(
    Math.floor(ms / 1000) % 60
  )}`;

  return { kind: 'endsIn', days, time };
};
