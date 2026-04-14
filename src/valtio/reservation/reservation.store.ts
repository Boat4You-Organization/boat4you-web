import { proxy, useSnapshot } from 'valtio';

interface ReservationStore {
  payNowModalOpen: boolean;
}

export const reservationStore = proxy<ReservationStore>({
  payNowModalOpen: false,
});

export const useReservationStore = (): ReservationStore => useSnapshot(reservationStore);
