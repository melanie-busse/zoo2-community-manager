import { vi, describe, test, expect, beforeEach } from "vitest";

vi.mock("server-only", () => ({}));
vi.mock("@/lib/prisma", () => ({
  prisma: {
    biome: { findMany: vi.fn() },
    zooInventoryBiome: { findMany: vi.fn() },
    zooInventoryBiomeGame: { findMany: vi.fn() },
  },
}));

import { getBiomesWithInventory } from "./BiomeInventoryService";
import { prisma } from "@/lib/prisma";

const makeBiome = (overrides: object = {}) => ({
  id: 1,
  identifier: "grassland",
  biomestext: [{ biomeName: "Grasland" }],
  shelters: [{ level: 0 }, { level: 1 }, { level: 2 }, { level: 3 }],
  games: [
    { id: 10, identifier: "play_tree", texts: [{ name: "Kletterbaum" }] },
  ],
  ...overrides,
});

describe("BiomeInventoryService – getBiomesWithInventory", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(prisma.zooInventoryBiome.findMany).mockResolvedValue([]);
    vi.mocked(prisma.zooInventoryBiomeGame.findMany).mockResolvedValue([]);
  });

  test("gibt Biom mit inventory=null zurück wenn kein Inventar-Datensatz vorhanden", async () => {
    vi.mocked(prisma.biome.findMany).mockResolvedValue([makeBiome()] as any);

    const result = await getBiomesWithInventory(1, "de");

    expect(result).toHaveLength(1);
    expect(result[0].inventory).toBeNull();
  });

  test("gibt gemappte inventory-Daten zurück wenn Inventar vorhanden ist", async () => {
    vi.mocked(prisma.biome.findMany).mockResolvedValue([makeBiome()] as any);
    vi.mocked(prisma.zooInventoryBiome.findMany).mockResolvedValue([
      {
        biomeId: 1,
        enclosure: true,
        trough: true,
        waterHole: false,
        shelterLevel0: 2,
        shelterLevel1: 1,
        shelterLevel2: 0,
        shelterLevel3: 0,
      },
    ] as any);

    const result = await getBiomesWithInventory(1, "de");

    expect(result[0].inventory).toMatchObject({
      enclosure: true,
      trough: true,
      waterHole: false,
      shelterLevel0: 2,
      shelterLevel1: 1,
    });
  });

  test("leitet deduplizierte Stalllevel des Bioms weiter", async () => {
    vi.mocked(prisma.biome.findMany).mockResolvedValue([
      makeBiome({ shelters: [{ level: 0 }, { level: 0 }, { level: 2 }] }),
    ] as any);

    const result = await getBiomesWithInventory(1, "de");

    expect(result[0].shelterLevels).toEqual([0, 2]);
  });

  test("gibt leeres shelterLevels-Array zurück wenn Biom keine Ställe hat", async () => {
    vi.mocked(prisma.biome.findMany).mockResolvedValue([
      makeBiome({ shelters: [] }),
    ] as any);

    const result = await getBiomesWithInventory(1, "de");

    expect(result[0].shelterLevels).toEqual([]);
  });

  test("füllt gameInventoryMap aus den Spielgerät-Inventar-Datensätzen", async () => {
    vi.mocked(prisma.biome.findMany).mockResolvedValue([makeBiome()] as any);
    vi.mocked(prisma.zooInventoryBiomeGame.findMany).mockResolvedValue([
      { biomeGameId: 10, count: 3 },
    ] as any);

    const result = await getBiomesWithInventory(1, "de");

    expect(result[0].gameInventory.get(10)).toBe(3);
  });

  test("gameInventory enthält 0 für unbekannte Spielgerät-IDs", async () => {
    vi.mocked(prisma.biome.findMany).mockResolvedValue([makeBiome()] as any);

    const result = await getBiomesWithInventory(1, "de");

    expect(result[0].gameInventory.get(10)).toBeUndefined();
  });

  test("sortiert shelterLevels aufsteigend", async () => {
    vi.mocked(prisma.biome.findMany).mockResolvedValue([
      makeBiome({ shelters: [{ level: 3 }, { level: 1 }, { level: 0 }] }),
    ] as any);

    const result = await getBiomesWithInventory(1, "de");

    expect(result[0].shelterLevels).toEqual([0, 1, 3]);
  });
});
