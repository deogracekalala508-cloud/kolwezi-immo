'use server';

import { headers } from 'next/headers';
import { redirect } from 'next/navigation';
import { prisma } from '@/lib/prisma';
import { contactSchema } from '@/lib/validations';
import { rateLimit, clientIp } from '@/lib/rate-limit';

export type ContactState = {
  erreurs?: Partial<Record<'name' | 'phone' | 'email' | 'message' | 'global', string>>;
  valeurs?: { name: string; phone: string; email: string; message: string };
};

export async function envoyerMessage(
  _precedent: ContactState,
  formData: FormData,
): Promise<ContactState> {
  const brut = {
    name: String(formData.get('name') ?? ''),
    phone: String(formData.get('phone') ?? ''),
    email: String(formData.get('email') ?? ''),
    message: String(formData.get('message') ?? ''),
    propertyId: String(formData.get('propertyId') ?? ''),
    website: String(formData.get('website') ?? ''),
  };

  // Piege a robots : le champ est invisible, un humain ne le remplit jamais.
  // On repond comme si tout allait bien, sans rien enregistrer.
  if (brut.website !== '') redirect('/merci');

  // Meme limite que /api/contact : 3 messages par heure et par IP.
  const limite = rateLimit(`contact:${clientIp(headers())}`);
  if (!limite.allowed) {
    const minutes = Math.ceil(limite.retryAfterSeconds / 60);
    return {
      erreurs: {
        global: `Vous avez deja envoye trois messages. Reessayez dans ${minutes} minutes, ou ecrivez-nous directement sur WhatsApp.`,
      },
      valeurs: brut,
    };
  }

  const resultat = contactSchema.safeParse(brut);
  if (!resultat.success) {
    const erreurs: ContactState['erreurs'] = {};
    for (const issue of resultat.error.issues) {
      const champ = issue.path[0];
      if (champ === 'name' || champ === 'phone' || champ === 'email' || champ === 'message') {
        erreurs[champ] ??= issue.message;
      }
    }
    return { erreurs, valeurs: brut };
  }

  const data = resultat.data;

  try {
    await prisma.contactMessage.create({
      data: {
        name: data.name,
        phone: data.phone,
        email: data.email ?? null,
        message: data.message,
        propertyId: data.propertyId ?? null,
      },
    });
  } catch {
    return {
      erreurs: {
        global: "L enregistrement a echoue. Reessayez dans un instant ou contactez-nous sur WhatsApp.",
      },
      valeurs: brut,
    };
  }

  redirect('/merci');
}
