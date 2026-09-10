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

/** Boats per /fleet page — keeps each page a reasonable crawl unit. */
export const FLEET_PAGE_SIZE = 300;

/**
 * Backend chunks behind one directory page. FLEET_PAGE_SIZE / API_PAGE_SIZE,
 * fetched together in a single round trip.
 */
const CHUNKS_PER_PAGE = FLEET_PAGE_SIZE / API_PAGE_SIZE;

/**
 * Hard ceiling on the page segment — guards against crafted /fleet/<huge>
 * URLs, each of which would otherwise mint its own cached 404. 100 × 300 =
 * 30,000 boats of headroom over today's ~12,100; raise it if the promoted
 * catalogue ever approaches that.
 */
export const MAX_FLEET_PAGES = 100;

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
  name: yacht.name ?? '',
  modelName: yacht.modelName ?? '',
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

export interface FleetPage {
  entries: FleetEntry[];
  pageNumber: number;
  totalPages: number;
  totalBoats: number;
}

/** `/fleet` for page 1, `/fleet/<n>` beyond — page 1 never gains a duplicate URL. */
export const fleetPagePath = (pageNumber: number): string => (pageNumber === 1 ? '/fleet' : `/fleet/${pageNumber}`);

/**
 * One directory page, fetched directly from the backend's own pagination.
 *
 * Deliberately NOT a walk of the whole catalogue. The promoted set is
 * ~12,100 boats = 122 backend chunks, and the backend gives roughly 2x on
 * 5-way concurrency, so assembling everything on demand took over three
 * minutes — nginx cuts a response at 60 s, so that page could only ever be
 * served by warming it by hand after every deploy. Mapping directory page N
 * onto backend chunks 3N-2 … 3N instead costs exactly CHUNKS_PER_PAGE
 * requests in one round trip, which is a couple of seconds cold and free
 * afterwards (the 6 h Data Cache behind `fetchFleetChunk` is shared by all
 * nine locales, because locale and currency are pinned there).
 *
 * The trade-off: ordering is the backend's, so a boat can drift between
 * directory pages as the catalogue changes, and grouping by base happens
 * within a page rather than globally. Neither matters for crawlability —
 * what matters is that every boat carries a real `<a>` and that the page
 * answers fast enough to be crawled at all.
 *
 * Returns null when the page is out of range (the route renders a 404).
 */
export async function getFleetPage(pageNumber: number): Promise<FleetPage | null> {
  if (!Number.isInteger(pageNumber) || pageNumber < 1 || pageNumber > MAX_FLEET_PAGES) return null;

  const firstChunk = (pageNumber - 1) * CHUNKS_PER_PAGE + 1;
  const chunkNumbers = Array.from({ length: CHUNKS_PER_PAGE }, (_, index) => firstChunk + index);

  const responses = await Promise.all(chunkNumbers.map(chunk => fetchFleetChunk(chunkParams(chunk))));

  const totalBoats = responses[0]?.page?.totalElements ?? 0;
  const totalPages = Math.max(1, Math.ceil(totalBoats / FLEET_PAGE_SIZE));

  if (pageNumber > totalPages) return null;

  const seen = new Set<string>();
  const entries: FleetEntry[] = [];

  responses.forEach(response => {
    (response.content || []).forEach(yacht => {
      if (!yacht?.slug || seen.has(yacht.slug)) return;

      seen.add(yacht.slug);
      entries.push(toEntry(yacht));
    });
  });

  // In range but empty means the backend is misreporting, not that the page
  // is genuinely blank. Rendering that as a 200 would put a linkless page —
  // a soft 404 on the one page whose entire job is links — into the ISR
  // cache for six hours. Throw instead: during revalidation Next keeps
  // serving the last good copy.
  if (entries.length === 0) {
    throw new Error(`Fleet page ${pageNumber} came back empty while in range — refusing to cache an empty directory.`);
  }

  entries.sort(
    (a, b) => a.base.localeCompare(b.base) || a.modelName.localeCompare(b.modelName) || a.name.localeCompare(b.name)
  );

  return { entries, pageNumber, totalPages, totalBoats };
}
