import type { Metadata } from 'next';
import { Trash2 } from 'lucide-react';
import { prisma } from '@/lib/prisma';
import { exigerAgent } from '@/lib/admin';
import { supprimerFaq } from '@/app/admin/actions';
import SubmitButton from '@/components/admin/SubmitButton';
import FaqForm from '@/components/admin/FaqForm';

export const metadata: Metadata = {
  title: 'Questions frequentes',
  robots: { index: false, follow: false },
};

export const dynamic = 'force-dynamic';

export default async function AdminFaq() {
  await exigerAgent();
  const items = await prisma.faqItem.findMany({ orderBy: { order: 'asc' } });

  return (
    <div className="conteneur py-10">
      <h1 className="text-3xl">Questions frequentes</h1>
      <p className="mt-2 max-w-lisible text-ardoise/85">
        Ces questions alimentent la page FAQ, le bloc de la page d accueil et le balisage
        Schema.org lu par Google. L ordre le plus petit s affiche en premier.
      </p>

      <div className="mt-8 rounded-lg bg-white p-6 shadow-carte ring-1 ring-nuit/5">
        <h2 className="text-xl">Ajouter une question</h2>
        <div className="mt-4 max-w-2xl">
          <FaqForm />
        </div>
      </div>

      <h2 className="mt-12 text-2xl">Questions en ligne ({items.length})</h2>

      <ul className="mt-4 space-y-3">
        {items.length === 0 && (
          <li className="rounded-lg bg-white p-6 ring-1 ring-nuit/5">Aucune question enregistree.</li>
        )}

        {items.map((item) => (
          <li key={item.id} className="rounded-lg bg-white p-5 shadow-carte ring-1 ring-nuit/5">
            <details>
              <summary className="cursor-pointer font-display text-lg font-semibold text-nuit">
                {item.order}. {item.question}
              </summary>

              <div className="mt-4 max-w-2xl border-t border-nuit/10 pt-4">
                <FaqForm valeurs={{ id: item.id, question: item.question, answer: item.answer, order: item.order }} />

                <form action={supprimerFaq} className="mt-4">
                  <input type="hidden" name="id" value={item.id} />
                  <SubmitButton variante="danger" enCours="..." confirmation="Supprimer cette question ?">
                    <Trash2 className="h-4 w-4" aria-hidden="true" />
                    Supprimer
                  </SubmitButton>
                </form>
              </div>
            </details>
          </li>
        ))}
      </ul>
    </div>
  );
}
