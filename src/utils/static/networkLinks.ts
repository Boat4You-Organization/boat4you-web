/**
 * Links between the Boat4You Group sites (Mario 28.10.2026): every link from
 * one sister site to another carries rel="nofollow" — a test of whether the
 * site-wide network links (footer rows, boat4you booking buttons, in-content
 * interlinks) are holding the sites' rankings back. Hardcoded links in the
 * code use NETWORK_REL; WordPress content (blog bodies, destination texts)
 * goes through nofollowNetworkLinksDeep in fetchAPI. The current site is read
 * from NEXT_PUBLIC_BASE_URL, so its own absolute links stay followed.
 * Byte-identical on all seven sites (scripts/network-links.test.mjs).
 */
export const NETWORK_HOSTS = [
  'boat4you.com',
  'catamaran-charter-caribbean.com',
  'catamaran-charter-greece.com',
  'catamaran-croatia-charter.com',
  'catamarancharteritaly.com',
  'croatia-yachting.com',
  'europe-yachts.com',
] as const;

/** rel for a link to a sister site, opened in a new tab. */
export const NETWORK_REL = 'nofollow noopener noreferrer';

const bareHost = (url: string): string | null => {
  const match = /^(?:https?:)?\/\/([^/?#:\s]+)/i.exec(url.trim());

  return match ? match[1].toLowerCase().replace(/^www\./, '') : null;
};

const SELF_HOST = bareHost(process.env.NEXT_PUBLIC_BASE_URL ?? '');

/** True for an absolute URL on a sister site (subdomains included), never the current site or its subdomains. */
export const isNetworkHref = (href: string, selfHost: string | null = SELF_HOST): boolean => {
  const host = bareHost(href);

  if (!host || (selfHost && (host === selfHost || host.endsWith(`.${selfHost}`)))) return false;

  return NETWORK_HOSTS.some(domain => host === domain || host.endsWith(`.${domain}`));
};

const A_TAG = /<a\b[^>]*>/gi;
const HREF = /\shref\s*=\s*(["'])(.*?)\1/i;
const REL = /\srel\s*=\s*(["'])(.*?)\1/i;

/** Adds nofollow to every <a> in the HTML that points at a sister site; other links are left as they are. */
export const nofollowNetworkLinks = (html: string, selfHost: string | null = SELF_HOST): string => {
  if (!html.includes('<a')) return html;

  return html.replace(A_TAG, tag => {
    const href = HREF.exec(tag);

    if (!href || !isNetworkHref(href[2], selfHost)) return tag;

    const rel = REL.exec(tag);

    // A new rel uses the href's quote, so HTML inside a JSON string (JSON-LD) stays valid.
    if (!rel) return tag.replace(/^<a\b/i, `<a rel=${href[1]}nofollow${href[1]}`);

    const tokens = rel[2].split(/\s+/).filter(token => token && !/^(?:do)?follow$/i.test(token));

    if (tokens.some(token => token.toLowerCase() === 'nofollow')) return tag;

    return tag.replace(rel[0], ` rel=${rel[1]}${['nofollow', ...tokens].join(' ')}${rel[1]}`);
  });
};

/** nofollowNetworkLinks on every string inside a parsed API response (objects and arrays, recursively). */
export const nofollowNetworkLinksDeep = <T>(value: T, selfHost: string | null = SELF_HOST): T => {
  if (typeof value === 'string') return nofollowNetworkLinks(value, selfHost) as T;

  if (Array.isArray(value)) return value.map(item => nofollowNetworkLinksDeep(item, selfHost)) as T;

  if (value && typeof value === 'object') {
    return Object.fromEntries(
      Object.entries(value).map(([key, item]) => [key, nofollowNetworkLinksDeep(item, selfHost)])
    ) as T;
  }

  return value;
};
