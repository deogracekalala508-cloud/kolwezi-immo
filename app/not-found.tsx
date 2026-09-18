import type { Metadata } from 'next';
import Link from 'next/link';
import { Compass } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Page introuvable',
  robots: { index: false, follow: true },
};

export default function NotFound() {
  return (
    <div className="conteneur flex min-h-[60vh] items-center justify-center py-16">
      <div className="max-w-xl text-center">
        <Compass className="mx-auto h-14 w-14 text-cuivre" aria-hidden="true" />
        <p className="mt-6 font-display text-5xl font-semibold text-nuit">404</p>
        <h1 className="mt-3 text-3xl">Cette page n existe pas</h1>
        <p className="mx-auto mt-4 max-w-lisible text-ardoise/85">
          Le lien est peut-etre errone, ou le bien a ete vendu et retire du catalogue. Voici par ou
          repartir.
        </p>

        <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
          <Link href="/biens" className="btn-or">Voir les biens disponibles</Link>
          <Link href="/" className="btn-contour">Retour a l accueil</Link>
        </div>

        <ul className="mt-10 grid gap-2 text-left text-nuit-600 sm:grid-cols-2">
          <li><Link href="/biens?categorie=MAISON" className="hover:underline">Maisons a vendre</Link></li>
          <li><Link href="/biens?categorie=PARCELLE" className="hover:underline">Parcelles a vendre</Link></li>
          <li><Link href="/biens?categorie=VEHICULE" className="hover:underline">Vehicules d occasion</Link></li>
          <li><Link href="/contact" className="hover:underline">Contacter l agence</Link></li>
        </ul>
      </div>
    </div>
  );
}
