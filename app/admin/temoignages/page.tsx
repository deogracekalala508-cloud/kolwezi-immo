import type { Metadata } from 'next';
import { Star, Trash2, Eye, EyeOff } from 'lucide-react';
import { prisma } from '@/lib/prisma';
import { exigerAgent } from '@/lib/admin';
import { basculerPublicationAvis, supprimerTemoignage } from '@/app/admin/actions';
import SubmitButton from '@/components/admin/SubmitButton';
import SupprimerActionForm from '@/components/admin/SupprimerActionForm';
import TemoignageForm from '@/components/admin/TemoignageForm';

export const metadata: Metadata = {
  title: 'Avis clients',
  robots: { index: false, follow: false },
};

export const dynamic = 'force-dynamic';

export default async function AdminTemoignages() {
  await exigerAgent();

  const avis = await prisma.testimonial.findMany({ orderBy: { createdAt: 'desc' } });

  return (
    <div className="conteneur py-10">
      <h1 className="text-3xl">Avis clients</h1>
      <p className="mt-2 max-w-lisible text-ardoise/85">
        N ajoutez un avis qu avec l accord de la personne citee. Les avis depublies disparaissent
        immediatement de la page d accueil.
      </p>

      <div className="mt-8 grid gap-8 lg:grid-cols-[1fr_1.3fr] lg:items-start">
        <div className="rounded-lg bg-white p-6 shadow-carte ring-1 ring-nuit/5">
          <h2 className="text-xl">Ajouter un avis</h2>
          <div className="mt-4">
            <TemoignageForm />
          </div>
        </div>

        <ul className="space-y-3">
          {avis.length === 0 && (
            <li className="rounded-lg bg-white p-6 ring-1 ring-nuit/5">Aucun avis enregistre.</li>
          )}

          {avis.map((a) => (
            <li key={a.id} className="rounded-lg bg-white p-5 shadow-carte ring-1 ring-nuit/5">
              <div className="flex items-center justify-between gap-3">
                <p className="flex gap-0.5" aria-label={`Note de ${a.rating} sur 5`}>
                  {[1, 2, 3, 4, 5].map((i) => (
                    <Star
                      key={i}
                      aria-hidden="true"
                      className={i <= a.rating ? 'h-4 w-4 fill-or text-or' : 'h-4 w-4 text-nuit/20'}
                    />
                  ))}
                </p>
                <span className={a.published ? 'text-sm text-emerald-700' : 'text-sm text-ardoise/55'}>
                  {a.published ? 'Publie' : 'Masque'}
                </span>
              </div>

              <blockquote className="mt-3 max-w-lisible text-ardoise/90">{a.content}</blockquote>
              <p className="mt-2 text-sm font-semibold text-nuit">{a.clientName}</p>

              <div className="mt-4 flex flex-wrap gap-2">
                <form action={basculerPublicationAvis}>
                  <input type="hidden" name="id" value={a.id} />
                  <SubmitButton variante="contour" enCours="...">
                    {a.published ? (
                      <><EyeOff className="h-4 w-4" aria-hidden="true" /> Masquer</>
                    ) : (
                      <><Eye className="h-4 w-4" aria-hidden="true" /> Publier</>
                    )}
                  </SubmitButton>
                </form>

                <SupprimerActionForm
                  action={supprimerTemoignage}
                  id={a.id}
                  confirmation="Supprimer cet avis ?"
                >
                  <><Trash2 className="h-4 w-4" aria-hidden="true" /> Supprimer</>
                </SupprimerActionForm>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
