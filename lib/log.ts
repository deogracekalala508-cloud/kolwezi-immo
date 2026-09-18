/**
 * Journalisation applicative. Regle unique et non negociable : aucun mot de
 * passe, secret TOTP, code a usage unique ni jeton de session ne sort d'ici.
 * Les champs sensibles sont filtres meme si un appelant les passe par erreur.
 */
const CHAMPS_INTERDITS = [
  'password',
  'motdepasse',
  'passwordhash',
  'token',
  'code',
  'secret',
  'twofactorsecret',
  'backupcodes',
  'authorization',
  'cookie',
  'nextauth_secret',
];

type Contexte = Record<string, unknown>;

function nettoyer(contexte?: Contexte): Contexte {
  if (!contexte) return {};
  const sortie: Contexte = {};
  for (const [cle, valeur] of Object.entries(contexte)) {
    sortie[cle] = CHAMPS_INTERDITS.includes(cle.toLowerCase()) ? '[filtre]' : valeur;
  }
  return sortie;
}

function ecrire(niveau: 'info' | 'warn' | 'error', message: string, contexte?: Contexte) {
  const ligne = {
    horodatage: new Date().toISOString(),
    niveau,
    message,
    ...nettoyer(contexte),
  };
  // eslint-disable-next-line no-console
  console[niveau === 'warn' ? 'warn' : niveau === 'error' ? 'error' : 'log'](JSON.stringify(ligne));
}

export const journal = {
  info: (message: string, contexte?: Contexte) => ecrire('info', message, contexte),
  avertir: (message: string, contexte?: Contexte) => ecrire('warn', message, contexte),
  erreur: (message: string, erreur?: unknown, contexte?: Contexte) => {
    const details =
      erreur instanceof Error
        ? {
            type: erreur.name,
            detail: erreur.message,
            // La pile n'est journalisee qu'en developpement.
            ...(process.env.NODE_ENV === 'development' ? { pile: erreur.stack } : {}),
          }
        : { detail: 'erreur inconnue' };
    ecrire('error', message, { ...contexte, ...details });
  },
};

/**
 * Message renvoye au navigateur. En production, jamais de detail technique :
 * l'utilisateur recoit une phrase utile, la pile reste dans les journaux serveur.
 */
export function messageErreurPublic(erreur: unknown, repli: string): string {
  if (process.env.NODE_ENV === 'development' && erreur instanceof Error) {
    return `${repli} (dev : ${erreur.message})`;
  }
  return repli;
}
