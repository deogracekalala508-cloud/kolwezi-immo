import type { Metadata } from 'next';
import Link from 'next/link';
import Image from 'next/image';
import { Home, LandPlot, Car, ArrowRight, ShieldCheck } from 'lucide-react';
import { prisma } from '@/lib/prisma';
import PropertyCard from '@/components/PropertyCard';
import Testimonials from '@/components/Testimonials';
import FaqAccordion from '@/components/FaqAccordion';
import TeamSection from '@/components/TeamSection';
import MapSection from '@/components/MapSection';

export const metadata: Metadata = {
  title: 'Maisons, parcelles et véhicules à vendre à Kolwezi',
  description:
    'Humo Kolwezi vend maisons, parcelles et véhicules à Kolwezi. Titres vérifiés au cadastre du Lualaba, visites accompagnées, réponse le jour même sur WhatsApp.',
  alternates: { canonical: '/' },
};

export const revalidate = 300;

const services = [
  {
    href: '/biens?categorie=MAISON',
    icone: Home,
    titre: 'Maisons',
    texte:
      'Villas, maisons familiales et studios meublés, du Quartier Latin au Golf. Chaque logement est visité par un agent avant publication.',
  },
  {
    href: '/biens?categorie=PARCELLE',
    icone: LandPlot,
    titre: 'Parcelles',
    texte:
      'Terrains résidentiels, commerciaux et agricoles. Nous confirmons le certificat d’enregistrement au cadastre avant de vous les proposer.',
  },
  {
    href: '/biens?categorie=VEHICULE',
    icone: Car,
    titre: 'Véhicules',
    texte:
      '4x4, pick-up et berlines contrôlés par notre atelier, avec documents de dédouanement vérifiés devant vous.',
  },
];

