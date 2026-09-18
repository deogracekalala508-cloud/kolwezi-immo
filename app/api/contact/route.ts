import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { contactSchema } from '@/lib/validations';
import { rateLimit, clientIp } from '@/lib/rate-limit';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

/**
 * Point d entree JSON pour le formulaire de contact.
 * Limite : 3 messages par heure et par IP. Validation Zod obligatoire.
 */
export async function POST(request: Request) {
  const limite = rateLimit(`contact:${clientIp(request.headers)}`);
  if (!limite.allowed) {
    return NextResponse.json(
      {
        ok: false,
        erreur: 'Trop de messages envoyes. Reessayez plus tard ou ecrivez-nous sur WhatsApp.',
      },
      {
        status: 429,
        headers: {
          'Retry-After': String(limite.retryAfterSeconds),
          'X-RateLimit-Remaining': '0',
        },
      },
    );
  }

  let brut: unknown;
  try {
    brut = await request.json();
  } catch {
    return NextResponse.json({ ok: false, erreur: 'Corps de requete invalide.' }, { status: 400 });
  }

  const resultat = contactSchema.safeParse(brut);
  if (!resultat.success) {
    return NextResponse.json(
      { ok: false, erreur: 'Donnees invalides.', details: resultat.error.flatten().fieldErrors },
      { status: 422 },
    );
  }

  const data = resultat.data;

  // Piege a robots : on renvoie un succes sans rien enregistrer.
  if (data.website) return NextResponse.json({ ok: true }, { status: 201 });

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
    return NextResponse.json(
      { ok: false, erreur: 'Enregistrement impossible pour le moment.' },
      { status: 500 },
    );
  }

  return NextResponse.json(
    { ok: true, restants: limite.remaining },
    { status: 201, headers: { 'X-RateLimit-Remaining': String(limite.remaining) } },
  );
}
