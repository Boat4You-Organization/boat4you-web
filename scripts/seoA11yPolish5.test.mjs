/**
 * Small display fixes from the live check of 9.10.2026 after round 4
 * (_seo-audit-2026-10-08/live-verify-round4), round 5:
 *
 *   - F1: a partner's boat name reads as the partner meant it after an
 *     apostrophe or a dot (display only; slugs and links are unchanged):
 *       - a contraction or a plural stays lower: "I'm Alone", "C's The Day",
 *         "Nauti T's" read "I'M Alone", "C'S The Day", "Nauti T'S" on /fleet
 *         and in the boat page's title and H1;
 *       - the particle "d'" stays lower inside a name: "Plume d'Ange", not
 *         "Plume D'Ange";
 *       - a dot no longer lowers the next word: "E.S.", "M.P. Prestige",
 *         "Kos 46.Cat", not "E.s.", "M.p. Prestige", "Kos 46.cat";
 *       - "ex" before a former name keeps it readable: "Concord's 6 ex.OMR
 *         Group", not "Concord's 6 Ex.omr Group";
 *       - after "d'", "l'" or "o'" the next word starts with a capital
 *         however the partner typed it, so the same name reads the same:
 *         "L'Epaulard III", "Les Copains D'Abord" (review of this round);
 *       - a backtick typed for an apostrophe counts as one: "Fish N`Chips",
 *         not "Fish N`chips".
 *
 *   The whole live /fleet name list — 8,362 distinct names of the 10,482
 *   promoted boats, as the backend sent them on 9.10.2026 — is
 *   scripts/fixtures/fleet-names-2026-10-09.json.
 *
 *   yarn test:polish
 */
import { renderToStaticMarkup } from 'react-dom/server';

import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { registerHooks } from 'node:module';
import { describe, test } from 'node:test';

import './tsLoader.mjs';

