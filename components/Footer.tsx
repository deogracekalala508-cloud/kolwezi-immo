'use client';

import Link from 'next/link';
import { MapPin, Clock, Mail, Phone, Instagram } from 'lucide-react';
import { site } from '@/lib/site';

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="relative bg-nuit-900 text-white/80 mt-auto">
      {/* Ligne décorative supérieure */}
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-or/30 to-transparent" />

      <div className="conteneur py-16 sm:py-20">
        <div className="grid gap-12 sm:grid-cols-2 lg:grid-cols-5">
          {/* Brand */}
          <div className="sm:col-span-2 lg:col-span-2">
            <div className="flex items-center gap-3 mb-4">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-or">
                <svg
                  viewBox="0 0 24 24"
                  className="h-6 w-6 text-nuit"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  aria-hidden="true"
                >
                  <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
                  <polyline points="9 22 9 12 15 12 15 22" />
                </svg>
              </div>
              <span className="font-display text-2xl font-bold text-white">{site.name}</span>
            </div>
            <p className="max-w-sm text-sm text-white/70 leading-relaxed">
              Agence immobilière à Kolwezi depuis 2011. Maisons, parcelles et véhicules,
              avec vérification stricte des titres avant chaque mise en vente.
            </p>
            <div className="mt-5 flex items-center gap-3">
              <a
                href={`https://wa.me/${site.whatsapp}?text=Bonjour, je suis intéressé par un bien à Kolwezi.`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 rounded-lg bg-[#128C7E] px-4 py-2.5 text-sm font-semibold text-white
                  transition-all duration-200 hover:bg-[#107868] hover:shadow-carteEleve hover:-translate-y-0.5"
              >
                <svg className="h-4 w-4" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.672.148-.199.297-.764.966-.94 1.164-.177.199-.355.298-.554.148-.199-.148-.62-.355-.92-1.01-.298-.646-.033-1.27.534-1.588.149-.098.317-.198.459-.347.141-.149.198-.317.298-.516.1-.198.05-.355-.025-.484-.075-.124-.62-.628-.99-1.255-.39-.672-.6-.867-1.372-1.016-.198-.049-.42-.024-.571.025-.149.074-.355.124-.554.174-.199.05-.595-.075-1.06-.174-.355-.075-.668-.174-.92-.347-.25-.174-.484-.42-.683-.735-.174-.298-.2-.554-.1-.872.074-.248.372-.525.746-.744.248-.149.496-.25.729-.373.232-.124.42-.297.562-.525.141-.227.198-.525.149-.8-.049-.297-.273-.595-.62-.823-.347-.228-.72-.373-1.06-.496-.347-.124-.646-.199-.895-.228-.248-.029-.525-.074-.746-.199-.22-.124-.372-.347-.444-.62.149-.298.42-.646.765-.992.347-.347.695-.62.992-.97.074-.098.149-.22.198-.347.049-.149.025-.347-.049-.444-.074-.099-.174-.149-.347-.198-.174-.049-.39-.025-.562.074-.149.099-.42.273-.746.525-.327.25-.646.496-1.016.823-.355.317-.683.595-1.096.92-.098.1-.22.174-.348.248-.149.074-.317.099-.496.099-.174.025-.372.05-.554.074-.199.025-.42.074-.646.148-.227.099-.472.149-.747.149-.274.0-1.164-.074-2.062-.099-.896-.025-1.792.198-2.688.595-.896.396-1.591 1.07-2.062 1.928-.248.459-.347 1.017-.298 1.45-.049.43-.025.785-.298 1.112-.496.612-.92 1.49-1.269 2.347-.298.747-.397 1.59-.747 2.39-.199.496-.472.99-.844 1.484-.347.496-.595.97-.794 1.344-.174.317-.298.646-.472.94-.298.149-.595.199-.92.273-.355.074-.683.174-1.06.298-.373.124-1.016.397-1.45 1.016-.297.496-.42 1.16-.496 1.746z" />
                </svg>
                Contact sur WhatsApp
              </a>
              <a
                href={`mailto:${site.email}`}
                className="flex items-center gap-2 rounded-lg bg-white/10 px-4 py-2.5 text-sm font-semibold
                  text-white transition-all duration-200 hover:bg-white/20"
              >
                <Mail className="h-4 w-4" aria-hidden="true" />
                {site.email}
              </a>
            </div>
          </div>

          {/* Biens */}
          <div>
            <h3 className="font-display text-sm font-semibold text-or uppercase tracking-wider mb-4">
              Biens à vendre
            </h3>
            <ul className="space-y-3">
              {[
                { href: '/biens?categorie=MAISON', label: 'Maisons à Kolwezi' },
                { href: '/biens?categorie=PARCELLE', label: 'Parcelles à Kolwezi' },
                { href: '/biens?categorie=VEHICULE', label: 'Véhicules d\'occasion' },
                { href: '/biens', label: 'Tout le catalogue' },
              ].map((l) => (
                <li key={l.href}>
                  <Link href={l.href} className="flex items-center gap-2 text-sm text-white/70 hover:text-white transition-all duration-200 group">
                    <span className="h-1 w-1 rounded-full bg-or/50 group-hover:bg-or transition-colors duration-200" />
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* L'agence */}
          <div>
            <h3 className="font-display text-sm font-semibold text-or uppercase tracking-wider mb-4">
              L&apos;agence
            </h3>
            <ul className="space-y-3">
              {[
                { href: '/#equipe', label: 'Notre équipe' },
                { href: '/#avis', label: 'Avis clients' },
                { href: '/etudes-de-cas', label: 'Études de cas' },
                { href: '/faq', label: 'FAQ' },
                { href: '/contact', label: 'Nous écrire' },
                { href: '/confidentialite', label: 'Confidentialité' },
              ].map((l) => (
                <li key={l.href}>
                  <Link href={l.href} className="flex items-center gap-2 text-sm text-white/70 hover:text-white transition-all duration-200 group">
                    <span className="h-1 w-1 rounded-full bg-or/50 group-hover:bg-or transition-colors duration-200" />
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Nous trouver - plus visible */}
          <div className="relative">
            <div className="absolute -inset-0.5 bg-gradient-to-br from-or/20 to-cuivre/20 rounded-xl blur opacity-30" />
            <div className="relative bg-nuit-800 rounded-xl p-5">
              <h3 className="font-display text-sm font-semibold text-or uppercase tracking-wider mb-4">
                Nous trouver
              </h3>
              <address className="not-italic space-y-4">
                <div className="flex items-start gap-3">
                  <div className="h-8 w-8 rounded-lg bg-or/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <MapPin className="h-4 w-4 text-or" aria-hidden="true" />
                  </div>
                  <div>
                    <p className="text-sm text-white/90 font-medium">
                      {site.address.street}
                    </p>
                    <p className="text-xs text-white/60 mt-0.5">
                      {site.address.quartier}, {site.address.city}
                      <br />
                      Province du {site.address.region}, RDC
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="h-8 w-8 rounded-lg bg-or/20 flex items-center justify-center flex-shrink-0">
                    <Clock className="h-4 w-4 text-or" aria-hidden="true" />
                  </div>
                  <p className="text-sm text-white/80">{site.hours}</p>
                </div>
                <div className="flex items-start gap-3">
                  <div className="h-8 w-8 rounded-lg bg-or/20 flex items-center justify-center flex-shrink-0">
                    <Mail className="h-4 w-4 text-or" aria-hidden="true" />
                  </div>
                  <div>
                    <p className="text-sm text-white/80">{site.email}</p>
                    <p className="text-xs text-white/60 mt-0.5">Réponse sous 2h en semaine</p>
                  </div>
                </div>
              </address>
            </div>
          </div>
        </div>

        {/* Ligne du bas */}
        <div className="mt-12 pt-6 border-t border-white/10">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 text-xs text-white/50">
            <p className="flex items-center gap-2">
              <span>© {currentYear} {site.legalName}.</span>
              <span className="h-px w-1 bg-white/10" />
              <span>Tous droits réservés.</span>
            </p>
            <p className="flex items-center gap-2">
              <span className="h-1 w-1 rounded-full bg-or/50" />
              <span>Les prix sont indiqués en dollars américains (USD).</span>
              <span className="h-1 w-1 rounded-full bg-or/50" />
              <span>Mise à jour : {currentYear}</span>
            </p>
          </div>
        </div>
      </div>

      {/* Bouton retour en haut */}
      <div className="absolute bottom-6 right-6 z-40">
        <button
          type="button"
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          className="flex items-center gap-2 h-10 w-10 rounded-full bg-white text-nuit
            shadow-carte translate-y-2 opacity-0 transition-all duration-300 hover:shadow-carteEleve
            hover:-translate-y-1"
          aria-label="Retour en haut de page"
        >
          <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" aria-hidden="true">
            <polyline points="18 15 12 9 6 15" />
          </svg>
        </button>
      </div>
    </footer>
  );
}