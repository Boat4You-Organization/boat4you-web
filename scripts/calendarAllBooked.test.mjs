/**
 * Owner rule 16.10.2026 ("ostavi raspored, samo neka bude sve bukirano ako
 * nema ništa slobodno — nema smisla da se miče cjenik ako nema slobodnih
 * termina"): a boat the backend calls not bookable (hasBookableFutureOffer
 * false) whose partner still publishes weeks keeps its availability calendar.
 * Dufour 360 GL Nada 12442 (live 16.10.2026: 14 published periods, every one
 * RESERVATION): the season strip hatched, every week card "Reserved" with its
 * price, none selectable, a line above the cards with the inquiry button; the
 * sidebar box and the FAQ say every published week is reserved (not "no dates
 * or prices published"). A boat with no published week keeps the inquiry
 * panel, as before; a bookable boat's calendar is unchanged.
 *
 *   yarn test:calendar
 */
import { createElement } from 'react';
import { renderToStaticMarkup } from 'react-dom/server';

import { ThemeProvider } from '@mui/material/styles';
import { NextIntlClientProvider, createTranslator } from 'next-intl';
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
const readSrc = path => readFileSync(`${ROOT}${path}`, 'utf8');
const readJson = path => JSON.parse(readSrc(path));
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
const { buildYachtFaq } = await import('@/utils/static/yachtFaq');
const { default: AvailabilityTab } = await import('@/views/Boat/BoatContentSection/AvailabilityTab/AvailabilityTab');
const { default: BoatCalendar } = await import('@/components/BoatCalendar/BoatCalendar');
const {
  default: AvailabilitySlider,
  AvailabilityDesktop,
  AvailabilityMobile,
  emptyCalendarFallback,
  weeksFromOffers,
} = await import('@/views/Boat/BoatContentSection/AvailabilityTab/LiveCalendar/AvailabilitySlider');
const { default: WeekPriceList } =
  await import('@/views/Boat/BoatContentSection/AvailabilityTab/LiveCalendar/parts/WeekPriceList');
const { WEEKS_PER_CHUNK, monthAxis, weekPriceLabel } =
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

// The calendar's own pipeline (AvailabilitySlider.weeksFromOffers): one row
// per week (best status), the partner's weeks in date order, the gaps filled
// to whole 26-week pages, price tiers.
const weeksOf = (offers, allBooked, locale = 'en') => weeksFromOffers(offers, locale, allBooked, HORIZON);
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

