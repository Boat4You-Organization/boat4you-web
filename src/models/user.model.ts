export enum UserStatus {
  ACTIVE = 'ACTIVE',
  INACTIVE = 'INACTIVE',
}

export const USER_STATUS_ARRAY = Object.values(UserStatus);

export enum UserRoleName {
  SYSTEM_ADMIN = 'SYSTEM_ADMIN',
  RESERVATION_MANAGER = 'RESERVATION_MANAGER',
  USER = 'USER',
}

export const USER_ROLE_NAME_LABEL_MAP = {
  [UserRoleName.SYSTEM_ADMIN]: 'System Admin',
  [UserRoleName.RESERVATION_MANAGER]: 'Reservation Manager',
  [UserRoleName.USER]: 'User',
} as const;

export type UserRole = {
  roleName: UserRoleName;
};

export interface UserModel {
  id: number;
  password: string;
  name: string;
  surname: string;
  email: string;
  phoneNumber?: string;
  address?: string;
  city?: string;
  country?: string;
  /** ISO yyyy-MM-dd; null/undefined when the user hasn't set their birthday. */
  birthday?: string | null;
  language: Language;
  currency: Currency;
  userStatus: UserStatus;
  roles: UserRole[];
}

export enum Language {
  ENGLISH = 'EN',
  FRENCH = 'FR',
  GERMAN = 'DE',
  PORTUGUESE = 'PT',
  ITALIAN = 'IT',
  SPANISH = 'ES',
  CROATIAN = 'HR',
  POLISH = 'PL',
  DUTCH = 'NL',
}

export const LANGUAGE_LABEL_MAP = {
  [Language.ENGLISH]: 'English',
  [Language.FRENCH]: 'French',
  [Language.GERMAN]: 'German',
  [Language.PORTUGUESE]: 'Portuguese',
  [Language.ITALIAN]: 'Italian',
  [Language.SPANISH]: 'Spanish',
  [Language.CROATIAN]: 'Croatian',
  [Language.POLISH]: 'Polish',
  [Language.DUTCH]: 'Dutch',
} as const;

export const LANGUAGE_ARRAY = Object.values(Language);

export const supportedLocales = LANGUAGE_ARRAY.map(code => code.toLowerCase());

export enum Currency {
  EUR = 'EUR',
  USD = 'USD',
  GBP = 'GBP',
  CAD = 'CAD',
  AUD = 'AUD',
  CHF = 'CHF',
  ARS = 'ARS',
  ZAR = 'ZAR',
  BRL = 'BRL',
  NOK = 'NOK',
  CZK = 'CZK',
  DKK = 'DKK',
  ILS = 'ILS',
  SGD = 'SGD',
  NZD = 'NZD',
  SEK = 'SEK',
}

export const CURRENCY_LABEL_MAP = {
  [Currency.EUR]: 'Euro (EUR - €)',
  [Currency.USD]: 'US Dollar (USD - $)',
  [Currency.GBP]: 'British Pound (GBP - £)',
  [Currency.CAD]: 'Canadian Dollar (CAD - $)',
  [Currency.AUD]: 'Australian Dollar (AUD - $)',
  [Currency.CHF]: 'Swiss Franc (CHF - Fr)',
  [Currency.ARS]: 'Argentine Peso (ARS - $)',
  [Currency.ZAR]: 'South African Rand (ZAR - R)',
  [Currency.BRL]: 'Brazilian Real (BRL - R$)',
  [Currency.NOK]: 'Norwegian Krone (NOK - kr)',
  [Currency.CZK]: 'Czech Koruna (CZK - Kč)',
  [Currency.DKK]: 'Danish Krone (DKK - kr)',
  [Currency.ILS]: 'Israeli New Shekel (ILS - ₪)',
  [Currency.SGD]: 'Singapore Dollar (SGD - $)',
  [Currency.NZD]: 'New Zealand Dollar (NZD - $)',
  [Currency.SEK]: 'Swedish Krona (SEK - kr)',
} as const;

export const CURRENCY_SYMBOL_MAP = {
  [Currency.EUR]: '€',
  [Currency.USD]: '$',
  [Currency.GBP]: '£',
  [Currency.CAD]: 'C$',
  [Currency.AUD]: 'A$',
  [Currency.CHF]: 'CHF',
  [Currency.ARS]: 'AR$',
  [Currency.ZAR]: 'R',
  [Currency.BRL]: 'R$',
  [Currency.NOK]: 'kr',
  [Currency.CZK]: 'Kč',
  [Currency.DKK]: 'kr',
  [Currency.ILS]: '₪',
  [Currency.SGD]: 'S$',
  [Currency.NZD]: 'NZ$',
  [Currency.SEK]: 'kr',
} as const;

export const CURRENCY_ARRAY = Object.values(Currency);
