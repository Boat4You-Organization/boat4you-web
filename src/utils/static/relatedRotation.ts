/**
 * Which similar boats a boat page links (7.10.2026). The block used to take
 * the closest lengths from the first 12 boats of the marina's listing, so
 * every boat at a marina linked the same three top boats and the rest of the
 * marina's fleet got no internal link at all (SEO audit 7.10.2026, 4a).
 *
 * Now every candidate that passes the page's relevance rules (same marina,
 * same type first, ±5 ft — RelatedBoats) gets a score seeded by the CURRENT
 * boat's id, and the page links the highest scores (rendezvous hashing). The
 * choice is deterministic — the same page links the same boats on every
 * request and build, no Math.random — independent of the order the API
 * returns the pool in, and spread evenly: across the fleet each candidate is
 * linked from about `count / pool size` of its neighbours' pages. A boat that
 * leaves or joins the pool only changes the pages that pick it.
 */

/* eslint-disable no-bitwise -- a 32-bit integer hash: bit operations are the point */

/** 32-bit avalanche mix (the murmur3 finaliser). */
const mix32 = (value: number): number => {
  let h = value | 0;

  h ^= h >>> 16;
  h = Math.imul(h, 0x85ebca6b);
  h ^= h >>> 13;
  h = Math.imul(h, 0xc2b2ae35);
  h ^= h >>> 16;

  return h >>> 0;
};

/** The score of `candidateId` on the page of boat `seedId` (unsigned 32-bit). */
export const rotationScore = (seedId: number, candidateId: number): number =>
  mix32(mix32(seedId) ^ Math.imul(candidateId | 0, 0x9e3779b1));

/* eslint-enable no-bitwise */

/**
 * The `count` candidates the page of boat `seedId` links: lower `tier` first
 * (e.g. a dated page's exact-period matches), then the highest rotation
 * score, then the lower id. Never the boat itself, never a boat twice.
 */
export const rotateCandidates = <T extends { id: number }>(
  candidates: readonly T[],
  seedId: number,
  count: number,
  tier: (candidate: T) => number = () => 0
): T[] => {
  const seen = new Set<number>([seedId]);
  const unique = candidates.filter(candidate => {
    if (seen.has(candidate.id)) return false;

    seen.add(candidate.id);

    return true;
  });

  return unique
    .map(candidate => ({ candidate, tier: tier(candidate), score: rotationScore(seedId, candidate.id) }))
    .sort((a, b) => a.tier - b.tier || b.score - a.score || a.candidate.id - b.candidate.id)
    .slice(0, Math.max(0, count))
    .map(({ candidate }) => candidate);
};
