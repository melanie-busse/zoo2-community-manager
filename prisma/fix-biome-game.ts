import prisma from '../src/lib/prisma';
async function main() {
  const bad = await (prisma as any).$queryRawUnsafe(`
    SELECT COUNT(a.id) as cnt FROM animal a
    LEFT JOIN biomegame bg ON a.biomeGameId = bg.id
    WHERE a.biomeGameId IS NOT NULL AND bg.id IS NULL
  `);
  console.log('Invalid biomeGameId count:', JSON.stringify(bad, (_, v) => typeof v === 'bigint' ? v.toString() : v));
  
  const result = await (prisma as any).$executeRawUnsafe(`
    UPDATE animal a
    LEFT JOIN biomegame bg ON a.biomeGameId = bg.id
    SET a.biomeGameId = NULL
    WHERE a.biomeGameId IS NOT NULL AND bg.id IS NULL
  `);
  console.log('Fixed:', result, 'animals');
}
main().finally(() => (prisma as any).$disconnect());
