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
 * `--staged` (the pre-commit lint) checks only the staged corpus files, and
 * reads them from the index (what is being committed), not the working tree.
 *
 * Review of 1.10.2026 (wave 2) added: "why has become / why is your trusted",
 * "sailors choose for", "book again with because", "us's", "how works", raw
 * paths in any language after a Boat4You link ("Boat4You/recherche?…",
 * "Boat4You /how-we-work"), and per locale a preposition with only
 * punctuation after it ("Schiffe von , die", "par .", "przez .") — checked on
 * the block text with tags removed without a space, so a separable particle
 * before a closing tag ("an</a>.") is not one.
 *
 * 2.10.2026 added `brand-s`: a possessive "'s" with no word before it — the
 * same deleted "Boat4You" ("…seamless.'s dedicated team", "'s Transparante
 * proces", "El proceso transparente de 's aclara", "zespół wsparcia 's") —
 * and "Boat4You 's" with a real space. Also checked on the tight block text,
 * so "<strong>Boat4You</strong>'s" passes; Dutch "'s avonds / 's ochtends /
 * 's late namiddag"-type words are allowed.
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
  ['raw-path', /Boat4You\s*\/\s*[A-Za-z?]/u],
];
const BY_LOCALE = {
  en: [
    ['why-hole', /\bWhy (?:Stands|Sets|Excels|Shines|Leads)\b/u],
    ['contact-hole', /\b[Cc]ontact (?:today|now)\b/u],
    ['trust-hole', /\bTrust to\b|\bLet be\b|\bChoose for your\b/u],
    ['why-hole', /\b[Dd]iscover why (?:has|is|remains|stands)\b|\bWhy Sailors (?:Choose|Trust) for\b/u],
    [
      'why-hole',
      /\b(?:[Aa]bout|[Ll]earn|[Uu]nderstand|[Dd]iscover|into|see|[Ee]xplore) why (?:has become|is (?:your|the trusted|trusted)|remains (?:the|sailors['’]))\b/u,
    ],
    ['choose-hole', /(?<!\bto )\b(?:[Cc]hoose|[Tt]rust) for\b/u],
    [
      'us-hole',
      /\b(?:with|by|at|from|through) because\b|(?<![\w’'])us['’]s\b|\bwith us [Ss]upport\b|\babout and our\b|(?<![\w-])how works\b/u,
    ],
    ['by-hole', /\b(?:arranged|handled|coordinated|managed) by\s*[.,;]/u],
    [
      'subject-hole',
      /\b(?:Whether|If you)\b[^.!?]{3,300}, (?:delivers|arranges|connects you|matches you|ensures your)\b/u,
    ],
  ],
  de: [
    ['heading-hole', /\bWarum Segler zu\s+zurückkehren\b/u],
    ['contact-hole', /\bKontaktieren Sie (?:noch )?heute(?=[,.]| um\b)/u],
    [
      'subject-hole',
      /(?<![\p{L}\p{N}])(?:bei|mit|von|über) (?:weil|denn)(?!\p{L})|\bwarum (?:der|die|das) (?:Ihr|vertrauenswürdig)/u,
    ],
  ],
  fr: [
    ['heading-hole', /\bReviennent [Cc]hez\s*$/u],
    [
      'subject-hole',
      /(?<![\p{L}\p{N}])(?:chez|par|à|de) (?:car|parce|pour)(?!\p{L})|(?<!(?:[Nn]ous|[Vv]ous) )\bchoisissent (?:constamment )?pour\b/u,
    ],
  ],
  nl: [
    ['heading-hole', /\b[Tt]erugkeren [Nn]aar\s*$/u],
    ['subject-hole', /\b(?:bij|met|van) omdat\b|\bwaarom (?:uw|de|het) vertrouwde\b/u],
  ],
  it: [
    ['contact-hole', /\bContatta(?:te)? oggi(?: stesso)?(?=[,.]| per\b)/u],
    [
      'subject-hole',
      /(?<![\p{L}\p{N}])(?:a|con) (?:per|perché)(?!\p{L})|(?<![\p{L}\p{N}])di per (?!sé(?!\p{L}))|(?<!(?:[Cc]i|[Vv]i) )\bscelgono (?:costantemente )?per\b/u,
    ],
  ],
  es: [
    ['heading-hole', /\bPor [Qq]ué (?:[Ee]legir )?[Pp]ara(?!\p{L})/u],
    [
      'subject-hole',
      /(?<![\p{L}\p{N}])(?:con|en) (?:porque|para)(?!\p{L})|\bde porque\b|(?<!(?:[Nn]os|[Ll]os|[Ss]e) )\beligen (?:consistentemente )?para\b/u,
    ],
  ],
  pt: [
    ['heading-hole', /\b[Rr]egressam\s*$/u],
    ['subject-hole', /(?<![\p{L}\p{N}])(?:com|em|na|da|pela) porque(?!\p{L})/u],
  ],
  pl: [
    ['heading-hole', /\bwybierają (?:do|dla)(?!\p{L})/u],
    [
      'subject-hole',
      /(?<![\p{L}\p{N}])(?:z|u|przez|w) ponieważ(?!\p{L})|(?<![\p{L}\p{N}])dlaczego jest (?:Twoim|zaufan)/u,
    ],
  ],
  hr: [
    ['heading-hole', /\bZašto se ističe(?!\p{L})/u],
    ['subject-hole', /(?<![\p{L}\p{N}])(?:kod|s|sa|od|uz) jer(?!\p{L})|(?<![\p{L}\p{N}])zašto je (?:vaš|Vaš|pouzdan)/u],
  ],
};

// A preposition with nothing after it but punctuation, per locale (French
// spaces ":" and ";" by typography, so only "." and "," there).
const PREP_HOLE = {
  en: 'by|with|at|through|via|from|to|for|on|of|about',
  de: 'von|vom|bei|beim|mit|für|zu|über|durch',
  fr: 'par|chez|avec|de|du|à|pour|sur|via',
  it: 'da|di|con|presso|su|per|tramite|attraverso',
  es: 'por|con|de|en|para|mediante',
  pt: 'por|pela|pelo|com|de|da|do|em|na|no|para',
  nl: 'door|bij|met|van|voor|op|via|naar',
  pl: 'przez|z|ze|w|we|u|od|dla|do|na',
  hr: 'od|s|sa|kod|preko|putem|za|u|na|iz|uz',
};
const prepHole = locale =>
  PREP_HOLE[locale]
    ? new RegExp(
        `(?<![\\p{L}\\p{N}_’'-])(?:${PREP_HOLE[locale]})\\s+${locale === 'fr' ? '[.,]' : '[.,;:]'}(?=\\s|$)`,
        'iu'
      )
    : null;

// "'s" with no word before it (a deleted "Boat4You"), and "Boat4You 's".
const BRAND_S = /(?<![\p{L}\p{N}_’'])['’]s\s+(?=[\p{L}\p{N}])|Boat4You\s+['’]s(?!\p{L})/gu;
// Dutch adverbial genitives that legitimately start with "'s".
const NL_S_OK =
  /^['’]s\s+(?:avonds|ochtends|morgens|middags|nachts|winters|zomers|werelds|lands|late|mensen|jaars|konings|rijks)(?!\p{L})/iu;
const brandS = (locale, text) =>
  Array.from(text.matchAll(BRAND_S)).find(m => !(locale === 'nl' && NL_S_OK.test(text.slice(m.index))));

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

/** Block text with the tags removed WITHOUT a space ("an</a>." → "an."). */
const tight = html =>
  decode(html.replace(/<[^>]+>/g, ''))
    .replace(/\s+/g, ' ')
    .trim();

const findings = [];

const STAGED = process.argv.includes('--staged');

/** The staged copy when checking a commit, otherwise the working tree. */
const source = (locale, name) =>
  STAGED
    ? execFileSync('git', ['show', `:public/seo-content/${locale}/${name}`], {
        cwd: REPO,
        encoding: 'utf8',
        maxBuffer: 64 * 1024 * 1024,
      })
    : readFileSync(path.join(ROOT, locale, name), 'utf8');

/** [locale, file name] of every corpus page, or only the staged ones. */
const targets = () => {
  if (STAGED) {
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
  const prep = prepHole(locale);
  const src = source(locale, name);
  // What the landing renders: from <body> to the FIRST </body>
  // (sanitizeCuratedHtml drops anything after it).
  const bodyStart = src.search(/<body\b[^>]*>/);
  const fromBody = bodyStart >= 0 ? src.slice(bodyStart) : src;
  const bodyEnd = fromBody.search(/<\/body>/i);
  const body = bodyEnd >= 0 ? fromBody.slice(0, bodyEnd) : fromBody;

  Array.from(body.matchAll(BLOCK), match => match[2]).forEach(inner => {
    const text = plain(inner);

    rules.forEach(([id, rx]) => {
      const hit = rx.exec(text);

      if (hit) {
        findings.push(
          `${id.padEnd(15)} ${locale}/${name}: …${text.slice(Math.max(0, hit.index - 60), hit.index + 80)}…`
        );
      }
    });

    const flat = prep ? tight(inner) : '';
    const hole = prep?.exec(flat);

    if (hole) {
      findings.push(
        `${'prep-hole'.padEnd(15)} ${locale}/${name}: …${flat.slice(Math.max(0, hole.index - 60), hole.index + 80)}…`
      );
    }

    const tightText = tight(inner);
    const possessive = brandS(locale, tightText);

    if (possessive) {
      findings.push(
        `${'brand-s'.padEnd(15)} ${locale}/${name}: …${tightText.slice(Math.max(0, possessive.index - 60), possessive.index + 80)}…`
      );
    }
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
