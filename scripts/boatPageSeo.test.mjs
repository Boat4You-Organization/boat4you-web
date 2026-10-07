/**
 * Boat page SEO fixes of 7.10.2026 (SEO audit "Lagoon 42 Masterpiece"):
 *
 *   - weeklyOffers.ts — ONE weekly summary for the Product JSON-LD
 *     (lowPrice / highPrice / offerCount), the "From … / week" line of the
 *     server HTML and the FAQ's price answer;
 *   - merchantReturnPolicy.ts — free cancellation within 72 h of booking,
 *     not "returns not permitted";
 *   - boatTitle.ts — the boat's name without quotes;
 *   - relatedRotation.ts — similar boats follow each boat on a fixed ring, so
 *     every boat of a marina's group is linked from the boat pages before it;
 *   - fromPriceOffer — the phone bar's price before dates are chosen: the
 *     cheapest bookable week, else the cheapest bookable period of another
 *     length ("Price for N days"), else "Price on request".
 *
 * scripts/fixtures/masterpiece-offers-2026-10-07.json is the boat's undated
 * detail payload of that day (dates, nights, status and price only);
 * waterproof-offers-2026-10-07.json the same for a boat whose weeks are all
 * reserved; sukosan-catamarans-2026-10-07.json the 80 catamarans of one
 * marina (id and length in metres only).
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

const { weeklyOfferSummary, offerNights, cheapestBookableOffer, fromPriceOffer, isQuotedOffer } = await import(
  '@/utils/static/weeklyOffers'
);
const { freeCancellationReturnPolicy } = await import('@/utils/static/merchantReturnPolicy');
const { buildBoatTitle } = await import('@/utils/static/boatTitle');
const { rotateCandidates, ringKey } = await import('@/utils/static/relatedRotation');
const { formatPriceWithCurrency } = await import('@/utils/static/formatPriceCurrency');
const { buildYachtFaq } = await import('@/utils/static/yachtFaq');

const LOCALES = ['en', 'de', 'fr', 'it', 'es', 'pt', 'nl', 'pl', 'hr'];
const masterpiece = readJson('scripts/fixtures/masterpiece-offers-2026-10-07.json');
const waterproof = readJson('scripts/fixtures/waterproof-offers-2026-10-07.json');
const sukosanCatamarans = readJson('scripts/fixtures/sukosan-catamarans-2026-10-07.json').boats;

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

  test('the 19 reserved weeks and the 14/21-night offers are not counted (the sisters count 31 + 19 = 50)', () => {
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

describe('fromPriceOffer: the price before dates are chosen', () => {
  const today = '2026-10-07';

  test('Masterpiece: the cheapest bookable week, the same as the JSON-LD lowPrice', () => {
    const offer = fromPriceOffer(masterpiece.offers, masterpiece.today);

    assert.equal(offerNights(offer), 7);
    assert.equal(offer.clientPriceEur, 1921.85);
    assert.equal(offer.status, 'FREE');
  });

  test('Waterproof, Poros: every week reserved — the cheapest free period of another length, not "Price on request"', () => {
    const summary = weeklyOfferSummary(waterproof.offers, waterproof.today);
    const offer = fromPriceOffer(waterproof.offers, waterproof.today, summary);

    // The JSON-LD keeps describing the weeks (all reserved: SoldOut, 2,150 €).
    assert.equal(summary.bookable, false);
    assert.equal(summary.cheapestBookable, null);
    assert.deepEqual([offerNights(offer), offer.clientPriceEur, offer.status], [14, 3472.25, 'FREE']);
    assert.deepEqual([offer.dateFrom, offer.dateTo], ['2027-08-16', '2027-08-30']);
  });

  test('a cheaper 14-night period never replaces a bookable week', () => {
    const offers = [week('2026-10-10', 14, 'FREE', 900), week('2026-10-17', 7, 'FREE', 2000)];

    assert.equal(fromPriceOffer(offers, today).clientPriceEur, 2000);
    assert.equal(cheapestBookableOffer(offers, today).clientPriceEur, 900);
  });

  test('only bookable, future, priced periods; the earlier one on a tie', () => {
    const offers = [
      week('2026-09-26', 14, 'FREE', 500),
      week('2026-10-10', 14, 'RESERVATION', 600),
      week('2026-10-10', 14, 'OPTION', 650),
      week('2026-10-17', 14, 'FREE', 0),
      week('2026-10-24', 14, 'FREE', null),
      week('2026-11-07', 21, 'FREE', 3000),
      week('2026-10-31', 21, 'OPTION_EXPIRED', 3000),
    ];

    assert.equal(fromPriceOffer(offers, today).dateFrom, '2026-10-31');
  });

  test('nothing bookable with a price: null — "Price on request"', () => {
    assert.equal(fromPriceOffer([week('2026-10-10', 7, 'RESERVATION', 1500)], today), null);
    assert.equal(fromPriceOffer([week('2026-10-10', 14, 'FREE', 0)], today), null);
    assert.equal(fromPriceOffer([], today), null);
    assert.equal(fromPriceOffer(undefined, today), null);
  });

  test('"Price for N days" names the period in all 9 locales, never a week', () => {
    LOCALES.forEach(locale => {
      const t = createTranslator({ locale, messages: { common: readJson(`messages/${locale}/common.json`) } });
      const label = t('common.priceForXDays', { days: '14' });

      assert.match(label, /14/, locale);
      assert.doesNotMatch(label, /week|woche|semaine|settimana|semana|tydzień|tjedan/i, locale);
    });
  });
});

describe('isQuotedOffer: the price details open only for the quoted offer', () => {
  test('Masterpiece: the first offer is the cheapest week — the tap opens its breakdown', () => {
    assert.equal(isQuotedOffer(masterpiece.offers[0], fromPriceOffer(masterpiece.offers, masterpiece.today)), true);
  });

  test('Saona 47 Ancora Reha: "From 2,375 € / week" no longer opens the first offer, 21 nights 11,875 €', () => {
    const offers = [week('2026-10-10', 21, 'FREE', 11875), week('2026-10-17', 7, 'FREE', 2375)];

    assert.equal(isQuotedOffer(offers[0], fromPriceOffer(offers, '2026-10-07')), false);
    assert.equal(isQuotedOffer(offers[1], fromPriceOffer(offers, '2026-10-07')), true);
  });

  test('Waterproof: the first offer is a reserved week, the quote a free 14-night period', () => {
    assert.equal(isQuotedOffer(waterproof.offers[0], fromPriceOffer(waterproof.offers, waterproof.today)), false);
  });

  test('the same week at another price (a route variant) is not the quoted offer; nothing selected is not either', () => {
    const quoted = week('2026-10-17', 7, 'FREE', 2375);

    assert.equal(isQuotedOffer({ ...quoted, dateFrom: '2026-10-17T00:00:00' }, quoted), true);
    assert.equal(isQuotedOffer({ ...quoted, clientPriceEur: 2600 }, quoted), false);
    assert.equal(isQuotedOffer(null, quoted), false);
    assert.equal(isQuotedOffer(quoted, null), false);
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

describe('rotateCandidates: similar boats follow each boat on a ring', () => {
  // Synthetic ids, spread like real boat ids.
  const group = n => Array.from({ length: n }, (_, i) => ({ id: 1_000 + i * 37 + (i % 5) * 11 }));

  // Every boat's page links 3 of the others that pass `fits` (the ±5 ft rule).
  const linksPerBoat = (boats, fits = () => true) => {
    const linked = new Map(boats.map(b => [b.id, 0]));

    boats.forEach(page => {
      const candidates = boats.filter(b => b.id !== page.id && fits(page, b));
      const picked = rotateCandidates(candidates, page.id, 3);

      assert.equal(picked.length, Math.min(3, candidates.length));
      assert.equal(new Set(picked.map(c => c.id)).size, picked.length);
      picked.forEach(c => linked.set(c.id, linked.get(c.id) + 1));
    });

    return linked;
  };

  test('boats of one length: every boat of the group is linked from exactly 3 pages of the group', () => {
    [4, 5, 12, 40, 80, 100, 248].forEach(n => {
      const counts = [...linksPerBoat(group(n)).values()];

      assert.ok(
        counts.every(c => c === 3),
        `${n} boats: ${Math.min(...counts)}–${Math.max(...counts)} links`
      );
    });
  });

  test('Sukošan, 80 catamarans, ±5 ft: at most 1 boat without a link, at most 5 links per boat', () => {
    const fits = (a, b) => Math.abs(a.lengthM - b.lengthM) / 0.3048 <= 5;
    const counts = [...linksPerBoat(sukosanCatamarans, fits).values()];

    assert.equal(sukosanCatamarans.length, 80);
    assert.ok(counts.filter(c => c === 0).length <= 1, `${counts.filter(c => c === 0).length} without a link`);
    assert.ok(Math.max(...counts) <= 5, `up to ${Math.max(...counts)} links`);
  });

  test('a small group: each page links the others', () => {
    const boats = group(3);

    boats.forEach(page => {
      assert.deepEqual(
        new Set(rotateCandidates(boats, page.id, 3).map(c => c.id)),
        new Set(boats.filter(b => b.id !== page.id).map(b => b.id))
      );
    });
  });

  test('deterministic and independent of the pool order', () => {
    const pool = group(40);
    const shuffled = [...pool].reverse();

    pool.forEach(({ id }) => {
      assert.deepEqual(rotateCandidates(pool, id, 3), rotateCandidates(shuffled, id, 3));
      assert.deepEqual(rotateCandidates(pool, id, 3), rotateCandidates(pool, id, 3));
    });
    assert.equal(ringKey(11681), ringKey(11681));
  });

  test('the pages do not all link the same boats', () => {
    const pool = group(40);
    const firstPicks = new Set(pool.map(({ id }) => rotateCandidates(pool, id, 3)[0].id));

    assert.equal(firstPicks.size, 40);
  });

  test('never the boat itself, never a duplicate, lower tier first', () => {
    const pool = group(40);
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
