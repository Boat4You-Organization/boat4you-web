import { NavigationLink } from '@/types/navigation-link';

export type FooterSection = 'network' | 'company' | 'legal';

// Order: company, legal, network — network last (rightmost on desktop)
// per Mario's preference. Sister-site URLs are www.* on purpose to
// match canonical hosts and avoid SEO duplicate-content flags.
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
  {
    title: 'network',
    links: [
      {
        displayName: 'Europe Yachts',
        href: 'https://www.europe-yachts.com',
        target: '_blank',
      },
      {
        displayName: 'Catamaran Charter Croatia',
        href: 'https://www.catamaran-croatia-charter.com',
        target: '_blank',
      },
      {
        displayName: 'Catamaran Charter Greece',
        href: 'https://www.catamaran-charter-greece.com',
        target: '_blank',
      },
      {
        displayName: 'Catamaran Charter Italy',
        href: 'https://www.catamarancharteritaly.com/',
        target: '_blank',
      },
      {
        displayName: 'Catamaran Charter Caribbean',
        href: 'https://www.catamaran-charter-caribbean.com',
        target: '_blank',
      },
    ],
  },
];

export default footerMenu;
