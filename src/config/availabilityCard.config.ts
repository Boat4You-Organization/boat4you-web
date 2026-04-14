export interface PolicyItem {
  title: string;
  tooltip?: string;
  textColor?: 'default' | 'success';
}

export interface BookingInfo {
  paymentPolicies: PolicyItem[];
}

export const availabilityCardConfig: BookingInfo = {
  paymentPolicies: [
    {
      title: '100% booking prepayment',
      tooltip: '100% booking prepayment',
      textColor: 'default',
    },
    {
      title: 'Cancel and reschedule for free before 14 Feb 2025',
      tooltip: 'Cancel and reschedule for free before 14 Feb 2025',
      textColor: 'success',
    },
    {
      title: 'Best price on the market',
      tooltip: 'Best price on the market',
      textColor: 'default',
    },
  ],
};
