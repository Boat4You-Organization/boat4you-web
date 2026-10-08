/**
 * A gulet is always chartered with its crew (owner, 8.10.2026: "GULET JE
 * UVIJEK SA POSADOM"; guletCrewed.ts): the site never offers or suggests a
 * gulet bareboat or with a skipper only. Other boat types keep the partner's
 * charter types. A gulet is vessel type GULET, or a boat whose partner model
 * is a gulet ("Gulet", "OK AY Gulet": Gallant 11771 and Ok Ay 47 are typed
 * MOTOR_YACHT), never by the boat's own name; "Guletta 20" is no gulet.
 *
 *   - the boat page FAQ (visible + FAQPage JSON-LD): the crewed licence
 *     answer, also for a gulet the partner tags BAREBOAT as well (Sylvia R,
 *     18886, the only one of the 219 live gulets on 8.10.2026);
 *   - "Good to know" (boat page, my bookings): no "Sailing licence required";
 *   - the boat PDF: "Crewed · Gulet", never "Bareboat · Gulet" (143 of the
 *     219 gulets carry no crew count);
 *   - the boat page FAQ and My bookings: no general licence FAQ group
 *     ("can I skipper the yacht myself?") for a gulet;
 *   - the search: no rental type (Bareboat / With skipper) when only gulets
 *     are searched — not as a filter, a chip, nor in the listing,
 *     distribution or relax requests of an old link; the charter facts of a
 *     gulet landing show no skipper tile and do not say the skipper is paid
 *     separately;
 *   - the curated gulet landing texts (public/seo-content/<locale>/*gulet*.html,
 *     9 languages): no "add a skipper after booking bareboat", bareboat
 *     licence answer, "mixed bareboat-and-skippered packages", semi-bareboat
 *     gulets, "most gulets include crew" or "crew arrangement if you prefer",
 *     and no bareboat / without skipper in the <title> or meta description
 *     (seo-corpus-qa.py --gulet-crewed).
 *
 *   yarn test:gulet
 */
import { createElement, isValidElement } from 'react';
import { renderToStaticMarkup } from 'react-dom/server';

import { NextIntlClientProvider, createTranslator } from 'next-intl';
import assert from 'node:assert/strict';
import { spawnSync } from 'node:child_process';
import { readFileSync } from 'node:fs';
import { registerHooks } from 'node:module';
import { describe, test } from 'node:test';
import { fileURLToPath } from 'node:url';

import './tsLoader.mjs';

