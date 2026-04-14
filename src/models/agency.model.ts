export interface AgencyModel {
  id: number;
  name: string;
  address: string;
  city: string;
  country: string;
  zip: string;
  vatCode: string;
  web: string;
  email: string;
  phone: string;
  mobile: string;
  iban: string;
  active: string;
  discount: number;
  director: string;
  skipExternalSystem: boolean;
}
