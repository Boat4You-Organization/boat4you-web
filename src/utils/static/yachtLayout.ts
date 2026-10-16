import type { YachtImage } from '@/models/yacht.model';

type KindTags = Pick<YachtImage, 'layout' | 'kind' | 'type'>;

type GalleryFields = KindTags & Pick<YachtImage, 'position' | 'mainImage'>;

/** The marina photo's text fields (YachtImageDto, backend 16.10.2026); absent on every other picture. */
interface PhotoCreditFields {
  caption?: string | null;
  credit?: string | null;
  sourceUrl?: string | null;
}

const hasTag = (image: KindTags, tag: string): boolean =>
  [image.kind, image.type].some(value => typeof value === 'string' && value.trim().toUpperCase() === tag);

/**
 * The boat's layout drawing (deck plan) apart from its photos (owner,
 * 9.10.2026: "moram pretraživat slike da nađem layout plovila"). The boat page
 * shows the layout on its own above Amenities and takes it out of the photo
 * gallery, the hero, the lightbox and the photo count; the PDF gives it its
 * own page. Most partner boats carry one (10,685 of 13,035 active on
 * 9.10.2026), some two or three (a bunk-bed variant).
 *
 * The backend flags the image (`layout: true`). The field name is not final,
 * so isLayoutImage is the only place that reads it: `layout === true`, or
 * `kind` / `type` "LAYOUT" in any case. No flag on any image (every boat until
 * the backend ships it) leaves the page exactly as before.
 */
export const isLayoutImage = (image: KindTags | null | undefined): boolean => {
  if (!image) return false;

  if (image.layout === true) return true;

  return hasTag(image, 'LAYOUT');
};

/**
 * What a picture in `yachtImages` is (YachtImageDto.kind, backend 16.10.2026):
 *
 *   - PARTNER: the boat's own photo, as the partner sends it — every picture
 *     without a kind (all of them until the backend ships it), and any kind
 *     this list does not know;
 *   - LAYOUT: the partner's layout drawing (isLayoutImage);
 *   - MODEL_SAMPLE: a photo of another boat of the same model, for a boat
 *     without a photo of its own (owner 16.10.2026); positions 1000+, the
 *     first one main;
 *   - MARINA: a photo of the departure marina, with its caption (the marina),
 *     credit ("Foto: …") and source page; positions 2000+, never main.
 */
export type YachtImageKind = 'PARTNER' | 'LAYOUT' | 'MODEL_SAMPLE' | 'MARINA';

export const imageKind = (image: KindTags): YachtImageKind => {
  if (isLayoutImage(image)) return 'LAYOUT';

  if (hasTag(image, 'MARINA')) return 'MARINA';

  if (hasTag(image, 'MODEL_SAMPLE')) return 'MODEL_SAMPLE';

  return 'PARTNER';
};

export const isMarinaImage = (image: KindTags | null | undefined): boolean =>
  image ? imageKind(image) === 'MARINA' : false;

export const isModelSampleImage = (image: KindTags | null | undefined): boolean =>
  image ? imageKind(image) === 'MODEL_SAMPLE' : false;

/**
 * A photo of the boat: its own, or one of its model. The only pictures that
 * may be the hero, og:image, the Product image, the share card, the
 * favourite and the booking picture — never a layout, never a marina photo.
 */
export const isBoatPhoto = (image: KindTags | null | undefined): boolean => {
  if (!image) return false;

  const kind = imageKind(image);

  return kind === 'PARTNER' || kind === 'MODEL_SAMPLE';
};

// The boat's own photos, its model's, a layout drawing kept with the photos
// (a boat with nothing else), the marina's last.
const GALLERY_RANK: Record<YachtImageKind, number> = { PARTNER: 0, MODEL_SAMPLE: 1, LAYOUT: 2, MARINA: 3 };

/** Gallery order: by kind (GALLERY_RANK), then the main image first, then by position. */
export const compareGalleryImages = (a: GalleryFields, b: GalleryFields): number => {
  const byKind = GALLERY_RANK[imageKind(a)] - GALLERY_RANK[imageKind(b)];

  if (byKind !== 0) return byKind;

  if (Boolean(a.mainImage) !== Boolean(b.mainImage)) return a.mainImage ? -1 : 1;

  return a.position - b.position;
};

/**
 * The gallery's pictures in its order (compareGalleryImages; ties keep the
 * partner's order). A boat's pictures without a kind come out as the gallery
 * has always sorted them (the main image first, then by position). A marina
 * photo never leads the gallery, whose first picture is the boat's hero: a
 * boat with nothing but marina photos shows none, like a boat without a
 * picture.
 */
export const galleryImages = <T extends GalleryFields>(images: T[] | null | undefined): T[] => {
  const sorted = [...(images ?? [])].sort(compareGalleryImages);

  return sorted.length > 0 && isMarinaImage(sorted[0]) ? [] : sorted;
};

/**
 * The boat's hero: its first photo in gallery order — its own (the main image
 * first, then by position), else its model's. Never a layout or a marina
 * photo; undefined when the boat has no photo (og:image, the Product image,
 * the share card, the favourite and the booking then use their fallback).
 */
