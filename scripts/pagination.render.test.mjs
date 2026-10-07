/**
 * Render test for the result pager (src/components/Pagination/Pagination.tsx):
 * MUI's own accessible names are English ("pagination navigation", "Go to
 * page 3", "Go to next page") on every locale. On a destination landing the
 * items are the `<a href>` links crawlers follow to pages 2…N, so each locale
 * must name them in its own words (messages/<locale>/common.json pagination).
 *
 *   yarn test:landing-pages
 */
import { createElement } from 'react';
import { renderToStaticMarkup } from 'react-dom/server';

import { NextIntlClientProvider } from 'next-intl';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { describe, test } from 'node:test';
import { fileURLToPath } from 'node:url';

import './tsLoader.mjs';

const ROOT = fileURLToPath(new URL('../', import.meta.url));
const LOCALES = ['en', 'de', 'fr', 'it', 'es', 'pt', 'nl', 'pl', 'hr'];
const common = locale => JSON.parse(readFileSync(`${ROOT}messages/${locale}/common.json`, 'utf8'));

const { default: Pagination } = await import('@/components/Pagination/Pagination');

const BASE = '/search?destinations=croatia&boatTypes=CATAMARAN';
const render = (locale, props) =>
  renderToStaticMarkup(
    createElement(
      NextIntlClientProvider,
      { locale, messages: { common: common(locale) }, timeZone: 'UTC' },
      createElement(Pagination, { onChange: () => {}, ...props })
    )
  );
const pageHref = page => (page === 1 ? BASE : `${BASE}&page=${page}`);
const escape = text => text.replaceAll('&', '&amp;');
const fill = (template, page) => template.replace('{page}', String(page));
// The opening tag of the element carrying this aria-label.
const tagWithLabel = (html, label) => html.match(new RegExp(`<[a-z]+[^>]*aria-label="${label}"[^>]*>`, 'u'))?.[0];

describe('Pagination: accessible names in all nine locales', () => {
  LOCALES.forEach(locale => {
    test(locale, () => {
      const labels = common(locale).pagination;
      const prefix = locale === 'en' ? '' : `/${locale}`;
      const html = render(locale, { page: 2, count: 50, getItemHref: page => `${prefix}${pageHref(page)}` });

      assert.ok(tagWithLabel(html, labels.label)?.startsWith('<nav'), 'nav label');

      const current = tagWithLabel(html, fill(labels.current, 2));
      assert.ok(current, 'current page label');
      assert.match(current, /aria-current="page"/u);
      assert.doesNotMatch(current, /href=/u, 'the page on screen is not a link');

      const expectLink = (label, page) => {
        const tag = tagWithLabel(html, label);
        assert.ok(tag?.startsWith('<a'), `${label} is a link`);
        assert.ok(tag.includes(`href="${escape(`${prefix}${pageHref(page)}`)}"`), `${label} → page ${page}`);
      };
      expectLink(labels.previous, 1);
      expectLink(labels.next, 3);
      expectLink(fill(labels.goTo, 1), 1);
      expectLink(fill(labels.goTo, 3), 3);
      expectLink(fill(labels.goTo, 50), 50);

      if (locale !== 'en') {
        assert.doesNotMatch(html, /Go to|pagination navigation|aria-label="page \d/u, 'no MUI English label');
      }
    });
  });

  test('without page URLs (filtered search) the items stay buttons, still named in the locale', () => {
    const labels = common('de').pagination;
    const html = render('de', { page: 1, count: 3 });

    assert.doesNotMatch(html, /<a /u);
    assert.ok(tagWithLabel(html, labels.next)?.startsWith('<button'), 'next is a button');
    assert.ok(tagWithLabel(html, fill(labels.goTo, 2))?.startsWith('<button'), 'page 2 is a button');
  });
});
