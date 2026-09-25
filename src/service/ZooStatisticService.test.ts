import { vi, describe, test, expect, beforeEach } from "vitest";

vi.mock("server-only", () => ({}));
vi.mock("@/lib/prisma", () => ({
  default: {
    biome: {
      findMany: vi.fn(),
    },
  },
}));

import { getZooStatistics } from "./ZooStatisticService";
import prisma from "@/lib/prisma";

const makeBiome = (overrides: object = {}) => ({
  id: 1,
  identifier: "grassland",
  biomestext: [{ biomeName: "Grasland" }],
  region: {
    identifier: "MainZoo",
    regionTexts: [{ name: "Hauptzoo" }],
  },
  animals: [
    { priceTypeId: 1, shelterLevel: 0, isContestAnimal: false, specialcoat: [{ id: 1, isContestSpecialCoat: true }, { id: 2, isContestSpecialCoat: false }] },
    { priceTypeId: 1, shelterLevel: 1, isContestAnimal: true,  specialcoat: [] },
    { priceTypeId: 2, shelterLevel: 0, isContestAnimal: true,  specialcoat: [{ id: 3, isContestSpecialCoat: true }] },
  ],
  ...overrides,
});

describe("ZooStatisticService", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  test("gibt korrekt gemappte BiomeStatistic-Objekte zurück", async () => {
    vi.mocked(prisma.biome.findMany).mockResolvedValue([makeBiome()] as any);

    const result = await getZooStatistics("de");

    expect(result).toHaveLength(1);
    expect(result[0]).toMatchObject({
      biomeId: 1,
      biomeName: "Grasland",
      biomeIdentifier: "grassland",
      region: "Hauptzoo",
      totalAnimals: 3,
      animalsForZoodollar: 2,
      animalsForDiamond: 1,
      totalSpecialCoats: 3,
      shelterLevelCounts: { 0: 2, 1: 1 },
      contestStatues: 2,
      contestSpecialCoats: 2,
    });
  });

  test("fällt auf biome.identifier zurück wenn kein biomestext vorhanden", async () => {
    vi.mocked(prisma.biome.findMany).mockResolvedValue([makeBiome({ biomestext: [] })] as any);

    const result = await getZooStatistics("de");

    expect(result[0].biomeName).toBe("grassland");
  });

  test("setzt region auf null wenn kein Region-Datensatz vorhanden", async () => {
    vi.mocked(prisma.biome.findMany).mockResolvedValue([makeBiome({ region: null })] as any);

    const result = await getZooStatistics("de");

    expect(result[0].region).toBeNull();
  });

  test("fällt auf region.identifier zurück wenn kein regionText vorhanden", async () => {
    vi.mocked(prisma.biome.findMany).mockResolvedValue([
      makeBiome({ region: { identifier: "MainZoo", regionTexts: [] } }),
    ] as any);

    const result = await getZooStatistics("de");

    expect(result[0].region).toBe("MainZoo");
  });

  test("zählt Farbvarianten über alle Tiere eines Bioms", async () => {
    vi.mocked(prisma.biome.findMany).mockResolvedValue([
      makeBiome({
        animals: [
          { priceTypeId: 1, shelterLevel: 0, isContestAnimal: false, specialcoat: [{ id: 1, isContestSpecialCoat: false }, { id: 2, isContestSpecialCoat: false }, { id: 3, isContestSpecialCoat: false }] },
          { priceTypeId: 1, shelterLevel: 0, isContestAnimal: false, specialcoat: [] },
        ],
      }),
    ] as any);

    const result = await getZooStatistics("de");

    expect(result[0].totalSpecialCoats).toBe(3);
  });

  test("gruppiert Tiere korrekt nach Stalllevel", async () => {
    vi.mocked(prisma.biome.findMany).mockResolvedValue([
      makeBiome({
        animals: [
          { priceTypeId: 1, shelterLevel: 0, isContestAnimal: false, specialcoat: [] },
          { priceTypeId: 1, shelterLevel: 0, isContestAnimal: false, specialcoat: [] },
          { priceTypeId: 1, shelterLevel: 2, isContestAnimal: false, specialcoat: [] },
          { priceTypeId: 2, shelterLevel: 3, isContestAnimal: false, specialcoat: [] },
        ],
      }),
    ] as any);

    const result = await getZooStatistics("de");

    expect(result[0].shelterLevelCounts).toEqual({ 0: 2, 2: 1, 3: 1 });
  });

  test("behandelt null-shelterLevel als Level 0", async () => {
    vi.mocked(prisma.biome.findMany).mockResolvedValue([
      makeBiome({
        animals: [{ priceTypeId: 1, shelterLevel: null, isContestAnimal: false, specialcoat: [] }],
      }),
    ] as any);

    const result = await getZooStatistics("de");

    expect(result[0].shelterLevelCounts[0]).toBe(1);
  });

  test("zählt Statuen (isContestAnimal) und Wettbewerbsfarbvarianten (isContestSpecialCoat) korrekt", async () => {
    vi.mocked(prisma.biome.findMany).mockResolvedValue([makeBiome()] as any);

    const result = await getZooStatistics("de");

    expect(result[0].contestStatues).toBe(2);
    expect(result[0].contestSpecialCoats).toBe(2);
  });

  test("gibt leeres Array zurück bei Datenbankfehler", async () => {
    vi.mocked(prisma.biome.findMany).mockRejectedValue(new Error("DB error"));

    const result = await getZooStatistics("de");

    expect(result).toEqual([]);
  });
});