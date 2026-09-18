import type { Metadata } from 'next';
import Link from 'next/link';
import { prisma } from '@/lib/prisma';
import FaqAccordion from '@/components/FaqAccordion';
import Breadcrumbs from '@/components/Breadcrumbs';

export const metadata: Metadata = {
  title: 'Questions frequentes sur l achat a Kolwezi',
  description:
    'Frais d agence, verification des titres, paiement en francs congolais, delais de vente : les reponses de Humo Kolwezi aux questions que posent nos clients.',
  alternates: { canonical: '/faq' },
  openGraph: {
    title: 'Questions frequentes | Humo Kolwezi',
    description: 'Frais, titres, delais et paiement : tout ce qu il faut savoir avant d acheter a Kolwezi.',
    url: '/faq',
  },
};

export const revalidate = 3600;

export default async function Faq() {
  const items = await prisma.faqItem.findMany({ orderBy: { order: 'asc' } });

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: items.map((i) => ({
      '@type': 'Question',
      name: i.question,
      acceptedAnswer: { '@type': 'Answer', text: i.answer },
    })),
  };

  return (
    <div className="conteneur pb-20">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <Breadcrumbs items={[{ label: 'Questions frequentes' }]} />

      <header className="mb-8 max-w-lisible">
        <h1 className="text-3xl sm:text-4xl">Questions frequentes</h1>
        <p className="mt-3 text-ardoise/85">
          Les questions que nos clients posent le plus souvent, avec des reponses precises sur les
          frais, les documents et les delais. Votre question n y est pas ?{' '}
          <Link href="/contact" className="underline">Posez-la nous</Link>.
        </p>
      </header>

      <FaqAccordion items={items} />

      <section className="mt-12 rounded-lg bg-nuit p-8 text-white">
        <h2 className="text-2xl text-white">Pret a visiter ?</h2>
        <p className="mt-2 max-w-lisible text-white/85">
          Choisissez un bien dans le catalogue, ou decrivez-nous votre recherche et nous vous
          proposerons ce qui correspond.
        </p>
        <div className="mt-5 flex flex-col gap-3 sm:flex-row">
          <Link href="/biens" className="btn-or">Voir les biens</Link>
          <Link
            href="/contact"
            className="inline-flex items-center justify-center rounded-md border border-white/30 px-5 py-3 font-semibold text-white hover:border-white/70"
          >
            Decrire ma recherche
          </Link>
        </div>
      </section>
    </div>
  );
}
