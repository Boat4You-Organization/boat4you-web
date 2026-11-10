import { NavigationLink } from '@/types/navigation-link';

export type FooterSection = 'explore' | 'company' | 'legal';

// Footer link columns (Mario's design "Footer 1a", 10.11.2026): Explore, Company, Legal. Labels are
// `navigation.footer.<section>.<text>`. The Legal column also carries the cookie-settings button (Footer.tsx).
const footerMenu: NavigationLink[] = [
  {
    title: 'explore',
    links: [
      // Sitewide entry point into the crawlable /fleet directory. /search
      // renders zero boats on a parameter-free request (the only request
      // Googlebot makes), so without this link the catalogue had a sitemap
      // entry and no internal link anywhere on the site.
      {
        text: 'fleet',
        href: '/fleet',
      },
      // Sitewide entry point into the /yachts model pages (index → brand
      // hubs → models), which had no internal link before 25.9.2026.
      {
        text: 'yachtModels',
        href: '/yachts',
      },
      // Hub of the country price guides (/yacht-charter-prices/{country}),
      // the data pages built from the nightly charter facts (27.9.2026).
      {
        text: 'priceGuides',
        href: '/yacht-charter-prices',
      },
      {
        text: 'blog',
        href: '/blog',
      },
    ],
  },
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

// "Our network" row. Brand names, not translated. Sister-site URLs are www.* on
// purpose to match canonical hosts; every link is nofollow (utils/static/networkLinks).
export const footerNetwork: { name: string; href: string }[] = [
  { name: 'Europe Yachts', href: 'https://www.europe-yachts.com' },
  { name: 'Catamaran Croatia', href: 'https://www.catamaran-croatia-charter.com' },
  { name: 'Catamaran Greece', href: 'https://www.catamaran-charter-greece.com' },
  { name: 'Catamaran Italy', href: 'https://www.catamarancharteritaly.com/' },
  { name: 'Catamaran Caribbean', href: 'https://www.catamaran-charter-caribbean.com' },
  { name: 'Yacht Charter Croatia', href: 'https://www.croatia-yachting.com' },
];

export default footerMenu;
