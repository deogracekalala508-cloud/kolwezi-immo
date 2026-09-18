import { PrismaClient } from '@prisma/client';
import fs from 'fs';
import path from 'path';

const globalForPrisma = globalThis as unknown as { prisma?: PrismaClient };

import os from 'os';

function setupPrismaUrl(): string | undefined {
  const envUrl = process.env.DATABASE_URL;
  if (envUrl && !envUrl.startsWith('file:')) {
    return envUrl;
  }

  // En environnement Vercel / Serverless, /var/task est en lecture seule.
  // SQLite nécessite un accès en écriture pour les verrous et les journaux WAL.
  if (process.env.VERCEL || process.env.NODE_ENV === 'production') {
    try {
      const tmpDir = process.env.VERCEL ? '/tmp' : os.tmpdir();
      const tmpDbPath = path.join(tmpDir, 'dev.db');
      const candidateSources = [
        path.join(process.cwd(), 'prisma', 'dev.db'),
        path.join(__dirname, '..', '..', 'prisma', 'dev.db'),
        path.join(__dirname, '..', 'prisma', 'dev.db'),
        path.join(__dirname, 'prisma', 'dev.db'),
      ];

      let sourceDbPath = candidateSources.find((p) => fs.existsSync(p));

      const tmpExists = fs.existsSync(tmpDbPath);
      const tmpSize = tmpExists ? fs.statSync(tmpDbPath).size : 0;

      if (!tmpExists || tmpSize === 0) {
        if (sourceDbPath) {
          fs.mkdirSync(path.dirname(tmpDbPath), { recursive: true });
          fs.copyFileSync(sourceDbPath, tmpDbPath);
        }
      }
      if (fs.existsSync(tmpDbPath)) {
        return `file:${tmpDbPath}`;
      }
    } catch (e) {
      console.error('Failed to setup serverless SQLite in tmp:', e);
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

