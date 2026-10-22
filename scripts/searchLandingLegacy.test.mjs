/**
 * Legacy `<Marina> | <City>` search URLs (the pre-did search form; GSC
 * 16.10.2026: a third of the 25.9K 404s were `/search?destinations=Split+|+Split`
 * -style links) resolve to the city and 308 to its canonical landing:
 *   - src/utils/server/searchLanding.ts legacyPipeCity — the city of such a
 *     value; resolveSearchLanding — the fallback (one value, unknown as a
 *     whole, city known); landingRedirectPath — the 308 target;
 *   - hasUnknownDestination — anything else the catalogue does not know
 *     stays a 404.
 * The catalogue (destinationDid.ts, which reads the API) is stubbed.
 *
 * Imported by scripts/landingPagination.test.mjs (yarn test:landing-pages);
 * on its own:
 *   node --disable-warning=MODULE_TYPELESS_PACKAGE_JSON --test scripts/searchLandingLegacy.test.mjs
 */
/* global globalThis */
import assert from 'node:assert/strict';
import { registerHooks } from 'node:module';
import { describe, test } from 'node:test';

import './tsLoader.mjs';

// Catalogue stub: key = normalised name, as destinationDid.ts resolves it.
// `Lavrion` has a name that cannot carry a landing URL (a comma).
const SPLIT_REGION = { dids: ['r-12', 'r-900'], name: 'Split Region', count: 500, kind: 'REGION', countryCode: 'HR' };
const CATALOGUE = {
  split: SPLIT_REGION,
  'split region': SPLIT_REGION,
  'aci marina split': { dids: ['l-8'], name: 'ACI Marina Split', count: 40, kind: 'MARINA', countryCode: 'HR' },
  croatia: { dids: ['c-54'], name: 'Croatia', count: 3000, kind: 'COUNTRY', countryCode: 'HR' },
  greece: { dids: ['c-86'], name: 'Greece', count: 2000, kind: 'COUNTRY', countryCode: 'GR' },
  lavrion: { dids: ['l-150'], name: 'Lavrion, main port', count: 70, kind: 'MARINA', countryCode: 'GR' },
};

globalThis.catalogue = {
  entries: CATALOGUE,
  /** joined input → the one array React `cache` would hand to every caller */
  memo: new Map(),
  calls: [],
};

const STUB = `
const normalise = v => v.toLowerCase().replace(/[^a-z0-9]+/g, ' ').trim();
export const resolveDestinationDids = async joined => {
  const { entries, memo, calls } = globalThis.catalogue;
  calls.push(joined);
  if (!memo.has(joined)) {
    memo.set(joined, joined.split(',').map(v => v.trim()).filter(Boolean).map(v => entries[normalise(v)] ?? null));
  }
  return memo.get(joined);
};
`;

registerHooks({
  resolve: (specifier, context, nextResolve) => {
    if (specifier === 'server-only') return { url: 'data:text/javascript,export {};', shortCircuit: true };

    if (specifier === '@/utils/server/destinationDid') {
      return { url: `data:text/javascript,${encodeURIComponent(STUB)}`, shortCircuit: true };
    }

    return nextResolve(specifier, context);
  },
});

const { hasUnknownDestination, landingRedirectPath, legacyPipeCity, resolveSearchLanding } =
  await import('@/utils/server/searchLanding');

const resolveAndRedirect = async params => {
  const landing = await resolveSearchLanding(params);

  return { landing, redirect: landingRedirectPath(params, landing), unknown: hasUnknownDestination(landing) };
};

describe('legacyPipeCity', () => {
  test('the part after " | " is the city', () => {
    assert.equal(legacyPipeCity('Split | Split'), 'Split');
    assert.equal(legacyPipeCity('Port of Split / West Harbour | Split'), 'Split');
    assert.equal(legacyPipeCity('Marina Kaštela | Kaštel Gomilica'), 'Kaštel Gomilica');
  });

  test('no " | " (spaces included), an empty city or a comma city → null', () => {
    assert.equal(legacyPipeCity('split'), null);
    assert.equal(legacyPipeCity('Split|Split'), null);
    assert.equal(legacyPipeCity('Istria / Kvarner'), null);
    assert.equal(legacyPipeCity('Marina X | '), null);
    assert.equal(legacyPipeCity('Marina X | Lavrion, main port'), null);
  });
});

describe('resolveSearchLanding — legacy `<Marina> | <City>` value', () => {
  test('"Split | Split" resolves to the city and 308s to its canonical landing', async () => {
    const { landing, redirect, unknown } = await resolveAndRedirect({ destinations: 'Split | Split' });

    assert.equal(unknown, false);
    assert.deepEqual(landing.resolved, [SPLIT_REGION]);
    assert.deepEqual(landing.did, ['r-12', 'r-900']);
    assert.equal(landing.labels['split | split'], 'Split Region');
    assert.equal(redirect, '/search?destinations=split%20region');
  });

  test('a marina / city pair goes to the city, the other parameters follow', async () => {
    const { redirect } = await resolveAndRedirect({
      destinations: 'Port of Split / West Harbour | Split',
      boatTypes: 'CATAMARAN',
      page: '2',
    });

    assert.equal(redirect, '/search?destinations=split%20region&boatTypes=CATAMARAN&page=2');

    // The marina before the pipe is known on its own — the city still wins.
    const marina = await resolveAndRedirect({ destinations: 'ACI Marina Split | Split' });

    assert.equal(marina.redirect, '/search?destinations=split%20region');
  });

  test('an unknown city keeps the 404', async () => {
    const { landing, redirect, unknown } = await resolveAndRedirect({ destinations: 'Nepoznato | Nigdje' });

    assert.equal(unknown, true);
    assert.deepEqual(landing.resolved, [null]);
    assert.equal(redirect, null);
  });

  test('a city whose catalogue name cannot carry a landing URL keeps the 404', async () => {
    const { unknown, redirect } = await resolveAndRedirect({ destinations: 'Olympic Marine | Lavrion' });

    assert.equal(unknown, true);
    assert.equal(redirect, null);
  });

  test('several values are never redirected — the 404 stays', async () => {
    globalThis.catalogue.calls.length = 0;

    const { unknown, redirect } = await resolveAndRedirect({ destinations: 'Split | Split,Greece' });

    assert.equal(unknown, true);
    assert.equal(redirect, null);
    assert.deepEqual(globalThis.catalogue.calls, ['Split | Split,Greece']);
  });

  test('the shared (React cache) result of the whole value is not mutated', async () => {
    await resolveAndRedirect({ destinations: 'Split | Split' });

    assert.deepEqual(globalThis.catalogue.memo.get('Split | Split'), [null]);
  });

  test('a plain value is untouched: canonical spelling → no redirect, a casing variant → 308', async () => {
    globalThis.catalogue.calls.length = 0;

    const plain = await resolveAndRedirect({ destinations: 'croatia' });

    assert.equal(plain.unknown, false);
    assert.equal(plain.redirect, null);

    const cased = await resolveAndRedirect({ destinations: 'Croatia' });

    assert.equal(cased.redirect, '/search?destinations=croatia');
    assert.deepEqual(globalThis.catalogue.calls, ['croatia', 'Croatia']);
  });
});
