/**
 * Small SEO and accessibility fixes from the live check of 7.10.2026
 * (_seo-audit-2026-10-07/live-verify):
 *
 *   - boatTitle.ts boatSeoName — the boat page's meta / og / twitter
 *     description names the boat like the title: no quotes around the name;
 *   - inquiryOnlyBoat.ts isBookedByInquiry — a boat of an inquiry-only agency
 *     (`inquireOnly`) gets the inquiry FAQ (no price, no online checkout),
 *     like a boat without a bookable offer;
 *   - buildMetadata.ts buildAlternateLanguages — every hreflang alternate is
 *     that locale's canonical (`/de`, never `/de/`, which answers 308);
 *   - English accessible names on non-EN pages (header, landing filters,
 *     MUI Autocomplete "Open" / "No options") come from the catalogues now.
 *
 *   yarn test:polish
 */
import { createElement } from 'react';
import { renderToStaticMarkup } from 'react-dom/server';

import { NextIntlClientProvider, createTranslator } from 'next-intl';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { describe, test } from 'node:test';
import { fileURLToPath } from 'node:url';

import './tsLoader.mjs';

// The production origin (src/config/meta.ts reads it at import).
process.env.NEXT_PUBLIC_BASE_URL = 'https://www.boat4you.com';

const ROOT = fileURLToPath(new URL('../', import.meta.url));
const readJson = path => JSON.parse(readFileSync(`${ROOT}${path}`, 'utf8'));
const readSrc = path => readFileSync(`${ROOT}${path}`, 'utf8');
const LOCALES = ['en', 'de', 'fr', 'it', 'es', 'pt', 'nl', 'pl', 'hr'];
const catalogue = (locale, ...namespaces) =>
  Object.fromEntries(namespaces.map(ns => [ns, readJson(`messages/${locale}/${ns}.json`)]));
