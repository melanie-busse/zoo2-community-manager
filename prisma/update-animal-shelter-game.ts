import { PrismaClient } from "@prisma/client";
import * as fs from "fs";

const p = new PrismaClient();

// Parse all rows from tierdaten.txt INSERT statements
// Columns: id(0), name(1), nameEn(2), gehegeId(3), spielgeraetId(4), stalllevel(5), ...
function parseRows(file: string): { id: number; gehegeId: number; spielgeraetId: number; stalllevel: number }[] {
  const content = fs.readFileSync(file, "utf-8");
  const rows: { id: number; gehegeId: number; spielgeraetId: number; stalllevel: number }[] = [];

  // Match each value tuple: (101,'name','nameEn',100,101,1, ...)
  const rowRegex = /\((\d+),'[^']*','[^']*',(\d+),(\d+),(\d+),/g;
  let m: RegExpExecArray | null;
  while ((m = rowRegex.exec(content)) !== null) {
    rows.push({
      id: parseInt(m[1]),
      gehegeId: parseInt(m[2]),
      spielgeraetId: parseInt(m[3]),
      stalllevel: parseInt(m[4]),
    });
  }
  return rows;
}

async function main() {
  // Build lookup: biomeId → shelter records ordered by level
  const allShelters = await p.biomeShelter.findMany({
    orderBy: [{ biomeId: "asc" }, { level: "asc" }],
  });
  // Map: biomeId → { level → shelterId }
  const shelterMap = new Map<number, Map<number, number>>();
  for (const s of allShelters) {
    if (!shelterMap.has(s.biomeId)) shelterMap.set(s.biomeId, new Map());
    shelterMap.get(s.biomeId)!.set(s.level, s.id);
  }

  // Build lookup: biomeId → games in insertion order (id ascending)
  const allGames = await p.biomeGame.findMany({ orderBy: [{ biomeId: "asc" }, { id: "asc" }] });
  // Map: biomeId → game id[]  (index 0 = first game)
  const gameMap = new Map<number, number[]>();
  for (const g of allGames) {
    if (!gameMap.has(g.biomeId)) gameMap.set(g.biomeId, []);
    gameMap.get(g.biomeId)!.push(g.id);
  }

  const rows = parseRows("C:/Users/micro/Downloads/tierdaten.txt");
  console.log(`Parsed ${rows.length} animals from tierdaten.txt`);

  let updated = 0;
  let skipped = 0;

  for (const row of rows) {
    // shelterId: look up by biomeId + stalllevel (null for rescue/no shelter)
    const shelterLevel = shelterMap.get(row.gehegeId);
    const shelterId = shelterLevel?.get(row.stalllevel) ?? null;

    // biomeGameId: spielgeraetId - gehegeId gives 1-based index within biome
    const gameIndex = row.spielgeraetId - row.gehegeId; // e.g. 103 - 100 = 3 → 3rd game (1-based)
    const gamesForBiome = gameMap.get(row.gehegeId) ?? [];
    const biomeGameId = gamesForBiome[gameIndex - 1] ?? null;

    if (biomeGameId === null && gamesForBiome.length > 0) {
      console.warn(`  ⚠ Animal ${row.id}: spielgeraetId=${row.spielgeraetId} → index ${gameIndex} not found in biome ${row.gehegeId}`);
    }

    const result = await p.animal.updateMany({
      where: { id: row.id },
      data: {
        shelterId: shelterId,
        biomeGameId: biomeGameId,
      },
    });

    if (result.count > 0) {
      updated++;
    } else {
      console.warn(`  ⚠ Animal id=${row.id} not found in DB`);
      skipped++;
    }
  }

  console.log(`\n✅ Updated ${updated} animals, skipped ${skipped}`);
}

main()
  .catch((e) => { console.error(e); process.exit(1); })
  .finally(() => p.$disconnect());
