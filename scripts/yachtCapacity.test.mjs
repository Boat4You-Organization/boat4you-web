/**
 * Yacht capacity on b4y (capacity contract v1, 6.10.2026): the shared
 * formatter src/utils/static/yachtCapacity.ts (a byte-identical copy across
 * b4y, the 6 sisters and the admin), wired to next-intl's real translator, the
 * per-locale note tables, the `capacity` messages, the accommodation / FAQ
 * prose and the meta numbers.
 *
 * scripts/fixtures/capacity-reference-boats.json is the contract's
 * expectations/reference_boats.json: 7 reference boats (Dione II, Jangada MMK +
 * its NauSys twin, PNOE, Le Petite Prince, Marea, Corali) as the backend will
 * send them (`detail` = capacity + rig, `search` = the search row's capacity)
 * and their rows / chips / card chips in all 9 locales.
 *
 *   yarn test:capacity
 */
import { createTranslator } from 'next-intl';
import assert from 'node:assert/strict';
import { readFileSync, readdirSync } from 'node:fs';
import { registerHooks } from 'node:module';
import { describe, test } from 'node:test';
import { fileURLToPath } from 'node:url';

import './tsLoader.mjs';

// src/utils/server/yachtCapacity.ts outside Next: 'server-only' and next-intl/server (next/headers) are stubbed.
registerHooks({
  resolve: (specifier, context, nextResolve) =>
    specifier === 'server-only' || specifier === 'next-intl/server'
      ? {
          url: 'data:text/javascript,export const getTranslations = () => null; export default {};',
          shortCircuit: true,
        }
      : nextResolve(specifier, context),
});

const ROOT = fileURLToPath(new URL('../', import.meta.url));

const F = await import('@/utils/static/yachtCapacity');
const { capacityFmt } = await import('@/utils/static/capacityFmt');
const { CAPACITY_NOTE_LOCALES, loadCapacityNoteLookup } = await import('@/utils/static/capacityNoteTable');
const { accommodationProse, shownGuestBerths } = await import('@/utils/static/capacityProse');
const { isOperatorName } = await import('@/utils/static/operatorNames');
const { buildYachtFaq } = await import('@/utils/static/yachtFaq');
const { buildBoatDescription } = await import('@/utils/static/boatMetaDescription');

const LOCALES = ['en', 'de', 'es', 'fr', 'hr', 'it', 'nl', 'pl', 'pt'];
const PARTNER_ID_KEY_RX = /agency|external|partner|company|source|mmk|nausys|operator/i;
const readJson = path => JSON.parse(readFileSync(`${ROOT}${path}`, 'utf8'));
const messages = Object.fromEntries(
  LOCALES.map(l => [
    l,
    {
      capacity: readJson(`messages/${l}/capacity.json`),
      yacht: readJson(`messages/${l}/yacht.json`),
      metadata: readJson(`messages/${l}/metadata.json`),
    },
  ])
);
// next-intl's own translator (the same ICU engine the pages run), as the formatter's Fmt.
const translator = (l, namespace) => createTranslator({ locale: l, messages: messages[l], namespace });
const fmts = Object.fromEntries(LOCALES.map(l => [l, capacityFmt(translator(l, 'capacity'))]));
const lookups = Object.fromEntries(await Promise.all(LOCALES.map(async l => [l, await loadCapacityNoteLookup(l)])));
const REF = readJson('scripts/fixtures/capacity-reference-boats.json');
const CHARTER_TYPES = {
  dione: ['CREWED', 'BAREBOAT'],
  jangadaMmk: ['BAREBOAT'],
  jangadaNs: ['BAREBOAT'],
  pnoe: ['BAREBOAT'],
  lpp: ['BAREBOAT'],
  marea: ['ALL_INCLUSIVE', 'CREWED'],
  corali: ['CREWED'],
};
// As the boat page resolves it on the server (utils/server/yachtCapacity.ts).
const view = (yacht, l) =>
  F.fromYacht(yacht, { locale: l, noteLookup: lookups[l], findOperatorName: text => isOperatorName(text) });
const detail = key => ({ ...REF[key].detail, charterType: CHARTER_TYPES[key] });
const searchRow = key => ({ capacity: REF[key].search, charterType: CHARTER_TYPES[key][0] });
const keyPaths = (obj, prefix = '') =>
  Object.entries(obj)
    .flatMap(([k, v]) => (v && typeof v === 'object' ? keyPaths(v, `${prefix}${k}.`) : [`${prefix}${k}`]))
    .sort();
