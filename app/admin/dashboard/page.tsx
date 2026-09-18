import type { Metadata } from 'next';
import Link from 'next/link';
import { Pencil, Trash2, CheckCircle2, Mail, Plus } from 'lucide-react';
import { prisma } from '@/lib/prisma';
import { exigerAgent, filtreProprietaire, ROLE_SUPER } from '@/lib/admin';
import { formatPrice, categories, statuses } from '@/lib/site';
import type { Category, Status } from '@/lib/validations';
import { changerStatut, supprimerBien } from '@/app/admin/biens/actions';
import SubmitButton from '@/components/admin/SubmitButton';

export const metadata: Metadata = {
  title: 'Tableau de bord',
  robots: { index: false, follow: false },
};

export const dynamic = 'force-dynamic';

export default async function Dashboard() {
  const agent = await exigerAgent();
  const perimetre = filtreProprietaire(agent);

  const [total, disponibles, vendus, reserves, nonLus, biens, messages] = await Promise.all([
    prisma.property.count({ where: perimetre }),
    prisma.property.count({ where: { ...perimetre, status: 'DISPONIBLE' } }),
    prisma.property.count({ where: { ...perimetre, status: 'VENDU' } }),
    prisma.property.count({ where: { ...perimetre, status: 'RESERVE' } }),
    prisma.contactMessage.count({ where: { isRead: false } }),
    prisma.property.findMany({
      where: perimetre,
      orderBy: [{ status: 'asc' }, { updatedAt: 'desc' }],
      take: 50,
      select: {
        id: true,
        title: true,
        category: true,
        status: true,
        price: true,
        currency: true,
        location: true,
        featured: true,
        updatedAt: true,
      },
    }),
    prisma.contactMessage.findMany({
      orderBy: { createdAt: 'desc' },
      take: 5,
      include: { property: { select: { id: true, title: true } } },
    }),
  ]);

  const stats = [
    { label: 'Biens au total', valeur: total },
    { label: 'Disponibles', valeur: disponibles },
    { label: 'Reserves', valeur: reserves },
    { label: 'Vendus', valeur: vendus },
    { label: 'Messages non lus', valeur: nonLus, lien: '/admin/messages' },
  ];

  return (
    <div className="conteneur py-10">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl">Bonjour {agent.name.split(' ')[0]}</h1>
          <p className="mt-2 text-ardoise/85">
            {agent.role === ROLE_SUPER
              ? 'Vous voyez les fiches de toute l agence.'
              : 'Vous voyez et modifiez uniquement les fiches que vous avez creees.'}
          </p>
        </div>
        <Link href="/admin/biens/nouveau" className="btn-or">
          <Plus className="h-5 w-5" aria-hidden="true" />
          Ajouter un bien
        </Link>
      </div>

      <ul className="mt-8 grid gap-3 sm:grid-cols-3 lg:grid-cols-5">
        {stats.map((s) => (
          <li key={s.label} className="rounded-lg bg-white p-4 shadow-carte ring-1 ring-nuit/5">
            <p className="font-display text-3xl font-semibold text-nuit">{s.valeur}</p>
            <p className="mt-1 text-sm text-ardoise/75">
              {s.lien ? (
                <Link href={s.lien} className="underline">{s.label}</Link>
              ) : (
                s.label
              )}
            </p>
          </li>
        ))}
      </ul>

      {/* ------------------------------- Biens ------------------------------- */}
      <section className="mt-12" aria-labelledby="titre-biens">
        <h2 id="titre-biens" className="text-2xl">Vos biens</h2>

        {biens.length === 0 ? (
          <p className="mt-4 rounded-lg bg-white p-6 ring-1 ring-nuit/5">
            Aucune fiche pour l instant. Commencez par en ajouter une.
          </p>
        ) : (
          <div className="mt-4 overflow-x-auto rounded-lg bg-white shadow-carte ring-1 ring-nuit/5">
            <table className="w-full min-w-[720px] text-left text-sm">
              <caption className="sr-only">
                Liste de vos biens, avec actions de modification, de vente et de suppression
              </caption>
              <thead className="border-b border-nuit/10 text-nuit">
                <tr>
                  <th scope="col" className="p-3 font-semibold">Bien</th>
                  <th scope="col" className="p-3 font-semibold">Categorie</th>
                  <th scope="col" className="p-3 font-semibold">Prix</th>
                  <th scope="col" className="p-3 font-semibold">Statut</th>
                  <th scope="col" className="p-3 font-semibold">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-nuit/10">
                {biens.map((b) => {
                  const statut = statuses[b.status as Status] ?? statuses.DISPONIBLE;
                  return (
                    <tr key={b.id}>
                      <td className="p-3">
                        <Link href={`/biens/${b.id}`} className="font-medium text-nuit hover:underline">
                          {b.title}
                        </Link>
                        <p className="text-ardoise/60">{b.location}</p>
                      </td>
                      <td className="p-3">{categories[b.category as Category]?.label ?? b.category}</td>
                      <td className="p-3 whitespace-nowrap">{formatPrice(b.price, b.currency)}</td>
                      <td className="p-3">
                        <span className={`rounded px-2 py-1 text-xs font-semibold ring-1 ${statut.classes}`}>
                          {statut.label}
                        </span>
                      </td>
                      <td className="p-3">
                        <div className="flex flex-wrap items-center gap-2">
                          <Link
                            href={`/admin/biens/${b.id}/editer`}
                            className="inline-flex items-center gap-1.5 rounded-md border border-nuit/20 px-3 py-1.5 font-semibold text-nuit"
                          >
                            <Pencil className="h-4 w-4" aria-hidden="true" />
                            Editer
                          </Link>

                          {b.status !== 'VENDU' && (
                            <form action={changerStatut}>
                              <input type="hidden" name="id" value={b.id} />
                              <input type="hidden" name="status" value="VENDU" />
                              <SubmitButton
                                variante="contour"
                                enCours="..."
                                confirmation={`Marquer "${b.title}" comme vendu ?`}
                              >
                                <CheckCircle2 className="h-4 w-4" aria-hidden="true" />
                                Marquer vendu
                              </SubmitButton>
                            </form>
                          )}

                          <form action={supprimerBien}>
                            <input type="hidden" name="id" value={b.id} />
                            <SubmitButton
                              variante="danger"
                              enCours="..."
                              confirmation={`Supprimer definitivement "${b.title}" ? Cette action est irreversible.`}
                            >
                              <Trash2 className="h-4 w-4" aria-hidden="true" />
                              Supprimer
                            </SubmitButton>
                          </form>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </section>

      {/* ----------------------------- Messages ----------------------------- */}
      <section className="mt-12" aria-labelledby="titre-messages">
        <div className="flex items-end justify-between gap-4">
          <h2 id="titre-messages" className="text-2xl">Messages recents</h2>
          <Link href="/admin/messages" className="font-semibold text-nuit-600 hover:underline">
            Tout voir
          </Link>
        </div>

        {messages.length === 0 ? (
          <p className="mt-4 rounded-lg bg-white p-6 ring-1 ring-nuit/5">
            Aucun message recu. Les demandes du formulaire de contact arriveront ici.
          </p>
        ) : (
          <ul className="mt-4 space-y-3">
            {messages.map((m) => (
              <li key={m.id} className="rounded-lg bg-white p-4 shadow-carte ring-1 ring-nuit/5">
                <div className="flex flex-wrap items-center gap-3 text-sm">
                  <Mail className={m.isRead ? 'h-4 w-4 text-nuit/35' : 'h-4 w-4 text-or'} aria-hidden="true" />
                  <span className="font-semibold text-nuit">{m.name}</span>
                  <a href={`tel:${m.phone}`} className="underline">{m.phone}</a>
                  {m.property && (
                    <span className="text-ardoise/70">
                      a propos de{' '}
                      <Link href={`/biens/${m.property.id}`} className="underline">
                        {m.property.title}
                      </Link>
                    </span>
                  )}
                  <span className="ml-auto text-ardoise/55">
                    {new Intl.DateTimeFormat('fr-FR', { dateStyle: 'short', timeStyle: 'short' }).format(m.createdAt)}
                  </span>
                </div>
                <p className="mt-2 line-clamp-2 max-w-lisible text-ardoise/85">{m.message}</p>
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}
