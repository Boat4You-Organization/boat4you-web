import { routing } from '@/i18n/routing';
import { loadLiveModelPages } from '@/utils/server/modelCatalog';
import { manufacturerPath, yachtsIndexPath } from '@/utils/static/yachtModelKey';

// Not prerendered at build time (the catalogue build reads a ~14 s
// distribution aggregate and ~30 model fleets from cusma2); every read below
// goes through the Data Cache and the process-level catalogue memo instead.
export const dynamic = 'force-dynamic';

const XML_HEADERS = {
  'Content-Type': 'application/xml',
  'X-Content-Type-Options': 'nosniff',
};

/**
 * /yachts model layer: the index, the brand hubs (brands with ≥ 2 model
 * pages) and every model page, in all 9 locales — exactly the URLs those
 * routes render (the same catalogue and the same live-fleet re-check as
 * the pages, so a model under MIN_LANDING_FLEET is neither rendered nor
 * submitted). No <lastmod>: the pages change with the fleet, and a
 * request-time timestamp would only tell Google that everything changed.
 */
export async function GET() {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';

  try {
    const { models, brands } = await loadLiveModelPages();

    // No model above the fleet floor means the fleet queries failed, not that
    // the catalogue has no models: never answer an empty <urlset> (B08).
    if (!models.length) throw new Error('sitemap-models: no model page passed the fleet check');

    const liveBrands = brands.map(brand => manufacturerPath(brand.brandSlug));
    const paths = [yachtsIndexPath(), ...liveBrands, ...models.map(m => m.path)];

    const urls = paths
      .flatMap(path =>
        routing.locales.map(locale => {
          const prefix = locale === routing.defaultLocale ? '' : `/${locale}`;

          return `  <url>
    <loc>${baseUrl}${prefix}${path}</loc>
  </url>`;
        })
      )
      .join('\n');

    return new Response(
      `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls}
</urlset>`,
      { headers: XML_HEADERS }
    );
  } catch {
    // API down → 503 so GSC retries instead of reading an empty model layer.
    return new Response('Service Unavailable', { status: 503 });
  }
}
