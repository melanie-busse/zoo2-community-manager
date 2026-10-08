import prisma from '../src/lib/prisma';

async function main() {
  // Get all biomeshelter records for level 0
  const level0Shelters = await (prisma as any).$queryRawUnsafe(`
    SELECT id, biomeId FROM biomeshelter WHERE level = 0
  `);
  
  console.log('Level 0 shelter records:', JSON.stringify(level0Shelters));
  
  let totalUpdated = 0;
  for (const shelter of level0Shelters as any[]) {
    const result = await (prisma as any).$executeRawUnsafe(`
      UPDATE animal SET shelterId = ${shelter.id} WHERE shelterId = 0 AND biomeId = ${shelter.biomeId}
    `);
    if (result > 0) {
      console.log(`  biome ${shelter.biomeId}: updated ${result} animals to shelterId=${shelter.id}`);
      totalUpdated += result;
    }
  }
  
  // Set remaining shelterId=0 to NULL (animals in biomes without shelters, e.g. rescue center)
  const nullResult = await (prisma as any).$executeRawUnsafe(`
    UPDATE animal SET shelterId = NULL WHERE shelterId = 0
  `);
  console.log(`Set ${nullResult} remaining animals (shelterId=0, no matching biome) to NULL`);
  
  console.log(`\nTotal updated: ${totalUpdated}`);
}

main().finally(() => (prisma as any).$disconnect());
