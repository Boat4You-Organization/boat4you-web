import { YachtSearchParams } from '@/config/form-models.config';
import { PROMOTED_COUNTRY_CODES } from '@/config/promoted-countries.config';
import { YachtModelShortInfo } from '@/models/yacht.model';
import { fetchFleetChunk } from '@/services/yacht.service';

/**
 * Same 12-country scope the yacht sitemap uses — the directory must mirror
 * it exactly, never widen it. Boats outside the promoted set are reachable
 * by deep link but are deliberately not promoted or indexed.
 */
const PROMOTED = Array.from(PROMOTED_COUNTRY_CODES);

/** Backend `/public/yachts` silently hard-caps a response at 100 entries. */
const API_PAGE_SIZE = 100;

/**
 * Safety net on the backend walk: 200 × 100 = 20,000 boats. The promoted
 * catalogue is ~12,100 (122 chunks), so this only ever trips if the API
 * starts reporting a nonsense `totalElements`.
 */
const MAX_API_PAGES = 200;

/**
 * Chunks fetched concurrently.
 *
 * 122 sequential fetches take ~80 s and nginx cuts the response at 60 s
 * (that 504 already happened on Europe Yachts); batches of 5 bring the walk
 * to roughly 20 s. Do NOT raise this — uncontrolled fan-out at this
 * catalogue size has exhausted the backend Hikari pool before.
 */
const FLEET_BATCH_SIZE = 5;

/** Boats per /fleet page — keeps each page a reasonable crawl unit. */
export const FLEET_PAGE_SIZE = 300;

/** Hard ceiling on the page segment — guards against crafted /fleet/<huge> URLs. */
export const MAX_FLEET_PAGES = 500;

export interface FleetEntry {
  slug: string;
  /** Vessel name, e.g. "LEJLA". */
  name: string;
  /** Manufacturer model, e.g. "Sun Odyssey 45". */
  modelName: string;
  /** Home base / marina the boat sails from. */
  base: string;
  cabins?: number | null;
  maxPersons?: number | null;
  buildYear?: number | null;
}

const toEntry = (yacht: YachtModelShortInfo): FleetEntry => ({
  slug: yacht.slug,
  name: yacht.name,
  modelName: yacht.modelName,
  base: yacht.location?.name ?? '',
  cabins: yacht.cabins,
  maxPersons: yacht.maxPersons,
  buildYear: yacht.buildYear,
});

const chunkParams = (page: number): YachtSearchParams => ({
  locations: [],
  page,
  size: API_PAGE_SIZE,
  countryCodes: PROMOTED,
});

/**
 * Every promoted boat, deduplicated by slug and sorted by base → model →
 * name.
 *
 * The whole walk runs at most once per 6 h (the Data Cache window behind
 * `fetchFleetChunk`, shared by all 9 locales), and ISR serves the previous
 * page while it reruns, so no visitor ever waits for it.
 */
export async function getFleet(): Promise<FleetEntry[]> {
  const seen = new Set<string>();
  const fleet: FleetEntry[] = [];

  const collect = (content?: YachtModelShortInfo[]) => {
    (content || []).forEach(yacht => {
      if (!yacht?.slug || seen.has(yacht.slug)) return;

      seen.add(yacht.slug);
      fleet.push(toEntry(yacht));
    });
  };

  // Page 1 first, on its own: it is the only way to learn `totalElements`,
  // and the batch loop below needs that number to know where to stop.
  const first = await fetchFleetChunk(chunkParams(1));
  const total = first.page?.totalElements ?? first.content?.length ?? 0;
  const totalChunks = Math.min(Math.ceil(total / API_PAGE_SIZE), MAX_API_PAGES);

  collect(first.content);

  let nextChunk = 2;

  while (nextChunk <= totalChunks) {
    const batch: number[] = [];

    while (batch.length < FLEET_BATCH_SIZE && nextChunk + batch.length <= totalChunks) {
      batch.push(nextChunk + batch.length);
    }

    // eslint-disable-next-line no-await-in-loop
    const responses = await Promise.all(batch.map(chunk => fetchFleetChunk(chunkParams(chunk))));

    responses.forEach(response => collect(response.content));

    nextChunk += batch.length;
  }

  // An empty walk rendered as HTTP 200 is a soft-404 on the one page whose
  // entire job is links — and it would sit in the ISR cache for the full
  // revalidate window. Throw instead: during revalidation Next keeps
  // serving the last good page.
  if (fleet.length === 0) {
    throw new Error('Fleet walk returned no boats — refusing to render an empty directory.');
  }

  return fleet.sort(
    (a, b) => a.base.localeCompare(b.base) || a.modelName.localeCompare(b.modelName) || a.name.localeCompare(b.name)
  );
}

/** `/fleet` for page 1, `/fleet/<n>` beyond — page 1 never gains a duplicate URL. */
export const fleetPagePath = (pageNumber: number): string => (pageNumber === 1 ? '/fleet' : `/fleet/${pageNumber}`);

export interface FleetPage {
  entries: FleetEntry[];
  pageNumber: number;
  totalPages: number;
  totalBoats: number;
}

/** Slice the fleet for one directory page. 1-based; out of range → null. */
export function sliceFleet(fleet: FleetEntry[], pageNumber: number): FleetPage | null {
  const totalPages = Math.max(1, Math.ceil(fleet.length / FLEET_PAGE_SIZE));

  if (pageNumber < 1 || pageNumber > totalPages) return null;

  return {
    entries: fleet.slice((pageNumber - 1) * FLEET_PAGE_SIZE, pageNumber * FLEET_PAGE_SIZE),
    pageNumber,
    totalPages,
    totalBoats: fleet.length,
  };
}
