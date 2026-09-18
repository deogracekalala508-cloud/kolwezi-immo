import type { Metadata } from 'next';
import Link from 'next/link';
import { CheckCircle2, MessageCircle } from 'lucide-react';
import { whatsappLink, generalMessage } from '@/lib/whatsapp';
import { site } from '@/lib/site';

export const metadata: Metadata = {
  title: 'Message bien recu',
  description:
    'Votre message est arrive chez Humo Kolwezi. Un agent vous rappelle sous 24 heures ouvrables.',
  // Page de conversion : utile au visiteur, sans interet pour la recherche.
  robots: { index: false, follow: true },
};

export default function Merci() {
  return (
    <div className="conteneur flex min-h-[60vh] items-center justify-center py-16">
      <div className="max-w-xl text-center">
        <CheckCircle2 className="mx-auto h-14 w-14 text-emerald-600" aria-hidden="true" />
        <h1 className="mt-6 text-3xl sm:text-4xl">Message bien recu</h1>
        <p className="mx-auto mt-4 max-w-lisible text-lg text-ardoise/85">
          Un agent vous rappelle sous 24 heures ouvrables, {site.hours.toLowerCase()}. Si votre
          demande est urgente, ecrivez-nous directement sur WhatsApp.
        </p>

        <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
          <a
            href={whatsappLink(generalMessage)}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center gap-2 rounded-md bg-[#128C7E] px-5 py-3 font-semibold text-white hover:bg-[#0f7a6d]"
          >
            <MessageCircle className="h-5 w-5" aria-hidden="true" />
            Ecrire sur WhatsApp
          </a>
          <Link href="/biens" className="btn-contour">Continuer a voir les biens</Link>
        </div>

        <p className="mt-10 text-sm text-ardoise/70">
          En attendant, jetez un oeil aux{' '}
          <Link href="/faq" className="underline">questions frequentes</Link> : frais, delais et
          verification des titres y sont detailles.
        </p>
      </div>
    </div>
  );
}
