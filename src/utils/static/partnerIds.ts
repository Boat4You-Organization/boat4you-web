/**
 * Partner identifiers never reach the browser. Owner rule: a partner ID is
 * never public — an MMK `externalId` gives the agency away (externalId % 10000
 * is the agency id) — and neither is the agency, its commission or the source
 * system of a boat.
 *
 * The public API sends these fields (today as null) on every extra of a boat
 * and on every listing row, so `"externalId":null` went into each boat page's
 * RSC payload 100–990 times and `agencyName` / `agencyCommissionEur` /
 * `sourceSystem` into every listing. Nothing in the web reads them: they are
 * dropped (key and value) where the web fetches boats, before any component
 * gets the object.
 */
const PARTNER_ID_KEYS = new Set([
  'externalId',
  'agency',
  'agencyId',
  'agencyName',
  'agencyCommission',
  'agencyCommissionEur',
  'companyId',
  'partnerId',
  'sourceId',
  'sourceSystem',
  'mmkId',
  'nausysId',
]);

/** The value with every partner-identifier key removed, at any depth. */
export const withoutPartnerIds = <T>(value: T): T => {
  if (Array.isArray(value)) return value.map(withoutPartnerIds) as T;

  if (value && typeof value === 'object') {
    return Object.fromEntries(
      Object.entries(value)
        .filter(([key]) => !PARTNER_ID_KEYS.has(key))
        .map(([key, item]) => [key, withoutPartnerIds(item)])
    ) as T;
  }

  return value;
};
