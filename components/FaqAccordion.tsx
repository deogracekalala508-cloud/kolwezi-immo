import { ChevronDown } from 'lucide-react';

export type FaqEntry = { id: string; question: string; answer: string };

/**
 * Accordeon en <details> natif : fonctionne sans JavaScript, accessible au
 * clavier par defaut, et le contenu reste dans le HTML pour l'indexation.
 */
export default function FaqAccordion({ items }: { items: FaqEntry[] }) {
  if (items.length === 0) return null;

  return (
    <div className="divide-y divide-nuit/10 overflow-hidden rounded-lg bg-white ring-1 ring-nuit/5">
      {items.map((item) => (
        <details key={item.id} className="group">
          <summary className="flex cursor-pointer list-none items-center justify-between gap-4 p-4 font-display text-lg font-semibold text-nuit">
            {item.question}
            <ChevronDown
              className="h-5 w-5 shrink-0 text-cuivre transition-transform group-open:rotate-180"
              aria-hidden="true"
            />
          </summary>
          <div className="max-w-lisible px-4 pb-4 text-ardoise/85">{item.answer}</div>
        </details>
      ))}
    </div>
  );
}
