import prisma from '../src/lib/prisma';

async function main() {
  // Check biomeshelter records
  const shelters = await (prisma as any).$queryRawUnsafe(`
    SELECT id, biomeId, level FROM biomeshelter ORDER BY biomeId, level LIMIT 20
  `);
  console.log('BiomeShelter records:', JSON.stringify(shelters));
  
  // Count animals with shelterId=0
  const bad = await (prisma as any).$queryRawUnsafe(`
    SELECT COUNT(id) as cnt FROM animal WHERE shelterId = 0
  `);
  console.log('Animals with shelterId=0:', JSON.stringify(bad, (_, v) => typeof v === 'bigint' ? v.toString() : v));
}

main().finally(() => (prisma as any).$disconnect());
