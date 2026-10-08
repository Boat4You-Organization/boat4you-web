import 'server-only';

import { NoteLookup, NoteTableEntry, noteTableLookup } from '@/utils/static/yachtCapacity';

/**
 * Reviewed translations of the MMK capacity notes ("(12 pax + 1 Crew)",
 * "for clients + 1 crew"; Mario 6.10.2026: translate through a reviewed
 * whole-string table, an unseen note stays English with lang="en"). One slice
 * per locale in ./capacityNotes/<locale>.json, generated from the capacity
 * contract's capacityNotes.json v2 (8.10.2026, every word note on prod) by its
 * work/gen_slices.py: only the notes that carry words (the language-neutral
 * "8+2", "(4+2)" print as they are), ~160 KB a locale.
 *
 * Server only: the boat page resolves its notes in resolveYachtCapacity,
 * my-bookings asks getCapacityNotesAction for its few notes; a client chunk
 * never carries a slice. English pages need none.
 */
export const CAPACITY_NOTE_LOCALES: readonly string[] = ['de', 'es', 'fr', 'hr', 'it', 'nl', 'pl', 'pt'];

export const loadCapacityNoteLookup = async (locale: string): Promise<NoteLookup | undefined> => {
  if (!CAPACITY_NOTE_LOCALES.includes(locale)) return undefined;

  try {
    const slice: Record<string, NoteTableEntry> = (await import(`./capacityNotes/${locale}.json`)).default;

    return noteTableLookup(slice, locale);
  } catch {
    // No slice: the notes print in English (lang="en"), never a key or "null".
    return undefined;
  }
};
