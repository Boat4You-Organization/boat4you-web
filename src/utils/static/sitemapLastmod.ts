/**
 * `<lastmod>` of a boat URL in the yacht sitemaps (audit 1.10.2026, N7).
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

/** The `<lastmod>` line to put right after `<loc>` (sitemap 0.9 order), or ''. */
export const lastmodElement = (updatedAt: unknown, indent = '    '): string => {
  const lastmod = sitemapLastmod(updatedAt);

  return lastmod ? `\n${indent}<lastmod>${lastmod}</lastmod>` : '';
};
