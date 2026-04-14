export enum ReservationStatus {
  UNKNOWN = 'UNKNOWN',
  OPTION = 'OPTION',
  RESERVATION = 'RESERVATION',
  CANCELLED = 'CANCELLED',
  SERVICE = 'SERVICE',
  FREE = 'FREE',
}

export const RESERVATION_STATUS_LABEL_MAP = {
  [ReservationStatus.UNKNOWN]: 'reservationStatus.unknown',
  [ReservationStatus.OPTION]: 'reservationStatus.option',
  [ReservationStatus.RESERVATION]: 'reservationStatus.reservation',
  [ReservationStatus.CANCELLED]: 'reservationStatus.cancelled',
  [ReservationStatus.SERVICE]: 'reservationStatus.service',
  [ReservationStatus.FREE]: 'reservationStatus.free',
} as const;

export const RESERVATION_STATUS_COLOR_MAP = {
  [ReservationStatus.UNKNOWN]: 'default',
  [ReservationStatus.OPTION]: 'info',
  [ReservationStatus.RESERVATION]: 'success',
  [ReservationStatus.CANCELLED]: 'error',
  [ReservationStatus.SERVICE]: 'info',
  [ReservationStatus.FREE]: 'default',
} as const;
