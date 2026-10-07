/**
 * Boat page SEO fixes of 7.10.2026 (SEO audit "Lagoon 42 Masterpiece"):
 *
 *   - weeklyOffers.ts — ONE weekly summary for the Product JSON-LD
 *     (lowPrice / highPrice / offerCount), the "From … / week" line of the
 *     server HTML and the FAQ's price answer;
 *   - merchantReturnPolicy.ts — free cancellation within 72 h of booking,
 *     not "returns not permitted";
 *   - boatTitle.ts — the boat's name without quotes;
 *   - relatedRotation.ts — similar boats rotate per boat, so every boat of a
 *     marina's pool is linked from some boat pages.
 *
 * scripts/fixtures/masterpiece-offers-2026-10-07.json is the boat's undated
 * detail payload of that day (dates, nights, status and price only).
 *
 *   yarn test:boat-seo
 */
import { createTranslator } from 'next-intl';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { describe, test } from 'node:test';
import { fileURLToPath } from 'node:url';

import './tsLoader.mjs';

const ROOT = fileURLToPath(new URL('../', import.meta.url));
const readJson = path => JSON.parse(readFileSync(`${ROOT}${path}`, 'utf8'));

const { weeklyOfferSummary, offerNights } = await import('@/utils/static/weeklyOffers');
const { freeCancellationReturnPolicy } = await import('@/utils/static/merchantReturnPolicy');
const { buildBoatTitle } = await import('@/utils/static/boatTitle');
const { rotateCandidates, rotationScore } = await import('@/utils/static/relatedRotation');
const { formatPriceWithCurrency } = await import('@/utils/static/formatPriceCurrency');
const { buildYachtFaq } = await import('@/utils/static/yachtFaq');

const LOCALES = ['en', 'de', 'fr', 'it', 'es', 'pt', 'nl', 'pl', 'hr'];
const masterpiece = readJson('scripts/fixtures/masterpiece-offers-2026-10-07.json');

const week = (dateFrom, nights, status, clientPriceEur) => {
  const to = new Date(Date.parse(dateFrom) + nights * 86_400_000).toISOString().slice(0, 10);

  return { dateFrom, dateTo: to, numberOfDays: nights, status, clientPriceEur };
};

describe('weeklyOfferSummary: Lagoon 42 Masterpiece, 7.10.2026', () => {
  const summary = weeklyOfferSummary(masterpiece.offers, masterpiece.today);

  test('the bookable 7-night weeks: from 1,922 € to 7,448 €, 31 weeks', () => {
    assert.equal(summary.bookable, true);
    assert.equal(summary.lowPrice, 1922);
    assert.equal(summary.highPrice, 7448);
    assert.equal(summary.offerCount, 31);
    assert.equal(summary.cheapestBookable.clientPriceEur, 1921.85);
  });

  test('the 19 booked weeks and the 14/21-night offers are not counted (the sisters count 31 + 19 = 50)', () => {
    const sevenNights = masterpiece.offers.filter(o => offerNights(o) === 7);

    assert.equal(sevenNights.length, 50);
    assert.equal(sevenNights.filter(o => o.status === 'RESERVATION').length, 19);
    assert.ok(summary.weeks.every(o => offerNights(o) === 7 && o.status === 'FREE'));
  });

  test('the "from" price is a 7-night total, never a per-day rate', () => {
    // 274.55 € a day × 7 nights = 1,921.85 € — the page says "/ week".
    assert.equal(offerNights(summary.cheapestBookable), 7);
    assert.ok(summary.lowPrice > 1000);
  });
});