// `next/link` (GoodToKnowItem) is an extensionless deep import of a package
// without an `exports` map; it is not rendered here (no `link` prop).
registerHooks({
  resolve: (specifier, context, nextResolve) => {
    // `server-only` throws outside a React server bundle; the server modules
    // are imported for their pure helpers here.
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
const readJson = path => JSON.parse(readFileSync(`${ROOT}${path}`, 'utf8'));

const {
  boatTypesUpdate,
  isGulet,
  isGuletOnly,
  isGuletType,
  licenceFaqCategory,
  offersBareboat,
  withoutGuletRentalType,
} = await import('@/utils/static/guletCrewed');
const { getFAQByCategory } = await import('@/lib/page');
const { reservationTabs, reservationTabsFor } = await import('@/config/tabs.config');
const { yachtFetchParams } = await import('@/utils/server/searchLanding');
const { factsFormat, factsTiles } = await import('@/views/Search/CharterFacts/factsContent');
const { default: AppliedFilterChips } =
  await import('@/views/Search/SearchView/FiltersSectionV2/atoms/AppliedFilterChips');
const { buildYachtFaq, buildYachtFaqSchema } = await import('@/utils/static/yachtFaq');
const { createFmt } = await import('@/utils/static/yachtCapacity');
const { default: YachtPDF } = await import('@/components/YachtPDF/YachtPDF');
const { default: BoatGoodToKnowTab } = await import('@/views/Boat/BoatContentSection/GoodToKnowTab/GoodToKnowTab');
const { default: BookingGoodToKnowTab } =
  await import('@/views/MyBookings/ReservationDetails/ReservationContent/ReservationInfoSection/GoodToKnowTab/GoodToKnowTab');

const LOCALES = ['en', 'de', 'fr', 'it', 'es', 'pt', 'nl', 'pl', 'hr'];
// "Bareboat" and "skipper" in the nine languages (FAQ answers, facts note).
const SELF_SAIL =
  /bareboat|skipper|skiper|schipper|patr[oó]n|sans équipage|senza equipaggio|sin tripulación|sem tripulação|zonder bemanning|bez załogi|bez posade/i;

// Gulet Sylvia R (live API 8.10.2026, Club Marina | Göcek): CREWED + BAREBOAT, no crew count.
const sylviaR = {
  id: 18886,
  slug: 'gulet-sylvia-r-18886',
  name: 'Sylvia R',
  model: 'Gulet',
  vesselType: 'GULET',
  charterType: ['CREWED', 'BAREBOAT'],
  location: { name: 'Club Marina | Göcek', countryCode: 'TR' },
  buildYear: 2008,
  length: 34,
  beam: 7.5,
  cabins: 6,
  berths: 12,
  wc: 6,
  maxPersons: null,
  crewNumber: null,
  capacity: {
    cabins: { value: 6, note: null, split: null },
    berths: { value: 12, note: null, split: null },
    heads: { value: 6, note: null, split: null },
  },
  defaultCheckin: '15:00',
  defaultCheckout: '09:30',
  yachtImages: [],
  amenities: [],
  services: [],
  offers: [],
  custom: false,
  inquireOnly: false,
  hasBookableFutureOffer: true,
};
// Gulet Elena (live 14073, Fethiye): CREWED only, no crew count.
const elena = { ...sylviaR, id: 14073, slug: 'gulet-elena-14073', name: 'Elena', charterType: ['CREWED'] };
// A bareboat catamaran and a crewed motor yacht: the partner's charter types, unchanged.
const masterpiece = {
  ...sylviaR,
  id: 11681,
  slug: 'lagoon-42-masterpiece-11681',
  name: 'Masterpiece',
  model: 'Lagoon 42',
  vesselType: 'CATAMARAN',
  charterType: ['BAREBOAT'],
  location: { name: 'D-Marin Dalmacija Marina | Sukošan', countryCode: 'HR' },
};
const crewedMotorYacht = {
  ...masterpiece,
  id: 9001,
  name: 'Example',
  vesselType: 'MOTOR_YACHT',
  charterType: ['CREWED'],
};
const bothWaysSailingYacht = {
  ...masterpiece,
  id: 9002,
  vesselType: 'SAILING_YACHT',
  charterType: ['CREWED', 'BAREBOAT'],
};
// Gulets the partner types as a motor yacht (live 8.10.2026: "Sailing licence
// required" in Good to know, the general licence FAQ group under the FAQ).
const gallant = {
  ...sylviaR,
  id: 11771,
  slug: 'gulet-gallant-11771',
  name: 'Gallant',
  model: 'Gulet',
  modelName: 'Gulet',
  vesselType: 'MOTOR_YACHT',
  charterType: ['CREWED'],
  crewNumber: 5,
  location: { name: 'Port of Split / East Harbour | Split', countryCode: 'HR' },
};
const okAy = {
  ...gallant,
  id: 47,
  slug: 'custom-made-ok-ay-gulet-ok-ay-47',
  name: 'Ok Ay',
  model: 'OK AY Gulet',
  modelName: 'OK AY Gulet',
  charterType: ['CREWED', 'ALL_INCLUSIVE'],
  crewNumber: 3,
  location: { name: 'Fethiye, Ece Saray Marina Resort', countryCode: 'TR' },
};
// A model gulet typed SAILING_YACHT, tagged BAREBOAT as well, no crew count.
const sailingTypedGulet = {
  ...gallant,
  id: 9005,
  name: 'Bluefest',
  vesselType: 'SAILING_YACHT',
  charterType: ['CREWED', 'BAREBOAT'],
  crewNumber: null,
};
// No gulets: a longer word in the model, and a boat only *named* "Gulet …".
const guletta = { ...bothWaysSailingYacht, id: 9003, model: 'Guletta 20', modelName: 'Guletta 20' };
const namedGulet = {
  ...bothWaysSailingYacht,
  id: 9004,
  name: 'Gulet Dream',
  model: 'Oceanis 46',
  modelName: 'Oceanis 46',
};

const yachtT = locale => {
  const t = createTranslator({
    locale,
    messages: { yacht: readJson(`messages/${locale}/yacht.json`) },
    namespace: 'yacht',
  });

  return (key, values) => t(key, values);
};
const licenceEntry = (yacht, locale) => {
  const t = yachtT(locale);
  const question = t('faqLicenceQ', { name: yacht.name });
  const entries = buildYachtFaq(yacht, t, locale, undefined, null);

  return { entry: entries.find(e => e.question === question), entries, t };
};

describe('guletCrewed.ts', () => {
  test('the vessel type GULET is a gulet type; nothing else is', () => {
    assert.equal(isGuletType('GULET'), true);
    assert.equal(isGulet({ vesselType: 'GULET' }), true);
    ['CATAMARAN', 'MOTOR_YACHT', 'SAILING_YACHT', '', null, undefined].forEach(type => {
      assert.equal(isGuletType(type), false, String(type));
      assert.equal(isGulet({ vesselType: type }), false, String(type));
    });
    assert.equal(isGulet(null), false);
    assert.equal(isGulet(undefined), false);
  });

  test('a gulet typed as a motor or sailing yacht: the word "gulet" in its model', () => {
    [
      gallant,
      okAy,
      sailingTypedGulet,
      // A search row and a booking carry the model as modelName; the boat page as model too.
      { vesselType: 'MOTOR_YACHT', modelName: 'Gulet' },
      { vesselType: 'MOTOR_YACHT', modelName: 'OK AY Gulet' },
      { vesselType: 'SAILING_YACHT', model: 'gulet' },
      { vesselType: null, modelName: 'Custom Gulet 24m' },
    ].forEach(boat => assert.equal(isGulet(boat), true, JSON.stringify(boat)));
  });

  test('never the boat\'s own name, never a longer word: "Guletta 20", "Gulet Dream" stay what they are', () => {
    [
      guletta,
      namedGulet,
      { vesselType: 'MOTOR_YACHT', name: 'Gulet Babac', model: 'Babac', modelName: 'Babac' },
      { vesselType: 'MOTOR_YACHT', modelName: 'Motor sailer' },
      { vesselType: 'SAILING_YACHT', modelName: 'Guletta 20' },
      { vesselType: 'CATAMARAN', modelName: 'Lagoon 42' },
      { vesselType: 'MOTOR_YACHT', model: null, modelName: null },
    ].forEach(boat => assert.equal(isGulet(boat), false, JSON.stringify(boat)));
  });

  test('a boat-type filter knows no model: gulets only is GULET only', () => {
    assert.equal(isGuletOnly(['GULET', 'MOTOR_YACHT']), false);
    assert.equal(isGuletOnly(['MOTOR_YACHT']), false);
  });

  test('gulets only: one or more GULET and nothing else', () => {
    assert.equal(isGuletOnly(['GULET']), true);
    assert.equal(isGuletOnly(['GULET', 'GULET']), true);
    assert.equal(isGuletOnly(['GULET', 'CATAMARAN']), false);
    assert.equal(isGuletOnly([]), false);
    assert.equal(isGuletOnly(null), false);
    assert.equal(isGuletOnly(undefined), false);
  });

  test('a gulet is never offered bareboat, whatever the partner tags', () => {
    assert.equal(offersBareboat(sylviaR), false);
    assert.equal(offersBareboat(sailingTypedGulet), false);
    assert.equal(
      offersBareboat({ vesselType: 'MOTOR_YACHT', modelName: 'OK AY Gulet', charterType: 'BAREBOAT' }),
      false
    );
    assert.equal(offersBareboat({ vesselType: 'GULET', charterType: ['BAREBOAT'] }), false);
    assert.equal(offersBareboat({ vesselType: 'GULET', charterType: 'BAREBOAT' }), false);
  });

  test('other boat types: the partner charter types as sent', () => {
    assert.equal(offersBareboat(masterpiece), true);
    assert.equal(offersBareboat(bothWaysSailingYacht), true);
    assert.equal(offersBareboat({ vesselType: 'CATAMARAN', charterType: 'BAREBOAT' }), true);
    assert.equal(offersBareboat(crewedMotorYacht), false);
    assert.equal(offersBareboat({ vesselType: 'CATAMARAN', charterType: null }), false);
    assert.equal(offersBareboat(guletta), true);
    assert.equal(offersBareboat(namedGulet), true);
  });
});

describe('boat page FAQ licence answer (visible + FAQPage JSON-LD)', () => {
  LOCALES.forEach(locale => {
    test(`${locale}: Sylvia R (gulet, also tagged BAREBOAT) gets a crewed answer with no bareboat or skipper`, () => {
      const { entry, entries, t } = licenceEntry(sylviaR, locale);
      const crewed = [0, 1].map(i => t(`faqLicenceCrewedA${i}`, { name: 'Sylvia R' }));

      assert.ok(entry, 'the licence question is asked');
      assert.ok(crewed.includes(entry.answer), entry.answer);
      assert.doesNotMatch(entry.answer, SELF_SAIL);

      const schema = buildYachtFaqSchema(entries);
      const schemaAnswer = schema.mainEntity.find(q => q.name === entry.question).acceptedAnswer.text;

      assert.equal(schemaAnswer, entry.answer);
    });

    test(`${locale}: gulets typed as a motor or sailing yacht get the crewed answer`, () => {
      [gallant, okAy, sailingTypedGulet].forEach(yacht => {
        const { entry, t } = licenceEntry(yacht, locale);
        const crewed = [0, 1].map(i => t(`faqLicenceCrewedA${i}`, { name: yacht.name }));

        assert.ok(crewed.includes(entry.answer), `${yacht.name}: ${entry.answer}`);
        assert.doesNotMatch(entry.answer, SELF_SAIL, yacht.name);
      });

      const { entry, t } = licenceEntry(guletta, locale);

      assert.ok(
        [0, 1, 2].map(i => t(`faqLicenceBareboatA${i}`, { name: guletta.name })).includes(entry.answer),
        `Guletta 20: ${entry.answer}`
      );
    });

    test(`${locale}: a bareboat catamaran keeps the bareboat answer`, () => {
      const { entry, t } = licenceEntry(masterpiece, locale);
      const bareboat = [0, 1, 2].map(i => t(`faqLicenceBareboatA${i}`, { name: 'Masterpiece' }));

      assert.ok(bareboat.includes(entry.answer), entry.answer);
    });
  });

  test('a sailing yacht offered both ways keeps the bareboat answer; a crewed motor yacht the crewed one', () => {
    const t = yachtT('en');

    assert.match(licenceEntry(bothWaysSailingYacht, 'en').entry.answer, /licence/i);
    assert.ok(
      [0, 1]
        .map(i => t(`faqLicenceCrewedA${i}`, { name: 'Example' }))
        .includes(licenceEntry(crewedMotorYacht, 'en').entry.answer)
    );
  });
});

const messagesFor = (locale, namespaces) =>
  Object.fromEntries(namespaces.map(ns => [ns, readJson(`messages/${locale}/${ns}.json`)]));
const renderText = (element, locale) =>
  renderToStaticMarkup(
    createElement(
      NextIntlClientProvider,
      { locale, messages: messagesFor(locale, ['common', 'yacht']), timeZone: 'Europe/Zagreb' },
      element
    )
  )
    .replace(/<style[^>]*>[^<]*<\/style>/g, ' ')
    .replace(/<[^>]+>/g, ' ')
    .replace(/&amp;/g, '&')
    .replace(/&#x27;|&#39;/g, "'")
    .replace(/\s+/g, ' ');

describe('"Good to know": no sailing licence asked for a gulet', () => {
  LOCALES.forEach(locale => {
    test(`${locale}: boat page and my bookings`, () => {
      const common = readJson(`messages/${locale}/common.json`);
      const licence = common.sailingLicenceRequired;

      [sylviaR, elena].forEach(yacht => {
        const page = renderText(createElement(BoatGoodToKnowTab, { yacht }), locale);

        assert.ok(!page.includes(licence), `${yacht.name}: ${page}`);
        assert.ok(page.includes(common.cancellationPolicy), page);
      });
      assert.ok(renderText(createElement(BoatGoodToKnowTab, { yacht: masterpiece }), locale).includes(licence));
      assert.ok(renderText(createElement(BoatGoodToKnowTab, { yacht: crewedMotorYacht }), locale).includes(licence));

      assert.ok(!renderText(createElement(BookingGoodToKnowTab, { vesselType: 'GULET' }), locale).includes(licence));
      [gallant, okAy, sailingTypedGulet].forEach(yacht => {
        const page = renderText(createElement(BoatGoodToKnowTab, { yacht }), locale);
        const booking = renderText(
          createElement(BookingGoodToKnowTab, { vesselType: yacht.vesselType, modelName: yacht.modelName }),
          locale
        );

        assert.ok(!page.includes(licence), `${yacht.name}: ${page}`);
        assert.ok(!booking.includes(licence), `${yacht.name}: ${booking}`);
      });
      [guletta, namedGulet].forEach(yacht => {
        assert.ok(renderText(createElement(BoatGoodToKnowTab, { yacht }), locale).includes(licence), yacht.model);
        assert.ok(
          renderText(
            createElement(BookingGoodToKnowTab, { vesselType: yacht.vesselType, modelName: yacht.modelName }),
            locale
          ).includes(licence),
          yacht.model
        );
      });
      assert.ok(renderText(createElement(BookingGoodToKnowTab, { vesselType: 'CATAMARAN' }), locale).includes(licence));
      assert.ok(renderText(createElement(BookingGoodToKnowTab, {}), locale).includes(licence));
    });
  });
});

/** Every string of the PDF element tree (function components expanded). */
const pdfStrings = node => {
  if (node == null || typeof node === 'boolean') return [];

  if (typeof node === 'string' || typeof node === 'number') return [String(node)];

  if (Array.isArray(node)) return node.flatMap(pdfStrings);

  if (!isValidElement(node)) return [];

  if (typeof node.type === 'function') return pdfStrings(node.type(node.props));

  const { children } = node.props;

  // One <Text> of several pieces ("per week · ", "crewed", " charter") reads as one string.
  return Array.isArray(children) && children.every(c => ['string', 'number'].includes(typeof c))
    ? [children.join('')]
    : pdfStrings(children);
};
const pdfText = yacht =>
  pdfStrings(
    YachtPDF({
      yacht,
      offer: null,
      pageUrl: `https://www.boat4you.com/boat/${yacht.slug}`,
      heroSrc: 'data:image/jpeg;base64,',
      gallerySrcs: [],
      qrDataUrl: 'data:image/png;base64,',
      baseUrl: 'https://www.boat4you.com',
      generatedDate: '8 October 2026',
      locale: 'en',
      capacityFmt: createFmt(readJson('messages/en/capacity.json'), 'en'),
    })
  );

describe('boat PDF: a gulet is a crewed charter', () => {
  test('Sylvia R and Elena (no crew count): "Crewed · Gulet", "crewed charter", never bareboat', () => {
    [sylviaR, elena].forEach(yacht => {
      const strings = pdfText(yacht);

      assert.ok(
        strings.some(s => /^Crewed {2}· {2}Gulet/i.test(s)),
        strings.join(' | ')
      );
      assert.ok(strings.some(s => s.includes('per week · crewed charter')));
      assert.ok(!strings.some(s => /bareboat/i.test(s)), strings.join(' | '));
    });
  });

  test('a gulet typed as a sailing yacht, no crew count, also tagged BAREBOAT: "Crewed", never bareboat', () => {
    const strings = pdfText(sailingTypedGulet);

    assert.ok(
      strings.some(s => /^Crewed {2}· /i.test(s)),
      strings.join(' | ')
    );
    assert.ok(strings.some(s => s.includes('per week · crewed charter')));
    assert.ok(!strings.some(s => /bareboat/i.test(s)), strings.join(' | '));
  });

  test('"Guletta 20" offered both ways without a crew count stays "Bareboat"', () => {
    const strings = pdfText({ ...guletta, crewNumber: null });

    assert.ok(
      strings.some(s => /^Bareboat {2}· /i.test(s)),
      strings.join(' | ')
    );
  });

  test('a bareboat catamaran stays "Bareboat · Catamaran"', () => {
    const strings = pdfText(masterpiece);

    assert.ok(
      strings.some(s => /^Bareboat {2}· {2}Catamaran/i.test(s)),
      strings.join(' | ')
    );
    assert.ok(strings.some(s => s.includes('per week · bareboat charter')));
  });
});

describe('search: gulet landings', () => {
  test('the gulet facts note is the note without the skipper, in all nine languages', () => {
    LOCALES.forEach(locale => {
      const facts = readJson(`messages/${locale}/charterFacts.json`);

      assert.match(facts.note, SELF_SAIL, locale);
      assert.doesNotMatch(facts.noteGulet, SELF_SAIL, locale);
      // Same sentence otherwise: only "skipper, " is gone.
      assert.ok(facts.note.length - facts.noteGulet.length <= 12, locale);
      assert.equal(facts.noteGulet.slice(0, 60), facts.note.slice(0, 60), locale);
    });
  });
});

describe('the general licence FAQ: never under a gulet', () => {
  // The seven locales whose faq.md names the group the boat page asks for.
  const GROUP_LOCALES = ['en', 'de', 'fr', 'it', 'es', 'pt', 'hr'];
  const SKIPPER_YOURSELF = {
    en: 'can I skipper the yacht myself?',
    de: 'kann ich die Yacht selbst steuern?',
    hr: 'mogu sam upravljati jahtom?',
  };

  test('a gulet gets no licence group, in every locale; other boats keep theirs', () => {
    LOCALES.forEach(locale => {
      [{ vesselType: 'GULET' }, gallant, okAy, sailingTypedGulet].forEach(boat =>
        assert.equal(licenceFaqCategory(locale, boat), null, `${locale} ${boat.vesselType} ${boat.modelName}`)
      );
      ['CATAMARAN', 'SAILING_YACHT', 'MOTOR_YACHT', null, undefined].forEach(type =>
        assert.ok(licenceFaqCategory(locale, { vesselType: type }), `${locale} ${type}`)
      );
      [guletta, namedGulet, null, undefined].forEach(boat =>
        assert.ok(licenceFaqCategory(locale, boat), `${locale} ${boat?.modelName}`)
      );
    });
  });

  test('a catamaran still loads the licence group (the questions the gulet must not get)', async () => {
    for (const locale of GROUP_LOCALES) {
      const questions = await getFAQByCategory(locale, 'static', 'faq', licenceFaqCategory(locale, 'CATAMARAN'));

      assert.ok(questions?.length >= 5, locale);

      if (SKIPPER_YOURSELF[locale]) {
        assert.ok(
          questions.some(q => q.title.includes(SKIPPER_YOURSELF[locale])),
          `${locale}: ${questions.map(q => q.title).join(' | ')}`
        );
      }
    }
  });

  test('the boat page FAQ tab neither requests nor renders the group without a category', () => {
    const src = readFileSync(`${ROOT}src/views/Boat/BoatContentSection/FAQTab/FAQTab.tsx`, 'utf8');

    assert.match(src, /const category = licenceFaqCategory\(locale, yacht\);/);
    assert.match(src, /useEffect\(\(\) => \{\s*if \(!category\) return;\s*startTransition\(\(\) => \{\s*getFAQAction/);
    assert.match(src, /\{category && faqAction && <AccordionMenu accordionList=\{faqAction\} \/>\}/);
  });

  test('My bookings: a gulet booking has no FAQ tab, the others keep all seven', () => {
    const withoutFaq = reservationTabs.filter(tab => tab !== 'reservationTabs.faq');

    // A booking carries the vessel type and the model as modelName.
    [
      { vesselType: 'GULET', modelName: 'Gulet' },
      { vesselType: 'MOTOR_YACHT', modelName: 'Gulet' },
      { vesselType: 'MOTOR_YACHT', modelName: 'OK AY Gulet' },
    ].forEach(booking => assert.deepEqual(reservationTabsFor(booking), withoutFaq, booking.modelName));
    assert.deepEqual(reservationTabsFor({ vesselType: 'GULET' }).at(-1), 'reservationTabs.cancellation');
    ['CATAMARAN', 'MOTOR_YACHT', null, undefined].forEach(type =>
      assert.deepEqual(reservationTabsFor({ vesselType: type, modelName: 'Lagoon 42' }), reservationTabs, String(type))
    );
    assert.deepEqual(reservationTabsFor({ vesselType: 'SAILING_YACHT', modelName: 'Guletta 20' }), reservationTabs);
    assert.deepEqual(reservationTabsFor(null), reservationTabs);
  });

  test('every boat-level caller passes the boat, not only its vessel type', () => {
    const calls = {
      'src/views/Boat/BoatContentSection/GoodToKnowTab/GoodToKnowTab.tsx': /\{!isGulet\(yacht\) && \(/,
      'src/views/Boat/BoatContentSection/AvailabilityTab/AvailabilityTab.tsx': /\{!isGulet\(yacht\) && \(/,
      'src/components/YachtPDF/YachtPDF.tsx': /const isCrewed = isGulet\(yacht\) \|\|/,
      'src/views/MyBookings/ReservationDetails/ReservationContent/ReservationInfoSection/ReservationInfoSection.tsx':
        /reservationTabsFor\(\{ vesselType, modelName \}\)[\s\S]*<GoodToKnowTab vesselType=\{vesselType\} modelName=\{modelName\} \/>/,
    };

    Object.entries(calls).forEach(([path, pattern]) => {
      const src = readFileSync(`${ROOT}${path}`, 'utf8');

      assert.match(src, pattern, path);
      assert.doesNotMatch(src, /isGulet\([a-zA-Z.]*vesselType\)/, path);
    });
  });
});

/** The chips of AppliedFilterChips: label and the update its removal sends. */
const filterChips = (params, locale = 'en') => {
  let tree = null;
  const updates = [];
  const Probe = () => {
    tree = AppliedFilterChips({ params, setMultipleParams: update => updates.push(update), t: key => tAll(key) });

    return null;
  };
  const messages = messagesFor(locale, ['common', 'filters']);
  const tAll = createTranslator({ locale, messages });

  renderToStaticMarkup(
    createElement(NextIntlClientProvider, { locale, messages, timeZone: 'Europe/Zagreb' }, createElement(Probe))
  );

  return (tree ? [tree.props.children].flat() : []).map(chip => ({
    label: chip.props.children[0].props.children,
    remove: () => {
      chip.props.onClick();

      return updates.at(-1);
    },
  }));
};

describe('search: the rental type on a gulet-only search', () => {
  test('setting the boat types clears the rental type to or from gulets only', () => {
    assert.deepEqual(boatTypesUpdate(['GULET', 'CATAMARAN'], ['GULET']), { boatTypes: ['GULET'], charterType: [] });
    assert.deepEqual(boatTypesUpdate([], ['GULET']), { boatTypes: ['GULET'], charterType: [] });
    assert.deepEqual(boatTypesUpdate(['GULET'], ['GULET', 'CATAMARAN']), {
      boatTypes: ['GULET', 'CATAMARAN'],
      charterType: [],
    });
    assert.deepEqual(boatTypesUpdate(['CATAMARAN'], ['CATAMARAN', 'MOTOR_YACHT']), {
      boatTypes: ['CATAMARAN', 'MOTOR_YACHT'],
    });
    assert.deepEqual(boatTypesUpdate(['CATAMARAN', 'GULET'], ['CATAMARAN']), { boatTypes: ['CATAMARAN'] });
  });

  LOCALES.forEach(locale => {
    test(`${locale}: removing "Catamarans" from gulets + catamarans clears the rental type; no rental chip on gulets only`, () => {
      const filters = readJson(`messages/${locale}/filters.json`);
      const common = readJson(`messages/${locale}/common.json`);
      const rental = [filters.bareboat, filters.skippered];
      const mixed = filterChips({ boatTypes: ['GULET', 'CATAMARAN'], charterType: ['CREWED'] }, locale);

      assert.deepEqual(
        mixed.map(c => c.label),
        [common.guletPlural, common.catamaranPlural, filters.skippered]
      );
      assert.deepEqual(mixed[1].remove(), { boatTypes: ['GULET'], charterType: [], page: 1 });
      // Removing "Gulets" leaves catamarans, whose rental type stays a choice.
      assert.deepEqual(mixed[0].remove(), { boatTypes: ['CATAMARAN'], page: 1 });

      ['BAREBOAT', 'CREWED'].forEach(charterType => {
        const labels = filterChips({ boatTypes: ['GULET'], charterType: [charterType] }, locale).map(c => c.label);

        assert.deepEqual(labels, [common.guletPlural], `${charterType}: ${labels}`);
        assert.ok(!labels.some(label => rental.includes(label)));
      });

      assert.deepEqual(
        filterChips({ boatTypes: ['CATAMARAN'], charterType: ['BAREBOAT'] }, locale).map(c => c.label),
        [common.catamaranPlural, filters.bareboat]
      );
    });
  });

  test('the listing request of an old or shared gulet-only link drops the rental type', () => {
    const gulet = yachtFetchParams({ boatTypes: 'GULET', charterType: 'BAREBOAT', destinations: 'turkey' }, false);

    assert.equal(gulet.charterType, undefined);
    assert.equal(gulet.boatTypes, 'GULET');
    assert.equal(yachtFetchParams({ boatTypes: ['GULET'], charterType: ['CREWED'] }, false).charterType, undefined);
    assert.equal(
      yachtFetchParams({ boatTypes: 'GULET,CATAMARAN', charterType: 'CREWED' }, false).charterType,
      'CREWED'
    );
    assert.equal(yachtFetchParams({ boatTypes: 'CATAMARAN', charterType: 'BAREBOAT' }, false).charterType, 'BAREBOAT');
    assert.equal(yachtFetchParams({ charterType: 'BAREBOAT' }, false).charterType, 'BAREBOAT');
  });

  test('the distribution and relax requests drop it too', () => {
    assert.equal(
      withoutGuletRentalType('destinations=turkey&boatTypes=GULET&charterType=BAREBOAT%2CCREWED&page=2'),
      'destinations=turkey&boatTypes=GULET&page=2'
    );
    [
      'destinations=turkey&boatTypes=GULET%2CCATAMARAN&charterType=CREWED',
      'destinations=croatia&charterType=BAREBOAT',
      'boatTypes=CATAMARAN&charterType=BAREBOAT',
      'destinations=turkey&boatTypes=GULET',
      '',
    ].forEach(qs => assert.equal(withoutGuletRentalType(qs), qs, qs));
  });
});

describe('search: no skipper tile on a gulet landing', () => {
  const labels = {
    activeBoats: 'Boats',
    skipper: 'Skipper per week',
    obligatoryExtras: 'Obligatory extras',
    deposit: 'Deposit',
    checkIn: 'Check-in',
    medianBuildYear: 'Median build year',
    medianWithRange: ({ median }) => median,
    depositValue: ({ median }) => median,
  };
  const facts = vesselType => ({
    did: 'c-54',
    vesselType,
    computedAt: '2026-10-08T02:00:00Z',
    activeBoats: 40,
    skipperWeekly: { median: 1400, p25: 1200, p75: 1600 },
  });
  const tileLabels = vesselType => factsTiles(facts(vesselType), labels, factsFormat('en')).map(tile => tile.label);

  test('a gulet row never shows "Skipper per week", even when the nightly job sends a figure', () => {
    assert.ok(!tileLabels('GULET').includes('Skipper per week'), tileLabels('GULET').join(' | '));
  });

  test('a catamaran row and an all-types row keep it', () => {
    assert.ok(tileLabels('CATAMARAN').includes('Skipper per week'));
    assert.ok(tileLabels(null).includes('Skipper per week'));
  });
});

describe('curated gulet landing texts: a gulet is never offered bareboat or skipper-only', () => {
  test('no gulet-crewed finding on any gulet landing, in all nine languages', () => {
    const run = spawnSync('python3', ['scripts/seo-corpus-qa.py', '--gulet-crewed'], { cwd: ROOT, encoding: 'utf8' });

    assert.equal(run.error, undefined, String(run.error));
    assert.equal(run.status, 0, run.stdout + run.stderr);
    assert.match(run.stdout, /gulet-crewed: 0 finding\(s\) in [1-9]\d* gulet landings/);
  });
});
