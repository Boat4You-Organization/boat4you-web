import BankTransfer from '@/components/SvgIcons/Payment/BankTransfer';
import CreditCard from '@/components/SvgIcons/Payment/CreditCard';

export enum PaymentMethod {
  CREDIT_CARD = 'CREDIT_CARD',
  BANK_TRANSFER = 'BANK_TRANSFER',
}

export const PAYMENT_METHOD_LABEL_MAP = {
  [PaymentMethod.CREDIT_CARD]: 'creditCard',
  [PaymentMethod.BANK_TRANSFER]: 'bankTransfer',
} as const;

export enum PaymentInstallment {
  FULL_PAYMENT = 'FULL_PAYMENT',
  INSTALLMENTS = 'INSTALLMENTS',
}

export const PAYMENT_INSTALLMENT_LABEL_MAP = {
  [PaymentInstallment.FULL_PAYMENT]: 'fullPayment',
  [PaymentInstallment.INSTALLMENTS]: 'installments',
} as const;

export interface PaymentMethodConfig {
  title: PaymentMethod;
  icon: React.ReactNode;
}

export const paymentMethods = [
  {
    title: PaymentMethod.CREDIT_CARD,
    icon: CreditCard,
  },
  {
    title: PaymentMethod.BANK_TRANSFER,
    icon: BankTransfer,
  },
];

export const bankList = ['OTP Banka', 'Erste'];

export const paymentInstallmentsList = [
  {
    id: PaymentInstallment.FULL_PAYMENT,
    label: PAYMENT_INSTALLMENT_LABEL_MAP[PaymentInstallment.FULL_PAYMENT],
  },
  {
    id: PaymentInstallment.INSTALLMENTS,
    label: PAYMENT_INSTALLMENT_LABEL_MAP[PaymentInstallment.INSTALLMENTS],
  },
];
