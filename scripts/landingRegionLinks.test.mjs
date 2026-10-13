/**
 * Merged dual-source marinas in their regions' link blocks (13.10.2026,
 * before backend V9_79):
 *   - src/utils/server/landingNav.ts liesInside — a place lies inside a
 *     region when ANY of its rows is filed there: the partners file one
 *     marina under different regions (Olbia: NauSYS l-222 in "Sardinia" r-51,
 *     MMK l-609 in "Sardinia / Corsica" r-179), and requiring all rows
 *     dropped every merged place from the "popular destinations" block;
 *   - src/utils/server/catalogueHubs.ts regionsForPlace — the breadcrumb
 *     region (regionHubAbove) and the itinerary links (landingNav.ts
 *     itinerariesFor) come from the regions of every row, not only dids[0];
 *   - src/config/landing-identity.config.ts + curatedSeoSlug.ts — the
 *     Golfo Aranci / Olbia pins and the text alias, so the merged landings
 *     resolve, read their text and stay indexable.
 *
 * The catalogue API is a stub (no network): the Sardinian and Olympic Marine
 * rows as /public/locations lists them after V9_79, with the region lists
 * from prod 13.10.2026. The corpus is the repo's own public/seo-content.
 *
 *   yarn test:landing-pages
 */
import assert from 'node:assert/strict';
import { readdirSync } from 'node:fs';
import { registerHooks } from 'node:module';
import { describe, test } from 'node:test';

import './tsLoader.mjs';

registerHooks({
  resolve: (specifier, context, nextResolve) => {
    if (specifier === 'next-intl/server') {
      return { url: new URL('./stubs/next-intl-server.mjs', import.meta.url).href, shortCircuit: true };
    }

    // `server-only` throws outside a React server bundle.
    if (specifier === 'server-only') return { url: 'data:text/javascript,export {};', shortCircuit: true };

    try {
      return nextResolve(specifier, context);
    } catch (error) {
      if (error?.code === 'ERR_MODULE_NOT_FOUND' && /^next\//u.test(specifier)) {
        return nextResolve(`${specifier}.js`, context);
      }

      throw error;
    }
  },
});

const API = 'http://catalogue.test';

process.env.NEXT_PUBLIC_BOAT_WS_API_URL = API;

const LOCATIONS = [
  { id: 'c-110', name: 'Italy', locationType: 'COUNTRY', countryCode: 'IT' },
  { id: 'r-51', name: 'Sardinia', locationType: 'REGION', countryCode: 'IT' },
  { id: 'r-179', name: 'Sardinia / Corsica', locationType: 'REGION', countryCode: 'IT' },
  { id: 'l-220', name: 'Marina di Portisco', locationType: 'MARINA', countryCode: 'IT' },
  { id: 'l-222', name: 'Marina di Olbia', locationType: 'MARINA', countryCode: 'IT' },
  { id: 'l-225,l-609', name: 'Marina di Olbia Yachting Services', locationType: 'MARINA', countryCode: 'IT' },
  { id: 'l-411', name: 'Marina di Golfo Aranci', locationType: 'MARINA', countryCode: 'IT' },
  { id: 'l-1550', name: 'Marina di Golfo Aranci', locationType: 'MARINA', countryCode: 'IT' },
  { id: 'c-86', name: 'Greece', locationType: 'COUNTRY', countryCode: 'GR' },
  { id: 'r-21', name: 'Cyclades', locationType: 'REGION', countryCode: 'GR' },
  { id: 'r-165', name: 'Athens / Saronic Gulf', locationType: 'REGION', countryCode: 'GR' },
  { id: 'r-24', name: 'Athens area/Saronic/Peloponese', locationType: 'REGION', countryCode: 'GR' },
  { id: 'l-139', name: 'Olympic Marine', locationType: 'MARINA', countryCode: 'GR' },
  { id: 'l-710', name: 'Olympic Marine', locationType: 'MARINA', countryCode: 'GR' },
  // The Corsica itinerary's own region (else "Corsica" falls back to "Sardinia / Corsica").
  { id: 'r-31', name: 'Corsica', locationType: 'REGION', countryCode: 'FR' },
];

/** /public/locations-count?regionId= — single rows, as prod lists them. */
const REGION_MARINAS = {
  51: ['l-220', 'l-222', 'l-225', 'l-411'],
  179: ['l-609', 'l-1550'],
  21: ['l-710'],
  165: ['l-710'],
  24: ['l-139'],
};

