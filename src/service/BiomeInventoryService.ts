import "server-only";
import { prisma } from "@/lib/prisma";

export type BiomeInventoryField =
  | "enclosure"
  | "trough"
  | "waterHole"
  | "shelterLevel0"
  | "shelterLevel1"
  | "shelterLevel2"
  | "shelterLevel3";

export interface BiomeInventoryData {
  enclosure: boolean;
  trough: boolean;
  waterHole: boolean;
  shelterLevel0: number;
  shelterLevel1: number;
  shelterLevel2: number;
  shelterLevel3: number;
}

const defaultBiomeInventory: BiomeInventoryData = {
  enclosure: false,
  trough: false,
  waterHole: false,
  shelterLevel0: 0,
  shelterLevel1: 0,
  shelterLevel2: 0,
  shelterLevel3: 0,
};

export async function getBiomesWithInventory(userId: number, locale: string) {
  const [biomes, inventoryRows, gameInventoryRows] = await Promise.all([
    prisma.biome.findMany({
      include: {
        biomestext: { where: { languageCode: locale } },
        shelters: { select: { level: true } },
        games: {
          include: {
            texts: { where: { languageCode: locale } },
          },
          orderBy: { id: "asc" },
        },
      },
      orderBy: { id: "asc" },
    }),
    prisma.zooInventoryBiome.findMany({ where: { userid: userId } }),
    prisma.zooInventoryBiomeGame.findMany({ where: { userid: userId } }),
  ]);

  const inventoryMap = new Map(inventoryRows.map((r) => [r.biomeId, r]));
  const gameInventoryMap = new Map(gameInventoryRows.map((r) => [r.biomeGameId, r.count]));

  return biomes.map((biome) => {
    const row = inventoryMap.get(biome.id) ?? null;
    const shelterLevels = [...new Set(biome.shelters.map((s) => s.level))].sort((a, b) => a - b);
    return {
      biome,
      shelterLevels,
      inventory: row
        ? {
            enclosure: row.enclosure,
            trough: row.trough,
            waterHole: row.waterHole,
            shelterLevel0: row.shelterLevel0,
            shelterLevel1: row.shelterLevel1,
            shelterLevel2: row.shelterLevel2,
            shelterLevel3: row.shelterLevel3,
          }
        : null,
      gameInventory: gameInventoryMap,
    };
  });
}

export async function upsertBiomeInventory(
  userId: number,
  biomeId: number,
  field: BiomeInventoryField,
  value: boolean | number,
): Promise<void> {
  const boolFields: BiomeInventoryField[] = ["enclosure", "trough", "waterHole"];
  const intFields: BiomeInventoryField[] = [
    "shelterLevel0",
    "shelterLevel1",
    "shelterLevel2",
    "shelterLevel3",
  ];

  const parsedValue = intFields.includes(field) ? Number(value) : Boolean(value);

  await prisma.zooInventoryBiome.upsert({
    where: { userid_biomeId: { userid: userId, biomeId } },
    update: { [field]: parsedValue },
    create: {
      userid: userId,
      biomeId,
      enclosure: field === "enclosure" ? Boolean(value) : false,
      trough: field === "trough" ? Boolean(value) : false,
      waterHole: field === "waterHole" ? Boolean(value) : false,
      shelterLevel0: field === "shelterLevel0" ? Number(value) : 0,
      shelterLevel1: field === "shelterLevel1" ? Number(value) : 0,
      shelterLevel2: field === "shelterLevel2" ? Number(value) : 0,
      shelterLevel3: field === "shelterLevel3" ? Number(value) : 0,
    },
  });
}

export async function upsertBiomeGameInventory(
  userId: number,
  biomeGameId: number,
  count: number,
): Promise<void> {
  await prisma.zooInventoryBiomeGame.upsert({
    where: { userid_biomeGameId: { userid: userId, biomeGameId } },
    update: { count },
    create: { userid: userId, biomeGameId, count },
  });
}
