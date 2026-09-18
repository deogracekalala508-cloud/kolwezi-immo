import type { Metadata } from 'next';
import { Phone, MapPin, Clock, MessageCircle } from 'lucide-react';
import Breadcrumbs from '@/components/Breadcrumbs';
import ContactForm from '@/components/ContactForm';
import { site } from '@/lib/site';
import { whatsappLink, generalMessage } from '@/lib/whatsapp';

export const metadata: Metadata = {
  title: 'Contacter l agence a Kolwezi',
  description:
    'Ecrivez a Humo Kolwezi : formulaire, WhatsApp ou passage au bureau de l avenue Manika. Reponse le jour meme du lundi au samedi.',
  alternates: { canonical: '/contact' },
  openGraph: {
    title: 'Contacter Humo Kolwezi',
    description: 'Formulaire, WhatsApp ou visite au bureau de l avenue Manika a Kolwezi.',
    url: '/contact',
  },
};

export default function Contact() {
  return (
    <div className="conteneur pb-20">
      <Breadcrumbs items={[{ label: 'Contact' }]} />

      <div className="grid gap-10 lg:grid-cols-[1.2fr_1fr] lg:items-start">
        <div>
          <h1 className="text-3xl sm:text-4xl">Dites-nous ce que vous cherchez</h1>
          <p className="mt-3 max-w-lisible text-ardoise/85">
            Type de bien, quartier, budget : plus vous etes precis, plus notre reponse sera utile.
            Nous rappelons sur le numero que vous laissez.
          </p>

          <div className="mt-8 rounded-lg bg-white p-6 shadow-carte ring-1 ring-nuit/5">
            <ContactForm />
          </div>
        </div>

        <aside className="space-y-6">
          <div className="rounded-lg bg-nuit p-6 text-white">
            <h2 className="text-xl text-white">Le plus rapide : WhatsApp</h2>
            <p className="mt-2 text-white/85">
              Nos agents repondent en general dans l heure pendant les horaires d ouverture.
            </p>
            <a
              href={whatsappLink(generalMessage)}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-4 flex items-center justify-center gap-2 rounded-md bg-[#128C7E] px-5 py-3.5 font-semibold text-white hover:bg-[#0f7a6d]"
            >
              <MessageCircle className="h-5 w-5" aria-hidden="true" />
              Ouvrir la discussion
            </a>
          </div>

          <address className="not-italic rounded-lg bg-white p-6 shadow-carte ring-1 ring-nuit/5">
            <h2 className="text-xl">Le bureau</h2>
            <ul className="mt-4 space-y-3 text-ardoise/85">
              <li className="flex gap-2">
                <MapPin className="mt-0.5 h-5 w-5 shrink-0 text-cuivre" aria-hidden="true" />
                <span>
                  {site.address.street}
                  <br />
                  {site.address.quartier}, {site.address.city}, RDC
                </span>
              </li>
              <li className="flex gap-2">
                <Phone className="mt-0.5 h-5 w-5 shrink-0 text-cuivre" aria-hidden="true" />
                <a href={`tel:+${site.whatsapp}`} className="underline">+{site.whatsapp}</a>
              </li>
              <li className="flex gap-2">
                <Clock className="mt-0.5 h-5 w-5 shrink-0 text-cuivre" aria-hidden="true" />
                <span>{site.hours}</span>
              </li>
            </ul>
          </address>
        </aside>
      </div>
    </div>
  );
}
