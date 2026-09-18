import type { NextAuthOptions } from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import bcrypt from 'bcryptjs';
import { prisma } from './prisma';
import { loginSchema } from './validations';
import { verifierCode, consommerCodeSecours } from './totp';
import { loginLimiter } from './rate-limit';
import { journal } from './log';

// Hachage factice : garde un temps de reponse constant quand le compte n'existe
// pas, pour ne pas reveler quels e-mails sont enregistres.
const HACHAGE_FACTICE = '$2a$12$0000000000000000000000000000000000000000000000000000';

// Refus de servir des requetes en production sans secret. Le build lui-meme
// est epargne (phase-production-build) pour que la CI puisse compiler sans
// avoir a exposer le secret.
if (
  !process.env.NEXTAUTH_SECRET &&
  process.env.NODE_ENV === 'production' &&
  process.env.NEXT_PHASE !== 'phase-production-build'
) {
  throw new Error('NEXTAUTH_SECRET est absent : refus de demarrer en production.');
}

export const authOptions: NextAuthOptions = {
  // Le secret vient exclusivement de l'environnement, jamais du code.
  secret: process.env.NEXTAUTH_SECRET,
  session: { strategy: 'jwt', maxAge: 60 * 60 * 24 }, // 24 h maximum
  jwt: { maxAge: 60 * 60 * 24 },
  pages: { signIn: '/admin/login', error: '/admin/login' },
  cookies: {
    sessionToken: {
      name:
        process.env.NODE_ENV === 'production'
          ? '__Secure-next-auth.session-token'
          : 'next-auth.session-token',
      options: {
        httpOnly: true,
        sameSite: 'lax',
        path: '/',
        secure: process.env.NODE_ENV === 'production',
      },
    },
  },
  providers: [
    CredentialsProvider({
      name: 'Identifiants',
      credentials: {
        email: { label: 'E-mail', type: 'email' },
        password: { label: 'Mot de passe', type: 'password' },
        token: { label: 'Code a six chiffres', type: 'text' },
      },
      async authorize(credentials) {
        const parsed = loginSchema.safeParse(credentials);
        if (!parsed.success) return null;

        const { email, password } = parsed.data;
        const code = typeof credentials?.token === 'string' ? credentials.token.trim() : '';

        // Deuxieme barriere, cote NextAuth : meme si quelqu'un appelle
        // /api/auth/callback/credentials sans passer par le formulaire, la
        // limite de 5 tentatives par 15 minutes s'applique (cle : e-mail).
        if (!loginLimiter.check(`auth:${email}`).allowed) {
          journal.avertir('Connexion bloquee : trop de tentatives');
          return null;
        }

        const user = await prisma.user.findUnique({ where: { email } });
        if (!user) {
          await bcrypt.compare(password, HACHAGE_FACTICE);
          journal.avertir('Echec de connexion : identifiants invalides');
          return null;
        }

        const motDePasseValide = await bcrypt.compare(password, user.passwordHash);
        if (!motDePasseValide) {
          journal.avertir('Echec de connexion : identifiants invalides', { userId: user.id });
          return null;
        }

        // Compte sans 2FA active : la session est ouverte mais marquee
        // "configuration requise". Le layout admin ne laisse alors acceder
        // qu'a /admin/setup-2fa.
        if (!user.twoFactorEnabled || !user.twoFactorSecret) {
          journal.info('Connexion sans 2FA : configuration exigee', { userId: user.id });
          return {
            id: user.id,
            email: user.email,
            name: user.name,
            role: user.role,
            twoFactorPending: true,
          };
        }

        if (!code) {
          journal.avertir('Connexion refusee : code 2FA manquant', { userId: user.id });
          return null;
        }

        let codeValide = verifierCode(code, user.twoFactorSecret);

        // Repli sur un code de secours a usage unique.
        if (!codeValide) {
          const restants = await consommerCodeSecours(code, user.backupCodes);
          if (restants !== null) {
            await prisma.user.update({ where: { id: user.id }, data: { backupCodes: restants } });
            journal.avertir('Connexion via code de secours', { userId: user.id });
            codeValide = true;
          }
        }

        if (!codeValide) {
          journal.avertir('Echec de connexion : code 2FA invalide', { userId: user.id });
          return null;
        }

        await prisma.user.update({ where: { id: user.id }, data: { lastLoginAt: new Date() } });
        loginLimiter.reset(`auth:${email}`);
        journal.info('Connexion reussie', { userId: user.id });

        return {
          id: user.id,
          email: user.email,
          name: user.name,
          role: user.role,
          twoFactorPending: false,
        };
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user, trigger }) {
      if (user) {
        token.id = user.id;
        token.role = user.role ?? 'ADMIN';
        token.twoFactorPending = user.twoFactorPending ?? false;
      }

      // Apres la configuration de la 2FA, la page appelle update() : on relit
      // l'etat reel en base au lieu de faire confiance au client.
      if (trigger === 'update' && token.id) {
        const frais = await prisma.user.findUnique({
          where: { id: String(token.id) },
          select: { twoFactorEnabled: true, role: true },
        });
        if (frais) {
          token.twoFactorPending = !frais.twoFactorEnabled;
          token.role = frais.role;
        }
      }

      return token;
    },
    session({ session, token }) {
      if (session.user) {
        session.user.id = typeof token.id === 'string' ? token.id : undefined;
        session.user.role = typeof token.role === 'string' ? token.role : 'ADMIN';
        session.user.twoFactorPending = token.twoFactorPending === true;
      }
      return session;
    },
  },
};
