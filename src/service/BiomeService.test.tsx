import { vi, describe, test, expect, beforeEach } from "vitest";

vi.mock("server-only", () => ({}));

const txMock = {
  biome: {
    create: vi.fn(),
    update: vi.fn(),
  },
  biomesText: {
    deleteMany: vi.fn(),
    createMany: vi.fn(),
  },
  biomeTrough: {
    deleteMany: vi.fn(),
    createMany: vi.fn(),
  },
  biomeWaterHole: {
    deleteMany: vi.fn(),
    createMany: vi.fn(),
  },
  biomeShelter: {
    deleteMany: vi.fn(),
    createMany: vi.fn(),
  },
};

vi.mock("@/lib/prisma", () => ({
  default: {
    biome: {
      count: vi.fn(),
      findMany: vi.fn(),
      findUnique: vi.fn(),
      delete: vi.fn(),
    },
    biomeGame: {
      findMany: vi.fn(),
    },
    biomesText: {
      deleteMany: vi.fn(),
    },
    $transaction: vi.fn((cb) => {
      if (typeof cb === "function") return cb(txMock);
      return Promise.all(cb);
    }),
  },
}));

import prisma from "@/lib/prisma";
import {
  getHabitatCount,
  getAllBiomes,
  getAllBiomeGames,
  getBiomeById,
  getBiomeByIdForEdit,
  createBiome,
  updateBiome,
  deleteBiome,
} from "./BiomeService";

