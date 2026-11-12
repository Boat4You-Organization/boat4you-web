/**
 * "72 h free cancellation" is not promised for a charter that starts within
 * two weeks (src/utils/static/freeCancellationEligibility.ts, owner rule
 * 12.11.2026). Node runs the .ts source directly.
 *
 *   yarn test:free-cancellation
 */
import assert from 'node:assert/strict';
import { describe, test } from 'node:test';

// eslint-disable-next-line import/extensions -- Node runs the .ts source directly
const { offersFreeCancellation } = await import('../src/utils/static/freeCancellationEligibility.ts');

// Thursday 12 November 2026, 10:00 UTC.
const NOW = Date.UTC(2026, 10, 12, 10, 0, 0);

describe('offersFreeCancellation', () => {
  test('a charter this Saturday or next week gets no promise', () => {
    assert.equal(offersFreeCancellation('2026-11-14', NOW), false);
    assert.equal(offersFreeCancellation('2026-11-21', NOW), false);
  });

  test('exactly two weeks ahead is still within two weeks', () => {
    assert.equal(offersFreeCancellation('2026-11-26', NOW), false);
  });

  test('more than two weeks ahead keeps the promise', () => {
    assert.equal(offersFreeCancellation('2026-11-27', NOW), true);
    assert.equal(offersFreeCancellation('2026-11-28', NOW), true);
    assert.equal(offersFreeCancellation('2027-06-05', NOW), true);
  });

  test('a charter already under way or in the past gets no promise', () => {
    assert.equal(offersFreeCancellation('2026-11-12', NOW), false);
    assert.equal(offersFreeCancellation('2026-11-01', NOW), false);
  });

  test('a date-time string is read by its day', () => {
    assert.equal(offersFreeCancellation('2026-11-21T17:00:00', NOW), false);
    assert.equal(offersFreeCancellation('2027-06-05T17:00:00', NOW), true);
  });

  test('without a usable date the promise stands', () => {
    assert.equal(offersFreeCancellation(null, NOW), true);
    assert.equal(offersFreeCancellation(undefined, NOW), true);
    assert.equal(offersFreeCancellation('', NOW), true);
    assert.equal(offersFreeCancellation('soon', NOW), true);
  });
});
