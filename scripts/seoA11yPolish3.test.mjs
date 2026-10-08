/**
 * Small wording and structured-data fixes from the live check of 8.10.2026
 * after round 2 (_seo-audit-2026-10-08/live-verify-round2), round 3:
 *
 *   - F1: the model page's boat cards name the photo like every other card
 *     ("Lagoon 42 Zeus — photo", common.a11y.boatPhoto), not with the pipe
 *     title "Lagoon 42 | Zeus";
 *   - F2: a partner name written with "&", "/" or "-" between words is
 *     title-cased on both sides: "LADIES&GENTLEMEN" reads
 *     "Ladies&Gentlemen", not "Ladies&gentlemen" (display only);
 *   - X-03: the BreadcrumbList JSON-LD of /fleet and the /itineraries hub,
 *     area and route pages points at the page's locale ("/pl/fleet",
 *     "/it/itineraries/dodecanese"; English unprefixed), and the area crumb
 *     reads naturally in every locale ("Zona del Dodecaneso", "Zona de
 *     Šibenik", not "Dodecaneso zona", "Šibenik zona").
 *
 *   yarn test:polish
 */
import { createElement } from 'react';
import { renderToStaticMarkup } from 'react-dom/server';

import { NextIntlClientProvider, createTranslator } from 'next-intl';
import assert from 'node:assert/strict';
import { readFileSync, readdirSync } from 'node:fs';
import { registerHooks } from 'node:module';
import { describe, test } from 'node:test';
import { fileURLToPath } from 'node:url';

import './tsLoader.mjs';

// next/image is CommonJS (its default export does not survive an ESM import
// outside Next): a plain <img> stands in. The server components read their
// messages through a next-intl/server stand-in over the repo's catalogue.
registerHooks({
  resolve: (specifier, context, nextResolve) => {
    if (specifier === 'next/image') {
      return { url: new URL('./stubs/next-image.mjs', import.meta.url).href, shortCircuit: true };
    }

    if (specifier === 'next-intl/server') {
      return { url: new URL('./stubs/next-intl-server.mjs', import.meta.url).href, shortCircuit: true };
    }

    if (specifier === 'server-only') return { url: 'data:text/javascript,export {};', shortCircuit: true };

    try {
      return nextResolve(specifier, context);
    } catch (error) {
      if (error?.code === 'ERR_MODULE_NOT_FOUND' && /^(?:next|dayjs)\//u.test(specifier)) {
        return nextResolve(`${specifier}.js`, context);
      }

      throw error;
    }
  },
});

// The production origin (src/config/meta.ts reads it at import).
process.env.NEXT_PUBLIC_BASE_URL = 'https://www.boat4you.com';

const ORIGIN = 'https://www.boat4you.com';
const ROOT = fileURLToPath(new URL('../', import.meta.url));
const readJson = path => JSON.parse(readFileSync(`${ROOT}${path}`, 'utf8'));
const readSrc = path => readFileSync(`${ROOT}${path}`, 'utf8');
const LOCALES = ['en', 'de', 'fr', 'it', 'es', 'pt', 'nl', 'pl', 'hr'];
const catalogue = (locale, ...namespaces) =>
  Object.fromEntries(namespaces.map(ns => [ns, readJson(`messages/${locale}/${ns}.json`)]));

const { toTitleCase, yachtLabel } = await import('@/utils/static/toTitleCase');
const { default: ModelPageView } = await import('@/views/Models/ModelPageView');
const { buildBreadcrumbJsonLd, itineraryAreaCrumbName } = await import('@/utils/static/buildItineraryJsonLd');
const { itineraries } = await import('@/config/itineraries.config');
const { itineraryAreaName } = await import('@/utils/server/itineraryPlaceNames');

describe('F2: title case after "&", "/" and "-"', () => {
  test('"LADIES&GENTLEMEN" reads "Ladies&Gentlemen" (any input case)', () => {
    assert.equal(toTitleCase('LADIES&GENTLEMEN'), 'Ladies&Gentlemen');
    assert.equal(toTitleCase('ladies&gentlemen'), 'Ladies&Gentlemen');
    assert.equal(toTitleCase('B&B'), 'B&B');
  });

  test('words joined by "/" or "-" are each capitalised; a Roman numeral part stays upper', () => {
    assert.equal(toTitleCase('SUN/SEA'), 'Sun/Sea');
    assert.equal(toTitleCase('SEA-BREEZE'), 'Sea-Breeze');
    assert.equal(toTitleCase('JEAN-PIERRE II'), 'Jean-Pierre II');
    assert.equal(toTitleCase('ALPHA-II'), 'Alpha-II');
    assert.equal(toTitleCase("L'AVVENTURA-III"), "L'Avventura-III");
  });

  test('the existing rules are unchanged', () => {
    const cases = {
      'FIND US': 'Find Us',
      'rara AVIS': 'Rara Avis',
      'FIND US II': 'Find Us II',
      LILI: 'Lili',
      MIMI: 'Mimi',
      "L'AVVENTURA": "L'Avventura",
      "O'NEILL": "O'Neill",
      "OCEAN'S": "Ocean's",
      'M/S AURUM SKY': 'M/S Aurum Sky',
      'm/y lady': 'M/Y Lady',
      'MY Custom Anthea': 'MY Custom Anthea',
      'MY WAY': 'My Way',
      ' IDILA ': 'Idila',
      'FILIPPOS I  Boat': 'Filippos I Boat',
      'SUN & SEA': 'Sun & Sea',
      'SUN - SEA': 'Sun - Sea',
      'Lagoon 42': 'Lagoon 42',
      'Bali 4.6': 'Bali 4.6',
    };

    Object.entries(cases).forEach(([raw, shown]) => assert.equal(toTitleCase(raw), shown, raw));
    assert.equal(toTitleCase(null), '');
    assert.equal(toTitleCase(''), '');
  });

  test('the search card title and photo alt name the boat "Ladies&Gentlemen"', () => {
    const t = createTranslator({ locale: 'fr', messages: catalogue('fr', 'common'), namespace: 'common' });
    const name = toTitleCase('LADIES&GENTLEMEN');

    assert.equal(yachtLabel('Lagoon 450 Fly', name), 'Lagoon 450 Fly | Ladies&Gentlemen');
    assert.equal(
      t('a11y.boatPhoto', { label: yachtLabel('Lagoon 450 Fly', name, ' ') }),
      'Lagoon 450 Fly Ladies&Gentlemen — photo'
    );
  });
});

