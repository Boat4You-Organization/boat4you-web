/**
 * Landing title / H1 / meta description precedence (owner decision
 * 15.10.2026: "Yacht charter {Croatia/Greece/Italy/Spain/Türkiye}" is
 * europe-yachts.com's head term, so a boat4you landing without a boat type
 * gets `landing.override.<place>.NONE`):
 *   - src/utils/server/landingCopy.ts — for one place, override (typed or
 *     NONE) > lead > default template; NONE never reaches a boat-type page;
 *   - landingHeading (the anchor other pages link a landing by) = the page H1;
 *   - scripts/check-home-hub.mjs landingHeadings builds the same h1 and meta
 *     description as landingCopy.ts (the yacht-rule places and the Split
 *     Region's lead, every locale × no / each boat type).
 *
 * Messages are the repo's own; NONE entries are patched in per test (marked
 * "[test]") until the locale files carry them. The URL carries a `did`, so
 * the landing resolves without the catalogue API (resolveSearchLanding).
 *
 *   node --disable-warning=MODULE_TYPELESS_PACKAGE_JSON --test scripts/landingCopy.test.mjs
 */
/* global globalThis */
import assert from 'node:assert/strict';
import { readFileSync, readdirSync } from 'node:fs';
import { registerHooks } from 'node:module';
import { after, describe, test } from 'node:test';

import './tsLoader.mjs';

const ROOT = new URL('../', import.meta.url);
// next-intl/server reading the repo's messages through `patchMessages` (a
// module of its own: its bare `next-intl` import resolves from scripts/).
const INTL_URL = new URL('./stubs/landing-copy-test-intl.mjs', import.meta.url).href;
const INTL_SOURCE = `
import { createTranslator } from 'next-intl';
import { existsSync, readFileSync } from 'node:fs';

const ROOT = ${JSON.stringify(ROOT.pathname)};

export const getTranslations = async (options = {}) => {
  const { locale = 'en', namespace } = typeof options === 'string' ? { namespace: options } : options;
  const root = namespace?.split('.')[0];
  const file = \`\${ROOT}messages/\${locale}/\${root}.json\`;
  const own = root && existsSync(file) ? JSON.parse(readFileSync(file, 'utf8')) : {};
  const messages = root ? { [root]: globalThis.patchMessages(locale, root, own) } : {};

  return createTranslator({ locale, messages, namespace });
};

export const getLocale = async () => 'en';

export const setRequestLocale = () => {};
`;

registerHooks({
  resolve: (specifier, context, nextResolve) => {
    if (specifier === 'next-intl/server') return { url: INTL_URL, shortCircuit: true };

    // `server-only` throws outside a React server bundle.
    if (specifier === 'server-only') return { url: 'data:text/javascript,export {};', shortCircuit: true };

    return nextResolve(specifier, context);
  },
  load: (url, context, nextLoad) =>
    url === INTL_URL ? { format: 'module', source: INTL_SOURCE, shortCircuit: true } : nextLoad(url, context),
});

/** NONE overrides in force, per place key (the same text in every locale; null = none, even if the repo has one). */
let none = {};

const patchMessages = (locale, root, messages) => {
  if (root !== 'landing' || !Object.keys(none).length) return messages;

  const override = { ...messages.override };

  Object.entries(none).forEach(([place, entry]) => {
    const typed = { ...override[place] };

    delete typed.NONE;
    override[place] = entry ? { ...typed, NONE: entry } : typed;
  });

  return { ...messages, override };
};

globalThis.patchMessages = patchMessages;

const withNone = async (entries, run) => {
  none = entries;

  try {
    return await run();
  } finally {
    none = {};
  }
};

after(() => {
  delete globalThis.patchMessages;
});

const { getLandingCopy, landingHeading } = await import('@/utils/server/landingCopy');
const { placeText } = await import('@/utils/server/placeText');
const { landingHeadings } = await import('./check-home-hub.mjs');

const messages = (locale, namespace) =>
  JSON.parse(readFileSync(new URL(`messages/${locale}/${namespace}.json`, ROOT), 'utf8'));
const fill = (template, values) => template.replace(/\{(\w+)\}/g, (match, name) => values[name] ?? match);

const EN = messages('en', 'landing');
const CROATIA = { h1: 'Boat rental in Croatia [test]', metaDesc: 'Rent a boat in Croatia [test].' };
const SPLIT = { h1: 'Boat rental in the Split Region [test]', metaDesc: 'Rent a boat in the Split Region [test].' };

/** The page's copy: one destination [× boat types]; the `did` skips the catalogue lookup. */
const page = (name, boatTypes = null, locale = 'en') =>
  getLandingCopy(locale, { destinations: name, did: 'test', ...(boatTypes ? { boatTypes } : {}) });

