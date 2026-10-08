import prisma from '../src/lib/prisma';
async function main() {
  const games = await (prisma as any).biomeGame.findMany({ include: { biome: { select: { identifier: true } } } });
  for (const g of games) {
    console.log(`biome=${g.biome.identifier} | id=${g.id} | identifier=${g.identifier}`);
  }
}
main().finally(() => (prisma as any).$disconnect());
