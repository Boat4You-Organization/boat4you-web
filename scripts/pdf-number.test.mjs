/**
 * Boat PDF numbers (src/components/YachtPDF/pdfNumber.ts, review 1.10.2026):
 * the PDF font (Helvetica, WinAnsi) has no U+202F, so a French PDF printed
 * "3/702 €". Plain `node --test` (Node >= 22.18 runs the .ts source directly).
 *
 *   yarn test:pdf
 */
import assert from 'node:assert/strict';
import { describe, test } from 'node:test';

import { formatPdfNumber, pdfSafeText } from '../src/components/YachtPDF/pdfNumber.ts';

const NBSP = '\u{A0}';
// Characters the PDF's standard font cannot encode (react-pdf prints "/").
const NOT_IN_WINANSI = /[\u{2007}\u{2009}\u{200A}\u{202F}]/u;
const LOCALES = ['en', 'de', 'fr', 'it', 'es', 'pt', 'nl', 'pl', 'hr'];

describe('formatPdfNumber', () => {
  test('fr groups thousands with a no-break space, never U+202F', () => {
    assert.equal(formatPdfNumber(3702, 'fr'), `3${NBSP}702`);
    assert.equal(formatPdfNumber(1000, 'fr'), `1${NBSP}000`);
    assert.equal(formatPdfNumber(13702.5, 'fr', 1), `13${NBSP}702,5`);
  });

  test('other locales keep their own convention', () => {
    assert.equal(formatPdfNumber(3702, 'de'), '3.702');
    assert.equal(formatPdfNumber(3702, 'en'), '3,702');
    assert.equal(formatPdfNumber(11.55, 'hr', 1), '11,6');
    assert.equal(formatPdfNumber(13702, 'pl'), `13${NBSP}702`);
  });

  test('no locale of the site produces a character the PDF font lacks', () => {
    LOCALES.forEach(locale => {
      [1000, 13702, 1234567.5].forEach(value => {
        assert.doesNotMatch(formatPdfNumber(value, locale, 1), NOT_IN_WINANSI, locale);
      });
    });
  });
});

describe('pdfSafeText', () => {
  test('a formatted price string (amount + symbol) is made safe as a whole', () => {
    const price = `${new Intl.NumberFormat('fr').format(3702)} €`;

    assert.match(price, NOT_IN_WINANSI);
    assert.equal(pdfSafeText(price), `3${NBSP}702 €`);
  });

  test('text without such spaces is unchanged', () => {
    assert.equal(pdfSafeText('3.702 € / 7 nights'), '3.702 € / 7 nights');
  });
});