describe('weeklyOfferSummary: rules', () => {
  const today = '2026-10-07';

  test('a cheaper 14- or 21-night offer never becomes the weekly price', () => {
    const s = weeklyOfferSummary([week('2026-10-10', 14, 'FREE', 900), week('2026-10-17', 7, 'FREE', 2000)], today);

    assert.equal(s.lowPrice, 2000);
    assert.equal(s.offerCount, 1);
  });

  test('past weeks, unpriced and 0 € weeks are left out', () => {
    const s = weeklyOfferSummary(
      [
        week('2026-09-26', 7, 'FREE', 500),
        week('2026-10-10', 7, 'FREE', 0),
        week('2026-10-17', 7, 'FREE', null),
        week('2026-10-24', 7, 'FREE', 0.4),
        week('2026-10-31', 7, 'FREE', 1800),
      ],
      today
    );

    assert.deepEqual([s.lowPrice, s.highPrice, s.offerCount], [1800, 1800, 1]);
  });

  test('a week with two rows counts once, the bookable row first, then the lower price', () => {
    const s = weeklyOfferSummary(
      [
        week('2026-10-10', 7, 'RESERVATION', 1500),
        week('2026-10-10', 7, 'FREE', 2100),
        week('2026-10-17', 7, 'FREE', 2300),
        week('2026-10-17', 7, 'FREE', 2200),
      ],
      today
    );

    assert.equal(s.offerCount, 2);
    assert.equal(s.lowPrice, 2100);
    assert.equal(s.highPrice, 2200);
  });

  test('OPTION weeks are not bookable; every week taken = sold out, no "from" price', () => {
    const s = weeklyOfferSummary(
      [week('2026-10-10', 7, 'OPTION', 1500), week('2026-10-17', 7, 'RESERVATION', 1700)],
      today
    );

    assert.equal(s.bookable, false);
    assert.equal(s.cheapestBookable, null);
    assert.deepEqual([s.lowPrice, s.highPrice, s.offerCount], [1500, 1700, 2]);
  });

  test('no priced future week: no summary', () => {
    assert.equal(weeklyOfferSummary([], today), null);
    assert.equal(weeklyOfferSummary(undefined, today), null);
    assert.equal(weeklyOfferSummary([week('2026-10-10', 3, 'FREE', 900)], today), null);
  });
});

describe('"From … / week" in all 9 locales = the JSON-LD lowPrice', () => {
  const { cheapestBookable, lowPrice } = weeklyOfferSummary(masterpiece.offers, masterpiece.today);
  const expected = {
    en: 'From 1,922 € / week',
    de: 'Ab 1.922 € / Woche',
    fr: 'À partir de 1 922 € / semaine',
    it: 'Da 1922 € / settimana',
    es: 'Desde 1922 € / semana',
    pt: 'Desde 1.922 € / semana',
    nl: 'Vanaf 1.922 € / week',
    pl: 'Od 1922 € / tydzień',
    hr: 'Od 1.922 € / tjedan',
  };

  LOCALES.forEach(locale => {
    test(locale, () => {
      const t = createTranslator({ locale, messages: { yacht: readJson(`messages/${locale}/yacht.json`) } });
      const price = formatPriceWithCurrency({
        clientPriceEur: cheapestBookable.clientPriceEur,
        clientPriceInfo: { amount: cheapestBookable.clientPriceEur, currency: 'EUR' },
        locale,
      });

      assert.equal(t('yacht.fromPerWeek', { price }), expected[locale]);
      assert.equal(Number(price.replace(/\D/g, '')), lowPrice);
    });
  });

  test('the FAQ price answer names the same amount', () => {
    const t = (key, values) => `${key}|${values?.price ?? ''}`;
    const yacht = { id: 11681, name: 'MASTERPIECE', model: 'Lagoon 42', offers: masterpiece.offers, charterType: [] };
    const priceEntry = buildYachtFaq(yacht, t, 'en', undefined, cheapestBookable.clientPriceEur).find(e =>
      e.question.startsWith('faqPriceQ')
    );

    assert.match(priceEntry.answer, /\|1,922 €$/);
    assert.equal(
      buildYachtFaq(yacht, t, 'en', undefined, null).some(e => e.question.startsWith('faqPriceQ')),
      false
    );
  });
});

describe('freeCancellationReturnPolicy', () => {
  test('a finite 3-day window, free — not "returns not permitted"', () => {
    assert.deepEqual(freeCancellationReturnPolicy('HR'), {
      '@type': 'MerchantReturnPolicy',
      returnPolicyCategory: 'https://schema.org/MerchantReturnFiniteReturnWindow',
      merchantReturnDays: 3,
      returnFees: 'https://schema.org/FreeReturn',
      applicableCountry: 'HR',
    });
    assert.equal('applicableCountry' in freeCancellationReturnPolicy(undefined), false);
  });
});

