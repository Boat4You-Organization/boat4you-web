/**
 * The old URLs of retired boats that now answer 308 to their successor, for a
 * one-off IndexNow submission (owner decision 7.10.2026).
 *
 * A retired boat (yacht.sys_active = false) whose same physical boat is live
 * under a new id answers 308 to that boat (backend V9_73 yacht_successor +
 * the boat page). Retired boats are in no sitemap, so the sitemap-diff
 * IndexNow run never names their old URLs. This script builds them from the
 * read-only successor export (DEPLOY_NOTES, 2026-10-07), in every locale,
 * keeps only those that answer 308 with Location = the successor's URL in the
 * same locale, and writes them for
 *
 *   python3 infra/deploy-scripts/indexnow_submit.py --site boat4you --urls-file <out>
 *
 * which checks the key file first and posts in batches of at most 10,000.
 *
 * Input (--in): JSON lines, one per retired boat:
 *   {"oldId":4066,"oldManufacturer":"…","oldModel":"…","oldName":"…",
 *    "newId":11681,"newManufacturer":"…","newModel":"…","newName":"…"}
 * Slugs are built like the backend's SlugUtils.toSlugWithId (the slug the
 * list API, the sitemaps and the page links use); locales and the default
 * locale come from src/i18n/routing.ts.
 *
 *   node scripts/indexnow-successor-urls.mjs --in successors.jsonl --dry-run
 *   node scripts/indexnow-successor-urls.mjs --in successors.jsonl --out successor-urls.txt [--limit N]
 *
 * Every URL is requested once, without following the redirect, at most one
 * request start per --interval seconds (default and minimum 1: 2,768 boats x
 * 9 locales is about 7 hours). Each answer is appended to --log (default
 * <out>.checks.tsv); a re-run skips the URLs already confirmed there, so an
 * interrupted run resumes; a dropped URL (404, 429, timeout, other Location)
 * is asked again. Delete the log to start over. When none of the first 50
 * answers is the expected 308 the run stops: the backend (V9_73) or this page
 * is not live yet.
 *
 * Exit: 0 every URL confirmed, 1 some URLs dropped, 2 failure, 3 usage error.
 */
import { appendFileSync, existsSync, readFileSync, renameSync, writeFileSync } from 'node:fs';
import { pathToFileURL } from 'node:url';

import './tsLoader.mjs';

const { routing } = await import('@/i18n/routing');
const { successorBoatPath } = await import('@/utils/static/yachtSuccessor');

const UA = 'boat4you-indexnow/1.0';
const DEFAULT_BASE = 'https://www.boat4you.com';
const GIVE_UP_AFTER = 50;

// ------------------------------------------------------------------ slugs
// A port of the backend's SlugUtils (Kotlin on the JVM), checked against the
// compiled class (build of c456008) on 120,000 generated names: 0 differences.

/** Kotlin's Char.isWhitespace on the JVM: U+001C–U+001F and every space separator yes, U+FEFF no (unlike JS trim). */
const KT_SPACE = '\\t\\n\\x0B\\f\\r\\x1C-\\x1F\\p{Zs}\\u2028\\u2029';
const KT_TRIM = new RegExp(`^[${KT_SPACE}]+|[${KT_SPACE}]+$`, 'gu');
const KT_BLANK = new RegExp(`^[${KT_SPACE}]*$`, 'u');

/** Java's `\s` (no UNICODE_CHARACTER_CLASS) is ASCII only: a no-break space is dropped, not made a hyphen. */
const NOT_SLUG_CHAR = /[^a-z0-9 \t\n\x0B\f\r-]/g;
const JAVA_SPACES = /[ \t\n\x0B\f\r]+/g;

const ktTrim = value => value.replace(KT_TRIM, '');
const isBlank = value => KT_BLANK.test(value);

/**
 * One char's simple case mapping, as Java's Character.toUpperCase / toLowerCase: never a longer string (ß stays ß),
 * and the one unconditional lower-case expansion, İ -> i + U+0307, is plain i.
 */
const simple = (char, mapped) => (mapped.length === 1 ? mapped : char);
const upper = char => simple(char, char.toUpperCase());
const lower = char => (char === '\u0130' ? 'i' : simple(char, char.toLowerCase()));

