/**
 * Partner equipment → our catalogue on the public site (equipment-link fix,
 * 8.10.2026, Mario's decisions b–d):
 *   - only rows linked to a catalogue code are public — an unlinked partner
 *     item ("Wi-Fi & Internet" with no equipment) shows nowhere: boat page,
 *     my-bookings, availability card, PDF, nor the RSC payload;
 *   - merged codes (bow-thruster-deck → bow-thruster, refrigerator → fridge,
 *     sundeck-cushions → sun-pads) stay resolvable and read as the surviving
 *     code: page, search card, PDF, filter chip (one per surviving code) and
 *     selection;
 *   - the new code depth-sounder and the plain life-buoy label in all 9 locales.
 *
 *   yarn test:equipment
 */
import { createElement } from 'react';
import { renderToStaticMarkup } from 'react-dom/server';

import { NextIntlClientProvider } from 'next-intl';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { registerHooks } from 'node:module';
import { describe, test } from 'node:test';
import { fileURLToPath } from 'node:url';

import './tsLoader.mjs';

// partnerYacht.ts is server-only; `server-only` throws outside a React server bundle.
registerHooks({
  resolve: (specifier, context, nextResolve) =>
    specifier === 'server-only'
      ? { url: 'data:text/javascript,export {};', shortCircuit: true }
      : nextResolve(specifier, context),
});

const ROOT = fileURLToPath(new URL('../', import.meta.url));
const readJson = path => JSON.parse(readFileSync(`${ROOT}${path}`, 'utf8'));

const { canonicalEquipmentCode, presentAmenities, presentAmenityLabels } = await import('@/utils/static/amenities');
const { withSafePartnerText } = await import('@/utils/server/partnerYacht');
const { default: AmenitiesTab } = await import('@/views/Boat/BoatContentSection/AmenitiesTab/AmenitiesTab');
const { default: ReservationAmenitiesTab } =
  await import('@/views/MyBookings/ReservationDetails/ReservationContent/ReservationInfoSection/AmenitiesTab/AmenitiesTab');
const { default: AppliedFilterChips } =
  await import('@/views/Search/SearchView/FiltersSectionV2/atoms/AppliedFilterChips');

const LOCALES = ['en', 'de', 'es', 'fr', 'hr', 'it', 'nl', 'pl', 'pt'];
const MERGED = { 'bow-thruster-deck': 'bow-thruster', refrigerator: 'fridge', 'sundeck-cushions': 'sun-pads' };
const yachtMessages = Object.fromEntries(LOCALES.map(l => [l, readJson(`messages/${l}/yacht.json`)]));
const messagesFor = locale =>
  Object.fromEntries(['common', 'filters', 'yacht'].map(ns => [ns, readJson(`messages/${locale}/${ns}.json`)]));

const eq = (id, labelCode, category) => ({ id, labelCode, category, filterOrder: 0 });
const row = (id, name, equipment, extra = {}) => ({ id, name, equipment, comment: null, quantity: null, ...extra });

// One boat as the API may send it around the deploy: a linked WiFi, the same
// partner item unlinked, both fridge codes, only the old bow-thruster code, the
// new depth-sounder, a life buoy, an absent radar and a code this build has no
// translation for yet.
const AMENITIES = [
  row(1, 'Wi-Fi', eq(58, 'wifi', 'COMFORT')),
  row(2, 'Wi-Fi & Internet', null),
  row(3, 'Stove', null, { comment: '4 burners' }),
  row(4, 'Refrigerator', eq(90, 'refrigerator', 'GALLEY'), { comment: '130 L' }),
  row(5, 'Fridge', eq(14, 'fridge', 'GALLEY')),
  row(6, 'Bow thruster', eq(65, 'bow-thruster-deck', 'DECK')),
  row(7, 'Depth sounder', eq(108, 'depth-sounder', 'NAVIGATION')),
  row(8, 'Life buoy + light', eq(98, 'life-buoy', 'SAFETY')),
  row(9, 'Radar', eq(32, 'radar', 'NAVIGATION'), { comment: 'false' }),
  row(10, 'Future gadget', eq(999, 'future-gadget', 'COMFORT')),
];

