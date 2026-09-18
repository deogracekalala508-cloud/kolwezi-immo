import { authenticator } from 'otplib';
import QRCode from 'qrcode';
import bcrypt from 'bcryptjs';
import { randomBytes } from 'node:crypto';

// Une fenetre de tolerance avant et apres : absorbe les horloges de telephone
// mal reglees sans elargir inutilement la surface d'attaque.
authenticator.options = { window: 1, step: 30 };

export const APP_LABEL = 'Humo Kolwezi';

export function genererSecret(): string {
  return authenticator.generateSecret();
}

export function uriOtpauth(email: string, secret: string): string {
  return authenticator.keyuri(email, APP_LABEL, secret);
}

export async function qrCodeDataUrl(uri: string): Promise<string> {
  return QRCode.toDataURL(uri, { margin: 1, width: 240, errorCorrectionLevel: 'M' });
}

export function verifierCode(code: string, secret: string): boolean {
  const propre = code.replace(/\s/g, '');
  if (!/^\d{6}$/.test(propre)) return false;
  try {
    return authenticator.verify({ token: propre, secret });
  } catch {
    return false;
  }
}

/** Codes de secours : affiches une seule fois, stockes haches. */
export function genererCodesSecours(nombre = 8): string[] {
  return Array.from({ length: nombre }, () =>
    randomBytes(5).toString('hex').toUpperCase().match(/.{1,5}/g)!.join('-'),
  );
}

export async function hacherCodes(codes: string[]): Promise<string> {
  const haches = await Promise.all(codes.map((c) => bcrypt.hash(c, 12)));
  return JSON.stringify(haches);
}

/**
 * Verifie un code de secours et le consomme (usage unique).
 * Retourne le nouveau tableau JSON a enregistrer, ou null si le code est faux.
 */
export async function consommerCodeSecours(
  code: string,
  stockes: string,
): Promise<string | null> {
  let liste: string[] = [];
  try {
    const parsed: unknown = JSON.parse(stockes);
    if (Array.isArray(parsed)) liste = parsed.filter((c): c is string => typeof c === 'string');
  } catch {
    return null;
  }

  const propre = code.trim().toUpperCase();
  for (let i = 0; i < liste.length; i += 1) {
    const hache = liste[i];
    if (hache && (await bcrypt.compare(propre, hache))) {
      const restants = liste.filter((_, index) => index !== i);
      return JSON.stringify(restants);
    }
  }
  return null;
}
