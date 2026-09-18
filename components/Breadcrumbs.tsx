import Link from 'next/link';
import { ChevronRight } from 'lucide-react';
import { site } from '@/lib/site';

export type Crumb = { label: string; href?: string };

/**
 * Fil d'Ariane visible + balisage Schema.org BreadcrumbList pour Google.
 * Le dernier element n'est jamais un lien.
 */
export default function Breadcrumbs({ items }: { items: Crumb[] }) {
  const complet: Crumb[] = [{ label: 'Accueil', href: '/' }, ...items];

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: complet.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.label,
      ...(item.href ? { item: `${site.url}${item.href}` } : {}),
    })),
  };

  return (
    <nav aria-label="Fil d Ariane" className="py-4">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <ol className="flex flex-wrap items-center gap-1 text-sm text-nuit/70">
        {complet.map((item, index) => {
          const dernier = index === complet.length - 1;
          return (
            <li key={item.label} className="flex items-center gap-1">
              {index > 0 && <ChevronRight className="h-4 w-4 text-nuit/35" aria-hidden="true" />}
              {dernier || !item.href ? (
                <span aria-current="page" className="font-medium text-nuit">
                  {item.label}
                </span>
              ) : (
                <Link href={item.href} className="underline decoration-nuit/25 hover:decoration-nuit">
                  {item.label}
                </Link>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
