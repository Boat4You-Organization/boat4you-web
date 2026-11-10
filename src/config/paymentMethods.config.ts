import BankTransfer from '@/components/SvgIcons/Payment/BankTransfer';
import CreditCard from '@/components/SvgIcons/Payment/CreditCard';

/**
 * The card provider's limit per payment (Mollie, 10,000 EUR — surcharge included). Above it the card option is
 * shown disabled and the booking is paid by bank transfer; the backend refuses such a card checkout (422, 8106).
 */
export const CARD_PAYMENT_MAX_EUR = 10000;

export enum PaymentMethod {
  CREDIT_CARD = 'CREDIT_CARD',
  BANK_TRANSFER = 'BANK_TRANSFER',
  /** Klarna through Mollie — offered only when the backend says so (GET /public/payments/card/klarna). */
  KLARNA = 'KLARNA',
}

export const PAYMENT_METHOD_LABEL_MAP = {
  [PaymentMethod.CREDIT_CARD]: 'creditCard',
  [PaymentMethod.BANK_TRANSFER]: 'bankTransfer',
  [PaymentMethod.KLARNA]: 'klarna.name',
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
