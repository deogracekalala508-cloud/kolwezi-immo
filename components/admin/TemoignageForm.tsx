'use client';

import { useFormState } from 'react-dom';
import { creerTemoignage } from '@/app/admin/actions';
import type { EtatAction } from '@/lib/admin';
import SubmitButton from './SubmitButton';
import Alerte from './Alerte';

export default function TemoignageForm() {
  const [etat, action] = useFormState<EtatAction, FormData>(creerTemoignage, {});
  const champ = (nom: string) => etat.champs?.[nom];

  return (
    <form action={action} className="space-y-4">
      <Alerte etat={{ ...etat, message: 'Avis enregistre.' }} />

      <div className="grid gap-4 sm:grid-cols-[2fr_1fr]">
        <div>
          <label htmlFor="clientName" className="etiquette">Nom du client</label>
          <input id="clientName" name="clientName" required maxLength={80} className="champ" />
          {champ('clientName') && <p className="erreur">{champ('clientName')}</p>}
        </div>

        <div>
          <label htmlFor="rating" className="etiquette">Note</label>
          <select id="rating" name="rating" defaultValue="5" className="champ">
            {[5, 4, 3, 2, 1].map((n) => (
              <option key={n} value={n}>{n} sur 5</option>
            ))}
          </select>
        </div>
      </div>

      <div>
        <label htmlFor="content" className="etiquette">Avis</label>
        <textarea id="content" name="content" rows={4} required minLength={20} maxLength={1200} className="champ" />
        {champ('content') && <p className="erreur">{champ('content')}</p>}
      </div>

      <label className="flex items-center gap-2">
        <input type="checkbox" name="published" defaultChecked className="h-5 w-5 rounded border-nuit/30" />
        <span className="font-medium text-nuit">Publier tout de suite sur le site</span>
      </label>

      <SubmitButton>Ajouter l avis</SubmitButton>
    </form>
  );
}
