import { PrismaClient } from '@prisma/client';
import fs from 'fs';
import path from 'path';

const globalForPrisma = globalThis as unknown as { prisma?: PrismaClient };

function setupPrismaUrl(): string | undefined {
  const envUrl = process.env.DATABASE_URL;
  if (envUrl && !envUrl.startsWith('file:')) {
    return envUrl;
  }

  // En environnement Vercel / Serverless, /var/task est en lecture seule.
  // SQLite necessite un acces en ecriture pour les verrous et les journaux WAL.
  // On copie donc la base seedee depuis prisma/dev.db vers /tmp/dev.db.
  if (process.env.VERCEL || process.env.NODE_ENV === 'production') {
    try {
      const tmpDbPath = path.join('/tmp', 'dev.db');
      const sourceDbPath = path.join(process.cwd(), 'prisma', 'dev.db');

      if (!fs.existsSync(tmpDbPath)) {
        if (fs.existsSync(sourceDbPath)) {
          fs.copyFileSync(sourceDbPath, tmpDbPath);
        }
      }
      return `file:${tmpDbPath}`;
    } catch (e) {
      console.error('Failed to setup serverless SQLite in /tmp:', e);
    }
  }

  return envUrl;
}

const dbUrl = setupPrismaUrl();

export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    datasources: dbUrl ? { db: { url: dbUrl } } : undefined,
    log: process.env.NODE_ENV === 'development' ? ['warn', 'error'] : ['error'],
  });

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma;

