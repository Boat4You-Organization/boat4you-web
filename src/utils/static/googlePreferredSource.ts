/**
 * Google Search "preferred source" deeplink, linked from the footer on every
 * page. A signed-in reader who marks boat4you as a preferred source sees our
 * pages ranked higher in their own Top Stories / AI Mode results. Google's
 * publisher docs prescribe a plain link to
 * `https://www.google.com/preferences/source?q=<domain>` at domain level, no
 * script involved — so this is a build-time constant. The domain is the
 * hostname of NEXT_PUBLIC_BASE_URL (inlined at build) minus "www.", with a
 * per-site fallback so the link is never empty. Copy-portable: a sister site
 * changes only FALLBACK_DOMAIN.
 * https://developers.google.com/search/docs/appearance/preferred-sources
 */
const FALLBACK_DOMAIN = 'boat4you.com';

const preferredSourceDomain = (): string => {
  try {
    return new URL(process.env.NEXT_PUBLIC_BASE_URL ?? '').hostname.replace(/^www\./, '') || FALLBACK_DOMAIN;
  } catch {
    return FALLBACK_DOMAIN;
  }
};

export const GOOGLE_PREFERRED_SOURCE_URL = `https://www.google.com/preferences/source?q=${preferredSourceDomain()}`;
