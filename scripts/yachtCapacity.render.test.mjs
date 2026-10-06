/**
 * Render test for the yacht capacity on the boat page (capacity contract v1):
 * the real DetailsTab (spec grid + description), server-rendered with React and
 * next-intl's provider, fed with the contract's reference payloads — the new
 * `capacity` / `rig` blocks (Dione II, Marea) resolved the way the boat page
 * resolves them (note table + operator list), and an older backend's flat
 * fields (Le Petite Prince today).
 *
 *   yarn test:capacity
 */
import { createElement } from 'react';
import { renderToStaticMarkup } from 'react-dom/server';

import { NextIntlClientProvider } from 'next-intl';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { describe, test } from 'node:test';
import { fileURLToPath } from 'node:url';

import './tsLoader.mjs';

const ROOT = fileURLToPath(new URL('../', import.meta.url));
const readJson = path => JSON.parse(readFileSync(`${ROOT}${path}`, 'utf8'));

const { default: DetailsTab } = await import('@/views/Boat/BoatContentSection/DetailsTab/DetailsTab');
const { fromYacht } = await import('@/utils/static/yachtCapacity');
const { loadCapacityNoteLookup } = await import('@/utils/static/capacityNoteTable');
const { isOperatorName } = await import('@/utils/static/operatorNames');

const REF = readJson('scripts/fixtures/capacity-reference-boats.json');
const messagesFor = locale =>
  Object.fromEntries(
    ['common', 'filters', 'yacht', 'capacity'].map(ns => [ns, readJson(`messages/${locale}/${ns}.json`)])
  );

const baseYacht = {
  slug: 'test-boat',
  vesselType: 'CATAMARAN',
  location: { name: 'Lefkada', countryCode: 'GR' },
  buildYear: 2025,
  length: 15.2,
  lengthInfo: { unit: 'METRE', amount: 15.2 },
  beam: 8.1,
  beamInfo: { unit: 'METRE', amount: 8.1 },
  fuelTank: 700,
  waterTank: 600,
  amenities: [],
  services: [],
  offers: [],
  custom: false,
  hasBookableFutureOffer: true,
};
const dione = {
  ...baseYacht,
  id: 8351,
  name: 'Dione II',
  model: 'Aura 51',
  charterType: ['CREWED', 'BAREBOAT'],
  // Flat fields as the backend keeps sending them next to the new blocks.
  cabins: 6,
  berths: 13,
  wc: 6,
  maxPersons: 14,
  crewNumber: 1,
  enginePower: 120,
  mainSailType: 'CLASSIC_SAIL',
  ...REF.dione.detail,
};
// Le Petite Prince - OW (NauSys, live 1161) from today's API: flat fields only.
const lppToday = {
  ...baseYacht,
  id: 1161,
  name: 'Le Petite Prince - OW',
  model: 'Bali Catsmart OW',
  charterType: ['BAREBOAT'],
  cabins: 3,
  berths: 8,
  wc: 2,
  maxPersons: null,
  crewNumber: null,
  enginePower: 60,
  mainSailType: 'ROLLING_SAIL',
};

