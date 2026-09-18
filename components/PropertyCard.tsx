import Image from 'next/image';
import Link from 'next/link';
import { MapPin, MessageCircle } from 'lucide-react';
import { coverImage } from '@/lib/images';
import { categories, statuses, formatPrice, site } from '@/lib/site';
import { whatsappLink, propertyMessage } from '@/lib/whatsapp';
import type { Category, Status } from '@/lib/validations';

export type PropertyCardData = {
  id: string;
  slug: string;
  title: string;
  category: string;
  status: string;
  price: number;
  currency: string;
  location: string;
  images: string;
};

export default function PropertyCard({
  property,
  priority = false,
}: {
  property: PropertyCardData;
  priority?: boolean;
}) {
  const image = coverImage(property.images);
  const categorie = categories[property.category as Category] ?? { label: property.category };
  const statut = statuses[property.status as Status] ?? statuses.DISPONIBLE;
  const href = `/biens/${property.id}`;

  return (
    <article className="flex flex-col overflow-hidden rounded-lg bg-white shadow-carte ring-1 ring-nuit/5">
      <div className="relative aspect-[4/3] bg-nuit-50">
        <Image
          src={image.url}
          alt={image.alt}
          fill
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
          className="object-cover"
          priority={priority}
          loading={priority ? undefined : 'lazy'}
        />
        <span className="absolute left-3 top-3 rounded bg-nuit/90 px-2.5 py-1 text-xs font-semibold text-white">
          {categorie.label}
        </span>
        <span
          className={`absolute right-3 top-3 rounded px-2.5 py-1 text-xs font-semibold ring-1 ${statut.classes}`}
        >
          {statut.label}
        </span>
      </div>

      <div className="flex flex-1 flex-col gap-3 p-4">
        <h3 className="text-lg">
          <Link href={href} className="hover:underline">
            {property.title}
          </Link>
        </h3>

        <p className="flex items-center gap-1.5 text-sm text-ardoise/75">
          <MapPin className="h-4 w-4 shrink-0 text-cuivre" aria-hidden="true" />
          {property.location}
        </p>

        <p className="mt-auto font-display text-2xl font-semibold text-nuit">
          {formatPrice(property.price, property.currency)}
        </p>

        <div className="flex gap-2">
          <Link href={href} className="btn-nuit flex-1 py-2.5 text-sm">
            Voir le bien
          </Link>
          <a
            href={whatsappLink(
              propertyMessage(property.title, property.id.slice(-6).toUpperCase(), `${site.url}${href}`),
            )}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={`Contacter l agence sur WhatsApp au sujet de ${property.title}`}
            className="inline-flex items-center justify-center rounded-md bg-[#128C7E] px-3 py-2.5 text-white transition-colors hover:bg-[#0f7a6d]"
          >
            <MessageCircle className="h-5 w-5" aria-hidden="true" />
          </a>
        </div>
      </div>
    </article>
  );
}
