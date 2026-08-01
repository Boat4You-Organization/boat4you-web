/**
 * RankMath's `getHead` hands back an HTML-encoded <head>, so everything we
 * scrape out of it still carries entities ("Boka Bay &amp; Budva",
 * "what&#039;s", "T&uuml;rkiye"). Next escapes whatever we put into metadata,
 * so an undecoded "&" gets encoded a second time and the browser tab / SERP
 * snippet renders the literal "&amp;".
 *
 * Decoding runs in a SINGLE pass — never repeat until stable, or an author's
 * deliberately written "&amp;amp;" would collapse to "&" and corrupt real
 * content. Entities we don't recognise are returned untouched.
 */
const NAMED_ENTITIES: Record<string, string> = {
  amp: '&',
  lt: '<',
  gt: '>',
  quot: '"',
  apos: "'",
  nbsp: ' ',
  ndash: '–',
  mdash: '—',
  hellip: '…',
  lsquo: '‘',
  rsquo: '’',
  ldquo: '“',
  rdquo: '”',
  szlig: 'ß',
  aelig: 'æ',
  AElig: 'Æ',
  oslash: 'ø',
  Oslash: 'Ø',
  eth: 'ð',
  ETH: 'Ð',
  thorn: 'þ',
  THORN: 'Þ',
};

// The accented letters RankMath actually emits ("&uuml;", "&ouml;", "&eacute;",
// "&ccedil;", "&ntilde;", …) are all "letter + accent name", so compose them
// from a combining mark instead of spelling out sixty rows.
const ACCENT_MARKS: Record<string, number> = {
  grave: 0x300,
  acute: 0x301,
  circ: 0x302,
  tilde: 0x303,
  uml: 0x308,
  ring: 0x30a,
  cedil: 0x327,
};

const ENTITY_RE = /&(#\d+|#x[\da-f]+|[a-z][\da-z]*);/gi;
const ACCENTED_LETTER_RE = /^([a-z])([a-z]+)$/i;

const decodeNumeric = (entity: string): string | null => {
  const code = entity[1] === 'x' || entity[1] === 'X' ? parseInt(entity.slice(2), 16) : parseInt(entity.slice(1), 10);

  return code > 0 && code <= 0x10ffff ? String.fromCodePoint(code) : null;
};

// Own-key lookups only — a bare index reaches Object.prototype, so `&toString;`
// would splice a native function's source into the metadata.
const decodeNamed = (entity: string): string | null => {
  if (Object.hasOwn(NAMED_ENTITIES, entity)) {
    return NAMED_ENTITIES[entity];
  }

  const accented = ACCENTED_LETTER_RE.exec(entity);

  if (!accented) {
    return null;
  }

  const markName = accented[2].toLowerCase();
  const mark = Object.hasOwn(ACCENT_MARKS, markName) ? ACCENT_MARKS[markName] : undefined;

  return mark ? (accented[1] + String.fromCharCode(mark)).normalize('NFC') : null;
};

export const decodeHtmlEntities = (value: string): string =>
  value.replace(ENTITY_RE, (match, entity: string) => {
    const decoded = entity.startsWith('#') ? decodeNumeric(entity) : decodeNamed(entity);

    return decoded ?? match;
  });
