import { useEffect, useMemo, useState } from 'react';

import { getCapacityNotesAction } from '@/actions/capacity.actions';
import {
  Dim,
  FromYachtOptions,
  ResolvedNote,
  YachtLike,
  isLanguageNeutral,
  normalizeNote,
} from '@/utils/static/yachtCapacity';

type NoteOptions = Pick<FromYachtOptions, 'noteLookup' | 'findOperatorName'>;

type Query = { dim: Dim; note: string };

const DIMS: readonly Dim[] = ['cabins', 'berths', 'heads'];

/** The yacht's word notes (a language-neutral "(8+2)" needs no table and names no one), normalized. */
const wordNotes = (yacht: YachtLike): Query[] => {
  const c = yacht.capacity && typeof yacht.capacity === 'object' ? yacht.capacity : null;

  return DIMS.flatMap(dim => {
    const note = normalizeNote(c?.[dim]?.note ?? null);

    return note && !isLanguageNeutral(note) ? [{ dim, note }] : [];
  });
};

/**
 * Partner notes for a client surface that fetches its own data (my-bookings).
 * The note tables and the operator list stay on the server: the boat's few
 * word notes go to a server action, which answers with each note as the page
 * shows it (reviewed translation, English with lang="en", or hidden). Until
 * it answers — or if it fails — a word note does not print (the number and
 * the language-neutral notes do), so it never shows unvetted.
 */
const useCapacityNotes = (locale: string, yacht: YachtLike): NoteOptions => {
  const key = JSON.stringify([locale, wordNotes(yacht)]);
  const [answer, setAnswer] = useState<{ key: string; notes: (ResolvedNote | null)[] }>();

  useEffect(() => {
    const [loc, queries]: [string, Query[]] = JSON.parse(key);

    if (!queries.length) return undefined;

    let active = true;

    getCapacityNotesAction(loc, queries)
      .then(notes => {
        if (active) setAnswer({ key, notes });
      })
      .catch(() => undefined);

    return () => {
      active = false;
    };
  }, [key]);

  return useMemo(() => {
    const queries: Query[] = JSON.parse(key)[1];
    const notes = answer?.key === key ? answer.notes : null;
    const shown = (i: number) => notes?.[i] ?? null;

    return {
      noteLookup: (note, dim) => {
        const i = queries.findIndex(q => q.dim === dim && q.note === note);
        const resolved = i < 0 ? null : shown(i);

        return resolved && resolved.lang === null ? resolved.text : undefined;
      },
      findOperatorName: text => queries.some((q, i) => q.note === text && !shown(i)),
    };
  }, [key, answer]);
};

export default useCapacityNotes;