const render = async (yacht, locale) => {
  const capacity = fromYacht(yacht, {
    locale,
    noteLookup: await loadCapacityNoteLookup(locale),
    findOperatorName: text => isOperatorName(text),
  });

  return renderToStaticMarkup(
    createElement(
      NextIntlClientProvider,
      { locale, messages: messagesFor(locale), timeZone: 'Europe/Zagreb' },
      createElement(DetailsTab, { yacht, capacity })
    )
  );
};
const text = html =>
  html
    .replace(/<[^>]+>/g, ' ')
    .replace(/&amp;/g, '&')
    .replace(/&#x27;|&#39;/g, "'")
    .replace(/\s+/g, ' ');

describe('boat page DetailsTab with the new capacity / rig blocks', () => {
  test('Dione II (en): partner notes verbatim, crew labelled, sails and engine from the rig, honest prose', async () => {
    const html = await render(dione, 'en');
    const page = text(html);

    [
      'Cabins 6 (5 double +1 for the hostess + 1 bow/skippers cabin)',
      'Berths 13 (12 pax + 1 Crew)',
      'WC 6 (5+1 for the crew)',
      'Max. people on board 14',
      'Crew (crewed charter) 1',
      'Mainsail Full batten',
      'Headsail Furling',
      'Engine 2x60HP',
      'Draught 1.3 m',
    ].forEach(row => assert.ok(page.includes(row), `row: ${row}\n${page}`));
    assert.ok(/13 berths|13 people/.test(page), page);
    assert.ok(!/berths? (in|across) \d+ cabins|people in \d+ cabins|cabins with \d+ berths/.test(page), page);
    assert.ok(/Up to 14 people can be on board\.|takes a maximum of 14 people on board\./.test(page), page);
    ['Rolling mainsail', '120 hp', 'with a shower', 'Pillows and blankets are included', 'sleeps up to 14'].forEach(
      wrong => assert.ok(!page.includes(wrong), `must not say: ${wrong}`)
    );
    assert.ok(!/\bnull\b|NaN|undefined/.test(page));
  });

  test('Dione II (de): reviewed note translations, the partner engine label marked English', async () => {
    const html = await render(dione, 'de');
    const page = text(html);

    [
      'Kabinen 6 (5 Doppelkabinen +1 für die Hostess + 1 Bug-/Skipperkabine)',
      'Kojen 13 (12 Gäste + 1 Crew)',
      'Tiefgang 1,3 m',
    ].forEach(row => assert.ok(page.includes(row), `row: ${row}\n${page}`));
    assert.ok(html.includes('<span lang="en">2x60HP</span>'), 'engine label in lang="en"');
    assert.ok(!html.includes('lang="en">(12 pax'), 'translated note is not marked English');
  });

  test('Dione II (pl): Polish plural forms in the rows and the paragraph', async () => {
    const page = text(await render(dione, 'pl'));

    assert.ok(/13 koi|13 osób/.test(page), page);
    assert.ok(!/koi w 6 kabinach/.test(page), page);
    assert.ok(page.includes('Maks. osób na pokładzie 14'), page);
  });

  test('Marea (de): crew cabins and crew WC as their own rows, never added to cabins / WC', async () => {
    const marea = {
      ...baseYacht,
      id: 1155,
      name: 'Marea',
      model: 'Lagoon 52',
      charterType: ['ALL_INCLUSIVE', 'CREWED'],
      ...REF.marea.detail,
    };
    const page = text(await render(marea, 'de'));

    [
      'Kabinen 5',
      'Crew-Kabinen 2',
      'Kojen 12 (10 in Kabinen + 2 Crew)',
      'WC 5',
      'Crew-WC 2',
      'Max. Personen an Bord 12 (empfohlen: 10)',
      'Motor 2 × 115 PS',
    ].forEach(row => assert.ok(page.includes(row), `row: ${row}\n${page}`));
    assert.ok(!page.includes('Kabinen 7'));
  });
});

describe("boat page DetailsTab on today's API (no capacity / rig)", () => {
  test('Le Petite Prince (en): numbers only — no estimate, no filter-enum sail, no filter engine power', async () => {
    const page = text(await render(lppToday, 'en'));

    ['Cabins 3', 'Berths 8', 'WC 2'].forEach(row => assert.ok(page.includes(row), `row: ${row}\n${page}`));
    [
      'Rolling mainsail',
      'Mainsail',
      '60 hp',
      'Max. people',
      'with a shower',
      'Pillows and blankets are included',
    ].forEach(wrong => assert.ok(!page.includes(wrong), `must not say: ${wrong}`));
    assert.ok(
      /has 8 berths and 3 cabins|are 8 berths and 3 cabins|3 cabins and 8 berths in total|has 3 cabins and sleeps up to 8 people|3 cabins and 8 berths/.test(
        page
      ),
      page
    );
    assert.ok(!/berths? (in|across) 3 cabins|people in 3 cabins|cabins with 8 berths/.test(page), page);
  });
});
