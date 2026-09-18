import { withAuth } from 'next-auth/middleware';
import { NextResponse } from 'next/server';

/**
 * Protege TOUTES les routes /admin/* sauf /admin/login.
 * Deux niveaux :
 *   1. jeton absent  -> redirection vers /admin/login
 *   2. 2FA non configuree -> acces limite a /admin/setup-2fa
 */
export default withAuth(
  function middleware(req) {
    const { pathname } = req.nextUrl;
    const token = req.nextauth.token;

    if (token?.twoFactorPending && !pathname.startsWith('/admin/setup-2fa')) {
      return NextResponse.redirect(new URL('/admin/setup-2fa', req.url));
    }

    if (!token?.twoFactorPending && pathname.startsWith('/admin/setup-2fa')) {
      // La 2FA est deja active : inutile de repasser par la configuration.
      return NextResponse.redirect(new URL('/admin/dashboard', req.url));
    }

    return NextResponse.next();
  },
  {
    pages: { signIn: '/admin/login' },
    callbacks: {
      authorized: ({ token }) => Boolean(token),
    },
  },
);

export const config = {
  // Tout /admin/* est couvert, sauf la page de connexion (sinon : boucle).
  matcher: ['/admin', '/admin/((?!login).*)'],
};