const QUOTES = /['‘’"“”„«»]/u;

const { boatSeoName, buildBoatTitle, titleBoatName } = await import('@/utils/static/boatTitle');
const { buildBoatDescription } = await import('@/utils/static/boatMetaDescription');
const { isBookedByInquiry, isInquiryOnlyBoat } = await import('@/utils/static/inquiryOnlyBoat');
const { buildYachtFaq } = await import('@/utils/static/yachtFaq');
const { buildAlternateLanguages, localizedUrl } = await import('@/utils/static/buildMetadata');
const { routing } = await import('@/i18n/routing');
const { default: AutocompleteMultiple } = await import('@/components/AutocompleteMultiple/AutocompleteMultiple');
const { default: FilterRangeSliderV2 } =
  await import('@/views/Search/SearchView/FiltersSectionV2/atoms/FilterRangeSliderV2');

const masterpiece = readJson('scripts/fixtures/masterpiece-offers-2026-10-07.json');

describe('boat page description: the boat named like the title, no quotes', () => {
  const masterpieceDesc = (locale, inquiryOnly = false) => {
    const t = createTranslator({ locale, messages: catalogue(locale, 'metadata') });

    return buildBoatDescription((key, values) => t(`metadata.boat.${key}`, values), {
      name: boatSeoName({ model: 'Lagoon 42', name: 'Masterpiece', year: 2018 }),
      marina: 'D-Marin Dalmacija Marina, Sukošan',
      cabins: 6,
      berths: 12,
      inquiryOnly,
    });
  };

  test('Lagoon 42 Masterpiece (2018), EN: the sentence of 7.10. without the quotes', () => {
    assert.equal(
      masterpieceDesc('en'),
      'Charter the Lagoon 42 Masterpiece (2018) from D-Marin Dalmacija Marina, Sukošan. 6 cabins, 12 berths. Check availability and book directly on boat4you.com.'
    );
  });

  test('all 9 locales: "Lagoon 42 Masterpiece (2018)" and no quote character', () => {
    LOCALES.forEach(locale => {
      const desc = masterpieceDesc(locale);

      assert.ok(desc.includes('Lagoon 42 Masterpiece (2018)'), `${locale}: ${desc}`);
      assert.doesNotMatch(desc, QUOTES, `${locale}: ${desc}`);
    });
  });

  test('the description names the boat as the title does', () => {
    const cases = [
      { model: 'Lagoon 42', name: 'Masterpiece', year: 2018 },
      { model: 'Bavaria Cruiser 40', name: 'Bavaria Cruiser 40', year: 2010 },
      { model: 'Lagoon 450', name: titleBoatName('Libertà - Luxury Catamaran, A/c, Generator'), year: 2019 },
      { model: 'Oceanis 46.1', name: '', year: null },
    ];

    cases.forEach(c => {
      const { title } = buildBoatTitle({ ...c, tail: 'Charter' });

      assert.equal(`${boatSeoName(c)} — Charter`, title);
    });
    assert.equal(boatSeoName(cases[2]), 'Lagoon 450 Libertà (2019)');
    assert.equal(boatSeoName(cases[1]), 'Bavaria Cruiser 40 (2010)');
    assert.equal(boatSeoName(cases[3]), 'Oceanis 46.1');
  });

  test('a boat booked by inquiry closes with the inquiry call', () => {
    assert.match(masterpieceDesc('en', true), /Send an inquiry for your dates on boat4you\.com\.$/);
  });
});

describe('isBookedByInquiry: no bookable offer, or an inquiry-only agency', () => {
  test('the flags', () => {
    assert.equal(isBookedByInquiry({ hasBookableFutureOffer: false }), true);
    assert.equal(isBookedByInquiry({ hasBookableFutureOffer: true, inquireOnly: true }), true);
    assert.equal(isBookedByInquiry({ hasBookableFutureOffer: true, inquireOnly: false }), false);
    assert.equal(isBookedByInquiry({ inquireOnly: false }), false);
    assert.equal(isBookedByInquiry({}), false);
    assert.equal(isBookedByInquiry(null), false);
    assert.equal(isBookedByInquiry(undefined), false);
  });

  test('the calendar rule is unchanged: an inquiry-only agency still shows its dates', () => {
    assert.equal(isInquiryOnlyBoat({ hasBookableFutureOffer: true, inquireOnly: true }), false);
    assert.equal(isInquiryOnlyBoat({ hasBookableFutureOffer: false }), true);
  });
});

describe('yacht FAQ of a boat booked by inquiry', () => {
  const boat = overrides => ({
    id: 3664,
    name: 'YVONNE',
    model: 'Bavaria Cruiser 41',
    offers: masterpiece.offers,
    charterType: ['BAREBOAT'],
    location: { name: 'Marina Kremik', countryCode: 'HR' },
    defaultCheckin: '17:00',
    defaultCheckout: '09:00',
    ...overrides,
  });
  const keys = (yacht, price = 1615) =>
    buildYachtFaq(yacht, (key, values) => `${key}|${values?.name ?? ''}`, 'en', undefined, price).map(e => e.answer);

  test('Yvonne 3664 (inquiry-only agency, bookable weeks): no price, the agency inquiry answer', () => {
    const answers = keys(boat({ inquireOnly: true, hasBookableFutureOffer: true }));

    assert.equal(
      answers.some(a => a.startsWith('faqPriceA')),
      false
    );
    assert.equal(answers.at(-1), 'faqBookAgencyInquiryA|Yvonne');
  });

  test('no bookable offer: the answer that says no dates are published, as before', () => {
    const answers = keys(boat({ inquireOnly: true, hasBookableFutureOffer: false }));

    assert.equal(answers.at(-1), 'faqBookInquiryA|Yvonne');
    assert.equal(keys(boat({ hasBookableFutureOffer: false })).at(-1), 'faqBookInquiryA|Yvonne');
  });

  test('a bookable boat keeps its price and online-booking answers', () => {
    const answers = keys(boat({ inquireOnly: false, hasBookableFutureOffer: true }));

    assert.ok(answers.some(a => a.startsWith('faqPriceA')));
    assert.match(answers.at(-1), /^faqBookA\d\|Yvonne$/);
  });

  test('all 9 locales: the agency answer names the boat and promises no checkout', () => {
    const yacht = boat({ inquireOnly: true, hasBookableFutureOffer: true });

    LOCALES.forEach(locale => {
      const t = createTranslator({ locale, messages: catalogue(locale, 'yacht') });
      const faq = buildYachtFaq(yacht, (key, values) => t(`yacht.${key}`, values), locale, undefined, 1615);
      const book = faq.at(-1);

      assert.equal(book.question, t('yacht.faqBookInquiryQ', { name: 'Yvonne' }), locale);
      assert.ok(book.answer.includes('Yvonne'), `${locale}: ${book.answer}`);
      assert.doesNotMatch(book.answer, /checkout|paiement|pagamento|pago|betaling|płatnoś|naplat/iu, locale);
      assert.equal(
        faq.some(e => /1[.,  ]?615/u.test(e.answer)),
        false,
        `${locale}: no price`
      );
    });
  });
});

describe('buildAlternateLanguages: every alternate is that locale’s canonical', () => {
  test('home: no trailing slash, EN at the root', () => {
    const home = buildAlternateLanguages('/');

    assert.equal(home.en, 'https://www.boat4you.com');
    assert.equal(home['x-default'], 'https://www.boat4you.com');
    assert.equal(home.de, 'https://www.boat4you.com/de');
    routing.locales.forEach(locale => assert.equal(home[locale], localizedUrl(locale, '/'), locale));
    Object.values(home).forEach(url => assert.doesNotMatch(url, /\/$/u, url));
    assert.equal(Object.keys(home).length, routing.locales.length + 1);
  });

  test('other pages unchanged; a subset keeps x-default only with EN', () => {
    assert.deepEqual(buildAlternateLanguages('/boat/lagoon-42-masterpiece-11681', ['en', 'de']), {
      en: 'https://www.boat4you.com/boat/lagoon-42-masterpiece-11681',
      de: 'https://www.boat4you.com/de/boat/lagoon-42-masterpiece-11681',
      'x-default': 'https://www.boat4you.com/boat/lagoon-42-masterpiece-11681',
    });
    assert.deepEqual(buildAlternateLanguages('/search?destinations=croatia', ['hr']), {
      hr: 'https://www.boat4you.com/hr/search?destinations=croatia',
    });
  });
});

describe('accessible names in the page’s language', () => {
  const NEW_KEYS = [
    ['common', 'a11y.viewType'],
    ['common', 'a11y.listView'],
    ['common', 'a11y.gridView'],
    ['common', 'a11y.rangeMin'],
    ['common', 'a11y.rangeMax'],
    ['common', 'noMatches'],
    ['home', 'allDestinationsSection.continentsLabel'],
    ['yacht', 'faqBookAgencyInquiryA'],
  ];
  // Existing keys the labels reuse.
  const REUSED = [
    ['common', 'favorites'],
    ['common', 'a11y.openList'],
    ['common', 'a11y.closeList'],
    ['home', 'languageModal.title'],
    ['filters', 'sortBy'],
  ];
  const lookup = (locale, ns, path) =>
    path.split('.').reduce((node, key) => node?.[key], readJson(`messages/${locale}/${ns}.json`));

  test('every key in all 9 locales, translated', () => {
    [...NEW_KEYS, ...REUSED].forEach(([ns, path]) => {
      const en = lookup('en', ns, path);

      LOCALES.forEach(locale => {
        const value = lookup(locale, ns, path);

        assert.equal(typeof value, 'string', `${locale} ${ns}.${path}`);
        assert.ok(value.trim(), `${locale} ${ns}.${path}`);

        if (locale !== 'en' && !path.startsWith('a11y.range')) assert.notEqual(value, en, `${locale} ${ns}.${path}`);
      });
    });
  });

  const render = (locale, element) =>
    renderToStaticMarkup(
      createElement(NextIntlClientProvider, { locale, messages: catalogue(locale, 'common'), timeZone: 'UTC' }, element)
    );

  test('filter dropdowns: the arrow is "Ouvrir la liste" on /fr, never MUI\'s "Open"', () => {
    LOCALES.forEach(locale => {
      const html = render(
        locale,
        createElement(AutocompleteMultiple, {
          value: [],
          options: [{ id: '1', label: 'Lagoon' }],
          onChange: () => {},
          placeholder: 'x',
        })
      );
      const open = readJson(`messages/${locale}/common.json`).a11y.openList;

      assert.ok(html.includes(`aria-label="${open}"`), `${locale}: ${open}`);
      assert.ok(html.includes(`title="${open}"`), `${locale}: ${open}`);

      if (locale !== 'en') assert.doesNotMatch(html, /"Open"/u, locale);
    });
  });

  test('range sliders: "<label> minimum / maximum" in the page’s language', () => {
    const html = render(
      'de',
      createElement(FilterRangeSliderV2, {
        min: 0,
        max: 10,
        vMin: 2,
        vMax: 8,
        onChange: () => {},
        ariaLabel: 'Baujahr',
      })
    );

    assert.ok(html.includes('aria-label="Baujahr: Minimum"'), html);
    assert.ok(html.includes('aria-label="Baujahr: Maximum"'), html);
  });

  test('no hard-coded English accessible names left in the header and landing components', () => {
    [
      'src/components/Header/Favorites/Favorites.tsx',
      'src/components/Header/LanguageCurrency/LanguageCurrency.tsx',
      'src/views/Search/SearchView/BoatsWrapper/BoatsSection/BoatsSection.tsx',
      'src/views/Home/AllDestinationsSection/AllDestinationsSection.tsx',
    ].forEach(path => assert.doesNotMatch(readSrc(path), /aria-label="/u, path));
    assert.doesNotMatch(
      readSrc('src/components/AutocompleteMultipleChip/AutocompleteMultipleChip.tsx'),
      /noOptionsText="/u
    );
  });
});

describe('404: one robots tag', () => {
  test('the not-found metadata adds no robots tag of its own and drops the layout\'s "index"', () => {
    assert.match(readSrc('src/app/[locale]/not-found.tsx'), /^\s{2}robots: null,$/mu);
  });
});
