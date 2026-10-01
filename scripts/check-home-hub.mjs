#!/usr/bin/env node
/**
 * Home link hub messages check — `yarn check:home-hub`.
 *
 * For every locale directory in messages/ (homeHub.json must exist in each):
 *   1. the same keys as messages/en/homeHub.json, every value a non-empty
 *      string (en itself must name every tab key and link id of
 *      src/config/homeHub.config.ts, and no link the config does not have);
 *   2. link anchors unique within the locale;
 *   3. keyword ownership (hard rule): no string — anchor, heading, tab — names
 *      a sister site's head term or a direct translation of it:
 *        "catamaran charter (in) Croatia / Greece / Italy / the Caribbean /
 *         the BVI" (+ Bahamas, Grenada, Martinique — Caribbean sister turf)
 *        "yacht charter (in) Croatia / Greece / Italy / Spain / Türkiye"
 *      in any word order, up to three words apart. "Yacht charter Split" is
 *      ours. The sister sites' own ES/FR/IT/PT translations of their head
 *      terms are rental nouns, so those count too: "Alquiler de catamaranes
 *      en Croacia", "Location de catamaran en Croatie", "Noleggio catamarani
 *      Croazia", "Aluguer de catamarã na Croácia"; other rental phrasing
 *      stays allowed ("Catamaran rental in Croatia", "Catamaranes de
 *      alquiler en Croacia", "Affitto catamarani in Croazia"). For yachts
 *      the rental word that translates "yacht charter" (alquiler de yates,
 *      location de yacht, noleggio yacht, najam jahti, aluguer de iates,
 *      wynajem jachtów, jachtverhuur) counts as the head term.
 *   4. the same keyword rule for the landing heading overrides
 *      (landing.json `override`: h1 + meta description), which rename the
 *      landings whose default heading would be a sister's head term.
 * The patterns run a self-test first (known bad / known good strings).
 *
 * The config is read by transpiling the .ts file with TypeScript (it holds
 * type-only imports, so it evaluates on its own).
 */
