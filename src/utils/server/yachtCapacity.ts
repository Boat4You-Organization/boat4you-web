import { Locale } from 'next-intl';
import { getTranslations } from 'next-intl/server';
import 'server-only';

import { capacityFmt } from '@/utils/static/capacityFmt';
import { loadCapacityNoteLookup } from '@/utils/static/capacityNoteTable';
import { isOperatorName } from '@/utils/static/operatorNames';
import { Capacity, Fmt, YachtLike, createFmt, fromYacht } from '@/utils/static/yachtCapacity';

/** The `capacity` messages of one locale as the formatter's `Fmt`. */
export const getCapacityFmt = async (locale: string): Promise<Fmt> =>
  capacityFmt(await getTranslations({ locale: locale as Locale, namespace: 'capacity' }));

/** English capacity wording for the English-only pages outside the locale tree (/trip). */
export const getCapacityFmtEn = async (): Promise<Fmt> =>
  createFmt((await import('../../../messages/en/capacity.json')).default, 'en');

/**
 * A yacht's cabins / berths / WC / people / rig for one page locale
 * (yachtCapacity.ts, capacity contract v1): the partner's own figures and
 * notes from the API's `capacity` / `rig` blocks — the flat cabins / berths /
 * wc / maxPersons on an older backend — with the locale's reviewed note
 * translations. The backend already sanitizes every note; the operator-name
 * list runs here once more as a second line, server side only (the list must
 * not reach a client chunk). The result is plain data: client components get
 * it as a prop and never load the note table themselves.
 */
export const resolveYachtCapacity = async (yacht: YachtLike, locale: string): Promise<Capacity> =>
  fromYacht(yacht, {
    locale,
    noteLookup: await loadCapacityNoteLookup(locale),
    findOperatorName: text => isOperatorName(text),
  });
