import type { PriceCalcDto, SelectedExtras } from '@/models/yacht-offer.model';

/**
 * Partner free text on the public site. Owner rule: a page never shows which
 * charter company operates a boat, nor partner-only notes.
 *
 * Partners write extras / equipment / boat descriptions for their own
 * customers, in English, as the operator: "Athenian Yachts solely provides
 * facilitation services … shall not be liable", "Mooring fees (first and last
 * day at the Athenian’s Pier)", "processed through Hermes’s base at Olympic
 * Marina", "(number of guests to update manually)". Rendered verbatim that put
 * the operator's name on 9 locales of a boat page, the RSC payload and the
 * JSON-LD (audit content-i18n-01 / crawl-b4y-05, 29.9.2026).
 *
 * The page renders structured fields (name, price, unit, payment type);
 * a partner description is shown only when it passes this allow filter:
 * short (≤ 160 characters), no operator name, none of the words that mark
 * the operator's own voice, premises or legal terms, no e-mail / phone / URL
 * and no internal note in brackets. Anything else is hidden, never rewritten.
 * Extra names are kept (they carry the price) with the unsafe parts cut out.
 *
 * Operator names: the list (operatorNames.ts) must not reach a browser chunk,
 * so this module does not import it — the server passes `operatorNameRanges`
 * (utils/server/partnerYacht.ts, applied to the boat before it reaches the
 * page and the RSC payload). Client-side callers (price calc rows,
 * my-bookings) get the rest of the rule, which alone still hides every audit
 * example: each one also says "Yachts", "base", "pier", "pontoon" or "liable".
 */

/** Character ranges of operator names in a text (operatorNames.ts `operatorNameRanges` on the server). */
export type OperatorNameFinder = (text: string) => Array<[number, number]>;

const NO_OPERATOR_NAMES: OperatorNameFinder = () => [];

export const PARTNER_TEXT_MAX_LENGTH = 160;

/** The operator's legal voice, its premises and internal notes — never on the page, not even in a name. */
const HARD_WORDS =
  /\b(?:liable|liability|charterers?|the company|manually|to be (?:confirmed|updated|checked)|tbc|tbd|piers?|pontoons?|nausys|mmk|booking ?manager)\b/i;

/** Words that mark partner prose in a description ("Payable at the base", "our office", "Kavas Yachting"). */
const PROSE_WORDS =
  /\b(?:yachts|yachting|charter|sailing|ltd|bases?|agency|owners?|office|our|we|allowance)\b|\bd\.\s?o\.\s?o\b/i;

/** A bracketed internal note: "(to update manually)", "(internal)", "(check with base)", "(!!)". */
const NOTE_WORDS =
  /\b(?:internal|notes?|update[ds]?|check with|ask (?:the )?(?:base|office|agency|owner)|agents?|brokers?|b2b|commission|admin)\b|[!?]{2,}/i;

const EMAIL = /[\w.+-]+@[\w-]+\.[\w.-]+/;
/** http(s)://, www. or a lower-case domain ("athenian.gr"; not "cleaning.It includes"). */
const WEB_ADDRESS =
  /\bhttps?:\/\/|\bwww\.|\b[a-z0-9-]{2,}\.(?:com|net|org|eu|hr|gr|it|de|es|fr|me|tr|co|io|info|biz|travel)\b/;
