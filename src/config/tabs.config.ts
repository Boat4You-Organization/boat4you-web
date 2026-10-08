import { isGulet } from '@/utils/static/guletCrewed';

export const continentsTabs = ['europe', 'americas'] as const;

// Order matters — this is the order rendered in the tab bar, left-to-right.
export const boatsTabs = ['recommended', 'lowestPrice', 'highestPrice', 'minLength', 'maxLength'] as const;

export const singleBoatTabs = ['details', 'ammenities', 'availability', 'extras', 'faq'] as const;
// Custom yachts get a dedicated 'priceDetails' tab right after Amenities
// — admins enter season-specific pricing notes in the admin form, and
// users expect to see them under their own header rather than buried at
// the bottom of the amenities list.
export const singleCustomBoatTabs = ['details', 'ammenities', 'priceDetails', 'goodToKnow', 'video', 'faq'] as const;

// Cancellation sits near the BOTTOM (just above FAQ) on purpose — Mario rule
// (2.7.2026): "glupo da stavljamo pri vrhu da klijentu dajemo za razmišljanje"
// — leading with cancellation terms plants the idea of cancelling. The info
// stays fully available, just after the positive content (boat, payment).
// Order here must match the renderContent() switch in ReservationInfoSection.
export const reservationTabs = [
  'reservationTabs.mainInfo',
  'reservationTabs.details',
  'reservationTabs.amenities',
  'reservationTabs.payment',
  'reservationTabs.goodToKnow',
  'reservationTabs.cancellation',
  'reservationTabs.faq',
] as const;

/**
 * The My bookings tabs of one booking. A gulet's has no FAQ: its one group is
 * the general licence FAQ ("can I skipper the yacht myself?", bareboat
 * licences), and a gulet is chartered only with its crew (guletCrewed.ts).
 * FAQ is the last tab, so the others keep their renderContent() index.
 */
export const reservationTabsFor = (vesselType?: string | null): ReadonlyArray<(typeof reservationTabs)[number]> =>
  isGulet(vesselType) ? reservationTabs.filter(tab => tab !== 'reservationTabs.faq') : reservationTabs;
