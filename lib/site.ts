export const site = {
  name: 'Humo Kolwezi',
  legalName: 'Humo Kolwezi SARL',
  baseline: 'Achat immobilier a Kolwezi : maisons, parcelles et vehicules',
  url: (process.env.NEXT_PUBLIC_SITE_URL ?? 'http://localhost:3000').replace(/\/$/, ''),
  whatsapp: process.env.NEXT_PUBLIC_WHATSAPP_NUMBER ?? '243974332278',
  gaId: process.env.NEXT_PUBLIC_GA_ID ?? '',
  email: 'contact@humokolwezi.cd',
  address: {
    street: 'Avenue Manika 142',
    quartier: 'Quartier Latin',
    city: 'Kolwezi',
    region: 'Lualaba',
    country: 'CD',
  },
  geo: { lat: -10.7167, lng: 25.4667 },
  hours: 'Lundi au samedi, 8h - 18h',
} as const;

export const categories = {
  MAISON: { label: 'Maison', plural: 'Maisons' },
  PARCELLE: { label: 'Parcelle', plural: 'Parcelles' },
  VEHICULE: { label: 'Vehicule', plural: 'Vehicules' },
} as const;

export const statuses = {
  DISPONIBLE: { label: 'Disponible', classes: 'bg-emerald-50 text-emerald-800 ring-emerald-600/30' },
  RESERVE: { label: 'Reserve', classes: 'bg-amber-50 text-amber-900 ring-amber-600/30' },
  VENDU: { label: 'Vendu', classes: 'bg-stone-100 text-stone-700 ring-stone-500/30' },
} as const;

export function formatPrice(priceInCents: number, currency = 'USD') {
  return new Intl.NumberFormat('fr-CD', {
    style: 'currency',
    currency,
    maximumFractionDigits: 0,
  }).format(priceInCents / 100);
}
