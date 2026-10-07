/**
 * Crawlable pages of the /search destination landings and the sitemap index
 * <lastmod> of the blog sitemap (audit 7.10.2026):
 *   - src/utils/static/landingPagination.ts — page URLs, page count, when the
 *     pager shows every page;
 *   - src/utils/server/searchLanding.ts landingPagerPath / landingCurrencyParam
 *     — which requests are a plain landing whose pages are linked;
 *   - src/lib/api.ts getBlogsLastmodStamps + wpGmtLastmod — the blog child's
 *     <lastmod> in sitemap.xml;
 *   - messages/<locale>/landing.json — the new strings in all nine locales.
 *
 *   yarn test:landing-pages
 */
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { registerHooks } from 'node:module';
import { describe, test } from 'node:test';
import { fileURLToPath } from 'node:url';

import './tsLoader.mjs';

// `server-only` throws outside a React server bundle; these modules are only
// imported for their pure helpers here.
registerHooks({
  resolve: (specifier, context, nextResolve) =>
    specifier === 'server-only'
      ? { url: 'data:text/javascript,export {};', shortCircuit: true }
      : nextResolve(specifier, context),
});

const { landingPageCount, landingPageHref, pagerShowsEveryPage } = await import('@/utils/static/landingPagination');
const { landingCurrencyParam, landingPagerPath } = await import('@/utils/server/searchLanding');
const { wpGmtLastmod, lastmodElement } = await import('@/utils/static/sitemapLastmod');

// fetchApi.ts reads the WordPress URL when it is loaded.
process.env.NEXT_PUBLIC_WORDPRESS_API_URL = 'https://wp.example.test/graphql';

const { getBlogsLastmodStamps } = await import('@/lib/api');

const ROOT = fileURLToPath(new URL('../', import.meta.url));
const LOCALES = ['en', 'de', 'fr', 'it', 'es', 'pt', 'nl', 'pl', 'hr'];

/** A resolved one-place landing, as resolveSearchLanding returns it. */
const landingOf = (name, extra = {}) => ({
  destinations: [name.toLowerCase()],
  hasOwnDid: false,
  resolved: [{ name, dids: ['c-54'] }],
  did: ['c-54'],
  labels: { [name.toLowerCase()]: name },
  ...extra,
});

describe('landingPageHref', () => {
  const base = '/search?destinations=croatia&boatTypes=CATAMARAN';

  test('page 1 is the landing itself — never a `page=1` duplicate', () => {
    assert.equal(landingPageHref(base, 1), base);
  });

  test('page n > 1 appends `page=n` to the canonical query', () => {
    assert.equal(landingPageHref(base, 2), `${base}&page=2`);
    assert.equal(landingPageHref(base, 49), `${base}&page=49`);
  });

  test('a path without a query gets `?`', () => {
    assert.equal(landingPageHref('/search', 3), '/search?page=3');
  });

  test('the display currency is kept after the page, encoded', () => {
    assert.equal(landingPageHref(base, 3, 'USD'), `${base}&page=3&currency=USD`);
    assert.equal(landingPageHref(base, 1, 'GBP'), `${base}&currency=GBP`);
    assert.equal(landingPageHref(base, 2, null), `${base}&page=2`);
  });

  test('a destination with a space keeps the canonical %20 spelling', () => {
    assert.equal(
      landingPageHref('/search?destinations=split%20region', 2),
      '/search?destinations=split%20region&page=2'
    );
  });
});

describe('landingPageCount', () => {
  test('pages of 18 cards', () => {
    assert.equal(landingPageCount(884, 18), 50);
    assert.equal(landingPageCount(18, 18), 1);
    assert.equal(landingPageCount(19, 18), 2);
  });

  test('no boats, no pages', () => {
    assert.equal(landingPageCount(0, 18), 0);
    assert.equal(landingPageCount(null, 18), 0);
    assert.equal(landingPageCount(undefined, 18), 0);
  });
});