/** Kotlin `a.equals(b, ignoreCase = true)` on the JVM: same length, then UTF-16 unit by unit. */
const equalsIgnoreCase = (a, b) => {
  if (a.length !== b.length) return false;

  for (let i = 0; i < a.length; i += 1) {
    const ux = upper(a[i]);
    const uy = upper(b[i]);

    if (a[i] !== b[i] && ux !== uy && lower(ux) !== lower(uy)) return false;
  }

  return true;
};

/** SlugUtils.toSlug. */
export const toSlug = input =>
  ktTrim(String(input).toLowerCase().replace(NOT_SLUG_CHAR, '')).replace(JAVA_SPACES, '-').replace(/-+/g, '-');

/**
 * SlugUtils.toSlugWithId: manufacturer, model and boat name, without the
 * manufacturer when the model already starts with it ("Lagoon" + "Lagoon 42"),
 * then "-<id>"; just the id when all three are blank.
 */
export const toSlugWithId = (manufacturerName, modelName, yachtName, yachtId) => {
  const manufacturer = ktTrim(manufacturerName ?? '');
  const model = ktTrim(modelName ?? '');
  const modelHasManufacturer =
    (!isBlank(manufacturer) && model.toLowerCase().startsWith(`${manufacturer.toLowerCase()} `)) ||
    equalsIgnoreCase(model, manufacturer);
  const parts = [modelHasManufacturer ? null : manufacturerName, modelName, yachtName].filter(
    part => part != null && !isBlank(part)
  );
  const slugPart = parts.length > 0 ? toSlug(parts.join('-')) : '';

  return slugPart ? `${slugPart}-${yachtId}` : String(yachtId);
};

// ------------------------------------------------------------------ input

const isId = value => Number.isSafeInteger(value) && value > 0;

/** The export's JSON lines -> { rows, rejected } (a rejected line is counted, never guessed). */
export const parseRows = text => {
  const rows = [];
  let rejected = 0;

  text.split('\n').forEach(line => {
    if (line.trim() === '') return;

    let row = null;

    try {
      row = JSON.parse(line);
    } catch {
      row = null;
    }

    if (!row || !isId(row.oldId) || !isId(row.newId) || row.oldId === row.newId) {
      rejected += 1;

      return;
    }

    rows.push(row);
  });

  return { rows, rejected };
};

/** One retired boat -> its old URL and the expected Location in every locale (paths, no query). */
export const expandRow = (row, locales = routing.locales, defaultLocale = routing.defaultLocale) => {
  const oldSlug = toSlugWithId(row.oldManufacturer, row.oldModel, row.oldName, row.oldId);
  const newSlug = toSlugWithId(row.newManufacturer, row.newModel, row.newName, row.newId);

  return locales.map(locale => ({
    path: successorBoatPath(oldSlug, locale, defaultLocale),
    expected: successorBoatPath(newSlug, locale, defaultLocale),
  }));
};

/** Only a 308 whose Location (relative or absolute) is exactly the expected URL: same host, locale, slug, no query. */
export const isConfirmed = (status, location, url, expectedUrl) => {
  if (status !== 308 || typeof location !== 'string' || location === '') return false;

  try {
    return new URL(location, url).href === expectedUrl;
  } catch {
    return false;
  }
};

// ------------------------------------------------------------------ run

const USAGE =
  'usage: node scripts/indexnow-successor-urls.mjs --in <successors.jsonl> (--dry-run | --out <urls.txt>)' +
  ' [--log <checks.tsv>] [--limit <boats>] [--interval <s, >= 1>] [--base https://www.boat4you.com]\n' +
  'Then: python3 infra/deploy-scripts/indexnow_submit.py --site boat4you --urls-file <urls.txt> (checks the key file).';

const parseArgs = argv => {
  const args = { base: DEFAULT_BASE, interval: 1, dryRun: false };
  const valued = {
    '--in': 'in',
    '--out': 'out',
    '--log': 'log',
    '--limit': 'limit',
    '--interval': 'interval',
    '--base': 'base',
  };

  for (let i = 0; i < argv.length; i += 1) {
    if (argv[i] === '--dry-run') {
      args.dryRun = true;
    } else if (valued[argv[i]] && argv[i + 1] !== undefined) {
      args[valued[argv[i]]] = argv[i + 1];
      i += 1;
    } else {
      return null;
    }
  }

  args.interval = Number(args.interval);
  args.limit = args.limit === undefined ? Infinity : Number(args.limit);
  if (!args.in || (!args.dryRun && !args.out) || !(args.interval >= 1) || !(args.limit > 0)) return null;
  if (!/^https?:\/\/[a-z0-9.-]+(?::\d+)?$/.test(args.base)) return null;
  args.log = args.log ?? (args.out ? `${args.out}.checks.tsv` : undefined);

  return args;
};

