/**
 * Unit tests for the yacht sitemaps' <lastmod> (src/utils/static/sitemapLastmod.ts,
 * audit 1.10.2026 N7). Plain `node --test` (Node >= 22.18 runs the .ts source directly).
 *
 *   yarn test:sitemap
 */
import assert from 'node:assert/strict';
import { describe, test } from 'node:test';

import { lastmodElement, sitemapLastmod } from '../src/utils/static/sitemapLastmod.ts';

const NOW = Date.parse('2026-10-05T12:00:00Z');

describe('sitemapLastmod', () => {
  test("the backend's updatedAt is used as it is (UTC, whole seconds)", () => {
    assert.equal(sitemapLastmod('2026-10-02T06:12:41Z', NOW), '2026-10-02T06:12:41Z');
  });

  test('fractions of a second are dropped', () => {
    assert.equal(sitemapLastmod('2026-10-02T06:12:41.987Z', NOW), '2026-10-02T06:12:41Z');
  });

  test('no recorded change, an old backend without the field, or junk: no <lastmod>', () => {
    [null, undefined, '', 'yesterday', '2026-10-02', '2026-10-02T06:12:41+02:00', 1759385561000].forEach(value => {
      assert.equal(sitemapLastmod(value, NOW), null, String(value));
    });
  });

  test('a stamp from the future is not trusted', () => {
    assert.equal(sitemapLastmod('2026-10-07T12:00:00Z', NOW), null);
    assert.equal(sitemapLastmod('2026-10-06T11:00:00Z', NOW), '2026-10-06T11:00:00Z');
  });

  test('never the request time', () => {
    assert.equal(sitemapLastmod(undefined), null);
    assert.equal(lastmodElement(undefined), '');
  });
});

describe('lastmodElement', () => {
  test('one indented line after <loc>, or nothing', () => {
    assert.equal(lastmodElement('2026-10-02T06:12:41Z'), '\n    <lastmod>2026-10-02T06:12:41Z</lastmod>');
    assert.equal(lastmodElement(null), '');
  });
});
