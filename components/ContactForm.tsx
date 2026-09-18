'use client';

import { useFormState, useFormStatus } from 'react-dom';
import { Send, AlertCircle } from 'lucide-react';
import { envoyerMessage, type ContactState } from '@/app/contact/actions';

function BoutonEnvoyer() {
  const { pending } = useFormStatus();
  return (
    <button type="submit" disabled={pending} className="btn-or w-full disabled:opacity-60 sm:w-auto">
      <Send className="h-5 w-5" aria-hidden="true" />
      {pending ? 'Envoi en cours' : 'Envoyer le message'}
    </button>
  );
}

export default function ContactForm({
  propertyId,
  propertyTitle,
}: {
  propertyId?: string;
  propertyTitle?: string;
}) {
  const [etat, action] = useFormState<ContactState, FormData>(envoyerMessage, {});
  const v = etat.valeurs;
  const e = etat.erreurs;

  return (
    <form action={action} noValidate className="space-y-5">
      {propertyId && <input type="hidden" name="propertyId" value={propertyId} />}

      {propertyTitle && (
        <p className="rounded-md bg-nuit-50 p-3 text-sm text-nuit">
          Votre message porte sur : <span className="font-semibold">{propertyTitle}</span>
        </p>
      )}

      {e?.global && (
        <p role="alert" className="flex gap-2 rounded-md bg-red-50 p-3 text-sm font-medium text-red-800">
          <AlertCircle className="h-5 w-5 shrink-0" aria-hidden="true" />
          {e.global}
        </p>
      )}

      <div>
        <label htmlFor="name" className="etiquette">Nom complet</label>
        <input
          id="name"
          name="name"
          type="text"
          required
          autoComplete="name"
          defaultValue={v?.name}
          aria-invalid={Boolean(e?.name)}
          aria-describedby={e?.name ? 'erreur-name' : undefined}
          className="champ"
        />
        {e?.name && <p id="erreur-name" className="erreur">{e.name}</p>}
      </div>

      <div>
        <label htmlFor="phone" className="etiquette">Telephone</label>
        <input
          id="phone"
          name="phone"
          type="tel"
          required
          inputMode="tel"
          autoComplete="tel"
          placeholder="+243 97 123 45 67"
          defaultValue={v?.phone}
          aria-invalid={Boolean(e?.phone)}
          aria-describedby={e?.phone ? 'erreur-phone' : 'aide-phone'}
          className="champ"
        />
        {e?.phone ? (
          <p id="erreur-phone" className="erreur">{e.phone}</p>
        ) : (
          <p id="aide-phone" className="mt-1.5 text-sm text-ardoise/65">
            Numero RDC. C est par la que nous vous repondons le plus vite.
          </p>
        )}
      </div>

      <div>
        <label htmlFor="email" className="etiquette">
          E-mail <span className="font-normal text-ardoise/60">(facultatif)</span>
        </label>
        <input
          id="email"
          name="email"
          type="email"
          autoComplete="email"
          defaultValue={v?.email}
          aria-invalid={Boolean(e?.email)}
          aria-describedby={e?.email ? 'erreur-email' : undefined}
          className="champ"
        />
        {e?.email && <p id="erreur-email" className="erreur">{e.email}</p>}
      </div>

      <div>
        <label htmlFor="message" className="etiquette">Votre message</label>
        <textarea
          id="message"
          name="message"
          required
          rows={6}
          minLength={10}
          maxLength={2000}
          defaultValue={v?.message}
          placeholder="Dites-nous ce que vous cherchez : type de bien, quartier, budget."
          aria-invalid={Boolean(e?.message)}
          aria-describedby={e?.message ? 'erreur-message' : undefined}
          className="champ"
        />
        {e?.message && <p id="erreur-message" className="erreur">{e.message}</p>}
      </div>

      {/* Champ piege anti-robot : masque visuellement et ignore par les lecteurs d ecran. */}
      <div aria-hidden="true" className="absolute left-[-9999px] h-0 w-0 overflow-hidden">
        <label htmlFor="website">Ne remplissez pas ce champ</label>
        <input id="website" name="website" type="text" tabIndex={-1} autoComplete="off" defaultValue="" />
      </div>

      <BoutonEnvoyer />

      <p className="max-w-lisible text-sm text-ardoise/65">
        Vos coordonnees servent uniquement a repondre a votre demande. Voir la{' '}
        <a href="/confidentialite" className="underline">politique de confidentialite</a>.
      </p>
    </form>
  );
}
