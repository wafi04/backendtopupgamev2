// prisma.ts atau database.ts
import { ConfigEnv } from '@/config/env';
import { PrismaClient } from '@prisma/client';

// Ambil environment dari process.env.NODE_ENV atau default 'development'
const environment = ("production") as 'development' | 'production' | 'test';


const config = ConfigEnv(environment);

// Buat instance PrismaClient
const prismaClientSingleton = () => {
  return new PrismaClient({
    // Anda bisa menambahkan opsi prisma di sini jika diperlukan
    log: environment === 'development' ? ['query', 'error', 'warn'] : ['error'],
    datasources: {
      db: {
        url: config.DATABASE_URL || process.env.DATABASE_URL
      }
    }
  });
};

// Deklarasi tipe global supaya bisa menggunakan singleton pattern
type PrismaClientSingleton = ReturnType<typeof prismaClientSingleton>;

// Gunakan global variable untuk menyimpan instance prisma
const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClientSingleton | undefined;
};

// Buat singleton instance
const prisma = globalForPrisma.prisma ?? prismaClientSingleton();

// Jika bukan di production, simpan ke global object
if (environment !== 'production') globalForPrisma.prisma = prisma;

export default prisma;