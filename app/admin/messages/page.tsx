import type { Metadata } from 'next';
import Link from 'next/link';
import { Mail, MailOpen, Trash2, Phone } from 'lucide-react';
import { prisma } from '@/lib/prisma';
import { exigerAgent } from '@/lib/admin';
import { basculerLecture, supprimerMessage } from '@/app/admin/actions';
import SubmitButton from '@/components/admin/SubmitButton';
import SupprimerActionForm from '@/components/admin/SupprimerActionForm';
import { whatsappLink } from '@/lib/whatsapp';

export const metadata: Metadata = {
  title: 'Messages',
  robots: { index: false, follow: false },
};

export const dynamic = 'force-dynamic';

type Props = { searchParams: { filtre?: string } };

export default async function Messages({ searchParams }: Props) {
  await exigerAgent();

  const nonLusSeulement = searchParams.filtre === 'non-lus';

  const messages = await prisma.contactMessage.findMany({
    where: nonLusSeulement ? { isRead: false } : {},
    orderBy: [{ isRead: 'asc' }, { createdAt: 'desc' }],
    take: 200,
    include: { property: { select: { id: true, title: true } } },
  });

  return (
    <div className="conteneur py-10">
      <h1 className="text-3xl">Messages</h1>
      <p className="mt-2 text-ardoise/85">
        Demandes envoyees depuis le formulaire de contact et les fiches de biens.
      </p>

      <div className="mt-6 flex gap-2">
        <Link
          href="/admin/messages"
          className={nonLusSeulement ? 'btn-contour py-2 text-sm' : 'btn-nuit py-2 text-sm'}
        >
          Tous
        </Link>
        <Link
          href="/admin/messages?filtre=non-lus"
          className={nonLusSeulement ? 'btn-nuit py-2 text-sm' : 'btn-contour py-2 text-sm'}
        >
          Non lus
        </Link>
      </div>

      {messages.length === 0 ? (
        <p className="mt-8 rounded-lg bg-white p-6 ring-1 ring-nuit/5">
          {nonLusSeulement ? 'Tout est lu. Rien ne vous attend.' : 'Aucun message pour le moment.'}
        </p>
      ) : (
        <ul className="mt-8 space-y-3">
          {messages.map((m) => (
            <li
              key={m.id}
              className={`rounded-lg bg-white p-5 shadow-carte ring-1 ${
                m.isRead ? 'ring-nuit/5' : 'ring-or/50'
              }`}
            >
              <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-sm">
                {m.isRead ? (
                  <MailOpen className="h-5 w-5 text-nuit/35" aria-label="Message lu" />
                ) : (
                  <Mail className="h-5 w-5 text-or" aria-label="Message non lu" />
                )}
                <span className="font-semibold text-nuit">{m.name}</span>
                <a href={`tel:${m.phone}`} className="underline">{m.phone}</a>
                {m.email && <a href={`mailto:${m.email}`} className="underline">{m.email}</a>}
                <span className="ml-auto text-ardoise/55">
                  {new Intl.DateTimeFormat('fr-FR', { dateStyle: 'long', timeStyle: 'short' }).format(m.createdAt)}
                </span>
              </div>

              {m.property && (
                <p className="mt-2 text-sm">
                  A propos de{' '}
                  <Link href={`/biens/${m.property.id}`} className="font-medium underline">
                    {m.property.title}
                  </Link>
                </p>
              )}

              <p className="mt-3 max-w-lisible whitespace-pre-line text-ardoise/90">{m.message}</p>

              <div className="mt-4 flex flex-wrap items-center gap-2">
                <a
                  href={whatsappLink(
                    `Bonjour ${m.name.split(' ')[0]}, ici Humo Kolwezi. Nous revenons vers vous au sujet de votre message.`,
                    m.phone,
                  )}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 rounded-md bg-[#128C7E] px-4 py-2 text-sm font-semibold text-white"
                >
                  <Phone className="h-4 w-4" aria-hidden="true" />
                  Repondre sur WhatsApp
                </a>

                <form action={basculerLecture}>
                  <input type="hidden" name="id" value={m.id} />
                  <SubmitButton variante="contour" enCours="...">
                    {m.isRead ? 'Marquer non lu' : 'Marquer lu'}
                  </SubmitButton>
                </form>

                <SupprimerActionForm
                  action={supprimerMessage}
                  id={m.id}
                  confirmation="Supprimer definitivement ce message ?"
                >
                  <><Trash2 className="h-4 w-4" aria-hidden="true" /> Supprimer</>
                </SupprimerActionForm>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
