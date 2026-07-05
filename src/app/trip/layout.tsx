import type { ReactNode } from 'react';

/**
 * Root layout for the Boat4You Trip PWA hub (/trip/{token}) — a second root
 * layout next to app/[locale]/layout.tsx (Next multiple-root-layouts). The hub
 * is a standalone, English-only, mobile-first surface: no site header/footer,
 * its own theme color, and a per-token manifest linked from the page metadata.
 */
const TripLayout = ({ children }: { children: ReactNode }) => (
  <html lang="en">
    <body style={{ margin: 0, background: '#f3f6fb' }}>{children}</body>
  </html>
);

export default TripLayout;
