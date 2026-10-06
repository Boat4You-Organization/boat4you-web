import type { CapacityFacts } from '@/utils/static/yachtCapacity';

/** One sentence of the accommodation paragraph: a `yacht.*` message key and its numbers. */
export interface ProsePart {
  key: string;
  values: Record<string, number>;
}

/**
 * Berths "for guests" for a sentence: only when the partner's own split
 * leaves berths to the crew (Dione II "13 (12 pax + 1 Crew)" → 12), else 0
 * (the ICU `=0 {}` branch leaves the clause out).
 */
export const shownGuestBerths = ({ berths, guestBerths }: CapacityFacts): number =>
  guestBerths !== null && berths !== null && guestBerths < berths ? guestBerths : 0;

/**
 * The accommodation paragraph of the boat description (boat page and
 * my-bookings), built from the partner's figures only (capacity contract
 * v1, 7.4):
 *  - berths / "sleeps" wording from berths, "for guests" only where the
 *    partner's own split says which berths are the crew's;
 *  - "on board" wording from max. people, a sentence of its own;
 *  - WC as toilets, a shower only when the partner sends showers;
 *  - bedding: no promise that it is included — it differs by boat.
 * `pick(salt, count)` is the boat's own variant (yachtVariant), so the
 * paragraph is not one identical text across the catalogue. Every value is a
 * number; 0 means "leave this clause out" (an ICU `=0 {}` branch).
 */
export const accommodationProse = (
  facts: CapacityFacts,
  pick: (salt: number, count: number) => number
): ProsePart[] => {
  const { cabins, berths, heads, showers, maxPersons } = facts;
  const guestBerths = shownGuestBerths(facts);
  const parts: ProsePart[] = [];

  if (cabins && berths) parts.push({ key: `descLayoutV${pick(2, 5)}`, values: { cabins, berths, guestBerths } });
  else if (cabins) parts.push({ key: 'descLayoutCabins', values: { cabins } });
  else if (berths) parts.push({ key: 'descLayoutBerths', values: { berths, guestBerths } });

  if (heads) parts.push({ key: `descHeadsV${pick(6, 2)}`, values: { wc: heads, showers: showers ?? 0 } });

  if (maxPersons) parts.push({ key: `descOnBoardV${pick(7, 2)}`, values: { maxPersons } });

  if (cabins || berths) parts.push({ key: `descBeddingV${pick(8, 3)}`, values: {} });

  return parts;
};
