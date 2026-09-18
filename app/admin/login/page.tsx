import type { Metadata } from 'next';
import LoginForm from '@/components/admin/LoginForm';

export const metadata: Metadata = {
  title: 'Connexion a l espace agence',
  robots: { index: false, follow: false },
};

export default function Login() {
  return (
    <div className="conteneur flex min-h-[75vh] items-center justify-center py-16">
      <LoginForm />
    </div>
  );
}
