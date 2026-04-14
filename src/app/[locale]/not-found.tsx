import type { Metadata } from 'next';

import StaticLayout from '@/components/StaticLayout';
import NotFoundPage from '@/views/NotFoundPage';

export const metadata: Metadata = {
  title: '404',
  robots: {
    index: false,
  },
};

const Error404Page = () => (
  <StaticLayout>
    <NotFoundPage />
  </StaticLayout>
);

export default Error404Page;
