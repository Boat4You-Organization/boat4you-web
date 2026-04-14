import dynamic from 'next/dynamic';

const CustomOffer = dynamic(() => import('@/views/CustomOffer'));

interface PageProps {
  params: Promise<{ hash: string }>;
}

export default async function CustomOfferPage({ params }: PageProps) {
  const { hash } = await params;

  return <CustomOffer hash={hash} />;
}
