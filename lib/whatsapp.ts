import { site } from './site';

/** Construit un lien wa.me avec message pre-rempli et encode. */
export function whatsappLink(message: string, phone: string = site.whatsapp) {
  const cleanPhone = phone.replace(/\D/g, '');
  return `https://wa.me/${cleanPhone}?text=${encodeURIComponent(message)}`;
}

export function propertyMessage(title: string, reference: string, url?: string) {
  const lines = [
    `Bonjour, je suis interesse par : ${title} (ref. ${reference}).`,
    url ? `Annonce : ${url}` : null,
    'Est-il toujours disponible ?',
  ].filter(Boolean);
  return lines.join('\n');
}

export const generalMessage =
  'Bonjour, je viens du site Humo Kolwezi. Je cherche un bien a Kolwezi et j aimerais des informations.';
