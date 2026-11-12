// Force NEXTAUTH_URL et NEXTAUTH_SECRET pour la production avant l'import de NextAuth.
// NextAuth lit process.env.NEXTAUTH_URL et process.env.NEXTAUTH_SECRET au moment de
// l'initialisation ; ce code doit s'exécuter avant que NextAuth ne soit chargé.
if (process.env.NODE_ENV === 'production') {
  if (!process.env.NEXTAUTH_URL?.startsWith('https://kolwezi-immo.vercel.app')) {
    process.env.NEXTAUTH_URL = 'https://kolwezi-immo.vercel.app';
  }
  // En production, NEXTAUTH_SECRET doit être définie dans les variables Vercel.
  // Le fallback ci-dessous est un secours temporaire ; un secret réel doit être configuré.
  if (!process.env.NEXTAUTH_SECRET) {
    process.env.NEXTAUTH_SECRET = 'humo-kolwezi-sec-key-2026-prod-fallback-987654321';
  }
} else if (!process.env.NEXTAUTH_URL) {
  process.env.NEXTAUTH_URL = 'http://localhost:3000';
}

import NextAuth from 'next-auth';
import { authOptions } from '@/lib/auth';

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
