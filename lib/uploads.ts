import { mkdir, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { randomUUID } from 'node:crypto';
import { journal } from './log';

export const TAILLE_MAX = 5 * 1024 * 1024; // 5 Mo par image

const TYPES_AUTORISES: Record<string, string> = {
  'image/jpeg': '.jpg',
  'image/png': '.png',
  'image/webp': '.webp',
  'image/avif': '.avif',
};

/**
 * Signatures binaires : le type MIME declare par le navigateur ne vaut rien,
 * on relit les premiers octets du fichier pour confirmer sa nature.
 */
function typeReel(octets: Uint8Array): string | null {
  const b = octets;
  if (b[0] === 0xff && b[1] === 0xd8 && b[2] === 0xff) return 'image/jpeg';
  if (b[0] === 0x89 && b[1] === 0x50 && b[2] === 0x4e && b[3] === 0x47) return 'image/png';
  const ascii = (start: number, valeur: string) =>
    valeur.split('').every((c, i) => b[start + i] === c.charCodeAt(0));
  if (ascii(0, 'RIFF') && ascii(8, 'WEBP')) return 'image/webp';
  if (ascii(4, 'ftyp') && (ascii(8, 'avif') || ascii(8, 'avis'))) return 'image/avif';
  return null;
}

/** Nom de fichier neutralise : plus d'extension double, de chemin ni d'unicode piege. */
export function nomSur(nomOrigine: string, extension: string): string {
  const base = path
    .basename(nomOrigine)
    .replace(/\.[^.]*$/, '')
    .normalize('NFKD')
    .replace(/[^\w-]+/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '')
    .slice(0, 40)
    .toLowerCase();
  return `${base || 'image'}-${randomUUID().slice(0, 8)}${extension}`;
}

export type ResultatUpload = { ok: true; url: string } | { ok: false; erreur: string };

export async function enregistrerImage(fichier: File): Promise<ResultatUpload> {
  if (fichier.size === 0) return { ok: false, erreur: 'Fichier vide.' };
  if (fichier.size > TAILLE_MAX) {
    return { ok: false, erreur: `${fichier.name} depasse 5 Mo. Compressez l image avant l envoi.` };
  }

  // 1. Type declare
  if (!TYPES_AUTORISES[fichier.type]) {
    return { ok: false, erreur: 'Formats acceptes : JPEG, PNG, WebP, AVIF.' };
  }

  const octets = new Uint8Array(await fichier.arrayBuffer());

  // 2. Type reel, lu dans les octets
  const reel = typeReel(octets);
  if (!reel || reel !== fichier.type) {
    journal.avertir('Upload refuse : signature de fichier incoherente', {
      declare: fichier.type,
      detecte: reel ?? 'inconnu',
    });
    return { ok: false, erreur: 'Ce fichier n est pas une image valide.' };
  }

  // 3. Extension derivee du type reel, jamais du nom fourni
  const extension = TYPES_AUTORISES[reel]!;
  const nom = nomSur(fichier.name, extension);

  const dossier = path.join(process.cwd(), 'public', 'uploads');
  await mkdir(dossier, { recursive: true });
  await writeFile(path.join(dossier, nom), octets, { mode: 0o644 });

  return { ok: true, url: `/uploads/${nom}` };
}
