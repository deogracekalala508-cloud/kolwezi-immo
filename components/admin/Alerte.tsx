import { AlertCircle, CheckCircle2 } from 'lucide-react';

export default function Alerte({ etat }: { etat: { ok?: boolean; erreur?: string; message?: string } }) {
  if (etat.erreur) {
    return (
      <p role="alert" className="flex gap-2 rounded-md bg-red-50 p-3 text-sm font-medium text-red-800">
        <AlertCircle className="h-5 w-5 shrink-0" aria-hidden="true" />
        {etat.erreur}
      </p>
    );
  }
  if (etat.ok) {
    return (
      <p role="status" className="flex gap-2 rounded-md bg-emerald-50 p-3 text-sm font-medium text-emerald-800">
        <CheckCircle2 className="h-5 w-5 shrink-0" aria-hidden="true" />
        {etat.message ?? 'Modification enregistree.'}
      </p>
    );
  }
  return null;
}
