/**
 * Amount entry on the secret /pay page (src/utils/static/payAmount.ts): what
 * the payer types becomes whole cents without floating point, an amount that
 * could be read two ways is refused, and the "You will pay" line formats
 * cents per locale. Node runs the .ts source directly.
 *
 *   yarn test:pay
 */
import assert from 'node:assert/strict';
import { describe, test } from 'node:test';

const { formatEur, isAmountAmbiguous, minorToAmountInput, parseAmountToMinor } =
  await import('../src/utils/static/payAmount.ts');

const NBSP = '\u{A0}';
const NNBSP = '\u{202F}';

describe('parseAmountToMinor', () => {
  test('whole euros', () => {
    assert.equal(parseAmountToMinor('50'), 5000);
    assert.equal(parseAmountToMinor('1109'), 110900);
    assert.equal(parseAmountToMinor('0050'), 5000);
    assert.equal(parseAmountToMinor('9999999'), 999999900);
  });

  test('one separator followed by one or two digits is a decimal, dot or comma', () => {
    assert.equal(parseAmountToMinor('50.5'), 5050);
    assert.equal(parseAmountToMinor('50,5'), 5050);
    assert.equal(parseAmountToMinor('50.50'), 5050);
    assert.equal(parseAmountToMinor('50,50'), 5050);
    assert.equal(parseAmountToMinor('1109.00'), 110900);
    assert.equal(parseAmountToMinor('1109,05'), 110905);
    assert.equal(parseAmountToMinor('0.01'), 1);
  });

  test('cents never go through floating point', () => {
    // parseFloat('1109.10') * 100 = 110909.99999999999; 0.29 * 100 = 28.999999999999996
    assert.equal(parseAmountToMinor('1109.10'), 110910);
    assert.equal(parseAmountToMinor('0.29'), 29);
    assert.equal(parseAmountToMinor('4.35'), 435);
    assert.equal(parseAmountToMinor('9999999.99'), 999999999);
  });

  test('surrounding spaces are ignored', () => {
    assert.equal(parseAmountToMinor('  1109,00 '), 110900);
  });

  test('one separator followed by three digits is ambiguous and rejected', () => {
    ['50.000', '50,000', '1,109', '1.109'].forEach(input => {
      assert.equal(parseAmountToMinor(input), null, input);
      assert.equal(isAmountAmbiguous(input), true, input);
    });
  });

  test('thousands separators and anything else are rejected', () => {
    [
      '',
      ' ',
      '1.109,00',
      '1,109.00',
      '1 109',
      '1.109.000',
      '50.',
      '.5',
      ',50',
      '50.123',
      '50.5.5',
      '-50',
      '+50',
      '5e3',
      '12345678',
      '€50',
      '50 €',
      'EUR 50',
      '５０',
      'abc',
    ].forEach(input => assert.equal(parseAmountToMinor(input), null, input));

    ['1.109,00', '1 109', '50', '50.5', '50,50', '1109.00'].forEach(input =>
      assert.equal(isAmountAmbiguous(input), false, input)
    );
  });
});

describe('minorToAmountInput', () => {
  test('cents back to the form text, which parses to the same cents', () => {
    assert.equal(minorToAmountInput(110900), '1109.00');
    assert.equal(minorToAmountInput(5050), '50.50');
    assert.equal(minorToAmountInput(5005), '50.05');
    assert.equal(minorToAmountInput(1), '0.01');

    [1, 99, 100, 5000, 110910, 999999999].forEach(minor =>
      assert.equal(parseAmountToMinor(minorToAmountInput(minor)), minor)
    );
  });
});

describe('formatEur', () => {
  test('English: code before the amount, comma groups', () => {
    assert.equal(formatEur(110900, 'en'), `EUR${NBSP}1,109.00`);
    assert.equal(formatEur(5000, 'en'), `EUR${NBSP}50.00`);
    assert.equal(formatEur(5005, 'en'), `EUR${NBSP}50.05`);
    assert.equal(formatEur(10000000, 'en'), `EUR${NBSP}100,000.00`);
    assert.equal(formatEur(0, 'en'), `EUR${NBSP}0.00`);
  });

  test('each locale keeps its own separators and the exact cents', () => {
    assert.equal(formatEur(110910, 'de'), `1.109,10${NBSP}EUR`);
    assert.equal(formatEur(110910, 'hr'), `1.109,10${NBSP}EUR`);
    assert.equal(formatEur(110910, 'fr'), `1${NNBSP}109,10${NBSP}EUR`);
    assert.equal(formatEur(999999999, 'en'), `EUR${NBSP}9,999,999.99`);
  });

  test('every locale shows the cents digits as given', () => {
    ['en', 'de', 'es', 'fr', 'hr', 'it', 'nl', 'pl', 'pt'].forEach(locale => {
      assert.match(formatEur(110905, locale), /1\D?109[.,]05/, locale);
      assert.match(formatEur(1, locale), /0[.,]01/, locale);
    });
  });

  test('a negative amount keeps its sign; a fraction of a cent is refused', () => {
    assert.equal(formatEur(-5, 'en'), `-EUR${NBSP}0.05`);
    assert.throws(() => formatEur(50.5, 'en'), RangeError);
  });
});
