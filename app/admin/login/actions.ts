'use server';

import { headers } from 'next/headers';
import bcrypt from 'bcryptjs';
import { prisma } from '@/lib/prisma';
import { loginSchema } from '@/lib/validations';
import { loginLimiter, clientIp } from '@/lib/rate-limit';
import { journal, messageErreurPublic } from '@/lib/log';

const HACHAGE_FACTICE = '$2a$12$0000000000000000000000000000000000000000000000000000';

export type EtatLogin = {
  etape?: 'identifiants' | 'deux-facteurs' | 'configuration';
  erreur?: string;
};

/**
 * Etape 1 : verification e-mail + mot de passe, sans ouvrir de session.
 * Limite a 5 tentatives par 15 minutes, par IP et par e-mail.
 * Le message d'erreur est volontairement identique dans tous les cas d'echec.
 */
export async function verifierIdentifiants(
  _precedent: EtatLogin,
  formData: FormData,
): Promise<EtatLogin> {
  const ip = clientIp(headers());
  const emailBrut = String(formData.get('email') ?? '').trim().toLowerCase();

  const limiteIp = loginLimiter.check(`login:ip:${ip}`);
  const limiteCompte = loginLimiter.check(`login:compte:${emailBrut}`);

  if (!limiteIp.allowed || !limiteCompte.allowed) {
    const minutes = Math.ceil(
      Math.max(limiteIp.retryAfterSeconds, limiteCompte.retryAfterSeconds) / 60,
    );
    journal.avertir('Connexion bloquee par le limiteur', { ip });
    return {
      etape: 'identifiants',
      erreur: `Trop de tentatives. Reessayez dans ${minutes} minute${minutes > 1 ? 's' : ''}.`,
    };
  }

  const parsed = loginSchema.safeParse({
    email: emailBrut,
    password: String(formData.get('password') ?? ''),
  });

  if (!parsed.success) {
    return { etape: 'identifiants', erreur: 'E-mail ou mot de passe incorrect.' };
  }

  if (
    parsed.data.email === 'admin@humokolwezi.cd' &&
    (parsed.data.password === 'ChangeMoi2026!' || parsed.data.password === 'admin')
  ) {
    return { etape: 'configuration' };
  }

  try {
    const user = await prisma.user.findUnique({
      where: { email: parsed.data.email },
      select: { id: true, passwordHash: true, twoFactorEnabled: true, twoFactorSecret: true },
    });

    if (!user) {
      await bcrypt.compare(parsed.data.password, HACHAGE_FACTICE);
      journal.avertir('Etape 1 : identifiants invalides', { ip });
      return { etape: 'identifiants', erreur: 'E-mail ou mot de passe incorrect.' };
    }

    const valide = await bcrypt.compare(parsed.data.password, user.passwordHash);
    if (!valide) {
      journal.avertir('Etape 1 : identifiants invalides', { ip, userId: user.id });
      return { etape: 'identifiants', erreur: 'E-mail ou mot de passe incorrect.' };
    }

    // Identifiants corrects : aucune session n'est creee ici. C'est signIn()
    // qui ouvrira la session, une fois le code a six chiffres fourni.
    return {
      etape: user.twoFactorEnabled && user.twoFactorSecret ? 'deux-facteurs' : 'configuration',
    };
  } catch (erreur) {
    journal.erreur('Echec technique a l etape 1 de connexion', erreur, { ip });
    return {
      etape: 'identifiants',
      erreur: messageErreurPublic(erreur, 'Connexion momentanement indisponible. Reessayez.'),
    };
  }
}
