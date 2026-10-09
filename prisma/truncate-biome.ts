import { PrismaClient } from "@prisma/client";
const p = new PrismaClient();

async function main() {
  await p.$executeRawUnsafe("SET FOREIGN_KEY_CHECKS=0");
  await p.$executeRawUnsafe("TRUNCATE TABLE biomedecorationtext");
  await p.$executeRawUnsafe("TRUNCATE TABLE biomedecoration");
  await p.$executeRawUnsafe("TRUNCATE TABLE biomegametext");
  await p.$executeRawUnsafe("TRUNCATE TABLE biomegame");
  await p.$executeRawUnsafe("TRUNCATE TABLE biomewaterhole");
  await p.$executeRawUnsafe("TRUNCATE TABLE biometrough");
  await p.$executeRawUnsafe("TRUNCATE TABLE biomeshelter");
  await p.$executeRawUnsafe("SET FOREIGN_KEY_CHECKS=1");

  const [s, t, w, g, d] = await Promise.all([
    p.biomeShelter.count(),
    p.biomeTrough.count(),
    p.biomeWaterHole.count(),
    p.biomeGame.count(),
    p.biomeDecoration.count(),
  ]);
  console.log(`Nach TRUNCATE — Shelter:${s} Trough:${t} WaterHole:${w} Game:${g} Deco:${d}`);
}

main().catch(console.error).finally(() => p.$disconnect());
