import { meta } from '@/config/meta';

// Mario 19.11.2026: Google's result thumbnail is a crop, and with only the 1200x630 og:image it cut the
// "Welcome to ..." title. primaryImageOfPage points Google at the square version (title fits 1:1);
// og:image / twitter:image stay 1200x630 for Facebook and WhatsApp. None of these is drawn on the page.
const SHARE = `${meta.url}/meta/welcome-to-boat4you-three-charter-boats`;

export const homeWebPageJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'WebPage',
  isPartOf: { '@id': `${meta.url}/#website` },
  primaryImageOfPage: {
    '@type': 'ImageObject',
    url: `${SHARE}-1200x1200.jpg`,
    width: 1200,
    height: 1200,
  },
  image: [`${SHARE}-1200x1200.jpg`, `${SHARE}-1200x900.jpg`, `${SHARE}-title-centred-1200x630.jpg`],
  thumbnailUrl: `${SHARE}-1200x1200.jpg`,
};