/** Listing totals (/public/yachts size=1); every boat is in a promoted country. */
const FLEET = { 'c-110': 2000, 'r-51': 120, 'r-179': 300, 'c-86': 3000, 'r-21': 500, 'r-165,r-24': 700 };

const json = body =>
  new Response(JSON.stringify(body), { status: 200, headers: { 'Content-Type': 'application/json' } });

globalThis.fetch = async input => {
  const url = new URL(typeof input === 'string' ? input : input.url);

  if (url.origin !== API) throw new Error(`unexpected request ${url}`);

  const q = url.searchParams;

  switch (url.pathname) {
    case '/public/locations':
      return json({ content: LOCATIONS });
    case '/public/countries-count':
      return json(
        LOCATIONS.filter(l => l.locationType === 'COUNTRY').map(l => ({
          id: l.id,
          name: l.name,
          yachtCount: FLEET[l.id],
        }))
      );
    case '/public/locations-count':
      return q.has('regionId')
        ? json((REGION_MARINAS[q.get('regionId')] ?? []).map(id => ({ id, yachtCount: 40 })))
        : json(
            LOCATIONS.filter(l => l.locationType === 'MARINA').map(l => ({ id: l.id, name: l.name, yachtCount: 40 }))
          );
    case '/public/regions':
      return json(
        LOCATIONS.filter(l => l.locationType === 'REGION' && l.countryCode === q.get('countryCode')).map(l => ({
          id: l.id,
          name: l.name,
        }))
      );
    case '/public/yachts':
      return json({ totalElements: FLEET[q.get('did')] ?? 40 });
    default:
      return new Response('', { status: 404 });
  }
};

const LOCALES = ['en', 'de', 'fr', 'it', 'es', 'pt', 'nl', 'pl', 'hr'];

const { LANDING_IDENTITIES } = await import('@/config/landing-identity.config');
const { requireDestinationIndex, resolveDestinationName } = await import('@/utils/server/destinationDid');
const { getLandingManifest } = await import('@/utils/server/landingManifest');
const { evaluateLanding } = await import('@/utils/server/landingGate');
const { curatedFileFor } = await import('@/utils/server/curatedSeoContent');
const { landingCrumbs, landingNav } = await import('@/utils/server/landingNav');
const { placeText } = await import('@/utils/server/placeText');
const { slugifyDestination } = await import('@/utils/static/curatedSeoSlug');
const { buildSearchLandingPath } = await import('@/utils/static/searchLandingPath');

const index = await requireDestinationIndex();

// landingNav serves the last built manifest (or none within its budget).
await getLandingManifest(index);

const GOLFO_ARANCI = LANDING_IDENTITIES.find(i => i.name === 'Marina di Golfo Aranci');

describe('pins: the merged Sardinian marinas resolve to one landing', () => {
  test('the old Golfo Aranci spelling resolves to "Marina di Golfo Aranci" with both rows', async () => {
    // The spelling is the row's pre-V9_79 catalogue name (an agency name,
    // kept only in the server-side config, never written here).
    const resolved = await resolveDestinationName(index, GOLFO_ARANCI.aliases[0]);

    assert.equal(resolved?.name, 'Marina di Golfo Aranci');
    assert.deepEqual(resolved?.dids, ['l-1550', 'l-411']);
  });

  test('"Olbia" and "Marina di Olbia Yachting Services" are the Olbia landing with all three rows', async () => {
    const spellings = ['olbia', 'marina di olbia', 'Marina di Olbia Yachting Services'];
    const resolved = await Promise.all(spellings.map(spelling => resolveDestinationName(index, spelling)));

    spellings.forEach((spelling, i) => {
      assert.equal(resolved[i]?.name, 'Olbia', spelling);
      assert.deepEqual(resolved[i]?.dids, ['l-222', 'l-225', 'l-609'], spelling);
    });
  });
});

