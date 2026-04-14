import { ElementType } from 'react';

import { Messages } from 'next-intl';

import Location from '@/components/SvgIcons/Location';
import VerifiedBadge from '@/components/SvgIcons/VerifiedBadge';
import VerifiedBoat from '@/components/SvgIcons/VerifiedBoat';
import TrustedCustomerPayement from '@/components/SvgIcons/WhyChooseUs/TrustedCustomerService';
import Link from '@/types/link.type';

const STEPS = [1, 2, 3, 4, 5, 6, 7] as const;
const STEPS_WITH_QUESTIONS = [1, 2] as const;
const STEPS_WITH_ANSWERS = [1, 2, 3, 4, 5, 6] as const;
const STEPS_WITH_LINKS = [1, 2] as const;
const ITEMS = [1, 2, 3] as const;

type StepNumber = (typeof STEPS)[number];

type StepsWithQuestions = (typeof STEPS_WITH_QUESTIONS)[number];

type StepsWithAnswers = (typeof STEPS_WITH_ANSWERS)[number];

type StepsWithLinks = (typeof STEPS_WITH_LINKS)[number];

type ItemNumber = (typeof ITEMS)[number];

export interface HowWeWorkStep {
  step: number;
  titleKey: `steps.step${StepNumber}.title`;
  subtitleKey: `steps.step${StepNumber}.subtitle`;
  itemsKeys: `steps.step${StepNumber}.items.item${ItemNumber}`[];
  questionKey?: `steps.step${StepsWithQuestions}.question`;
  answerKey?: `steps.step${StepsWithAnswers}.answer`;
  link?: Link & {
    textKey?: `steps.step${StepsWithLinks}.link.text`;
  };
}

type WhyChooseUsKey = keyof Messages['howWeWork']['whyChooseUsSection']['items'];

export interface HowWeWorkItem {
  icon: ElementType;
  translationKey: `whyChooseUsSection.items.${WhyChooseUsKey}`;
}

export const howWeWorkConfig: HowWeWorkStep[] = [
  {
    step: 1,
    titleKey: 'steps.step1.title',
    subtitleKey: 'steps.step1.subtitle',
    itemsKeys: ['steps.step1.items.item1', 'steps.step1.items.item2', 'steps.step1.items.item3'],
    questionKey: 'steps.step1.question',
    answerKey: 'steps.step1.answer',
    link: {
      textKey: 'steps.step1.link.text',
      href: '/',
    },
  },
  {
    step: 2,
    titleKey: 'steps.step2.title',
    subtitleKey: 'steps.step2.subtitle',
    itemsKeys: ['steps.step2.items.item1', 'steps.step2.items.item2', 'steps.step2.items.item3'],
    questionKey: 'steps.step2.question',
    answerKey: 'steps.step2.answer',
    link: {
      textKey: 'steps.step2.link.text',
      href: '/',
    },
  },
  {
    step: 3,
    titleKey: 'steps.step3.title',
    subtitleKey: 'steps.step3.subtitle',
    itemsKeys: ['steps.step3.items.item1', 'steps.step3.items.item2', 'steps.step3.items.item3'],
    answerKey: 'steps.step3.answer',
  },
  {
    step: 4,
    titleKey: 'steps.step4.title',
    subtitleKey: 'steps.step4.subtitle',
    itemsKeys: ['steps.step4.items.item1', 'steps.step4.items.item2', 'steps.step4.items.item3'],
    answerKey: 'steps.step4.answer',
  },
  {
    step: 5,
    titleKey: 'steps.step5.title',
    subtitleKey: 'steps.step5.subtitle',
    itemsKeys: ['steps.step5.items.item1', 'steps.step5.items.item2', 'steps.step5.items.item3'],
    answerKey: 'steps.step5.answer',
  },
  {
    step: 6,
    titleKey: 'steps.step6.title',
    subtitleKey: 'steps.step6.subtitle',
    itemsKeys: ['steps.step6.items.item1', 'steps.step6.items.item2', 'steps.step6.items.item3'],
    answerKey: 'steps.step6.answer',
  },
  {
    step: 7,
    titleKey: 'steps.step7.title',
    subtitleKey: 'steps.step7.subtitle',
    itemsKeys: ['steps.step7.items.item1', 'steps.step7.items.item2', 'steps.step7.items.item3'],
  },
];

export const whyChooseUs: HowWeWorkItem[] = [
  {
    icon: VerifiedBoat,
    translationKey: 'whyChooseUsSection.items.verifiedBoatsOnly',
  },
  {
    icon: Location,
    translationKey: 'whyChooseUsSection.items.localExpertise',
  },
  {
    icon: TrustedCustomerPayement,
    translationKey: 'whyChooseUsSection.items.realHumanSupport',
  },
  {
    icon: VerifiedBadge,
    translationKey: 'whyChooseUsSection.items.bestPriceGuarantee',
  },
];
