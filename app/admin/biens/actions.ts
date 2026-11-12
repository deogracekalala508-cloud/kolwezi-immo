'use server';

import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { prisma } from '@/lib/prisma';
import { agentCourant, peutModifierBien, filtreProprietaire, REFUS, type EtatAction } from '@/lib/admin';
import { propertySchema, idSchema, slugifier, champsEnErreur, statusEnum } from '@/lib/validations';
import { enregistrerImage } from '@/lib/uploads';
import { parseImages, serializeImages, type PropertyImage } from '@/lib/images';
import { journal, messageErreurPublic } from '@/lib/log';

function rafraichir(id?: string) {
  revalidatePath('/admin/dashboard');
  revalidatePath('/biens');
  revalidatePath('/');
  revalidatePath('/sitemap.xml');
  if (id) revalidatePath(`/biens/${id}`);
}

/** Genere un slug unique meme si deux biens portent le meme titre. */
async function slugUnique(titre: string, idExclu?: string): Promise<string> {
  const base = slugifier(titre) || 'bien';
  for (let suffixe = 0; suffixe < 50; suffixe += 1) {
    const candidat = suffixe === 0 ? base : `${base}-${suffixe}`;
    const existant = await prisma.property.findUnique({
      where: { slug: candidat },
      select: { id: true },
    });
    if (!existant || existant.id === idExclu) return candidat;
  }
  return `${base}-${Date.now()}`;
}

/**
 * Recupere les images : fichiers envoyes (valides et renommes) + images deja
 * en place conservees par l'agent. Les alt texts sont obligatoires.
 */
async function collecterImages(formData: FormData): Promise<
  { ok: true; images: PropertyImage[] } | { ok: false; erreur: string }
> {
  const images: PropertyImage[] = [];

  // Images existantes conservees
  const urlsExistantes = formData.getAll('imageUrl').map(String);
  const altsExistants = formData.getAll('imageAlt').map(String);
  urlsExistantes.forEach((url, index) => {
    if (url) images.push({ url, alt: altsExistants[index]?.trim() || 'Photo du bien' });
  });

  // Nouveaux fichiers
  const fichiers = formData.getAll('fichiers').filter((f): f is File => f instanceof File);
  const altsNouveaux = formData.getAll('fichierAlt').map(String);

  let rang = 0;
  for (const fichier of fichiers) {
    if (fichier.size === 0) {
      rang += 1;
      continue;
    }
    const resultat = await enregistrerImage(fichier);
    if (!resultat.ok) return { ok: false, erreur: resultat.erreur };
    images.push({
      url: resultat.url,
      alt: altsNouveaux[rang]?.trim() || `Photo du bien a vendre a Kolwezi`,
    });
    rang += 1;
  }

  if (images.length === 0) return { ok: false, erreur: 'Ajoutez au moins une photo.' };
  if (images.length > 12) return { ok: false, erreur: 'Douze photos maximum par bien.' };
  return { ok: true, images };
}

function lireChamps(formData: FormData) {
  return {
    title: String(formData.get('title') ?? ''),
    description: String(formData.get('description') ?? ''),
    category: String(formData.get('category') ?? ''),
    status: String(formData.get('status') ?? 'DISPONIBLE'),
    price: String(formData.get('price') ?? ''),
    currency: 'USD' as const,
    location: String(formData.get('location') ?? ''),
    featured: formData.get('featured') === 'on',
  };
}

export async function creerBien(_precedent: EtatAction, formData: FormData): Promise<EtatAction> {
  const agent = await agentCourant();
  if (!agent) return REFUS;

  const images = await collecterImages(formData);
  if (!images.ok) return { erreur: images.erreur };

  const parsed = propertySchema.safeParse({ ...lireChamps(formData), images: images.images });
  if (!parsed.success) {
    return { erreur: 'Corrigez les champs signales.', champs: champsEnErreur(parsed.error) };
  }

  let id: string;
  try {
    const bien = await prisma.property.create({
      data: {
        ownerId: agent.id, // proprietaire fixe par la session, jamais par le formulaire
        title: parsed.data.title,
        slug: await slugUnique(parsed.data.title),
        description: parsed.data.description,
        category: parsed.data.category,
        status: parsed.data.status,
        price: parsed.data.price * 100,
        currency: 'USD',
        location: parsed.data.location,
        featured: parsed.data.featured,
        images: serializeImages(parsed.data.images),
      },
      select: { id: true },
    });
    id = bien.id;
    journal.info('Bien cree', { agentId: agent.id, ressource: bien.id });
  } catch (erreur) {
    journal.erreur('Echec de creation de bien', erreur, { agentId: agent.id });
    return { erreur: messageErreurPublic(erreur, 'Enregistrement impossible. Reessayez.') };
  }

  rafraichir(id);
  redirect(`/admin/biens/${id}/editer?cree=1`);
}

