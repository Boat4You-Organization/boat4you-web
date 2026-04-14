import { Currency } from '@/models/user.model';

export type CurrencyType = {
  id: Currency;
  label: string;
};

export const currencySymbols = {
  [Currency.EUR]: '€',
  [Currency.USD]: '$',
  [Currency.GBP]: '£',
  [Currency.CAD]: 'C$',
  [Currency.AUD]: 'A$',
  [Currency.CHF]: 'CHF',
  [Currency.ARS]: '$',
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

const currencies: CurrencyType[] = [
  { id: Currency.ARS, label: 'Argentine Peso [ARS - $]' },
  { id: Currency.AUD, label: 'Australian Dollar [AUD - A$]' },
  { id: Currency.BRL, label: 'Brazilian Real [BRL - R$]' },
  { id: Currency.GBP, label: 'British Pound [GBP - £]' },
  { id: Currency.CAD, label: 'Canadian Dollar [CAD - C$]' },
  { id: Currency.CZK, label: 'Czech Koruna [CZK - Kč]' },
  { id: Currency.DKK, label: 'Danish Krone [DKK - kr]' },
  { id: Currency.EUR, label: 'Euro [EUR - €]' },
  { id: Currency.ILS, label: 'Israeli New Shekel [ILS - ₪]' },
  { id: Currency.NZD, label: 'New Zealand Dollar [NZD - NZ$]' },
  { id: Currency.NOK, label: 'Norwegian Krone [NOK - kr]' },
  { id: Currency.SGD, label: 'Singapore Dollar [SGD - S$]' },
  { id: Currency.ZAR, label: 'South African Rand [ZAR - R]' },
  { id: Currency.SEK, label: 'Swedish Krona [SEK - kr]' },
  { id: Currency.CHF, label: 'Swiss Franc [CHF - CHF]' },
  { id: Currency.USD, label: 'US Dollar [USD - $]' },
];

export default currencies;
