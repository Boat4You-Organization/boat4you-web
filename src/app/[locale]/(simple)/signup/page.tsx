import dynamic from 'next/dynamic';

const SignUp = dynamic(() => import('@/views/SignUp'));

interface PageProps {
  searchParams: Promise<{ inviteCode?: string }>;
}

export default async function SignUpPage({ searchParams }: PageProps) {
  const { inviteCode } = await searchParams;

  return <SignUp inviteCode={inviteCode} />;
}
