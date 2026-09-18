'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState } from 'react';
import { Menu, X, Phone } from 'lucide-react';
import { site } from '@/lib/site';

const liens = [
  { href: '/biens', label: 'Les biens' },
  { href: '/biens?categorie=MAISON', label: 'Maisons' },
  { href: '/biens?categorie=PARCELLE', label: 'Parcelles' },
  { href: '/biens?categorie=VEHICULE', label: 'Véhicules' },
  { href: '/etudes-de-cas', label: 'Études de cas' },
  { href: '/faq', label: 'Questions fréquentes' },
  { href: '/contact', label: 'Contact' },
];

export default function Header() {
  const [ouvert, setOuvert] = useState(false);
  const pathname = usePathname();

  return (
    <header className="sticky top-0 z-30 border-b border-nuit/10 bg-sable/95 backdrop-blur">
      <div className="conteneur flex h-16 items-center justify-between gap-4">
        <Link href="/" className="flex items-baseline gap-2" onClick={() => setOuvert(false)}>
          <span className="font-display text-xl font-semibold text-nuit">{site.name}</span>
          <span className="hidden text-sm text-cuivre sm:inline">Lualaba</span>
        </Link>

        <nav aria-label="Navigation principale" className="hidden lg:block">
          <ul className="flex items-center gap-6 text-sm">
            {liens.map((l) => (
              <li key={l.href}>
                <Link
                  href={l.href}
                  className={
                    pathname === l.href.split('?')[0]
                      ? 'font-semibold text-nuit underline decoration-or decoration-2 underline-offset-8'
                      : 'text-nuit/75 hover:text-nuit'
                  }
                >
                  {l.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <div className="flex items-center gap-2">
          <a
            href={`tel:+${site.whatsapp}`}
            className="hidden items-center gap-2 text-sm font-semibold text-nuit sm:inline-flex"
          >
            <Phone className="h-4 w-4" aria-hidden="true" />
            Appeler
          </a>
          <button
            type="button"
            onClick={() => setOuvert((v) => !v)}
            aria-expanded={ouvert}
            aria-controls="menu-mobile"
            className="inline-flex items-center gap-2 rounded-md border border-nuit/20 px-3 py-2 text-sm font-semibold text-nuit lg:hidden"
          >
            {ouvert ? <X className="h-5 w-5" aria-hidden="true" /> : <Menu className="h-5 w-5" aria-hidden="true" />}
            Menu
          </button>
        </div>
      </div>

      {ouvert && (
        <nav id="menu-mobile" aria-label="Navigation mobile" className="border-t border-nuit/10 bg-white lg:hidden">
          <ul className="conteneur divide-y divide-nuit/10 py-2">
            {liens.map((l) => (
              <li key={l.href}>
                <Link
                  href={l.href}
                  onClick={() => setOuvert(false)}
                  className="block py-3.5 font-medium text-nuit"
                >
                  {l.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      )}
    </header>
  );
}