export async function modifierBien(_precedent: EtatAction, formData: FormData): Promise<EtatAction> {
  const agent = await agentCourant();
  if (!agent) return REFUS;

  const id = idSchema.safeParse(String(formData.get('id') ?? ''));
  if (!id.success) return REFUS;
  if (!(await peutModifierBien(agent, id.data))) return REFUS;

  const images = await collecterImages(formData);
  if (!images.ok) return { erreur: images.erreur };

  const parsed = propertySchema.safeParse({ ...lireChamps(formData), images: images.images });
  if (!parsed.success) {
    return { erreur: 'Corrigez les champs signales.', champs: champsEnErreur(parsed.error) };
  }

  try {
    await prisma.property.update({
      // Le filtre proprietaire est reapplique ici : double verrou.
      where: { id: id.data, ...filtreProprietaire(agent) },
      data: {
        title: parsed.data.title,
        slug: await slugUnique(parsed.data.title, id.data),
        description: parsed.data.description,
        category: parsed.data.category,
        status: parsed.data.status,
        price: parsed.data.price * 100,
        location: parsed.data.location,
        featured: parsed.data.featured,
        images: serializeImages(parsed.data.images),
      },
    });
    journal.info('Bien modifie', { agentId: agent.id, ressource: id.data });
  } catch (erreur) {
    journal.erreur('Echec de modification de bien', erreur, { agentId: agent.id });
    return { erreur: messageErreurPublic(erreur, 'Modification impossible. Reessayez.') };
  }

  rafraichir(id.data);
  return { ok: true };
}

export async function changerStatut(formData: FormData): Promise<void> {
  const agent = await agentCourant();
  if (!agent) return;

  const id = idSchema.safeParse(String(formData.get('id') ?? ''));
  const statut = statusEnum.safeParse(String(formData.get('status') ?? ''));
  if (!id.success || !statut.success) return;
  if (!(await peutModifierBien(agent, id.data))) return;

  try {
    await prisma.property.update({
      where: { id: id.data, ...filtreProprietaire(agent) },
      data: { status: statut.data, featured: statut.data === 'VENDU' ? false : undefined },
    });
    journal.info('Statut de bien modifie', {
      agentId: agent.id,
      ressource: id.data,
      statut: statut.data,
    });
  } catch (erreur) {
    journal.erreur('Echec de changement de statut', erreur, { agentId: agent.id });
  }

  rafraichir(id.data);
}

export async function supprimerBien(prevState: { ok?: boolean; erreur?: string }, formData: FormData): Promise<{ ok?: boolean; erreur?: string }> {
  const agent = await agentCourant();
  if (!agent) return { erreur: "Session expirée. Reconnectez-vous pour supprimer ce bien." };

  const id = idSchema.safeParse(String(formData.get('id') ?? ''));
  if (!id.success) return { erreur: "Identifiant de bien invalide." };
  if (!(await peutModifierBien(agent, id.data))) return { erreur: "Vous n'avez pas la permission de supprimer ce bien." };

  try {
    const bien = await prisma.property.findFirst({ where: { id: id.data, ...filtreProprietaire(agent) } });
    if (!bien) return { erreur: "Bien introuvable." };

    await prisma.property.delete({ where: { id: id.data, ...filtreProprietaire(agent) } });
    journal.info('Bien supprime', { agentId: agent.id, ressource: id.data });
    rafraichir(id.data);
    return { ok: true };
  } catch (erreur) {
    journal.erreur('Echec de suppression de bien', erreur, { agentId: agent.id });
    return { erreur: "Impossible de supprimer ce bien. Réessayez." };
  }
}

/** Lecture d'un bien pour le formulaire d'edition, filtree par proprietaire. */
export async function lireBienEditable(id: string) {
  const agent = await agentCourant();
  if (!agent) return null;

  const bien = await prisma.property.findFirst({
    where: { id, ...filtreProprietaire(agent) },
  });
  if (!bien) return null;

  return { ...bien, imagesParsees: parseImages(bien.images) };
}
