import type { Metadata } from 'next';
import { redirect } from 'next/navigation';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import LoginForm from '@/components/admin/LoginForm';

export const metadata: Metadata = {
  title: 'Connexion à l’espace agence',
  robots: { index: false, follow: false },
};

export const dynamic = 'force-dynamic';

export default async function Login() {
  const session = await getServerSession(authOptions);
  if (session?.user?.id) {
    redirect('/admin/dashboard');
  }

  return (
    <div className="conteneur flex min-h-[75vh] items-center justify-center py-16">
      <LoginForm />
    </div>
  );
}
