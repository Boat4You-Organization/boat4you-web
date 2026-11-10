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

// "Secure payments by Mollie" row (Mario 10.11.2026): only methods our Mollie checkout really offers — bookings
// take cards and Apple Pay (Google Pay shows inside the card page), /pay adds Pay by Bank; no Klarna, no PayPal
// (backend MollieBookingPaymentService / CustomPaymentService). Apple Pay and Google Pay are Mollie's own method icons
// (api.mollie.com/v2/methods); Mollie has no card-brand icons, so Visa, Mastercard and American Express are the
// official marks from Wikimedia Commons in the same 32x24 tile (Mario's choice; Amex added at his request).
// All hosted in public/images/payments; brand names are not translated.
export const footerPaymentMethods: { name: string; src: string }[] = [
  { name: 'Visa', src: '/images/payments/visa-card-payment-method.svg' },
  { name: 'Mastercard', src: '/images/payments/mastercard-card-payment-method.svg' },
  { name: 'American Express', src: '/images/payments/american-express-card-payment-method.svg' },
  { name: 'Apple Pay', src: '/images/payments/apple-pay-payment-method.svg' },
  { name: 'Google Pay', src: '/images/payments/google-pay-payment-method.svg' },
];

export default footerMenu;
