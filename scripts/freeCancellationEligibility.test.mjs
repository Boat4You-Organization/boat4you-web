/**
 * "72 h free cancellation" is not promised for a booking made 14 days or less
 * before the charter (src/utils/static/freeCancellationEligibility.ts, owner
 * rule 12.11.2026; Terms 7.1), and the cancellation timeline of the checkout
 * and My Bookings follows the same rule (cancellationUtils.ts). Node runs the
 * .ts source directly (`@/` is resolved to src/ below).
 *
 *   yarn test:free-cancellation
 */
import assert from 'node:assert/strict';
import { registerHooks } from 'node:module';
import { describe, test } from 'node:test';

const SRC = new URL('../src/', import.meta.url).href;

// DateTime.ts imports a type by a plain `import { Dayjs }`, which Node cannot run as it is. The timeline only
// needs its three formatters, and the tests below do not assert on the formatted dates.
const DATE_TIME_STUB = `data:text/javascript,${encodeURIComponent(`
  export default class DateTime {
    static formatLongWithoutDay = date => date.format('D MMMM YYYY');
    static formatWithMonthName = date => date.format('D MMM');
    static daysBetween = (start, end) => end.startOf('day').diff(start.startOf('day'), 'day');
  }
`)}`;

registerHooks({
  resolve: (specifier, context, nextResolve) => {
    if (specifier === '@/utils/static/DateTime') return { url: DATE_TIME_STUB, shortCircuit: true };

    if (specifier.startsWith('@/')) return nextResolve(`${SRC}${specifier.slice(2)}.ts`, context);

    // dayjs ships its plugins and locales as bare .js files, without an exports map.
    return nextResolve(/^dayjs\/(plugin|locale)\/[^.]+$/.test(specifier) ? `${specifier}.js` : specifier, context);
  },
});

const { FREE_CANCELLATION_RULE_SINCE, offersFreeCancellation } =
  // eslint-disable-next-line import/extensions -- Node runs the .ts source directly
  await import('../src/utils/static/freeCancellationEligibility.ts');
// eslint-disable-next-line import/extensions -- Node runs the .ts source directly
const { generateCancellationTimeline } = await import('../src/utils/static/cancellationUtils.ts');

const DAY_MS = 24 * 60 * 60 * 1000;
// A booking moment ten hours after the rule came into force, whatever that moment is.
const BOOKED = FREE_CANCELLATION_RULE_SINCE + 10 * 60 * 60 * 1000;
/** The calendar day `days` after the booking day, YYYY-MM-DD. */
const day = days => new Date(BOOKED + days * DAY_MS).toISOString().slice(0, 10);

describe('offersFreeCancellation', () => {
  test('a charter in two days or next week gets no promise', () => {
    assert.equal(offersFreeCancellation(day(2), BOOKED), false);
    assert.equal(offersFreeCancellation(day(9), BOOKED), false);
  });

  test('exactly two weeks ahead is still within two weeks', () => {
    assert.equal(offersFreeCancellation(day(14), BOOKED), false);
  });

  test('more than two weeks ahead keeps the promise', () => {
    assert.equal(offersFreeCancellation(day(15), BOOKED), true);
    assert.equal(offersFreeCancellation(day(16), BOOKED), true);
    assert.equal(offersFreeCancellation(day(200), BOOKED), true);
  });

  test('a charter already under way or in the past gets no promise', () => {
    assert.equal(offersFreeCancellation(day(0), BOOKED), false);
    assert.equal(offersFreeCancellation(day(-10), BOOKED), false);
  });

  test('a date-time string is read by its day', () => {
    assert.equal(offersFreeCancellation(`${day(9)}T17:00:00`, BOOKED), false);
    assert.equal(offersFreeCancellation(`${day(200)}T17:00:00`, BOOKED), true);
  });

  test('without a usable date the promise stands', () => {
    assert.equal(offersFreeCancellation(null, BOOKED), true);
    assert.equal(offersFreeCancellation(undefined, BOOKED), true);
    assert.equal(offersFreeCancellation('', BOOKED), true);
    assert.equal(offersFreeCancellation('soon', BOOKED), true);
  });

  test('a booking made before the rule keeps the promise it was given', () => {
    const before = FREE_CANCELLATION_RULE_SINCE - 60 * 60 * 1000;

    assert.equal(offersFreeCancellation(new Date(before + 5 * DAY_MS).toISOString().slice(0, 10), before), true);
  });
});

describe('generateCancellationTimeline', () => {
  const bookedAt = new Date(BOOKED).toISOString();

  test('a booking within 14 days of the charter: no free window, 100 % from booking, then pick-up', () => {
    const timeline = generateCancellationTimeline(day(7), undefined, 'en', null, bookedAt);

    assert.equal(timeline.length, 2);
    assert.match(timeline[0].text, /^No free cancellation/);
    assert.match(timeline[0].text, /100% from the moment of booking/);
    assert.equal(timeline[1].text, 'Yacht Pick-up');
  });

  test('the partner option does not bring the free window back for such a booking', () => {
    const optionExpiry = new Date(BOOKED + DAY_MS).toISOString();
    const timeline = generateCancellationTimeline(day(7), undefined, 'en', optionExpiry, bookedAt);

    assert.equal(timeline.length, 2);
    assert.match(timeline[0].text, /^No free cancellation/);
  });

  test('a booking more than 14 days ahead keeps the 72-hour window as its first milestone', () => {
    const timeline = generateCancellationTimeline(day(30), undefined, 'en', null, bookedAt);

    assert.match(timeline[0].text, /^Free cancellation within 72 hours of booking/);
    assert.ok(timeline.length >= 3);
    assert.equal(timeline.at(-1).text, 'Yacht Pick-up');
  });

  test('a booking made before the rule keeps its 72-hour window in My Bookings', () => {
    const before = FREE_CANCELLATION_RULE_SINCE - 60 * 60 * 1000;
    const timeline = generateCancellationTimeline(
      new Date(before + 5 * DAY_MS).toISOString().slice(0, 10),
      undefined,
      'en',
      null,
      new Date(before).toISOString()
    );

    assert.match(timeline[0].text, /^Free cancellation within 72 hours of booking/);
  });
});
