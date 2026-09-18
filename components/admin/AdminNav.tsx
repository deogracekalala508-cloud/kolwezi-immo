'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { signOut } from 'next-auth/react';
import { LayoutDashboard, Building2, Mail, Star, HelpCircle, FileText, LogOut } from 'lucide-react';

const liens = [
  { href: '/admin/dashboard', label: 'Tableau de bord', icone: LayoutDashboard },
  { href: '/admin/biens/nouveau', label: 'Ajouter un bien', icone: Building2 },
  { href: '/admin/messages', label: 'Messages', icone: Mail },
  { href: '/admin/temoignages', label: 'Avis clients', icone: Star },
  { href: '/admin/faq', label: 'Questions frequentes', icone: HelpCircle },
  { href: '/admin/etudes-de-cas', label: 'Etudes de cas', icone: FileText },
];

export default function AdminNav({ nom, role }: { nom: string; role: string }) {
  const pathname = usePathname();

  return (
    <div className="border-b border-nuit/10 bg-white">
      <div className="conteneur flex flex-wrap items-center gap-x-6 gap-y-3 py-3">
        <Link href="/admin/dashboard" className="font-display text-lg font-semibold text-nuit">
          Espace agence
        </Link>

        <nav aria-label="Navigation de l espace agence" className="flex-1">
          <ul className="flex flex-wrap gap-x-4 gap-y-2 text-sm">
            {liens.map((l) => (
              <li key={l.href}>
                <Link
                  href={l.href}
                  className={
                    pathname === l.href
                      ? 'inline-flex items-center gap-1.5 font-semibold text-nuit underline decoration-or decoration-2 underline-offset-8'
                      : 'inline-flex items-center gap-1.5 text-nuit/70 hover:text-nuit'
                  }
                >
                  <l.icone className="h-4 w-4" aria-hidden="true" />
                  {l.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <div className="flex items-center gap-3 text-sm">
          <span className="text-ardoise/70">
            {nom} <span className="text-ardoise/45">({role.toLowerCase()})</span>
          </span>
          <button
            type="button"
            onClick={() => signOut({ callbackUrl: '/' })}
            className="inline-flex items-center gap-1.5 rounded-md border border-nuit/20 px-3 py-1.5 font-semibold text-nuit"
          >
            <LogOut className="h-4 w-4" aria-hidden="true" />
            Se deconnecter
          </button>
        </div>
      </div>
    </div>
  );
}
