import type { Metadata } from 'next';

import StaticLayout from '@/components/StaticLayout';
import NotFoundPage from '@/views/NotFoundPage';

// The 404 must not inherit the locale layout's canonical (the locale home)
// and its 10 hreflang alternates: a missing boat declared itself a copy of
// /pt with a full hreflang cluster (audit 26.9.2026, B02/R3). An empty
// `alternates` replaces the layout's object wholesale — no canonical, no
// hreflang; openGraph.url goes for the same reason.
export const metadata: Metadata = {
  title: '404',
  robots: {
    index: false,
    follow: true,
  },
  alternates: {},
  openGraph: {},
};

const Error404Page = () => (
  <StaticLayout>
    <NotFoundPage />
  </StaticLayout>
);

export default Error404Page;
