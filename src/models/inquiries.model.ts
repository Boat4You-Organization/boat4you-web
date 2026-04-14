export enum InquiriesStatus {
  NEW = 'NEW',
  ANSWERED = 'ANSWERED',
  ARCHIVED = 'ARCHIVED',
}

export interface InquiriesModelShortInfo {
  id: number;
  yachtId: number;
  yachtName: string;
  location: string;
  dateFrom: string;
  dateTo: string;
  name: string;
  surname: string;
  email: string;
  phone: string;
  status: InquiriesStatus;
  createdAt: string;
}

export interface InquiriesModel extends InquiriesModelShortInfo {
  countryCode: string;
  mainImage: number;
  modelName: string;
  message: string;
}
