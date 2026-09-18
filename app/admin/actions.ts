'use server';

import { revalidatePath } from 'next/cache';
import { prisma } from '@/lib/prisma';
import {
  agentCourant,
  peutModifierEtude,
  filtreProprietaire,
  REFUS,
  type EtatAction,
} from '@/lib/admin';
import {
  testimonialSchema,
  faqSchema,
  caseStudySchema,
  idSchema,
  slugifier,
  champsEnErreur,
} from '@/lib/validations';
import { enregistrerImage } from '@/lib/uploads';
import { journal, messageErreurPublic } from '@/lib/log';

/* ----------------------------- Messages ----------------------------- */

export async function basculerLecture(formData: FormData): Promise<void> {
  const agent = await agentCourant();
  if (!agent) return;

  const id = idSchema.safeParse(String(formData.get('id') ?? ''));
  if (!id.success) return;

  const message = await prisma.contactMessage.findUnique({
    where: { id: id.data },
    select: { isRead: true },
  });
  if (!message) return;

  await prisma.contactMessage.update({
    where: { id: id.data },
    data: { isRead: !message.isRead },
  });
  journal.info('Statut de lecture modifie', { agentId: agent.id, ressource: id.data });
  revalidatePath('/admin/messages');
  revalidatePath('/admin/dashboard');
}

export async function supprimerMessage(formData: FormData): Promise<void> {
  const agent = await agentCourant();
  if (!agent) return;

  const id = idSchema.safeParse(String(formData.get('id') ?? ''));
  if (!id.success) return;

  try {
    await prisma.contactMessage.delete({ where: { id: id.data } });
    journal.info('Message supprime', { agentId: agent.id, ressource: id.data });
  } catch (erreur) {
    journal.erreur('Echec de suppression de message', erreur, { agentId: agent.id });
  }
  revalidatePath('/admin/messages');
  revalidatePath('/admin/dashboard');
}

/* ---------------------------- Temoignages ---------------------------- */

export async function creerTemoignage(
  _precedent: EtatAction,
  formData: FormData,
): Promise<EtatAction> {
  const agent = await agentCourant();
  if (!agent) return REFUS;

  const parsed = testimonialSchema.safeParse({
    clientName: String(formData.get('clientName') ?? ''),
    content: String(formData.get('content') ?? ''),
    rating: String(formData.get('rating') ?? '5'),
    published: formData.get('published') === 'on',
  });
  if (!parsed.success) {
    return { erreur: 'Corrigez les champs signales.', champs: champsEnErreur(parsed.error) };
  }

  try {
    await prisma.testimonial.create({ data: parsed.data });
    journal.info('Avis client ajoute', { agentId: agent.id });
  } catch (erreur) {
    journal.erreur('Echec d ajout d avis', erreur, { agentId: agent.id });
    return { erreur: messageErreurPublic(erreur, 'Enregistrement impossible.') };
  }

  revalidatePath('/admin/temoignages');
  revalidatePath('/');
  return { ok: true };
}

export async function basculerPublicationAvis(formData: FormData): Promise<void> {
  const agent = await agentCourant();
  if (!agent) return;
  const id = idSchema.safeParse(String(formData.get('id') ?? ''));
  if (!id.success) return;

  const avis = await prisma.testimonial.findUnique({
    where: { id: id.data },
    select: { published: true },
  });
  if (!avis) return;

  await prisma.testimonial.update({
    where: { id: id.data },
    data: { published: !avis.published },
  });
  journal.info('Publication d avis modifiee', { agentId: agent.id, ressource: id.data });
  revalidatePath('/admin/temoignages');
  revalidatePath('/');
}

export async function supprimerTemoignage(formData: FormData): Promise<void> {
  const agent = await agentCourant();
  if (!agent) return;
  const id = idSchema.safeParse(String(formData.get('id') ?? ''));
  if (!id.success) return;

  try {
    await prisma.testimonial.delete({ where: { id: id.data } });
    journal.info('Avis supprime', { agentId: agent.id, ressource: id.data });
  } catch (erreur) {
    journal.erreur('Echec de suppression d avis', erreur, { agentId: agent.id });
  }
  revalidatePath('/admin/temoignages');
  revalidatePath('/');
}