describe('landingCopy.ts — no-boat-type override (NONE)', () => {
  test('without a NONE override the page keeps the default template', async () => {
    const copy = await withNone({ croatia: null }, () => page('Croatia'));

    assert.equal(copy.h1, fill(EN.h1NoBoatType, { where: EN.in.croatia }));
    assert.equal(copy.title, copy.h1);
    assert.equal(copy.description, fill(EN.metaDescNoBoatType, { where: EN.in.croatia }));
  });

  test('NONE override replaces the default template (title, H1, meta description)', async () => {
    const copy = await withNone({ croatia: CROATIA }, () => page('Croatia'));

    assert.deepEqual(copy, { title: CROATIA.h1, description: CROATIA.metaDesc, h1: CROATIA.h1 });
  });

  test('NONE override wins over the lead (Split Region)', async () => {
    const lead = await withNone({ splitRegion: null }, () => page('Split Region'));

    assert.equal(lead.h1, fill(EN.leadH1NoBoatType, { lead: EN.lead.splitRegion, where: EN.in.splitRegion }));

    const copy = await withNone({ splitRegion: SPLIT }, () => page('Split Region'));

    assert.deepEqual(copy, { title: SPLIT.h1, description: SPLIT.metaDesc, h1: SPLIT.h1 });
  });

  test('a filter of several boat types shows the no-boat-type heading, so the NONE override', async () => {
    const copy = await withNone({ croatia: CROATIA }, () => page('Croatia', 'CATAMARAN,SAILING_YACHT'));

    assert.equal(copy.h1, CROATIA.h1);
  });

  test('typed override still wins, and NONE never reaches a boat-type page', async () => {
    await withNone({ croatia: CROATIA, splitRegion: SPLIT }, async () => {
      const catamaran = await page('Croatia', 'CATAMARAN');

      assert.equal(catamaran.h1, EN.override.croatia.CATAMARAN.h1);
      assert.equal(catamaran.description, EN.override.croatia.CATAMARAN.metaDesc);

      const sailing = await page('Croatia', 'SAILING_YACHT');

      assert.notEqual(sailing.h1, CROATIA.h1);
      assert.match(sailing.h1, /Croatia/);

      const splitSailing = await page('Split Region', 'SAILING_YACHT');

      assert.notEqual(splitSailing.h1, SPLIT.h1);
      assert.ok(splitSailing.h1.includes(EN.lead.splitRegion));
    });
  });

  test('landingHeading (link anchor) = the page H1, with and without NONE', async () => {
    const cases = [
      ['Croatia', null],
      ['Croatia', 'CATAMARAN'],
      ['Croatia', 'SAILING_YACHT'],
      ['Split Region', null],
      ['Split Region', 'MOTOR_YACHT'],
    ];
    const check = () =>
      Promise.all(
        cases.map(async ([name, boatType]) => {
          const [anchor, copy] = await Promise.all([landingHeading('en', name, boatType), page(name, boatType)]);

          assert.equal(anchor, copy.h1, `${name} × ${boatType ?? 'no boat type'}`);
        })
      );

    await check();
    await withNone({ croatia: CROATIA, splitRegion: SPLIT }, check);
    assert.equal(await withNone({ croatia: CROATIA }, () => landingHeading('en', 'Croatia', null)), CROATIA.h1);
  });
});

describe('check-home-hub.mjs — builds the headings as landingCopy.ts does', () => {
  // The places of the yacht rule plus the one with a lead.
  const PLACES = {
    croatia: 'Croatia',
    greece: 'Greece',
    italy: 'Italy',
    spain: 'Spain',
    türkiye: 'Türkiye',
    northernGreeceAegean: 'Northern Greece Aegean',
    italianAdriatic: 'Italian Adriatic',
    splitRegion: 'Split Region',
  };
  const NONE = { croatia: CROATIA, splitRegion: SPLIT };
  const locales = readdirSync(new URL('messages/', ROOT), { withFileTypes: true })
    .filter(entry => entry.isDirectory())
    .map(entry => entry.name)
    .sort();

  locales.forEach(locale => {
    test(`${locale}: h1 and meta description, yacht-rule places and Split Region × no / each boat type`, async () => {
      const common = messages(locale, 'common');

      await withNone(NONE, async () => {
        const patched = patchMessages(locale, 'landing', messages(locale, 'landing'));
        const built = landingHeadings(patched, common, messages(locale, 'home')).filter(({ place }) => place in PLACES);

        assert.equal(new Set(built.map(({ place }) => place)).size, Object.keys(PLACES).length);

        await Promise.all(
          built.map(async ({ place, boatType, h1, metaDesc }) => {
            const name = PLACES[place];
            const [text, copy] = await Promise.all([placeText(locale, name), page(name, boatType, locale)]);

            assert.equal(text.key, place, `${name} resolves to ${place}`);
            assert.equal(h1, copy.h1, `${locale} ${place} × ${boatType ?? 'NONE'} h1`);
            assert.equal(metaDesc, copy.description, `${locale} ${place} × ${boatType ?? 'NONE'} metaDesc`);
          })
        );

        assert.equal(built.find(h => h.place === 'croatia' && !h.boatType).h1, CROATIA.h1);
        assert.equal(built.find(h => h.place === 'splitRegion' && !h.boatType).h1, SPLIT.h1);
      });
    });
  });
});
