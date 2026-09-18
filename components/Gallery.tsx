'use client';

import Image from 'next/image';
import { useState } from 'react';
import type { PropertyImage } from '@/lib/images';

export default function Gallery({ images, title }: { images: PropertyImage[]; title: string }) {
  const [actif, setActif] = useState(0);
  const principale = images[actif] ?? images[0];
  if (!principale) return null;

  return (
    <div>
      <div className="relative aspect-[4/3] overflow-hidden rounded-lg bg-nuit-50 sm:aspect-[16/10]">
        <Image
          src={principale.url}
          alt={principale.alt}
          fill
          sizes="(max-width: 1024px) 100vw, 60vw"
          className="object-cover"
          priority
        />
      </div>

      {images.length > 1 && (
        <ul className="mt-3 grid grid-cols-4 gap-2 sm:grid-cols-6">
          {images.map((image, index) => (
            <li key={`${image.url}-${index}`}>
              <button
                type="button"
                onClick={() => setActif(index)}
                aria-label={`Afficher la photo ${index + 1} sur ${images.length} : ${image.alt}`}
                aria-current={index === actif}
                className={`relative block aspect-square w-full overflow-hidden rounded ${
                  index === actif ? 'ring-2 ring-or' : 'ring-1 ring-nuit/15'
                }`}
              >
                <Image
                  src={image.url}
                  alt=""
                  fill
                  sizes="120px"
                  className="object-cover"
                  loading="lazy"
                />
              </button>
            </li>
          ))}
        </ul>
      )}
      <p className="sr-only">Galerie photo de {title}.</p>
    </div>
  );
}
