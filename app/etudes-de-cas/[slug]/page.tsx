import type { Metadata } from 'next';
import Link from 'next/link';
import Image from 'next/image';
import { notFound } from 'next/navigation';
import { prisma } from '@/lib/prisma';
import { site, categories } from '@/lib/site';
import type { Category } from '@/lib/validations';
import Breadcrumbs from '@/components/Breadcrumbs';

export const revalidate = 600;

type Props = { params: { slug: string } };

export async function generateStaticParams() {
  const etudes = await prisma.caseStudy.findMany({
    where: { published: true },
    select: { slug: true },
    take: 50,
  });
  return etudes.map((e) => ({ slug: e.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const etude = await prisma.caseStudy.findUnique({ where: { slug: params.slug } });
  if (!etude) return { title: 'Etude de cas introuvable', robots: { index: false, follow: true } };

  const description = `${etude.metric}. ${etude.challenge.slice(0, 130)}...`;

  return {
    title: etude.title,
    description,
    alternates: { canonical: `/etudes-de-cas/${etude.slug}` },
    openGraph: {
      type: 'article',
      title: etude.title,
      description,
      url: `${site.url}/etudes-de-cas/${etude.slug}`,
      images: [{ url: etude.image, width: 1200, height: 630, alt: etude.imageAlt }],
    },
    robots: etude.published ? { index: true, follow: true } : { index: false, follow: true },
  };
}

export default async function Etude({ params }: Props) {
  const etude = await prisma.caseStudy.findUnique({ where: { slug: params.slug } });
  if (!etude || !etude.published) notFound();

  const categorie = categories[etude.category as Category]?.label ?? etude.category;

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: etude.title,
    description: etude.metric,
    image: [etude.image.startsWith('http') ? etude.image : `${site.url}${etude.image}`],
    datePublished: etude.createdAt.toISOString(),
    dateModified: etude.updatedAt.toISOString(),
    author: { '@type': 'Organization', name: site.legalName, '@id': `${site.url}/#agence` },
    publisher: { '@id': `${site.url}/#agence` },
    mainEntityOfPage: `${site.url}/etudes-de-cas/${etude.slug}`,
  };

  const sections = [
    { titre: 'La situation de depart', texte: etude.challenge },
    { titre: 'Ce que nous avons fait', texte: etude.approach },
    { titre: 'Le resultat', texte: etude.result },
  ];

  return (
    <div className="conteneur pb-20">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

      <Breadcrumbs
        items={[{ label: 'Etudes de cas', href: '/etudes-de-cas' }, { label: etude.title }]}
      />

      <article className="max-w-3xl">
        <p className="text-sm font-semibold text-cuivre">
          {categorie} &middot; {etude.location} &middot; Client : {etude.client}
        </p>
        <h1 className="mt-2 text-3xl sm:text-4xl">{etude.title}</h1>
        <p className="mt-4 font-display text-3xl font-semibold text-nuit">{etude.metric}</p>

        <div className="relative mt-8 aspect-[16/9] overflow-hidden rounded-lg bg-nuit-50">
          <Image
            src={etude.image}
            alt={etude.imageAlt}
            fill
            sizes="(max-width: 1024px) 100vw, 768px"
            className="object-cover"
            priority
            unoptimized={etude.image.startsWith('/uploads/')}
          />
        </div>

        {/* Trois temps : c'est une sequence, d'ou la numerotation. */}
        <ol className="mt-10 space-y-10">
          {sections.map((s, index) => (
            <li key={s.titre}>
              <h2 className="text-xl">
                <span className="mr-3 font-display text-cuivre">{index + 1}</span>
                {s.titre}
              </h2>
              <p className="mt-3 max-w-lisible whitespace-pre-line text-ardoise/90">{s.texte}</p>
            </li>
          ))}
        </ol>

        <div className="mt-12 rounded-lg bg-nuit-50 p-6">
          <h2 className="text-xl">Votre dossier ressemble a celui-la ?</h2>
          <p className="mt-2 max-w-lisible text-ardoise/85">
            Parlons-en. L estimation et la verification de vos documents sont gratuites.
          </p>
          <div className="mt-5 flex flex-col gap-3 sm:flex-row">
            <Link href="/contact" className="btn-or">Demander une estimation</Link>
            <Link href="/etudes-de-cas" className="btn-contour">Lire d autres dossiers</Link>
          </div>
        </div>
      </article>
    </div>
  );
}