describe("BiomeService", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  // ── getHabitatCount ────────────────────────────────────────────────────────
  test("getHabitatCount returns count from prisma", async () => {
    vi.mocked(prisma.biome.count).mockResolvedValue(14);
    expect(await getHabitatCount()).toBe(14);
    expect(prisma.biome.count).toHaveBeenCalledTimes(1);
  });

  // ── getAllBiomes ───────────────────────────────────────────────────────────
  test("getAllBiomes returns biomes filtered by locale", async () => {
    const mock = [{ id: 1, identifier: "forest", biomestext: [{ languageCode: "de", biomeName: "Wald" }] }];
    vi.mocked(prisma.biome.findMany).mockResolvedValue(mock as any);
    const result = await getAllBiomes("de");
    expect(result).toEqual(mock);
    expect(prisma.biome.findMany).toHaveBeenCalledWith(
      expect.objectContaining({ include: expect.objectContaining({ biomestext: { where: { languageCode: "de" } } }) }),
    );
  });

  test("getAllBiomes returns empty array on DB error", async () => {
    vi.mocked(prisma.biome.findMany).mockRejectedValue(new Error("DB down"));
    expect(await getAllBiomes("de")).toEqual([]);
  });

  // ── getAllBiomeGames ───────────────────────────────────────────────────────
  test("getAllBiomeGames returns games ordered by identifier", async () => {
    const mock = [{ id: 1, identifier: "play_rocks", biomeIdentifier: "forest", texts: [] }];
    vi.mocked(prisma.biomeGame.findMany).mockResolvedValue(mock as any);
    const result = await getAllBiomeGames("de");
    expect(result).toEqual(mock);
    expect(prisma.biomeGame.findMany).toHaveBeenCalledWith(
      expect.objectContaining({ orderBy: { identifier: "asc" } }),
    );
  });

  // ── getBiomeById ──────────────────────────────────────────────────────────
  test("getBiomeById calls findUnique with correct id and locale includes", async () => {
    vi.mocked(prisma.biome.findUnique).mockResolvedValue(null);
    await getBiomeById(5, "en");
    expect(prisma.biome.findUnique).toHaveBeenCalledWith(
      expect.objectContaining({
        where: { id: 5 },
        include: expect.objectContaining({
          biomestext: { where: { languageCode: "en" } },
          shelters: { orderBy: { level: "asc" } },
        }),
      }),
    );
  });

  // ── getBiomeByIdForEdit ───────────────────────────────────────────────────
  test("getBiomeByIdForEdit includes all nested relations", async () => {
    vi.mocked(prisma.biome.findUnique).mockResolvedValue(null);
    await getBiomeByIdForEdit(3);
    expect(prisma.biome.findUnique).toHaveBeenCalledWith(
      expect.objectContaining({
        where: { id: 3 },
        include: expect.objectContaining({
          biomestext: true,
          troughs: true,
          waterHoles: true,
          games: { select: { id: true } },
        }),
      }),
    );
  });

  // ── createBiome ───────────────────────────────────────────────────────────
  describe("createBiome", () => {
    const baseData = {
      identifier: "forest",
      price: 100,
      priceTypeId: 1,
      expansionsCost: 50,
      priceTypeExpansionsCostId: 1,
      size: 10,
      regionId: 2,
      biomestext: [{ languageCode: "de", biomeName: "Wald", biomeDescription: "" }],
    };

    beforeEach(() => {
      txMock.biome.create.mockResolvedValue({ id: 42 });
      txMock.biome.update.mockResolvedValue({});
      txMock.biomeTrough.createMany.mockResolvedValue({});
      txMock.biomeWaterHole.createMany.mockResolvedValue({});
      txMock.biomeShelter.createMany.mockResolvedValue({});
    });

    test("creates biome and returns id", async () => {
      const result = await createBiome(baseData);
      expect(result).toEqual({ id: 42 });
      expect(txMock.biome.create).toHaveBeenCalledWith(
        expect.objectContaining({ data: expect.objectContaining({ identifier: "forest" }) }),
      );
    });

    test("skips biomestext entries with empty biomeName", async () => {
      await createBiome({
        ...baseData,
        biomestext: [
          { languageCode: "de", biomeName: "Wald", biomeDescription: "" },
          { languageCode: "en", biomeName: "", biomeDescription: "" },
        ],
      });
      const call = txMock.biome.create.mock.calls[0][0];
      expect(call.data.biomestext.createMany.data).toHaveLength(1);
      expect(call.data.biomestext.createMany.data[0].languageCode).toBe("de");
    });

    test("creates troughs when provided", async () => {
      await createBiome({ ...baseData, troughs: [{ price: 200, pricetype: 1 }] });
      expect(txMock.biomeTrough.createMany).toHaveBeenCalledWith({
        data: [{ price: 200, pricetype: 1, biomeId: 42 }],
      });
    });

    test("creates waterHoles with repairpricetype when provided", async () => {
      await createBiome({
        ...baseData,
        waterHoles: [{ price: 150, pricetype: 1, repair: 30, repairpricetype: 2 }],
      });
      expect(txMock.biomeWaterHole.createMany).toHaveBeenCalledWith({
        data: [{ price: 150, pricetype: 1, repair: 30, repairpricetype: 2, biomeId: 42 }],
      });
    });

    test("creates shelters when provided", async () => {
      await createBiome({
        ...baseData,
        shelters: [{ level: 0, cost: 500, pricetype: 1, buildTime: 120, unlockLevel: 5 }],
      });
      expect(txMock.biomeShelter.createMany).toHaveBeenCalledWith({
        data: [{ level: 0, cost: 500, pricetype: 1, buildTime: 120, unlockLevel: 5, biomeId: 42 }],
      });
    });

    test("connects games via M2M when gameIds provided", async () => {
      await createBiome({ ...baseData, gameIds: [1, 2, 3] });
      expect(txMock.biome.update).toHaveBeenCalledWith({
        where: { id: 42 },
        data: { games: { connect: [{ id: 1 }, { id: 2 }, { id: 3 }] } },
      });
    });

    test("skips trough/waterHole/shelter/game creation when not provided", async () => {
      await createBiome(baseData);
      expect(txMock.biomeTrough.createMany).not.toHaveBeenCalled();
      expect(txMock.biomeWaterHole.createMany).not.toHaveBeenCalled();
      expect(txMock.biomeShelter.createMany).not.toHaveBeenCalled();
      expect(txMock.biome.update).not.toHaveBeenCalled();
    });
  });

  // ── updateBiome ───────────────────────────────────────────────────────────
  describe("updateBiome", () => {
    const baseData = {
      identifier: "forest",
      price: 100,
      priceTypeId: 1,
      expansionsCost: 50,
      priceTypeExpansionsCostId: 1,
      size: 10,
      regionId: 2,
      biomestext: [{ languageCode: "de", biomeName: "Wald", biomeDescription: "" }],
    };

    beforeEach(() => {
      txMock.biome.update.mockResolvedValue({});
      txMock.biomesText.deleteMany.mockResolvedValue({});
      txMock.biomesText.createMany.mockResolvedValue({});
      txMock.biomeTrough.deleteMany.mockResolvedValue({});
      txMock.biomeTrough.createMany.mockResolvedValue({});
      txMock.biomeWaterHole.deleteMany.mockResolvedValue({});
      txMock.biomeWaterHole.createMany.mockResolvedValue({});
      txMock.biomeShelter.deleteMany.mockResolvedValue({});
      txMock.biomeShelter.createMany.mockResolvedValue({});
    });

    test("updates core biome fields", async () => {
      await updateBiome(7, baseData);
      expect(txMock.biome.update).toHaveBeenCalledWith(
        expect.objectContaining({ where: { id: 7 }, data: expect.objectContaining({ identifier: "forest" }) }),
      );
    });

    test("replaces biomestext (delete + recreate), skipping empty names", async () => {
      await updateBiome(7, {
        ...baseData,
        biomestext: [
          { languageCode: "de", biomeName: "Wald", biomeDescription: "" },
          { languageCode: "en", biomeName: "", biomeDescription: "" },
        ],
      });
      expect(txMock.biomesText.deleteMany).toHaveBeenCalledWith({ where: { biomeId: 7 } });
      expect(txMock.biomesText.createMany).toHaveBeenCalledWith({
        data: [{ biomeId: 7, languageCode: "de", biomeName: "Wald", biomeDescription: "" }],
      });
    });

    test("does not call biomesText.createMany when all names are empty", async () => {
      await updateBiome(7, {
        ...baseData,
        biomestext: [{ languageCode: "de", biomeName: "", biomeDescription: "" }],
      });
      expect(txMock.biomesText.deleteMany).toHaveBeenCalled();
      expect(txMock.biomesText.createMany).not.toHaveBeenCalled();
    });

    test("replaces troughs (delete + recreate)", async () => {
      await updateBiome(7, { ...baseData, troughs: [{ price: 200, pricetype: 1 }] });
      expect(txMock.biomeTrough.deleteMany).toHaveBeenCalledWith({ where: { biomeId: 7 } });
      expect(txMock.biomeTrough.createMany).toHaveBeenCalledWith({
        data: [{ price: 200, pricetype: 1, biomeId: 7 }],
      });
    });

    test("replaces waterHoles with repairpricetype (delete + recreate)", async () => {
      await updateBiome(7, {
        ...baseData,
        waterHoles: [{ price: 150, pricetype: 1, repair: 30, repairpricetype: 2 }],
      });
      expect(txMock.biomeWaterHole.deleteMany).toHaveBeenCalledWith({ where: { biomeId: 7 } });
      expect(txMock.biomeWaterHole.createMany).toHaveBeenCalledWith({
        data: [{ price: 150, pricetype: 1, repair: 30, repairpricetype: 2, biomeId: 7 }],
      });
    });

    test("replaces shelters (delete + recreate)", async () => {
      await updateBiome(7, {
        ...baseData,
        shelters: [{ level: 1, cost: 800, pricetype: 1, buildTime: 60, unlockLevel: 3 }],
      });
      expect(txMock.biomeShelter.deleteMany).toHaveBeenCalledWith({ where: { biomeId: 7 } });
      expect(txMock.biomeShelter.createMany).toHaveBeenCalledWith({
        data: [{ level: 1, cost: 800, pricetype: 1, buildTime: 60, unlockLevel: 3, biomeId: 7 }],
      });
    });

    test("sets games via M2M (replaces all connections)", async () => {
      await updateBiome(7, { ...baseData, gameIds: [10, 20] });
      expect(txMock.biome.update).toHaveBeenCalledWith(
        expect.objectContaining({
          where: { id: 7 },
          data: { games: { set: [{ id: 10 }, { id: 20 }] } },
        }),
      );
    });

    test("sets empty games array when gameIds is undefined", async () => {
      await updateBiome(7, baseData);
      expect(txMock.biome.update).toHaveBeenCalledWith(
        expect.objectContaining({ data: { games: { set: [] } } }),
      );
    });
  });

  // ── deleteBiome ───────────────────────────────────────────────────────────
  test("deleteBiome calls transaction with deleteMany and delete", async () => {
    vi.mocked(prisma.biomesText.deleteMany).mockResolvedValue({ count: 0 });
    vi.mocked(prisma.biome.delete).mockResolvedValue({} as any);
    await deleteBiome(9);
    expect(prisma.$transaction).toHaveBeenCalledTimes(1);
    expect(prisma.biomesText.deleteMany).toHaveBeenCalledWith({ where: { biomeId: 9 } });
    expect(prisma.biome.delete).toHaveBeenCalledWith({ where: { id: 9 } });
  });
});
