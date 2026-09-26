import 'server-only';

import { routing } from '@/i18n/routing';
import { LandingEntry } from '@/utils/server/landingManifest';
import { buildSearchLandingPath } from '@/utils/static/searchLandingPath';

export const XML_HEADERS = {
  'Content-Type': 'application/xml',
  'X-Content-Type-Options': 'nosniff',
};

// XML-escape <loc> contents. Query-string URLs contain a literal `&`
// (the `destinations=…&boatTypes=…` separator), and `&` is reserved in
// XML — an unescaped one makes the whole sitemap unparseable (GSC
// "Sitemap can be read, but has errors → Parsing error"). Escape `&` first
// so we don't double-encode the entities we introduce.
export const escapeXml = (s: string): string =>
  s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&apos;');

/**
 * `<url>` rows for landing entries, one per locale that passes the gate.
 * No <lastmod>: the landings have no real per-URL modification date, and a
 * request-time stamp tells Google every URL changed on every fetch (it then
 * ignores the field site-wide). Per-page hreflang comes from the page head.
 * The <loc> uses the same builder as the /search canonical, byte for byte.
 */
export const landingUrlRows = (baseUrl: string, entries: LandingEntry[]): string =>
  entries
    .flatMap(entry =>
      routing.locales
        .filter(locale => entry.locales.includes(locale))
        .map(locale => {
          const prefix = locale === routing.defaultLocale ? '' : `/${locale}`;
          const loc = `${baseUrl}${prefix}${buildSearchLandingPath(entry.name, entry.boatType)}`;

          return `  <url>
    <loc>${escapeXml(loc)}</loc>
  </url>`;
        })
    )
    .join('\n');

export const urlset = (rows: string): string => `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${rows}
</urlset>`;
