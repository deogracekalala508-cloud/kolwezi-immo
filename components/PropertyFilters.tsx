'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { SlidersHorizontal, X } from 'lucide-react';
import { categories } from '@/lib/site';

/**
 * Filtres du catalogue. Ils ecrivent dans l'URL : la page reste partageable,
 * indexable, et la validation serveur (Zod) reste la seule source de verite.
 */
export default function PropertyFilters({ localisations }: { localisations: string[] }) {
  const router = useRouter();
  const params = useSearchParams();

  function appliquer(champ: string, valeur: string) {
    const suivant = new URLSearchParams(params.toString());
    if (valeur) suivant.set(champ, valeur);
    else suivant.delete(champ);
    suivant.delete('page'); // tout changement de filtre renvoie a la page 1
    router.push(`/biens?${suivant.toString()}`);
  }

  const actifs = ['categorie', 'localisation', 'prixMin', 'prixMax'].filter((c) => params.get(c));

  return (
    <form
      className="rounded-lg bg-white p-4 shadow-carte ring-1 ring-nuit/5"
      onSubmit={(e) => e.preventDefault()}
    >
      <h2 className="flex items-center gap-2 text-base">
        <SlidersHorizontal className="h-5 w-5 text-cuivre" aria-hidden="true" />
        Affiner la recherche
      </h2>

      <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <div>
          <label htmlFor="f-categorie" className="etiquette text-sm">Type de bien</label>
          <select
            id="f-categorie"
            className="champ"
            defaultValue={params.get('categorie') ?? ''}
            onChange={(e) => appliquer('categorie', e.target.value)}
          >
            <option value="">Tous les types</option>
            {Object.entries(categories).map(([valeur, meta]) => (
              <option key={valeur} value={valeur}>{meta.plural}</option>
            ))}
          </select>
        </div>

        <div>
          <label htmlFor="f-localisation" className="etiquette text-sm">Quartier</label>
          <select
            id="f-localisation"
            className="champ"
            defaultValue={params.get('localisation') ?? ''}
            onChange={(e) => appliquer('localisation', e.target.value)}
          >
            <option value="">Tout Kolwezi</option>
            {localisations.map((l) => (
              <option key={l} value={l}>{l}</option>
            ))}
          </select>
        </div>

        <div>
          <label htmlFor="f-prixMin" className="etiquette text-sm">Prix minimum (USD)</label>
          <input
            id="f-prixMin"
            type="number"
            min={0}
            step={1000}
            inputMode="numeric"
            className="champ"
            defaultValue={params.get('prixMin') ?? ''}
            onBlur={(e) => appliquer('prixMin', e.target.value)}
          />
        </div>

        <div>
          <label htmlFor="f-prixMax" className="etiquette text-sm">Prix maximum (USD)</label>
          <input
            id="f-prixMax"
            type="number"
            min={0}
            step={1000}
            inputMode="numeric"
            className="champ"
            defaultValue={params.get('prixMax') ?? ''}
            onBlur={(e) => appliquer('prixMax', e.target.value)}
          />
        </div>
      </div>

      {actifs.length > 0 && (
        <button
          type="button"
          onClick={() => router.push('/biens')}
          className="mt-4 inline-flex items-center gap-1.5 text-sm font-semibold text-nuit-600 hover:underline"
        >
          <X className="h-4 w-4" aria-hidden="true" />
          Effacer les filtres
        </button>
      )}
    </form>
  );
}
