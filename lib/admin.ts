import { getServerSession } from 'next-auth';
import { redirect } from 'next/navigation';
import { authOptions } from './auth';
import { prisma } from './prisma';
import { journal } from './log';

export type Agent = { id: string; email: string; name: string; role: string };

/** Le role PROPRIETAIRE voit et modifie tout ; ADMIN ne touche qu'a ses fiches. */
export const ROLE_SUPER = 'PROPRIETAIRE';

/**
 * A appeler en PREMIERE ligne de chaque page et de chaque Server Action admin.
 * Une redirection est une exception : rien ne s'execute apres.
 */
export async function exigerAgent(): Promise<Agent> {
  const session = await getServerSession(authOptions);

  if (!session?.user?.id) redirect('/admin/login');
  if (session.user.twoFactorPending) redirect('/admin/setup-2fa');

  return {
    id: session.user.id,
    email: session.user.email ?? '',
    name: session.user.name ?? '',
    role: session.user.role ?? 'ADMIN',
  };
}

/** Variante pour les Server Actions : renvoie null plutot que de rediriger. */
export async function agentCourant(): Promise<Agent | null> {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id || session.user.twoFactorPending) return null;
  return {
    id: session.user.id,
    email: session.user.email ?? '',
    name: session.user.name ?? '',
    role: session.user.role ?? 'ADMIN',
  };
}

/**
 * Filtre anti-IDOR a injecter dans tous les `where` Prisma.
 * Un ADMIN ne voit que ses propres enregistrements ; le PROPRIETAIRE voit tout.
 */
export function filtreProprietaire(agent: Agent) {
  return agent.role === ROLE_SUPER ? {} : { ownerId: agent.id };
}

/**
 * Verifie qu'un enregistrement appartient bien a l'agent avant modification.
 * Renvoie false sans fuiter l'existence de la ressource.
 */
export async function peutModifierBien(agent: Agent, id: string): Promise<boolean> {
  const bien = await prisma.property.findUnique({ where: { id }, select: { ownerId: true } });
  if (!bien) return false;
  if (agent.role === ROLE_SUPER) return true;
  const autorise = bien.ownerId === agent.id;
  if (!autorise) {
    journal.avertir('Tentative de modification hors perimetre (bien)', {
      agentId: agent.id,
      ressource: id,
    });
  }
  return autorise;
}

export async function peutModifierEtude(agent: Agent, id: string): Promise<boolean> {
  const etude = await prisma.caseStudy.findUnique({ where: { id }, select: { ownerId: true } });
  if (!etude) return false;
  if (agent.role === ROLE_SUPER) return true;
  const autorise = etude.ownerId === agent.id;
  if (!autorise) {
    journal.avertir('Tentative de modification hors perimetre (etude de cas)', {
      agentId: agent.id,
      ressource: id,
    });
  }
  return autorise;
}

export type EtatAction = { ok?: boolean; erreur?: string; champs?: Record<string, string> };

export const REFUS: EtatAction = {
  erreur: "Action refusee : votre session a expire ou cette fiche ne vous appartient pas.",
};
