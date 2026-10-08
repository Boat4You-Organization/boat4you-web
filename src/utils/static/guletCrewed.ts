import { CharterType, VesselType } from '@/models/yacht.model';

/**
 * A gulet is always chartered with its crew (owner, 8.10.2026: "GULET JE
 * UVIJEK SA POSADOM"). The site never offers or suggests a gulet bareboat or
 * with a skipper only, also when the partner tags one BAREBOAT as well
 * (Sylvia R, 18886: CREWED + BAREBOAT, the only one of 219 live gulets that
 * day). Every other boat type follows the partner's charter types.
 */
export const isGulet = (vesselType?: string | null): boolean => vesselType === VesselType.GULET;

/**
 * Only gulets are searched for: there is no rental type to choose (bareboat
 * or with a skipper), every boat comes with its crew.
 */
export const isGuletOnly = (boatTypes?: readonly string[] | null): boolean =>
  !!boatTypes?.length && boatTypes.every(type => isGulet(type));

/**
 * The boat can be chartered bareboat: the partner offers it so, and it is
 * not a gulet. One charter type (search row, reservation) or the detail's list.
 */
export const offersBareboat = (yacht: {
  vesselType?: string | null;
  charterType?: string | readonly string[] | null;
}): boolean => {
  if (isGulet(yacht.vesselType)) return false;

  const types = typeof yacht.charterType === 'string' ? [yacht.charterType] : (yacht.charterType ?? []);

  return types.includes(CharterType.BAREBOAT);
};
