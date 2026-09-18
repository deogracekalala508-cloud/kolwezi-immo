'use client';

import Image from 'next/image';
import { useFormState } from 'react-dom';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { Copy, Check } from 'lucide-react';
import { activerDeuxFacteurs, type EtatSetup } from '@/app/admin/setup-2fa/actions';
import SubmitButton from './SubmitButton';
import Alerte from './Alerte';

export default function SetupForm({
  qr,
  secret,
  email,
}: {
  qr: string;
  secret: string;
  email: string;
}) {
  const [etat, action] = useFormState<EtatSetup, FormData>(activerDeuxFacteurs, {});
  const { update } = useSession();
  const router = useRouter();
  const [copie, setCopie] = useState(false);

  // Une fois la 2FA active, la session est rafraichie depuis la base :
  // c'est le serveur qui decide, pas le navigateur.
  useEffect(() => {
    if (etat.ok) void update();
  }, [etat.ok, update]);

  if (etat.ok && etat.codesSecours) {
    return (
      <div className="mt-8">
        <Alerte etat={{ ok: true, message: 'Double authentification activee.' }} />

        <h2 className="mt-6 text-xl">Vos huit codes de secours</h2>
        <p className="mt-2 max-w-lisible text-ardoise/85">
          Notez-les sur papier et rangez-les hors du bureau. Chacun ne fonctionne qu une seule fois
          et remplace le code du telephone en cas de perte. Ils ne seront plus jamais affiches.
        </p>

        <ul className="mt-4 grid gap-2 rounded-md bg-nuit-50 p-4 font-mono text-sm sm:grid-cols-2">
          {etat.codesSecours.map((code) => (
            <li key={code}>{code}</li>
          ))}
        </ul>

        <button
          type="button"
          onClick={() => {
            void navigator.clipboard.writeText(etat.codesSecours!.join('\n'));
            setCopie(true);
          }}
          className="btn-contour mt-4"
        >
          {copie ? <Check className="h-5 w-5" aria-hidden="true" /> : <Copy className="h-5 w-5" aria-hidden="true" />}
          {copie ? 'Codes copies' : 'Copier les codes'}
        </button>

        <button
          type="button"
          onClick={() => {
            router.push('/admin/dashboard');
            router.refresh();
          }}
          className="btn-or mt-4 block"
        >
          J ai note mes codes, aller au tableau de bord
        </button>
      </div>
    );
  }

  return (
    <div className="mt-8 grid gap-8 sm:grid-cols-[240px_1fr] sm:items-start">
      <div>
        <Image
          src={qr}
          alt={`QR code de configuration de la double authentification pour ${email}`}
          width={240}
          height={240}
          unoptimized
          className="rounded-md ring-1 ring-nuit/10"
        />
        <p className="mt-3 text-sm text-ardoise/70">Cle a saisir manuellement :</p>
        <p className="mt-1 break-all rounded bg-nuit-50 p-2 font-mono text-xs">{secret}</p>
      </div>

      <form action={action} className="space-y-4">
        <Alerte etat={{ erreur: etat.erreur }} />

        <div>
          <label htmlFor="token" className="etiquette">Code a six chiffres</label>
          <input
            id="token"
            name="token"
            type="text"
            inputMode="numeric"
            autoComplete="one-time-code"
            required
            placeholder="123456"
            className="champ tracking-[0.3em]"
          />
        </div>

        <SubmitButton enCours="Verification">Activer la double authentification</SubmitButton>
      </form>
    </div>
  );
}
