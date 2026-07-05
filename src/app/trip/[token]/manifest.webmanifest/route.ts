import { NextRequest, NextResponse } from 'next/server';

/**
 * Per-token PWA manifest — start_url/scope must point at THIS trip so the
 * installed icon opens the customer's own hub (the token is the only key).
 * The root /manifest.webmanifest keeps serving the main-site manifest.
 */
export async function GET(_req: NextRequest, { params }: { params: Promise<{ token: string }> }) {
  const { token } = await params;

  return NextResponse.json(
    {
      name: 'Boat4You Trip',
      short_name: 'B4Y Trip',
      description: 'Your charter trip companion — documents, crew, weather and more.',
      start_url: `/trip/${token}`,
      scope: `/trip/${token}`,
      display: 'standalone',
      orientation: 'portrait',
      background_color: '#0c2461',
      theme_color: '#0c2461',
      lang: 'en',
      icons: [
        { src: '/favicons/android-chrome-192x192.png', sizes: '192x192', type: 'image/png', purpose: 'any' },
        { src: '/favicons/android-chrome-512x512.png', sizes: '512x512', type: 'image/png', purpose: 'any' },
        { src: '/icons/maskable-512.png', sizes: '512x512', type: 'image/png', purpose: 'maskable' },
      ],
    },
    {
      headers: {
        'Content-Type': 'application/manifest+json',
        'X-Robots-Tag': 'noindex, nofollow',
      },
    }
  );
}
