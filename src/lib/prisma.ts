// prisma.ts atau database.ts
import { ConfigEnv } from "@/config/env";
import { PrismaClient } from "@prisma/client";

const environment = "development" as "development" | "production" | "test";

const config = ConfigEnv(environment);

const prismaClientSingleton = () => {
  return new PrismaClient({
    datasources: {
      db: {
        url: config.DATABASE_URL || process.env.DATABASE_URL,
      },
    },
  });
};

type PrismaClientSingleton = ReturnType<typeof prismaClientSingleton>;

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClientSingleton | undefined;
};

const prisma = globalForPrisma.prisma ?? prismaClientSingleton();

if (environment !== "production") globalForPrisma.prisma = prisma;

export default prisma;
