import 'next-auth';
import 'next-auth/jwt';

declare module 'next-auth' {
  interface Session {
    user: {
      id?: string;
      name?: string | null;
      email?: string | null;
      role?: string;
      /** Vrai tant que l'agent n'a pas termine la configuration de sa 2FA. */
      twoFactorPending?: boolean;
    };
  }
  interface User {
    role?: string;
    twoFactorPending?: boolean;
  }
}

declare module 'next-auth/jwt' {
  interface JWT {
    id?: string;
    role?: string;
    twoFactorPending?: boolean;
  }
}
