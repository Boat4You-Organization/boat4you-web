// The sister-site handoff token (`cch`, Contact Center P3b): boat4you takes it out of the address bar in a head script,
// before the Google tag reads page_location, and keeps it only in page memory for the widget; the service worker never
// stores a page whose request still carried it.
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { describe, test } from 'node:test';
import vm from 'node:vm';

import { CCH_STRIP_SNIPPET } from '../src/config/ccHandoff.ts';

const strip = href => {
  const calls = [];
  const ctx = { location: { href }, history: { state: { a: 1 }, replaceState: (s, _t, u) => calls.push([s, u]) }, URL };

  ctx.window = ctx;
  vm.runInNewContext(CCH_STRIP_SNIPPET, ctx);

  return { calls, kept: ctx.__b4yCcCch };
};

describe('cch head script (before gtag)', () => {
  test('the token leaves the address bar; other parameters, the hash and history.state stay; it is kept in memory', () => {
    const r = strip('https://www.boat4you.com/boat/x?cch=TOKEN12345&startDate=2027-07-10#a');

    assert.deepEqual(r.calls, [[{ a: 1 }, '/boat/x?startDate=2027-07-10#a']]);
    assert.equal(r.kept, 'TOKEN12345');
  });

  test('only cch: a clean path without "?"', () => {
    assert.deepEqual(strip('https://www.boat4you.com/hr/boat/x?cch=TOKEN12345').calls[0][1], '/hr/boat/x');
  });

  test('no cch: the address is not touched', () => {
    const r = strip('https://www.boat4you.com/search?destinations=croatia');

    assert.deepEqual(r.calls, []);
    assert.equal(r.kept, undefined);
  });

  test('a malformed token is taken out of the address but not kept', () => {
    const r = strip('https://www.boat4you.com/?cch=%3Cscript%3E');

    assert.deepEqual(r.calls[0][1], '/');
    assert.equal(r.kept, undefined);
  });

  test('the layout runs it before the Consent Mode default and the Google tag', () => {
    const src = readFileSync('src/app/[locale]/layout.tsx', 'utf8');
    const at = src.indexOf('id="cc-handoff-strip"');

    assert.ok(at > 0, 'cc-handoff-strip script missing');
    assert.ok(at < src.indexOf('id="gtag-consent-default"'));
  });
});

describe('service worker and cch', () => {
  const navigate = async url => {
    const handlers = {};
    const puts = [];
    const response = { clone: () => response };
    const ctx = {
      URL,
      fetch: async () => response,
      caches: {
        open: async () => ({ put: req => puts.push(req.url), addAll: async () => {} }),
        match: async () => undefined,
        keys: async () => [],
      },
    };

    ctx.self = {
      addEventListener: (type, fn) => (handlers[type] = fn),
      location: { origin: 'https://www.boat4you.com' },
      skipWaiting: () => {},
      clients: { claim: () => {} },
    };
    vm.runInNewContext(readFileSync('public/sw.js', 'utf8'), ctx);
    let answered;

    handlers.fetch({ request: { method: 'GET', url, mode: 'navigate' }, respondWith: p => (answered = p) });
    await answered;
    await new Promise(r => setImmediate(r));

    return puts;
  };

  test('a page whose request carried cch is not stored in the page cache', async () => {
    assert.deepEqual(await navigate('https://www.boat4you.com/boat/x?cch=TOKEN12345'), []);
  });

  test('any other page is stored as before', async () => {
    assert.deepEqual(await navigate('https://www.boat4you.com/boat/x?startDate=2027-07-10'), [
      'https://www.boat4you.com/boat/x?startDate=2027-07-10',
    ]);
  });
});
