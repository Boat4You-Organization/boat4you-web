/**
 * Unit tests for the one-off IndexNow list of retired boats' old URLs
 * (scripts/indexnow-successor-urls.mjs, owner decision 7.10.2026): the port of
 * the backend's SlugUtils, the 9-locale expansion, the 308 check and the run
 * (resume, give-up, output file) with the network replaced.
 *
 *   yarn test:successor
 */
import assert from 'node:assert/strict';
import { mkdtempSync, readFileSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { describe, test } from 'node:test';

import { expandRow, isConfirmed, main, parseRows, toSlugWithId } from './indexnow-successor-urls.mjs';

const BASE = 'https://www.boat4you.com';

describe('toSlugWithId = backend SlugUtils.toSlugWithId', () => {
  // Model, name, id and slug as GET /public/yachts answered on 7.10.2026; the manufacturer is the one the slug
  // shows (the list API does not send it).
  const live = [
    ['Lagoon', 'Lagoon 42', 'ROYAL SALUTE', 11718, 'lagoon-42-royal-salute-11718'],
    ['Lagoon', 'Lagoon 450', 'TIME ', 11719, 'lagoon-450-time-11719'],
    ['Bavaria Yachtbau', 'Bavaria Cruiser 45', 'Meli', 11729, 'bavaria-yachtbau-bavaria-cruiser-45-meli-11729'],
    ['Jeanneau', 'Sun Odyssey 349', 'DIMITRA |Sails 2024|', 11734, 'jeanneau-sun-odyssey-349-dimitra-sails-2024-11734'],
    ['Beneteau', 'Oceanis 37', 'MINA "Sails 2025"', 11735, 'beneteau-oceanis-37-mina-sails-2025-11735'],
    ['Beneteau', 'Oceanis 46.1', 'STERGIOS  GEN.+A.C.', 11737, 'beneteau-oceanis-461-stergios-genac-11737'],
    [
      'Fountaine Pajot',
      'Astréa 42',
      'IOANNA - GEN/AC+WATERMAKER',
      11739,
      'fountaine-pajot-astra-42-ioanna-genacwatermaker-11739',
    ],
    [
      'Bavaria Yachtbau',
      'Bavaria C45',
      'CARPE DIEM with A/C',
      11740,
      'bavaria-yachtbau-bavaria-c45-carpe-diem-with-ac-11740',
    ],
    ['Beneteau', 'Cyclades 43.4', "GEORGE'S", 11753, 'beneteau-cyclades-434-georges-11753'],
    ['Lagoon', 'Lagoon 42', 'ZAHIRA - GEN/AC+WATERMAKER', 11757, 'lagoon-42-zahira-genacwatermaker-11757'],
    ['Gulet', 'Gulet', 'Pacha', 11765, 'gulet-pacha-11765'],
    [
      'Dufour Yachts',
      'Dufour 520 Grand Large',
      'La Esperanza',
      11792,
      'dufour-yachts-dufour-520-grand-large-la-esperanza-11792',
    ],
    ['Lagoon', 'Lagoon 42', 'Masterpiece', 11681, 'lagoon-42-masterpiece-11681'],
  ];

  live.forEach(([manufacturer, model, name, id, slug]) => {
    test(`${slug}`, () => {
      assert.equal(toSlugWithId(manufacturer, model, name, id), slug);
    });
  });

  test('the manufacturer is dropped only when the model starts with it as a word, or is it (any case)', () => {
    assert.equal(toSlugWithId('LAGOON', 'Lagoon 42', 'X', 1), 'lagoon-42-x-1');
    assert.equal(toSlugWithId(' Lagoon ', 'lagoon', 'X', 2), 'lagoon-x-2');
    assert.equal(toSlugWithId('Lagoon', 'Lagoon42', 'X', 3), 'lagoon-lagoon42-x-3');
    assert.equal(
      toSlugWithId('Lagoon-Bénéteau', 'Lagoon 42 (4 + 2 cab)', 'Masterpiece', 4066),
      'lagoon-bnteau-lagoon-42-4-2-cab-masterpiece-4066'
    );
  });

  test('missing or blank parts are skipped; nothing left = the id alone', () => {
    assert.equal(toSlugWithId(null, 'Motoryacht', 'Love Story', 11773), 'motoryacht-love-story-11773');
    assert.equal(toSlugWithId('', '  ', 'Sea Ya', 5), 'sea-ya-5');
    assert.equal(toSlugWithId(null, null, null, 6), '6');
    assert.equal(toSlugWithId('Ω', null, '', 7), '7');
    // Like the backend: "Ω-Ψ" keeps only the joining hyphen, and that is not empty.
    assert.equal(toSlugWithId('Ω', 'Ψ', '', 7), '--7');
  });

  test("Java's \\s: a no-break space is removed, not turned into a hyphen", () => {
    assert.equal(toSlugWithId(null, 'Lagoon 42', 'Sea\u00a0Ya', 8), 'lagoon-42-seaya-8');
  });

  test('Kotlin whitespace, not JS trim: U+001C is blank, U+FEFF is not; İ equals i ignoring case', () => {
    assert.equal(toSlugWithId('Lagoon', 'Lagoon 42', '\u001c', 5699), 'lagoon-42-5699');
    assert.equal(toSlugWithId(' é\n', null, '\t \ufeff ', 6312), '--6312');
    assert.equal(toSlugWithId('İzmir', 'İZMİR', 'X', 3803), 'izmir-x-3803');
  });
});

describe('parseRows', () => {
  test('one JSON object per line; blank lines ignored, bad rows counted and dropped', () => {
    const text = [
      '{"oldId":4066,"oldManufacturer":"Lagoon-Bénéteau","oldModel":"Lagoon 42 (4 + 2 cab)","oldName":"Masterpiece","newId":11681,"newManufacturer":"Lagoon","newModel":"Lagoon 42","newName":"Masterpiece"}',
      '',
      '{"oldId":"12","newId":13}',
      '{"oldId":14,"newId":14}',
      '{"oldId":15}',
      'not json',
    ].join('\n');
    const { rows, rejected } = parseRows(text);

    assert.equal(rows.length, 1);
    assert.equal(rows[0].oldId, 4066);
    assert.equal(rejected, 4);
  });
});

const MASTERPIECE = {
  oldId: 4066,
  oldManufacturer: 'Lagoon-Bénéteau',
  oldModel: 'Lagoon 42 (4 + 2 cab)',
  oldName: 'Masterpiece',
  newId: 11681,
  newManufacturer: 'Lagoon',
  newModel: 'Lagoon 42',
  newName: 'Masterpiece',
};

describe('expandRow', () => {
  test('all 9 locales of the app routing: English without a prefix, the rest with it, no query', () => {
    const urls = expandRow(MASTERPIECE);

    assert.equal(urls.length, 9);
    assert.deepEqual(urls[0], {
      path: '/boat/lagoon-bnteau-lagoon-42-4-2-cab-masterpiece-4066',
      expected: '/boat/lagoon-42-masterpiece-11681',
    });
    assert.deepEqual(
      urls.find(({ path }) => path.startsWith('/hr/')),
      {
        path: '/hr/boat/lagoon-bnteau-lagoon-42-4-2-cab-masterpiece-4066',
        expected: '/hr/boat/lagoon-42-masterpiece-11681',
      }
    );
    assert.deepEqual(urls.map(({ path }) => path.split('/')[1]).sort(), [
      'boat',
      'de',
      'es',
      'fr',
      'hr',
      'it',
      'nl',
      'pl',
      'pt',
    ]);
    urls.forEach(({ path, expected }) => {
      assert.equal(path.split('/')[1], expected.split('/')[1]);
      assert.ok(!path.includes('?') && !expected.includes('?'));
    });
  });
});

describe('isConfirmed', () => {
  const url = `${BASE}/de/boat/old-4066`;
  const expected = `${BASE}/de/boat/lagoon-42-masterpiece-11681`;

  test('308 with the successor as a relative or absolute Location', () => {
    assert.equal(isConfirmed(308, '/de/boat/lagoon-42-masterpiece-11681', url, expected), true);
    assert.equal(isConfirmed(308, expected, url, expected), true);
  });

  test('anything else is dropped', () => {
    assert.equal(isConfirmed(301, expected, url, expected), false);
    assert.equal(isConfirmed(307, expected, url, expected), false);
    assert.equal(isConfirmed(404, '', url, expected), false);
    assert.equal(isConfirmed(308, `${expected}?startDate=2027-06-05`, url, expected), false);
    assert.equal(isConfirmed(308, '/boat/lagoon-42-masterpiece-11681', url, expected), false);
    assert.equal(isConfirmed(308, '/de/boat/other-boat-11682', url, expected), false);
    assert.equal(isConfirmed(308, 'https://evil.example/de/boat/lagoon-42-masterpiece-11681', url, expected), false);
    assert.equal(isConfirmed(308, '', url, expected), false);
  });
});

/** A fake site: `answers` maps a path to [status, location]; everything else is a 404. */
const fakeFetch = (answers, calls) => async (url, init) => {
  calls.push({ url, init });
  const [status, location] = answers[new URL(url).pathname] ?? [404, null];

  return new Response(null, { status, headers: location ? { Location: location } : {} });
};

const run = async (argv, answers) => {
  const calls = [];
  const lines = [];
  let clock = 0;
  const code = await main(argv, {
    fetchFn: fakeFetch(answers, calls),
    sleep: async ms => {
      clock += ms;
    },
    now: () => clock,
    out: line => lines.push(line),
  });

  return { code, calls, lines, clock };
};

describe('main', () => {
  const dir = mkdtempSync(join(tmpdir(), 'succ-urls-'));
  const input = join(dir, 'successors.jsonl');
  const other = { ...MASTERPIECE, oldId: 5000, oldModel: 'Lagoon 42', oldManufacturer: 'Lagoon', newId: 5001 };

  writeFileSync(input, `${JSON.stringify(MASTERPIECE)}\n${JSON.stringify(other)}\n`);

  const allMasterpiece = Object.fromEntries(
    expandRow(MASTERPIECE).map(({ path, expected }) => [path, [308, expected]])
  );

  test('keeps the 308s to the successor, drops the rest, one request per second, no redirect followed', async () => {
    const out = join(dir, 'a.txt');
    const { code, calls, clock } = await run(['--in', input, '--out', out], allMasterpiece);

    assert.equal(code, 1);
    assert.equal(calls.length, 18);
    assert.ok(calls.every(({ init }) => init.redirect === 'manual'));
    assert.equal(clock, 17000);

    const urls = readFileSync(out, 'utf8').trim().split('\n');

    assert.equal(urls.length, 9);
    assert.equal(urls[0], `${BASE}/boat/lagoon-bnteau-lagoon-42-4-2-cab-masterpiece-4066`);
    assert.ok(urls.every(u => u.includes('-4066')));
    assert.match(readFileSync(`${out}.checks.tsv`, 'utf8'), /\/boat\/lagoon-42-masterpiece-5000\t404\t\tdropped/);
  });

  test('a re-run skips what the log already confirmed and re-checks the rest', async () => {
    const out = join(dir, 'a.txt');
    const { calls } = await run(['--in', input, '--out', out], allMasterpiece);

    assert.equal(calls.length, 9);
    assert.ok(calls.every(({ url }) => url.includes('-5000')));
    assert.equal(readFileSync(out, 'utf8').trim().split('\n').length, 9);
  });

  test('gives up when none of the first 50 answers is the expected 308, and writes no URL file', async () => {
    const many = Array.from({ length: 6 }, (_, i) => JSON.stringify({ ...other, oldId: 6000 + i, newId: 7000 + i }));
    const manyInput = join(dir, 'many.jsonl');
    const out = join(dir, 'b.txt');

    writeFileSync(manyInput, many.join('\n'));
    const { code, calls, lines } = await run(['--in', manyInput, '--out', out], {});

    assert.equal(code, 2);
    assert.equal(calls.length, 50);
    assert.match(lines.join('\n'), /FAIL none of the first 50/);
    assert.throws(() => readFileSync(out));
  });

  test('--dry-run makes no request; --limit counts boats', async () => {
    const { code, calls, lines } = await run(['--in', input, '--dry-run', '--limit', '1'], {});

    assert.equal(code, 0);
    assert.equal(calls.length, 0);
    assert.match(lines[0], /2 retired boats .* 1 boats -> 9 URLs/);
  });

  test('usage errors', async () => {
    for (const argv of [[], ['--in', input], ['--in', input, '--out', 'x', '--interval', '0.5'], ['--bogus']]) {
      assert.equal((await run(argv, {})).code, 3, argv.join(' '));
    }
  });
});
