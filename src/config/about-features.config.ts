import { ElementType } from 'react';

import LuxuryCatamaran from '@/components/SvgIcons/BoatTypes/LuxuryCatamaran';
import Calendar from '@/components/SvgIcons/Calendar';
import Contact from '@/components/SvgIcons/Contact';
import CustomerService from '@/components/SvgIcons/CustomerService';
import Medal from '@/components/SvgIcons/Medal';
import Shield from '@/components/SvgIcons/Shield';

export interface AboutFeature {
  icon: ElementType;
  title: '0.title' | '1.title' | '2.title' | '3.title' | '4.title' | '5.title';
  description:
    | '0.description'
    | '1.description'
    | '2.description'
    | '3.description'
    | '4.description'
    | '5.description';
}

export const aboutFeatures: AboutFeature[] = [
  {
    icon: Medal,
    title: '0.title',
    description: '0.description',
  },
  {
    icon: Contact,
    title: '1.title',
    description: '1.description',
  },
  {
    icon: Calendar,
    title: '2.title',
    description: '2.description',
  },
  {
    icon: LuxuryCatamaran,
    title: '3.title',
    description: '3.description',
  },
  {
    icon: Shield,
    title: '4.title',
    description: '4.description',
  },
  {
    icon: CustomerService,
    title: '5.title',
    description: '5.description',
  },
];
