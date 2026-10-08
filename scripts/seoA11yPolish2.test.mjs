/**
 * Small wording and accessibility fixes from the live check of 8.10.2026
 * (_seo-audit-2026-10-08/live-verify), round 2:
 *
 *   - X10: the Croatian boat meta description counts berths as berths
 *     ("12 ležajeva"), not as persons ("13 osoba" for a 12-person boat);
 *   - F6: a base reads "D-Marin Dalmacija Marina, Sukošan" (the meta
 *     description's form) in the FAQ, on the boat page and on the cards,
 *     never the partner's raw "D-Marin Dalmacija Marina | Sukošan";
 *   - F4: image alt texts in the page's language ("Drapeau : Croatie", "… —
 *     photo"), no "boat image" / "HR flag" / "Card image"; a partner name with
 *     a trailing space ("IDILA ") no longer doubles the space in "Ajouter IDILA
 *     aux favoris";
 *   - F2: the 404 and error pages' home link is named in the page's language
 *     and the error page's link keeps the locale ("/de", not "/");
 *   - English labels left on non-EN pages: My bookings ("Reservation
 *     information", "Copy booking reference", "Dismiss" and the yacht-swap
 *     banner), the MUI calendar's "Previous month" / "Next month", and the
 *     leading space in " Search boats".
 *
 * Review of round 2: the model page's "Where" table and FAQ, My bookings'
 * Details tab, the map modal's heading, the booking overview's pick-up line
 * and the video's accessible name read the base and the boat like the rest
 * of the page; the swap banner's date label takes any weekday ("Data
 * wykrycia: niedziela, …", not "Wykryto niedziela").
 *
 *   yarn test:polish
 */
import { createElement } from 'react';
import { renderToStaticMarkup } from 'react-dom/server';

import dayjs from 'dayjs';
import { NextIntlClientProvider, createTranslator } from 'next-intl';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { registerHooks } from 'node:module';
import { describe, test } from 'node:test';
import { fileURLToPath } from 'node:url';

import './tsLoader.mjs';