describe('text: "Marina di Golfo Aranci" reads the Golfo Aranci copy', () => {
  test('the catamaran landing reads golfo-aranci-catamaran-charter in all nine locales', async () => {
    const files = await Promise.all(
      LOCALES.map(locale => curatedFileFor(locale, 'Marina di Golfo Aranci', 'CATAMARAN', { typeSpecificOnly: true }))
    );

    LOCALES.forEach((locale, i) => assert.equal(files[i], 'golfo-aranci-catamaran-charter', locale));
  });

  test('so the catamaran landing is indexable in all nine locales', async () => {
    const resolved = await resolveDestinationName(index, 'marina di golfo aranci');
    const gate = await evaluateLanding(resolved, 'CATAMARAN', index);

    assert.deepEqual([...gate.indexableLocales].sort(), [...LOCALES].sort());
  });

  test('no corpus file is left under the old (agency) spelling', () => {
    const oldSlug = slugifyDestination(GOLFO_ARANCI.aliases[0]);

    LOCALES.forEach(locale => {
      const hits = readdirSync(new URL(`../public/seo-content/${locale}/`, import.meta.url)).filter(f =>
        f.includes(oldSlug)
      );

      assert.deepEqual(hits, [], locale);
    });
  });
});

describe('liesInside: a merged marina lies inside each region either row is filed under', () => {
  const hrefs = nav => nav.popular.links.map(l => l.href);

  test('Sardinia (NauSYS rows) links the Olbia and Golfo Aranci landings', async () => {
    const nav = await landingNav('Sardinia', null, 'en', Promise.resolve([]));

    assert.equal(nav.popular.where, (await placeText('en', 'Sardinia')).where);
    assert.ok(hrefs(nav).includes(buildSearchLandingPath('Olbia', 'CATAMARAN')), hrefs(nav).join('\n'));
    assert.ok(
      hrefs(nav).includes(buildSearchLandingPath('Marina di Golfo Aranci', 'CATAMARAN')),
      hrefs(nav).join('\n')
    );
  });

  test('Sardinia / Corsica (MMK rows) keeps its own block instead of falling back to Italy', async () => {
    const nav = await landingNav('Sardinia / Corsica', null, 'en', Promise.resolve([]));

    assert.equal(nav.popular.where, (await placeText('en', 'Sardinia / Corsica')).where);
    assert.ok(hrefs(nav).includes(buildSearchLandingPath('Olbia', 'CATAMARAN')), hrefs(nav).join('\n'));
  });
});

describe('regionHubAbove: the breadcrumb region comes from every row of the place', () => {
  test('Marina di Golfo Aranci (first row MMK l-1550, only in Sardinia / Corsica) crumbs Sardinia', async () => {
    // Both regions are indexable; the most specific (smallest fleet) wins,
    // and Sardinia is reached only through the NauSYS row l-411.
    const crumbs = await landingCrumbs('Marina di Golfo Aranci', null, 'en');

    assert.deepEqual(
      crumbs.map(c => c.path),
      [
        '/',
        buildSearchLandingPath('Italy'),
        buildSearchLandingPath('Sardinia'),
        buildSearchLandingPath('Marina di Golfo Aranci'),
      ]
    );
  });
});

describe('itinerariesFor: the itinerary areas of every row of the place', () => {
  const itineraryHrefs = nav => nav.itineraries.map(l => l.href);

  test('Olympic Marina keeps the Cyclades itinerary (only MMK l-710 is in Cyclades; NauSYS l-139 sorts first)', async () => {
    // Live 13.10.2026 the landing lists l-710 alone and links /itineraries/cyclades.
    const nav = await landingNav('Olympic Marina', 'SAILING_YACHT', 'en', Promise.resolve([]));

    assert.ok(itineraryHrefs(nav).includes('/itineraries/cyclades'), itineraryHrefs(nav).join('\n'));
  });

  test('Marina di Golfo Aranci links the Sardinia itinerary (only NauSYS l-411 is in Sardinia)', async () => {
    const nav = await landingNav('Marina di Golfo Aranci', 'CATAMARAN', 'en', Promise.resolve([]));

    assert.ok(itineraryHrefs(nav).includes('/itineraries/sardinia'), itineraryHrefs(nav).join('\n'));
  });

  test('Olympic Marina still crumbs Cyclades, as live today', async () => {
    const crumbs = await landingCrumbs('Olympic Marina', null, 'en');

    assert.deepEqual(
      crumbs.map(c => c.path),
      [
        '/',
        buildSearchLandingPath('Greece'),
        buildSearchLandingPath('Cyclades'),
        buildSearchLandingPath('Olympic Marina'),
      ]
    );
  });
});
