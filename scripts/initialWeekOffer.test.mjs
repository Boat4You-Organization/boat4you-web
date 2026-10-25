/**
 * The week a dated boat link names, priced on the server
 * (src/utils/static/initialWeekOffer.ts, 25.10.2026): the booking box and
 * the phone bar of `/boat/bali-catamarans-bali-54-therasia-11907?startDate=
 * 2027-06-12&endDate=2027-06-19` carried "Price for 7 days" and the total
 * only after hydration. The offer below is that week as the detail API sent
 * it that day (dates, status, price and obligatory extras only).
 *
 *   yarn test:week-offer
 */
import assert from 'node:assert/strict';
import { describe, test } from 'node:test';

import './tsLoader.mjs';

const { initialWeekOffer } = await import('@/utils/static/initialWeekOffer');

const therasiaWeek = {
  id: 12096544,
  dateFrom: '2027-06-12',
  dateTo: '2027-06-19',
  status: 'FREE',
  clientPriceEur: 14895,
  listPriceEur: 16550,
  obligatoryExtrasKeys: ['25'],
};
const boat = (offers, hasBookableFutureOffer = true) => ({ hasBookableFutureOffer, offers });

describe('initialWeekOffer', () => {
  test('the dated link of a week the boat has: that offer', () => {
    assert.equal(initialWeekOffer(boat([therasiaWeek]), '2027-06-12', '2027-06-19'), therasiaWeek);
  });

  test('no dates, or only one of them: null — the browser decides, as before', () => {
    assert.equal(initialWeekOffer(boat([therasiaWeek])), null);
    assert.equal(initialWeekOffer(boat([therasiaWeek]), '2027-06-12'), null);
    assert.equal(initialWeekOffer(boat([therasiaWeek]), undefined, '2027-06-19'), null);
    assert.equal(initialWeekOffer(boat([therasiaWeek]), '', ''), null);
  });

  test('dates the first offer does not cover exactly: null', () => {
    assert.equal(initialWeekOffer(boat([therasiaWeek]), '2027-06-13', '2027-06-20'), null);
    assert.equal(initialWeekOffer(boat([therasiaWeek]), '2027-06-12', '2027-06-26'), null);
  });

  test('only the first offer, the one the browser selects', () => {
    const other = { ...therasiaWeek, id: 1, dateFrom: '2027-06-19', dateTo: '2027-06-26' };

    assert.equal(initialWeekOffer(boat([other, therasiaWeek]), '2027-06-12', '2027-06-19'), null);
  });

  test('no offer for the dates: null', () => {
    assert.equal(initialWeekOffer(boat([]), '2027-06-12', '2027-06-19'), null);
    assert.equal(initialWeekOffer({ hasBookableFutureOffer: true }, '2027-06-12', '2027-06-19'), null);
    assert.equal(initialWeekOffer(null, '2027-06-12', '2027-06-19'), null);
  });

  test('an inquiry-only boat prices nothing: null', () => {
    assert.equal(initialWeekOffer(boat([therasiaWeek], false), '2027-06-12', '2027-06-19'), null);
  });

  test('a backend without hasBookableFutureOffer means bookable, as isInquiryOnlyBoat', () => {
    assert.equal(initialWeekOffer(boat([therasiaWeek], undefined), '2027-06-12', '2027-06-19'), therasiaWeek);
    assert.equal(initialWeekOffer(boat([therasiaWeek], null), '2027-06-12', '2027-06-19'), therasiaWeek);
  });

  test('a reserved or optioned week is still the week: the booking gate decides, unchanged', () => {
    const reserved = { ...therasiaWeek, status: 'RESERVATION' };
    const option = { ...therasiaWeek, status: 'OPTION' };

    assert.equal(initialWeekOffer(boat([reserved]), '2027-06-12', '2027-06-19'), reserved);
    assert.equal(initialWeekOffer(boat([option]), '2027-06-12', '2027-06-19'), option);
  });

  test('offer dates with a time part compare by day', () => {
    const timed = { ...therasiaWeek, dateFrom: '2027-06-12T00:00:00', dateTo: '2027-06-19T00:00:00' };

    assert.equal(initialWeekOffer(boat([timed]), '2027-06-12', '2027-06-19'), timed);
  });
});