const text = html =>
  html
    .replace(/<[^>]+>/g, ' ')
    .replace(/&amp;/g, '&')
    .replace(/&#x27;|&#39;/g, "'")
    .replace(/\s+/g, ' ');
const provide = (locale, element) =>
  renderToStaticMarkup(
    createElement(
      NextIntlClientProvider,
      {
        locale,
        messages: messagesFor(locale),
        timeZone: 'Europe/Zagreb',
        // A missing message must fail the test, not print "yacht.amenitiesList.<code>".
        onError: error => {
          throw error;
        },
      },
      element
    )
  );
const count = (haystack, needle) => haystack.split(needle).length - 1;

describe('messages: depth-sounder new, life-buoy plain, merged codes kept (9 locales)', () => {
  test('every locale has the same amenitiesList codes', () => {
    const codes = Object.keys(yachtMessages.en.amenitiesList).sort();

    LOCALES.forEach(l => assert.deepEqual(Object.keys(yachtMessages[l].amenitiesList).sort(), codes, l));
  });

  test('depth-sounder and life-buoy are translated, never English outside en, no "+ light"', () => {
    const en = yachtMessages.en.amenitiesList;

    assert.equal(en['depth-sounder'], 'Depth sounder');
    assert.equal(en['life-buoy'], 'Life buoy');
    LOCALES.forEach(l => {
      const list = yachtMessages[l].amenitiesList;

      ['depth-sounder', 'life-buoy'].forEach(code => {
        assert.ok(list[code]?.trim(), `${l} ${code}`);

        if (l !== 'en') assert.notEqual(list[code], en[code], `${l} ${code} is English`);
      });
      assert.doesNotMatch(list['life-buoy'], /\+/, l);
    });
  });

  test('the old (merged) codes keep their translation — ISR pages may still carry them', () => {
    LOCALES.forEach(l =>
      Object.keys(MERGED).forEach(code => assert.ok(yachtMessages[l].amenitiesList[code]?.trim(), `${l} ${code}`))
    );
  });
});

describe('presentAmenities: linked rows only, merged codes canonical, one row per code', () => {
  test('unlinked and absent rows are dropped; merged codes read as the surviving one', () => {
    const rows = presentAmenities(AMENITIES);

    assert.deepEqual(
      rows.map(r => r.equipment.labelCode),
      ['wifi', 'fridge', 'bow-thruster', 'depth-sounder', 'life-buoy', 'future-gadget']
    );
    // The first fridge row wins (with its comment); the old bow-thruster code takes the surviving category.
    assert.equal(rows[1].comment, '130 L');
    assert.equal(rows.find(r => r.equipment.labelCode === 'bow-thruster').equipment.category, 'NAVIGATION');
    assert.ok(rows.every(r => r.equipment));
  });

  test('canonicalEquipmentCode: merged → surviving, anything else unchanged', () => {
    Object.entries(MERGED).forEach(([old, kept]) => assert.equal(canonicalEquipmentCode(old), kept));
    ['fridge', 'bow-thruster', 'sun-pads', 'wifi', 'depth-sounder'].forEach(code =>
      assert.equal(canonicalEquipmentCode(code), code)
    );
  });

  test('PDF labels: our English label per linked code, never the partner name of an unlinked row', () => {
    const labels = presentAmenityLabels(AMENITIES, yachtMessages.en.amenitiesList);

    assert.deepEqual(labels, ['WiFi', 'Fridge', 'Bow thruster', 'Depth sounder', 'Life buoy', 'Future gadget']);
    assert.ok(!labels.includes('Wi-Fi & Internet') && !labels.includes('Stove') && !labels.includes('Refrigerator'));
  });

  test('server payload (withSafePartnerText) carries no unlinked partner item', () => {
    const yacht = withSafePartnerText({ custom: false, amenities: AMENITIES, services: [], offers: [] });
    const names = yacht.amenities.map(a => a.name);

    assert.ok(yacht.amenities.every(a => a.equipment?.labelCode));
    assert.ok(!names.includes('Wi-Fi & Internet') && !names.includes('Stove'));
    assert.ok(!names.includes('Radar'), 'absent row');
  });
});

describe('boat page and my-bookings equipment lists', () => {
  test('de: translated catalogue labels, merged codes once, no unlinked text, no next-intl key', () => {
    const page = text(provide('de', createElement(AmenitiesTab, { yacht: { custom: false, amenities: AMENITIES } })));

    ['WLAN', 'Kühlschrank', 'Bugstrahlruder', 'Echolot', 'Rettungsring', '130 L'].forEach(label =>
      assert.ok(page.includes(label), label)
    );
    assert.equal(count(page, 'Kühlschrank'), 1);
    assert.equal(count(page, 'Bugstrahlruder'), 1);
    ['Wi-Fi & Internet', 'Stove', '4 burners', 'Blinklicht', 'Radar', 'yacht.amenitiesList', 'Deck'].forEach(bad =>
      assert.ok(!page.includes(bad), bad)
    );
    // A code without a translation in this build shows the partner's name.
    assert.ok(page.includes('Future gadget'));
  });

  test('only unlinked partner rows → the section is not rendered at all (no catch-all "Deck")', () => {
    const unlinked = [row(1, 'Wi-Fi & Internet', null), row(2, 'Anchor with chain', null)];

    assert.equal(provide('en', createElement(AmenitiesTab, { yacht: { custom: false, amenities: unlinked } })), '');
    assert.equal(
      provide('en', createElement(ReservationAmenitiesTab, { reservationDetails: { amenities: unlinked } })),
      ''
    );
  });

  test('my-bookings (en): same rules as the boat page', () => {
    const page = text(
      provide('en', createElement(ReservationAmenitiesTab, { reservationDetails: { amenities: AMENITIES } }))
    );

    ['WiFi', 'Fridge', 'Bow thruster', 'Depth sounder', 'Life buoy'].forEach(label =>
      assert.ok(page.includes(label), label)
    );
    assert.equal(count(page, 'Fridge'), 1);
    ['Wi-Fi & Internet', 'Stove', 'Refrigerator', 'Flashing light', 'yacht.amenitiesList'].forEach(bad =>
      assert.ok(!page.includes(bad), bad)
    );
  });
});

describe('search filter chips: the catalogue code reads translated, a merged code as its surviving one', () => {
  test('de: "Klimaanlage" and "Kühlschrank", never the raw code', () => {
    const html = text(
      provide(
        'de',
        createElement(AppliedFilterChips, {
          params: { amenities: [1, 90], amenityLabels: ['air-conditioning', 'refrigerator'] },
          setMultipleParams: () => {},
        })
      )
    );

    assert.ok(html.includes('Klimaanlage') && html.includes('Kühlschrank'), html);
    assert.ok(!html.includes('air-conditioning') && !html.includes('refrigerator'), html);
  });

  test('a merged code beside its surviving one is one chip ("fridge,refrigerator" → one "Kühlschrank")', () => {
    const html = text(
      provide(
        'de',
        createElement(AppliedFilterChips, {
          params: { amenities: [14, 90, 1], amenityLabels: ['fridge', 'refrigerator', 'air-conditioning'] },
          setMultipleParams: () => {},
        })
      )
    );

    assert.equal(count(html, 'Kühlschrank'), 1, html);
    assert.equal(count(html, 'Klimaanlage'), 1, html);
  });
});