/* -------------------------------- FAQ -------------------------------- */

export async function creerFaq(_precedent: EtatAction, formData: FormData): Promise<EtatAction> {
  const agent = await agentCourant();
  if (!agent) return REFUS;

  const parsed = faqSchema.safeParse({
    question: String(formData.get('question') ?? ''),
    answer: String(formData.get('answer') ?? ''),
    order: String(formData.get('order') ?? '0'),
  });
  if (!parsed.success) {
    return { erreur: 'Corrigez les champs signales.', champs: champsEnErreur(parsed.error) };
  }

  try {
    await prisma.faqItem.create({ data: parsed.data });
    journal.info('Question ajoutee a la FAQ', { agentId: agent.id });
  } catch (erreur) {
    journal.erreur('Echec d ajout FAQ', erreur, { agentId: agent.id });
    return { erreur: messageErreurPublic(erreur, 'Enregistrement impossible.') };
  }

  revalidatePath('/admin/faq');
  revalidatePath('/faq');
  revalidatePath('/');
  return { ok: true };
}

export async function modifierFaq(_precedent: EtatAction, formData: FormData): Promise<EtatAction> {
  const agent = await agentCourant();
  if (!agent) return REFUS;

  const id = idSchema.safeParse(String(formData.get('id') ?? ''));
  if (!id.success) return REFUS;

  const parsed = faqSchema.safeParse({
    question: String(formData.get('question') ?? ''),
    answer: String(formData.get('answer') ?? ''),
    order: String(formData.get('order') ?? '0'),
  });
  if (!parsed.success) {
    return { erreur: 'Corrigez les champs signales.', champs: champsEnErreur(parsed.error) };
  }

  try {
    await prisma.faqItem.update({ where: { id: id.data }, data: parsed.data });
    journal.info('Question FAQ modifiee', { agentId: agent.id, ressource: id.data });
  } catch (erreur) {
    journal.erreur('Echec de modification FAQ', erreur, { agentId: agent.id });
    return { erreur: messageErreurPublic(erreur, 'Modification impossible.') };
  }

  revalidatePath('/admin/faq');
  revalidatePath('/faq');
  return { ok: true };
}

export async function supprimerFaq(formData: FormData): Promise<void> {
  const agent = await agentCourant();
  if (!agent) return;
  const id = idSchema.safeParse(String(formData.get('id') ?? ''));
  if (!id.success) return;

  try {
    await prisma.faqItem.delete({ where: { id: id.data } });
    journal.info('Question FAQ supprimee', { agentId: agent.id, ressource: id.data });
  } catch (erreur) {
    journal.erreur('Echec de suppression FAQ', erreur, { agentId: agent.id });
  }
  revalidatePath('/admin/faq');
  revalidatePath('/faq');
}

/* ---------------------------- Etudes de cas ---------------------------- */

async function slugEtudeUnique(titre: string, idExclu?: string): Promise<string> {
  const base = slugifier(titre) || 'etude';
  for (let suffixe = 0; suffixe < 50; suffixe += 1) {
    const candidat = suffixe === 0 ? base : `${base}-${suffixe}`;
    const existant = await prisma.caseStudy.findUnique({
      where: { slug: candidat },
      select: { id: true },
    });
    if (!existant || existant.id === idExclu) return candidat;
  }
  return `${base}-${Date.now()}`;
}

function rafraichirEtudes(slug?: string) {
  revalidatePath('/admin/etudes-de-cas');
  revalidatePath('/etudes-de-cas');
  revalidatePath('/sitemap.xml');
  if (slug) revalidatePath(`/etudes-de-cas/${slug}`);
}

