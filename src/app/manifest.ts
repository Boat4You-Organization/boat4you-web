import type { MetadataRoute } from 'next';

// Web App Manifest — Next serves this at /manifest.webmanifest and the root
// layout links it. Replaces the old placeholder /favicons/site.webmanifest
// ("MyWebSite"). Icons reuse the existing favicon set in /public/favicons.
export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'Boat4You — Yacht Charter & Boat Rental Worldwide',
    short_name: 'Boat4You',
    description: 'Compare thousands of yacht charters worldwide and book your boat in one click.',
    start_url: '/',
    scope: '/',
    display: 'standalone',
    orientation: 'portrait',
    background_color: '#ffffff',
    theme_color: '#0a2540',
    lang: 'en',
    categories: ['travel', 'shopping', 'lifestyle'],
    icons: [
      { src: '/favicons/android-chrome-192x192.png', sizes: '192x192', type: 'image/png', purpose: 'any' },
      { src: '/favicons/android-chrome-512x512.png', sizes: '512x512', type: 'image/png', purpose: 'any' },
      { src: '/icons/maskable-512.png', sizes: '512x512', type: 'image/png', purpose: 'maskable' },
    ],
  };
}