describe('the sidebar box and the FAQ of a boat with every week reserved', () => {
  const en = allMessages('en');
  const NO_DATES = en.yacht.inquiryOnlyText.split('. ')[0];
  const ALL_BOOKED = en.yacht.inquiryAllBookedText.split('. ')[0];
  const sidebar = (yacht, locale = 'en') => render(createElement(BoatCalendar, { yacht }), locale);
  const faqAnswer = (yacht, locale = 'en') => {
    const t = createTranslator({ locale, messages: allMessages(locale) });

    return buildYachtFaq(yacht, (key, values) => t(`yacht.${key}`, values), locale, undefined, null).at(-1).answer;
  };

  test('Nada: the box beside the calendar says every published week is reserved, with the inquiry', () => {
    const html = sidebar(nada);

    assert.equal(html.includes(NO_DATES), false);
    assert.ok(html.includes(ALL_BOOKED));
    assert.ok(html.includes('Send inquiry'));
    assert.ok(html.includes('Price on request'));
  });

  test('no published week: the box says no dates or prices are published, as before', () => {
    const html = sidebar(boat({ offers: [] }));

    assert.ok(html.includes(NO_DATES));
    assert.equal(html.includes(ALL_BOOKED), false);
  });

  test('Nada: the FAQ (and its FAQPage JSON-LD) answer says every week is reserved, not "no dates or prices"', () => {
    const answer = faqAnswer(nada);

    assert.equal(answer, en.yacht.faqBookAllBookedA.replace('{name}', 'Nada'));
    assert.doesNotMatch(answer, /no dates or prices published/u);
  });

  test('no published week, or a FREE one: the FAQ answer stays "no dates or prices published"', () => {
    assert.match(faqAnswer(boat({ offers: [] })), /no dates or prices published/u);
    assert.match(faqAnswer(boat({ offers: [...NADA.offers, freeWeek] })), /no dates or prices published/u);
  });

  test('the box text and the FAQ answer in all 9 locales', () => {
    LOCALES.forEach(locale => {
      const { yacht } = allMessages(locale);

      assert.ok(yacht.inquiryAllBookedText?.length > 40, locale);
      assert.notEqual(yacht.inquiryAllBookedText, yacht.inquiryOnlyText, locale);
      assert.ok(yacht.faqBookAllBookedA?.includes('{name}'), locale);
      assert.ok(sidebar(nada, locale).includes(yacht.inquiryAllBookedText.split(/[.—:]/u)[0].trim()), locale);
      assert.ok(faqAnswer(nada, locale).includes('Nada'), locale);
      assert.notEqual(faqAnswer(nada, locale), faqAnswer(boat({ offers: [] }), locale), locale);
    });
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
    // The inquiry button with the note, above the cards too.
    assert.equal(count(html, />Send inquiry</gu), 1);
    assert.ok(html.indexOf('>Send inquiry<') < html.indexOf('role="button"'));
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
    assert.equal(count(html, />Send inquiry</gu), 1);
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

  test('a FREE row beyond the year the page checks: "Unavailable", no price, not selectable', () => {
    const [free] = weeksOf([{ ...NADA.standardOffers[0], status: 'FREE' }], true);

    assert.equal(free.status, 'service');
    assert.equal(free.price, 0);
    assert.equal(free.regularPrice, undefined);
    assert.equal(free.locked, true);
    assert.equal(weekPriceLabel(free, 'en', 'Price on request'), '—');
  });

  test('one card per week, best status wins (a live option over its reserved twin), as in the slider', () => {
    const twin = { ...NADA.standardOffers[0], id: 99, status: 'OPTION' };
    const deduped = weeksOf([...NADA.standardOffers, twin], true).filter(w => !w.id.startsWith('gap|'));

    assert.equal(deduped.length, 10);
    assert.equal(deduped[0].id, '99');
    assert.equal(deduped[0].status, 'option');
    assert.equal(deduped[0].locked, true);
  });

  test('the slider without a week: the inquiry panel once the answer came, on a boat with none bookable', () => {
    assert.equal(emptyCalendarFallback(true, null), false, 'still asking: nothing yet');
    assert.equal(emptyCalendarFallback(true, []), true);
    assert.equal(emptyCalendarFallback(false, []), false, 'a bookable boat: nothing, as before');
    assert.equal(emptyCalendarFallback(false, null), false);
    assert.deepEqual(weeksFromOffers(null, 'en', true, HORIZON), []);
    assert.deepEqual(weeksFromOffers([], 'en', true, HORIZON), []);
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
    assert.equal(html.includes('>Send inquiry<'), false);
    // The free week's list price struck through, as before.
    assert.ok(html.includes('1,463 €'));
    assert.equal(disabledCells(html), WEEKS_PER_CHUNK - 1);
  });
});

/**
 * Owner 26.10.2026: an AI assistant (ChatGPT, Gemini, Grok) or a crawler asked
 * "what does this boat cost the week of 7–14 August 2027" opens the plain boat
 * URL and reads its server HTML — the calendar was drawn only in the browser.
 * The boat page now looks the calendar's weeks up on the server (the same
 * /standard-offers call, page currency, soft after 8 s) and the calendar
 * draws them from the first render; under it a closed <details> lists every
 * week as text: dates with the year, nights, status, the card's price.
 */
describe('the calendar weeks in the server HTML (26.10.2026)', () => {
  const FROM = '2026-10-16'; // + 18 months = HORIZON
  const bookable = NADA.standardOffers.map((o, i) => (i === 1 ? { ...o, status: 'FREE' } : o));
  const initial = offers => ({ offers, from: FROM });
  const slider = (props, locale = 'en') => render(createElement(AvailabilitySlider, { yacht: nada, ...props }), locale);
  // The text a reader without JavaScript keeps: no styles, no tags, one space.
  const text = html =>
    html
      .replace(/<style[^>]*>[\s\S]*?<\/style>/gu, ' ')
      .replace(/<[^>]+>/gu, '')
      .replace(/&amp;/gu, '&')
      .replace(/\s+/gu, ' ');
  const DAY = '(?:Mon|Tue|Wed|Thu|Fri|Sat|Sun), \\d{1,2} [A-Z][a-z]{2} 20\\d\\d';
  const rows = html => count(text(html), new RegExp(`${DAY} – ${DAY}`, 'gu'));

  test('with the server weeks: the calendar and every week as a row with the year, in the server HTML', () => {
    const html = slider({ initial: initial(bookable) });
    const weeks = weeksOf(bookable, false);

    assert.equal(weeks.length, WEEKS_PER_CHUNK);
    assert.equal(rows(html), weeks.length);
    // Both layouts until the browser knows the screen (the stylesheet shows one).
    assert.equal(cells(html), 2 * WEEKS_PER_CHUNK);
    assert.match(html, /<details[^>]*>(?:<style[^>]*>[^<]*<\/style>)?<summary[^>]*>Prices for every week<\/summary>/u);

    const body = text(html);

    // The free week: list price struck, the discount, the price; a reserved
    // week keeps its price; a week without an offer only "Price on request".
    assert.ok(body.includes('Sat, 24 Oct 2026 – Sat, 31 Oct 2026 7 nights · Available 1,463 € −19% 1,181 €'));
    assert.ok(body.includes('Sat, 17 Oct 2026 – Sat, 24 Oct 2026 7 nights · Reserved 1,181 €'));
    assert.ok(body.includes('Sat, 26 Dec 2026 – Sat, 2 Jan 2027 7 nights Price on request'));
    assert.ok(body.includes('October 2026') && body.includes('January 2027'));
    assert.doesNotMatch(body, /(?<![\d.,])0 €/u);
  });

  test('without them (an error or 8 s on the server): nothing until the browser answers, as before', () => {
    assert.equal(slider({}), '');
    assert.equal(slider({ initial: null }), '');
  });

  test('a boat with every week reserved: each week keeps its price, no list price, nothing selectable', () => {
    const html = slider({ allBooked: true, initial: initial(NADA.standardOffers) });
    const body = text(html);

    assert.equal(rows(html), WEEKS_PER_CHUNK);
    assert.ok(body.includes('Sat, 31 Oct 2026 – Sat, 7 Nov 2026 7 nights · Reserved 1,390 €'));
    assert.equal(body.includes('1,463 €'), false);
    // Only the 16 weeks after the last published one (no offer, no booking known).
    assert.equal(count(body, /7 nights Price on request/gu), WEEKS_PER_CHUNK - 10);
    assert.equal(count(body, /Price on request/gu), WEEKS_PER_CHUNK - 10);
    assert.equal(count(html, /role="button" tabindex="0"/gu), 0);
  });

  test('the availability block hands the server weeks to the calendar', () => {
    setTestSearch('');

    const html = render(
      createElement(AvailabilityTab, {
        yacht: boat({ hasBookableFutureOffer: true, offers: [freeWeek] }),
        initialCalendar: initial(bookable),
      })
    );

    assert.equal(rows(html), WEEKS_PER_CHUNK);
  });

  test('the label and the rows in all 9 locales: translated, each date with its year, never "0 €"', () => {
    const labels = LOCALES.map(locale => allMessages(locale).yacht.calendar.pricesEveryWeek);

    labels.forEach((label, i) => assert.ok(typeof label === 'string' && label.length > 5, LOCALES[i]));
    assert.equal(new Set(labels).size, LOCALES.length);
    LOCALES.forEach((locale, i) => {
      const html = render(createElement(WeekPriceList, { weeks: weeksOf(bookable, false, locale) }), locale);
      const items = [...html.matchAll(/<li[^>]*>([\s\S]*?)<\/li>/gu)].map(([, item]) => text(item));

      assert.ok(html.includes(`>${labels[i]}</summary>`), locale);
      assert.equal(items.length, WEEKS_PER_CHUNK, locale);
      items.forEach(item => assert.match(item, /202[67].*–.*202[67]/u, `${locale}: ${item}`));
      assert.doesNotMatch(text(html), /(?<![\d.,])0 €/u, locale);
    });
  });

  test('the list is real content: a closed <details>, never hidden', () => {
    const LIST = readSrc('src/views/Boat/BoatContentSection/AvailabilityTab/LiveCalendar/parts/WeekPriceList.tsx');

    assert.match(LIST, /<Box component="details" sx=\{\{ mt: '16px' \}\}>/u);
    assert.doesNotMatch(LIST, /\bopen\b|hidden|display: ?'none'|visibility/u);
    // The card's price: never "0 €", a booked week keeps it, the list price only where the card shows it.
    assert.match(LIST, /weekPriceLabel\(w, locale, tCommon\('priceOnRequest'\)\)/u);
    assert.match(LIST, /const showRegular = regular > 0 && w\.price > 0 && !isBooked;/u);
  });

  test('the boat page looks the weeks up beside its other lookups, where the calendar shows, and hands them down', () => {
    const PAGE = readSrc('src/app/[locale]/(search)/boat/[slug]/page.tsx');
    const SECTION = readSrc('src/views/Boat/BoatContentSection/BoatContentSection.tsx');
    const TAB = readSrc('src/views/Boat/BoatContentSection/AvailabilityTab/AvailabilityTab.tsx');

    assert.match(
      PAGE,
      /const showsCalendar = !yacht\.custom && \(!isInquiryOnlyBoat\(yacht\) \|\| showsAllBookedCalendar\(yacht\)\);/u
    );
    assert.match(
      PAGE,
      /initialPrice, calendarWeeks\] = await Promise\.all\(\[[\s\S]*showsCalendar \? initialCalendar\(yacht\.slug, currency, searchParamsData\.startDate, searchParamsData\.endDate\) : null,\s*\]\);/u
    );
    assert.match(PAGE, /fetchSingleYachtStandardOffers\(\{[\s\S]*?currency,\s*\}\)/u);
    assert.match(PAGE, /offers: offers\.map\(offer => \(\{ \.\.\.offer, extras: \[\] \}\)\)/u);
    assert.match(PAGE, /initialCalendar=\{calendarWeeks\}/u);
    assert.match(SECTION, /<AvailabilityTab yacht=\{yacht\} initialCalendar=\{initialCalendar\} \/>/u);
    assert.match(TAB, /<LiveCalendar yacht=\{yacht\} allBooked=\{allBooked\} initial=\{initialCalendar\} \/>/u);
  });

  test('the browser does not repeat the server lookup on load, asks from the server day, and again for another currency', () => {
    const SLIDER = readSrc('src/views/Boat/BoatContentSection/AvailabilityTab/LiveCalendar/AvailabilitySlider.tsx');

    assert.match(SLIDER, /getSingleYachtStandardOffers,\s*initial\?\.offers \?\? null/u);
    assert.match(SLIDER, /const askedFor = useRef<string \| null>\(initial \? lookup : null\);/u);
    assert.match(SLIDER, /const lookup = `\$\{yacht\.slug\}\|\$\{currency\}`;/u);
    assert.match(SLIDER, /const startDate = initialFrom \? dayjs\(initialFrom\) : DateTime\.now\(\);/u);
    assert.match(SLIDER, /<WeekPriceList weeks=\{weeks\} \/>/u);
  });
});

/**
 * Reviews 26.10.2026 of the week list. (A) A week the partner published
 * nothing for is drawn as an "Unavailable" card so the timeline flows; the
 * list said "Unavailable —" and an AI assistant told a client the week is
 * booked, when we simply have no data: the row reads only "Price on request",
 * the card is unchanged. (B) A week across New Year prints the year of the
 * date it sits next to. (C) Server-rendered Intl text keeps the server's in
 * the first client render (suppressHydrationWarning on that element).
 */
describe('the week list and the cards across New Year (reviews 26.10.2026)', () => {
  // The text a reader keeps, one space where an element ends.
  const text = html =>
    html
      .replace(/<style[^>]*>[\s\S]*?<\/style>/gu, ' ')
      .replace(/<[^>]+>/gu, ' ')
      .replace(/&amp;/gu, '&')
      .replace(/\s+/gu, ' ');
  const items = html => [...html.matchAll(/<li[^>]*>([\s\S]*?)<\/li>/gu)].map(([, item]) => text(item).trim());
  const offer = (id, dateFrom, dateTo, status, amount) => ({
    id,
    dateFrom,
    dateTo,
    status,
    clientPriceInfo: amount ? { amount, currency: 'EUR' } : undefined,
    listPriceInfo: amount ? { amount, currency: 'EUR' } : undefined,
  });
  // A reservation, a gap of two weeks, an option, a 3-week owner block (SERVICE), the tail.
  const weeks = weeksOf(
    [
      offer(1, '2026-12-05', '2026-12-12', 'RESERVATION', 2100),
      offer(2, '2026-12-26', '2027-01-02', 'OPTION', 2400),
      offer(3, '2027-01-02', '2027-01-23', 'SERVICE'),
    ],
    false
  );

  test('(A) a week without an offer: only "Price on request" in the list, no status; a real offer keeps its status and price', () => {
    const rows = items(render(createElement(WeekPriceList, { weeks })));

    // One row per calendar week: the list stays aligned with the calendar.
    assert.equal(rows.length, weeks.length);
    assert.equal(rows[0], 'Sat, 5 Dec 2026 – Sat, 12 Dec 2026 7 nights · Reserved 2,100 €');
    assert.equal(rows[1], 'Sat, 12 Dec 2026 – Sat, 19 Dec 2026 7 nights Price on request');
    assert.equal(rows[2], 'Sat, 19 Dec 2026 – Sat, 26 Dec 2026 7 nights Price on request');
    assert.equal(rows[3], 'Sat, 26 Dec 2026 – Sat, 2 Jan 2027 7 nights · Pre-reserved 2,400 €');
    // The owner's block is a published period: its weeks stay "Unavailable".
    assert.equal(rows[4], 'Sat, 2 Jan 2027 – Sat, 9 Jan 2027 7 nights · Unavailable —');
    assert.equal(rows[6], 'Sat, 16 Jan 2027 – Sat, 23 Jan 2027 7 nights · Unavailable —');
    assert.equal(rows[7], 'Sat, 23 Jan 2027 – Sat, 30 Jan 2027 7 nights Price on request');
    assert.equal(weeks.filter(w => w.noOffer).length, rows.filter(r => r.endsWith('7 nights Price on request')).length);
    rows.forEach(r => assert.doesNotMatch(r, /(?<![\d.,])0 €/u, r));
  });

  test('(A) the cards of those weeks are unchanged: "Unavailable", the dash, not selectable', () => {
    const html = branch(AvailabilityMobile, weeks, false);
    const gap = weeks[1];

    assert.equal(gap.noOffer, true);
    assert.equal(gap.status, 'service');
    assert.equal(weekPriceLabel(gap, 'en', 'Price on request'), '—');
    assert.equal(html.includes('Price on request'), false);
    assert.ok(html.includes('aria-label="Week Dec 12 to Dec 19, —, Unavailable"'));
    // The blocked weeks of a published offer carry its id, not the flag.
    assert.deepEqual(
      weeks.slice(4, 7).map(w => [w.id.startsWith('blk|3|'), w.noOffer]),
      [
        [true, false],
        [true, false],
        [true, false],
      ]
    );
  });

  // The partner lists a 14-night reservation and, on its own, its first week;
  // the timeline then draws a filler week inside the reservation.
  const reserved14 = weeksOf(
    [
      offer(21, '2026-11-07', '2026-11-21', 'RESERVATION', 3200),
      offer(22, '2026-11-07', '2026-11-14', 'RESERVATION', 1600),
      offer(23, '2026-12-05', '2026-12-12', 'FREE', 1500),
    ],
    false
  );
  const rowOf = (list, from, to) =>
    items(render(createElement(WeekPriceList, { weeks: list })))[
      list.findIndex(w => w.id === `gap|${from}` && w.dateToIso === to)
    ];

  test('(A) a week inside a 14-night reservation is no unpublished week: the list keeps its status (as before A)', () => {
    const inside = reserved14.find(w => w.id === 'gap|2026-11-14');

    assert.equal(inside.noOffer, false);
    assert.equal(inside.status, 'service');
    assert.equal(
      rowOf(reserved14, '2026-11-14', '2026-11-21'),
      'Sat, 14 Nov 2026 – Sat, 21 Nov 2026 7 nights · Unavailable —'
    );
    // The reservation's own weeks: "Reserved" and its price.
    assert.deepEqual(
      reserved14.slice(0, 2).map(w => [w.dateFromIso, w.status, w.price, w.noOffer]),
      [
        ['2026-11-07', 'booked', 3200, false],
        ['2026-11-14', 'booked', 3200, false],
      ]
    );
  });

  test('(A) a week no offer overlaps (the reservation ends on its first day) reads only "Price on request"', () => {
    const open = reserved14.find(w => w.id === 'gap|2026-11-21');

    assert.equal(open.noOffer, true);
    assert.equal(
      rowOf(reserved14, '2026-11-21', '2026-11-28'),
      'Sat, 21 Nov 2026 – Sat, 28 Nov 2026 7 nights Price on request'
    );
    assert.equal(reserved14.find(w => w.id === 'gap|2026-11-28').noOffer, true);
  });

  test('(B) across New Year: the card prints the year of the end date, the list each date with its own year', () => {
    const mobile = text(branch(AvailabilityMobile, weeks, false));

    assert.ok(mobile.includes('Dec 26 ↓ 7 NIGHTS Jan 02 2027 · 7 nights'), mobile);
    assert.ok(mobile.includes('Dec 19 ↓ 7 NIGHTS Dec 26 2026 · 7 nights'));
    assert.equal(mobile.includes('Jan 02 2026'), false);
    assert.ok(
      items(render(createElement(WeekPriceList, { weeks })))[3].startsWith('Sat, 26 Dec 2026 – Sat, 2 Jan 2027')
    );
    // The 6-month page label: each end with its own year.
    assert.ok(text(branch(AvailabilityDesktop, weeks, false)).includes('DEC 2026 → JUN 2027'));
  });

  test('(B) the phone strip names the week with the year of its number: a week from Mon 28 Dec 2026 is week 1 of 2027', () => {
    // Weeks start on Monday (DateTime: en weekStart 1); week 1 holds 1 January.
    const footer = (from, to) =>
      text(branch(AvailabilityMobile, weeksOf([offer(9, from, to, 'FREE', 2000)], false), false)).match(
        /Week \d+ · \d{4}/u
      )?.[0];

    assert.equal(footer('2026-12-28', '2027-01-04'), 'Week 1 · 2027');
    assert.equal(footer('2026-12-26', '2027-01-02'), 'Week 52 · 2026');
    assert.equal(footer('2027-01-02', '2027-01-09'), 'Week 1 · 2027');
  });

  test('(C) Intl prices and dates keep the server text in the first client render (suppressHydrationWarning)', () => {
    const CARD = readSrc('src/components/AvailabilityCard/AvailabilityCard.tsx');
    const LIST = readSrc('src/views/Boat/BoatContentSection/AvailabilityTab/LiveCalendar/parts/WeekPriceList.tsx');
    const STRIP = readSrc('src/views/Boat/BoatContentSection/AvailabilityTab/LiveCalendar/parts/HeatmapStrip.tsx');

    // The card's struck list price and its price.
    assert.match(CARD, /<Typography\s+suppressHydrationWarning\s+sx=\{\{\s+fontSize: compact \? '14px' : '13px'/u);
    assert.match(
      CARD,
      /<Typography\s+suppressHydrationWarning\s+sx=\{\{\s+fontSize: isAmount \? amountSize : textSize/u
    );
    // The list's dates, months and prices.
    assert.equal(count(LIST, /(?<!\()suppressHydrationWarning(?!\))/gu), 4);
    assert.match(LIST, /<s style=\{\{ color: T\.muted \}\} suppressHydrationWarning>\s*\{fmtPrice\(regular/u);
    assert.match(
      LIST,
      /fontWeight: 700 \}\}\s+suppressHydrationWarning\s*>\s*\{w\.noOffer \? tCommon\('priceOnRequest'\)/u
    );
    // The heatmap cell's title and label carry the price.
    assert.match(STRIP, /disabled=\{isBlocked\}[\s\S]{0,200}suppressHydrationWarning\s+title=/u);
  });
});
