/**
 * One brand link to europe-yachts.com per sister site (owner decision
 * 20.10.2026). The links the sister network sends to Europe Yachts are cut to
 * a single site-wide one: the brand name "Europe Yachts" (no keyword anchor,
 * no title attribute) to the home page, in the footer "Network" list. Links
 * inside blog posts or destination texts are editorial and stay; this test
 * covers the chrome rendered on every page.
 *
 *   - the rendered footer, in every locale, links europe-yachts.com exactly
 *     once, as "Europe Yachts" to https://www.europe-yachts.com/;
 *   - the Network list has no empty slot (every entry is a named link);
 *   - no other source file names europe-yachts.com in code, in any form
 *     (https://, protocol-relative //, a bare host in a constant), in
 *     .ts/.tsx/.js/.jsx/.mjs/.cjs, JSON or Markdown (a header, sidebar or
 *     "our sites" block would put a second link on every page). Comments do
 *     not count. Three files may name it, each exactly as listed: the footer
 *     config (the link), the Organization JSON-LD (a sub-organization url,
 *     not a link) and the Google tag linker domain list (not a link).
 *
 *   yarn test:footer
 */
import { createElement } from 'react';
import { renderToStaticMarkup } from 'react-dom/server';

import { ThemeProvider } from '@mui/material/styles';
import { NextIntlClientProvider } from 'next-intl';
import assert from 'node:assert/strict';
import { readFileSync, readdirSync } from 'node:fs';
import { registerHooks } from 'node:module';
import { describe, test } from 'node:test';
import { fileURLToPath } from 'node:url';
import ts from 'typescript';

import './tsLoader.mjs';

// next/image is CommonJS (its default export does not survive an ESM import
// outside Next); next/link and next/navigation resolve to their .js files.
registerHooks({
  resolve: (specifier, context, nextResolve) => {
    if (specifier === 'next/image') {
      return { url: new URL('./stubs/next-image.mjs', import.meta.url).href, shortCircuit: true };
    }

    try {
      return nextResolve(specifier, context);
    } catch (error) {
      if (error?.code === 'ERR_MODULE_NOT_FOUND' && /^next\//u.test(specifier)) {
        return nextResolve(`${specifier}.js`, context);
      }

      throw error;
    }
  },
});

const ROOT = fileURLToPath(new URL('../', import.meta.url));
const LOCALES = ['en', 'de', 'fr', 'it', 'es', 'pt', 'nl', 'pl', 'hr'];
const readJson = path => JSON.parse(readFileSync(`${ROOT}${path}`, 'utf8'));
const allMessages = locale =>
  Object.fromEntries(
    readdirSync(`${ROOT}messages/${locale}`)
      .filter(file => file.endsWith('.json'))
      .map(file => [file.slice(0, -'.json'.length), readJson(`messages/${locale}/${file}`)])
  );

const { default: theme } = await import('@/styles/themes');
const { default: Footer } = await import('@/components/Footer/Footer');
const { default: footerMenu } = await import('@/config/footerMenu');

const render = locale =>
  renderToStaticMarkup(
    createElement(
      ThemeProvider,
      { theme },
      createElement(
        NextIntlClientProvider,
        { locale, messages: allMessages(locale), timeZone: 'UTC' },
        createElement(Footer)
      )
    )
  );

const decode = text =>
  text
    .replaceAll('&amp;', '&')
    .replaceAll('&quot;', '"')
    .replaceAll('&#x27;', "'")
    .replaceAll('&lt;', '<')
    .replaceAll('&gt;', '>');

// Every <a …>…</a> of the markup: its opening tag, href and visible text.
const anchors = html =>
  [...html.matchAll(/<a\b([^>]*)>([\s\S]*?)<\/a>/gu)].map(([, attributes, inner]) => ({
    attributes,
    href: decode(attributes.match(/\bhref="([^"]*)"/u)?.[1] ?? ''),
    text: decode(inner.replace(/<[^>]+>/gu, ''))
      .replace(/\s+/gu, ' ')
      .trim(),
  }));

const isEuropeYachts = href => {
  try {
    return /(?:^|\.)europe-yachts\.com$/u.test(new URL(href, 'https://www.boat4you.com').hostname);
  } catch {
    return false;
  }
};

