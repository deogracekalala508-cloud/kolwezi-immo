import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { MessageCircle, MapPin, Tag, CalendarDays } from 'lucide-react';
import { prisma } from '@/lib/prisma';
import { parseImages } from '@/lib/images';
import { categories, statuses, formatPrice, site } from '@/lib/site';
import { whatsappLink, propertyMessage } from '@/lib/whatsapp';
import type { Category, Status } from '@/lib/validations';
import Gallery from '@/components/Gallery';
import Breadcrumbs from '@/components/Breadcrumbs';
import PropertyCard from '@/components/PropertyCard';
import ContactForm from '@/components/ContactForm';

export const revalidate = 120;

type Props = { params: { id: string } };

/** Accepte l'identifiant ou le slug, pour que les anciens liens continuent de marcher. */
async function trouverBien(id: string) {
  return prisma.property.findFirst({ where: { OR: [{ id }, { slug: id }] } });
}

export async function generateStaticParams() {
  const biens = await prisma.property.findMany({ select: { id: true }, take: 100 });
  return biens.map((b) => ({ id: b.id }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const bien = await trouverBien(params.id);
  if (!bien) {
    return { title: 'Bien introuvable', robots: { index: false, follow: true } };
  }

  const image = parseImages(bien.images)[0];
  const categorie = categories[bien.category as Category]?.label ?? 'Bien';
  const description = `${categorie} a ${bien.location} au prix de ${formatPrice(bien.price, bien.currency)}. ${bien.description.slice(0, 110)}...`;
  const url = `${site.url}/biens/${bien.id}`;

  return {
    title: `${bien.title} - ${formatPrice(bien.price, bien.currency)}`,
    description,
    alternates: { canonical: `/biens/${bien.id}` },
    openGraph: {
      type: 'article',
      url,
      title: `${bien.title} | ${formatPrice(bien.price, bien.currency)}`,
      description,
      siteName: site.name,
      locale: 'fr_CD',
      images: image
        ? [{ url: image.url, width: 1200, height: 630, alt: image.alt }]
        : [{ url: '/og-default.png', width: 1200, height: 630, alt: site.name }],
    },
    twitter: {
      card: 'summary_large_image',
      title: bien.title,
      description,
      images: image ? [image.url] : ['/og-default.png'],
    },
    robots: bien.status === 'VENDU' ? { index: false, follow: true } : { index: true, follow: true },
  };
}

export default async function FicheBien({ params }: Props) {
  const bien = await trouverBien(params.id);
  if (!bien) notFound();

  const images = parseImages(bien.images);
  const categorie = categories[bien.category as Category] ?? { label: bien.category, plural: bien.category };
  const statut = statuses[bien.status as Status] ?? statuses.DISPONIBLE;
  const reference = bien.id.slice(-6).toUpperCase();
  const url = `${site.url}/biens/${bien.id}`;

  const similaires = await prisma.property.findMany({
    where: { category: bien.category, status: 'DISPONIBLE', NOT: { id: bien.id } },
    orderBy: { createdAt: 'desc' },
    take: 3,
  });

  const jsonLd = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'Product',
        '@id': `${url}#bien`,
        name: bien.title,
        description: bien.description,
        sku: reference,
        category: categorie.label,
        image: images.map((i) => i.url),
        offers: {
          '@type': 'Offer',
          url,
          priceCurrency: bien.currency,
          price: (bien.price / 100).toFixed(2),
          availability:
            bien.status === 'DISPONIBLE'
              ? 'https://schema.org/InStock'
              : bien.status === 'RESERVE'
                ? 'https://schema.org/PreOrder'
                : 'https://schema.org/SoldOut',
          areaServed: bien.location,
          seller: { '@id': `${site.url}/#agence` },
        },
      },
      {
        '@type': 'LocalBusiness',
        '@id': `${site.url}/#agence`,
        name: site.name,
        image: `${site.url}/og-default.png`,
        url: site.url,
        telephone: `+${site.whatsapp}`,
        email: site.email,
        priceRange: '$$',
        address: {
          '@type': 'PostalAddress',
          streetAddress: site.address.street,
          addressLocality: site.address.city,
          addressRegion: site.address.region,
          addressCountry: site.address.country,
        },
        geo: { '@type': 'GeoCoordinates', latitude: site.geo.lat, longitude: site.geo.lng },
        openingHours: 'Mo-Sa 08:00-18:00',
      },
    ],
  };

  return (
    <div className="conteneur pb-20">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

      <Breadcrumbs
        items={[
          { label: 'Les biens', href: '/biens' },
          { label: categorie.plural, href: `/biens?categorie=${bien.category}` },
          { label: bien.title },
        ]}
      />

      <div className="grid gap-10 lg:grid-cols-[1.5fr_1fr] lg:items-start">
        <div>
          <Gallery images={images} title={bien.title} />

          <div className="mt-8">
            <div className="flex flex-wrap items-center gap-2">
              <span className="rounded bg-nuit px-2.5 py-1 text-xs font-semibold text-white">
                {categorie.label}
              </span>
              <span className={`rounded px-2.5 py-1 text-xs font-semibold ring-1 ${statut.classes}`}>
                {statut.label}
              </span>
              <span className="text-xs text-ardoise/60">Reference {reference}</span>
            </div>

            <h1 className="mt-3 text-3xl sm:text-4xl">{bien.title}</h1>

            <ul className="mt-4 flex flex-wrap gap-x-6 gap-y-2 text-sm text-ardoise/80">
              <li className="flex items-center gap-1.5">
                <MapPin className="h-4 w-4 text-cuivre" aria-hidden="true" />
                {bien.location}
              </li>
              <li className="flex items-center gap-1.5">
                <Tag className="h-4 w-4 text-cuivre" aria-hidden="true" />
                {categorie.label}
              </li>
              <li className="flex items-center gap-1.5">
                <CalendarDays className="h-4 w-4 text-cuivre" aria-hidden="true" />
                En ligne depuis le{' '}
                {new Intl.DateTimeFormat('fr-FR', { dateStyle: 'long' }).format(bien.createdAt)}
              </li>
            </ul>

            <h2 className="mt-8 text-xl">Description</h2>
            <p className="mt-3 max-w-lisible whitespace-pre-line text-ardoise/90">{bien.description}</p>
          </div>
        </div>

        {/* Colonne d action : prix et contact, colles en haut sur grand ecran */}
        <aside className="lg:sticky lg:top-24">
          <div className="rounded-lg bg-white p-6 shadow-carte ring-1 ring-nuit/5">
            <p className="font-display text-3xl font-semibold text-nuit">
              {formatPrice(bien.price, bien.currency)}
            </p>
            <p className="mt-1 text-sm text-ardoise/70">
              Prix affiche hors frais de mutation et taxes.
            </p>

            {bien.status === 'VENDU' ? (
              <p className="mt-5 rounded-md bg-stone-100 p-3 text-sm text-stone-700">
                Ce bien est vendu. Nous en avons d autres du meme type, dites-nous ce que vous cherchez.
              </p>
            ) : (
              <a
                href={whatsappLink(propertyMessage(bien.title, reference, url))}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-5 flex w-full items-center justify-center gap-2 rounded-md bg-[#128C7E] px-5 py-3.5 font-semibold text-white transition-colors hover:bg-[#0f7a6d]"
              >
                <MessageCircle className="h-5 w-5" aria-hidden="true" />
                Demander une visite sur WhatsApp
              </a>
            )}

            <p className="mt-3 text-center text-sm text-ardoise/65">
              Reponse le jour meme, {site.hours.toLowerCase()}.
            </p>
          </div>

          <div className="mt-6 rounded-lg bg-white p-6 shadow-carte ring-1 ring-nuit/5">
            <h2 className="text-xl">Ou laissez-nous un message</h2>
            <p className="mt-2 text-sm text-ardoise/80">
              Nous vous rappelons sur le numero indique.
            </p>
            <div className="mt-5">
              <ContactForm propertyId={bien.id} propertyTitle={bien.title} />
            </div>
          </div>
        </aside>
      </div>

      {similaires.length > 0 && (
        <section className="mt-16" aria-labelledby="titre-similaires">
          <h2 id="titre-similaires" className="text-2xl">
            Autres {categorie.plural.toLowerCase()} disponibles
          </h2>
          <div className="mt-6 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {similaires.map((s) => (
              <PropertyCard key={s.id} property={s} />
            ))}
          </div>
          <Link href="/biens" className="mt-6 inline-block font-semibold text-nuit-600 hover:underline">
            Voir tout le catalogue
          </Link>
        </section>
      )}
    </div>
  );
}
