import { canonicalManufacturer } from '@/utils/static/yachtModelKey';

/**
 * The builder brand of a yacht for Product.brand (JSON-LD), from data — never
 * guessed from the first word of the model name, which read "Sun" for "Sun
 * Odyssey 45", "Oceanis" for a Beneteau and "Sunsail" for a charter
 * operator's boat on 32 % of the landing products (audit 26.9.2026, B40).
 *
 * Sources, in order:
 *   1. the payload's own `manufacturerName` (boat detail; the list payload
 *      may carry it one day);
 *   2. the boat slug: the backend builds it as toSlug("<manufacturer>-<model>
 *      -<name>")-<id>, leaving the manufacturer out when the model already
 *      starts with it (SlugUtils.toSlugWithId) — so the slug part before the
 *      model is the manufacturer, looked up in the catalogue's manufacturer
 *      list (20/20 matched the detail payload in a live sample);
 *   3. a catalogue manufacturer the model name starts with ("Lagoon 42").
 * The result goes through canonicalManufacturer: one spelling per brand
 * ("Dufour Yachts" → "Dufour"), and null for placeholders and charter
 * operators (a charter company is never shown as a boat's brand).
 */

/** Same as the backend's SlugUtils.toSlug (ASCII letters and digits only). */
export const backendSlug = (value: string): string =>
  value
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')
    .trim()
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-');

export interface ManufacturerLookup {
  /** backendSlug(name) → catalogue name (first one wins). */
  bySlug: Map<string, string>;
  /** Catalogue names, longest first (prefix matching). */
  names: string[];
}

export const buildManufacturerLookup = (rawNames: Array<string | null | undefined>): ManufacturerLookup => {
  const names = Array.from(new Set(rawNames.map(n => (n ?? '').replace(/\s+/g, ' ').trim()).filter(Boolean))).sort(
    (a, b) => b.length - a.length
  );
  const bySlug = new Map<string, string>();

  names.forEach(name => {
    const slug = backendSlug(name);

    if (slug && !bySlug.has(slug)) bySlug.set(slug, name);
  });

  return { bySlug, names };
};

const manufacturerPrefixOf = (model: string, lookup: ManufacturerLookup): string | null => {
  const lower = model.toLowerCase();

  return lookup.names.find(name => lower === name.toLowerCase() || lower.startsWith(`${name.toLowerCase()} `)) ?? null;
};

/** Raw catalogue manufacturer of a boat (not yet canonicalised), or null. */
export const rawManufacturerOf = (
  boat: { slug?: string | null; model?: string | null; modelName?: string | null; manufacturerName?: string | null },
  lookup: ManufacturerLookup | null
): string | null => {
  const own = (boat.manufacturerName ?? '').trim();

  if (own) return own;

  if (!lookup) return null;

  const model = (boat.model || boat.modelName || '').replace(/\s+/g, ' ').trim();
  const modelSlug = model ? backendSlug(model) : '';
  const base = (boat.slug ?? '').replace(/-\d+$/, '');

  if (modelSlug && base) {
    // Model first in the slug → the model carries the manufacturer's name.
    if (base === modelSlug || base.startsWith(`${modelSlug}-`)) return manufacturerPrefixOf(model, lookup);

    const at = base.indexOf(`-${modelSlug}-`);
    const end = at < 0 && base.endsWith(`-${modelSlug}`) ? base.length - modelSlug.length - 1 : at;

    if (end > 0) {
      const hit = lookup.bySlug.get(base.slice(0, end));

      if (hit) return hit;
    }
  }

  return model ? manufacturerPrefixOf(model, lookup) : null;
};

/** Brand for Product.brand, or null (then the field is left out). */
export const yachtBrandName = (
  boat: { slug?: string | null; model?: string | null; modelName?: string | null; manufacturerName?: string | null },
  lookup: ManufacturerLookup | null
): string | null => canonicalManufacturer(rawManufacturerOf(boat, lookup));
