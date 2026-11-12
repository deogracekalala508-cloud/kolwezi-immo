import type { Metadata } from 'next';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import SessionProvider from '@/components/SessionProvider';
import AdminNav from '@/components/admin/AdminNav';

export const metadata: Metadata = {
  title: 'Espace agence',
  // Aucune page d'administration ne doit finir dans un index de recherche.
  robots: { index: false, follow: false, nocache: true },
};

export const dynamic = 'force-dynamic';

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const session = await getServerSession(authOptions);
  const connecte = Boolean(session?.user?.id) && !session?.user?.twoFactorPending;

  return (
    <SessionProvider>
      <div className="min-h-[70vh] bg-nuit-50">
        {connecte && (
          <AdminNav nom={session?.user?.name ?? 'Agent'} role={session?.user?.role ?? 'ADMIN'} />
        )}
        {children}
      </div>
    </SessionProvider>
  );
}
