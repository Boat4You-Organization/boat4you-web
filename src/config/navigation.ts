import Link from '@/types/link.type';

export type NavItem = 'faq' | 'aboutUs' | 'blog' | 'itineraries' | 'contact';

interface NavLink extends Link {
  text: NavItem;
}

const navigation: NavLink[] = [
  {
    text: 'faq',
    href: '/faq',
  },
  {
    text: 'aboutUs',
    href: '/about-us',
  },
  {
    text: 'blog',
    href: '/blog',
  },
  {
    text: 'itineraries',
    href: '/itineraries',
  },
  {
    text: 'contact',
    href: '/contact-us',
  },
];

export default navigation;
