import type { Metadata } from 'next';
import Link from 'next/link';
import Image from 'next/image';
import { Trash2, Eye, EyeOff } from 'lucide-react';
import { prisma } from '@/lib/prisma';
import { exigerAgent, filtreProprietaire } from '@/lib/admin';
import { supprimerEtude, basculerPublicationEtude } from '@/app/admin/actions';
import SubmitButton from '@/components/admin/SubmitButton';
import SupprimerActionForm from '@/components/admin/SupprimerActionForm';
import EtudeForm from '@/components/admin/EtudeForm';

export const metadata: Metadata = {
  title: 'Etudes de cas',
  robots: { index: false, follow: false },
};

export const dynamic = 'force-dynamic';

export default async function AdminEtudes() {
  const agent = await exigerAgent();

  const etudes = await prisma.caseStudy.findMany({
    where: filtreProprietaire(agent),
    orderBy: [{ order: 'asc' }, { createdAt: 'desc' }],
  });

  return (
    <div className="conteneur py-10">
      <h1 className="text-3xl">Etudes de cas</h1>
      <p className="mt-2 max-w-lisible text-ardoise/85">
        Des ventes reelles racontees en trois temps : la situation, ce que vous avez fait, le
        resultat. C est ce qui convainc le mieux un vendeur hesitant.{' '}
        <Link href="/etudes-de-cas" className="underline" target="_blank">
          Voir la page publique
        </Link>
        .
      </p>

      <div className="mt-8 rounded-lg bg-white p-6 shadow-carte ring-1 ring-nuit/5">
        <h2 className="text-xl">Ajouter une etude de cas</h2>
        <div className="mt-4 max-w-3xl">
          <EtudeForm />
        </div>
      </div>

      <h2 className="mt-12 text-2xl">Etudes enregistrees ({etudes.length})</h2>

      <ul className="mt-4 space-y-3">
        {etudes.length === 0 && (
          <li className="rounded-lg bg-white p-6 ring-1 ring-nuit/5">
            Aucune etude pour l instant. La premiere est souvent la plus difficile a ecrire :
            partez d une vente dont vous etes fier.
          </li>
        )}

        {etudes.map((e) => (
          <li key={e.id} className="rounded-lg bg-white p-5 shadow-carte ring-1 ring-nuit/5">
            <details>
              <summary className="cursor-pointer">
                <span className="font-display text-lg font-semibold text-nuit">{e.title}</span>
                <span className="ml-2 text-sm text-ardoise/60">
                  {e.metric} &middot; {e.published ? 'publiee' : 'masquee'}
                </span>
              </summary>

              <div className="mt-4 border-t border-nuit/10 pt-4">
                {e.image && (
                  <div className="relative mb-4 h-32 w-48 overflow-hidden rounded">
                    <Image src={e.image} alt={e.imageAlt} fill sizes="192px" className="object-cover" unoptimized />
                  </div>
                )}

                <div className="max-w-3xl">
                  <EtudeForm
                    valeurs={{
                      id: e.id,
                      title: e.title,
                      client: e.client,
                      category: e.category,
                      location: e.location,
                      challenge: e.challenge,
                      approach: e.approach,
                      result: e.result,
                      metric: e.metric,
                      image: e.image,
                      imageAlt: e.imageAlt,
                      published: e.published,
                      order: e.order,
                    }}
                  />
                </div>

                <div className="mt-4 flex flex-wrap gap-2">
                 <form action={basculerPublicationEtude}>
                   <input type="hidden" name="id" value={e.id} />
                   <SubmitButton variante="contour" enCours="...">
                     {e.published ? (
                       <><EyeOff className="h-4 w-4" aria-hidden="true" /> Masquer</>
                     ) : (
                       <><Eye className="h-4 w-4" aria-hidden="true" /> Publier</>
                     )}
                   </SubmitButton>
                 </form>

                 <SupprimerActionForm
                   action={supprimerEtude}
                   id={e.id}
                   confirmation="Supprimer cette etude de cas ?"
                 >
                   <><Trash2 className="h-4 w-4" aria-hidden="true" /> Supprimer</>
                 </SupprimerActionForm>
                </div>
              </div>
            </details>
          </li>
        ))}
      </ul>
    </div>
  );
}
