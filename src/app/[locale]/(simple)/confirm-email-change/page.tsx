import dynamic from 'next/dynamic';

const ConfirmEmailChange = dynamic(() => import('@/views/ConfirmEmailChange'));

interface PageProps {
  searchParams: Promise<{ token?: string }>;
}

export default async function ConfirmEmailChangePage({ searchParams }: PageProps) {
  const { token } = await searchParams;

  return <ConfirmEmailChange token={token} />;
}
