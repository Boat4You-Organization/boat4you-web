import { ElementType } from 'react';

import type { Messages } from 'next-intl';

import CompetitivePricing from '@/components/SvgIcons/WhyChooseUs/CompetitivePricing';
import SecurePayement from '@/components/SvgIcons/WhyChooseUs/SecurePayment';
import TrustedCustomerPayement from '@/components/SvgIcons/WhyChooseUs/TrustedCustomerService';
import WideSelection from '@/components/SvgIcons/WhyChooseUs/WideSelection';

type WhyChooseUsKey = keyof Messages['home']['whyChooseUsSection']['items'];

export interface WhyChooseUsItem {
  icon: ElementType;
  translationKey: `whyChooseUsSection.items.${WhyChooseUsKey}`;
}

const whyChooseUs: WhyChooseUsItem[] = [
  {
    icon: CompetitivePricing,
    translationKey: 'whyChooseUsSection.items.competitivePricing',
  },
  {
    icon: WideSelection,
    translationKey: 'whyChooseUsSection.items.wideSelection',
  },
  {
    icon: SecurePayement,
    translationKey: 'whyChooseUsSection.items.securePayment',
  },
  {
    icon: TrustedCustomerPayement,
    translationKey: 'whyChooseUsSection.items.trustedCustomerService',
  },
];

export default whyChooseUs;
