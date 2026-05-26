export const continentsTabs = ['europe', 'americas'] as const;

// Order matters — this is the order rendered in the tab bar, left-to-right.
export const boatsTabs = ['recommended', 'lowestPrice', 'highestPrice', 'minLength', 'maxLength'] as const;

export const singleBoatTabs = ['details', 'ammenities', 'availability', 'extras', 'faq'] as const;
// Custom yachts get a dedicated 'priceDetails' tab right after Amenities
// — admins enter season-specific pricing notes in the admin form, and
// users expect to see them under their own header rather than buried at
// the bottom of the amenities list.
export const singleCustomBoatTabs = ['details', 'ammenities', 'priceDetails', 'goodToKnow', 'video', 'faq'] as const;

export const reservationTabs = [
  'reservationTabs.mainInfo',
  'reservationTabs.details',
  'reservationTabs.amenities',
  'reservationTabs.cancellation',
  'reservationTabs.payment',
  'reservationTabs.goodToKnow',
  'reservationTabs.faq',
] as const;
