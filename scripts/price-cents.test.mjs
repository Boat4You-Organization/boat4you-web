/**
 * Extras and fees keep their cents (src/utils/static/formatPriceCurrency.ts,
 * re-audit 2.10.2026): a tourist tax of 1.33 € per person per night read "1 €"
 * and 9.31 € for the week read "9 €". `cents: 'auto'` is opt-in; every other
 * price stays whole. Node runs the .ts source directly (the model enums need
 * --experimental-transform-types; `@/` is resolved to src/ below).
 *
 *   yarn test:price
 */
import assert from 'node:assert/strict';
import { registerHooks } from 'node:module';
import { describe, test } from 'node:test';

const SRC = new URL('../src/', import.meta.url).href;

registerHooks({
  resolve: (specifier, context, nextResolve) =>
    nextResolve(specifier.startsWith('@/') ? `${SRC}${specifier.slice(2)}.ts` : specifier, context),
});

const { formatPriceWithCurrency, isPositivePrice } = await import('../src/utils/static/formatPriceCurrency.ts');

const NBSP = '\u{A0}';
const NNBSP = '\u{202F}';
const LOCALES = ['en', 'de', 'fr', 'it', 'es', 'pt', 'nl', 'pl', 'hr'];
const eur = (amount, locale, cents) => formatPriceWithCurrency({ clientPriceEur: amount, locale, cents });
const usd = (amountEur, amountUsd, locale) =>
  formatPriceWithCurrency({
    clientPriceEur: amountEur,
    clientPriceInfo: { amount: amountUsd, currency: 'USD' },
    locale,
    cents: 'auto',
  });

describe("formatPriceWithCurrency cents: 'auto'", () => {
  test('a fee with cents shows them, in the separator of each locale', () => {
    assert.equal(eur(1.33, 'en', 'auto'), '1.33 €');
    assert.equal(eur(1.33, 'hr', 'auto'), '1,33 €');
    assert.equal(eur(1.33, 'de', 'auto'), '1,33 €');
    assert.equal(eur(9.31, 'en', 'auto'), '9.31 €');
    assert.equal(eur(9.31, 'hr', 'auto'), '9,31 €');
    assert.equal(eur(0.3, 'de', 'auto'), '0,30 €');
    assert.equal(eur(1234.5, 'de', 'auto'), '1.234,50 €');
    assert.equal(eur(1234.5, 'fr', 'auto'), `1${NNBSP}234,50 €`);
  });

  test('a whole fee stays whole', () => {
    assert.equal(eur(300, 'en', 'auto'), '300 €');
    assert.equal(eur(1750, 'de', 'auto'), '1.750 €');
    assert.equal(eur(50.004, 'hr', 'auto'), '50 €');
    assert.equal(eur(0.995, 'hr', 'auto'), '1 €');
  });

  test('a converted currency follows the partner EUR price: no sudden cents', () => {
    assert.equal(usd(300, 336.12, 'en'), '336 $');
    assert.equal(usd(1750, 1960.7, 'de'), '1.961 $');
    assert.equal(usd(1.33, 1.49, 'en'), '1.49 $');
    assert.equal(usd(1.33, 1.49, 'hr'), '1,49 $');
  });

  test('without the option every price is whole, as before', () => {
    assert.equal(eur(1.33, 'en'), '1 €');
    assert.equal(eur(9.31, 'hr'), '9 €');
    assert.equal(eur(1234.5, 'de'), '1.235 €');
    LOCALES.forEach(locale => {
      assert.doesNotMatch(eur(13702.37, locale), /[.,]\d{2} €$/u, locale);
    });
  });

  test('every locale of the site shows the cents of a fee', () => {
    LOCALES.forEach(locale => {
      assert.match(eur(1.33, locale, 'auto'), /^1[.,]33 €$/u, locale);
      assert.match(eur(1234.56, locale, 'auto'), new RegExp(`^1[.,${NBSP}${NNBSP}]?234[.,]56 €$`, 'u'), locale);
    });
  });
});

describe('isPositivePrice', () => {
  test('a boat price under 0.50 € is no price (rounded to whole euros)', () => {
    assert.equal(isPositivePrice(0.3), false);
    assert.equal(isPositivePrice(0.5), true);
    assert.equal(isPositivePrice(0), false);
    assert.equal(isPositivePrice(null), false);
    assert.equal(isPositivePrice(Number.NaN), false);
  });

  test("an extra is a price from one cent with cents: 'auto'", () => {
    assert.equal(isPositivePrice(0.3, { cents: 'auto' }), true);
    assert.equal(isPositivePrice(0.01, { cents: 'auto' }), true);
    assert.equal(isPositivePrice(0.004, { cents: 'auto' }), false);
    assert.equal(isPositivePrice(0, { cents: 'auto' }), false);
    assert.equal(isPositivePrice(undefined, { cents: 'auto' }), false);
  });
});
