import type { Metadata } from 'next';
import Link from 'next/link';
import { exigerAgent } from '@/lib/admin';
import PropertyForm from '@/components/admin/PropertyForm';

export const metadata: Metadata = {
  title: 'Ajouter un bien',
  robots: { index: false, follow: false },
};

export const dynamic = 'force-dynamic';

export default async function NouveauBien() {
  await exigerAgent();

  return (
    <div className="conteneur py-10">
      <Link href="/admin/dashboard" className="text-sm font-semibold text-nuit-600 hover:underline">
        Retour au tableau de bord
      </Link>

      <h1 className="mt-3 text-3xl">Ajouter un bien</h1>
      <p className="mt-2 max-w-lisible text-ardoise/85">
        La fiche vous sera attribuee : vous seul, et le proprietaire de l agence, pourrez la
        modifier ensuite.
      </p>

      <div className="mt-8 max-w-3xl rounded-lg bg-white p-6 shadow-carte ring-1 ring-nuit/5">
        <PropertyForm />
      </div>
    </div>
  );
}
