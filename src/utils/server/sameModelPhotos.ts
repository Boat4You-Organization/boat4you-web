import { cache } from 'react';

import { isPromotedCountry } from '@/config/promoted-countries.config';
import { YachtImage, YachtModel } from '@/models/yacht.model';
import { findModelForYacht, loadModelFleet } from '@/utils/server/modelCatalog';
import { isLayoutImage } from '@/utils/static/yachtLayout';
import { yachtPhotoName } from '@/utils/static/yachtPhotoName';

/** Another boat of the same model and its photos (loadSameModelPhotos). */
export interface SameModelPhotos {
  slug: string;
  /** The other boat as its photos name it ("Lagoon 43 Find Us"). */
  photoName: string;
  /** Its real photos, main image first, at most MAX_PHOTOS. */
  images: YachtImage[];
}

const MIN_PHOTOS = 4;
const MAX_PHOTOS = 8;
/** Fleet boats (search order) whose detail is read before giving up. */
const CANDIDATES = 4;
const DETAIL_REVALIDATE_SECONDS = 86400;

interface Detail {
  name?: string;
  modelName?: string;
  manufacturerName?: string;
  yachtImages?: YachtImage[];
}

const loadDetail = async (slug: string): Promise<Detail | null> => {
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_BOAT_WS_API_URL}/public/yachts/${encodeURIComponent(slug)}`, {
      next: { revalidate: DETAIL_REVALIDATE_SECONDS },
    });

    return res.ok ? ((await res.json()) as Detail) : null;
  } catch {
    return null;
  }
};

/**
 * Another boat of the same model with real photos, for a boat that has none
 * of its own — only a layout drawing, or nothing at all (owner 13.10.2026,
 * "where are the boat's photos?": the partner has not published any, e.g. a
 * 2026 build). The candidates are the model's fleet in search order
 * (modelCatalog.ts, cached half a day); the first with at least MIN_PHOTOS
 * photos wins, its main image first. Null when the model has no catalogue
 * page, no sibling with photos, or the boat is outside the promoted countries
 * the fleet covers — the page then shows exactly what it showed before.
 */
export const loadSameModelPhotos = cache(async (yacht: YachtModel): Promise<SameModelPhotos | null> => {
  if (!isPromotedCountry(yacht.location?.countryCode)) return null;

  const brand = yacht.manufacturerName?.trim() || (yacht.model ?? '').trim().split(/\s+/)[0];
  const model = await findModelForYacht(brand, yacht.model);

  if (!model) return null;

  const fleet = await loadModelFleet(model);
  const candidates = fleet.boats.filter(boat => boat.id !== yacht.id && boat.mainImageId > 0).slice(0, CANDIDATES);
  const details = await Promise.all(candidates.map(boat => loadDetail(boat.slug)));
  const photosOf = (detail: Detail | null): YachtImage[] =>
    (detail?.yachtImages ?? []).filter(image => !isLayoutImage(image));
  const index = details.findIndex(detail => photosOf(detail).length >= MIN_PHOTOS);

  if (index < 0) return null;

  const detail = details[index];
  const ordered = [...photosOf(detail)].sort(
    (a, b) => Number(b.mainImage) - Number(a.mainImage) || a.position - b.position
  );

  return {
    slug: candidates[index].slug,
    photoName: yachtPhotoName({
      manufacturerName: detail?.manufacturerName ?? yacht.manufacturerName,
      modelName: detail?.modelName ?? yacht.modelName,
      name: detail?.name ?? candidates[index].name,
    }),
    images: ordered.slice(0, MAX_PHOTOS),
  };
});
