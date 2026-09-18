'use client';

import { useFormState } from 'react-dom';
import { creerFaq, modifierFaq } from '@/app/admin/actions';
import type { EtatAction } from '@/lib/admin';
import SubmitButton from './SubmitButton';
import Alerte from './Alerte';

export type ValeursFaq = { id?: string; question: string; answer: string; order: number };

export default function FaqForm({ valeurs }: { valeurs?: ValeursFaq }) {
  const edition = Boolean(valeurs?.id);
  const [etat, action] = useFormState<EtatAction, FormData>(edition ? modifierFaq : creerFaq, {});
  const champ = (nom: string) => etat.champs?.[nom];

  return (
    <form action={action} className="space-y-4">
      {edition && <input type="hidden" name="id" value={valeurs?.id} />}
      <Alerte etat={{ ...etat, message: 'Question enregistree.' }} />

      <div>
        <label htmlFor={`question-${valeurs?.id ?? 'new'}`} className="etiquette">Question</label>
        <input
          id={`question-${valeurs?.id ?? 'new'}`}
          name="question"
          required
          maxLength={200}
          defaultValue={valeurs?.question}
          className="champ"
        />
        {champ('question') && <p className="erreur">{champ('question')}</p>}
      </div>

      <div>
        <label htmlFor={`answer-${valeurs?.id ?? 'new'}`} className="etiquette">Reponse</label>
        <textarea
          id={`answer-${valeurs?.id ?? 'new'}`}
          name="answer"
          rows={4}
          required
          minLength={20}
          maxLength={2000}
          defaultValue={valeurs?.answer}
          className="champ"
        />
        {champ('answer') && <p className="erreur">{champ('answer')}</p>}
      </div>

      <div className="max-w-[140px]">
        <label htmlFor={`order-${valeurs?.id ?? 'new'}`} className="etiquette">Ordre</label>
        <input
          id={`order-${valeurs?.id ?? 'new'}`}
          name="order"
          type="number"
          min={0}
          max={999}
          defaultValue={valeurs?.order ?? 0}
          className="champ"
        />
      </div>

      <SubmitButton variante={edition ? 'contour' : 'or'}>
        {edition ? 'Enregistrer' : 'Ajouter la question'}
      </SubmitButton>
    </form>
  );
}
