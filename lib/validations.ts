import { z } from 'zod';

export const categoryEnum = z.enum(['MAISON', 'PARCELLE', 'VEHICULE']);
export const statusEnum = z.enum(['DISPONIBLE', 'VENDU', 'RESERVE']);

export type Category = z.infer<typeof categoryEnum>;
export type Status = z.infer<typeof statusEnum>;

/**
 * Numero RDC : +243 suivi de 9 chiffres (le 0 initial local est accepte puis
 * normalise). Exemples valides : +243971234567, 0971234567, 243 97 123 45 67.
 */
export const phoneRDC = z
  .string()
  .trim()
  .min(9, 'Numero trop court')
  .max(20, 'Numero trop long')
  .transform((v) => v.replace(/[\s.\-()]/g, ''))
  .refine((v) => /^(\+?243|0)\d{9}$/.test(v), {
    message: 'Entrez un numero RDC valide, par exemple +243 97 123 45 67',
  })
  .transform((v) => (v.startsWith('0') ? `+243${v.slice(1)}` : v.startsWith('+') ? v : `+${v}`));

export const contactSchema = z.object({
  name: z
    .string()
    .trim()
    .min(2, 'Indiquez votre nom')
    .max(80, 'Nom trop long')
    .regex(/^[\p{L}\s'’\-.]+$/u, 'Le nom contient des caracteres non autorises'),
  phone: phoneRDC,
  email: z
    .string()
    .trim()
    .email('Adresse e-mail invalide')
    .max(120)
    .optional()
    .or(z.literal('').transform(() => undefined)),
  message: z
    .string()
    .trim()
    .min(10, 'Votre message doit faire au moins 10 caracteres')
    .max(2000, 'Votre message depasse 2000 caracteres'),
  propertyId: z.string().cuid().optional().or(z.literal('').transform(() => undefined)),
  // Champ piege : rempli uniquement par les robots. Valide comme une chaine
  // libre pour que le traitement du piege se fasse dans le handler, pas ici.
  website: z.string().max(200).optional(),
});

export type ContactInput = z.input<typeof contactSchema>;
export type ContactData = z.output<typeof contactSchema>;

/** Filtres du catalogue : tout vient de l'URL, donc tout est valide. */
export const propertyFiltersSchema = z.object({
  categorie: categoryEnum.optional(),
  localisation: z.string().trim().max(60).optional(),
  prixMin: z.coerce.number().int().min(0).max(100_000_000).optional(),
  prixMax: z.coerce.number().int().min(0).max(100_000_000).optional(),
  page: z.coerce.number().int().min(1).max(500).catch(1).default(1),
});

export type PropertyFilters = z.infer<typeof propertyFiltersSchema>;

/** Ne jette jamais : des parametres d'URL farfelus retombent sur les defauts. */
export function parseFilters(searchParams: Record<string, string | string[] | undefined>): PropertyFilters {
  const flat: Record<string, string> = {};
  for (const [key, value] of Object.entries(searchParams)) {
    const v = Array.isArray(value) ? value[0] : value;
    if (typeof v === 'string' && v !== '') flat[key] = v;
  }
  const result = propertyFiltersSchema.safeParse(flat);
  return result.success ? result.data : { page: 1 };
}

export const loginSchema = z.object({
  email: z.string().trim().email('Adresse e-mail invalide'),
  password: z.string().min(8, 'Mot de passe trop court'),
});

/* ------------------------------------------------------------------ */
/* Schemas de l'espace agence                                          */
/* ------------------------------------------------------------------ */

export const codeTotpSchema = z
  .string()
  .trim()
  .transform((v) => v.replace(/\s/g, ''))
  .refine((v) => /^\d{6}$/.test(v) || /^[A-Z0-9]{5}-[A-Z0-9]{5}$/i.test(v), {
    message: 'Entrez le code a six chiffres, ou un code de secours.',
  });

const imageSchema = z.object({
  url: z.string().min(1).max(500),
  alt: z.string().trim().min(5, 'Decrivez la photo en quelques mots').max(160),
});

export const propertySchema = z.object({
  title: z.string().trim().min(8, 'Titre trop court').max(140),
  description: z.string().trim().min(40, 'Decrivez le bien en 40 caracteres minimum').max(5000),
  category: categoryEnum,
  status: statusEnum,
  // Prix saisi en dollars entiers ; converti en cents avant enregistrement.
  price: z.coerce.number().int().min(1, 'Le prix doit etre superieur a zero').max(50_000_000),
  currency: z.literal('USD').default('USD'),
  location: z.string().trim().min(3, 'Indiquez le quartier').max(120),
  featured: z.coerce.boolean().default(false),
  images: z.array(imageSchema).min(1, 'Ajoutez au moins une photo').max(12),
});

export const testimonialSchema = z.object({
  clientName: z.string().trim().min(2).max(80),
  content: z.string().trim().min(20, 'Avis trop court').max(1200),
  rating: z.coerce.number().int().min(1).max(5),
  published: z.coerce.boolean().default(true),
});

export const faqSchema = z.object({
  question: z.string().trim().min(8, 'Question trop courte').max(200),
  answer: z.string().trim().min(20, 'Reponse trop courte').max(2000),
  order: z.coerce.number().int().min(0).max(999).default(0),
});

export const caseStudySchema = z.object({
  title: z.string().trim().min(8).max(140),
  client: z.string().trim().min(2, 'Ex. : "Famille K." ou "Societe M."').max(80),
  category: categoryEnum,
  location: z.string().trim().min(3).max(120),
  challenge: z.string().trim().min(30, 'Decrivez la situation de depart').max(1500),
  approach: z.string().trim().min(30, 'Decrivez ce que l agence a fait').max(1500),
  result: z.string().trim().min(30, 'Decrivez l issue').max(1500),
  metric: z.string().trim().min(3, 'Ex. : "Vendu en 21 jours"').max(60),
  image: z.string().min(1, 'Ajoutez une photo').max(500),
  imageAlt: z.string().trim().min(5, 'Decrivez la photo').max(160),
  published: z.coerce.boolean().default(true),
  order: z.coerce.number().int().min(0).max(999).default(0),
});

export const idSchema = z.string().cuid('Identifiant invalide');

/** Slug ASCII stable, utilise pour les URLs d'etudes de cas. */
export function slugifier(valeur: string): string {
  return valeur
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '')
    .slice(0, 70);
}

/** Aplatit les erreurs Zod en { champ: message } pour l'affichage des formulaires. */
export function champsEnErreur(erreur: z.ZodError): Record<string, string> {
  const sortie: Record<string, string> = {};
  for (const issue of erreur.issues) {
    const cle = issue.path.join('.') || 'global';
    sortie[cle] ??= issue.message;
  }
  return sortie;
}