describe('buildBoatTitle: the name without quotes', () => {
  test('Lagoon 42 Masterpiece', () => {
    const { title, absolute } = buildBoatTitle({
      model: 'Lagoon 42',
      name: 'Masterpiece',
      year: 2018,
      tail: 'Sukošan Charter',
    });

    assert.equal(title, 'Lagoon 42 Masterpiece (2018) — Sukošan Charter');
    assert.equal(absolute, false);
  });

  test('every locale tail keeps the pattern, no quote anywhere', () => {
    LOCALES.forEach(locale => {
      const meta = readJson(`messages/${locale}/metadata.json`);
      const t = createTranslator({ locale, messages: { metadata: meta } });
      const { title } = buildBoatTitle({
        model: 'Lagoon 42',
        name: 'Masterpiece',
        year: 2018,
        tail: t('metadata.boat.titleTail', { city: 'Sukošan' }),
      });

      assert.match(title, /^Lagoon 42 Masterpiece \(2018\) — /, locale);
      assert.doesNotMatch(title, /['‘’"]/, locale);
    });
  });

  test('a name repeating the model is left out; long titles still fit 70 characters', () => {
    assert.equal(
      buildBoatTitle({ model: 'Bavaria Cruiser 40', name: 'Bavaria Cruiser 40', year: 2010, tail: 'Split Charter' })
        .title,
      'Bavaria Cruiser 40 (2010) — Split Charter'
    );

    const long = buildBoatTitle({
      model: 'Fountaine Pajot Saona 47',
      name: 'Very Long Boat Name That Goes On And On Forever',
      year: 2021,
      tail: 'Castellammare di Stabia Charter',
    });

    assert.ok(long.title.length <= 70, long.title);
    assert.doesNotMatch(long.title, /'/);
    assert.match(long.title, /^Fountaine Pajot Saona 47 Very/);
  });
});

describe('rotateCandidates: similar boats rotate per boat', () => {
  const pool = Array.from({ length: 40 }, (_, i) => ({ id: 20_000 + i * 7 }));
  const pageIds = Array.from({ length: 1000 }, (_, i) => 1 + i * 13);

  test('over 1,000 boat pages every one of 40 candidates is linked, evenly', () => {
    const linked = new Map(pool.map(c => [c.id, 0]));

    pageIds.forEach(id => {
      const picked = rotateCandidates(pool, id, 3);

      assert.equal(picked.length, 3);
      assert.equal(new Set(picked.map(c => c.id)).size, 3);
      picked.forEach(c => linked.set(c.id, linked.get(c.id) + 1));
    });

    const counts = [...linked.values()];

    // 3,000 links over 40 boats = 75 each on average.
    assert.ok(
      counts.every(n => n > 0),
      'every candidate is linked'
    );
    assert.ok(
      Math.min(...counts) >= 40 && Math.max(...counts) <= 115,
      `spread ${Math.min(...counts)}–${Math.max(...counts)}`
    );
  });

  test('the old rule linked 3 of 40 from every page; the rotation does not', () => {
    const firstPicks = new Set(pageIds.map(id => rotateCandidates(pool, id, 3)[0].id));

    assert.ok(firstPicks.size >= 35, `${firstPicks.size} different first cards`);
  });

  test('deterministic and independent of the pool order', () => {
    const shuffled = [...pool].reverse();

    pageIds.slice(0, 50).forEach(id => {
      assert.deepEqual(rotateCandidates(pool, id, 3), rotateCandidates(shuffled, id, 3));
      assert.deepEqual(rotateCandidates(pool, id, 3), rotateCandidates(pool, id, 3));
    });
    assert.equal(rotationScore(11681, 11680), rotationScore(11681, 11680));
  });

  test('never the boat itself, never a duplicate, lower tier first', () => {
    const self = pool[5].id;
    const withDup = [...pool, pool[0], pool[0]];

    const picked = rotateCandidates(withDup, self, 40);

    assert.ok(!picked.some(c => c.id === self));
    assert.equal(new Set(picked.map(c => c.id)).size, picked.length);
    assert.equal(picked.length, 39);

    const exact = new Set([pool[1].id, pool[2].id]);
    const dated = rotateCandidates(pool, 11681, 3, c => (exact.has(c.id) ? 0 : 1));

    assert.deepEqual(new Set(dated.slice(0, 2).map(c => c.id)), exact);
    assert.equal(rotateCandidates(pool.slice(0, 2), 1, 3).length, 2);
  });
});
