import prisma from '../src/lib/prisma';

async function main() {
  const result = await (prisma as any).$queryRawUnsafe(`
    SELECT a.id, a.shelterId, a.biomeId 
    FROM animal a
    LEFT JOIN biomeshelter bs ON a.shelterId = bs.id
    WHERE a.shelterId IS NOT NULL AND bs.id IS NULL
    LIMIT 20
  `);
  console.log('Animals with invalid shelterId:', JSON.stringify(result));
  
  const countResult = await (prisma as any).$queryRawUnsafe(`
    SELECT COUNT(*) as cnt
    FROM animal a
    LEFT JOIN biomeshelter bs ON a.shelterId = bs.id
    WHERE a.shelterId IS NOT NULL AND bs.id IS NULL
  `);
  console.log('Count:', JSON.stringify(countResult));
}

main().finally(() => (prisma as any).$disconnect());