describe('Footer: one brand link to europe-yachts.com', () => {
  LOCALES.forEach(locale => {
    test(locale, () => {
      const all = anchors(render(locale));
      const links = all.filter(({ href }) => isEuropeYachts(href));

      // The render is the real footer: every Network entry is on it as a named link.
      footerMenu
        .find(({ title }) => title === 'network')
        .links.forEach(({ href }) =>
          assert.ok(
            all.some(a => a.href === href && a.text),
            `${href} rendered`
          )
        );

      assert.equal(links.length, 1, `exactly one europe-yachts.com link, got ${links.length}`);

      const [link] = links;

      assert.equal(new URL(link.href).href, 'https://www.europe-yachts.com/', 'the home page, on www');
      assert.equal(link.text, 'Europe Yachts', 'brand name only, no keyword anchor');
      assert.doesNotMatch(link.attributes, /\btitle=/u, 'no title attribute');
      assert.doesNotMatch(link.attributes, /\baria-label=/u, 'the visible brand name is the accessible name');
    });
  });

  test('the link sits in the Network list, which has no empty slot', () => {
    const network = footerMenu.find(({ title }) => title === 'network');

    assert.ok(network, 'Network section');
    assert.deepEqual(
      network.links.filter(({ href }) => isEuropeYachts(href)).map(({ displayName }) => displayName),
      ['Europe Yachts']
    );
    network.links.forEach(({ href, displayName, text }) => {
      assert.ok(href, 'every entry links somewhere');
      assert.ok(displayName || text, `${href} has a label`);
    });
    footerMenu
      .filter(({ title }) => title !== 'network')
      .forEach(({ links }) => assert.ok(!links.some(({ href }) => isEuropeYachts(href)), 'only Network links it'));
  });
});

describe('Source: no second site-wide link to europe-yachts.com', () => {
  // The host in any form: https://, protocol-relative //, or bare (a constant
  // a URL is built from); not a longer host such as europe-yachts.com.evil.
  const HOST = /(?:^|[^a-z0-9.-])((?:[a-z0-9-]+\.)*europe-yachts\.com)\b/giu;
  const SCRIPT = /\.[cm]?[jt]sx?$/u;

  // Each file that may name it, with exactly the mentions it may carry.
  const ALLOWED = new Map([
    ['src/config/footerMenu.ts', ['www.europe-yachts.com']], // the one footer link
    ['src/utils/static/buildMetadata.ts', ['www.europe-yachts.com']], // JSON-LD subOrganization url
    ['src/config/crossDomainLinker.ts', ['europe-yachts.com']], // Google tag linker domains
  ]);

  const sourceFiles = dir =>
    readdirSync(`${ROOT}${dir}`, { withFileTypes: true }).flatMap(entry => {
      const path = `${dir}/${entry.name}`;

      if (entry.isDirectory()) return sourceFiles(path);

      return /\.(?:[cm]?[jt]sx?|json|mdx?)$/u.test(entry.name) ? [path] : [];
    });

  // Host mentions in the code of a file: comments are dropped by the
  // TypeScript compiler (JSX kept as written), so a note about the site in a
  // comment is not a link; JSON and Markdown are read as they are.
  const mentions = path => {
    const text = readFileSync(`${ROOT}${path}`, 'utf8');

    if (!text.match(HOST)) return [];

    const code = SCRIPT.test(path)
      ? ts.transpileModule(text, {
          fileName: path,
          compilerOptions: { removeComments: true, jsx: ts.JsxEmit.Preserve, target: ts.ScriptTarget.ESNext },
        }).outputText
      : text;

    return [...code.matchAll(HOST)].map(([, host]) => host.toLowerCase());
  };

  test('no file outside the three listed names europe-yachts.com', () => {
    const offenders = [...sourceFiles('src'), ...sourceFiles('messages')].filter(
      path => !ALLOWED.has(path) && mentions(path).length
    );

    assert.deepEqual(offenders, []);
  });

  test('each listed file names it exactly as listed', () => {
    ALLOWED.forEach((expected, path) => assert.deepEqual(mentions(path), expected, path));
  });

  test('the JSON-LD names it, it does not link it', () => {
    const metadata = readFileSync(`${ROOT}src/utils/static/buildMetadata.ts`, 'utf8');
    const urls = metadata.match(/https?:\/\/(?:[a-z0-9-]+\.)*europe-yachts\.com[^'"`\s]*/giu) ?? [];

    assert.deepEqual(urls, ['https://www.europe-yachts.com']);
    assert.match(metadata, /subOrganization:/u);
  });
});