import { existsSync, readFileSync, readdirSync, statSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import ts from 'typescript';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const CONFIG_FILE = path.join(ROOT, 'src/config/homeHub.config.ts');
const MESSAGES_DIR = path.join(ROOT, 'messages');
const FILE_NAME = 'homeHub.json';
const DEFAULT_LOCALE = 'en';

// ---------------------------------------------------------------------------
// Forbidden head terms
// ---------------------------------------------------------------------------

/** Lower case, no diacritics, words separated by single spaces. */
const normalize = text =>
  text
    .toLowerCase()
    .replace(/đ/g, 'd')
    .replace(/ł/g, 'l')
    .replace(/ß/g, 'ss')
    .normalize('NFD')
    .replace(/\p{M}/gu, '')
    .replace(/[^a-z0-9]+/g, ' ')
    .trim();

const CHARTER = '(?:charter|carter|czarter)[a-z]*'; // charter, čarter, czarter
const CATAMARAN = '[ck]atamara[a-z]*'; // catamaran(s), katamaran(a), catamarã
const YACHT = '(?:yacht|yate|jacht|jaht|iate)[a-z]*'; // yacht, yate, jacht, jahta, iate
const WORDS = n => `(?: [a-z0-9]+){0,${n}}`;

// The sister sites' ES/FR/IT/PT head nouns ("Alquiler de catamaranes", "Location catamaran").
const CATAMARAN_RENTAL = '(?:alquiler|location|noleggio|aluguer|aluguel|fretamento)';

const CATAMARAN_TERMS = [
  `${CATAMARAN} ?${CHARTER}`,
  `${CHARTER}${WORDS(2)} ${CATAMARAN}`,
  `${CATAMARAN_RENTAL}${WORDS(2)} ${CATAMARAN}`,
];

const YACHT_TERMS = [
  `${YACHT} ?${CHARTER}`,
  `${CHARTER}${WORDS(2)} ${YACHT}`,
  `alquiler${WORDS(2)} yates?`,
  `location${WORDS(2)} yachts?`,
  `noleggio${WORDS(2)} yachts?`,
  `najam${WORDS(2)} jaht[a-z]*`,
  `alug[a-z]*${WORDS(2)} iates?`,
  `fretamento${WORDS(2)} iates?`,
  `wynajem${WORDS(2)} jacht[a-z]*`,
  'jachtverhuur',
  'yachtvermietung',
];

// Place stems (normalized, matched at a word start): en, de, es, fr, hr, it, nl, pl, pt.
const CROATIA = ['croatia', 'kroatie', 'croacia', 'croatie', 'croazia', 'hrvatsk', 'chorwacj'];
const GREECE = ['greece', 'griechenland', 'grecia', 'grece', 'grck', 'griekenland', 'grecj'];
const ITALY = ['italy', 'italien', 'italia', 'italie', 'italij', 'wloch', 'wlosz'];
const SPAIN = ['spain', 'spanien', 'espana', 'espagne', 'spagna', 'spanje', 'hiszpan', 'espanha', 'spanjolsk'];
const TURKEY = ['turkey', 'turkiye', 'turkei', 'turquia', 'turquie', 'turchia', 'turkije', 'turcj', 'tursk'];
const CARIBBEAN = [
  'caribbean',
  'karibik',
  'karib',
  'caribe',
  'caraibe',
  'caraibi',
  'caraiba',
  'caribisch',
  'caraibisch',
  'karaib',
  'bvi',
  'british virgin',
  'virgin island',
  'jungferninsel',
  'islas virgenes',
  'iles vierges',
  'isole vergini',
  'ilhas virgens',
  'maagdeneiland',
  'djevicansk',
  'wysp[a-z]* dziewicz',
  'bahama',
  'grenad',
  'granada',
  'martini',
];

const near = (terms, places) => {
  const term = `(?:${terms.join('|')})`;
  const place = `(?:${places.join('|')})[a-z]*`;

  return [new RegExp(`(?:^| )${term}${WORDS(3)} ${place}`), new RegExp(`(?:^| )${place}${WORDS(3)} ${term}`)];
};

const FORBIDDEN = [
  {
    label: 'catamaran charter + Croatia/Greece/Italy/Caribbean',
    patterns: near(CATAMARAN_TERMS, [...CROATIA, ...GREECE, ...ITALY, ...CARIBBEAN]),
  },
  {
    label: 'yacht charter + Croatia/Greece/Italy/Spain/Türkiye',
    patterns: near(YACHT_TERMS, [...CROATIA, ...GREECE, ...ITALY, ...SPAIN, ...TURKEY]),
  },
];

/** Labels of the forbidden head terms `text` contains (empty → clean). */
const forbiddenIn = text => {
  const normalized = normalize(text);

  return FORBIDDEN.filter(rule => rule.patterns.some(p => p.test(normalized))).map(rule => rule.label);
};

const MUST_FAIL = [
  'Catamaran charter Croatia',
  'Catamaran Charter in Croatia',
  'Croatia catamaran charter',
  'Catamaran charters in Greece',
  'Catamaran charter in the British Virgin Islands',
  'BVI catamaran charter',
  'Catamaran charter Caribbean',
  'Yacht charter Croatia',
  'Yacht charter in Greece',
  'Sailing yacht charter in Italy',
  'Yacht charter in Spain',
  'Yacht charter Türkiye',
  'Turkey yacht charter',
  'Yacht charter Split, Croatia',
  'Katamaran-Charter Kroatien',
  'Katamarancharter in Griechenland',
  'Yachtcharter Kroatien',
  'Yacht-Charter in der Türkei',
  'Čarter katamarana u Hrvatskoj',
  'Najam jahti u Hrvatskoj',
  'Čarter jahti u Grčkoj',
  'Chárter de catamaranes en Croacia',
  'Alquiler de yates en Grecia',
  'Charter de catamarans en Croatie',
  'Location de yachts en Croatie',
  'Charter catamarano in Croazia',
  'Noleggio yacht in Italia',
  'Catamarancharter Kroatië',
  'Jachtcharter Griekenland',
  'Czarter katamaranów w Chorwacji',
  'Czarter jachtów we Włoszech',
  'Aluguer de iates na Croácia',
  'Charter de catamarã na Grécia',
  'Alquiler de catamaranes en Croacia',
  'Location de catamaran en Croatie',
  'Location Catamaran Grèce',
  'Noleggio catamarani Croazia',
  'Noleggio catamarano in Croazia',
  'Aluguer de Catamarã na Croácia',
  'Location de catamaran aux Îles Vierges britanniques',
];

const MUST_PASS = [
  'Yacht charter Split',
  'Catamaran rental in Croatia',
  'Catamaran hire in Greece',
  'Rent a catamaran in Italy',
  'BVI catamaran rental',
  'Sailboat charter in Croatia',
  'Motor yachts in Croatia',
  'Croatia charter prices by month',
  'Turkish gulet cruises',
  'Charter a Bavaria Cruiser 46',
  'Affitto catamarani in Croazia',
  'Catamarani a noleggio in Italia',
  'Najam katamarana u Hrvatskoj',
  'Najam jahti Split',
  'Motoryachten in Kroatien',
  'Segelboot-Charter in Kroatien',
  'Katamaran mieten in Kroatien',
  'Catamaranes de alquiler en Croacia',
  'Louer un catamaran en Croatie',
  'Catamarãs para alugar na Croácia',
  'Explore boat rental destinations',
];

const selfTest = () => {
  const errors = [
    ...MUST_FAIL.filter(s => !forbiddenIn(s).length).map(s => `not caught: "${s}"`),
    ...MUST_PASS.filter(s => forbiddenIn(s).length).map(s => `false positive: "${s}"`),
  ];

  return errors;
};

// ---------------------------------------------------------------------------
// Messages
// ---------------------------------------------------------------------------

const loadConfig = async () => {
  const { outputText } = ts.transpileModule(readFileSync(CONFIG_FILE, 'utf8'), {
    compilerOptions: { module: ts.ModuleKind.ESNext, target: ts.ScriptTarget.ES2020 },
  });

  return import(`data:text/javascript;base64,${Buffer.from(outputText).toString('base64')}`);
};

/** [dotted key, value] for every leaf. */
const leaves = (value, prefix = '') =>
  value && typeof value === 'object' && !Array.isArray(value)
    ? Object.entries(value).flatMap(([k, v]) => leaves(v, prefix ? `${prefix}.${k}` : k))
    : [[prefix, value]];

const checkLocale = (messages, en) => {
  const errors = [];
  const own = new Map(leaves(messages));
  const enKeys = leaves(en).map(([key]) => key);

  enKeys.forEach(key => {
    const value = own.get(key);

    if (typeof value !== 'string' || !value.trim()) errors.push(`missing or empty: ${key}`);
  });
  own.forEach((_, key) => {
    if (!enKeys.includes(key)) errors.push(`key not in en: ${key}`);
  });

  const seen = new Map();

  Object.entries(messages.links ?? {}).forEach(([id, anchor]) => {
    if (typeof anchor !== 'string') return;

    const key = anchor.trim().toLowerCase();

    if (seen.has(key)) errors.push(`duplicate anchor "${anchor}": links.${seen.get(key)} and links.${id}`);
    else seen.set(key, id);
  });

  own.forEach((value, key) => {
    if (typeof value !== 'string') return;

    forbiddenIn(value).forEach(label => errors.push(`forbidden head term (${label}) in ${key}: "${value}"`));
  });

  return errors;
};

const main = async () => {
  const failures = [];
  const testErrors = selfTest();

  if (testErrors.length) failures.push(['pattern self-test', testErrors]);

  const { HOME_HUB_TABS: tabs } = await loadConfig();
  const ids = tabs.flatMap(tab => tab.links.map(link => link.id));
  const configErrors = [
    ...ids.filter((id, i) => ids.indexOf(id) !== i).map(id => `duplicate link id: ${id}`),
    ...tabs
      .map(tab => tab.key)
      .filter((key, i, keys) => keys.indexOf(key) !== i)
      .map(key => `duplicate tab key: ${key}`),
  ];

  const enFile = path.join(MESSAGES_DIR, DEFAULT_LOCALE, FILE_NAME);
  const en = JSON.parse(readFileSync(enFile, 'utf8'));

  tabs
    .filter(tab => !en.tabs?.[tab.key])
    .forEach(tab => configErrors.push(`tab without a label in en: tabs.${tab.key}`));
  ids.filter(id => !en.links?.[id]).forEach(id => configErrors.push(`link without an anchor in en: links.${id}`));
  Object.keys(en.links ?? {})
    .filter(id => !ids.includes(id))
    .forEach(id => configErrors.push(`anchor without a link in homeHub.config.ts: links.${id}`));

  if (configErrors.length) failures.push(['src/config/homeHub.config.ts', configErrors]);

  const locales = readdirSync(MESSAGES_DIR)
    .filter(name => statSync(path.join(MESSAGES_DIR, name)).isDirectory())
    .sort();

  locales.forEach(locale => {
    const file = path.join(MESSAGES_DIR, locale, FILE_NAME);

    if (!existsSync(file)) {
      failures.push([`messages/${locale}/${FILE_NAME}`, ['file missing']]);

      return;
    }

    let messages;

    try {
      messages = JSON.parse(readFileSync(file, 'utf8'));
    } catch (error) {
      failures.push([`messages/${locale}/${FILE_NAME}`, [`unreadable JSON: ${error.message}`]]);

      return;
    }

    const errors = checkLocale(messages, en);

    if (errors.length) failures.push([`messages/${locale}/${FILE_NAME}`, errors]);
  });

  // Landing heading overrides (landing.json `override`) — headings too.
  locales.forEach(locale => {
    const file = path.join(MESSAGES_DIR, locale, 'landing.json');

    if (!existsSync(file)) return;

    const overrides = JSON.parse(readFileSync(file, 'utf8')).override ?? {};
    const errors = leaves(overrides).flatMap(([key, value]) =>
      typeof value === 'string'
        ? forbiddenIn(value).map(label => `forbidden head term (${label}) in override.${key}: "${value}"`)
        : []
    );

    if (errors.length) failures.push([`messages/${locale}/landing.json`, errors]);
  });

  if (failures.length) {
    failures.forEach(([where, errors]) => {
      console.error(`✗ ${where}`);
      errors.forEach(error => console.error(`    ${error}`));
    });
    process.exit(1);
  }

  console.log(
    `✓ home hub: ${tabs.length} tabs, ${ids.length} links, ${locales.length} locales (${locales.join(', ')}) — complete, unique, no sister head terms (anchors + landing overrides)`
  );
};

main().catch(error => {
  console.error(error);
  process.exit(1);
});
