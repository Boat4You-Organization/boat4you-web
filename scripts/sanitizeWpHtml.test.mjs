/**
 * WordPress post HTML through the allowlist (src/lib/sanitizeWpHtml.ts, security audit 15.11.2026).
 *
 *   yarn test:sanitize-wp
 */
import assert from 'node:assert/strict';
import { describe, test } from 'node:test';

import { sanitizeWpHtml } from '../src/lib/sanitizeWpHtml.ts';

describe('sanitizeWpHtml', () => {
  test('what the posts use stays as it is', () => {
    const html =
      '<h2 id="route">Route</h2><p class="lead">Sail <strong>Split</strong> to <a href="https://www.boat4you.com/search">Hvar</a>.</p>' +
      '<figure><img src="https://www.boat4you.com/wp-content/a.jpg" alt="Hvar" width="800" height="600" loading="lazy" decoding="async"><figcaption>Hvar</figcaption></figure>' +
      '<table border="1" cellspacing="0" cellpadding="4"><thead><tr><th scope="col">Day</th></tr></thead><tbody><tr><td colspan="2">1</td></tr></tbody></table>' +
      '<blockquote>Quote</blockquote><ul><li>One</li></ul>';
    // Void elements come back self-closed (<img … />), the same element for the browser.
    assert.equal(sanitizeWpHtml(html), html.replace('decoding="async">', 'decoding="async" />'));
  });

  test('the video placeholder and a YouTube iframe survive', () => {
    const placeholder =
      '<div class="b4y-video" data-yt="S2Uqg1va_pI" data-title="Croatia" data-upload="2026-06-13"></div>';
    assert.equal(sanitizeWpHtml(placeholder), placeholder);
    assert.match(
      sanitizeWpHtml(
        '<iframe src="https://www.youtube.com/embed/S2Uqg1va_pI" title="Croatia" allowfullscreen></iframe>'
      ),
      /<iframe src="https:\/\/www\.youtube\.com\/embed\/S2Uqg1va_pI"/
    );
  });

  test('scripts, handlers, javascript: links, forms and foreign iframes are gone', () => {
    const out = sanitizeWpHtml(
      '<p onclick="steal()">Hi<script>alert(1)</script></p><a href="javascript:alert(1)">x</a><img src="x" onerror="alert(1)">' +
        '<form action="https://evil.example"><input name="card"></form><iframe src="https://evil.example/x"></iframe>' +
        '<style>body{display:none}</style><svg><script>alert(1)</script></svg><a href="data:text/html,<script>">d</a>'
    );
    assert.doesNotMatch(out, /script|onclick|onerror|javascript:|<form|<input|evil\.example|<style|<svg|data:/i);
    assert.match(out, /<p>Hi<\/p>/);
  });

  test('a link to a new tab gets rel="noopener noreferrer"', () => {
    assert.equal(
      sanitizeWpHtml('<a href="https://www.gov.hr" target="_blank">gov</a>'),
      '<a href="https://www.gov.hr" target="_blank" rel="noopener noreferrer">gov</a>'
    );
  });

  test('empty input is returned as it is', () => {
    assert.equal(sanitizeWpHtml(''), '');
  });
});