// next/image is CommonJS (its default export does not survive an ESM import
// outside Next): a plain <img> stands in. `next/navigation` and `dayjs/locale/de`
// are extensionless deep imports of packages without an `exports` map.
registerHooks({
  resolve: (specifier, context, nextResolve) => {
    if (specifier === 'next/image') {
      return { url: new URL('./stubs/next-image.mjs', import.meta.url).href, shortCircuit: true };
    }

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

const ROOT = fileURLToPath(new URL('../', import.meta.url));
const readJson = path => JSON.parse(readFileSync(`${ROOT}${path}`, 'utf8'));
const readSrc = path => readFileSync(`${ROOT}${path}`, 'utf8');
const LOCALES = ['en', 'de', 'fr', 'it', 'es', 'pt', 'nl', 'pl', 'hr'];
const catalogue = (locale, ...namespaces) =>
  Object.fromEntries(namespaces.map(ns => [ns, readJson(`messages/${locale}/${ns}.json`)]));
const lookup = (locale, ns, path) =>
  path.split('.').reduce((node, key) => node?.[key], readJson(`messages/${locale}/${ns}.json`));
const render = (locale, element) =>
  renderToStaticMarkup(
    createElement(NextIntlClientProvider, { locale, messages: catalogue(locale, 'common'), timeZone: 'UTC' }, element)
  );
const attr = (html, name) => [...html.matchAll(new RegExp(`${name}="([^"]*)"`, 'gu'))].map(m => m[1]);

const { buildBoatDescription } = await import('@/utils/static/boatMetaDescription');
const { boatSeoName } = await import('@/utils/static/boatTitle');
const { displayBaseName } = await import('@/utils/static/croatianPlaceNames');
const { countryDisplayName } = await import('@/utils/static/countryDisplayName');
const { yachtPhotoName } = await import('@/utils/static/yachtPhotoName');
const { buildYachtFaq } = await import('@/utils/static/yachtFaq');
const { default: FlagIcon } = await import('@/components/FlagIcon/FlagIcon');
const { default: FavoriteButton } = await import('@/components/FavoriteButton/FavoriteButton');
const { default: YachtCard } = await import('@/components/YachtCard/YachtCard');
const { default: NotFoundPage } = await import('@/views/NotFoundPage/NotFoundPage');
const { default: ErrorPage } = await import('@/views/ErrorPage/ErrorPage');
const { default: CustomDateCalendar } = await import('@/components/CustomDateCalendar/CustomDateCalendar');
const { default: VideoTab } = await import('@/views/Boat/BoatContentSection/VideoTab/VideoTab');
const { default: DateTime } = await import('@/utils/static/DateTime');
const { computeModelFleetStats } = await import('@/utils/static/modelFleetStats');
const { toTitleCase } = await import('@/utils/static/toTitleCase');
const { topBaseLabels, whereBases } = await import('@/views/Models/modelsText');
const { modelsFaqSchema } = await import('@/views/Models/ModelsFaq');

const masterpiece = readJson('scripts/fixtures/masterpiece-offers-2026-10-07.json');

describe('X10: the Croatian meta description counts berths, not persons', () => {
  const describeBoat = (locale, berths) => {
    const t = createTranslator({ locale, messages: catalogue(locale, 'metadata') });

    return buildBoatDescription((key, values) => t(`metadata.boat.${key}`, values), {
      name: boatSeoName({ model: 'Lagoon 42', name: 'Masterpiece', year: 2018 }),
      marina: 'D-Marin Dalmacija Marina | Sukošan',
      cabins: 6,
      berths,
    });
  };

  test('Lagoon 42 Masterpiece (2018), HR: "6 kabina, 12 ležajeva"', () => {
    assert.equal(
      describeBoat('hr', 12),
      'Najam Lagoon 42 Masterpiece (2018) iz marine D-Marin Dalmacija Marina, Sukošan. 6 kabina, 12 ležajeva. Provjerite raspoloživost i rezervirajte direktno na boat4you.com.'
    );
  });

  test('HR plural forms: 1 ležaj, 2–4 ležaja, 5–20 ležajeva, 21 ležaj, 22 ležaja', () => {
    const t = createTranslator({ locale: 'hr', messages: catalogue('hr', 'metadata') });
    const berths = count => t('metadata.boat.descBerths', { count });

    assert.deepEqual([1, 2, 4, 5, 11, 12, 13, 14, 20, 21, 22, 25].map(berths), [
      '1 ležaj',
      '2 ležaja',
      '4 ležaja',
      '5 ležajeva',
      '11 ležajeva',
      '12 ležajeva',
      '13 ležajeva',
      '14 ležajeva',
      '20 ležajeva',
      '21 ležaj',
      '22 ležaja',
      '25 ležajeva',
    ]);
  });

  test('no locale counts berths with a word for people', () => {
    LOCALES.forEach(locale => {
      const t = createTranslator({ locale, messages: catalogue(locale, 'metadata') });

      [1, 2, 5, 12, 13, 22].forEach(count => {
        const berths = t('metadata.boat.descBerths', { count });

        assert.doesNotMatch(berths, /osob|person|pessoa|persoon|osoby|osób|people|Personen/iu, `${locale}: ${berths}`);
      });
    });
  });
});

describe('F6: a base reads "Marina, Town", as in the meta description', () => {
  test('displayBaseName', () => {
    assert.equal(displayBaseName('D-Marin Dalmacija Marina | Sukošan'), 'D-Marin Dalmacija Marina, Sukošan');
    assert.equal(displayBaseName('Alimos Marina | Athens'), 'Alimos Marina, Athens');
    assert.equal(displayBaseName('Marina Kastela | Kastel Gomilica'), 'Marina Kaštela, Kaštel Gomilica');
    assert.equal(displayBaseName('Port of Split / West Harbour | Split'), 'Port of Split / West Harbour, Split');
    assert.equal(displayBaseName('Marina Frapa'), 'Marina Frapa');
    assert.equal(displayBaseName('  ACI Marina Split |  '), 'ACI Marina Split');
    assert.equal(displayBaseName(null), '');
    assert.equal(displayBaseName(undefined), '');
  });

  test('the boat FAQ home-port answer, all 9 locales, FAQ text and FAQPage JSON-LD alike', () => {
    const yacht = {
      id: 11681,
      name: 'MASTERPIECE',
      model: 'Lagoon 42',
      offers: masterpiece.offers,
      charterType: ['BAREBOAT'],
      location: { name: 'D-Marin Dalmacija Marina | Sukošan', countryCode: 'HR' },
      defaultCheckin: '17:00',
      defaultCheckout: '09:00',
      hasBookableFutureOffer: true,
    };

    LOCALES.forEach(locale => {
      const t = createTranslator({ locale, messages: catalogue(locale, 'yacht') });
      const faq = buildYachtFaq(yacht, (key, values) => t(`yacht.${key}`, values), locale, undefined, 1922);
      const base = faq.find(entry => entry.question === t('yacht.faqBaseQ', { name: 'Masterpiece' }));

      assert.ok(base, locale);
      assert.ok(base.answer.includes('D-Marin Dalmacija Marina, Sukošan'), `${locale}: ${base.answer}`);
      faq.forEach(entry => assert.doesNotMatch(`${entry.question} ${entry.answer}`, /\|/u, locale));
    });

    const t = createTranslator({ locale: 'en', messages: catalogue('en', 'yacht') });
    const answers = [0, 1, 2].map(n =>
      t(`yacht.faqBaseA${n}`, {
        name: 'Masterpiece',
        location: displayBaseName(yacht.location.name),
        country: 'Croatia',
      })
    );

    assert.ok(
      answers.includes(
        'The home port of Masterpiece is D-Marin Dalmacija Marina, Sukošan in Croatia — you board there on check-in day and return the boat to the same berth.'
      )
    );
  });

  test('the boat page, the cards and the booking views format the base for display', () => {
    [
      'src/views/Boat/BoatHeroSection/BoatHeroSection.tsx',
      'src/views/Boat/BoatHeroSection/BoatShareModal/BoatShareModal.tsx',
      'src/views/Boat/BoatContentSection/DetailsTab/DetailsTab.tsx',
      'src/views/Boat/BoatContentSection/AvailabilityTab/AvailabilityTab.tsx',
      'src/views/Boat/BoatContentSection/AvailabilityTab/AvailabilityCard/AvailabilityCard.tsx',
      'src/components/BoatCalendar/BoatCalendarForm/BoatCalendarForm.tsx',
      'src/components/BoatListingItemCard/BoatListingItemCard.tsx',
      'src/components/WishlistItem/WishlistItem.tsx',
      'src/components/YachtCard/YachtCard.tsx',
      'src/components/ReservationOverview/ReservationOverviewCard/ReservationOverviewCard.tsx',
      'src/views/Models/ModelPageView.tsx',
      'src/views/Booking/BookingHero/BookingHero.tsx',
      'src/views/Booking/BookingSummaryCard/BookingSummaryCard.tsx',
      'src/views/MyBookings/ReservationDetails/ReservationContent/ReservationHeroSection/ReservationHeroSection.tsx',
      'src/views/MyBookings/ReservationDetails/ReservationContent/ReservationInfoSection/MainInfoTab/MainInfoTab.tsx',
      'src/views/MyBookings/ActiveReservationsSection/ActiveReservationCard/ActiveReservationCard.tsx',
      'src/views/MyBookings/ReservationDetails/ReservationContent/ReservationInfoSection/DetailsTab/DetailsTab.tsx',
      'src/views/Booking/OverviewCard/OverviewCard.tsx',
      'src/components/BoatLocationModal/BoatLocationModal.tsx',
      'src/components/ConfirmationPDF/ConfirmationPDF.tsx',
      'src/utils/static/fleetIndex.ts',
      'src/utils/static/yachtFaq.ts',
    ].forEach(path => {
      const src = readSrc(path);

      assert.match(src, /displayBaseName\(/u, path);
      // A base name rendered straight into the markup.
      assert.doesNotMatch(
        src,
        /^\s*\{(?:yacht\.location\.name|heroLocation\.name|dropOff\.name|locationFrom(?:\.name)?|offer\.locationFrom\.name|boat\.location\.name|pickUpLocationName)\}\s*$|<Typography[^>]*>\{pickUpLocationName\}/mu,
        path
      );
    });
  });

  test('YachtCard (inquiry modal, booking overview): "D-Marin Dalmacija Marina, Sukošan"', () => {
    const html = render(
      'de',
      createElement(YachtCard, {
        mainImageId: 1,
        model: 'Lagoon 42',
        name: 'MASTERPIECE ',
        locationCountryCode: 'HR',
        locationName: 'D-Marin Dalmacija Marina | Sukošan',
      })
    );

    assert.ok(html.includes('D-Marin Dalmacija Marina, Sukošan'), html);
    assert.doesNotMatch(html, /Sukošan.{0,3}\|| \| Sukošan/u);
    assert.deepEqual(attr(html, 'alt'), ['Lagoon 42 Masterpiece — Foto', 'Flagge: Kroatien']);
  });
});

describe('F6 (review): model pages, My bookings, the map modal and the booking overview', () => {
  const RAW = ['Alimos Marina | Athens', 'D-Marin Dalmacija Marina | Sukošan', 'Marina Kastela | Kastel Gomilica'];
  const boat = (id, locationId, name, countryCode) => ({ id, location: { id: locationId, name, countryCode } });
  const fleet = [
    boat(1, 101, RAW[0], 'GR'),
    boat(2, 101, RAW[0], 'GR'),
    boat(3, 102, RAW[1], 'HR'),
    boat(4, 103, RAW[2], 'HR'),
  ];

  test('Lagoon 42: the "Where" table, the FAQ and its FAQPage JSON-LD read "Alimos Marina, Athens", all 9 locales', async () => {
    const stats = computeModelFleetStats(fleet, fleet.length, () => true);
    const looked = [];
    const where = await Promise.all(
      stats.countries.map(async country => ({
        countryCode: country.countryCode,
        count: country.count,
        bases: await whereBases(country.bases, 3, async base => {
          looked.push(base.name);

          return `/landing/${base.did}`;
        }),
      }))
    );

    // The landing links still resolve the catalogue name.
    assert.deepEqual(looked.sort(), [...RAW].sort());
    assert.deepEqual(
      where.flatMap(row => row.bases),
      [
        { name: 'Alimos Marina, Athens', count: 2, href: '/landing/l-101' },
        { name: 'D-Marin Dalmacija Marina, Sukošan', count: 1, href: '/landing/l-102' },
        { name: 'Marina Kaštela, Kaštel Gomilica', count: 1, href: '/landing/l-103' },
      ]
    );

    LOCALES.forEach(locale => {
      const t = createTranslator({ locale, messages: catalogue(locale, 'models') });
      const list = items => new Intl.ListFormat(locale, { type: 'conjunction' }).format(items);
      const num = n => n.toLocaleString(locale);
      const answer = [
        t('models.model.faqWhereA', { model: 'Lagoon 42', countries: list(where.map(row => row.countryCode)) }),
        t('models.model.faqWhereBases', { bases: list(topBaseLabels(where, num)) }),
      ].join(' ');
      const ld = JSON.stringify(
        modelsFaqSchema([
          { question: t('models.model.faqWhereQ', { model: 'Lagoon 42' }), answer },
          { question: 'q', answer: 'a' },
        ])
      );

      assert.ok(answer.includes('Alimos Marina, Athens (2)'), `${locale}: ${answer}`);
      assert.ok(ld.includes('Alimos Marina, Athens (2)'), locale);
      assert.doesNotMatch(`${answer} ${ld}`, /\|/u, locale);
    });

    assert.deepEqual(topBaseLabels(where, String, 1), ['Alimos Marina, Athens (2)']);
  });

  test('the model page builds its bases with whereBases and its FAQ with topBaseLabels', () => {
    const page = readSrc('src/app/[locale]/(root)/yachts/[manufacturer]/[model]/page.tsx');

    assert.match(page, /bases: await whereBases\(/u);
    assert.match(page, /topBaseLabels\(where, num\)/u);
    assert.doesNotMatch(page, /name: base\.name|`\$\{base\.name\} \(/u);
  });

  test('My bookings → Details: "Idila … based in D-Marin Dalmacija Marina, Sukošan"', () => {
    const src = readSrc(
      'src/views/MyBookings/ReservationDetails/ReservationContent/ReservationInfoSection/DetailsTab/DetailsTab.tsx'
    );

    assert.match(src, /location: displayBaseName\(reservationDetails\.locationFrom\) \|\| 'none'/u);
    assert.equal(src.match(/name: toTitleCase\(reservationDetails\.yachtName\)/gu)?.length, 2);
    assert.doesNotMatch(src, /name: reservationDetails\.yachtName|location: reservationDetails\.locationFrom/u);

    const expected = {
      en: 'based in <b>D-Marin Dalmacija Marina, Sukošan</b>',
      hr: '<b>D-Marin Dalmacija Marina, Sukošan</b>',
    };

    LOCALES.forEach(locale => {
      const t = createTranslator({ locale, messages: catalogue(locale, 'yacht') });
      const html = renderToStaticMarkup(
        createElement(
          'p',
          null,
          t.rich('yacht.descIntroShort', {
            name: toTitleCase('IDILA '),
            vesselType: 'x',
            model: 'Oceanis 35.1',
            year: '2015',
            location: displayBaseName('D-Marin Dalmacija Marina | Sukošan') || 'none',
            b: chunks => createElement('b', null, chunks),
          })
        )
      );

      assert.ok(html.includes('<b>Idila</b>'), `${locale}: ${html}`);
      assert.ok(html.includes(expected[locale] ?? '<b>D-Marin Dalmacija Marina, Sukošan</b>'), `${locale}: ${html}`);
      assert.doesNotMatch(html, /IDILA|\|/u, locale);
    });
  });

  test('the map modal is headed like the link that opened it; the map still looks up the catalogue name', () => {
    const src = readSrc('src/components/BoatLocationModal/BoatLocationModal.tsx');

    assert.match(src, /const shownName = displayBaseName\(locationName\)/u);
    assert.match(src, /title=\{shownName\}/u);
    assert.match(src, /title=\{`Google Maps — \$\{shownName\}`\}/u);
    assert.match(src, /encodeURIComponent\(locationName\)/u);
    assert.doesNotMatch(src, /title=\{locationName\}|— \$\{locationName\}/u);
  });

  test('the booking overview: "D-Marin Dalmacija Marina, Sukošan" under Pick-up location, raw name in the maps link', () => {
    const src = readSrc('src/views/Booking/OverviewCard/OverviewCard.tsx');

    assert.match(src, /\{displayBaseName\(pickUpLocationName\)\}/u);
    assert.match(src, /generateGoogleMapsLink\(pickUpLocationName\)/u);
  });
});

describe('the boat video’s accessible name', () => {
  const messages = locale => catalogue(locale, 'common', 'yacht');
  const videoTitle = (locale, yacht) =>
    attr(
      renderToStaticMarkup(
        createElement(
          NextIntlClientProvider,
          { locale, messages: messages(locale), timeZone: 'UTC' },
          createElement(VideoTab, { yacht })
        )
      ),
      'title'
    );
  const idila = {
    name: 'IDILA ',
    manufacturerName: 'Beneteau',
    modelName: 'Oceanis 35.1',
    customDetails: { videoUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ' },
  };

  test('"Beneteau Oceanis 35.1 Idila — Vidéo" on /fr, the gallery’s label in every locale', () => {
    LOCALES.forEach(locale => {
      const title = videoTitle(locale, idila);
      const word = lookup(locale, 'common', 'video');

      assert.deepEqual(title, [`Beneteau Oceanis 35.1 Idila — ${word}`], locale);
    });
    assert.deepEqual(videoTitle('fr', idila), ['Beneteau Oceanis 35.1 Idila — Vidéo']);
    assert.deepEqual(videoTitle('pl', idila), ['Beneteau Oceanis 35.1 Idila — Wideo']);
  });

  test('no video, no iframe', () => {
    assert.deepEqual(videoTitle('de', { ...idila, customDetails: {} }), []);
  });
});

describe('F4: image alt texts in the page’s language', () => {
  const NEW_KEYS = [
    ['common', 'a11y.boatPhoto'],
    ['common', 'a11y.flagOf'],
    ['common', 'a11y.copyBookingReference'],
    ['common', 'a11y.previousMonth'],
    ['common', 'a11y.nextMonth'],
    ['common', 'yachtSwap.title'],
    ['common', 'yachtSwap.autoUpdated'],
    ['common', 'yachtSwap.manualReview'],
    ['common', 'yachtSwap.detected'],
    ['common', 'yachtSwap.detectedOn'],
    ['itinerary', 'builder.promoAltLagoon'],
    ['itinerary', 'builder.promoAltHvar'],
  ];
  // French writes "photo" too: "{label} — photo".
  const SAME_AS_EN = new Set(['fr common a11y.boatPhoto']);

  test('every new key in all 9 locales, translated, with the same placeholders', () => {
    NEW_KEYS.forEach(([ns, path]) => {
      const en = lookup('en', ns, path);
      const placeholders = value => [...value.matchAll(/\{(\w+)/gu)].map(m => m[1]).sort();

      LOCALES.forEach(locale => {
        const value = lookup(locale, ns, path);

        assert.equal(typeof value, 'string', `${locale} ${ns}.${path}`);
        assert.equal(value, value.trim(), `${locale} ${ns}.${path}`);
        assert.deepEqual(placeholders(value), placeholders(en), `${locale} ${ns}.${path}`);

        if (locale !== 'en' && !SAME_AS_EN.has(`${locale} ${ns} ${path}`)) {
          assert.notEqual(value, en, `${locale} ${ns}.${path}`);
        }
      });
    });
  });

  test('flags: "Drapeau : Croatie" on /fr, "Flag of Croatia" on EN, never "HR flag"', () => {
    const expected = {
      en: 'Flag of Croatia',
      de: 'Flagge: Kroatien',
      fr: 'Drapeau : Croatie',
      it: 'Bandiera: Croazia',
      es: 'Bandera: Croacia',
      pt: 'Bandeira: Croácia',
      nl: 'Vlag: Kroatië',
      pl: 'Flaga: Chorwacja',
      hr: 'Zastava: Hrvatska',
    };

    LOCALES.forEach(locale => {
      assert.deepEqual(attr(render(locale, createElement(FlagIcon, { countryCode: 'HR' })), 'alt'), [expected[locale]]);
    });
    assert.equal(countryDisplayName('gr', 'de'), 'Griechenland');
    assert.equal(countryDisplayName('', 'de'), '');
  });

  test('favourites: "Ajouter Idila aux favoris" — one space, the name as the card shows it', () => {
    const button = name =>
      attr(
        render('fr', createElement(FavoriteButton, { yacht: { id: 7, name, slug: 'x', model: 'Oceanis 35.1' } })),
        'aria-label'
      )[0];

    assert.equal(button('IDILA '), 'Ajouter Idila aux favoris');
    assert.equal(button('  MY  WAY '), 'Ajouter My Way aux favoris');
    assert.equal(button(''), 'Ajouter Oceanis 35.1 aux favoris');
    assert.doesNotMatch(button(null), / {2}/u);
  });

  test('the gallery and lightbox name the boat like the H1', () => {
    assert.equal(
      yachtPhotoName({ manufacturerName: 'Lagoon', modelName: 'Lagoon 42', name: 'MASTERPIECE ' }),
      'Lagoon 42 Masterpiece'
    );
    assert.equal(
      yachtPhotoName({ manufacturerName: 'Fountaine Pajot', modelName: 'Elba 45', name: 'KARINA' }),
      'Fountaine Pajot Elba 45 Karina'
    );
    assert.equal(yachtPhotoName({ modelName: 'MY Custom Anthea', name: 'Anthea' }), 'MY Custom Anthea');
    assert.equal(yachtPhotoName(undefined), '');
  });

  test('no hard-coded English alt text left in components and views', () => {
    const files = [
      'src/components/BoatListingItemCard/BoatListingItemCard.tsx',
      'src/components/ReservationOverview/ReservationOverviewCard/ReservationOverviewCard.tsx',
      'src/components/YachtCard/YachtCard.tsx',
      'src/components/WishlistItem/WishlistItem.tsx',
      'src/components/FlagIcon/FlagIcon.tsx',
      'src/components/Gallery/Lightbox/Lightbox.tsx',
      'src/components/CookieConsent/CookieConsent.tsx',
      'src/components/CookieConsent/CookieModalContent/CookieModalContent.tsx',
      'src/components/HeroSection/HeroSection.tsx',
      'src/components/SuggestedItineraries/SuggestedItineraries.tsx',
      'src/views/Boat/BoatHeroSection/BoatHeroSection.tsx',
      'src/views/Boat/BoatHeroSection/BoatShareModal/BoatShareModal.tsx',
      'src/views/AboutUs/WhoWeAreSection/WhoWeAreSection.tsx',
      'src/views/AboutUs/OurPromiseSection/OurPromiseSection.tsx',
      'src/views/Itineraries/ItineraryBuilderPromo/ItineraryBuilderPromo.tsx',
      'src/views/Itineraries/ItineraryArea/ItineraryArea.tsx',
      'src/views/Itineraries/ItinerariesHub/ItinerariesHub.tsx',
      'src/views/MyBookings/ReservationDetails/ReservationContent/ReservationHeroSection/ReservationHeroSection.tsx',
      'src/app/[locale]/(search)/boat/[slug]/page.tsx',
      'src/app/[locale]/(root)/itineraries/page.tsx',
      'src/app/[locale]/(root)/itineraries/builder/page.tsx',
      'src/app/[locale]/(root)/itineraries/[slug]/page.tsx',
      'src/app/[locale]/(root)/itineraries/[slug]/[id]/page.tsx',
      'src/app/[locale]/(root)/about-us/page.tsx',
      'src/app/[locale]/(root)/how-we-work/page.tsx',
      'src/app/[locale]/(root)/contact-us/page.tsx',
    ];

    files.forEach(path => {
      const src = readSrc(path);

      assert.doesNotMatch(src, /alt="[^"]+"|alt: '[^']+'/u, path);
      assert.doesNotMatch(src, /boat image`| flag`|`Gallery image|`Thumbnail/u, path);
      assert.doesNotMatch(src, /cardImage\.alt|backgroundImage\.alt|area\.image\.alt/u, path);
    });
  });
});

describe('F2: the 404 and error pages', () => {
  test('the home link is named in the page’s language; the error page keeps the locale', () => {
    LOCALES.forEach(locale => {
      const name = lookup(locale, 'common', 'goBackHome');
      const home = locale === 'en' ? '/' : `/${locale}`;

      [NotFoundPage, ErrorPage].forEach(Page => {
        const html = render(locale, createElement(Page));

        assert.deepEqual(attr(html, 'aria-label'), [name.replace(/'/gu, '&#x27;')], `${locale} ${Page.name}`);
        assert.deepEqual(attr(html, 'href'), [home], `${locale} ${Page.name}`);
        assert.doesNotMatch(html, /Go Back Home/u);
      });
    });
  });

  test('the root error boundary reads only a real locale from the path', () => {
    const src = readSrc('src/app/error.tsx');

    assert.match(src, /hasLocale\(routing\.locales, segment\) \? segment : routing\.defaultLocale/u);
  });
});

describe('English labels outside the header and search', () => {
  test('the calendar arrows: "Vorheriger Monat" / "Nächster Monat" on /de', () => {
    LOCALES.forEach(locale => {
      const html = render(
        locale,
        createElement(CustomDateCalendar, {
          currentMonth: dayjs('2026-10-01'),
          startDate: null,
          endDate: null,
          onDayClick: () => {},
          hoverDate: null,
          onDayHover: () => {},
        })
      );
      const labels = attr(html, 'aria-label');

      assert.ok(labels.includes(lookup(locale, 'common', 'a11y.previousMonth')), `${locale}: ${labels}`);
      assert.ok(labels.includes(lookup(locale, 'common', 'a11y.nextMonth')), `${locale}: ${labels}`);

      if (locale !== 'en') assert.doesNotMatch(html, /Previous month|Next month/u, locale);
    });
  });

  test('My bookings: no English accessible names or swap-banner sentences in the source', () => {
    const cta = readSrc('src/components/ReservationCTA/ReservationCTA.tsx');
    const hero = readSrc(
      'src/views/MyBookings/ReservationDetails/ReservationContent/ReservationHeroSection/ReservationHeroSection.tsx'
    );

    assert.doesNotMatch(cta, /Reservation information|Copy booking reference/u);
    assert.doesNotMatch(hero, /aria-label="|has replaced your yacht|Detected on|Your new yacht/u);
  });

  test('the yacht-swap banner renders in every locale with the boat name in bold', () => {
    LOCALES.forEach(locale => {
      const t = createTranslator({ locale, messages: catalogue(locale, 'common') });
      const html = renderToStaticMarkup(
        createElement(
          'p',
          null,
          t.rich('common.yachtSwap.autoUpdated', {
            name: 'Masterpiece',
            strong: chunks => createElement('strong', null, chunks),
          })
        )
      );

      assert.ok(html.includes('<strong>Masterpiece</strong>'), `${locale}: ${html}`);
      assert.ok(t('common.yachtSwap.detectedOn', { date: '8. 10. 2026.' }).includes('8. 10. 2026.'), locale);
    });
  });

  test('the swap banner’s date label takes any weekday: "Data wykrycia: niedziela, …"', () => {
    const sunday = dayjs('2026-10-11T10:00:00Z');
    const expected = {
      en: 'Detected on Sunday, 11 October 2026',
      de: 'Festgestellt am Sonntag, 11. Oktober 2026',
      fr: 'Détecté le dimanche 11 octobre 2026',
      it: 'Data di rilevamento: domenica 11 ottobre 2026',
      es: 'Detectado el domingo, 11 de octubre de 2026',
      pt: 'Data de deteção: domingo, 11 de outubro de 2026',
      nl: 'Vastgesteld op zondag 11 oktober 2026',
      pl: 'Data wykrycia: niedziela, 11 października 2026',
      hr: 'Datum otkrivanja: nedjelja, 11. listopada 2026.',
    };

    LOCALES.forEach(locale => {
      const t = createTranslator({ locale, messages: catalogue(locale, 'common') });

      assert.equal(
        t('common.yachtSwap.detectedOn', { date: DateTime.formatLong(sunday, locale) }),
        expected[locale],
        locale
      );
    });
  });

  test('"Search boats" has no leading space in any locale', () => {
    LOCALES.forEach(locale => {
      const value = lookup(locale, 'home', 'generalSearchBar.searchBoats');

      assert.equal(value, value.trim(), `${locale}: "${value}"`);
    });
  });
});
