/**
 * The checkout opens only the reservation the link is for (src/utils/static/checkoutLink.ts, bug 2.11.2026): a link to
 * /enter-your-details for 7-21 Aug opened the reservation saved earlier in the browser for other dates. Node runs the .ts
 * source directly.
 *
 *   yarn test:checkout-link
 */
import assert from 'node:assert/strict';
import { describe, test } from 'node:test';

import { boatPageForCheckout, checkoutQuery, savedReservationMatchesLink } from '../src/utils/static/checkoutLink.ts';

const saved = { slug: 'beneteau-oceanis-401-namaka-ekolu-19986', dateFrom: '2027-08-07', dateTo: '2027-08-14' };

describe('savedReservationMatchesLink', () => {
  test('the same boat and dates as the link: shown', () => {
    assert.equal(savedReservationMatchesLink(saved, saved.slug, '2027-08-07', '2027-08-14'), true);
  });

  test('other dates in the link: not shown', () => {
    assert.equal(savedReservationMatchesLink(saved, saved.slug, '2027-08-07', '2027-08-21'), false);
  });

  test('another boat in the link: not shown', () => {
    assert.equal(savedReservationMatchesLink(saved, 'lagoon-46-anthea-123', '2027-08-07', '2027-08-14'), false);
  });

  test('a link without dates checks the boat only', () => {
    assert.equal(savedReservationMatchesLink(saved, saved.slug, null, null), true);
    assert.equal(savedReservationMatchesLink(saved, 'lagoon-46-anthea-123', null, null), false);
  });

  test('a reservation saved before the slug was stored is compared by dates only', () => {
    const old = { dateFrom: '2027-08-07', dateTo: '2027-08-14' };
    assert.equal(savedReservationMatchesLink(old, 'lagoon-46-anthea-123', '2027-08-07', '2027-08-14'), true);
    assert.equal(savedReservationMatchesLink(old, saved.slug, '2027-08-07', '2027-08-21'), false);
  });
});

describe('boatPageForCheckout', () => {
  test('keeps the locale and the link dates', () => {
    assert.equal(
      boatPageForCheckout('/de/enter-your-details/namaka-19986', 'startDate=2027-08-07&endDate=2027-08-21'),
      '/de/boat/namaka-19986?startDate=2027-08-07&endDate=2027-08-21'
    );
    assert.equal(boatPageForCheckout('/enter-your-details/namaka-19986', ''), '/boat/namaka-19986');
  });
});

describe('checkoutQuery', () => {
  test('the checkout link carries the saved dates, whatever the boat page URL still says', () => {
    // a week picked on a phone: the URL may still show the previous week when Reserve is tapped (review 3.11.2026)
    assert.equal(
      checkoutQuery('startDate=2027-07-31&endDate=2027-08-07&currency=EUR', '2027-08-07', '2027-08-14'),
      'startDate=2027-08-07&endDate=2027-08-14&currency=EUR'
    );
    assert.equal(checkoutQuery('', '2027-08-07', '2027-08-21'), 'startDate=2027-08-07&endDate=2027-08-21');
  });

  test('without saved dates the boat page query goes as it is', () => {
    assert.equal(checkoutQuery('currency=EUR', undefined, undefined), 'currency=EUR');
  });

  test('the link of a checkout always matches its own reservation', () => {
    const q = new URLSearchParams(checkoutQuery('startDate=2027-07-31&endDate=2027-08-07', '2027-08-07', '2027-08-14'));
    assert.equal(savedReservationMatchesLink(saved, saved.slug, q.get('startDate'), q.get('endDate')), true);
  });
});

describe('damaged saved data', () => {
  test('a saved reservation without dates never crashes and never matches a dated link', () => {
    assert.equal(savedReservationMatchesLink({}, saved.slug, '2027-08-07', '2027-08-14'), false);
  });
});
