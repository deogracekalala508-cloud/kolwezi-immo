/**
 * Limiteurs en memoire.
 *   - contact : 3 messages / heure / IP
 *   - login   : 5 tentatives / 15 minutes / IP + e-mail
 *
 * Suffisant pour une instance unique. En multi-instance (Vercel, cluster PM2),
 * remplacer la Map par Upstash Redis : l'interface publique ne change pas.
 */
type Bucket = { count: number; resetAt: number };

export type RateLimitResult = {
  allowed: boolean;
  remaining: number;
  retryAfterSeconds: number;
};

export function createLimiter({ limit, windowMs }: { limit: number; windowMs: number }) {
  const buckets = new Map<string, Bucket>();

  function sweep(now: number) {
    if (buckets.size < 500) return;
    for (const [key, bucket] of buckets) if (bucket.resetAt <= now) buckets.delete(key);
  }

  return {
    check(identifier: string): RateLimitResult {
      const now = Date.now();
      sweep(now);

      const bucket = buckets.get(identifier);
      if (!bucket || bucket.resetAt <= now) {
        buckets.set(identifier, { count: 1, resetAt: now + windowMs });
        return { allowed: true, remaining: limit - 1, retryAfterSeconds: 0 };
      }

      if (bucket.count >= limit) {
        return {
          allowed: false,
          remaining: 0,
          retryAfterSeconds: Math.ceil((bucket.resetAt - now) / 1000),
        };
      }

      bucket.count += 1;
      return { allowed: true, remaining: limit - bucket.count, retryAfterSeconds: 0 };
    },

    /** Appele apres une authentification reussie : on rend ses essais a l'utilisateur. */
    reset(identifier: string) {
      buckets.delete(identifier);
    },
  };
}

const contactLimiter = createLimiter({ limit: 3, windowMs: 60 * 60 * 1000 });

/** 5 tentatives par tranche de 15 minutes sur /admin/login. */
export const loginLimiter = createLimiter({ limit: 5, windowMs: 15 * 60 * 1000 });

/** Compatibilite avec le code existant du formulaire de contact. */
export function rateLimit(identifier: string): RateLimitResult {
  return contactLimiter.check(identifier);
}

/** Recupere l'IP client derriere un proxy (Vercel, Nginx, Cloudflare). */
export function clientIp(headers: Headers): string {
  const forwarded = headers.get('x-forwarded-for');
  if (forwarded) return forwarded.split(',')[0]?.trim() ?? 'inconnu';
  return headers.get('x-real-ip') ?? headers.get('cf-connecting-ip') ?? 'inconnu';
}
