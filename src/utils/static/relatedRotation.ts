/**
 * Which similar boats a boat page links (7.10.2026). The block used to take
 * the closest lengths from the first 12 boats of the marina's listing, so
 * every boat at a marina linked the same three top boats and the rest of the
 * marina's fleet got no internal link at all (SEO audit 7.10.2026, 4a).
 *
 * Now the candidates that pass the page's relevance rules (same marina, same
 * type first, ±5 ft — RelatedBoats) sit on a ring together with the current
 * boat, ordered by a fixed per-boat hash (`ringKey`), and the page links the
 * boats that follow it on the ring, wrapping around. In a group whose boats
 * all see the same candidates, every boat is linked by exactly the `count`
 * boats before it — no boat is left out. (A first version ranked the
 * candidates by a hash seeded with the current boat — rendezvous hashing —
 * which left about e^-3 ≈ 5 % of every group unlinked: review 7.10.2026,
 * 4 of the 80 Sukošan catamarans.) Where the ±5 ft windows differ per boat,
 * a boat can still miss out, but rarely (1 of those 80).
 *
 * The choice is deterministic — the same page links the same boats on every
 * request and build, no Math.random — and independent of the order the API
 * returns the pool in. A boat that leaves or joins the pool only changes the
 * pages just before it on the ring.
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

/** A 32-bit hash of `id` under `seed` (unsigned). */
export const rotationScore = (seed: number, id: number): number =>
  mix32(mix32(seed) ^ Math.imul(id | 0, 0x9e3779b1));

/* eslint-enable no-bitwise */

/** Fixed salt of the ring: changing it reshuffles every page's similar boats at once. */
const RING_SALT = 7_102_026;

/** A boat's place on the ring — the same on every page. */
export const ringKey = (id: number): number => rotationScore(RING_SALT, id);

/**
 * The `count` candidates the page of boat `seedId` links: lower `tier` first
 * (e.g. a dated page's exact-period matches), then the boats that follow
 * `seedId` on the ring (ringKey, then id), wrapping around. Never the boat
 * itself, never a boat twice.
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
  const seedKey = ringKey(seedId);

  return unique
    .map(candidate => {
      const key = ringKey(candidate.id);

      return {
        candidate,
        tier: tier(candidate),
        // 0 = after the current boat on the ring, 1 = wrapped around past the end.
        lap: key > seedKey || (key === seedKey && candidate.id > seedId) ? 0 : 1,
        key,
      };
    })
    .sort((a, b) => a.tier - b.tier || a.lap - b.lap || a.key - b.key || a.candidate.id - b.candidate.id)
    .slice(0, Math.max(0, count))
    .map(({ candidate }) => candidate);
};