describe('pagerShowsEveryPage (MUI Pagination, one boundary and one sibling page)', () => {
  test('up to seven pages every number is on the pager', () => {
    assert.equal(pagerShowsEveryPage(2), true);
    assert.equal(pagerShowsEveryPage(7), true);
  });

  test('from eight pages the middle folds into "…" and the full list is added', () => {
    assert.equal(pagerShowsEveryPage(8), false);
    assert.equal(pagerShowsEveryPage(50), false);
  });
});

describe('landingPagerPath — which requests link their pages', () => {
  test('a plain destination landing → its canonical path', () => {
    assert.equal(landingPagerPath({ destinations: 'croatia' }, landingOf('Croatia')), '/search?destinations=croatia');
  });

  test('with one known boat type → the type landing', () => {
    assert.equal(
      landingPagerPath({ destinations: 'croatia', boatTypes: 'CATAMARAN' }, landingOf('Croatia')),
      '/search?destinations=croatia&boatTypes=CATAMARAN'
    );
  });

  test('page, display currency and ad-click parameters do not change the landing', () => {
    assert.equal(
      landingPagerPath(
        { destinations: 'croatia', boatTypes: 'CATAMARAN', page: '4', currency: 'USD', gclid: 'x', utm_source: 'y' },
        landingOf('Croatia')
      ),
      '/search?destinations=croatia&boatTypes=CATAMARAN'
    );
  });

  test('the catalogue name is the canonical spelling (lower case, %20)', () => {
    assert.equal(
      landingPagerPath({ destinations: 'split region' }, landingOf('Split Region')),
      '/search?destinations=split%20region'
    );
  });

  test('dates, a sidebar filter or a sort keep the button pager', () => {
    const landing = landingOf('Croatia');

    assert.equal(landingPagerPath({ destinations: 'croatia', startDate: '2027-06-05' }, landing), null);
    assert.equal(landingPagerPath({ destinations: 'croatia', minCabins: '4' }, landing), null);
    assert.equal(landingPagerPath({ destinations: 'croatia', sortBy: 'lengthDesc' }, landing), null);
    assert.equal(landingPagerPath({ destinations: 'croatia', sortDirection: 'desc' }, landing), null);
    assert.equal(landingPagerPath({ destinations: 'croatia', size: '50' }, landing), null);
  });

  test('two or unknown boat types are no landing', () => {
    const landing = landingOf('Croatia');

    assert.equal(landingPagerPath({ destinations: 'croatia', boatTypes: 'CATAMARAN,MOTOR_YACHT' }, landing), null);
    assert.equal(landingPagerPath({ destinations: 'croatia', boatTypes: 'toString' }, landing), null);
  });

  test('a did of its own, several places, an unknown place or a comma name are no landing', () => {
    assert.equal(
      landingPagerPath(
        { destinations: 'croatia', did: 'c-54' },
        landingOf('Croatia', { hasOwnDid: true, resolved: [] })
      ),
      null
    );
    assert.equal(
      landingPagerPath(
        { destinations: 'croatia,greece' },
        landingOf('Croatia', {
          destinations: ['croatia', 'greece'],
          resolved: [{ name: 'Croatia' }, { name: 'Greece' }],
        })
      ),
      null
    );
    assert.equal(landingPagerPath({ destinations: 'atlantis' }, landingOf('Atlantis', { resolved: [null] })), null);
    assert.equal(landingPagerPath({ destinations: 'marina spinut, split' }, landingOf('Marina Spinut, Split')), null);
  });

  test('no destination (boat type only) is no landing', () => {
    assert.equal(
      landingPagerPath(
        { boatTypes: 'CATAMARAN' },
        { destinations: [], hasOwnDid: false, resolved: [], did: [], labels: {} }
      ),
      null
    );
  });
});

