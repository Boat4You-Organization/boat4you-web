/**
 * The boat page's booking box from elsewhere on the page (exit popup,
 * 3.11.2026): on desktop the sidebar calendar + Reserve form
 * (`#boat-booking`), on a phone — where that sidebar is hidden — the
 * BoatMobileNavigation bar, which listens for `OPEN_BOAT_BOOKING_EVENT`.
 */
export const BOAT_BOOKING_ANCHOR = 'boat-booking';

/** Window event BoatMobileNavigation answers with its Reserve / date-picker flow. */
export const OPEN_BOAT_BOOKING_EVENT = 'b4y:open-boat-booking';

export const openBoatBooking = (): void => {
  const box = document.getElementById(BOAT_BOOKING_ANCHOR);

  if (box && box.getClientRects().length > 0) {
    const smooth = !window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    box.scrollIntoView({ behavior: smooth ? 'smooth' : 'auto', block: 'center' });
    box.focus({ preventScroll: true });

    return;
  }

  window.dispatchEvent(new Event(OPEN_BOAT_BOOKING_EVENT));
};
