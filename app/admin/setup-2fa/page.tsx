import type { Metadata } from 'next';
import { redirect } from 'next/navigation';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { genererSecret, uriOtpauth, qrCodeDataUrl } from '@/lib/totp';
import SetupForm from '@/components/admin/SetupForm';

export const metadata: Metadata = {
  title: 'Configurer la double authentification',
  robots: { index: false, follow: false },
};

export const dynamic = 'force-dynamic';

export default async function Setup2fa() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) redirect('/admin/login');
  if (!session.user.twoFactorPending) redirect('/admin/dashboard');

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    select: { email: true, twoFactorSecret: true, twoFactorEnabled: true },
  });
  if (!user) redirect('/admin/login');
  if (user.twoFactorEnabled) redirect('/admin/dashboard');

  // Un secret en attente est genere puis conserve tant qu'il n'est pas confirme,
  // pour que le rechargement de la page ne casse pas un QR code deja scanne.
  let secret = user.twoFactorSecret;
  if (!secret) {
    secret = genererSecret();
    await prisma.user.update({ where: { id: session.user.id }, data: { twoFactorSecret: secret } });
  }

  const uri = uriOtpauth(user.email, secret);
  const qr = await qrCodeDataUrl(uri);

  return (
    <div className="conteneur py-12">
      <div className="mx-auto max-w-2xl rounded-lg bg-white p-6 shadow-carte ring-1 ring-nuit/5 sm:p-8">
        <h1 className="text-2xl sm:text-3xl">Activer la double authentification</h1>
        <p className="mt-3 max-w-lisible text-ardoise/85">
          Cette etape est obligatoire : sans elle, votre session ne donne acces a aucune autre page
          de l espace agence. Comptez deux minutes.
        </p>

        <ol className="mt-6 space-y-2 text-ardoise/90">
          <li>1. Installez Google Authenticator, Aegis ou 2FAS sur votre telephone.</li>
          <li>2. Scannez le QR code ci-dessous, ou saisissez la cle a la main.</li>
          <li>3. Entrez le code a six chiffres affiche par l application.</li>
        </ol>

        <SetupForm qr={qr} secret={secret} email={user.email} />
      </div>
    </div>
  );
}
