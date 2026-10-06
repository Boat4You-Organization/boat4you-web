import { Locale } from 'next-intl';
import { getTranslations } from 'next-intl/server';
import 'server-only';

import { capacityFmt } from '@/utils/static/capacityFmt';
import { loadCapacityNoteLookup } from '@/utils/static/capacityNoteTable';
import { isOperatorName } from '@/utils/static/operatorNames';
import {
  Capacity,
  CapacityDimDto,
  Fmt,
  ResolvedDim,
  SailDto,
  YachtLike,
  createFmt,
  fromYacht,
  normalizeNote,
} from '@/utils/static/yachtCapacity';

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

const withDimNote = (raw: CapacityDimDto | null | undefined, resolved: ResolvedDim | null) =>
  raw && typeof raw === 'object' && !resolved?.note ? { ...raw, note: null } : raw;

const withSailLabel = (raw: SailDto | null | undefined, resolved: { label: string | null } | null) =>
  raw && typeof raw === 'object' && !resolved?.label ? { ...raw, label: null } : raw;

/**
 * The yacht as the page hands it to client components (RSC payload): every
 * partner note / label that `capacity` (resolveYachtCapacity) does not show —
 * hidden by the operator list or the note rules, or simply unused — is
 * nulled, so a hidden name is not left in the page source either. Numbers
 * and splits stay; a client that re-derives rows from this yacht gets the
 * same result as the server. The backend sanitizer remains the real gate;
 * this is the second line.
 */
export const withResolvedNotes = <T extends YachtLike>(yacht: T, capacity: Capacity): T => {
  const c = yacht.capacity && typeof yacht.capacity === 'object' ? yacht.capacity : null;
  const rig = yacht.rig && typeof yacht.rig === 'object' ? yacht.rig : null;

  if (!c && !rig) return yacht;

  const engine = rig?.engine && typeof rig.engine === 'object' ? rig.engine : null;
  const engineLabelShown =
    capacity.engine?.type === 'text' && capacity.engine.text === normalizeNote(engine?.label ?? null);

  return {
    ...yacht,
    capacity: c && {
      ...c,
      cabins: withDimNote(c.cabins, capacity.cabins),
      berths: withDimNote(c.berths, capacity.berths),
      heads: withDimNote(c.heads, capacity.heads),
    },
    rig: rig && {
      ...rig,
      mainsail: withSailLabel(rig.mainsail, capacity.mainsail),
      headsail: withSailLabel(rig.headsail, capacity.headsail),
      engine: engine && !engineLabelShown ? { ...engine, label: null } : rig.engine,
    },
  };
};
