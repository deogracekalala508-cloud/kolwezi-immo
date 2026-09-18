'use server';

import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { codeTotpSchema } from '@/lib/validations';
import { verifierCode, genererCodesSecours, hacherCodes } from '@/lib/totp';
import { loginLimiter } from '@/lib/rate-limit';
import { journal, messageErreurPublic } from '@/lib/log';

export type EtatSetup = {
  ok?: boolean;
  erreur?: string;
  codesSecours?: string[];
};

/**
 * Active la 2FA apres verification d'un premier code genere par l'application
 * d'authentification. Tant que cette etape n'est pas passee, la session reste
 * marquee "twoFactorPending" et ne donne acces a aucune autre page admin.
 */
export async function activerDeuxFacteurs(
  _precedent: EtatSetup,
  formData: FormData,
): Promise<EtatSetup> {
  const session = await getServerSession(authOptions);
  const userId = session?.user?.id;
  if (!userId) return { erreur: 'Session expiree. Reconnectez-vous.' };

  if (!loginLimiter.check(`2fa:setup:${userId}`).allowed) {
    return { erreur: 'Trop d essais. Patientez quinze minutes avant de recommencer.' };
  }

  const parsed = codeTotpSchema.safeParse(String(formData.get('token') ?? ''));
  if (!parsed.success) {
    return { erreur: parsed.error.issues[0]?.message ?? 'Code invalide.' };
  }

  try {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { twoFactorSecret: true, twoFactorEnabled: true },
    });

    if (!user?.twoFactorSecret) {
      return { erreur: 'Aucun secret en attente. Rechargez la page pour en generer un.' };
    }
    if (user.twoFactorEnabled) {
      return { erreur: 'La double authentification est deja active sur ce compte.' };
    }

    if (!verifierCode(parsed.data, user.twoFactorSecret)) {
      journal.avertir('Code 2FA refuse pendant la configuration', { userId });
      return { erreur: 'Code refuse. Verifiez que l heure du telephone est a jour.' };
    }

    const codes = genererCodesSecours();
    await prisma.user.update({
      where: { id: userId },
      data: { twoFactorEnabled: true, backupCodes: await hacherCodes(codes) },
    });

    loginLimiter.reset(`2fa:setup:${userId}`);
    journal.info('Double authentification activee', { userId });

    // Les codes en clair ne sont renvoyes qu'ici, une seule fois.
    return { ok: true, codesSecours: codes };
  } catch (erreur) {
    journal.erreur('Echec d activation de la 2FA', erreur, { userId });
    return { erreur: messageErreurPublic(erreur, 'Activation impossible pour le moment.') };
  }
}
