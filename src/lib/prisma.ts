import "dotenv/config";
import { PrismaClient } from "@/generated/prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import pg from "pg";

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

function createPrismaClient() {
  const connectionString = process.env.DATABASE_URL || "";
  const pool = new pg.Pool({
    connectionString,
  });
  const adapter = new PrismaPg(pool);
  return new PrismaClient({ adapter });
}

export const prisma = globalForPrisma.prisma ?? createPrismaClient();

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;

let isTableInitialized = false;

/**
 * Ensures the members table exists in the PostgreSQL/Neon database.
 * Auto-creates the table if Vercel deployment points to a new database without migrations.
 */
export async function ensureDatabaseTableExists(): Promise<void> {
  if (isTableInitialized) return;
  try {
    await prisma.$executeRawUnsafe(`
      CREATE TABLE IF NOT EXISTS "members" (
        "id" UUID NOT NULL DEFAULT gen_random_uuid(),
        "full_name" TEXT NOT NULL,
        "member_code" TEXT NOT NULL,
        "photo_base64" TEXT NOT NULL,
        "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
        CONSTRAINT "members_pkey" PRIMARY KEY ("id")
      );
    `);
    await prisma.$executeRawUnsafe(`
      CREATE UNIQUE INDEX IF NOT EXISTS "members_member_code_key" ON "members"("member_code");
    `);
    isTableInitialized = true;
  } catch (err) {
    console.warn("Table initialization check warning:", err);
    // Continue execution; if table already exists or permissions differ, Prisma queries will report it
  }
}
