import { PROMOTED_COUNTRY_CODES } from '@/config/promoted-countries.config';
import { routing } from '@/i18n/routing';
import { CountryCountModel } from '@/models/locations.model';
import { VesselType } from '@/models/yacht.model';

export const revalidate = 3600;

const XML_HEADERS = {
  'Content-Type': 'application/xml',
  'X-Content-Type-Options': 'nosniff',
};

// Per-vessel-type × per-country SEO landings — Google rewards specific
// "catamaran charter Croatia" / "gulet rental Greece" style intent. Both
// `destinations` and `boatTypes` are canonical-aware in /search
// generateMetadata so each URL self-canonicalizes and stays index-eligible.
//
// Strategy:
//   * 12 vessel types × 12 promoted countries × 9 locales
//     ≈ 1,300 URLs that all resolve to a real, populated result set.
//   * No global "boatTypes only" URLs — those would surface yachts from
//     non-promoted countries (Norway, Australia, …) and dilute the
//     promoted-country positioning. Country-anchored URLs always honour
//     the whitelist.
const VESSEL_TYPES = Object.values(VesselType);

const EMPTY_SITEMAP = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
</urlset>`;

export async function GET() {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';
  const apiBase = process.env.NEXT_PUBLIC_BOAT_WS_API_URL;
  const lastmod = new Date().toISOString();

  // Pull country names from /public/countries-count. We only emit URLs
  // for countries that (a) sit in the promoted whitelist AND (b) actually
  // exist in the catalogue today. Falls back to the empty sitemap on
  // backend hiccup so the build doesn't break.
  let promotedCountryNames: string[] = [];

  try {
    const res = await fetch(`${apiBase}/public/countries-count`, { next: { revalidate: 3600 } });

    if (res.ok) {
      const json: CountryCountModel[] = await res.json();

      promotedCountryNames = (Array.isArray(json) ? json : [])
        .filter(c => c.countryCode && PROMOTED_COUNTRY_CODES.has(c.countryCode))
        .map(c => c.name)
        .filter((n): n is string => Boolean(n));
    }
  } catch {
    return new Response(EMPTY_SITEMAP, { headers: XML_HEADERS });
  }

  if (promotedCountryNames.length === 0) {
    return new Response(EMPTY_SITEMAP, { headers: XML_HEADERS });
  }

  const urls = VESSEL_TYPES.flatMap(type =>
    promotedCountryNames.flatMap(country =>
      routing.locales.map(locale => {
        const prefix = locale === routing.defaultLocale ? '' : `/${locale}`;
        const slug = country.toLowerCase();
        const loc = `${baseUrl}${prefix}/search?destinations=${encodeURIComponent(slug)}&boatTypes=${type}`;

        return `  <url>
    <loc>${loc}</loc>
    <lastmod>${lastmod}</lastmod>
  </url>`;
      })
    )
  ).join('\n');

  const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls}
</urlset>`;

  return new Response(sitemap, { headers: XML_HEADERS });
}