describe('F1: the model page names its card photos like the other cards', () => {
  const boat = (id, name, model = 'Lagoon 42') => ({
    id,
    slug: `lagoon-42-${id}`,
    modelName: model,
    name,
    mainImageId: id,
    location: { name: 'D-Marin Dalmacija Marina | Sukošan' },
  });

  const renderModelPage = async locale => {
    const element = await ModelPageView({
      locale,
      model: { displayName: 'Lagoon 42', path: '/yachts/lagoon/lagoon-42' },
      stats: { boats: 3, lengthM: null, cabins: null, guests: null, buildYear: null, weeklyPrice: null },
      layout: { berths: null, wc: null },
      boats: [boat(11680, 'ZEUS'), boat(11681, 'Masterpiece'), boat(11682, 'LADIES&GENTLEMEN', 'Lagoon 450 Fly')],
      where: [],
      otherModels: [],
      brandName: 'Lagoon',
      blogPost: null,
      showAllHref: '/search',
      breadcrumb: [],
      faq: [],
    });

    return renderToStaticMarkup(
      createElement(
        NextIntlClientProvider,
        { locale, messages: catalogue(locale, 'common', 'models'), timeZone: 'UTC' },
        element
      )
    );
  };

  LOCALES.forEach(locale => {
    test(`${locale}: "{boat} — photo" alts, pipe titles stay on the cards`, async () => {
      const html = await renderModelPage(locale);
      const photo = readJson(`messages/${locale}/common.json`).a11y.boatPhoto;
      const alts = [...html.matchAll(/<img[^>]*\salt="([^"]*)"/gu)].map(m => m[1].replace(/&amp;/gu, '&'));
      const titles = [...html.matchAll(/<h3[^>]*>([^<]*)<\/h3>/gu)].map(m => m[1].replace(/&amp;/gu, '&'));

      assert.deepEqual(
        alts,
        ['Lagoon 42 Zeus', 'Lagoon 42 Masterpiece', 'Lagoon 450 Fly Ladies&Gentlemen'].map(label =>
          photo.replace('{label}', label)
        )
      );
      assert.deepEqual(titles, ['Lagoon 42 | Zeus', 'Lagoon 42 | Masterpiece', 'Lagoon 450 Fly | Ladies&Gentlemen']);
      assert.ok(
        alts.every(alt => !alt.includes('|')),
        alts.join(', ')
      );
    });
  });
});

const areas = itineraries.flatMap(group => group.itinerary);
// The area names the itinerary pages show, per locale and area id.
const areaNames = Object.fromEntries(
  await Promise.all(
    LOCALES.map(async locale => [
      locale,
      Object.fromEntries(await Promise.all(areas.map(async area => [area.id, await itineraryAreaName(locale, area)]))),
    ])
  )
);