/** A phone number: 9+ digits in one run, or 8+ after "+" / a leading 0. */
const PHONE_RUN = /\+?\(?\d[\d\s()./-]{6,}\d/g;

const hasPhone = (text: string): boolean =>
  Array.from(text.matchAll(PHONE_RUN)).some(({ 0: run }) => {
    const digits = run.replace(/\D/g, '').length;

    return digits >= 9 || (digits >= 8 && /^[+(]*0|^\+/.test(run));
  });

const hasContact = (text: string): boolean => EMAIL.test(text) || WEB_ADDRESS.test(text) || hasPhone(text);

/** Top-level bracket groups `( … )` / `[ … ]` with their ranges; an unclosed one runs to the end. */
const bracketGroups = (text: string): Array<{ start: number; end: number; inner: string }> => {
  const groups: Array<{ start: number; end: number; inner: string }> = [];
  let depth = 0;
  let start = 0;

  for (let i = 0; i < text.length; i += 1) {
    const ch = text[i];

    if (ch === '(' || ch === '[') {
      if (depth === 0) start = i;

      depth += 1;
    } else if ((ch === ')' || ch === ']') && depth > 0) {
      depth -= 1;

      if (depth === 0) groups.push({ start, end: i + 1, inner: text.slice(start + 1, i) });
    }
  }

  if (depth > 0) groups.push({ start, end: text.length, inner: text.slice(start + 1) });

  return groups;
};

/** Partner HTML ("<mark><b>…"), odd line separators and runs of blanks out; line breaks kept (pre-line). */
const tidy = (text: string): string =>
  text
    .replace(/<\/?[a-z][^<>]*>/gi, ' ')
    .replace(/\r\n?|\p{Zl}|\p{Zp}/gu, '\n')
    .replace(/[^\S\n]+/g, ' ')
    .split('\n')
    .map(line => line.trim())
    .filter(Boolean)
    .join('\n');

/** True when the text reads as the operator's or as an internal note. */
const isPartnerOnly = (text: string, findOperatorNames: OperatorNameFinder): boolean =>
  HARD_WORDS.test(text) ||
  PROSE_WORDS.test(text) ||
  hasContact(text) ||
  findOperatorNames(text).length > 0 ||
  bracketGroups(text).some(group => NOTE_WORDS.test(group.inner));

/**
 * A partner description (extra, equipment comment, boat description) as the
 * page may show it, or null when it must stay hidden.
 */
export const safePartnerText = (
  text?: string | null,
  findOperatorNames: OperatorNameFinder = NO_OPERATOR_NAMES
): string | null => {
  if (typeof text !== 'string') return null;

  const clean = tidy(text);

  if (!clean || clean.length > PARTNER_TEXT_MAX_LENGTH || isPartnerOnly(clean, findOperatorNames)) return null;

  return clean;
};

/**
 * An extra's / equipment row's partner name with the partner-only parts cut
 * out: a bracketed qualifier that fails the description filter goes whole
 * ("Half board 1-3 pax (number of guests to update manually)" → "Half board
 * 1-3 pax"), then operator names, contacts and the legal / internal words.
 * Ordinary words stay — "Charter Pack", "Base fee" are the extra itself.
 */
export const safePartnerName = (
  name?: string | null,
  findOperatorNames: OperatorNameFinder = NO_OPERATOR_NAMES
): string => {
  if (typeof name !== 'string') return '';

  const flat = tidy(name).replace(/\n/g, ' ');
  // Cut from the end so the earlier ranges stay valid.
  const withoutNotes = bracketGroups(flat)
    .reverse()
    .reduce(
      (text, group) =>
        !group.inner.trim() || isPartnerOnly(group.inner, findOperatorNames)
          ? `${text.slice(0, group.start)} ${text.slice(group.end)}`
          : text,
      flat
    );
  const withoutOperators = findOperatorNames(withoutNotes)
    .reverse()
    .reduce((text, [start, end]) => {
      // "Athenian’s Pier": the possessive goes with the name.
      const tail = /^['’]s?\b/.exec(text.slice(end));

      return `${text.slice(0, start)} ${text.slice(end + (tail ? tail[0].length : 0))}`;
    }, withoutNotes);

  const hard = new RegExp(HARD_WORDS.source, 'gi');

  return withoutOperators
    .replace(new RegExp(EMAIL.source, 'g'), ' ')
    .replace(new RegExp(`(?:${WEB_ADDRESS.source})\\S*`, 'g'), ' ')
    .replace(PHONE_RUN, run => (hasPhone(run) ? ' ' : run))
    .replace(hard, ' ')
    .replace(/\(\s*\)|\[\s*\]/g, ' ')
    .replace(/\s+([,.;:!?)\]])/g, '$1')
    .replace(/([([])\s+/g, '$1')
    .replace(/\s+/g, ' ')
    .replace(/(\s[-–—/|]\s)(?:[-–—/|]\s)+/g, '$1')
    .replace(/^[\s,.;:/|–—-]+|[\s,;:/|–—-]+$/g, '')
    .trim();
};

/** Identity of a partner text for "show it once per page". */
export const partnerTextKey = (text: string): string => text.toLowerCase().replace(/\s+/g, ' ').trim();

/** Shorter than this, a description qualifies its own row ("on request", "Payable on the spot with cash"). */
const PARAGRAPH_LENGTH = 60;

/**
 * Partner descriptions, filtered, and a repeated paragraph shown once per
 * page: partners paste the same terms paragraph on every crew / transfer
 * extra (2–5× on a page, audit crawl-b4y-08). Returns the text for each item
 * in render order — null for a hidden one and for a repeat of a paragraph
 * already shown; a short per-row qualifier stays on every row it belongs to.
 */
export const oncePerPage = (
  texts: Array<string | null | undefined>,
  findOperatorNames: OperatorNameFinder = NO_OPERATOR_NAMES
): Array<string | null> => {
  const seen = new Set<string>();

  return texts.map(text => {
    const safe = safePartnerText(text, findOperatorNames);

    if (!safe || safe.length < PARAGRAPH_LENGTH) return safe;

    const key = partnerTextKey(safe);

    if (seen.has(key)) return null;

    seen.add(key);

    return safe;
  });
};

const safeExtraNames = (extras: SelectedExtras[] | null | undefined) =>
  Array.isArray(extras) ? extras.map(extra => ({ ...extra, name: safePartnerName(extra.name) })) : extras;

/** Price calc rows (boat page recap, phone price sheet, booking) with display-safe names. */
export const withSafeExtraNames = <T extends Pick<PriceCalcDto, 'selectedExtrasAtBase' | 'selectedExtrasInPrice'>>(
  price: T
): T => ({
  ...price,
  selectedExtrasAtBase: safeExtraNames(price.selectedExtrasAtBase) as T['selectedExtrasAtBase'],
  selectedExtrasInPrice: safeExtraNames(price.selectedExtrasInPrice) as T['selectedExtrasInPrice'],
});
