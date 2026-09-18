import Link from 'next/link';
import { MapPin, Clock, Mail } from 'lucide-react';
import { site } from '@/lib/site';

export default function Footer() {
  return (
    <footer className="mt-auto bg-nuit text-white/85">
      <div className="conteneur grid gap-10 py-14 sm:grid-cols-2 lg:grid-cols-4">
        <div className="sm:col-span-2 lg:col-span-1">
          <p className="font-display text-xl font-semibold text-white">{site.name}</p>
          <p className="mt-3 max-w-lisible text-sm">
            Agence immobilière à Kolwezi depuis 2011. Maisons, parcelles et véhicules, avec
            vérification stricte des titres avant chaque mise en vente.
          </p>
        </div>

        <nav aria-label="Biens à vendre">
          <h2 className="font-display text-base font-semibold text-or">Biens à vendre</h2>
          <ul className="mt-3 space-y-2 text-sm">
            <li><Link href="/biens?categorie=MAISON" className="hover:text-white">Maisons à Kolwezi</Link></li>
            <li><Link href="/biens?categorie=PARCELLE" className="hover:text-white">Parcelles à Kolwezi</Link></li>
            <li><Link href="/biens?categorie=VEHICULE" className="hover:text-white">Véhicules d’occasion</Link></li>
            <li><Link href="/biens" className="hover:text-white">Tout le catalogue</Link></li>
          </ul>
        </nav>

        <nav aria-label="L’agence">
          <h2 className="font-display text-base font-semibold text-or">L’agence</h2>
          <ul className="mt-3 space-y-2 text-sm">
            <li><Link href="/#equipe" className="hover:text-white">Notre équipe</Link></li>
            <li><Link href="/#avis" className="hover:text-white">Avis de nos clients</Link></li>
            <li><Link href="/etudes-de-cas" className="hover:text-white">Études de cas</Link></li>
            <li><Link href="/faq" className="hover:text-white">Questions fréquentes</Link></li>
            <li><Link href="/contact" className="hover:text-white">Nous écrire</Link></li>
            <li><Link href="/confidentialite" className="hover:text-white">Politique de confidentialité</Link></li>
          </ul>
        </nav>

        <address className="not-italic">
          <h2 className="font-display text-base font-semibold text-or">Nous trouver</h2>
          <ul className="mt-3 space-y-3 text-sm">
            <li className="flex gap-2">
              <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-or-300" aria-hidden="true" />
              <span>
                {site.address.street}
                <br />
                {site.address.quartier}, {site.address.city}
                <br />
                Province du {site.address.region}, RDC
              </span>
            </li>
            <li className="flex gap-2">
              <Clock className="mt-0.5 h-4 w-4 shrink-0 text-or-300" aria-hidden="true" />
              <span>{site.hours}</span>
            </li>
            <li className="flex gap-2">
              <Mail className="mt-0.5 h-4 w-4 shrink-0 text-or-300" aria-hidden="true" />
              <a href={`mailto:${site.email}`} className="underline hover:text-white">{site.email}</a>
            </li>
          </ul>
        </address>
      </div>

      <div className="border-t border-white/10">
        <div className="conteneur flex flex-col gap-2 py-6 text-xs text-white/60 sm:flex-row sm:items-center sm:justify-between">
          <p>&copy; {new Date().getFullYear()} {site.legalName}. Tous droits réservés.</p>
          <p className="pr-16 sm:pr-48">Les prix sont indiqués en dollars américains.</p>
        </div>
      </div>
    </footer>
  );
}
