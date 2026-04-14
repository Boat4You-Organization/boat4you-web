import { reservationStore } from './reservation.store';

export function togglePayNowModal(isOpen?: boolean | React.MouseEvent): void {
  reservationStore.payNowModalOpen = typeof isOpen === 'boolean' ? isOpen : !reservationStore.payNowModalOpen;
}
