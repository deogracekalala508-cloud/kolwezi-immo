export type PropertyImage = { url: string; alt: string };

const PLACEHOLDER: PropertyImage = {
  url: '/images/placeholder.svg',
  alt: 'Photo du bien non disponible pour le moment',
};

/** SQLite stocke les images comme une chaine JSON : on la lit sans jamais planter. */
export function parseImages(raw: string | null | undefined): PropertyImage[] {
  if (!raw) return [PLACEHOLDER];
  try {
    const parsed: unknown = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [PLACEHOLDER];
    const images = parsed
      .filter((i): i is PropertyImage => {
        if (typeof i !== 'object' || i === null) return false;
        const candidate = i as Record<string, unknown>;
        return typeof candidate.url === 'string' && typeof candidate.alt === 'string';
      })
      .map((i) => ({ url: i.url, alt: i.alt }));
    return images.length > 0 ? images : [PLACEHOLDER];
  } catch {
    return [PLACEHOLDER];
  }
}

export function serializeImages(images: PropertyImage[]): string {
  return JSON.stringify(images);
}

export function coverImage(raw: string | null | undefined): PropertyImage {
  return parseImages(raw)[0] ?? PLACEHOLDER;
}