export async function enregistrerEtude(
  _precedent: EtatAction,
  formData: FormData,
): Promise<EtatAction> {
  const agent = await agentCourant();
  if (!agent) return REFUS;

  const idBrut = String(formData.get('id') ?? '');
  const modification = idBrut !== '';

  if (modification) {
    const id = idSchema.safeParse(idBrut);
    if (!id.success || !(await peutModifierEtude(agent, id.data))) return REFUS;
  }

  // Image : nouveau fichier prioritaire, sinon on garde l'existante.
  let image = String(formData.get('imageActuelle') ?? '');
  const fichier = formData.get('fichier');
  if (fichier instanceof File && fichier.size > 0) {
    const resultat = await enregistrerImage(fichier);
    if (!resultat.ok) return { erreur: resultat.erreur };
    image = resultat.url;
  }

  const parsed = caseStudySchema.safeParse({
    title: String(formData.get('title') ?? ''),
    client: String(formData.get('client') ?? ''),
    category: String(formData.get('category') ?? ''),
    location: String(formData.get('location') ?? ''),
    challenge: String(formData.get('challenge') ?? ''),
    approach: String(formData.get('approach') ?? ''),
    result: String(formData.get('result') ?? ''),
    metric: String(formData.get('metric') ?? ''),
    image,
    imageAlt: String(formData.get('imageAlt') ?? ''),
    published: formData.get('published') === 'on',
    order: String(formData.get('order') ?? '0'),
  });

  if (!parsed.success) {
    return { erreur: 'Corrigez les champs signales.', champs: champsEnErreur(parsed.error) };
  }

  try {
    if (modification) {
      const etude = await prisma.caseStudy.update({
        where: { id: idBrut, ...filtreProprietaire(agent) },
        data: { ...parsed.data, slug: await slugEtudeUnique(parsed.data.title, idBrut) },
        select: { slug: true },
      });
      journal.info('Etude de cas modifiee', { agentId: agent.id, ressource: idBrut });
      rafraichirEtudes(etude.slug);
    } else {
      const etude = await prisma.caseStudy.create({
        data: {
          ...parsed.data,
          ownerId: agent.id,
          slug: await slugEtudeUnique(parsed.data.title),
        },
        select: { slug: true },
      });
      journal.info('Etude de cas creee', { agentId: agent.id });
      rafraichirEtudes(etude.slug);
    }
  } catch (erreur) {
    journal.erreur('Echec d enregistrement d etude de cas', erreur, { agentId: agent.id });
    return { erreur: messageErreurPublic(erreur, 'Enregistrement impossible.') };
  }

  return { ok: true };
}

export async function supprimerEtude(formData: FormData): Promise<void> {
  const agent = await agentCourant();
  if (!agent) return;

  const id = idSchema.safeParse(String(formData.get('id') ?? ''));
  if (!id.success) return;
  if (!(await peutModifierEtude(agent, id.data))) return;

  try {
    await prisma.caseStudy.delete({ where: { id: id.data, ...filtreProprietaire(agent) } });
    journal.info('Etude de cas supprimee', { agentId: agent.id, ressource: id.data });
  } catch (erreur) {
    journal.erreur('Echec de suppression d etude de cas', erreur, { agentId: agent.id });
  }
  rafraichirEtudes();
}

export async function basculerPublicationEtude(formData: FormData): Promise<void> {
  const agent = await agentCourant();
  if (!agent) return;

  const id = idSchema.safeParse(String(formData.get('id') ?? ''));
  if (!id.success) return;
  if (!(await peutModifierEtude(agent, id.data))) return;

  const etude = await prisma.caseStudy.findUnique({
    where: { id: id.data },
    select: { published: true, slug: true },
  });
  if (!etude) return;

  await prisma.caseStudy.update({
    where: { id: id.data, ...filtreProprietaire(agent) },
    data: { published: !etude.published },
  });
  journal.info('Publication d etude modifiee', { agentId: agent.id, ressource: id.data });
  rafraichirEtudes(etude.slug);
}

/* -------------------- Purge du Contenu de Démonstration -------------------- */

export async function purgerToutesLesDonnees(_formData?: FormData): Promise<void> {
  const agent = await agentCourant();
  if (!agent) return;

  try {
    await prisma.contactMessage.deleteMany();
    await prisma.caseStudy.deleteMany();
    await prisma.property.deleteMany();
    await prisma.testimonial.deleteMany();
    await prisma.faqItem.deleteMany();

    journal.info('Purge des donnees du site effectuee', { agentId: agent.id });
  } catch (erreur) {
    journal.erreur('Echec de la purge des donnees', erreur, { agentId: agent.id });
  }

  revalidatePath('/');
  revalidatePath('/biens');
  revalidatePath('/etudes-de-cas');
  revalidatePath('/faq');
  revalidatePath('/admin/dashboard');
  revalidatePath('/sitemap.xml');
}
