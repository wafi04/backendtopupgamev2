// prisma.ts atau database.ts
import { ConfigEnv } from "@/config/env";
import { PrismaClient } from "@prisma/client";

// Ambil environment dari process.env.NODE_ENV atau default 'development'
const environment = "development" as "development" | "production" | "test";

const config = ConfigEnv(environment);

// Buat instance PrismaClient
const prismaClientSingleton = () => {
  return new PrismaClient({
    datasources: {
      db: {
        url: config.DATABASE_URL || process.env.DATABASE_URL,
      },
    },
  });
};

// Deklarasi tipe global supaya bisa menggunakan singleton pattern
type PrismaClientSingleton = ReturnType<typeof prismaClientSingleton>;

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClientSingleton | undefined;
};

const prisma = globalForPrisma.prisma ?? prismaClientSingleton();

if (environment !== "production") globalForPrisma.prisma = prisma;

export default prisma;
