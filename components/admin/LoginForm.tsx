'use client';

import { useRef, useState } from 'react';
import { useFormState } from 'react-dom';
import { signIn } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { ShieldCheck, KeyRound, ArrowLeft } from 'lucide-react';
import { verifierIdentifiants, type EtatLogin } from '@/app/admin/login/actions';
import SubmitButton from './SubmitButton';
import Alerte from './Alerte';

/**
 * Connexion en deux temps :
 *   1. e-mail + mot de passe verifies par une Server Action (limitee a 5 essais)
 *   2. code TOTP a six chiffres, puis signIn() qui ouvre la session
 * Le mot de passe reste en memoire du composant le temps de l'etape 2 ; il
 * n'est jamais ecrit dans l'URL, ni dans le stockage local, ni journalise.
 */
export default function LoginForm() {
  const router = useRouter();
  const [etat, action] = useFormState<EtatLogin, FormData>(verifierIdentifiants, {
    etape: 'identifiants',
  });

  const identifiants = useRef<{ email: string; password: string }>({ email: '', password: '' });
  const [erreur2fa, setErreur2fa] = useState('');
  const [enCours, setEnCours] = useState(false);

  const etape = etat.etape ?? 'identifiants';

  async function ouvrirSession(code: string) {
    setEnCours(true);
    setErreur2fa('');

    const res = await signIn('credentials', {
      email: identifiants.current.email,
      password: identifiants.current.password,
      token: code,
      redirect: false,
    });

    setEnCours(false);

    if (res?.ok) {
      identifiants.current = { email: '', password: '' };
      router.push(etape === 'configuration' ? '/admin/setup-2fa' : '/admin/dashboard');
      router.refresh();
      return;
    }
    setErreur2fa('Code refuse. Verifiez l heure de votre telephone et reessayez.');
  }

  return (
    <div className="w-full max-w-sm rounded-lg bg-white p-6 shadow-carte ring-1 ring-nuit/5">
      {etape === 'identifiants' && (
        <>
          <h1 className="text-2xl">Espace agence</h1>
          <p className="mt-2 text-sm text-ardoise/75">
            Reserve aux agents de Humo Kolwezi. Un code a six chiffres vous sera demande ensuite.
          </p>

          <form
            action={(formData) => {
              identifiants.current = {
                email: String(formData.get('email') ?? '').trim().toLowerCase(),
                password: String(formData.get('password') ?? ''),
              };
              action(formData);
            }}
            className="mt-6 space-y-4"
          >
            <Alerte etat={{ erreur: etat.erreur }} />

            <div>
              <label htmlFor="email" className="etiquette">E-mail</label>
              <input id="email" name="email" type="email" required autoComplete="username" className="champ" />
            </div>

            <div>
              <label htmlFor="password" className="etiquette">Mot de passe</label>
              <input
                id="password"
                name="password"
                type="password"
                required
                minLength={8}
                autoComplete="current-password"
                className="champ"
              />
            </div>

            <SubmitButton variante="nuit" enCours="Verification">Continuer</SubmitButton>
          </form>
        </>
      )}

      {etape !== 'identifiants' && (
        <>
          <ShieldCheck className="h-10 w-10 text-cuivre" aria-hidden="true" />
          <h1 className="mt-4 text-2xl">
            {etape === 'configuration' ? 'Double authentification a activer' : 'Code de verification'}
          </h1>
          <p className="mt-2 text-sm text-ardoise/75">
            {etape === 'configuration'
              ? 'Votre compte n a pas encore de double authentification. Entrez le code provisoire communique par le proprietaire de l agence, ou continuez pour la configurer.'
              : 'Ouvrez votre application d authentification et entrez le code a six chiffres. Un code de secours fonctionne aussi.'}
          </p>

          <form
            onSubmit={(e) => {
              e.preventDefault();
              const data = new FormData(e.currentTarget);
              void ouvrirSession(String(data.get('token') ?? ''));
            }}
            className="mt-6 space-y-4"
          >
            <Alerte etat={{ erreur: erreur2fa }} />

            <div>
              <label htmlFor="token" className="etiquette">Code</label>
              <input
                id="token"
                name="token"
                type="text"
                inputMode="numeric"
                autoComplete="one-time-code"
                required={etape === 'deux-facteurs'}
                placeholder="123456"
                className="champ tracking-[0.3em]"
                autoFocus
              />
            </div>

            <button type="submit" disabled={enCours} className="btn-or w-full disabled:opacity-60">
              <KeyRound className="h-5 w-5" aria-hidden="true" />
              {enCours ? 'Verification' : 'Ouvrir la session'}
            </button>

            <button
              type="button"
              onClick={() => window.location.reload()}
              className="inline-flex items-center gap-1.5 text-sm font-semibold text-nuit-600 hover:underline"
            >
              <ArrowLeft className="h-4 w-4" aria-hidden="true" />
              Recommencer
            </button>
          </form>
        </>
      )}
    </div>
  );
}