export const yachtHeroImage = <T extends GalleryFields>(images: T[] | null | undefined): T | undefined =>
  galleryImages((images ?? []).filter(isBoatPhoto))[0];

/** The pictures without the marina photos: the PDF brochure's photos and its "all N photos". */
export const withoutMarinaImages = <T extends KindTags>(images: T[] | null | undefined): T[] =>
  (images ?? []).filter(image => !isMarinaImage(image));

export interface MarinaPhotoCredit {
  /** The marina ("ACI Marina Split"): the caption, and the photo's alt text. */
  caption: string;
  /** As the API sends it ("Foto: ACI Marina Split"). */
  credit: string;
  /** The page the photo comes from (the credit's link); null unless an http(s) URL. */
  href: string | null;
}

const httpUrl = (value: string | null | undefined): string | null => {
  if (typeof value !== 'string' || value.trim() === '') return null;

  try {
    const url = new URL(value.trim());

    return url.protocol === 'https:' || url.protocol === 'http:' ? url.href : null;
  } catch {
    return null;
  }
};

/**
 * A marina photo's caption line, "<caption> · <credit>" with the credit
 * linking to its source (rel="nofollow noopener", new tab); null for any other
 * picture, or a marina photo with neither text.
 */
export const marinaPhotoCredit = (
  image: (KindTags & PhotoCreditFields) | null | undefined
): MarinaPhotoCredit | null => {
  if (!image || !isMarinaImage(image)) return null;

  const caption = image.caption?.trim() ?? '';
  const credit = image.credit?.trim() ?? '';

  if (!caption && !credit) return null;

  return { caption, credit, href: credit ? httpUrl(image.sourceUrl) : null };
};

export interface YachtImageSplit<T> {
  /** What the gallery, the hero and the photo count show. */
  photos: T[];
  /** The layout drawings, in the partner's order (position). */
  layouts: T[];
}

/**
 * A boat's images split into photos and layout drawings.
 *
 *   - no layout: `photos` is the list as it came, `layouts` empty;
 *   - the main image is not a photo of the boat (a layout, a marina photo):
 *     the hero (yachtHeroImage: the first photo in gallery order) becomes the
 *     main image, so the hero, the share card, the favourite and the PDF cover
 *     show a photo; a marina photo is never main;
 *   - no photo of the boat (its own or its model's), only layouts: `photos`
 *     keeps them all (the hero shows the layout as before rather than
 *     nothing), the marina photos after them; `layouts` lists them too.
 */
export const splitLayoutImages = <T extends GalleryFields>(images: T[] | null | undefined): YachtImageSplit<T> => {
  const all = images ?? [];
  const layouts = all.filter(isLayoutImage).sort((a, b) => a.position - b.position);
  const hero = yachtHeroImage(all);
  const photos = layouts.length > 0 && hero ? all.filter(image => !isLayoutImage(image)) : all;
  const heroIsMain = photos.some(image => image.mainImage && isBoatPhoto(image));
  const promote = hero && !heroIsMain && all.some(image => image.mainImage) ? hero : undefined;
  const marinaMain = photos.some(image => image.mainImage && isMarinaImage(image));

  if (!promote && !marinaMain) return { photos, layouts };

  return {
    photos: photos.map(image => {
      if (image === promote) return { ...image, mainImage: true };

      return image.mainImage && isMarinaImage(image) ? { ...image, mainImage: false } : image;
    }),
    layouts,
  };
};

/**
 * The layouts as the block hands them to the lightbox: none marked main. The
 * lightbox puts the main image first, then sorts by position; a layout that is
 * also the boat's main image would jump ahead of the block's order, and a
 * click on one drawing would open another. A list without a main layout comes
 * back as it is.
 */
export const withoutMainImage = <T extends Pick<YachtImage, 'mainImage'>>(images: T[]): T[] =>
  images.some(image => image.mainImage)
    ? images.map(image => (image.mainImage ? { ...image, mainImage: false } : image))
    : images;

/**
 * The yacht the boat page's client components get (gallery, hero, lightbox,
 * share, favourite, inquiry, booking, PDF): its photos only, and the layouts
 * beside it. Without a layout, or with nothing but layouts, the yacht is
 * returned as it came (unless a marina photo came marked main) and no layout
 * block is shown.
 */
export const withLayoutImagesApart = <Y extends { yachtImages: YachtImage[] }>(
  yacht: Y
): { yacht: Y; layoutImages: YachtImage[] } => {
  const { photos, layouts } = splitLayoutImages(yacht.yachtImages);

  return {
    yacht: photos === yacht.yachtImages ? yacht : { ...yacht, yachtImages: photos },
    // Only layouts, no photo of the boat: the gallery already shows the
    // drawing (the split keeps it there rather than showing nothing), so the
    // block above Amenities would repeat the one image the boat has (owner
    // 13.10.2026) — no block.
    layoutImages: photos.some(isLayoutImage) ? [] : layouts,
  };
};
