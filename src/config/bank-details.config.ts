export interface BankDetails {
  title: string;
  value: string;
}

export const companyDetails = {
  name: 'Cusmanich d.o.o.',
  address: 'Vrboran 37, 21000 Split, Croatia',
};

export const bankInfo = {
  name: 'Erste&Steiermarkische Bank d.d.',
  address: 'Jadranski trg 3a, 51000 Rijeka, Croatia',
};

export const bankDetails: BankDetails[] = [
  {
    title: 'Account Name',
    value: companyDetails.name,
  },
  {
    title: 'Payment Type',
    value: 'OUR',
  },
  {
    title: 'Bank',
    value: bankInfo.name,
  },
  {
    title: 'Bank address',
    value: bankInfo.address,
  },
  {
    title: 'SwiftCode',
    value: 'ESBCHR22',
  },
  {
    title: 'IBAN',
    value: 'HR3924020061101202108',
  },
];
