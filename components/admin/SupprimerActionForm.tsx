'use client';

import { useFormState } from 'react-dom';
import SubmitButton from './SubmitButton';

interface SupprimerActionFormProps {
  action: (prevState: { ok?: boolean; erreur?: string }, formData: FormData) => Promise<{ ok?: boolean; erreur?: string }>;
  id: string;
  confirmation: string;
  children?: React.ReactNode;
}

export default function SupprimerActionForm({ action, id, confirmation, children }: SupprimerActionFormProps) {
  const [etat, formAction] = useFormState(action, {});

  return (
    <form action={formAction} className="inline">
      <input type="hidden" name="id" value={id} />
      {etat.erreur && (
        <p className="texte-rouge text-sm mt-1">{etat.erreur}</p>
      )}
      <SubmitButton variante="danger" enCours="..." confirmation={confirmation}>
        {children}
      </SubmitButton>
    </form>
  );
}