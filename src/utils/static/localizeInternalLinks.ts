import { routing } from '@/i18n/routing';

/**
 * Locale-prefix the internal page links inside a block of HTML (the curated
 * landing texts), so a /de page links /de/how-we-work instead of the English
 * /how-we-work (audit 26.9.2026, B31: Googlebot, which sends no
 * Accept-Language, followed every such link from a German page to English).
 *
 * Only root-relative or own-origin links to routes that exist in every
 * locale are rewritten. Left alone: /search (the corpus search links are
 * mapped and prefixed by curatedSeoContent.rewriteSearchLinks), /blog/<post>
 * (the posts are English-only and every locale copy canonicalises to the
 * English URL — link the canonical), links that already carry a locale,
 * anchors, other origins, relative paths and files.
 */
const LOCALIZED_ROUTES = [
  '/about-us',
  '/how-we-work',
  '/faq',
  '/contact-us',
  '/fleet',
  '/yachts',
  '/itineraries',
  '/boat/',
  '/privacy-policy',
  '/terms-and-conditions',
  '/blog',
];

const NON_DEFAULT_LOCALES = routing.locales.filter(l => l !== routing.defaultLocale);
const OWN_ORIGIN = /^https?:\/\/(?:www\.)?boat4you\.com(?=\/|$)/i;

const localizePath = (path: string, locale: string): string | null => {
  const [pathname] = path.split(/[?#]/);

  if (!pathname.startsWith('/')) return null;

  // Already localised (/de/…, /de).
  if (NON_DEFAULT_LOCALES.some(l => pathname === `/${l}` || pathname.startsWith(`/${l}/`))) return null;

  if (pathname === '/') return `/${locale}${path.slice(1)}`;

  // Blog posts stay on their English canonical; the /blog index is localised.
  if (pathname.startsWith('/blog/')) return null;

  const known = LOCALIZED_ROUTES.some(route =>
    route.endsWith('/') ? pathname.startsWith(route) : pathname === route || pathname.startsWith(`${route}/`)
  );

  return known ? `/${locale}${path}` : null;
};

const HREF = /(<a\b[^>]*?\shref=")([^"]*)(")/gi;

export const localizeInternalLinks = (html: string, locale: string): string => {
  if (!html || locale === routing.defaultLocale || !NON_DEFAULT_LOCALES.includes(locale as never)) return html;

  return html.replace(HREF, (whole, open: string, href: string, close: string) => {
    const path = href.replace(OWN_ORIGIN, '') || '/';

    if (path === href && !href.startsWith('/')) return whole;

    const localized = localizePath(path, locale);

    return localized ? `${open}${localized}${close}` : whole;
  });
};
