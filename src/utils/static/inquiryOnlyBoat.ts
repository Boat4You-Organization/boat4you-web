import type { YachtModel } from '@/models/yacht.model';
import { isReservable } from '@/utils/static/offerStatusGate';

/**
 * The one place a boat page decides it is inquiry-only: the backend says the
 * boat has no bookable future offer (`hasBookableFutureOffer === false`).
 * Such a page keeps its content and inquiry form but shows no price, no
 * availability calendar and no booking button. A backend that does not send
 * the field yet (undefined / null) means bookable, as before — so the web and
 * the backend can deploy in either order. The web never works this out from
 * the offers itself.
 */
export const isInquiryOnlyBoat = (yacht?: Pick<YachtModel, 'hasBookableFutureOffer'> | null): boolean =>
  yacht?.hasBookableFutureOffer === false;

/**
 * The boat is booked by inquiry, not online: it has no bookable future offer
 * (isInquiryOnlyBoat), or its agency takes inquiries only (`inquireOnly`) —
 * the booking bar of such a boat says "Price on inquiry" and "Inquire now"
 * (offerStatusGate.ts). The page's Product JSON-LD, meta description, FAQ,
 * description call to action and weekly price summary follow this one, so
 * none of them quotes a price or promises the online checkout the bar does
 * not offer (live check 7.10.2026: Yvonne 3664 published an InStock offer and
 * "complete the secure online checkout"). The calendar keeps
 * isInquiryOnlyBoat: an inquiry-only agency's boat still shows its dates.
 */
export const isBookedByInquiry = (
  yacht?: (Pick<YachtModel, 'hasBookableFutureOffer'> & Partial<Pick<YachtModel, 'inquireOnly'>>) | null
): boolean => isInquiryOnlyBoat(yacht) || yacht?.inquireOnly === true;

/**
 * Owner rule 16.10.2026 ("ostavi raspored, samo neka bude sve bukirano ako
 * nema ništa slobodno — nema smisla da se miče cjenik ako nema slobodnih
 * termina"): an inquiry-only boat (isInquiryOnlyBoat) whose partner still
 * publishes weeks keeps its availability calendar — every week reserved, with
 * its price, none selectable. Without a published week the inquiry panel
 * stays in its place, as before; so it does when a week is FREE although the
 * backend calls none bookable (a placeholder price under the listing floor, a
 * blocked agency): that week is not reserved, and its price is not a real one.
 * The price, the booking box, the meta and the JSON-LD stay "on request"
 * (isBookedByInquiry) — the calendar shows prices, it quotes no "from".
 */
export const showsAllBookedCalendar = (
  yacht?: (Pick<YachtModel, 'hasBookableFutureOffer'> & Partial<Pick<YachtModel, 'offers'>>) | null
): boolean => {
  const offers = yacht?.offers;

  return (
    isInquiryOnlyBoat(yacht) &&
    Array.isArray(offers) &&
    offers.length > 0 &&
    !offers.some(offer => isReservable(offer.status))
  );
};
