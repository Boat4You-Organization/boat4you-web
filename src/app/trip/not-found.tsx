import type { Metadata } from 'next';

import LogoWithoutText from '@/components/SvgIcons/LogoWithoutText';

/**
 * Farewell page for dead trip links (expired / removed tokens). Installed
 * Trip-PWA icons keep pointing at /trip/{token} long after the charter, so
 * this must read as "your voyage is complete — come back", never as an error
 * (Mario 21.7.2026, raw-404 screenshot). Dead tokens can also predate the
 * charter (link regenerated after a source swap), hence the "trip still
 * coming up?" rescue card. Same standalone visual language as TripHub:
 * Inter, green "finished" gradient, card stack, no site chrome.
 */

export const metadata: Metadata = {
  title: 'The adventure continues | Boat4You Trip',
  robots: { index: false, follow: false },
};

const SITE = 'https://www.boat4you.com/?utm_source=trip&utm_medium=pwa&utm_campaign=post_charter';
// Swap for the TripAdvisor / Google review URL once a public listing exists.
const REVIEW_URL =
  'mailto:info@boat4you.com?subject=My%20charter%20experience&body=Hi%20Boat4You%2C%0A%0AHere%27s%20how%20my%20trip%20went%3A%0A';

const TripNotFound = () => (
  <main
    style={{
      maxWidth: 480,
      margin: '0 auto',
      minHeight: '100dvh',
      fontFamily: "'Inter',-apple-system,'Segoe UI',Roboto,Arial,sans-serif",
      color: '#0f172a',
      display: 'flex',
      flexDirection: 'column',
    }}
  >
    <div
      style={{
        background: 'linear-gradient(160deg,#0a3d2e 0%,#16815f 60%,#3aa87c 100%)',
        color: '#fff',
        padding: '18px 18px 34px',
      }}
    >
      <a
        href="https://www.boat4you.com"
        style={{ display: 'flex', alignItems: 'center', gap: 7, color: '#fff', textDecoration: 'none' }}
      >
        <LogoWithoutText size={24} />
        <span style={{ fontWeight: 800, fontSize: 18, letterSpacing: '-0.01em' }}>boat4you</span>
      </a>
      <div aria-hidden="true" style={{ fontSize: 46, margin: '26px 0 6px' }}>
        ⚓
      </div>
      <h1 style={{ fontSize: 26, fontWeight: 800, letterSpacing: '-0.01em', lineHeight: 1.2, margin: 0 }}>
        This voyage is complete.
      </h1>
      <p style={{ fontSize: 17, fontWeight: 700, margin: '6px 0 0', opacity: 0.95 }}>
        But the adventure isn&apos;t over.
      </p>
      <p style={{ fontSize: 13.5, margin: '12px 0 0', opacity: 0.85, lineHeight: 1.55 }}>
        This trip page has sailed into the archive — thank you for travelling with Boat4You. The sea is still out there,
        and your next boat is already waiting.
      </p>
      <p style={{ fontSize: 13.5, margin: '8px 0 0', opacity: 0.85, lineHeight: 1.55 }}>
        Charter still ahead? Then this is just an outdated link — your booking is safe.
      </p>
    </div>

    <div style={{ padding: '16px 14px 28px', display: 'flex', flexDirection: 'column', gap: 10 }}>
      <a
        href={SITE}
        style={{
          display: 'block',
          textAlign: 'center',
          background: '#f3d300',
          color: '#442704',
          fontWeight: 800,
          fontSize: 15,
          borderRadius: 12,
          padding: '14px 10px',
          textDecoration: 'none',
        }}
      >
        <span aria-hidden="true">⛵</span> Find your next boat →
      </a>
      <a
        href={REVIEW_URL}
        style={{
          display: 'block',
          textAlign: 'center',
          background: '#2856ff',
          color: '#fff',
          fontWeight: 800,
          fontSize: 15,
          borderRadius: 12,
          padding: '14px 10px',
          textDecoration: 'none',
        }}
      >
        <span aria-hidden="true">⭐</span> Tell us how it went
      </a>
      <div
        style={{
          background: '#fff',
          border: '1px solid #e3e9f2',
          borderRadius: 14,
          padding: '13px 15px',
          color: '#5b6b82',
          fontSize: 12.5,
          lineHeight: 1.6,
        }}
      >
        <div style={{ color: '#0f172a', fontWeight: 800, fontSize: 14, marginBottom: 3 }}>Trip still coming up?</div>
        Then this is just an outdated link — your booking is safe. Open the newest link from your booking e-mail, or
        find everything under{' '}
        <a href="https://www.boat4you.com/my-bookings" style={{ color: '#2856ff', fontWeight: 700 }}>
          My bookings
        </a>
        .
      </div>
      <div
        style={{
          background: '#fff',
          border: '1px solid #e3e9f2',
          borderRadius: 14,
          padding: '13px 15px',
          color: '#5b6b82',
          fontSize: 12.5,
          lineHeight: 1.6,
        }}
      >
        Boat4You support:{' '}
        <a href="tel:+385913000009" style={{ color: '#2856ff', fontWeight: 700 }}>
          +385 91 3000 009
        </a>{' '}
        ·{' '}
        <a href="mailto:info@boat4you.com" style={{ color: '#2856ff', fontWeight: 700 }}>
          info@boat4you.com
        </a>
      </div>
    </div>
  </main>
);

export default TripNotFound;
