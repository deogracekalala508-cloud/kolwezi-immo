import type { Metadata } from 'next';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowRight } from 'lucide-react';
import { prisma } from '@/lib/prisma';
import { categories } from '@/lib/site';
import type { Category } from '@/lib/validations';
import Breadcrumbs from '@/components/Breadcrumbs';

export const metadata: Metadata = {
  title: 'Etudes de cas : ventes accompagnees a Kolwezi',
  description:
    'Des ventes reelles suivies par Humo Kolwezi, racontees en detail : situation de depart, travail de l agence, resultat obtenu et delai constate.',
  alternates: { canonical: '/etudes-de-cas' },
  openGraph: {
    title: 'Etudes de cas | Humo Kolwezi',
    description: 'Ce que donne un accompagnement complet : quatre ventes racontees du debut a la fin.',
    url: '/etudes-de-cas',
  },
};

export const revalidate = 600;

export default async function EtudesDeCas() {
  const etudes = await prisma.caseStudy.findMany({
    where: { published: true },
    orderBy: [{ order: 'asc' }, { createdAt: 'desc' }],
  });

  return (
    <div className="conteneur pb-20">
      <Breadcrumbs items={[{ label: 'Etudes de cas' }]} />

      <header className="mb-10 max-w-lisible">
        <h1 className="text-3xl sm:text-4xl">Ventes accompagnees, racontees en detail</h1>
        <p className="mt-3 text-ardoise/85">
          Chaque dossier suit le meme fil : la situation au depart, ce que nous avons fait, et le
          resultat avec son delai. Les noms sont abreges a la demande des clients.
        </p>
      </header>

      {etudes.length === 0 ? (
        <p className="rounded-lg bg-white p-6 ring-1 ring-nuit/5">
          Les premieres etudes de cas arrivent bientot. En attendant, les avis de nos clients sont
          sur la <Link href="/#avis" className="underline">page d accueil</Link>.
        </p>
      ) : (
        <ul className="grid gap-6 lg:grid-cols-2">
          {etudes.map((e) => (
            <li key={e.id} className="overflow-hidden rounded-lg bg-white shadow-carte ring-1 ring-nuit/5">
              <div className="relative aspect-[16/9] bg-nuit-50">
                <Image
                  src={e.image}
                  alt={e.imageAlt}
                  fill
                  sizes="(max-width: 1024px) 100vw, 50vw"
                  className="object-cover"
                  loading="lazy"
                  unoptimized={e.image.startsWith('/uploads/')}
                />
              </div>

              <div className="p-6">
                <p className="text-sm font-semibold text-cuivre">
                  {categories[e.category as Category]?.label ?? e.category} &middot; {e.location}
                </p>
                <h2 className="mt-2 text-xl">
                  <Link href={`/etudes-de-cas/${e.slug}`} className="hover:underline">
                    {e.title}
                  </Link>
                </h2>
                <p className="mt-3 font-display text-2xl font-semibold text-nuit">{e.metric}</p>
                <p className="mt-3 max-w-lisible text-ardoise/85">{e.challenge}</p>
                <Link
                  href={`/etudes-de-cas/${e.slug}`}
                  className="mt-4 inline-flex items-center gap-1.5 font-semibold text-nuit-600 hover:underline"
                >
                  Lire le dossier complet
                  <ArrowRight className="h-4 w-4" aria-hidden="true" />
                </Link>
              </div>
            </li>
          ))}
        </ul>
      )}

      <section className="mt-16 rounded-lg bg-nuit p-8 text-white">
        <h2 className="text-2xl text-white">Vous avez un bien a vendre ?</h2>
        <p className="mt-2 max-w-lisible text-white/85">
          Nous commencons toujours par une estimation gratuite et une verification de vos documents.
        </p>
        <Link href="/contact" className="btn-or mt-5">Demander une estimation</Link>
      </section>
    </div>
  );
}
