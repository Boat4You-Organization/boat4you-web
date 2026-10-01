import 'server-only';

import { PROMOTED_COUNTRY_CODES } from '@/config/promoted-countries.config';
import { Currency } from '@/models/user.model';
import { YachtModelShortInfo } from '@/models/yacht.model';
import { fetchYachts } from '@/services/yacht.service';

/**
 * Yacht sitemap shards by fixed id range (audit B03, again on 1.10.2026 F7):
 * shard k lists the promoted-catalogue boats with id in [k × 1000, (k + 1) × 1000),
 * read in id order (`sortBy=id&idFrom&idTo`, backend YachtController). Which
 * shard a boat sits in depends on its id alone. The shards used to be pages
 * of the live "Recommended" order: each one is its own hourly ISR entry
 * rendered at a different moment, so a price change moved boats across a
 * page boundary and the sitemap listed some twice and others never.
 *
 * 1000 ids, not 100: the ids have gaps (removed boats), and on 1.10.2026 20
 * of the 202 hundred-id ranges were empty — 20 child sitemaps answering 404
 * in the index. No thousand-id range was (21 shards, at most 768 boats,
 * 6,912 URLs, well under the 50,000 limit).
 */
export const YACHT_SHARD_WIDTH = 1000;

/** The list API's page cap (backend MAX_PAGE_SIZE). */
const API_PAGE_SIZE = 100;

/** Mario decision 4.5.2026: only the promoted countries are in the sitemap. */
export const SITEMAP_COUNTRY_CODES = Array.from(PROMOTED_COUNTRY_CODES);

/**
 * The highest id of the sitemap catalogue and its size (`sortBy=idDesc&size=1`).
 * The index derives the shard count from it; an empty shard reads it to tell
 * a gap in the ids from an empty answer. Same Data Cache entry for both.
 * Throws when the catalogue is empty or the API fails: the caller then keeps
 * its last good ISR copy (a first render answers 500 and is retried).
 */
export async function fetchSitemapCatalogueTop(revalidate: number): Promise<{ maxId: number; total: number }> {
  const data = await fetchYachts(
    { locations: [], page: 1, size: 1, sortBy: 'idDesc', countryCodes: SITEMAP_COUNTRY_CODES },
    Currency.EUR,
    'en',
    { revalidate }
  );
  const total = data.page?.totalElements ?? 0;
  const maxId = data.content?.[0]?.id ?? 0;

  if (total <= 0 || maxId <= 0) throw new Error('sitemap: empty yacht catalogue');

  return { maxId, total };
}

/** Shards 0 … n − 1 cover every id up to and including `maxId`. */
export const yachtShardCount = (maxId: number): number => Math.floor(maxId / YACHT_SHARD_WIDTH) + 1;

/**
 * Every boat of shard `shard`, in id order. Read 100 at a time by id
 * (keyset: the next read starts after the last id), never by page offset, so
 * the reads cannot overlap or skip. Throws on an API failure and on an answer
 * that is not in id order inside the asked range (the API then ignored the
 * range, and the shards would overlap again).
 */
export async function fetchYachtShard(shard: number, revalidate: number): Promise<YachtModelShortInfo[]> {
  const idTo = (shard + 1) * YACHT_SHARD_WIDTH;
  const yachts: YachtModelShortInfo[] = [];
  let idFrom = shard * YACHT_SHARD_WIDTH;

  // Sequential by design: each read starts after the previous one's last id.
  // At most YACHT_SHARD_WIDTH / API_PAGE_SIZE reads (each full read moves
  // idFrom by at least 100).
  for (;;) {
    // eslint-disable-next-line no-await-in-loop
    const data = await fetchYachts(
      {
        locations: [],
        page: 1,
        size: API_PAGE_SIZE,
        sortBy: 'id',
        idFrom,
        idTo,
        countryCodes: SITEMAP_COUNTRY_CODES,
      },
      Currency.EUR,
      'en',
      { revalidate }
    );
    const rows = data.content ?? [];
    const from = idFrom;

    if (rows.some((yacht, i) => !(yacht.id >= from && yacht.id < idTo && (i === 0 || yacht.id > rows[i - 1].id)))) {
      throw new Error(`sitemap-yachts/${shard}: the API answered boats out of id order or outside ${from}–${idTo - 1}`);
    }

    yachts.push(...rows);

    // totalElements = boats left in [idFrom, idTo): done when this read had
    // them all (without it: when the read was not full).
    const left = data.page?.totalElements;

    if (rows.length === 0 || (left != null ? rows.length >= left : rows.length < API_PAGE_SIZE)) return yachts;

    idFrom = rows[rows.length - 1].id + 1;
  }
}
