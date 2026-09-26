import { cache } from 'react';

import 'server-only';

import { ManufacturerLookup, buildManufacturerLookup } from '@/utils/static/yachtBrand';

/** The manufacturer list changes with new catalogue rows only — a day. */
const REVALIDATE_SECONDS = 86400;

/**
 * The catalogue manufacturer names (for Product.brand, yachtBrand.ts), from
 * the Data Cache — the same list modelCatalog.ts reads. null when the API
 * does not answer: the JSON-LD then leaves `brand` out rather than guess.
 */
export const loadManufacturerLookup = cache(async (): Promise<ManufacturerLookup | null> => {
  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_BOAT_WS_API_URL}/public/catalogue/manufacturers?size=3000`,
      {
        next: { revalidate: REVALIDATE_SECONDS },
        headers: { 'Accept-Language': 'en', 'Content-Type': 'application/json' },
        signal: AbortSignal.timeout(10_000),
      }
    );

    if (!response.ok) return null;

    const body = (await response.json()) as { content?: Array<{ name?: string | null }> };

    return body.content?.length ? buildManufacturerLookup(body.content.map(m => m.name)) : null;
  } catch {
    return null;
  }
});
