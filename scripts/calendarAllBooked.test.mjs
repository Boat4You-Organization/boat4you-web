/**
 * Owner rule 16.10.2026 ("ostavi raspored, samo neka bude sve bukirano ako
 * nema ništa slobodno — nema smisla da se miče cjenik ako nema slobodnih
 * termina"): a boat the backend calls not bookable (hasBookableFutureOffer
 * false) whose partner still publishes weeks keeps its availability calendar.
 * Dufour 360 GL Nada 12442 (live 16.10.2026: 14 published periods, every one
 * RESERVATION): the season strip hatched, every week card "Reserved" with its
 * price, none selectable, a line above the cards pointing to the inquiry. A
 * boat with no published week keeps the inquiry panel, as before; a bookable
 * boat's calendar is unchanged.
 *
 *   yarn test:calendar
 */
import { createElement } from 'react';
import { renderToStaticMarkup } from 'react-dom/server';

import { ThemeProvider } from '@mui/material/styles';
import { NextIntlClientProvider } from 'next-intl';
import assert from 'node:assert/strict';
import { readFileSync, readdirSync } from 'node:fs';
import { registerHooks } from 'node:module';
import { describe, test } from 'node:test';
import { fileURLToPath } from 'node:url';

import './tsLoader.mjs';

// No app router outside Next, and the calendar's server action (its fetch)
// is not called by a server render: both stand in.
registerHooks({
  resolve: (specifier, context, nextResolve) => {
    if (specifier === 'next/navigation') {
      return { url: new URL('./stubs/next-navigation.mjs', import.meta.url).href, shortCircuit: true };
    }

    if (specifier === '@/actions/yacht.actions') {
      return {
        url: 'data:text/javascript,export const getSingleYachtStandardOffers = async () => [];',
        shortCircuit: true,
      };
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

const ROOT = fileURLToPath(new URL('../', import.meta.url));
const readJson = path => JSON.parse(readFileSync(`${ROOT}${path}`, 'utf8'));
const LOCALES = ['en', 'de', 'fr', 'it', 'es', 'pt', 'nl', 'pl', 'hr'];
const allMessages = locale =>
  Object.fromEntries(
    readdirSync(`${ROOT}messages/${locale}`)
      .filter(file => file.endsWith('.json'))
      .map(file => [file.slice(0, -'.json'.length), readJson(`messages/${locale}/${file}`)])
  );
const { default: theme } = await import('@/styles/themes');
const render = (element, locale = 'en') =>
  renderToStaticMarkup(
    createElement(
      ThemeProvider,
      { theme },
      createElement(NextIntlClientProvider, { locale, messages: allMessages(locale), timeZone: 'UTC' }, element)
    )
  );
const count = (html, pattern) => [...html.matchAll(pattern)].length;
// Status pills of the week cards: the legend names "Reserved", "Unavailable"
// and "Pre-reserved" once more.
const pills = (html, label) => count(html, new RegExp(`>${label}<`, 'gu')) - (label === 'Available' ? 0 : 1);
// Heatmap cells (one per week of the page) and the disabled ones.
const cells = html => count(html, /<button(?=[^>]*aria-label="Week )[^>]*>/gu);
const disabledCells = html => count(html, /<button(?=[^>]*aria-label="Week )(?=[^>]*disabled="")[^>]*>/gu);
// Cells under the legend's "Reserved" hatch (one emotion class for them all).
const hatchedCells = html => {
  const hatch = html.match(/\.(css-[\da-z]+)\{[^}]*repeating-linear-gradient\(45deg, transparent 0 4px/u)?.[1];

  return hatch ? count(html, new RegExp(`class="MuiBox-root ${hatch}"`, 'gu')) : 0;
};

const { setTestSearch } = await import('./stubs/next-navigation.mjs');
const { isInquiryOnlyBoat, isBookedByInquiry, showsAllBookedCalendar } = await import('@/utils/static/inquiryOnlyBoat');
const { default: AvailabilityTab } = await import('@/views/Boat/BoatContentSection/AvailabilityTab/AvailabilityTab');
const { AvailabilityDesktop, AvailabilityMobile, toWeek } =
  await import('@/views/Boat/BoatContentSection/AvailabilityTab/LiveCalendar/AvailabilitySlider');
const { WEEKS_PER_CHUNK, fillTimeline, monthAxis, withTiers } =
  await import('@/views/Boat/BoatContentSection/AvailabilityTab/LiveCalendar/parts/tier-helpers');

const NADA = readJson('scripts/fixtures/nada-12442-offers-2026-10-16.json');
const HORIZON = '2028-04-16';

const boat = overrides => ({
  id: 12442,
  slug: NADA.slug,
  name: 'NADA',
  model: 'Dufour 360 Grand Large',
  custom: false,
  inquireOnly: false,
  location: { name: 'Marina Kastela | Kastel Gomilica', countryCode: 'HR' },
  defaultCheckin: '17:00',
  defaultCheckout: '09:00',
  charterType: ['BAREBOAT'],
  vesselType: 'SAILING_YACHT',
  hasBookableFutureOffer: NADA.hasBookableFutureOffer,
  offers: NADA.offers,
  ...overrides,
});
const nada = boat({});
const freeWeek = { ...NADA.offers[3], id: 1, status: 'FREE' };

// The calendar's own pipeline (AvailabilitySlider): the partner's weeks in
// date order, the gaps filled to whole 26-week pages, price tiers.
const weeksOf = (offers, allBooked, locale = 'en') =>
  withTiers(
    fillTimeline(
      [...offers].sort((a, b) => a.dateFrom.localeCompare(b.dateFrom)).map(o => toWeek(o, locale, allBooked)),
      HORIZON,
      WEEKS_PER_CHUNK,
      locale
    )
  );
const branch = (Component, weeks, allBooked, locale = 'en') =>
  render(
    createElement(Component, { weeks, months: monthAxis(weeks), selId: undefined, onSelect: () => {}, allBooked }),
    locale
  );

describe('showsAllBookedCalendar: published weeks, none bookable', () => {
  test('Nada 12442: no bookable offer, 14 reserved periods → the calendar stays', () => {
    assert.equal(isInquiryOnlyBoat(nada), true);
    assert.equal(nada.offers.length, 14);
    assert.ok(nada.offers.every(o => o.status === 'RESERVATION'));
    assert.equal(showsAllBookedCalendar(nada), true);
  });

  test('a live option among the reserved weeks is not bookable either', () => {
    assert.equal(
      showsAllBookedCalendar(boat({ offers: [...NADA.offers, { ...NADA.offers[0], status: 'OPTION' }] })),
      true
    );
  });

  test('no published week: the inquiry panel, as before', () => {
    assert.equal(showsAllBookedCalendar(boat({ offers: [] })), false);
    assert.equal(showsAllBookedCalendar(boat({ offers: undefined })), false);
    assert.equal(showsAllBookedCalendar(null), false);
  });

  test('a FREE week the backend calls not bookable (placeholder price, blocked agency): the inquiry panel, as before', () => {
    assert.equal(showsAllBookedCalendar(boat({ offers: [...NADA.offers, freeWeek] })), false);
  });

  test('a bookable boat is not concerned (its calendar is the normal one)', () => {
    assert.equal(showsAllBookedCalendar(boat({ hasBookableFutureOffer: true })), false);
    assert.equal(showsAllBookedCalendar(boat({ hasBookableFutureOffer: undefined })), false);
  });

  test('the price stays on request everywhere else (hero, cards, meta, JSON-LD)', () => {
    assert.equal(isBookedByInquiry(nada), true);
  });
});

describe('the availability block of the boat page', () => {
  const tab = (yacht, search = '') => {
    setTestSearch(search);

    try {
      return render(createElement(AvailabilityTab, { yacht }));
    } finally {
      setTestSearch('');
    }
  };

  const CHANGE_DATES = allMessages('en').common.changeDates;
  // Its first sentence (the second has an apostrophe, escaped in the markup).
  const INQUIRY_TEXT = allMessages('en').yacht.inquiryOnlyText.split('. ')[0];

  test('Nada: the calendar takes the block, not the inquiry panel — and no date selector, even for dates in the URL', () => {
    const html = tab(nada, 'startDate=2026-10-17&endDate=2026-10-24');

    assert.match(html, /<h2[^>]*>.*Availability<\/h2>/u);
    assert.equal(html.includes(INQUIRY_TEXT), false);
    assert.equal(html.includes(CHANGE_DATES), false);
  });

  test('no published week: the inquiry panel, as before', () => {
    const html = tab(boat({ offers: [] }));

    assert.ok(html.includes(INQUIRY_TEXT));
    assert.ok(html.includes('Send inquiry'));
  });

  test('a FREE week on a boat with none bookable: the inquiry panel, as before', () => {
    assert.ok(tab(boat({ offers: [...NADA.offers, freeWeek] })).includes(INQUIRY_TEXT));
  });

  test('a bookable boat: the calendar and, for dates in the URL, the date selector, as before', () => {
    const html = tab(
      boat({ hasBookableFutureOffer: true, offers: [freeWeek] }),
      'startDate=2026-10-24&endDate=2026-10-31'
    );

    assert.equal(html.includes(INQUIRY_TEXT), false);
    assert.ok(html.includes(CHANGE_DATES));
  });
});

describe('the calendar of a boat with every week reserved (Nada 12442)', () => {
  const weeks = weeksOf(NADA.standardOffers, true);
  const real = weeks.filter(w => !w.id.startsWith('gap|'));

  test('each published week keeps its price, reserved and locked', () => {
    assert.equal(real.length, 10);
    real.forEach(w => {
      assert.equal(w.status, 'booked', w.id);
      assert.equal(w.locked, true, w.id);
      assert.ok(w.price > 1000, w.id);
    });
    assert.deepEqual(
      real.map(w => Math.round(w.price)),
      [1181, 1181, 1390, 1390, 1390, 1390, 1390, 1390, 1390, 1390]
    );
  });

  test('desktop: hatched strip, "Reserved" cards with their price, none selectable, the note above the cards', () => {
    const html = branch(AvailabilityDesktop, weeks, true);
    const note = 'Every published week is reserved — send an inquiry for other dates.';

    assert.ok(html.includes(note));
    assert.ok(html.indexOf(note) < html.indexOf('role="button"'), 'the note sits above the cards');
    // The strip: every cell a disabled button; the 10 published weeks hatched.
    assert.equal(cells(html), WEEKS_PER_CHUNK);
    assert.equal(disabledCells(html), WEEKS_PER_CHUNK);
    assert.equal(hatchedCells(html), 10);
    assert.ok(html.includes('aria-label="Week Oct 17 to Oct 24, 1,181 €, Reserved"'));
    // The 5 visible cards: "Reserved", the week's price, not focusable, no click.
    assert.equal(count(html, /role="button" tabindex="-1"/gu), 5);
    assert.equal(count(html, /role="button" tabindex="0"/gu), 0);
    assert.equal(pills(html, 'Reserved'), 5);
    assert.equal(pills(html, 'Available'), 0);
    assert.equal(count(html, />1,181 €</gu), 2);
    assert.equal(count(html, />1,390 €</gu), 3);
    assert.equal(html.includes('Price on request'), false);
  });

  test('mobile: the note above the cards, every card "Reserved" and not selectable', () => {
    const html = branch(AvailabilityMobile, weeks, true);

    assert.ok(html.includes('Every published week is reserved'));
    assert.equal(count(html, /role="button" tabindex="0"/gu), 0);
    assert.equal(pills(html, 'Reserved'), 10);
    assert.equal(disabledCells(html), WEEKS_PER_CHUNK);
  });

  test('a live option keeps its "Pre-reserved" pill but cannot be selected', () => {
    const optionWeeks = weeksOf(
      NADA.standardOffers.map((o, i) => (i === 0 ? { ...o, status: 'OPTION' } : o)),
      true
    );
    const html = branch(AvailabilityDesktop, optionWeeks, true);

    assert.equal(optionWeeks[0].status, 'option');
    assert.equal(pills(html, 'Pre-reserved'), 1);
    assert.equal(count(html, /role="button" tabindex="0"/gu), 0);
    assert.equal(disabledCells(html), WEEKS_PER_CHUNK);
    // Hatched like the reservations (its amber dot stays).
    assert.equal(hatchedCells(html), 10);
  });

  test('the note in all 9 locales, in the calendar of each', () => {
    LOCALES.forEach(locale => {
      const note = allMessages(locale).yacht.calendar.allBookedNote;

      assert.ok(note && note.length > 20, locale);
      assert.ok(branch(AvailabilityDesktop, weeksOf(NADA.standardOffers, true, locale), true, locale).includes(note));
    });
  });
});

describe('a bookable boat: the calendar is unchanged', () => {
  const offers = NADA.standardOffers.map((o, i) => (i === 1 ? { ...o, status: 'FREE' } : o));
  const weeks = weeksOf(offers, false);
  const html = branch(AvailabilityDesktop, weeks, false);

  test('the free week stays selectable and green, the others reserved; no note', () => {
    assert.equal(weeks[1].status, 'available');
    assert.equal(weeks[1].locked, false);
    assert.equal(count(html, /role="button" tabindex="0"/gu), 1);
    assert.equal(pills(html, 'Available'), 1);
    assert.equal(pills(html, 'Reserved'), 4);
    assert.equal(html.includes('Every published week is reserved'), false);
    // The free week's list price struck through, as before.
    assert.ok(html.includes('1,463 €'));
    assert.equal(disabledCells(html), WEEKS_PER_CHUNK - 1);
  });
});
