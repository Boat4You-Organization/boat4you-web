#!/usr/bin/env node
/**
 * Curated SEO corpus: deleted-brand check — `yarn check:corpus-holes`.
 *
 * public/seo-content/{locale}/*.html is rendered server-side on every
 * /search landing. Before 1.10.2026 (audit N5) ~300 EN sentences and their
 * translations read "Why Stands Out for Ionian Catamarans", "Contact today
 * to reserve…", "Whether …, delivers exceptional value", "transfers are
 * coordinated by." — a generation pass had deleted "Boat4You" — and a few
 * pages carried a writer's "Call to action:" heading or stray Devanagari /
 * Myanmar letters from machine translation. The fixer is
 * scripts/seo-corpus-qa.py (rule `holes`, run with --check for the full
 * audit, ~4 min); this is the fast guard for every commit (well under a
 * second): visible text only, a fixed deny-list, independent of the fixer's
 * patterns. Any hit fails with the file and the text around it.
 * `--staged` (the pre-commit lint) reads only the staged corpus files.
 */
import { execFileSync } from 'node:child_process';
import { readFileSync, readdirSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const REPO = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const ROOT = process.env.CORPUS_DIR ? path.resolve(process.env.CORPUS_DIR) : path.join(REPO, 'public', 'seo-content');

const ALL = [
  // "…sailing facilities.partners with" — a sentence glued to the previous one
  ['glued-sentence', /(?<![\w./@-])[A-Za-zÀ-ž]{3,}\.(?!com\b|hr\b|net\b|org\b|eu\b)[a-zà-ž]{3,}\b(?![./@])/u],
  [
    'internal-note',
    /\b(?:Call[- ]to[- ][Aa]ction|Handlungsaufforderung|Aufruf zum Handeln|Appel à l['’][Aa]ction|Llamada a la [Aa]cción|Chamada para [Aa]ção|Wezwanie do działania|Poziv na akciju)\b/u,
  ],
  ['foreign-glyph', /[ऀ-৿฀-๿က-႟]|[A-Za-zß-ž][Ͱ-Ͽ]|[Ͱ-Ͽ][a-zß-ž]/u],
  ['raw-path', /Boat4You\s*\/(?:search|about)/u],
];
const BY_LOCALE = {
  en: [
    ['why-hole', /\bWhy (?:Stands|Sets|Excels|Shines|Leads)\b/u],
    ['contact-hole', /\b[Cc]ontact (?:today|now)\b/u],
    ['trust-hole', /\bTrust to\b|\bLet be\b|\bChoose for your\b/u],
    ['why-hole', /\b[Dd]iscover why (?:has|is|remains|stands)\b|\bWhy Sailors (?:Choose|Trust) for\b/u],
    ['by-hole', /\b(?:arranged|handled|coordinated|managed) by\s*[.,;]/u],
    [
      'subject-hole',
      /\b(?:Whether|If you)\b[^.!?]{3,300}, (?:delivers|arranges|connects you|matches you|ensures your)\b/u,
    ],
  ],
  de: [
    ['heading-hole', /\bWarum Segler zu\s+zurückkehren\b/u],
    ['contact-hole', /\bKontaktieren Sie (?:noch )?heute(?=[,.]| um\b)/u],
  ],
  fr: [['heading-hole', /\bReviennent [Cc]hez\s*$/u]],
  nl: [['heading-hole', /\b[Tt]erugkeren [Nn]aar\s*$/u]],
  it: [['contact-hole', /\bContatta(?:te)? oggi(?: stesso)?(?=[,.]| per\b)/u]],
  es: [['heading-hole', /\bPor [Qq]ué (?:[Ee]legir )?[Pp]ara(?!\p{L})/u]],
  pt: [['heading-hole', /\b[Rr]egressam\s*$/u]],
  pl: [['heading-hole', /\bwybierają (?:do|dla)(?!\p{L})/u]],
  hr: [['heading-hole', /\bZašto se ističe(?!\p{L})/u]],
};

const BLOCK = /<(p|li|td|dd|blockquote|h[1-6])\b[^>]*>([\s\S]*?)<\/\1\s*>/g;

const decode = text =>
  text
    .replace(/&#x([0-9a-f]+);/gi, (_, h) => String.fromCodePoint(parseInt(h, 16)))
    .replace(/&#(\d+);/g, (_, d) => String.fromCodePoint(Number(d)))
    .replace(/&amp;/g, '&')
    .replace(/&quot;/g, '"')
    .replace(/&apos;|&rsquo;/g, '’')
    .replace(/&nbsp;/g, ' ')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>');

const plain = html =>
  decode(html.replace(/<[^>]+>/g, ' '))
    .replace(/\s+/g, ' ')
    .trim();

const findings = [];

/** [locale, file name] of every corpus page, or only the staged ones. */
const targets = () => {
  if (process.argv.includes('--staged')) {
    const staged = execFileSync(
      'git',
      ['diff', '--cached', '--name-only', '--diff-filter=ACMR', '--', 'public/seo-content'],
      { cwd: REPO, encoding: 'utf8' }
    );

    return staged
      .split('\n')
      .map(line => line.trim().split('/'))
      .filter(parts => parts.length === 4 && parts[3].endsWith('.html'))
      .map(parts => [parts[2], parts[3]]);
  }

  return readdirSync(ROOT)
    .filter(locale => !locale.startsWith('.'))
    .sort()
    .flatMap(locale =>
      readdirSync(path.join(ROOT, locale))
        .filter(name => name.endsWith('.html'))
        .sort()
        .map(name => [locale, name])
    );
};

const files = targets();

files.forEach(([locale, name]) => {
  const rules = [...ALL, ...(BY_LOCALE[locale] ?? [])];
  const src = readFileSync(path.join(ROOT, locale, name), 'utf8');
  // What the landing renders: from <body> to the FIRST </body>
  // (sanitizeCuratedHtml drops anything after it).
  const bodyStart = src.search(/<body\b[^>]*>/);
  const fromBody = bodyStart >= 0 ? src.slice(bodyStart) : src;
  const bodyEnd = fromBody.search(/<\/body>/i);
  const body = bodyEnd >= 0 ? fromBody.slice(0, bodyEnd) : fromBody;

  Array.from(body.matchAll(BLOCK), match => plain(match[2])).forEach(text => {
    rules.forEach(([id, rx]) => {
      const hit = rx.exec(text);

      if (hit) {
        findings.push(
          `${id.padEnd(15)} ${locale}/${name}: …${text.slice(Math.max(0, hit.index - 60), hit.index + 80)}…`
        );
      }
    });
  });
});

/* eslint-disable no-console -- CLI output */
if (findings.length) {
  console.error(`check-corpus-holes: ${findings.length} finding(s) in public/seo-content (${files.length} files):`);
  findings.slice(0, 50).forEach(f => console.error(`  ${f}`));

  if (findings.length > 50) console.error(`  … and ${findings.length - 50} more`);

  console.error('Fix the text (python3 scripts/seo-corpus-qa.py fixes most of these in place), then re-run.');
  process.exit(1);
}

console.log(`check-corpus-holes: OK (${files.length} files)`);
