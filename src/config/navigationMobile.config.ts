import { ElementType } from 'react';

import About from '@/components/SvgIcons/About';
import Blog from '@/components/SvgIcons/Blog';
import Contact from '@/components/SvgIcons/Contact';
import Currency from '@/components/SvgIcons/Currency';
import FAQ from '@/components/SvgIcons/FAQ';
import Favorite from '@/components/SvgIcons/Favorite';
import Language from '@/components/SvgIcons/Language';
import Location from '@/components/SvgIcons/Location';

export type NavigationMobileItemTitle =
  | 'about.title'
  | 'about.frequentlyAskedQuestions'
  | 'about.aboutUs'
  | 'about.blog'
  | 'about.itineraries'
  | 'about.contact'
  | 'preferences.title'
  | 'preferences.favorites'
  | 'preferences.language'
  | 'preferences.currency'
  | 'profile.title';

export type NavigationMobileItemLink = {
  text: string;
  href?: string;
  icon?: ElementType;
  onClick?: (() => void) | undefined;
  badgeCount?: number;
};

export interface NavigationMobileItem {
  title: NavigationMobileItemTitle;
  links: NavigationMobileItemLink[];
}

const navigationMobile: NavigationMobileItem[] = [
  {
    title: 'about.title',
    links: [
      {
        text: 'about.frequentlyAskedQuestions',
        href: '/faq',
        icon: FAQ,
      },
      {
        text: 'about.aboutUs',
        href: '/about-us',
        icon: About,
      },
      {
        text: 'about.blog',
        href: '/blog',
        icon: Blog,
      },
      {
        text: 'about.itineraries',
        href: '/itineraries',
        icon: Location,
      },
      {
        text: 'about.contact',
        href: '/contact-us',
        icon: Contact,
      },
    ],
  },
  {
    title: 'preferences.title',
    links: [
      {
        text: 'preferences.favorites',
        icon: Favorite,
      },
      {
        text: 'preferences.language',
        icon: Language,
      },
      {
        text: 'preferences.currency',
        icon: Currency,
      },
    ],
  },
];

export default navigationMobile;
