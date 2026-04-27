// Prisma client singleton — server-side only.
import 'server-only';
import { PrismaClient } from '@prisma/client';

const globalForPrisma = globalThis as unknown as { prisma?: PrismaClient };

export const prisma: PrismaClient =
  globalForPrisma.prisma ??
  new PrismaClient({
    log: process.env.NODE_ENV === 'development' ? ['error', 'warn'] : ['error'],
  });

if (process.env.NODE_ENV !== 'production') {
  globalForPrisma.prisma = prisma;
}

// Validate DATABASE_URL is set before any DB operation
export const assertDatabaseConfigured = () => {
  if (!process.env.DATABASE_URL) {
    throw new Error('DATABASE_URL is not configured. Please add it to your .env file.');
  }
};

export const isDatabaseConfigured = () => Boolean(process.env.DATABASE_URL);
