import { CountryIsoEnum } from '@/config/countries.config copy';

export enum RecipientType {
  PRIVATE_PERSON = 'PRIVATE_PERSON',
  COMPANY = 'COMPANY',
}

export const RECIPIENT_TYPE_ARRAY = Object.values(RecipientType);

export enum InvoiceLanguage {
  EN = 'EN',
  HR = 'HR',
}

export const INVOICE_LANGUAGE_ARRAY = Object.values(InvoiceLanguage);

export enum InvoiceStatus {
  DRAFT = 'DRAFT',
  SENT = 'SENT',
}

export const INVOICE_STATUS_ARRAY = Object.values(InvoiceStatus);

export interface InvoiceModel {
  id: number;
  reservationId: number;
  reservationNumber: string;
  reservationFlowId: number;
  recipientType: RecipientType;
  recipientName: string;
  recipientCity: string;
  recipientStreet: string;
  recipientZipCode: string;
  recipientCountry: CountryIsoEnum;
  recipientVatCode: string;
  invoiceNumber: string;
  invoiceDate: string;
  invoiceLanguage: InvoiceLanguage;
  invoiceStatus: InvoiceStatus;
  invoiceItem: string;
  includeVat: boolean;
  vatPercentage: number;
  priceWithoutVat: number;
  vatAmount: number;
  totalPrice: number;
  clientName: string;
  clientEmail: string;
  clientPhoneNumber: string;
}
