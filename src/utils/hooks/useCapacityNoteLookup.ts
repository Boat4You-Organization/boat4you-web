import { useEffect, useState } from 'react';

import { CAPACITY_NOTE_LOCALES, loadCapacityNoteLookup } from '@/utils/static/capacityNoteTable';
import type { NoteLookup } from '@/utils/static/yachtCapacity';

/**
 * The reviewed capacity-note translations for a client surface that fetches
 * its own data (my-bookings): only this locale's slice is downloaded, after
 * mount. Until it arrives — and on English pages — the notes print in English.
 */
const useCapacityNoteLookup = (locale: string): NoteLookup | undefined => {
  const [lookup, setLookup] = useState<{ locale: string; noteLookup: NoteLookup | undefined }>();

  useEffect(() => {
    if (!CAPACITY_NOTE_LOCALES.includes(locale)) return undefined;

    let active = true;

    loadCapacityNoteLookup(locale).then(noteLookup => {
      if (active) setLookup({ locale, noteLookup });
    });

    return () => {
      active = false;
    };
  }, [locale]);

  return lookup?.locale === locale ? lookup.noteLookup : undefined;
};

export default useCapacityNoteLookup;
