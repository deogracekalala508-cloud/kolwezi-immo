import { Star } from 'lucide-react';

export type TestimonialEntry = {
  id: string;
  clientName: string;
  content: string;
  rating: number;
};

function Etoiles({ note }: { note: number }) {
  const valeur = Math.min(5, Math.max(1, note));
  return (
    <p className="flex gap-0.5" aria-label={`Note de ${valeur} sur 5`}>
      {[1, 2, 3, 4, 5].map((i) => (
        <Star
          key={i}
          aria-hidden="true"
          className={i <= valeur ? 'h-4 w-4 fill-or text-or' : 'h-4 w-4 text-nuit/20'}
        />
      ))}
    </p>
  );
}

export default function Testimonials({ items }: { items: TestimonialEntry[] }) {
  if (items.length === 0) return null;

  return (
    <ul className="grid gap-4 sm:grid-cols-2">
      {items.map((t) => (
        <li key={t.id} className="rounded-lg bg-white p-5 shadow-carte ring-1 ring-nuit/5">
          <Etoiles note={t.rating} />
          <blockquote className="mt-3 max-w-lisible text-ardoise/90">{t.content}</blockquote>
          <p className="mt-3 text-sm font-semibold text-nuit">{t.clientName}</p>
        </li>
      ))}
    </ul>
  );
}
