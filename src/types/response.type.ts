// export interface ApiResponse<T = null> {
//   errors: Record<string, string[]>;
//   message: string;
//   payload: T;
//   status: number;
// }
import { PaymentStatus } from '@/models/reservation.model';

export type PaginatedResponse<T> = {
  content: T[];
  page?: {
    size: number;
    number: number;
    totalElements: number;
    totalPages: number;
  };
};

// export type PaginatedApiResponse<T> = ApiResponse<PaginatedResponse<T>>;

export type PayloadResponse<T> = {
  payload: T;
  message?: string;
};

export interface PaymentStatusResponse {
  sessionIdOrOrderCode: string;
  status: PaymentStatus;
}