export default async function Accueil() {
  const [biens, avis, faq, equipe] = await Promise.all([
    prisma.property.findMany({
      where: { featured: true, status: { not: 'VENDU' } },
      orderBy: { createdAt: 'desc' },
      take: 6,
    }),
    prisma.testimonial.findMany({
      where: { published: true },
      orderBy: { createdAt: 'desc' },
      take: 4,
    }),
    prisma.faqItem.findMany({ orderBy: { order: 'asc' }, take: 4 }),
    prisma.teamMember.findMany({ orderBy: { order: 'asc' } }),
  ]);

  const etudes = await prisma.caseStudy.findMany({
    where: { published: true },
    orderBy: [{ order: 'asc' }, { createdAt: 'desc' }],
    take: 3,
  });

  return (
    <>
      {/* HERO */}
      <section className="bg-nuit text-white">
        <div className="conteneur grid gap-8 py-12 sm:py-16 lg:grid-cols-[1.05fr_1fr] lg:items-center lg:gap-12">
          <div>
            <p className="flex items-center gap-2 text-sm font-semibold text-or-300">
              <ShieldCheck className="h-5 w-5" aria-hidden="true" />
              Titres vérifiés au cadastre du Lualaba
            </p>
            <h1 className="mt-4 text-4xl text-white sm:text-5xl lg:text-6xl">
              Acheter à Kolwezi sans mauvaise surprise
            </h1>
            <p className="mt-5 max-w-lisible text-lg text-white/85">
              Maisons, parcelles et véhicules vérifiés avant d’être mis en vente. Un agent vous
              accompagne de la visite jusqu’à la mutation.
            </p>
            <div className="mt-7 flex flex-col gap-3 sm:flex-row">
              <Link href="/biens" className="btn-or text-lg">
                Voir les biens
                <ArrowRight className="h-5 w-5" aria-hidden="true" />
              </Link>
              <Link
                href="/contact"
                className="inline-flex items-center justify-center rounded-md border border-white/30 px-5 py-3 font-semibold text-white transition-colors hover:border-white/70"
              >
                Nous dire ce que vous cherchez
              </Link>
            </div>
          </div>

          <div className="relative aspect-[4/3] overflow-hidden rounded-lg ring-1 ring-white/15 lg:aspect-[5/4]">
            <Image
              src="https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=1400&q=70"
              alt="Villa murée avec cour en terre rouge à Kolwezi"
              fill
              sizes="(max-width: 1024px) 100vw, 45vw"
              className="object-cover"
              priority
            />
          </div>
        </div>
      </section>

      {/* SERVICES */}
      <section className="bloc" aria-labelledby="titre-services">
        <div className="conteneur">
          <h2 id="titre-services" className="text-2xl sm:text-3xl">Ce que nous vendons</h2>
          <ul className="mt-8 grid gap-4 md:grid-cols-3">
            {services.map((s) => (
              <li key={s.href} className="rounded-lg bg-white p-6 shadow-carte ring-1 ring-nuit/5">
                <s.icone className="h-8 w-8 text-cuivre" aria-hidden="true" />
                <h3 className="mt-4 text-xl">{s.titre}</h3>
                <p className="mt-2 text-ardoise/85">{s.texte}</p>
                <Link
                  href={s.href}
                  className="mt-4 inline-flex items-center gap-1.5 font-semibold text-nuit-600 hover:underline"
                >
                  Voir les {s.titre.toLowerCase()} disponibles
                  <ArrowRight className="h-4 w-4" aria-hidden="true" />
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <div className="conteneur"><div className="filet-cuivre" /></div>

      {/* BIENS EN VEDETTE */}
      <section className="bloc" aria-labelledby="titre-vedette">
        <div className="conteneur">
          <div className="flex flex-wrap items-end justify-between gap-4">
            <div>
              <h2 id="titre-vedette" className="text-2xl sm:text-3xl">Sélection du moment</h2>
              <p className="mt-2 max-w-lisible text-ardoise/85">
                Nos biens phares sélectionnés cette semaine.
              </p>
            </div>
            <Link href="/biens" className="btn-contour">
              Tout le catalogue
            </Link>
          </div>

          {biens.length > 0 ? (
            <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {biens.map((bien, index) => (
                <PropertyCard key={bien.id} property={bien} priority={index < 2} />
              ))}
            </div>
          ) : (
            <p className="mt-8 rounded-lg bg-white p-6 text-ardoise/85 ring-1 ring-nuit/5">
              Aucun bien en vedette pour l’instant. Parcourez le catalogue complet ou dites-nous ce
              que vous cherchez, nous vous préviendrons dès la prochaine entrée.
            </p>
          )}
        </div>
      </section>

      {/* AVIS CLIENTS */}
      <section id="avis" className="bloc bg-nuit-50" aria-labelledby="titre-avis">
        <div className="conteneur">
          <h2 id="titre-avis" className="text-2xl sm:text-3xl">Ce que disent nos clients</h2>
          <p className="mt-2 max-w-lisible text-ardoise/85">
            Des ventes accompagnées racontées par nos acheteurs et vendeurs eux-mêmes.
          </p>
          <div className="mt-8">
            <Testimonials items={avis} />
          </div>
        </div>
      </section>

      {/* ETUDES DE CAS */}
      {etudes.length > 0 && (
        <section className="bloc" aria-labelledby="titre-etudes">
          <div className="conteneur">
            <div className="flex flex-wrap items-end justify-between gap-4">
              <div>
                <h2 id="titre-etudes" className="text-2xl sm:text-3xl">Nos études de cas</h2>
                <p className="mt-2 max-w-lisible text-ardoise/85">
                  Ce que donne un accompagnement complet, chiffres et délais à l’appui.
                </p>
              </div>
              <Link href="/etudes-de-cas" className="btn-contour">Toutes les études</Link>
            </div>

            <ul className="mt-8 grid gap-5 md:grid-cols-3">
              {etudes.map((e) => (
                <li key={e.id} className="overflow-hidden rounded-lg bg-white shadow-carte ring-1 ring-nuit/5">
                  <div className="relative aspect-[16/10] bg-nuit-50">
                    <Image
                      src={e.image}
                      alt={e.imageAlt}
                      fill
                      sizes="(max-width: 768px) 100vw, 33vw"
                      className="object-cover"
                      loading="lazy"
                      unoptimized={e.image.startsWith('/uploads/')}
                    />
                  </div>
                  <div className="p-5">
                    <p className="font-display text-xl font-semibold text-nuit">{e.metric}</p>
                    <h3 className="mt-2 text-lg">
                      <Link href={`/etudes-de-cas/${e.slug}`} className="hover:underline">{e.title}</Link>
                    </h3>
                    <p className="mt-2 text-sm text-ardoise/80">{e.location}</p>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </section>
      )}

      {/* FAQ */}
      <section className="bloc" aria-labelledby="titre-faq">
        <div className="conteneur">
          <h2 id="titre-faq" className="text-2xl sm:text-3xl">Questions fréquentes</h2>
          <div className="mt-8">
            <FaqAccordion items={faq} />
          </div>
          <Link href="/faq" className="mt-6 inline-flex items-center gap-1.5 font-semibold text-nuit-600 hover:underline">
            Lire toutes les questions
            <ArrowRight className="h-4 w-4" aria-hidden="true" />
          </Link>
        </div>
      </section>

      {/* EQUIPE */}
      <section id="equipe" className="bloc bg-nuit-50" aria-labelledby="titre-equipe">
        <div className="conteneur">
          <h2 id="titre-equipe" className="text-2xl sm:text-3xl">Notre équipe à votre service</h2>
          <p className="mt-2 max-w-lisible text-ardoise/85">
            Une équipe dédiée et un bureau sur l’avenue Manika. Vous parlez au même interlocuteur du début à la fin.
          </p>
          <div className="mt-8">
            <TeamSection members={equipe} />
          </div>
        </div>
      </section>

      {/* CARTE */}
      <section className="bloc">
        <div className="conteneur">
          <MapSection />
        </div>
      </section>
    </>
  );
}
