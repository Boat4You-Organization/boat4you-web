/**
 * Numbers in the boat PDF (audit B29 + review 1.10.2026).
 *
 * @react-pdf/renderer draws the PDF in the built-in Helvetica, a standard PDF
 * font with WinAnsi encoding. Intl groups thousands with spaces that encoding
 * lacks: U+202F NARROW NO-BREAK SPACE in French ("3 702 €"), U+2009 THIN
 * SPACE / U+2007 FIGURE SPACE / U+200A HAIR SPACE in some locales. react-pdf
 * writes them as "/", so a French PDF read "3/702 €" and "1/000 L". U+00A0
 * NO-BREAK SPACE is in WinAnsi, keeps the group on one line and looks the
 * same. Kept free of imports: scripts/pdf-number.test.mjs runs it directly.
 */
const NOT_IN_WINANSI = /[\u{2007}\u{2009}\u{200A}\u{202F}]/gu;

/** Any Intl-formatted string the PDF prints (prices, deposit, lengths). */
export const pdfSafeText = (text: string): string => text.replace(NOT_IN_WINANSI, '\u{A0}');

/** A number in the page locale, safe for the PDF font. */
export const formatPdfNumber = (value: number, locale: string, fractionDigits?: number): string =>
  pdfSafeText(
    new Intl.NumberFormat(
      locale,
      fractionDigits === undefined
        ? undefined
        : { minimumFractionDigits: fractionDigits, maximumFractionDigits: fractionDigits }
    ).format(value)
  );
