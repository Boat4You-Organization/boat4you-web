/**
 * Small wording fixes from the live check of 8.10.2026 after round 3
 * (_seo-audit-2026-10-08/live-verify-round3), round 4:
 *
 *   - B1: the crawlable /fleet directory names each boat title-cased and
 *     trimmed like the cards ("LADIES&GENTLEMEN" reads "Ladies&Gentlemen",
 *     "MURDOCK " reads "Murdock"; 170 of 299 names were all caps and 29 had a
 *     trailing space on /fleet), display only;
 *   - G6: the Croatian Croatia gulet landing writes the boat type in normal
 *     Croatian ("gulet", "guleti", "guleta", "guletom"), never the enum
 *     "GULET", "GULET-i", "GULET-a" (29 times live); the search links keep
 *     their boatTypes=GULET.
 *
 *   yarn test:polish
 */
import { renderToStaticMarkup } from 'react-dom/server';

import assert from 'node:assert/strict';
import { readFileSync, readdirSync } from 'node:fs';
import { registerHooks } from 'node:module';
import { describe, test } from 'node:test';
import { fileURLToPath } from 'node:url';

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

const ROOT = fileURLToPath(new URL('../', import.meta.url));
const LOCALES = ['en', 'de', 'fr', 'it', 'es', 'pt', 'nl', 'pl', 'hr'];

const { testRequest } = await import('./stubs/next-intl-server.mjs');
const { default: FleetDirectory } = await import('@/views/Fleet/FleetDirectory/FleetDirectory');

// Rows as the backend sends them (live /fleet, 8.10.2026).
const ENTRIES = [
  { slug: 'lagoon-450-fly-ladiesgentlemen-11700', name: 'LADIES&GENTLEMEN', modelName: 'Lagoon 450 Fly' },
  { slug: 'jeanneau-sun-odyssey-479-murdock-2043', name: 'MURDOCK ', modelName: 'Sun Odyssey 479' },
  { slug: 'lagoon-40-tom-jerry-11713', name: 'TOM & JERRY', modelName: 'Lagoon 40' },
  { slug: 'tri-wing-12186', name: 'TRI-WING', modelName: 'Neel 47' },
  { slug: 'bavaria-cruiser-46-madame-black-1', name: 'MADAME BLACK', modelName: 'Bavaria Cruiser 46' },
  { slug: 'lagoon-42-find-us-ii-2', name: 'FIND US II', modelName: 'Lagoon 42' },
  { slug: 'custom-anthea-3', name: 'Anthea', modelName: 'MY Custom Anthea' },
  { slug: 'oceanis-46-1-4', name: '', modelName: 'Oceanis 46.1' },
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
    [...row.matchAll(/<span>([^<]*)<\/span>/g)].map(([, text]) => text.replaceAll('&amp;', '&'))
  );

describe('B1: /fleet names the boats like the cards', () => {
  LOCALES.forEach(locale => {
    test(`${locale}: title case, no stray space, the model untouched`, async () => {
      const rows = await renderFleet(locale);

      assert.deepEqual(rowSpans(rows), [
        ['Lagoon 450 Fly', 'Ladies&Gentlemen'],
        ['Sun Odyssey 479', 'Murdock'],
        ['Lagoon 40', 'Tom & Jerry'],
        ['Neel 47', 'Tri-Wing'],
        ['Bavaria Cruiser 46', 'Madame Black'],
        ['Lagoon 42', 'Find Us II'],
        // A name that repeats the model is left out; a boat without a name has no empty <span>.
        ['MY Custom Anthea'],
        ['Oceanis 46.1'],
      ]);
      assert.ok(
        rows.includes(`href="${locale === 'en' ? '' : `/${locale}`}/boat/lagoon-450-fly-ladiesgentlemen-11700"`)
      );
    });
  });
});

const HR_CROATIA_GULET = 'public/seo-content/hr/croatia-gulet-charter.html';
/** The text of a corpus file: attribute values (search links, meta) blanked. */
const textOnly = html => html.replace(/="[^"]*"/g, '=""');

describe('G6: the Croatian Croatia gulet landing writes "gulet", not the enum "GULET"', () => {
  test('no "GULET", "GULET-i", "GULET-a" or "GULET-om" in the text; the search links keep boatTypes=GULET', () => {
    const html = readFileSync(`${ROOT}${HR_CROATIA_GULET}`, 'utf8');

    assert.deepEqual(textOnly(html).match(/GULET[-\p{L}]*/gu), null);
    assert.equal(html.match(/boatTypes=GULET"/g)?.length, 2);
    [
      'Gulet predstavlja',
      'krstarenje guletom',
      'Guleti privlače',
      'između guleta i motornjaka',
      'Tipični gulet',
    ].forEach(phrase => assert.ok(html.includes(phrase), phrase));
  });

  test('no other curated landing, in any language, writes a boat type as its enum in the text', () => {
    const offenders = [];

    readdirSync(`${ROOT}public/seo-content`).forEach(locale => {
      readdirSync(`${ROOT}public/seo-content/${locale}`)
        .filter(file => file.endsWith('.html'))
        .forEach(file => {
          const hits = textOnly(readFileSync(`${ROOT}public/seo-content/${locale}/${file}`, 'utf8')).match(
            /\b(?:GULETS?|GULET-\p{L}+|SAILING_YACHT|MOTOR_YACHT|POWER_CATAMARAN)\b/gu
          );

          if (hits) offenders.push(`${locale}/${file}: ${hits.join(', ')}`);
        });
    });

    assert.deepEqual(offenders, []);
  });
});
