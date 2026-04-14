import dynamic from 'next/dynamic';

const ForgotPassword = dynamic(() => import('@/views/ForgotPassword'));

interface PageProps {
  searchParams: Promise<{ passwordResetCode?: string }>;
}

export default async function ForgotPasswordPage({ searchParams }: PageProps) {
  const { passwordResetCode } = await searchParams;

  return <ForgotPassword resetCode={passwordResetCode} />;
}