describe('landingCurrencyParam', () => {
  test('a known currency is kept, anything else is dropped', () => {
    assert.equal(landingCurrencyParam({ currency: 'USD' }), 'USD');
    assert.equal(landingCurrencyParam({ currency: 'EUR' }), 'EUR');
    assert.equal(landingCurrencyParam({ currency: 'XYZ' }), null);
    assert.equal(landingCurrencyParam({ currency: '<script>' }), null);
    assert.equal(landingCurrencyParam({}), null);
  });
});

describe('sitemap index: <lastmod> of sitemap-blogs', () => {
  // The WordPress answer of 7.10.2026: the latest modified post was edited on
  // 1.10., the latest published one went out (scheduled) on 5.10. at 06:00 GMT.
  const WP_ANSWER = {
    data: {
      byModified: { nodes: [{ dateGmt: '2026-08-23T18:31:42', modifiedGmt: '2026-10-01T08:18:22' }] },
      byDate: { nodes: [{ dateGmt: '2026-10-05T06:00:00', modifiedGmt: '2026-06-22T18:45:27' }] },
    },
  };

  const withFetch = async (respond, run) => {
    const original = globalThis.fetch;
    const calls = [];

    globalThis.fetch = async (url, init) => {
      calls.push({ url, init });

      return respond(url, init);
    };

    try {
      return await run(calls);
    } finally {
      globalThis.fetch = original;
    }
  };

  test('the newest stamp of the newest-modified and newest-published post — the blog sitemap’s own newest entry', async () => {
    await withFetch(
      () => new Response(JSON.stringify(WP_ANSWER), { status: 200 }),
      async calls => {
        const stamps = await getBlogsLastmodStamps(3600, 3000);

        assert.equal(wpGmtLastmod(...stamps), '2026-10-05T06:00:00Z');
        assert.equal(lastmodElement(wpGmtLastmod(...stamps)), '\n    <lastmod>2026-10-05T06:00:00Z</lastmod>');
        // One cached request in the index's own hourly window, with a deadline.
        assert.equal(calls.length, 1);
        assert.equal(calls[0].init.method, 'POST');
        assert.equal(calls[0].init.next.revalidate, 3600);
        assert.ok(calls[0].init.signal);
        assert.match(JSON.parse(calls[0].init.body).query, /orderby: \{field: MODIFIED, order: DESC\}/);
      }
    );
  });

  test('WordPress failing → the call throws (the index leaves the <lastmod> out)', async () => {
    await withFetch(
      () => new Response('{}', { status: 502 }),
      async () => {
        await assert.rejects(() => getBlogsLastmodStamps(3600, 3000));
        assert.equal(lastmodElement(wpGmtLastmod(...[])), '');
      }
    );
  });

  test('no posts → no stamps → no <lastmod>', async () => {
    await withFetch(
      () =>
        new Response(JSON.stringify({ data: { byModified: { nodes: [] }, byDate: { nodes: [] } } }), { status: 200 }),
      async () => {
        assert.deepEqual(await getBlogsLastmodStamps(3600, 3000), []);
      }
    );
  });
});

describe('messages: page strings in all nine locales', () => {
  const landing = Object.fromEntries(
    LOCALES.map(locale => [locale, JSON.parse(readFileSync(`${ROOT}messages/${locale}/landing.json`, 'utf8'))])
  );

  test('pagedHeading keeps the heading and the page number', () => {
    LOCALES.forEach(locale => {
      const value = landing[locale].pagedHeading;

      assert.equal(typeof value, 'string', locale);
      assert.match(value, /^\{heading\} – \S.* \{page\}$/u, locale);
    });
  });

  test('pageIndex has a summary with the page count and a nav label', () => {
    LOCALES.forEach(locale => {
      assert.match(landing[locale].pageIndex.summary, /\(\{count\}\)$/u, locale);
      assert.ok(landing[locale].pageIndex.label.length > 3, locale);
    });
  });

  test('each locale has its own word for "page" (no English left in a translation)', () => {
    LOCALES.filter(locale => !['en', 'fr'].includes(locale)).forEach(locale => {
      assert.doesNotMatch(landing[locale].pagedHeading, / page \{page\}$/u, locale);
    });
  });
});