const leafValues = obj => Object.values(obj).flatMap(v => (v && typeof v === 'object' ? leafValues(v) : [v]));

describe('messages/<locale>/capacity.json', () => {
  test('key parity across the 9 locales, valid ICU, plural forms cover each locale', () => {
    const en = keyPaths(messages.en.capacity);

    LOCALES.forEach(l => {
      assert.deepEqual(keyPaths(messages[l].capacity), en, l);
      leafValues(messages[l].capacity).forEach(message => {
        assert.ok(typeof message === 'string' && message.trim(), `${l}: empty message`);
        F.validateIcu(message);
        F.icuPlurals(message).forEach(({ arg, options }) => {
          F.pluralCategories(l).forEach(category =>
            assert.ok(options.includes(category) || options.includes('other'), `${l} ${arg}: ${category}`)
          );
        });
      });
    });
  });

  test('nautical terms kept: es Literas, pt Beliches, pl Koje, de Kojen; WC stays "WC"', () => {
    assert.equal(messages.es.capacity.label.berths, 'Literas');
    assert.equal(messages.pt.capacity.label.berths, 'Beliches');
    assert.equal(messages.pl.capacity.label.berths, 'Koje');
    assert.equal(messages.de.capacity.label.berths, 'Kojen');
    LOCALES.forEach(l => assert.equal(messages[l].capacity.label.heads, 'WC', l));
  });
});

