import { CharterType, VesselType } from '@/models/yacht.model';

/**
 * The vessel type GULET: a boat-type filter or a landing row, where only the
 * type is known (no model). A boat's own page, card or booking asks
 * isGulet(), which also knows the partner's model.
 */
export const isGuletType = (vesselType?: string | null): boolean => vesselType === VesselType.GULET;

/** "Gulet", "OK AY Gulet": the word gulet in the partner's model ("Guletta 20" is not one). */
const GULET_MODEL = /\bgulet\b/i;

/**
 * What tells a gulet: the vessel type and the partner's model. The boat page
 * carries the model as `model` and `modelName`, a search row and a booking as
 * `modelName`.
 */
export interface GuletBoat {
  vesselType?: string | null;
  model?: string | null;
  modelName?: string | null;
}

/**
 * A gulet is always chartered with its crew (owner, 8.10.2026: "GULET JE
 * UVIJEK SA POSADOM"). The site never offers or suggests a gulet bareboat or
 * with a skipper only, also when the partner tags one BAREBOAT as well
 * (Sylvia R, 18886: CREWED + BAREBOAT, the only one of 219 live gulets that
 * day). Every other boat type follows the partner's charter types.
 *
 * A gulet is vessel type GULET, or a boat whose partner model is a gulet: the
 * partner types some as a motor or sailing yacht (Gallant 11771, model
 * "Gulet", and Ok Ay 47, "OK AY Gulet", both MOTOR_YACHT: "Sailing licence
 * required" on 8.10.2026). The model only, never the boat's own name.
 */
export const isGulet = (boat?: GuletBoat | null): boolean =>
  isGuletType(boat?.vesselType) || [boat?.model, boat?.modelName].some(model => GULET_MODEL.test(model ?? ''));

/**
 * Only gulets are searched for: there is no rental type to choose (bareboat
 * or with a skipper), every boat comes with its crew.
 */
export const isGuletOnly = (boatTypes?: readonly string[] | null): boolean =>
  !!boatTypes?.length && boatTypes.every(type => isGuletType(type));

/**
 * The boat can be chartered bareboat: the partner offers it so, and it is
 * not a gulet. One charter type (search row, reservation) or the detail's list.
 */
export const offersBareboat = (
  yacht: GuletBoat & {
    charterType?: string | readonly string[] | null;
  }
): boolean => {
  if (isGulet(yacht)) return false;

  const types = typeof yacht.charterType === 'string' ? [yacht.charterType] : (yacht.charterType ?? []);

  return types.includes(CharterType.BAREBOAT);
};

/**
 * The search update that sets the boat types. The rental type (Bareboat /
 * With skipper) is cleared when the search becomes or was gulets only: it is
 * no choice there, and one left over from a link would come back hidden.
 */
export const boatTypesUpdate = (
  current: readonly string[] | null | undefined,
  next: string[]
): { boatTypes: string[]; charterType?: string[] } =>
  isGuletOnly(next) || isGuletOnly(current) ? { boatTypes: next, charterType: [] } : { boatTypes: next };

/**
 * A /search querystring without the rental type when only gulets are
 * searched: an old or shared link (`boatTypes=GULET&charterType=…`) filters
 * nothing the page lets you choose (the filter and its chip are hidden).
 */
export const withoutGuletRentalType = (qs: string): string => {
  const params = new URLSearchParams(qs);

  if (!params.has('charterType') || !isGuletOnly(params.get('boatTypes')?.split(',').filter(Boolean))) return qs;

  params.delete('charterType');

  return params.toString();
};

// The general licence FAQ group (src/posts/static/<locale>/faq.md) a boat
// page lists under its own questions.
const LICENCE_FAQ_CATEGORY: Record<string, string> = {
  de: 'Lizenzen & Segelanforderungen',
  en: 'Licenses & Sailing Requirements',
  es: 'Licencias y Requisitos de Navegación',
  fr: 'Licences et Exigences de Navigation',
  hr: 'Dozvole & Uvjeti Jedrenja',
  it: 'Licenze e Requisiti di Navigazione',
  pt: 'Licenças e Requisitos de Navegação à Vela',
};

/**
 * The licence FAQ group under a boat's own questions — none for a gulet: it
 * asks "can I skipper the yacht myself?" and which licence a bareboat
 * charter needs, under the gulet's own "no licence is needed" answer.
 */
export const licenceFaqCategory = (locale: string, boat?: GuletBoat | null): string | null =>
  isGulet(boat) ? null : (LICENCE_FAQ_CATEGORY[locale] ?? LICENCE_FAQ_CATEGORY.en);
