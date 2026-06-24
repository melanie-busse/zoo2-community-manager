import { PrismaClient } from "@prisma/client";
// import { PrismaTiDBCloud } from '@tidbcloud/prisma-adapter' // temporär raus

const globalForPrisma = globalThis as unknown as { prisma: PrismaClient | undefined };

const prismaClientSingleton = () => {
  // Für localhost brauchen wir keinen speziellen Cloud-Adapter:
  return new PrismaClient({ log: ["error"] });
};

export const prisma = globalForPrisma.prisma ?? prismaClientSingleton();

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;

export default prisma;