describe('X-03: itinerary and fleet BreadcrumbList JSON-LD', () => {
  const crumbT = locale =>
    createTranslator({ locale, messages: catalogue(locale, 'metadata'), namespace: 'metadata.itineraryBreadcrumb' });

  test('relative paths carry the page locale; English stays unprefixed; absolute URLs are kept', () => {
    const items = [
      { name: 'Home', url: '/' },
      { name: 'Fleet', url: '/fleet' },
      { name: 'Elsewhere', url: 'https://example.org/x' },
    ];
    const urls = locale => buildBreadcrumbJsonLd(locale, items).itemListElement.map(item => item.item);

    assert.deepEqual(urls('en'), [ORIGIN, `${ORIGIN}/fleet`, 'https://example.org/x']);
    assert.deepEqual(urls('pl'), [`${ORIGIN}/pl`, `${ORIGIN}/pl/fleet`, 'https://example.org/x']);
    assert.deepEqual(buildBreadcrumbJsonLd('it', [{ name: 'x', url: '/itineraries/dodecanese' }]).itemListElement[0], {
      '@type': 'ListItem',
      position: 1,
      name: 'x',
      item: `${ORIGIN}/it/itineraries/dodecanese`,
    });
  });

  test('no page builds the list without its locale', () => {
    const pages = [
      'src/app/[locale]/(root)/fleet/[[...page]]/page.tsx',
      'src/app/[locale]/(root)/itineraries/page.tsx',
      'src/app/[locale]/(root)/itineraries/[slug]/page.tsx',
      'src/app/[locale]/(root)/itineraries/[slug]/[id]/page.tsx',
    ];

    pages.forEach(page => {
      const src = readSrc(page);

      assert.match(src, /buildBreadcrumbJsonLd\(locale as LocaleType, \[/u, page);
      assert.doesNotMatch(src, /buildBreadcrumbJsonLd\(\[/u, page);
    });
    [
      'src/app/[locale]/(root)/itineraries/[slug]/page.tsx',
      'src/app/[locale]/(root)/itineraries/[slug]/[id]/page.tsx',
    ].forEach(page => assert.match(readSrc(page), /itineraryAreaCrumbName\(tCrumb, /u, page));
  });

  test('the area crumb in each locale (Dodecanese, Šibenik, Istria)', () => {
    const expected = {
      en: ['Dodecanese area', 'Šibenik area', 'Istria area'],
      de: ['Segelrevier Dodekanes', 'Segelrevier Šibenik', 'Segelrevier Istrien'],
      fr: ['Zone du Dodécanèse', 'Zone de Šibenik', "Zone d'Istrie"],
      it: ['Zona del Dodecaneso', 'Zona di Šibenik', "Zona dell'Istria"],
      es: ['Zona del Dodecaneso', 'Zona de Šibenik', 'Zona de Istria'],
      pt: ['Zona do Dodecaneso', 'Zona de Šibenik', 'Zona da Ístria'],
      nl: ['Vaargebied Dodekanesos', 'Vaargebied Šibenik', 'Vaargebied Istrië'],
      pl: ['Akwen Dodekanezu', 'Akwen Szybenika', 'Akwen Istrii'],
      hr: ['Područje Dodekaneza', 'Područje Šibenika', 'Područje Istre'],
    };

    LOCALES.forEach(locale => {
      const names = ['dodecanese', 'sibenik', 'istria'].map(id =>
        itineraryAreaCrumbName(crumbT(locale), id, areaNames[locale][id])
      );

      assert.deepEqual(names, expected[locale], locale);
    });
  });

  test('every area has its "of" form where the locale needs one, naming the same place', () => {
    const ids = areas.map(a => a.id).sort();
    const letters = value => value.toLocaleLowerCase().normalize('NFC');

    LOCALES.forEach(locale => {
      const crumb = readJson(`messages/${locale}/metadata.json`).itineraryBreadcrumb;
      const usesOf = crumb.area.includes('{areaOf}');

      assert.equal(crumb.area.includes('{area}') || usesOf, true, locale);

      if (!usesOf) {
        assert.equal(crumb.areaOf, undefined, `${locale}: an unused areaOf map`);

        return;
      }

      assert.deepEqual(Object.keys(crumb.areaOf).sort(), ids, `${locale}: areaOf ids`);

      areas.forEach(area => {
        const name = areaNames[locale][area.id];
        const of = letters(crumb.areaOf[area.id]);
        const words = name.split(/[\s&]+/u).filter(word => word.length >= 3);

        // Romance locales keep the name and add the article ("du Dodécanèse");
        // Polish and Croatian decline it ("Dodekanezu", "Dodekaneza").
        words.forEach(word => {
          const stem = ['pl', 'hr'].includes(locale) ? letters(word).slice(0, 3) : letters(word);

          assert.ok(of.includes(stem), `${locale} ${area.id}: "${crumb.areaOf[area.id]}" vs "${name}"`);
        });
      });
    });
  });

  test('no locale glues a suffix after the area ("Dodecaneso zona"); the old key is gone', () => {
    LOCALES.forEach(locale => {
      assert.equal(readJson(`messages/${locale}/itinerary.json`).breadcrumb.areaSuffix, undefined, locale);

      if (locale === 'en') return;

      areas.forEach(area => {
        const name = areaNames[locale][area.id];
        const crumb = itineraryAreaCrumbName(crumbT(locale), area.id, name);

        assert.doesNotMatch(crumb, /\s(?:zona|zone|revier|vaargebied|akwen|područje)$/iu, `${locale} ${area.id}`);
        assert.ok(!crumb.startsWith(name), `${locale} ${area.id}: "${crumb}"`);
      });
    });
  });

  test('the area phrases live in the server-only metadata namespace', () => {
    const client = readSrc('src/i18n/clientMessages.ts');

    assert.doesNotMatch(client, /'metadata'/u);
    readdirSync(`${ROOT}messages`).forEach(locale =>
      assert.equal(readJson(`messages/${locale}/itinerary.json`).breadcrumb.areaOf, undefined, locale)
    );
  });
});