// The directory is a server component: its messages come through a
// next-intl/server stand-in over the repo's catalogue.
registerHooks({
  resolve: (specifier, context, nextResolve) => {
    if (specifier === 'next-intl/server') {
      return { url: new URL('./stubs/next-intl-server.mjs', import.meta.url).href, shortCircuit: true };
    }

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

const LOCALES = ['en', 'de', 'fr', 'it', 'es', 'pt', 'nl', 'pl', 'hr'];

const { toTitleCase } = await import('@/utils/static/toTitleCase');
const { buildBoatTitle, titleBoatName } = await import('@/utils/static/boatTitle');
const { testRequest } = await import('./stubs/next-intl-server.mjs');
const { default: FleetDirectory } = await import('@/views/Fleet/FleetDirectory/FleetDirectory');

const FLEET_NAMES = JSON.parse(
  readFileSync(new URL('./fixtures/fleet-names-2026-10-09.json', import.meta.url), 'utf8')
);

/** Each raw name → how it is shown. */
const expectShown = cases =>
  Object.entries(cases).forEach(([raw, shown]) => assert.equal(toTitleCase(raw), shown, raw));

describe('F1: title case after an apostrophe', () => {
  test('a contraction or a plural stays lower: "I\'m Alone", not "I\'M Alone" (live /fleet and boat page)', () => {
    expectShown({
      "I'm Alone": "I'm Alone",
      "C's The Day": "C's The Day",
      "Nauti T's": "Nauti T's",
      // Already in capitals in the partner's data.
      "Four C'S": "Four C's",
      "I'M ALONE": "I'm Alone",
      "LET'S DANCE": "Let's Dance",
      "I'LL BE BACK": "I'll Be Back",
      "WE'RE HERE": "We're Here",
      "OCEAN'S BLUE ": "Ocean's Blue",
      "What's left": "What's Left",
      'Seas’d Up': 'Seas’d Up',
      "Susano'o": "Susano'o",
      "Manta Va'a": "Manta Va'a",
      "Keep It Movin'": "Keep It Movin'",
    });
  });

  test('in a name typed all in capitals a one-letter elision starts a new word', () => {
    expectShown({
      "L'AVVENTURA": "L'Avventura",
      "O'NEILL": "O'Neill",
      "D'ARTAGNAN": "D'Artagnan",
      "LES COPAINS D'ABORD": "Les Copains D'Abord",
      "MILE HI L'ATTITUDES": "Mile Hi L'Attitudes",
      "L'AVVENTURA-III": "L'Avventura-III",
      "NYD'AMOUR II": "Nyd'amour II",
      "ROCK'N'ROLL": "Rock'n'Roll",
      "ROCK 'N' ROLL": "Rock 'n' Roll",
      "Jays 'n Seas": "Jays 'n Seas",
    });
  });

  test("a name typed in mixed case keeps the partner's case after the apostrophe", () => {
    expectShown({
      "C'est la vie": "C'est La Vie",
      'P’tit Loup': 'P’tit Loup',
      "L'Albatros": "L'Albatros",
      'L’Olivier': 'L’Olivier',
      "D'Arros": "D'Arros",
      "Jeux D'Hiver": "Jeux D'Hiver",
      "Rev'Anou": "Rev'Anou",
      "T'moana": "T'moana",
      "M'arricrio": "M'arricrio",
      "A'more": "A'more",
      'Iz’lo': 'Iz’lo',
    });
  });

  test('after "d\'", "l\'" or "o\'" the next word starts with a capital however the partner typed it', () => {
    expectShown({
      "L'epaulard III": "L'Epaulard III",
      "L'after": "L'After",
      "L'una Grossa - Comfort line": "L'Una Grossa - Comfort Line",
      "Les Copains D'abord": "Les Copains D'Abord",
      "D'artagnan": "D'Artagnan",
      "O'neill": "O'Neill",
    });
  });

  test('the same name reads the same however the partner typed it ("Les Copains D\'Abord")', () => {
    [
      ["Les Copains D'abord", "LES COPAINS D'ABORD", "Les Copains D'Abord"],
      ["L'epaulard III", "L'EPAULARD III"],
      ["D'artagnan", "D'ARTAGNAN", "D'Artagnan"],
      ["O'neill", "O'NEILL", "O'Neill"],
    ].forEach(spellings => {
      const shown = spellings.map(toTitleCase);

      assert.deepEqual(new Set(shown).size, 1, shown.join(' / '));
    });
  });

  test('a backtick or an acute accent typed for an apostrophe counts as one: "Fish N`Chips"', () => {
    expectShown({
      'Fish N`Chips': 'Fish N`Chips',
      'FISH N`CHIPS': 'Fish N`Chips',
      'Fish N´Chips': 'Fish N´Chips',
      'I`M ALONE': 'I`m Alone',
      'L`AVVENTURA': 'L`Avventura',
    });
  });

  test('the particle "d\'" or "l\'" typed lower case inside a name stays lower: "Plume d\'Ange"', () => {
    expectShown({
      "Plume d'Ange": "Plume d'Ange",
      "Valle d'Aosta": "Valle d'Aosta",
      "Ti tengo d'okkio": "Ti Tengo d'Okkio",
      "plume d'ange": "Plume d'Ange",
      // The first word always starts with a capital; capitals give nothing to go by.
      "d'Artagnan": "D'Artagnan",
      "PLUME D'ANGE": "Plume D'Ange",
      // Not a particle: "o'" or a contraction.
      "five o'clock": "Five O'Clock",
      "Nauti t's": "Nauti T's",
    });
  });
});

describe('F1: title case after a dot', () => {
  test('initials stay in capitals: "E.S.", "M.P. Prestige", not "E.s.", "M.p. Prestige"', () => {
    expectShown({
      'E.S.': 'E.S.',
      'E.S. II': 'E.S. II',
      'I.Q.': 'I.Q.',
      'H.I.T.  ': 'H.I.T.',
      'M.P. Prestige': 'M.P. Prestige',
      'ALuMa D.B.': 'Aluma D.B.',
      'Jeanneau S.O 410': 'Jeanneau S.O 410',
      'GEORGIO GEN.+A.C.': 'Georgio Gen.+A.C.',
      'PHORKYS GEN + A.C': 'Phorkys Gen + A.C',
    });
  });

  test("after a dot a word typed in mixed case keeps the partner's case", () => {
    expectShown({
      'Kos 46.Cat': 'Kos 46.Cat',
      'Kos 46.Cat12': 'Kos 46.Cat12',
      'KOS 52.CAT1': 'Kos 52.Cat1',
      'Mr.Si': 'Mr.Si',
      'Active.Cruises': 'Active.Cruises',
      'Dzianiny.Club 2': 'Dzianiny.Club 2',
      'Le.One.': 'Le.One.',
      'Alfa.bm2': 'Alfa.bm2',
      'ARION AC, Gen, W.Maker': 'Arion Ac, Gen, W.Maker',
    });
  });

  test('numbers and abbreviations with a dot read as before', () => {
    expectShown({
      'Bali 4.6': 'Bali 4.6',
      'Oceanis 46.1': 'Oceanis 46.1',
      'KOS 41.4': 'Kos 41.4',
      'Milu 2.0': 'Milu 2.0',
      'MR. WHITE ': 'Mr. White',
      'St. Marie': 'St. Marie',
      'Capt. Jack Sparrow': 'Capt. Jack Sparrow',
      'Alex Jr.': 'Alex Jr.',
      'Mila D&D Kufner 50 I.': 'Mila D&D Kufner 50 I.',
      'PIPPI (new engine 2024.)': 'Pippi (New Engine 2024.)',
      'Virginia (A/C, Gen. 10kVA, Watermaker 160L/h, Electric Winch)':
        'Virginia (A/C, Gen. 10kva, Watermaker 160l/h, Electric Winch)',
    });
  });
});

describe('F1: "ex" before a former name', () => {
  test('"ex" reads lower case inside a name and a short former name in capitals stays', () => {
    expectShown({
      "Concord's 6 ex.OMR Group": "Concord's 6 ex.OMR Group",
      "Concord's 6 ex. OMR Group": "Concord's 6 ex. OMR Group",
      'Rosalu ex Shakti': 'Rosalu ex Shakti',
      'Esko (ex Manca)': 'Esko (ex Manca)',
      'ROSALU EX SHAKTI': 'Rosalu ex Shakti',
      "CONCORD'S 6 EX.OMR GROUP": "Concord's 6 ex.Omr Group",
      'Rosalu ex SHAKTI': 'Rosalu ex Shakti',
      'Ex Libris': 'Ex Libris',
    });
  });
});

describe('F1: the earlier rules are unchanged', () => {
  test('joined words, punctuation, Roman numerals, vessel prefixes, whitespace', () => {
    expectShown({
      'LADIES&GENTLEMEN': 'Ladies&Gentlemen',
      'B&B': 'B&B',
      'SUN/SEA': 'Sun/Sea',
      'SEA-BREEZE': 'Sea-Breeze',
      'DEUX-MI': 'Deux-Mi',
      'TI-BO III': 'Ti-Bo III',
      'ALPHA-II': 'Alpha-II',
      'Daddy (A/C, Generator, Watermaker)': 'Daddy (A/C, Generator, Watermaker)',
      'MARGEO XVI (A/C - GENERATOR)': 'Margeo XVI (A/C - Generator)',
      '"LADY BUTTERFLY"': '"Lady Butterfly"',
      'Watermaker 160L/h': 'Watermaker 160l/h',
      '3/AMIGOS': '3/Amigos',
      'FIND US II': 'Find Us II',
      'rara AVIS': 'Rara Avis',
      LILI: 'Lili',
      MIMI: 'Mimi',
      'M/S AURUM SKY': 'M/S Aurum Sky',
      'MY Custom Anthea': 'MY Custom Anthea',
      'MY WAY': 'My Way',
      ' IDILA ': 'Idila',
      'FILIPPOS I  Boat': 'Filippos I Boat',
    });
    assert.equal(toTitleCase(null), '');
    assert.equal(toTitleCase(undefined), '');
    assert.equal(toTitleCase(''), '');
  });
});

describe('F1: the whole live /fleet name list (9.10.2026)', () => {
  const squash = value => value.trim().replace(/\s+/gu, ' ');

  test('the fixture holds every distinct name', () => {
    assert.equal(FLEET_NAMES.length, 8362);
    assert.equal(new Set(FLEET_NAMES).size, FLEET_NAMES.length);
  });

  test('only letter case and spacing change, and casing twice changes nothing', () => {
    const offenders = FLEET_NAMES.filter(raw => {
      const shown = toTitleCase(raw);

      return shown.toLowerCase() !== squash(raw).toLowerCase() || toTitleCase(shown) !== shown;
    });

    assert.deepEqual(offenders, []);
  });

  test('no single capital letter after an apostrophe ("I\'M", "C\'S", "T\'S")', () => {
    const offenders = FLEET_NAMES.map(toTitleCase).filter(shown => /\p{L}['’`´]\p{Lu}(?!\p{L})/u.test(shown));

    assert.deepEqual(offenders, []);
  });

  test('after "d\'", "l\'" or "o\'" a word of two or more letters starts with a capital ("L\'Epaulard")', () => {
    const elisions = FLEET_NAMES.map(toTitleCase).filter(shown => /(?<!\p{L})[dlo]['’`´]\p{L}{2}/iu.test(shown));
    const offenders = elisions.filter(shown => /(?<!\p{L})[DLOdlo]['’`´]\p{Ll}\p{L}/u.test(shown));

    assert.ok(elisions.length >= 15, elisions.join(', '));
    assert.deepEqual(offenders, []);
  });

  test('a capital the partner typed after a dot stays a capital ("E.S.", "ex.OMR", "Kos 46.Cat")', () => {
    const offenders = FLEET_NAMES.filter(raw => {
      const typed = squash(raw);
      const shown = toTitleCase(raw);

      return [...typed.matchAll(/\.(\p{Lu})/gu)].some(match => shown.charAt(match.index + 1) !== match[1]);
    });

    assert.deepEqual(offenders, []);
  });

  test('a lower-case "d\'" or "l\'" inside a name stays lower ("Plume d\'Ange")', () => {
    const particles = FLEET_NAMES.filter(raw => /\s[dl]['’]\p{L}{2}/u.test(squash(raw)));

    assert.ok(particles.length >= 3, particles.join(', '));
    particles.forEach(raw => assert.match(toTitleCase(raw), /\s[dl]['’]\p{Lu}/u, raw));
  });
});

// Rows as the backend sends them (live /fleet, 9.10.2026).
const ENTRIES = [
  { slug: 'hanse-yachts-hanse-460-im-alone-887', name: "I'm Alone", modelName: 'Hanse 460' },
  { slug: 'beneteau-sunsail-41-cs-the-day-20128', name: "C's The Day", modelName: 'Sunsail 41' },
  { slug: 'leopard-catamarans-leopard-46-nauti-ts-20127', name: "Nauti T's", modelName: 'Leopard 46' },
  { slug: 'four-cs-15591', name: "Four C'S", modelName: 'Lagoon 42' },
  { slug: 'plume-dange-1', name: "Plume d'Ange", modelName: 'Lagoon 40' },
  { slug: 'concords-6-exomr-group-2', name: "Concord's 6 ex.OMR Group", modelName: 'Bali 4.6' },
  { slug: 'e-s-3', name: 'E.S.', modelName: 'Sun Odyssey 440' },
  { slug: 'lepaulard-iii-1', name: "L'epaulard III", modelName: 'Lagoon 450' },
  { slug: 'fish-nchips-1', name: 'Fish N`Chips', modelName: 'Bali 4.1' },
].map(entry => ({ ...entry, base: 'Marina Kaštela, Kaštela', cabins: 4, maxPersons: 10, buildYear: 2020 }));

const renderFleet = async locale => {
  testRequest.locale = locale;

  try {
    return renderToStaticMarkup(
      await FleetDirectory({ slice: { entries: ENTRIES, pageNumber: 1, totalPages: 1, totalBoats: ENTRIES.length } })
    );
  } finally {
    testRequest.locale = 'en';
  }
};
/** The <span>s of each row's link, decoded: [model, name?]. */
const rowSpans = html =>
  [...html.matchAll(/<li><a href="[^"]*">([\s\S]*?)<\/a><\/li>/g)].map(([, row]) =>
    [...row.matchAll(/<span>([^<]*)<\/span>/g)].map(([, text]) =>
      text.replaceAll('&#x27;', "'").replaceAll('&amp;', '&')
    )
  );

describe('F1: /fleet and the boat page title', () => {
  LOCALES.forEach(locale => {
    test(`${locale}: /fleet names the boats as the partner meant them`, async () => {
      const html = await renderFleet(locale);

      assert.deepEqual(rowSpans(html), [
        ['Hanse 460', "I'm Alone"],
        ['Sunsail 41', "C's The Day"],
        ['Leopard 46', "Nauti T's"],
        ['Lagoon 42', "Four C's"],
        ['Lagoon 40', "Plume d'Ange"],
        ['Bali 4.6', "Concord's 6 ex.OMR Group"],
        ['Sun Odyssey 440', 'E.S.'],
        ['Lagoon 450', "L'Epaulard III"],
        ['Bali 4.1', 'Fish N`Chips'],
      ]);
      assert.ok(
        html.includes(`href="${locale === 'en' ? '' : `/${locale}`}/boat/hanse-yachts-hanse-460-im-alone-887"`)
      );
    });
  });

  test('the boat page title names "Hanse 460 I\'m Alone (2024)", not "I\'M Alone"', () => {
    const title = (model, name, year) =>
      buildBoatTitle({ model, name: titleBoatName(toTitleCase(name)), year, tail: 'Pirovac Charter' }).title;

    assert.equal(title('Hanse 460', "I'm Alone", 2024), "Hanse 460 I'm Alone (2024) — Pirovac Charter");
    assert.equal(title('Sunsail 41', "C's The Day", 2020), "Sunsail 41 C's The Day (2020) — Pirovac Charter");
    assert.equal(title('Leopard 46', "Nauti T's", 2026), "Leopard 46 Nauti T's (2026) — Pirovac Charter");
  });
});
