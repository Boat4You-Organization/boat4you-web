/**
 * Unit tests for the 308 from an inactive boat to the active boat that
 * replaced it (src/utils/static/yachtSuccessor.ts, owner decision 7.10.2026).
 * The detail API's answer goes in as a real Response; out comes the
 * successor's slug (the page answers 308 to successorBoatPath) or null (the
 * page answers 404, as before). Plain `node --test`.
 *
 *   yarn test:successor
 */
import assert from 'node:assert/strict';
import { describe, test } from 'node:test';

import { successorBoatPath, successorSlugOf } from '../src/utils/static/yachtSuccessor.ts';

const OLD = 'lagoon-bnteau-lagoon-42-4-2-cab-masterpiece-4066';
const NEW = 'lagoon-42-masterpiece-11681';
const LOCALES = ['en', 'de', 'fr', 'it', 'es', 'pt', 'nl', 'pl', 'hr'];

const apiAnswer = (status, body) =>
  new Response(typeof body === 'string' ? body : JSON.stringify(body), {
    status,
    headers: { 'Content-Type': 'application/json' },
  });

const inactive = extra => apiAnswer(400, { code: 1502, message: 'Yacht is not active', ...extra });

/** Where the page sends the visitor: a path for a 308, or 404. */
const outcome = async (response, requested, locale = 'en') => {
  const slug = await successorSlugOf(response, requested);

  return slug ? successorBoatPath(slug, locale, 'en') : 404;
};

describe('successorSlugOf: 1502 with a successor', () => {
  test('redirects to the successor named by the backend', async () => {
    assert.equal(await outcome(inactive({ successorSlug: NEW, successorId: 11681 }), OLD), `/boat/${NEW}`);
  });

  test('a successor without successorId is enough', async () => {
    assert.equal(await successorSlugOf(inactive({ successorSlug: NEW }), OLD), NEW);
  });

  test('surrounding whitespace is ignored', async () => {
    assert.equal(await successorSlugOf(inactive({ successorSlug: ` ${NEW}\n` }), OLD), NEW);
  });

  test('the old boat requested by its id', async () => {
    assert.equal(await successorSlugOf(inactive({ successorSlug: NEW }), '4066'), NEW);
  });
});

describe('successorSlugOf: no redirect, the page stays a 404', () => {
  test('1502 without a successor', async () => {
    assert.equal(await outcome(inactive({}), OLD), 404);
    assert.equal(await outcome(inactive({ successorSlug: null, successorId: null }), OLD), 404);
  });

  test('1502 with an empty or non-string successor', async () => {
    for (const successorSlug of ['', '   ', 11681, ['x-1'], { slug: NEW }, true]) {
      assert.equal(await outcome(inactive({ successorSlug }), OLD), 404, JSON.stringify(successorSlug));
    }
  });

  test('a successorId alone is not enough', async () => {
    assert.equal(await outcome(inactive({ successorId: 11681 }), OLD), 404);
  });

  test('404 (no such boat), even with a successorSlug in the body', async () => {
    assert.equal(await outcome(apiAnswer(404, { code: 1501, message: 'Yacht does not exist' }), OLD), 404);
    assert.equal(await outcome(apiAnswer(404, { code: 1502, successorSlug: NEW }), OLD), 404);
  });

  test('410 and other statuses', async () => {
    for (const status of [410, 401, 403, 422]) {
      assert.equal(await outcome(apiAnswer(status, { code: 1502, successorSlug: NEW }), OLD), 404, String(status));
    }
  });

  test('a 400 with another error code', async () => {
    assert.equal(await outcome(apiAnswer(400, { code: 1000, successorSlug: NEW }), OLD), 404);
    assert.equal(await outcome(apiAnswer(400, { code: '1502', successorSlug: NEW }), OLD), 404);
  });

  test('a 400 with an unreadable or empty body', async () => {
    for (const body of ['', 'Bad Request', '<html>400</html>', 'null', '"x"', '[]']) {
      assert.equal(await outcome(apiAnswer(400, body), OLD), 404, body);
    }
  });

  test('the successor is the requested slug itself (no redirect loop)', async () => {
    assert.equal(await outcome(inactive({ successorSlug: OLD }), OLD), 404);
    assert.equal(await outcome(inactive({ successorSlug: NEW }), NEW), 404);
    assert.equal(await outcome(inactive({ successorSlug: NEW }), ` ${NEW.toUpperCase()} `), 404);
  });

  test('anything that is not a plain boat slug never reaches the Location header', async () => {
    const unsafe = [
      '//evil.example/boat',
      'https://evil.example',
      '../admin',
      'lagoon-42/../../x-1',
      'lagoon 42-11681',
      'lagoon-42-11681?x=1',
      'lagoon-42-11681#x',
      'Lagoon-42-11681',
      'lagoon-42-masterpiece-11681-',
      'lagoon%2F42-11681',
      'lagoon-42-11681\r\nSet-Cookie: x=1',
      'čamac-1',
    ];

    for (const successorSlug of unsafe) {
      assert.equal(await outcome(inactive({ successorSlug }), OLD), 404, successorSlug);
    }
  });
});

describe('successorBoatPath', () => {
  test('keeps the language: no prefix for English, /<locale> for the other eight', () => {
    assert.equal(successorBoatPath(NEW, 'en', 'en'), `/boat/${NEW}`);
    LOCALES.filter(locale => locale !== 'en').forEach(locale => {
      assert.equal(successorBoatPath(NEW, locale, 'en'), `/${locale}/boat/${NEW}`, locale);
    });
  });

  test('the whole way, in every locale: straight to the successor, no query', async () => {
    for (const locale of LOCALES) {
      const target = await outcome(inactive({ successorSlug: NEW, successorId: 11681 }), OLD, locale);

      assert.equal(target, locale === 'en' ? `/boat/${NEW}` : `/${locale}/boat/${NEW}`, locale);
      assert.ok(!String(target).includes('?'), locale);
    }
  });
});
