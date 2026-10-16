import { YachtImage } from '@/models/yacht.model';
import { imageKind } from '@/utils/static/yachtLayout';

export interface GalleryAltWords {
  /** common.photoAlt: "{label} — photo {n}". */
  photo: (label: string, n: string) => string;
  /** common.layoutTitle: "Layout", the word the layout block is headed with. */
  layout: string;
}

/**
 * A gallery picture's alt text (the tiles and the lightbox). Every picture
 * carries the boat's label (owner, 16.10.2026: "SLIKE TREBAJU SVE BITI S
 * ALTERNATIV TEXTOM PLOVILA"), `label` being the boat as yachtPhotoName.ts
 * names it:
 *
 *   - the boat's own photo and a photo of its model (MODEL_SAMPLE):
 *     "Lagoon 42 Masterpiece — photo 3";
 *   - a marina photo: "Lagoon 42 Masterpiece — ACI Marina Split", its caption,
 *     else its credit, else the label alone (never an empty alt);
 *   - a layout drawing (a boat with no photo keeps it in the gallery):
 *     "Lagoon 42 Masterpiece — Layout", as the layout block names it.
 */
export const galleryPhotoAlt = (image: YachtImage, index: number, label: string, words: GalleryAltWords): string => {
  const kind = imageKind(image);

  if (kind === 'MARINA') return [label, image.caption?.trim() || image.credit?.trim()].filter(Boolean).join(' — ');

  if (kind === 'LAYOUT') return `${label} — ${words.layout}`;

  return words.photo(label, String(index + 1));
};
