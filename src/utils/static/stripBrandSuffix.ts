/**
 * RankMath usually returns a title that already ends with the brand
 * ("… | Boat4You"), and the blog page passes that title to Next as a RELATIVE
 * title — so the root layout's `title.template` appends the brand a second time
 * ("… | Boat4You | Boat4You"). Drop a trailing segment that is nothing but the
 * brand and keep passing a relative title, so the template adds it exactly once.
 *
 * The brand comes from the title template (one source of truth) and is compared
 * as a word SET, not byte-for-byte: RankMath's wording drifts from the
 * template's ("Catamaran Charter Croatia" vs "Catamaran Croatia Charter"), while
 * a real content segment ("Complete Guide", "Boka Bay & Budva") carries words
 * the brand doesn't have and survives.
 */
const toWordSet = (value: string) =>
  new Set(
    value
      .toLowerCase()
      .split(/[^a-z0-9]+/)
      .filter(Boolean)
  );

export const stripBrandSuffix = (title: string, titleTemplate: string): string => {
  const segments = title.split('|');

  if (segments.length < 2) {
    return title;
  }

  const brandWords = toWordSet(titleTemplate.replace('%s', ''));
  const lastWords = toWordSet(segments[segments.length - 1]);
  // A multi-word brand must not let a single shared word qualify: on a Croatia
  // site "Sailing Guide | Croatia" is a place, not the brand.
  const minWords = Math.min(2, brandWords.size);

  if (!brandWords.size || lastWords.size < minWords || ![...lastWords].every(word => brandWords.has(word))) {
    return title;
  }

  return segments.slice(0, -1).join('|').trim() || title;
};
