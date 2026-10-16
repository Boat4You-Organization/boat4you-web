import type { YachtImage } from '@/models/yacht.model';

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

/**
 * What a picture in `yachtImages` is (YachtImageDto `kind`, backend 16.10.2026):
 *
 *   - PARTNER: the agency's own photo of this boat (no `kind`: every image
 *     until the backend ships it);
 *   - LAYOUT: its deck plan (`layout: true` wins over any `kind`);
 *   - MODEL_SAMPLE: a photo of another boat of the same model, only on a boat
 *     without a photo of its own (positions 1000+);
 *   - MARINA: the departure marina (positions 2000+, never main), with
 *     `caption` (the marina), `credit` ("Foto: …") and `sourceUrl`.
 */
export type YachtImageKind = 'PARTNER' | 'LAYOUT' | 'MODEL_SAMPLE' | 'MARINA';

type KindFields = Pick<YachtImage, 'layout' | 'kind' | 'type'>;

type GalleryFields = Pick<YachtImage, 'layout' | 'kind' | 'type' | 'position' | 'mainImage'>;

const hasTag = (image: KindFields, tag: string): boolean =>
  [image.kind, image.type].some(value => typeof value === 'string' && value.trim().toUpperCase() === tag);

export const isLayoutImage = (image: KindFields | null | undefined): boolean => {
  if (!image) return false;

  if (image.layout === true) return true;

  return hasTag(image, 'LAYOUT');
};

export const imageKind = (image: KindFields): YachtImageKind => {
  if (isLayoutImage(image)) return 'LAYOUT';

  if (hasTag(image, 'MARINA')) return 'MARINA';

  if (hasTag(image, 'MODEL_SAMPLE')) return 'MODEL_SAMPLE';

  return 'PARTNER';
};

export const isMarinaImage = (image: KindFields | null | undefined): boolean =>
  !!image && imageKind(image) === 'MARINA';

export const isModelSampleImage = (image: KindFields | null | undefined): boolean =>
  !!image && imageKind(image) === 'MODEL_SAMPLE';

/** A photo of the boat or of its model: the only pictures that may be main. */
const canBeMain = (image: KindFields): boolean => {
  const kind = imageKind(image);

  return kind === 'PARTNER' || kind === 'MODEL_SAMPLE';
};

// The boat's own pictures first, then the model's, the marina last. A layout
// reaches the gallery only when the boat has nothing else of its own or its
// model (see splitLayoutImages), so it ranks with the boat's own.
const GALLERY_RANK: Record<YachtImageKind, number> = { PARTNER: 0, LAYOUT: 0, MODEL_SAMPLE: 1, MARINA: 2 };

const byGalleryOrder = (a: GalleryFields, b: GalleryFields): number =>
  GALLERY_RANK[imageKind(a)] - GALLERY_RANK[imageKind(b)] ||
  Number(!!b.mainImage) - Number(!!a.mainImage) ||
  a.position - b.position;

/**
 * The gallery's order: the boat's own photos (main first, then position),
 * then the model's, then the marina's. Ties keep the partner's order. A copy;
 * the list is not changed.
 */
export const sortGalleryImages = <T extends GalleryFields>(images: T[] | null | undefined): T[] =>
  [...(images ?? [])].sort(byGalleryOrder);

/**
 * The boat's picture wherever one stands for it (gallery hero, og:image,
 * Product image, share card, wizard, PDF cover): its own main photo, else its
 * lowest-position photo, else the same from the model's. Never a marina photo
 * or a layout drawing; none of either kind: undefined.
 */
export const heroImage = <T extends GalleryFields>(images: T[] | null | undefined): T | undefined =>
  sortGalleryImages(images).find(canBeMain);

/** "All N photos": the boat's (and its model's) pictures, not the marina's. */
export const countGalleryPhotos = (images: KindFields[] | null | undefined): number =>
  (images ?? []).filter(image => !isMarinaImage(image)).length;

export interface MarinaCaption {
  /** The marina's name. */
  caption: string;
  /** "Foto: <marina>" as the API sends it. */
  credit: string;
  /** The page the photo comes from, http(s) only; null: the credit is plain text. */
  href: string | null;
}

const text = (value: unknown): string => (typeof value === 'string' ? value.trim() : '');

const httpUrl = (value: unknown): string | null => {
  const raw = text(value);

  if (!raw) return null;

  try {
    const url = new URL(raw);

    return url.protocol === 'https:' || url.protocol === 'http:' ? url.href : null;
  } catch {
    return null;
  }
};

/**
 * The line under a marina photo: "<caption> · <credit>", the credit linking
 * to the source page (rel="nofollow noopener"). Null for any other kind or
 * when the API sent neither text.
 */
export const marinaCaption = (
  image: (KindFields & Pick<YachtImage, 'caption' | 'credit' | 'sourceUrl'>) | null | undefined
): MarinaCaption | null => {
  if (!isMarinaImage(image)) return null;

  const caption = text(image?.caption);
  const credit = text(image?.credit);

  if (!caption && !credit) return null;

  return { caption, credit, href: credit ? httpUrl(image?.sourceUrl) : null };
};

/** `main` (or none) is the only main image; the list itself when nothing changes. */
const withMainOn = <T extends Pick<YachtImage, 'mainImage'>>(images: T[], main: T | undefined): T[] =>
  images.some(image => !!image.mainImage !== (image === main))
    ? images.map(image => (!!image.mainImage === (image === main) ? image : { ...image, mainImage: image === main }))
    : images;

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
 *   - main is always the hero (heroImage): the boat's own main photo, else
 *     its first photo in gallery order, else the model's; a layout or a
 *     marina photo marked main hands "main" over, so the hero, the share
 *     card, the favourite, the wizard and the PDF cover show a photo;
 *   - no photo of the boat or its model but a layout: `photos` keeps the
 *     drawings (and any marina photo) — the gallery shows the drawing rather
 *     than nothing — with none of them main; `layouts` lists them too.
 *
 * The API objects are not changed; an image whose main flag moves is a copy.
 */
export const splitLayoutImages = <T extends GalleryFields>(images: T[] | null | undefined): YachtImageSplit<T> => {
  const all = images ?? [];
  const layouts = all.filter(isLayoutImage).sort((a, b) => a.position - b.position);
  const photos = layouts.length === 0 ? all : all.filter(image => !isLayoutImage(image));
  const hero = heroImage(photos);

  if (!hero && layouts.length > 0) return { photos: withMainOn(all, undefined), layouts };

  return { photos: withMainOn(photos, hero), layouts };
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
 * share, favourite, inquiry, booking, PDF): its photos only (main on the hero),
 * and the layouts beside it. Without a layout, or with no photo of the boat or
 * its model, no layout block is shown; nothing to change: the yacht as it came.
 */
export const withLayoutImagesApart = <Y extends { yachtImages: YachtImage[] }>(
  yacht: Y
): { yacht: Y; layoutImages: YachtImage[] } => {
  if (!yacht.yachtImages) return { yacht, layoutImages: [] };

  const { photos, layouts } = splitLayoutImages(yacht.yachtImages);
  const client = photos === yacht.yachtImages ? yacht : { ...yacht, yachtImages: photos };

  // No photo of the boat or its model: the gallery already shows the drawing
  // (the split keeps it there rather than showing nothing), so the block above
  // Amenities would repeat the one image of the boat (owner 13.10.2026) — no block.
  if (layouts.length === 0 || photos.some(isLayoutImage)) return { yacht: client, layoutImages: [] };

  return { yacht: client, layoutImages: layouts };
};
