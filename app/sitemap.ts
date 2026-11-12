import type { MetadataRoute } from 'next';
import { prisma } from '@/lib/prisma';
import { site } from '@/lib/site';

export const revalidate = 3600;
export const dynamic = 'force-dynamic';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const statiquesBase = [
    { url: `${site.url}/`, changeFrequency: 'daily' as const, priority: 1 },
    { url: `${site.url}/biens`, changeFrequency: 'daily' as const, priority: 0.9 },
    { url: `${site.url}/biens?categorie=MAISON`, changeFrequency: 'weekly' as const, priority: 0.7 },
    { url: `${site.url}/biens?categorie=PARCELLE`, changeFrequency: 'weekly' as const, priority: 0.7 },
    { url: `${site.url}/biens?categorie=VEHICULE`, changeFrequency: 'weekly' as const, priority: 0.7 },
    { url: `${site.url}/etudes-de-cas`, changeFrequency: 'weekly' as const, priority: 0.7 },
    { url: `${site.url}/faq`, changeFrequency: 'monthly' as const, priority: 0.6 },
    { url: `${site.url}/contact`, changeFrequency: 'monthly' as const, priority: 0.6 },
    { url: `${site.url}/confidentialite`, changeFrequency: 'yearly' as const, priority: 0.2 },
  ];

  const statiques: MetadataRoute.Sitemap = statiquesBase.map((e) => ({ ...e, lastModified: new Date() }));

  // Les biens vendus sortent du sitemap : leur page reste accessible mais non indexee.
  const biens = await prisma.property.findMany({
    where: { status: { not: 'VENDU' } },
    select: { id: true, updatedAt: true, featured: true },
    orderBy: { updatedAt: 'desc' },
  });

  const etudes = await prisma.caseStudy.findMany({
    where: { published: true },
    select: { slug: true, updatedAt: true },
  });

  return [
    ...statiques,
    ...etudes.map((e) => ({
      url: `${site.url}/etudes-de-cas/${e.slug}`,
      lastModified: e.updatedAt,
      changeFrequency: 'monthly' as const,
      priority: 0.6,
    })),
    ...biens.map((b) => ({
      url: `${site.url}/biens/${b.id}`,
      lastModified: b.updatedAt,
      changeFrequency: 'weekly' as const,
      priority: b.featured ? 0.8 : 0.6,
    })),
  ];
}
