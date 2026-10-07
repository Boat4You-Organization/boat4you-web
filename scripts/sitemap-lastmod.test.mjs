/**
 * Unit tests for the yacht and blog sitemaps' <lastmod> (src/utils/static/sitemapLastmod.ts,
 * audit 1.10.2026 N7). Plain `node --test` (Node >= 22.18 runs the .ts source directly).
 *
 *   yarn test:sitemap
 */
import assert from 'node:assert/strict';
import { describe, test } from 'node:test';

import { lastmodElement, sitemapLastmod, wpGmtLastmod } from '../src/utils/static/sitemapLastmod.ts';

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

describe('wpGmtLastmod (blog sitemap)', () => {
  test("WordPress's GMT stamp becomes UTC, not the local `date` read as UTC", () => {
    // Live 7.10.2026: date "2026-10-05T08:00:00" (CEST), dateGmt "2026-10-05T06:00:00".
    assert.equal(wpGmtLastmod('2026-10-05T06:00:00', '2026-06-22T18:45:27'), '2026-10-05T06:00:00Z');
    assert.equal(
      lastmodElement(wpGmtLastmod('2026-10-05T06:00:00', null)),
      '\n    <lastmod>2026-10-05T06:00:00Z</lastmod>'
    );
  });

  test('the later of publish and modify wins', () => {
    assert.equal(wpGmtLastmod('2026-09-01T06:00:00', '2026-10-02T13:14:15'), '2026-10-02T13:14:15Z');
    assert.equal(wpGmtLastmod('2026-10-05T06:00:00', '2026-06-22T18:45:27'), '2026-10-05T06:00:00Z');
  });

  test('a missing or junk stamp is skipped; none usable means no <lastmod>, never a throw', () => {
    assert.equal(wpGmtLastmod(undefined, '2026-10-02T13:14:15'), '2026-10-02T13:14:15Z');
    assert.equal(wpGmtLastmod('not a date', null), null);
    assert.equal(wpGmtLastmod('2026-10-05', '2026-10-05T08:00:00+02:00', 1759385561000), null);
    assert.equal(wpGmtLastmod(), null);
    assert.equal(lastmodElement(wpGmtLastmod(undefined, undefined)), '');
  });

  test('a GMT stamp more than a day ahead is dropped by lastmodElement', () => {
    assert.equal(sitemapLastmod(wpGmtLastmod('2026-10-07T12:00:00'), NOW), null);
  });
});
