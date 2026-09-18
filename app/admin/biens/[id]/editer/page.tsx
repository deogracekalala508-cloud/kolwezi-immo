import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { exigerAgent } from '@/lib/admin';
import { lireBienEditable } from '@/app/admin/biens/actions';
import PropertyForm from '@/components/admin/PropertyForm';
import Alerte from '@/components/admin/Alerte';

export const metadata: Metadata = {
  title: 'Modifier un bien',
  robots: { index: false, follow: false },
};

export const dynamic = 'force-dynamic';

type Props = { params: { id: string }; searchParams: { cree?: string } };

export default async function EditerBien({ params, searchParams }: Props) {
  await exigerAgent();

  // lireBienEditable applique deja le filtre proprietaire : une fiche qui ne
  // vous appartient pas se comporte exactement comme une fiche inexistante.
  const bien = await lireBienEditable(params.id);
  if (!bien) notFound();

  return (
    <div className="conteneur py-10">
      <Link href="/admin/dashboard" className="text-sm font-semibold text-nuit-600 hover:underline">
        Retour au tableau de bord
      </Link>

      <h1 className="mt-3 text-3xl">Modifier le bien</h1>
      <p className="mt-2 text-ardoise/85">
        Reference {bien.id.slice(-6).toUpperCase()} &middot;{' '}
        <Link href={`/biens/${bien.id}`} className="underline" target="_blank">
          Voir la fiche publique
        </Link>
      </p>

      <div className="mt-6 max-w-3xl space-y-6">
        {searchParams.cree === '1' && (
          <Alerte etat={{ ok: true, message: 'Bien publie. Il apparait deja dans le catalogue.' }} />
        )}

        <div className="rounded-lg bg-white p-6 shadow-carte ring-1 ring-nuit/5">
          <PropertyForm
            valeurs={{
              id: bien.id,
              title: bien.title,
              description: bien.description,
              category: bien.category,
              status: bien.status,
              price: Math.round(bien.price / 100),
              location: bien.location,
              featured: bien.featured,
              images: bien.imagesParsees,
            }}
          />
        </div>
      </div>
    </div>
  );
}
