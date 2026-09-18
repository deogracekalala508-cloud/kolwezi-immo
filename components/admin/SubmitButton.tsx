'use client';

import { useFormStatus } from 'react-dom';

export default function SubmitButton({
  children,
  enCours = 'Enregistrement',
  variante = 'or',
  confirmation,
}: {
  children: React.ReactNode;
  enCours?: string;
  variante?: 'or' | 'nuit' | 'contour' | 'danger';
  confirmation?: string;
}) {
  const { pending } = useFormStatus();

  const classes = {
    or: 'btn-or',
    nuit: 'btn-nuit',
    contour: 'btn-contour',
    danger:
      'inline-flex items-center justify-center gap-2 rounded-md border border-red-300 bg-white px-4 py-2 font-semibold text-red-700 hover:bg-red-50',
  }[variante];

  return (
    <button
      type="submit"
      disabled={pending}
      onClick={(e) => {
        if (confirmation && !window.confirm(confirmation)) e.preventDefault();
      }}
      className={`${classes} disabled:opacity-60`}
    >
      {pending ? enCours : children}
    </button>
  );
}
