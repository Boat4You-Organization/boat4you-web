'use server';

import { resolveCapacityNotes } from '@/utils/server/yachtCapacity';
import type { ResolvedNote } from '@/utils/static/yachtCapacity';

/**
 * my-bookings: the booked boat's partner notes ({ dim, note }, at most one
 * per dimension) as this locale shows them — see resolveCapacityNotes. The
 * input is untrusted: anything that is not a note query answers null, and the
 * answer never depends on the operator list (no "is X a partner?" oracle).
 */
export async function getCapacityNotesAction(locale: string, queries: unknown): Promise<(ResolvedNote | null)[]> {
  return resolveCapacityNotes(typeof locale === 'string' ? locale : 'en', queries);
}
