import { NoteLookup, NoteTableEntry, noteTableLookup } from '@/utils/static/yachtCapacity';

/**
 * Reviewed translations of the MMK capacity notes ("(12 pax + 1 Crew)",
 * "(5+1 for the crew)"; capacity contract v1, Mario 6.10.2026: translate
 * through a reviewed whole-string table, an unseen note stays English with
 * lang="en"). One slice per locale in ./capacityNotes/<locale>.json,
 * generated from the contract's capacityNotes.json: only the 37 notes that
 * carry words (the language-neutral "8+2", "(4+2)" print as they are), ~4 KB.
 *
 * Loaded by locale with a dynamic import, so a page or a client surface
 * fetches only its own locale's slice. English pages need none.
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
