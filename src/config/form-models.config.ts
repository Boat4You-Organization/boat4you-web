import { Dayjs } from 'dayjs';

import { Currency, Language, UserModel, UserRole, UserStatus } from '@/models/user.model';
import { CharterType, MainSailType, VesselType } from '@/models/yacht.model';

export interface SearchBarFormValues {
  destinations: string[];
  startDate: Dayjs | null;
  endDate: Dayjs | null;
  boatTypes: string[];
  did: string[];
}

export interface LoginFormValues {
  email: string;
  password: string;
}

export interface SignUpFormValues {
  email: string;
  name: string;
  surname: string;
  password: string;
  repeatPassword?: string;
}

export interface ConfirmAccountFormValues {
  userId: number;
  verificationCode: string;
}
export interface BoatCalendarFormValues {
  startDate: Dayjs | null;
  endDate: Dayjs | null;
}

export interface BookingFormValues {
  yachtId: number;
  offerId: number;
  name: string;
  surname: string;
  email: string;
  phoneNumber: string;
  specialRequest: string;
  selectedExtras: string[];
}

export type RequestPasswordResetFormValues = Pick<UserModel, 'email'>;

export type ResetPasswordFormValues = Pick<UserModel, 'password'> & {
  confirmPassword: string;
};

export interface ProfileFormValues {
  id: number;
  name: string;
  surname: string;
  email: string;
  phoneNumber: string;
  address: string;
  city: string;
  country: string;
  /** ISO yyyy-MM-dd. Empty string when the user hasn't set their birthday. */
  birthday: string;
  password: string;
  language: Language;
  currency: Currency;
  userStatus: UserStatus;
  roles: UserRole[];
  newPassword?: string;
  repeatNewPassword?: string;
}

export interface YachtSearchParams {
  locations: string[];
  modelId?: number;
  charterType?: CharterType[];
  vesselType?: VesselType[];
  manufacturer?: number[];
  model?: number[];
  mainSailType?: MainSailType[];
  minBuildYear?: number;
  maxBuildYear?: number;
  minPersons?: number;
  maxPersons?: number;
  minCabins?: number;
  maxCabins?: number;
  minBerths?: number;
  maxBerths?: number;
  minLength?: number;
  maxLength?: number;
  minPrice?: number;
  maxPrice?: number;
  startDate?: string;
  endDate?: string;
  minWc?: number;
  maxWc?: number;
  minEnginePower?: number;
  maxEnginePower?: number;
  currency?: string;
  sortBy?: string;
  sortDirection?: string;
  page?: number;
  size?: number;
  dateFrom?: string;
  dateTo?: string;
  yid?: number[];
  did?: string[];
  boatTypes?: VesselType[];
  /** Sitemap-only — restrict the result to a 2-letter country whitelist. */
  countryCodes?: string[];
  currentDate?: string;
  reservationDateFrom?: string;
  price?: number;
}

export interface AllSearchParams extends YachtSearchParams {
  destinations: string;
  did: string[];
  manufacturers: string[];
  models: string[];
  amenityLabels: string[];
  mfid: number[];
  mid: number[];
  amenities: number[];
  inquiryId: number;
}

export interface BoatInquiryFormValues {
  yachtId: number;
  dateFrom: string;
  dateTo: string;
  name: string;
  surname: string;
  email: string;
  phone: string;
  message: string;
}

export interface AdminInquiryFormValues {
  email: string;
  yachtIds: number[];
  dateFrom: string;
  dateTo: string;
  did: string[];
  message: string;
}

export interface CancelBookingFormValues {
  specialRequest: string;
}
