'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState, useEffect, useRef } from 'react';
import { Menu, X, Phone, Search } from 'lucide-react';
import { site } from '@/lib/site';

const liens = [
  { href: '/biens', label: 'Les biens' },
  { href: '/biens?categorie=MAISON', label: 'Maisons' },
  { href: '/biens?categorie=PARCELLE', label: 'Parcelles' },
  { href: '/biens?categorie=VEHICULE', label: 'Véhicules' },
  { href: '/etudes-de-cas', label: 'Études de cas' },
  { href: '/faq', label: 'FAQ' },
  { href: '/contact', label: 'Contact' },
];

export default function Header() {
  const [ouvert, setOuvert] = useState(false);
  const [menuVisible, setMenuVisible] = useState(false);
  const pathname = usePathname();
  const menuRef = useRef<HTMLDivElement>(null);

  // Fermer le menu quand on clique en dehors
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setMenuVisible(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Gestion du scroll pour le header
  useEffect(() => {
    const handleScroll = () => {
      const header = document.querySelector('header');
      if (header) {
        if (window.scrollY > 10) {
          header.classList.add('shadow-carte');
        } else {
          header.classList.remove('shadow-carte');
        }
      }
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <header className="sticky top-0 z-30 border-b border-nuit/10 bg-sable/95 backdrop-blur supports-backdrop-blur:bg-sable/80">
      <div className="conteneur flex h-16 items-center justify-between">
        {/* Logo enrichi */}
        <Link
          href="/"
          className="flex items-center gap-2.5 group"
          onClick={() => setMenuVisible(false)}
        >
          <div className="relative h-8 w-8 rounded-lg bg-nuit flex items-center justify-center">
            <svg
              viewBox="0 0 24 24"
              className="h-5 w-5 text-or"
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
          <div>
            <span className="font-display text-lg font-bold text-nuit group-hover:text-or transition-colors duration-200">
              {site.name}
            </span>
            <span className="hidden text-xs text-cuivre sm:inline ml-2.5 font-medium">
              — Lualaba
            </span>
          </div>
        </Link>

        {/* Navigation desktop */}
        <nav aria-label="Navigation principale" className="hidden lg:block">
          <ul className="flex items-center gap-1">
            {liens.slice(0, 5).map((l, index) => {
              const isActif = pathname === l.href.split('?')[0];
              return (
                <li key={l.href}>
                  <Link
                    href={l.href}
                    className={`
                      relative px-3 py-2 font-medium rounded-lg transition-all duration-200
                      ${isActif
                        ? 'bg-or/10 text-or font-semibold'
                        : 'text-ardoise-700 hover:bg-white hover:text-nuit'
                      }
                    `}
                    style={{
                      animationDelay: `${index * 50}ms`,
                    }}
                  >
                    {l.label}
                    {isActif && (
                      <span className="absolute bottom-0 left-3 right-3 h-0.5 bg-or rounded-full" />
                    )}
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>

        {/* Actions droite */}
        <div className="flex items-center gap-2">
          {/* Recherche rapide */}
          <Link
            href="/biens"
            className="hidden sm:flex items-center gap-2 rounded-lg bg-white border border-nuit/20
              px-3.5 py-2 text-sm font-medium text-ardoise hover:border-nuit/40
              transition-all duration-200 shadow-discret"
          >
            <Search className="h-4 w-4 text-menin" aria-hidden="true" />
            <span className="hidden sm:inline">Rechercher</span>
            <span className="sm:hidden"></span>
          </Link>

          {/* Contact */}
          <a
            href={`tel:+${site.whatsapp}`}
            className="hidden sm:flex items-center gap-2 rounded-lg bg-nuit text-white px-4 py-2
              font-semibold text-sm transition-all duration-200 hover:bg-nuit-700 hover:shadow-carteEleve
              hover:-translate-y-0.5 active:translate-y-0"
          >
            <Phone className="h-4 w-4" aria-hidden="true" />
            <span className="hidden xs:inline">Appeler</span>
          </a>

          {/* Bouton mobile */}
          <button
            type="button"
            onClick={() => {
              setMenuVisible(!menuVisible);
              setOuvert(!ouvert);
            }}
            aria-expanded={menuVisible}
            aria-controls="menu-mobile"
            className={`
              relative w-10 h-10 flex items-center justify-center rounded-lg
              bg-white border border-nuit/20 shadow-discret transition-all duration-200
              lg:hidden hover:border-nuit/40
            `}
          >
            {menuVisible ? (
              <X className="h-5 w-5 text-nuit" aria-hidden="true" />
            ) : (
              <Menu className="h-5 w-5 text-nuit" aria-hidden="true" />
            )}
          </button>
        </div>
      </div>

      {/* Menu mobile enrichi */}
      {menuVisible && (
        <nav
          id="menu-mobile"
          ref={menuRef}
          aria-label="Navigation mobile"
          className="border-t border-nuit/10 bg-white lg:hidden animate-[entree_0.25s_ease-out]"
        >
          <div className="conteneur py-2">
            <ul className="space-y-0.5">
              {liens.map((l) => {
                const isActif = pathname === l.href.split('?')[0];
                return (
                  <li key={l.href}>
                    <Link
                      href={l.href}
                      onClick={() => setMenuVisible(false)}
                      className={`
                        flex items-center justify-between px-4 py-3.5 font-medium
                        rounded-lg transition-all duration-200
                        ${isActif
                          ? 'bg-or/10 text-or'
                          : 'text-nuit hover:bg-sable-100'
                        }
                      `}
                    >
                      {l.label}
                      {isActif && (
                        <span className="h-1.5 w-5 rounded-full bg-or" />
                      )}
                    </Link>
                  </li>
                );
              })}
            </ul>

            {/* Contact rapide sur mobile */}
            <div className="mt-3 pt-4 border-t border-nuit/10">
              <a
                href={`tel:+${site.whatsapp}`}
                className="flex items-center gap-3 rounded-lg bg-nuit text-white px-4 py-3
                  font-semibold transition-all duration-200 hover:bg-nuit-700"
              >
                <Phone className="h-5 w-5" aria-hidden="true" />
                <span>Appeler l&apos;agence</span>
              </a>
            </div>
          </div>
        </nav>
      )}
    </header>
  );
}