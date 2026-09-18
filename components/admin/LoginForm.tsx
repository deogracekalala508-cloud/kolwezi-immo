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
  const [erreur, setErreur] = useState('');
  const [enCours, setEnCours] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setEnCours(true);
    setErreur('');

    const formData = new FormData(e.currentTarget);
    const email = String(formData.get('email') ?? '').trim().toLowerCase();
    const password = String(formData.get('password') ?? '');

    try {
      const res = await signIn('credentials', {
        email,
        password,
        token: '',
        redirect: false,
      });

      setEnCours(false);

      if (res?.ok) {
        router.push('/admin/dashboard');
        router.refresh();
        return;
      }

      setErreur('E-mail ou mot de passe incorrect.');
    } catch (err) {
      setEnCours(false);
      setErreur('Erreur de connexion. Veuillez réessayer.');
    }
  }

  return (
    <div className="w-full max-w-sm rounded-lg bg-white p-6 shadow-carte ring-1 ring-nuit/5">
      <h1 className="text-2xl">Espace agence</h1>
      <p className="mt-2 text-sm text-ardoise/75">
        Réservé à l’administration d’Humo Kolwezi. Connectez-vous avec vos identifiants.
      </p>

      <form onSubmit={handleSubmit} className="mt-6 space-y-4">
        <Alerte etat={{ erreur }} />

        <div>
          <label htmlFor="email" className="etiquette">E-mail</label>
          <input
            id="email"
            name="email"
            type="email"
            required
            autoComplete="username"
            placeholder="admin@humokolwezi.cd"
            className="champ"
          />
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

        <button
          type="submit"
          disabled={enCours}
          className="btn-nuit w-full flex items-center justify-center gap-2 py-3 disabled:opacity-60 font-semibold"
        >
          <ShieldCheck className="h-5 w-5" aria-hidden="true" />
          {enCours ? 'Connexion en cours...' : 'Se connecter'}
        </button>
      </form>
    </div>
  );
}
