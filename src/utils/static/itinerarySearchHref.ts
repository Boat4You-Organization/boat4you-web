import { fleetCountForDid } from '@/utils/server/destinationDid';
import { buildDestinationHref, buildSearchLandingPath } from '@/utils/static/searchLandingPath';

/**
 * Build a WORKING /search link for a destination NAME. Itinerary pages
 * know their ports only by name, so we pick the best catalogue location
 * server-side at render (SSG), cached an hour.
 *
 * Candidates are scored by FLEET SIZE, not name order: dual-source
 * locations exist twice in the DB and the namesake city row can hold
 * 3 boats while "Split region" / "Marina Trogir" holds the fleet
 * (Mario 22.7). Names that resolve to fewer than MIN_FLEET boats fall
 * back through the caller-supplied chain (sailing area → country) so
 * the CTA never lands on an empty search.
 *
 * The link is the canonical landing form `/search?destinations=<name>`
 * (no did, 25.9.2026): the search page resolves the catalogue name to its
 * did on the server with the same fleet-size scoring, so the clean,
 * indexable URL filters. Before that the CTA carried `&did=`, which
 * filtered but pointed at a noindexed URL.
 */

interface PublicLocation {
  id: string;
  name?: string;
  locationType?: string;
}

interface PagedLocations {
  content?: PublicLocation[];
}

const MIN_FLEET = 3;
const MAX_SCORED = 8;

const norm = (value?: string) =>
  (value ?? '')
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .trim();

const fetchCandidates = async (query: string): Promise<PublicLocation[]> => {
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_BOAT_WS_API_URL}/public/locations?name=${encodeURIComponent(query)}&size=30`,
    { next: { revalidate: 3600 } }
  );

  if (!response.ok) return [];

  const json: PagedLocations = await response.json();

  return json.content ?? [];
};

const fleetCount = (did: string): Promise<number> => fleetCountForDid(did).catch(() => 0);

export interface ScoredTarget {
  id: string;
  name: string;
  count: number;
}

/**
 * Resolve one name to its best did: query the full name plus its
 * parenthetical variants ("Tortola (Road Town)" → "Tortola", "Road
 * Town"), keep candidates whose name overlaps any variant, score by
 * yacht count, prefer regions on ties.
 */
const GENERIC_WORDS = new Set(['marina', 'port', 'porto', 'yacht', 'haven', 'island', 'saint']);

const bestTargetForName = async (name: string, strict = false): Promise<ScoredTarget | null> => {
  const stripped = name.replace(/\s*\([^)]*\)/g, '').trim();
  const inParens = /\(([^)]+)\)/.exec(name)?.[1]?.trim();
  // Distinctive single words rescue names longer than the DB row
  // ("Biograd na Moru" → "Biograd" finds Marina Kornati's town); the
  // 6-char prefixes survive accent mismatches the API's LIKE can't
  // ("Cassafieres" vs DB "Cassafières"). Fallback names (sailing area,
  // country) stay strict — "French Canals" must not match "French
  // Riviera" via the word "French".
  const words = stripped.split(/[\s,-]+/).filter(w => w.length >= 5 && !GENERIC_WORDS.has(norm(w)));
  const prefixes = words.filter(w => w.length >= 7).map(w => w.slice(0, 6));
  const variants = strict
    ? [name]
    : [...new Set([name, stripped, inParens, ...words, ...prefixes].filter((v): v is string => !!v))];

  // Query the full name first; shorter variants only when it finds nothing.
  const queryFirstNonEmpty = async (index: number): Promise<PublicLocation[]> => {
    if (index >= variants.length) return [];

    const found = await fetchCandidates(variants[index]);

    return found.length > 0 ? found : queryFirstNonEmpty(index + 1);
  };

  const seen = new Map<string, PublicLocation>();

  (await queryFirstNonEmpty(0)).forEach(c => seen.set(c.id, c));

  const eligible = [...seen.values()].filter(c => {
    const cn = norm(c.name);

    return variants.some(v => {
      const vn = norm(v);

      return cn === vn || cn.includes(vn) || vn.includes(cn);
    });
  });

  if (eligible.length === 0) return null;

  const isRegion = (c: PublicLocation) => c.locationType === 'REGION' || c.id.startsWith('r-');
  const scored = await Promise.all(
    eligible
      .sort((a, b) => Number(isRegion(b)) - Number(isRegion(a)))
      .slice(0, MAX_SCORED)
      .map(async c => ({ id: c.id, name: c.name ?? name, count: await fleetCount(c.id) }))
  );

  scored.sort((a, b) => b.count - a.count || Number(b.id.startsWith('r-')) - Number(a.id.startsWith('r-')));

  return scored[0] ?? null;
};

/**
 * The catalogue place an itinerary name stands for: the first name of the
 * chain (port → sailing area → country) whose best match reaches
 * `minFleet` boats, else the first (thin) hit. Null when nothing matches.
 */
export const resolveItineraryTarget = async (
  name: string,
  fallbacks: string[] = [],
  minFleet: number = MIN_FLEET
): Promise<ScoredTarget | null> => {
  const chain = [name, ...fallbacks.filter(Boolean)];

  // Walk the chain until a target reaches the fleet floor; remember the
  // first (thin) hit so we never fall back to an unfiltered search.
  const resolveChain = async (index: number, firstHit: ScoredTarget | null): Promise<ScoredTarget | null> => {
    if (index >= chain.length) return firstHit;

    const best = await bestTargetForName(chain[index], index > 0);

    if (best && best.count >= minFleet) return best;

    return resolveChain(index + 1, firstHit ?? best);
  };

  return resolveChain(0, null);
};

export const resolveBoatsSearchHref = async (name: string, fallbacks: string[] = []): Promise<string> => {
  const plain = buildSearchLandingPath(name);

  try {
    const target = await resolveItineraryTarget(name, fallbacks);

    if (!target) return plain;

    return buildDestinationHref(target.name, target.id);
  } catch {
    return plain;
  }
};