/** URLs already confirmed by an earlier run (the log's 4th column is "ok"). */
const confirmedInLog = path => {
  const done = new Set();

  if (!path || !existsSync(path)) return done;

  readFileSync(path, 'utf8')
    .split('\n')
    .forEach(line => {
      const [url, , , verdict] = line.split('\t');

      if (verdict === 'ok') done.add(url);
    });

  return done;
};

const clean = value => String(value ?? '').replace(/[\t\r\n]/g, ' ');

/**
 * Runs the whole job; `deps` lets the tests replace the network and the clock.
 * -> exit code (see the header).
 */
export const main = async (argv, deps = {}) => {
  const { fetchFn = globalThis.fetch, sleep = ms => new Promise(r => setTimeout(r, ms)), now = Date.now } = deps;
  const out = deps.out ?? (line => console.log(line));
  const args = parseArgs(argv);

  if (!args) {
    out(USAGE);

    return 3;
  }

  let text;

  try {
    text = readFileSync(args.in, 'utf8');
  } catch (error) {
    out(`FAIL cannot read ${args.in}: ${error.message}`);

    return 2;
  }

  const { rows, rejected } = parseRows(text);
  const boats = rows.slice(0, args.limit);
  const items = boats.flatMap(row =>
    expandRow(row).map(({ path, expected }) => ({ url: `${args.base}${path}`, expected: `${args.base}${expected}` }))
  );

  out(
    `${rows.length} retired boats with a successor, ${rejected} unreadable lines; ${boats.length} boats -> ${items.length} URLs`
  );

  if (args.dryRun) {
    items.slice(0, 18).forEach(({ url, expected }) => out(`  ${url} -> ${expected}`));
    out('dry run: no requests');

    return rejected > 0 ? 1 : 0;
  }

  const done = confirmedInLog(args.log);
  const statuses = {};
  let checked = 0;
  let confirmedNow = 0;
  let last = -Infinity;

  for (const { url, expected } of items) {
    if (done.has(url)) continue;

    const wait = last + args.interval * 1000 - now();

    if (wait > 0) await sleep(wait);
    last = now();

    let status = 0;
    let location = '';

    try {
      const response = await fetchFn(url, {
        redirect: 'manual',
        headers: { 'User-Agent': UA },
        signal: AbortSignal.timeout(30000),
      });

      status = response.status;
      location = response.headers.get('location') ?? '';
      await response.body?.cancel();
    } catch (error) {
      location = `${error.name}: ${error.message}`;
    }

    const ok = isConfirmed(status, location, url, expected);

    appendFileSync(args.log, `${url}\t${status}\t${clean(location)}\t${ok ? 'ok' : 'dropped'}\n`);
    statuses[status] = (statuses[status] ?? 0) + 1;
    checked += 1;
    if (ok) {
      done.add(url);
      confirmedNow += 1;
    }

    if (checked % 500 === 0) out(`  ${checked} checked, ${confirmedNow} confirmed`);

    if (checked === GIVE_UP_AFTER && confirmedNow === 0) {
      out(`FAIL none of the first ${GIVE_UP_AFTER} URLs answers 308 to its successor (${JSON.stringify(statuses)}):`);
      out('     is the backend (V9_73) and this boat page live? Nothing written to the URL file.');

      return 2;
    }
  }

  const confirmed = items.filter(({ url }) => done.has(url)).map(({ url }) => url);
  const tmp = `${args.out}.tmp`;

  writeFileSync(tmp, `${confirmed.join('\n')}${confirmed.length ? '\n' : ''}`);
  renameSync(tmp, args.out);
  out(
    `checked ${checked} now (${JSON.stringify(statuses)}), ${items.length - checked} already confirmed in ${args.log}`
  );
  out(`${confirmed.length} of ${items.length} URLs answer 308 to their successor -> ${args.out}`);

  return confirmed.length === items.length && rejected === 0 ? 0 : 1;
};

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  process.exitCode = await main(process.argv.slice(2));
}
