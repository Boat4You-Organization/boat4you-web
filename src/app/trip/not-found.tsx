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
// Tripadvisor listing (Europe Yachts Charter, Split — Mario 21.7.2026).
// Keep in sync with TripHub.tsx.
const REVIEW_URL =
  'https://www.tripadvisor.com/Attraction_Review-g295370-d12422829-Reviews-Europe_Yachts_Charter-Split_Split_Dalmatia_County_Dalmatia.html';
const VOUCHER_MAILTO =
  'mailto:info@boat4you.com?subject=Tripadvisor%20review%20%E2%80%94%20%E2%82%AC50%20voucher&body=Hi%20Boat4You%2C%0A%0AI%20just%20left%20a%20Tripadvisor%20review%20under%20the%20name%3A%20%0A%0APlease%20send%20me%20my%20%E2%82%AC50%20voucher%20for%20the%20next%20adventure!%0A';

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
        target="_blank"
        rel="noopener noreferrer"
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
        <span aria-hidden="true">⭐</span> Review us on Tripadvisor → get a €50 voucher
      </a>
      <div
        style={{
          background: '#eafaf1',
          border: '1px solid #bce6cf',
          borderRadius: 14,
          padding: '13px 15px',
          color: '#0a3d2e',
          fontSize: 12.5,
          lineHeight: 1.6,
        }}
      >
        <div style={{ fontWeight: 800, fontSize: 14, marginBottom: 3 }}>
          <span aria-hidden="true">🎁</span> €50 for your next adventure
        </div>
        Leave a review on Tripadvisor, then{' '}
        <a href={VOUCHER_MAILTO} style={{ color: '#16815f', fontWeight: 700 }}>
          e-mail us the name you reviewed under
        </a>{' '}
        — we&apos;ll send you a <b>€50 voucher</b> for your next booking with Boat4You.
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
