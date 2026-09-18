import type { Metadata } from 'next';
import Link from 'next/link';
import { Suspense } from 'react';
import { prisma } from '@/lib/prisma';
import { parseFilters } from '@/lib/validations';
import { categories } from '@/lib/site';
import PropertyCard from '@/components/PropertyCard';
import PropertyFilters from '@/components/PropertyFilters';
import Pagination from '@/components/Pagination';
import Breadcrumbs from '@/components/Breadcrumbs';

const PAR_PAGE = 12;

export const metadata: Metadata = {
  title: 'Catalogue des biens disponibles a Kolwezi',
  description:
    'Tous les biens disponibles chez Humo Kolwezi : maisons, parcelles et vehicules, filtrables par type, quartier et budget. Prix en dollars, mise a jour quotidienne.',
  alternates: { canonical: '/biens' },
  openGraph: {
    title: 'Catalogue des biens disponibles a Kolwezi',
    description: 'Maisons, parcelles et vehicules a vendre a Kolwezi, filtrables par budget et quartier.',
    url: '/biens',
  },
};

export const revalidate = 120;

type Props = { searchParams: Record<string, string | string[] | undefined> };

export default async function Catalogue({ searchParams }: Props) {
  const filtres = parseFilters(searchParams);

  const where = {
    status: 'DISPONIBLE',
    ...(filtres.categorie ? { category: filtres.categorie } : {}),
    ...(filtres.localisation ? { location: { contains: filtres.localisation } } : {}),
    ...(filtres.prixMin !== undefined || filtres.prixMax !== undefined
      ? {
          price: {
            ...(filtres.prixMin !== undefined ? { gte: filtres.prixMin * 100 } : {}),
            ...(filtres.prixMax !== undefined ? { lte: filtres.prixMax * 100 } : {}),
          },
        }
      : {}),
  };

  const [total, biens, toutes] = await Promise.all([
    prisma.property.count({ where }),
    prisma.property.findMany({
      where,
      orderBy: [{ featured: 'desc' }, { createdAt: 'desc' }],
      skip: (filtres.page - 1) * PAR_PAGE,
      take: PAR_PAGE,
    }),
    prisma.property.findMany({
      where: { status: 'DISPONIBLE' },
      select: { location: true },
      distinct: ['location'],
      orderBy: { location: 'asc' },
    }),
  ]);

  const pagesTotal = Math.max(1, Math.ceil(total / PAR_PAGE));

  function lienPage(page: number) {
    const params = new URLSearchParams();
    if (filtres.categorie) params.set('categorie', filtres.categorie);
    if (filtres.localisation) params.set('localisation', filtres.localisation);
    if (filtres.prixMin !== undefined) params.set('prixMin', String(filtres.prixMin));
    if (filtres.prixMax !== undefined) params.set('prixMax', String(filtres.prixMax));
    if (page > 1) params.set('page', String(page));
    const q = params.toString();
    return q ? `/biens?${q}` : '/biens';
  }

  const titreCategorie = filtres.categorie ? categories[filtres.categorie].plural : 'Biens';

  return (
    <div className="conteneur pb-20">
      <Breadcrumbs items={[{ label: 'Les biens' }]} />

      <header className="mb-8">
        <h1 className="text-3xl sm:text-4xl">{titreCategorie} a vendre a Kolwezi</h1>
        <p className="mt-3 max-w-lisible text-ardoise/85">
          {total === 0
            ? 'Aucun bien ne correspond a ces criteres pour le moment.'
            : `${total} bien${total > 1 ? 's' : ''} disponible${total > 1 ? 's' : ''}. Les biens reserves et vendus sont retires de cette liste.`}
        </p>
      </header>

      <Suspense fallback={<div className="h-40 rounded-lg bg-white ring-1 ring-nuit/5" />}>
        <PropertyFilters localisations={toutes.map((t) => t.location)} />
      </Suspense>

      {biens.length > 0 ? (
        <>
          <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {biens.map((bien, index) => (
              <PropertyCard key={bien.id} property={bien} priority={index < 3} />
            ))}
          </div>
          <Pagination page={filtres.page} total={pagesTotal} construireLien={lienPage} />
        </>
      ) : (
        <div className="mt-8 rounded-lg bg-white p-8 text-center shadow-carte ring-1 ring-nuit/5">
          <h2 className="text-xl">Elargissez la recherche</h2>
          <p className="mx-auto mt-2 max-w-lisible text-ardoise/85">
            Essayez un budget plus large ou un autre quartier. Vous pouvez aussi nous decrire ce que
            vous cherchez : nous vous ecrivons des qu un bien correspond.
          </p>
          <div className="mt-5 flex flex-col justify-center gap-3 sm:flex-row">
            <Link href="/biens" className="btn-contour">Voir tous les biens</Link>
            <Link href="/contact" className="btn-or">Decrire ma recherche</Link>
          </div>
        </div>
      )}

      <section className="mt-16" aria-labelledby="titre-liens">
        <h2 id="titre-liens" className="text-xl">Continuer la visite</h2>
        <ul className="mt-4 grid gap-2 text-nuit-600 sm:grid-cols-2">
          <li><Link href="/biens?categorie=MAISON" className="hover:underline">Maisons a vendre a Kolwezi</Link></li>
          <li><Link href="/biens?categorie=PARCELLE" className="hover:underline">Parcelles et terrains a Kolwezi</Link></li>
          <li><Link href="/biens?categorie=VEHICULE" className="hover:underline">Vehicules d occasion au Lualaba</Link></li>
          <li><Link href="/faq" className="hover:underline">Comment se passe un achat, etape par etape</Link></li>
          <li><Link href="/#equipe" className="hover:underline">Rencontrer l equipe de l agence</Link></li>
          <li><Link href="/contact" className="hover:underline">Nous ecrire ou passer au bureau</Link></li>
        </ul>
      </section>
    </div>
  );
}
