/**
 * Routes whose content exists in English only, served on the un-prefixed URL
 * to every visitor (audit 29.9.2026, R40): the blog posts. WordPress delivers
 * English bodies only, and the 26.9 QA rule SE2 says a locale copy of such a
 * page answers 308 to the English URL, never 200 with a German shell around
 * an English article. The blog index stays localised (its own chrome and hub
 * links), so only `/blog/<slug>` counts.
 *
 * Shared by the middleware (no locale detection on these paths — see
 * proxy.ts) and the blog post page (the 308 from a locale copy).
 */
const ENGLISH_ONLY_PATTERN = /^\/blog\/[^/]+\/?$/;

/** True for an un-prefixed path of an English-only page (`/blog/<slug>`). */
export const isEnglishOnlyPath = (pathname: string): boolean => ENGLISH_ONLY_PATTERN.test(pathname);
