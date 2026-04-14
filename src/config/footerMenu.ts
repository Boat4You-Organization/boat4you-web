import { NavigationLink } from '@/types/navigation-link';

export type FooterSection = 'company' | 'legal';

const footerMenu: NavigationLink[] = [
  {
    title: 'company',
    links: [
      {
        text: 'aboutUs',
        href: '/about-us',
      },
      {
        text: 'howWeWork',
        href: '/how-we-work',
      },
      {
        text: 'faq',
        href: '/faq',
      },
      {
        text: 'blog',
        href: '/blog',
      },
      {
        text: 'contact',
        href: '/contact-us',
      },
    ],
  },
  {
    title: 'legal',
    links: [
      {
        text: 'termsAndConditions',
        href: '/terms-and-conditions',
      },
      {
        text: 'privacyPolicy',
        href: '/privacy-policy',
      },
    ],
  },
];

export default footerMenu;
