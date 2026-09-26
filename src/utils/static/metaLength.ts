/**
 * Snippet-length guards for <title> and meta description (audit 26.9.2026,
 * B42: 1,348 of 1,798 boat titles over 70 characters, 963 boat and 273 model
 * descriptions over 160 — Google cut them mid-word in the SERP).
 */

/** Longest title that still shows whole in a desktop SERP. */
export const TITLE_MAX = 70;

/** " | Boat4You" — the layout's title template suffix in every locale. */
export const BRAND_SUFFIX_LENGTH = ' | Boat4You'.length;

/** Longest meta description that shows whole. */
export const DESCRIPTION_MAX = 160;

/** Whether a page title still fits with the " | Boat4You" suffix appended. */
export const fitsWithBrandSuffix = (title: string): boolean => title.length + BRAND_SUFFIX_LENGTH <= TITLE_MAX;

/** Cut at a word boundary to at most `max` characters, ending in "…". */
export const cutAtWord = (text: string, max: number): string => {
  if (text.length <= max) return text;

  const cut = text.slice(0, max - 1);
  const space = cut.lastIndexOf(' ');
  const head = space > max * 0.6 ? cut.slice(0, space) : cut;

  return `${head.replace(/[\s,;:–—-]+$/, '')}…`;
};

/**
 * A meta description of at most `max` characters: trailing sentences go
 * first (the "Book directly on Boat4You." call to action is always last, the
 * facts come first), then a word-boundary cut. A sentence ends at . ! or ?
 * followed by a space, so "1.345 €" and "4.6" stay whole.
 */
export const fitDescription = (text: string, max: number = DESCRIPTION_MAX): string => {
  const clean = (text ?? '').replace(/\s+/g, ' ').trim();

  if (clean.length <= max) return clean;

  const sentences = clean.match(/.+?(?:[.!?](?=\s|$)|$)/g)?.map(s => s.trim()) ?? [clean];

  while (sentences.length > 1 && sentences.join(' ').length > max) sentences.pop();

  return cutAtWord(sentences.join(' '), max);
};
