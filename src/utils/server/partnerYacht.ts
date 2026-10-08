import 'server-only';

import { YachtServiceModel } from '@/models/yacht-service.model';
import { YachtModel } from '@/models/yacht.model';
import { amenityComment, isAmenityPresent } from '@/utils/static/amenities';
import { operatorNameRanges } from '@/utils/static/operatorNames';
import { safePartnerName, safePartnerText } from '@/utils/static/partnerText';

/**
 * The yacht as the public page may carry it (partnerText.ts, with the
 * operator list — which is why this runs on the server). The whole object
 * reaches the client components, so the RSC payload holds what is left here:
 * extra and equipment names without partner-only parts, a partner description
 * only when it passes the filter. Keys, prices, units and payment types stay
 * as they are — the price calc and the booking send the keys back.
 */
export const withSafePartnerText = (yacht: YachtModel): YachtModel => {
  const names = new Map<string, string>();
  const safeName = (name: string): string => {
    if (!names.has(name)) names.set(name, safePartnerName(name, operatorNameRanges));

    return names.get(name) as string;
  };
  const safeText = (text?: string | null): string | null => safePartnerText(text, operatorNameRanges);
  const safeService = (service: YachtServiceModel): YachtServiceModel => ({
    ...service,
    name: safeName(service.name),
    description: safeText(service.description),
  });

  return {
    ...yacht,
    // A partner boat's own prose ("Base fee must be transferred in advance!",
    // a deposit-policy page) — the page never renders it and the JSON-LD uses
    // the built sentence. An admin-managed boat's copy is ours.
    ...(yacht.custom
      ? {}
      : {
          description: safeText(yacht.description) ?? '',
          highlights: safeText(yacht.highlights) ?? '',
          sysDescription: safeText(yacht.sysDescription),
        }),
    services: Array.isArray(yacht.services) ? yacht.services.map(safeService) : yacht.services,
    offers: Array.isArray(yacht.offers)
      ? yacht.offers.map(offer => ({
          ...offer,
          extras: Array.isArray(offer.extras) ? offer.extras.map(safeService) : offer.extras,
        }))
      : yacht.offers,
    // Rows the boat does not have, and partner items not linked to our
    // catalogue (Mario 8.10.2026), are shown nowhere (presentAmenities) — so
    // their names never reach the RSC payload either.
    amenities: Array.isArray(yacht.amenities)
      ? yacht.amenities
          .filter(amenity => isAmenityPresent(amenity) && Boolean(amenity.equipment?.labelCode))
          .map(amenity => ({
            ...amenity,
            name: typeof amenity.name === 'string' ? safeName(amenity.name) : amenity.name,
            comment: safeText(amenityComment(amenity)),
          }))
      : yacht.amenities,
  };
};