describe('note tables (src/utils/static/capacityNotes/<locale>.json)', () => {
  const dir = `${ROOT}src/utils/static/capacityNotes/`;
  // Capacity contract v2 (8.10.2026): every word note on prod, less the 22 the sanitizer hides everywhere.
  const V2_NOTES = 1446;
  // A translation may run longer than the English it replaces (CAPACITY_NOTE_MAX = 120 is about partner prose):
  // the sanitizer's word / contact rules run over word-aligned pieces of at most that length.
  const pieces = text => {
    const out = [];

    text.split(' ').forEach(word => {
      const joined = out.length ? `${out[out.length - 1]} ${word}` : word;

      if (out.length && joined.length <= F.CAPACITY_NOTE_MAX) out[out.length - 1] = joined;
      else out.push(word);
    });

    return out;
  };

  test('one slice per non-English locale, the same v2 notes in each, each carrying only its own locale', () => {
    assert.deepEqual(readdirSync(dir).sort(), CAPACITY_NOTE_LOCALES.map(l => `${l}.json`).sort());

    const notes = Object.keys(readJson('src/utils/static/capacityNotes/de.json'));

    assert.equal(notes.length, V2_NOTES);
    CAPACITY_NOTE_LOCALES.forEach(l => {
      const slice = readJson(`src/utils/static/capacityNotes/${l}.json`);

      assert.deepEqual(Object.keys(slice), notes, l);
      Object.entries(slice).forEach(([note, entry]) => {
        assert.deepEqual(Object.keys(entry).sort(), ['dims', l].sort(), `${l}: ${note}`);
        assert.ok(entry.dims.length && entry.dims.every(d => ['cabins', 'berths', 'heads'].includes(d)), note);
        assert.ok(!F.isLanguageNeutral(note), `${l}: neutral note in the table: ${note}`);
        assert.equal(F.normalizeNote(note), note, `${l}: key not normalized: ${note}`);
        assert.ok(typeof entry[l] === 'string' && entry[l] === entry[l].trim() && entry[l], `${l}: empty: ${note}`);
      });
    });
  });

  test("every note passes the sanitizer with b4y's operator list, unchanged; so does every translation", () => {
    CAPACITY_NOTE_LOCALES.forEach(l => {
      Object.entries(readJson(`src/utils/static/capacityNotes/${l}.json`)).forEach(([note, entry]) => {
        assert.equal(
          F.safeCapacityNote(note, t => isOperatorName(t)),
          note,
          `${l}: hidden note in the table: ${note}`
        );
        pieces(entry[l]).forEach(piece =>
          assert.equal(
            F.safeCapacityNote(piece, t => isOperatorName(t)),
            piece,
            `${l}: ${entry[l]}`
          )
        );
      });
    });
  });

  test('translations keep every number, sign and bracket of the note in order, and its leading sign', () => {
    const numbers = text => text.match(/\d+/g) ?? [];
    const signs = text => text.replace(/[^+/()[\]{}]/g, '');

    CAPACITY_NOTE_LOCALES.forEach(l => {
      Object.entries(readJson(`src/utils/static/capacityNotes/${l}.json`)).forEach(([note, entry]) => {
        assert.deepEqual(numbers(entry[l]), numbers(note), `${l}: ${note} -> ${entry[l]}`);
        assert.equal(signs(entry[l]), signs(note), `${l}: ${note} -> ${entry[l]}`);

        if (/^[-+(/[]/.test(note)) assert.equal(entry[l][0], note[0], `${l}: ${note} -> ${entry[l]}`);
      });
    });
  });

  test('Aquila 50 (MMK, 19701) on a German page: the reviewed v2 notes, not English', () => {
    const aquila = {
      charterType: ['CREWED'],
      capacity: {
        cabins: { value: 5, note: 'for clients + 1 crew', split: null },
        berths: { value: 10, note: '+ 2 crew', split: null },
        heads: { value: 5, note: 'for clients + 1 crew', split: null },
      },
    };
    const rows = l => F.capacityRows(view(aquila, l), fmts[l]).map(r => `${r.label} ${r.value}`);

    assert.deepEqual(rows('de'), ['Kabinen 5 (für Gäste + 1 Crew)', 'Kojen 10 + 2 Crew', 'WC 5 (für Gäste + 1 Crew)']);
    assert.deepEqual(rows('en'), [
      'Cabins 5 (for clients + 1 crew)',
      'Berths 10 + 2 crew',
      'WC 5 (for clients + 1 crew)',
    ]);
    assert.ok(F.capacityRows(view(aquila, 'de'), fmts.de).every(r => r.segments.every(s => !s.lang)));
    CAPACITY_NOTE_LOCALES.forEach(l => assert.equal(view(aquila, l).cabins.note.lang, null, l));
  });

  test('a note the sanitizer hides (v2 "hidden": "sanitizer", e.g. "owner\'s") shows the number only', () => {
    LOCALES.forEach(l => {
      const c = view({ capacity: { cabins: { value: 5, note: "(4 double cabins + 1 owner's cabin + 2 crew)" } } }, l);

      assert.deepEqual(c.cabins, { value: 5, note: null, split: null }, l);
      assert.deepEqual(
        F.capacityRows(c, fmts[l]).map(r => r.value),
        ['5'],
        l
      );
    });
  });

  test('a translation is used only for the dimensions it was reviewed for', () => {
    // "(12 pax + 1 Crew)" is reviewed for berths only: on cabins it stays English (lang="en").
    const note = '(12 pax + 1 Crew)';
    const c = F.fromYacht(
      { capacity: { berths: { value: 13, note }, cabins: { value: 6, note } } },
      { locale: 'de', noteLookup: lookups.de }
    );

    assert.deepEqual(readJson('src/utils/static/capacityNotes/de.json')[note].dims, ['berths']);
    assert.deepEqual(c.berths.note, { en: note, text: '(12 Gäste + 1 Crew)', lang: null, short: false });
    assert.deepEqual(c.cabins.note, { en: note, text: note, lang: 'en', short: false });
  });

  test('English pages need no table; an unseen note stays English with lang="en"', async () => {
    assert.equal(await loadCapacityNoteLookup('en'), undefined);

    const note = '(two convertible saloon berths)';
    const c = F.fromYacht({ capacity: { berths: { value: 9, note } } }, { locale: 'de', noteLookup: lookups.de });

    assert.deepEqual(c.berths.note, { en: note, text: note, lang: 'en', short: false });
  });
});

describe('the 7 reference boats render as the contract says, with next-intl and the b4y note tables', () => {
  Object.keys(REF).forEach(key => {
    test(key, () => {
      LOCALES.forEach(l => {
        const expected = REF[key].render[l];
        const rows = F.capacityRows(view(detail(key), l), fmts[l]).map(r => ({
          key: r.key,
          label: r.label,
          value: r.value,
          ...(r.segments.some(s => s.lang) ? { segments: r.segments } : {}),
        }));

        assert.deepEqual(rows, expected.rows, `${key} ${l} rows`);
        assert.deepEqual(
          F.capacityChips(view(detail(key), l), fmts[l]).map(c => c.text),
          expected.chips,
          `${key} ${l} chips`
        );
        assert.deepEqual(F.cardChips(view(searchRow(key), l), fmts[l]), expected.card, `${key} ${l} card`);
      });
    });
  });

  test("public capacity keys never match the sisters' partner-id filter", () => {
    const keys = new Set();
    const walk = obj =>
      Object.entries(obj ?? {}).forEach(([k, v]) => {
        keys.add(k);

        if (v && typeof v === 'object') walk(v);
      });

    Object.values(REF).forEach(boat => {
      walk(boat.detail);
      walk(boat.search);
    });
    keys.forEach(k => assert.ok(!PARTNER_ID_KEY_RX.test(k), k));
  });
});

describe('an older backend (no capacity / rig): numbers only', () => {
  // Le Petite Prince - OW (NauSys, live 1161) as the live API sends it today.
  const lpp = {
    cabins: 3,
    berths: 8,
    wc: 2,
    maxPersons: null,
    crewNumber: null,
    enginePower: 60,
    mainSailType: 'ROLLING_SAIL',
  };

  test('card: Cabins 3 · Berths 8 — no people estimate (was cabins × 2 + 2 = 8 people)', () => {
    assert.deepEqual(F.cardChips(F.fromYacht(lpp, { locale: 'en' }), fmts.en), [
      { key: 'cabins', label: 'Cabins', value: '3' },
      { key: 'berths', label: 'Berths', value: '8' },
    ]);
  });

  test('a search row of an older backend (no berths) shows cabins and max. people only', () => {
    assert.deepEqual(
      F.cardChips(F.fromYacht({ cabins: 6, maxPersons: null }, { locale: 'de' }), fmts.de).map(c => c.key),
      ['cabins']
    );
  });

  test('spec rows: no sail (filter enum), no partner engine (filter value), no "null" / "0"', () => {
    const rows = F.capacityRows(F.fromYacht({ ...lpp, wc: 0 }, { locale: 'en' }), fmts.en);

    assert.deepEqual(
      rows.map(r => `${r.label}: ${r.value}`),
      ['Cabins: 3', 'Berths: 8']
    );
  });

  test('custom yacht: engineText before enginePower; the crew only for a crewed charter', () => {
    const custom = {
      custom: true,
      cabins: 5,
      crewNumber: 3,
      enginePower: 1600,
      customDetails: { engineText: '2x Volvo IPS 1050' },
      charterType: ['CREWED'],
    };
    const rows = F.capacityRows(F.fromYacht(custom, { locale: 'en' }), fmts.en);

    assert.equal(rows.find(r => r.key === 'engine').value, '2x Volvo IPS 1050');
    assert.equal(rows.find(r => r.key === 'crew').value, '3');
    assert.equal(
      F.capacityRows(F.fromYacht({ ...custom, charterType: ['BAREBOAT'] }, { locale: 'en' }), fmts.en).some(
        r => r.key === 'crew'
      ),
      false
    );
  });
});

describe('boat description, FAQ and meta (capacity contract 7.4)', () => {
  const dione = { id: 8351, name: 'Dione II', model: 'Aura 51', ...detail('dione'), offers: [] };
  const facts = l => F.capacityFacts(view(detail('dione'), l));
  const markup = (l, key, values) =>
    translator(l, 'yacht').markup(key, { ...values, b: chunks => chunks, engineLabel: chunks => chunks });

  test('no promise of bedding, no shower per toilet, no "certified", no "bathrooms" claim left in the copy', () => {
    LOCALES.forEach(l => {
      const yacht = JSON.stringify(messages[l].yacht);

      // "certified for N" capacity claims (the VHF licence "certificate" is fine).
      assert.ok(
        !/\bcertified\b|zertifiziert|certifiée?s?\b|gecertificeerd|certyfikowan|certificiran|omologat/i.test(yacht),
        l
      );
    });

    const en = JSON.stringify(messages.en.yacht);

    [
      'Pillows and blankets are included',
      'with a shower',
      'with showers',
      'shower-equipped',
      'bedding is included',
    ].forEach(claim => assert.ok(!en.includes(claim), claim));
    assert.ok(
      !/\{engine\} (hp|PS|KS|KM|CV|ch|pk|cv)\b/.test(LOCALES.map(l => JSON.stringify(messages[l].yacht)).join())
    );
  });

  test('every new sentence renders in every locale for 1 / 2 / 5 / 13 / 22 (no braces, no NaN)', () => {
    const keys = Object.keys(messages.en.yacht).filter(k =>
      /^(descLayout|descHeads|descOnBoard|descBedding|descSpecsV|faqSleeps|faqOnBoard)/.test(k)
    );

    // layout 7, WC 2, on board 2, bedding 3, specs 5, FAQ sleeps 6 (Q, A0-A2, no cabins, no berths), on board 1
    assert.equal(keys.length, 7 + 2 + 2 + 3 + 5 + 6 + 1);
    LOCALES.forEach(l => {
      keys.forEach(key => {
        [1, 2, 5, 13, 22].forEach(n => {
          [0, n].forEach(extra => {
            const out = markup(l, key, {
              name: 'Dione II',
              cabins: n,
              berths: n + 1,
              guestBerths: extra,
              wc: n,
              showers: extra,
              maxPersons: n,
              length: '15.2 m',
              beam: '8.1 m',
              engine: '2 × 115 hp',
              fuel: '700',
              water: '600',
            });

            assert.ok(out && !/[{}]|NaN|undefined|null/.test(out), `${l} ${key} ${n}/${extra}: ${out}`);
          });
        });
      });
    });
  });

  test('Dione II paragraph: 13 berths, 12 of them for guests, 6 toilets, max. 14 on board (en, de, pl, hr)', () => {
    const parts = l =>
      accommodationProse(facts(l), () => 0).map(p => markup(l, p.key, { ...p.values, name: 'Dione II' }));

    assert.deepEqual(parts('en'), [
      'Dione II has 13 berths (12 of them for guests) and 6 cabins.',
      'There are 6 toilets on board.',
      'Up to 14 people can be on board.',
      'Bed linen, pillows and blankets come with some boats and are rented at the base on others — ask us and we will tell you how it works on Dione II.',
    ]);
    assert.equal(parts('de')[0], 'Dione II hat 13 Kojen (davon 12 für Gäste) und 6 Kabinen.');
    assert.equal(parts('pl')[0], 'Dione II ma 13 koi (w tym 12 dla gości) i 6 kabin.');
    assert.equal(parts('pl')[2], 'Na pokładzie może przebywać maksymalnie 14 osób.');
    assert.equal(parts('hr')[0], 'Dione II ima 13 ležajeva (od toga 12 za goste) i 6 kabina.');
    assert.equal(
      markup('pl', 'descLayoutV0', { name: 'X', berths: 4, cabins: 2, guestBerths: 0 }),
      'X ma 4 koje i 2 kabiny.'
    );
    assert.equal(
      markup('hr', 'descLayoutV0', { name: 'X', berths: 21, cabins: 4, guestBerths: 0 }),
      'X ima 21 ležaj i 4 kabine.'
    );
  });

  test('no layout / FAQ sentence puts the berths inside the cabins (Le Petite Prince: 2 of 8 berths in the saloon)', () => {
    // "8 berths in 3 cabins" / "3 cabins with 8 berths" / "sleeps 8 in 3 cabins" would be invented: NauSys saloon
    // berths are common, and crew cabins are their own figure. Cabins and berths are two separate facts.
    const placed = {
      en: /\b(in|across) 3 cabins\b|cabins with \d+ berths|people in 3 cabins/,
      de: /\b(in|auf) 3 Kabinen\b|Kabinen mit/,
      es: /\ben 3 camarotes\b|camarotes con/,
      fr: /\b(dans|sur) 3 cabines\b|cabines avec/,
      hr: /\bu 3 kabin|kabine s ukupno/,
      it: /\bin 3 cabine\b|cabine con/,
      nl: /\b(in|over) 3 hutten\b|hutten met/,
      pl: /\bw 3 kabinach\b/,
      pt: /\b(em|por) 3 cabines\b|cabines com/,
    };
    const keys = Object.keys(messages.en.yacht).filter(k => /^(descLayoutV\d|faqSleepsA\d)$/.test(k));

    assert.equal(keys.length, 5 + 3);
    LOCALES.forEach(l =>
      keys.forEach(key =>
        [0, 6].forEach(guestBerths => {
          const out = markup(l, key, { name: 'Le Petite Prince', berths: 8, cabins: 3, guestBerths });

          assert.ok(out.includes('8') && out.includes('3'), `${l} ${key}: ${out}`);
          assert.ok(!placed[l].test(out), `${l} ${key}: ${out}`);
        })
      )
    );
  });

  test('showers only when the partner sends them; guest berths only from the partner split', () => {
    const marea = F.capacityFacts(view(detail('marea'), 'en'));
    const showersOf = f => accommodationProse({ ...f, showers: 5 }, () => 0).find(p => p.key.startsWith('descHeads'));

    assert.equal(accommodationProse(marea, () => 0).find(p => p.key.startsWith('descHeads')).values.showers, 0);
    assert.equal(markup('en', 'descHeadsV0', showersOf(marea).values), 'There are 5 toilets on board and 5 showers.');
    assert.equal(shownGuestBerths(marea), 10, 'Marea 12 (10 in cabins + 2 crew)');
    assert.equal(shownGuestBerths(F.capacityFacts(view(detail('lpp'), 'en'))), 0, 'LPP 8 = 6 + 2 saloon: all guests');
    assert.equal(shownGuestBerths(F.capacityFacts(view(detail('pnoe'), 'en'))), 0, 'no split, no claim');
  });

  test('FAQ: berths, then max. people on board as a sentence of its own — never "sleeps up to {maxPersons}"', () => {
    const t = (key, values) => translator('en', 'yacht')(key, values);
    const [sleeps] = buildYachtFaq(dione, t, 'en', facts('en'));

    assert.equal(sleeps.question, 'How many people can sleep aboard Dione II?');
    assert.match(sleeps.answer, /13 (berths|people)/);
    assert.match(sleeps.answer, /12 (of them for guests|berths for guests)/);
    assert.match(sleeps.answer, /Up to 14 people can be on board Dione II in total\.$/);
    assert.ok(!/(sleeps|sleep) up to 14/.test(sleeps.answer));

    const noBerths = buildYachtFaq({ ...dione, capacity: null, cabins: 6, berths: null, maxPersons: 10 }, t, 'en');

    assert.equal(
      noBerths[0].answer,
      'The listing for Dione II gives no berth count — ask us how the berths are arranged before you book. Up to 10 people can be on board Dione II in total.'
    );
  });

  test('meta: berths from berths; max. people on board only as such (never "N berths")', () => {
    const t = (key, values) => translator('en', 'metadata.boat')(key, values);

    assert.equal(
      buildBoatDescription(t, { name: 'Bali 4.2', marina: 'Kaštela', cabins: 4, berths: null, maxPeople: 10 }),
      'Charter the Bali 4.2 from Kaštela. 4 cabins, max. 10 people on board. Check availability and book directly on boat4you.com.'
    );
    LOCALES.forEach(l =>
      assert.ok(messages[l].metadata.boat.descMaxPeople && !messages[l].metadata.boat.descGuests, l)
    );
  });
});

describe('source guards', () => {
  const read = path => readFileSync(`${ROOT}src/${path}`, 'utf8');
  const sources = dir =>
    readdirSync(`${ROOT}src/${dir}`, { withFileTypes: true }).flatMap(e => {
      if (e.isDirectory()) return sources(`${dir}/${e.name}`);

      return /\.tsx?$/.test(e.name) ? [`${dir}/${e.name}`] : [];
    });

  test('the note tables stay on the server: only server modules import capacityNoteTable (server-only)', () => {
    assert.match(read('utils/static/capacityNoteTable.ts'), /^import 'server-only';/);
    assert.deepEqual(
      sources('.')
        .filter(file => /capacityNoteTable|capacityNotes\//.test(read(file)))
        .map(file => file.replace(/^\.\//, ''))
        .sort(),
      ['utils/server/yachtCapacity.ts', 'utils/static/capacityNoteTable.ts']
    );
  });

  test('my-bookings asks the server for its few notes: translated, English, or hidden (resolveCapacityNotes)', async () => {
    const { resolveCapacityNotes } = await import('@/utils/server/yachtCapacity');
    const ask = (locale, queries) => resolveCapacityNotes(locale, queries);

    assert.deepEqual(
      await ask('de', [
        { dim: 'cabins', note: 'for clients + 1 crew' },
        { dim: 'berths', note: '(two convertible saloon berths)' },
        { dim: 'heads', note: '(5+1 for the crew)' },
      ]),
      [
        { en: 'for clients + 1 crew', text: 'für Gäste + 1 Crew', lang: null, short: false },
        { en: '(two convertible saloon berths)', text: '(two convertible saloon berths)', lang: 'en', short: false },
        { en: '(5+1 for the crew)', text: '(5+1 für die Crew)', lang: null, short: false },
      ]
    );
    // A translation only for its reviewed dimensions ("(5+1 for the crew)" = heads).
    assert.equal((await ask('de', [{ dim: 'cabins', note: '(5+1 for the crew)' }]))[0].lang, 'en');
    // A public action takes any text: its answer must not say whether a name is on the operator list.
    assert.ok(isOperatorName('(4 + 1 Sunsail)') && !isOperatorName('(4 + 1 Sunshade)'));
    assert.deepEqual(
      (
        await ask('de', [
          { dim: 'heads', note: '(4 + 1 Sunsail)' },
          { dim: 'berths', note: '(4 + 1 Sunshade)' },
        ])
      ).map(n => n && n.lang),
      ['en', 'en'],
      'no operator-list oracle'
    );
    assert.deepEqual(await ask('en', [{ dim: 'cabins', note: '  for clients\u00a0+ 1 crew ' }]), [
      { en: 'for clients + 1 crew', text: 'for clients + 1 crew', lang: null, short: false },
    ]);
    assert.deepEqual(await ask('de', [{ dim: 'cabins', note: "(owner's version)" }]), [null], 'sanitizer');
    assert.deepEqual(await ask('de', [{ dim: 'cabins', note: 'call +385 91 123 4567' }]), [null], 'contact data');
    assert.deepEqual(await ask('de', [{ dim: 'deck', note: 'x' }, 'x', null, { dim: 'heads', note: 5 }]), [
      null,
      null,
      null,
    ]);
    assert.deepEqual(await ask('de', 'not a list'), []);
  });

  test('no cabins × 2 + 2 estimate on the card; capacity / rig never go through the partner-text filter', () => {
    assert.ok(!/cabins\s*\*\s*2/.test(read('components/BoatListingItemCard/BoatListingItemCard.tsx')));
    assert.ok(!/capacity|\brig\b/.test(read('utils/server/partnerYacht.ts')));
  });

  test('the equipment sentence never names a sail from the flat mainSailType filter enum (contract 7.1, B-4)', () => {
    assert.ok(
      !/\.mainSailType|MAIN_SAIL_TYPE_LABEL_MAP|MainSailType/.test(read('utils/hooks/useBoatEquipmentDescription.tsx'))
    );
  });

  test('the boat page hands client components no partner note it does not show (withResolvedNotes)', async () => {
    const { resolveYachtCapacity, withResolvedNotes } = await import('@/utils/server/yachtCapacity');
    const yacht = {
      charterType: ['BAREBOAT'],
      capacity: {
        cabins: { value: 6, note: '(5 double +1 for the hostess + 1 bow/skippers cabin)' },
        berths: { value: 13, note: '(12 pax + 1 Sunsail)', split: { guests: 12, crew: 1 } },
        heads: { value: 6, note: 'call +385 91 123 4567' },
        maxPersons: 14,
      },
      rig: {
        mainsail: { kind: 'FULL_BATTEN', label: 'Full batten' },
        headsail: { kind: null, label: 'Sunsail genoa' },
        engine: { label: '2x60HP' },
        draught: 1.3,
      },
    };

    assert.ok(isOperatorName('Sunsail'));

    const resolved = await Promise.all(['en', 'de'].map(locale => resolveYachtCapacity(yacht, locale)));

    resolved.forEach(capacity => {
      const out = withResolvedNotes(yacht, capacity);

      assert.equal(out.capacity.cabins.note, yacht.capacity.cabins.note);
      assert.equal(out.capacity.berths.note, null, 'operator name hidden on the page and out of the payload');
      assert.deepEqual(out.capacity.berths.split, { guests: 12, crew: 1 });
      assert.equal(out.capacity.heads.note, null, 'contact data');
      assert.equal(out.capacity.maxPersons, 14);
      assert.equal(out.rig.mainsail.label, null);
      assert.equal(out.rig.headsail.label, null);
      assert.equal(out.rig.engine.label, '2x60HP');
      assert.equal(out.rig.draught, 1.3);
    });

    assert.equal(yacht.capacity.heads.note, 'call +385 91 123 4567', 'the input is not mutated');

    const power = { rig: { engine: { label: 'Yanmar 2 x 57', count: 2, powerEach: 57 } } };
    const flat = { cabins: 3, berths: 8 };

    assert.equal(withResolvedNotes(power, await resolveYachtCapacity(power, 'en')).rig.engine.label, null);
    assert.equal(withResolvedNotes(flat, await resolveYachtCapacity(flat, 'en')), flat);
  });
});
