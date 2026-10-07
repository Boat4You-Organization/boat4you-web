/**
 * `<lastmod>` of a boat URL in the yacht sitemaps (audit 1.10.2026, N7), and
 * of a post in the blog sitemap (`wpGmtLastmod`).
 *
 * The source is the backend's `updatedAt` on `GET /public/yachts` (V9_71):
 * when the boat's own public record last changed — name, model, home base,
 * specs, main image, active / inquiry-only — in UTC, whole seconds, e.g.
 * "2026-10-02T06:12:41Z". Prices and availability do not move it. Null or
 * missing (no change recorded since 1.10.2026, or a backend without the
 * field) means no `<lastmod>`: never the request time, which moves on every
 * fetch and teaches Google to ignore the field, and never a guess.
 *
 * No imports: `yarn test:sitemap` runs this file with plain Node.
 */
const ISO_UTC = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(?:\.\d+)?Z$/;

/** A clock skew allowance: a stamp further ahead than this is not trusted. */
const MAX_AHEAD_MS = 24 * 60 * 60 * 1000;

/** The W3C datetime for `<lastmod>`, or null when there is no reliable one. */
export const sitemapLastmod = (updatedAt: unknown, now: number = Date.now()): string | null => {
  if (typeof updatedAt !== 'string' || !ISO_UTC.test(updatedAt)) return null;

  const ms = Date.parse(updatedAt);

  if (!Number.isFinite(ms) || ms > now + MAX_AHEAD_MS) return null;

  return new Date(Math.floor(ms / 1000) * 1000).toISOString().replace('.000Z', 'Z');
};

/** A WordPress GMT stamp (`dateGmt` / `modifiedGmt`): UTC without a zone, e.g. "2026-10-05T06:00:00". */
const WP_GMT = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}$/;

/**
 * The latest of a blog post's WordPress GMT stamps as ISO UTC ("…Z"), or
 * null when none is usable. Not `date` / `modified`: those are the site's
 * local time (CET/CEST), which read as UTC put `<lastmod>` 1–2 hours
 * ahead. Pass the result to `lastmodElement`, which drops a stamp from the
 * future.
 */
export const wpGmtLastmod = (...stamps: unknown[]): string | null =>
  stamps
    .filter((stamp): stamp is string => typeof stamp === 'string' && WP_GMT.test(stamp))
    .map(stamp => `${stamp}Z`)
    .sort()
    .pop() ?? null;

/** The `<lastmod>` line to put right after `<loc>` (sitemap 0.9 order), or ''. */
export const lastmodElement = (updatedAt: unknown, indent = '    '): string => {
  const lastmod = sitemapLastmod(updatedAt);

  return lastmod ? `\n${indent}<lastmod>${lastmod}</lastmod>` : '';
};
