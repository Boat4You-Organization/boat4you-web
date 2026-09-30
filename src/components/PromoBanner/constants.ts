import type { PromoBoat, PromoCharacter } from '@/config/campaigns.config';

/** id of the deals list heading on /deals/<slug>; the landing hero's CTA scrolls there. Plain module (not the
 *  'use client' component) so the server page reads the string itself, not a client reference. */
export const DEALS_LIST_ID = 'deals-list';

/** Intrinsic size of the public/promo art (width, height). Rendered as the img width/height attributes, so the
 *  box has the right aspect ratio before the file arrives. Poster and animated loop share the size. */
export const PROMO_ART_SIZE: Record<PromoCharacter | PromoBoat, readonly [number, number]> = {
  september: [384, 384],
  early: [384, 384],
  bf: [420, 420],
  xmas: [420, 420],
  ny: [420, 420],
  flash: [420, 420],
  bday: [384, 384],
  june: [420, 420],
  july: [384, 384],
  hot: [420, 420],
  last: [420, 420],
  boat_september: [281, 300],
  boat_early: [303, 300],
  boat_last: [440, 136],
  boat_xmas: [303, 300],
};

/** Static first frame (SSR, reduced motion, data saver) or the animated loop. The phone CSS matches the
 *  character by path (img[src*='/bday']), so both files keep the `/promo/<name>` prefix. */
export const promoArtSrc = (name: PromoCharacter | PromoBoat, animated: boolean) =>
  animated ? `/promo/${name}.webp` : `/promo/${name}_poster.webp`;

/** Advance widths of the Raleway ExtraBold capitals A–Z (public/fonts/Raleway, 1/1000 em); accented capitals fold onto
 *  their base letter (Ü = U, Č = C). Kerning only narrows a word, so the estimate errs on the wide side. */
const CAP_WIDTHS = [
  670, 684, 688, 716, 599, 569, 732, 747, 300, 494, 679, 585, 860, 759, 760, 623, 759, 670, 615, 621, 747, 674, 1055,
  651, 663, 625,
];
const MARK_WIDTHS: Record<string, number> = { ',': 243, '.': 239, "'": 250, '-': 416, '!': 333, '&': 729 };
/** Anything else (Đ, Ł, digits, a lower-case letter): as wide as an O, again erring on the wide side. */
const OTHER_WIDTH = 760;
/** The title's letter-spacing (-0.01em), applied after every character. */
const TITLE_TRACKING = -10;

const charWidth = (ch: string) => {
  const base = ch.normalize('NFD').charAt(0);
  const cap = base.charCodeAt(0) - 65;

  return (cap >= 0 && cap < 26 ? CAP_WIDTHS[cap] : (MARK_WIDTHS[base] ?? OTHER_WIDTH)) + TITLE_TRACKING;
};

/** Width of the title's longest word in em, rounded up: the banner's --tw, which steps a translated title with a
 *  long single word (nl VROEGBOEKKORTING, de GEBURTSTAGSWOCHE) down to its text column (PromoBanner.module.scss). */
export const titleLongestWordEm = (title: string) =>
  Math.ceil(
    Math.max(0, ...title.split(/\s+/).map(word => [...word].reduce((sum, ch) => sum + charWidth(ch), 0))) / 10
  ) / 100;
