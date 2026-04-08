import { PrismaClient } from "@prisma/client";

const globalForPrisma = globalThis as unknown as { prisma: PrismaClient };

function createPrismaClient(): PrismaClient {
  const connectionString = process.env.DATABASE_URL;

  // Use Neon HTTP adapter in production (Cloudflare edge)
  if (connectionString && connectionString.startsWith("postgres")) {
    // Dynamic import to avoid build-time errors
    const { neon } = require("@neondatabase/serverless");
    const { PrismaNeon } = require("@prisma/adapter-neon");
    const sql = neon(connectionString);
    const adapter = new PrismaNeon(sql);
    return new PrismaClient({ adapter } as any);
  }

  // Local dev: standard Prisma client (SQLite via DATABASE_URL)
  return new PrismaClient();
}

export const prisma = globalForPrisma.prisma || createPrismaClient();

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;
