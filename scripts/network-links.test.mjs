/**
 * Links between the Boat4You Group sites are rel="nofollow" (Mario 28.10.2026):
 * the helper (src/utils/static/networkLinks.ts, the same file on all seven
 * sites) and every hardcoded JSX link to a sister site in src/. Plain
 * `node --test` (Node >= 22.18 runs the .ts source directly).
 *
 *   yarn test:network-links
 */
import assert from 'node:assert/strict';
import crypto from 'node:crypto';
import fs from 'node:fs';
import path from 'node:path';
import { describe, test } from 'node:test';

import {
  NETWORK_HOSTS,
  isNetworkHref,
  nofollowNetworkLinks,
  nofollowNetworkLinksDeep,
} from '../src/utils/static/networkLinks.ts';

const ROOT = path.join(path.dirname(new URL(import.meta.url).pathname), '..');
const SELF = 'boat4you.com';
/** Three sister sites other than this one, for the fixtures. */
const [ONE, TWO, THREE] = NETWORK_HOSTS.filter(host => host !== SELF);
/** sha256 of src/utils/static/networkLinks.ts — the same file on every sister site. */
const HELPER_SHA256 = 'ab19ef2e017c1c7061f74395d88b9c5d4bb8b80b985ba27e25ebb39e72264054';

describe('nofollowNetworkLinks', () => {
  test('a sister-site link gets rel="nofollow", existing rel tokens stay', () => {
    assert.equal(
      nofollowNetworkLinks(`<a href="https://www.${ONE}/boat/x-1">x</a>`, SELF),
      `<a rel="nofollow" href="https://www.${ONE}/boat/x-1">x</a>`
    );
    assert.equal(
      nofollowNetworkLinks(`<a href="https://${TWO}/" rel="noopener">EY</a>`, SELF),
      `<a href="https://${TWO}/" rel="nofollow noopener">EY</a>`
    );
    assert.equal(
      nofollowNetworkLinks(`<a class='c' href='//${THREE}/blog' rel='dofollow'>c</a>`, SELF),
      `<a class='c' href='//${THREE}/blog' rel='nofollow'>c</a>`
    );
    // No rel yet: the new one takes the href's quote (HTML inside JSON-LD stays valid JSON).
    assert.equal(
      nofollowNetworkLinks(`<a href='https://${ONE}/'>x</a>`, SELF),
      `<a rel='nofollow' href='https://${ONE}/'>x</a>`
    );
  });

  test('an existing nofollow is left alone', () => {
    const html = `<a href="https://www.${ONE}" rel="nofollow noopener">g</a>`;
    assert.equal(nofollowNetworkLinks(html, SELF), html);
  });

  test('own, relative and outside links stay followed', () => {
    for (const html of [
      '<a href="https://www.boat4you.com/blog/x">own</a>',
      '<a href="/catamarans">relative</a>',
      '<a href="https://www.tripadvisor.com/x">outside</a>',
      '<a href="https://notboat4you.com/">look-alike</a>',
      '<a href="mailto:info@boat4you.com">mail</a>',
    ]) {
      assert.equal(nofollowNetworkLinks(html, SELF), html);
    }
  });

  test('subdomains of a sister site count, the current site never does', () => {
    assert.equal(isNetworkHref(`https://api.${ONE}/x`, SELF), true);
    assert.equal(isNetworkHref(`https://wp.${SELF}/x`, SELF), false);
    assert.equal(isNetworkHref('https://www.boat4you.com/', SELF), false);
    assert.equal(isNetworkHref(`https://www.${SELF}/`, ONE), true);
  });

  test('the deep variant rewrites every string in a parsed WP response', () => {
    const data = {
      post: { content: `<p><a href="https://www.${TWO}/x">c</a></p>`, id: 7 },
      related: [{ excerpt: `<a href="https://www.${THREE}">b</a>` }, null],
    };
    assert.deepEqual(nofollowNetworkLinksDeep(data, SELF), {
      post: { content: `<p><a rel="nofollow" href="https://www.${TWO}/x">c</a></p>`, id: 7 },
      related: [{ excerpt: `<a rel="nofollow" href="https://www.${THREE}">b</a>` }, null],
    });
  });

  test('the helper is the shared sister-site file', () => {
    const source = fs.readFileSync(path.join(ROOT, 'src/utils/static/networkLinks.ts'));
    assert.equal(crypto.createHash('sha256').update(source).digest('hex'), HELPER_SHA256);
  });
});

describe('footer links to the sister sites', () => {
  test('the "network" column lists only sister sites, and FooterMenuItem gives them NETWORK_REL', () => {
    const config = fs.readFileSync(path.join(ROOT, 'src/config/footerMenu.ts'), 'utf8');
    const network = config.slice(config.indexOf("title: 'network'"));
    const hrefs = [...network.matchAll(/href: '([^']+)'/g)].map(([, href]) => href);
    assert.equal(hrefs.length, 6, hrefs.join(', '));
    for (const href of hrefs) assert.ok(isNetworkHref(href, SELF), href);
    const item = fs.readFileSync(path.join(ROOT, 'src/components/Footer/FooterMenuItem/FooterMenuItem.tsx'), 'utf8');
    assert.match(item, /rel: isNetworkHref\(href\) \? NETWORK_REL : 'noopener noreferrer'/);
  });
});
