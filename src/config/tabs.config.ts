export const continentsTabs = ['europe', 'americas'] as const;

// Order matters — this is the order rendered in the tab bar, left-to-right.
export const boatsTabs = ['recommended', 'lowestPrice', 'highestPrice', 'minLength', 'maxLength'] as const;

export const singleBoatTabs = ['details', 'ammenities', 'availability', 'extras', 'faq'] as const;
export const singleCustomBoatTabs = ['details', 'ammenities', 'goodToKnow', 'faq'] as const;

export const reservationTabs = [
  'reservationTabs.mainInfo',
  'reservationTabs.details',
  'reservationTabs.amenities',
  'reservationTabs.cancellation',
  'reservationTabs.payment',
  'reservationTabs.goodToKnow',
  'reservationTabs.faq',
] as const;
