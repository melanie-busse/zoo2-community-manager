import { describe, test, expect, vi, beforeEach } from "vitest";

vi.mock("server-only", () => ({}));

const prismaMock = vi.hoisted(() => ({
  chestBoost: {
    findMany: vi.fn(),
    findUnique: vi.fn(),
    create: vi.fn(),
    update: vi.fn(),
    delete: vi.fn(),
  },
  animal: {
    findMany: vi.fn(),
  },
}));

vi.mock("@/lib/prisma", () => ({
  default: prismaMock,
}));

import {
  getAllChestBoosts,
  getChestBoostById,
  createChestBoost,
  updateChestBoost,
  deleteChestBoost,
  getAllAnimalsForChestBoostForm,
} from "@/service/ChestBoostService";

const makeRawBoost = (overrides: object = {}) => ({
  id: 1,
  startDate: new Date("2026-01-01T00:00:00.000Z"),
  endDate: new Date("2026-02-12T00:00:00.000Z"),
  chestType: "EPIC",
  isEvent: false,
  animal: {
    id: 10,
    identifier: "crane",
    animaltext: [{ languageCode: "de", animalName: "Kranich" }],
    biome: {
      id: 3,
      identifier: "savanne",
      biomestext: [{ languageCode: "de", biomeName: "Savanne" }],
    },
  },
  ...overrides,
});

describe("ChestBoostService", () => {
  beforeEach(() => vi.clearAllMocks());

  // ==========================================
  // getAllChestBoosts
  // ==========================================

  describe("getAllChestBoosts", () => {
    test("gibt eine gemappte Liste aller Boosts zurück", async () => {
      prismaMock.chestBoost.findMany.mockResolvedValue([makeRawBoost(), makeRawBoost({ id: 2 })]);

      const result = await getAllChestBoosts("de");

      expect(result).toHaveLength(2);
      expect(result[0]).toMatchObject({
        id: 1,
        chestType: "EPIC",
        isEvent: false,
        startDate: "2026-01-01T00:00:00.000Z",
        endDate: "2026-02-12T00:00:00.000Z",
        animal: { id: 10, name: "Kranich", identifier: "crane" },
      });
    });

    test("übergibt locale an prisma und wählt den passenden Text", async () => {
      const rawBoostEn = makeRawBoost({
        animal: {
          id: 10,
          identifier: "crane",
          animaltext: [
            { languageCode: "de", animalName: "Kranich" },
            { languageCode: "en", animalName: "Crane" },
          ],
          biome: {
            id: 3,
            identifier: "savanne",
            biomestext: [{ languageCode: "en", biomeName: "Savanna" }],
          },
        },
      });
      prismaMock.chestBoost.findMany.mockResolvedValue([rawBoostEn]);

      const result = await getAllChestBoosts("en");

      expect(result[0].animal.name).toBe("Crane");
    });

    test("fällt auf den ersten Text zurück wenn locale nicht gefunden wird", async () => {
      const rawBoost = makeRawBoost({
        animal: {
          id: 10,
          identifier: "crane",
          animaltext: [{ languageCode: "de", animalName: "Kranich" }],
          biome: {
            id: 3,
            identifier: "savanne",
            biomestext: [{ languageCode: "de", biomeName: "Savanne" }],
          },
        },
      });
      prismaMock.chestBoost.findMany.mockResolvedValue([rawBoost]);

      const result = await getAllChestBoosts("en");

      expect(result[0].animal.name).toBe("Kranich");
    });

    test("gibt leeres Array zurück wenn keine Einträge vorhanden sind", async () => {
      prismaMock.chestBoost.findMany.mockResolvedValue([]);

      const result = await getAllChestBoosts("de");

      expect(result).toEqual([]);
    });
  });

  // ==========================================
  // getChestBoostById
  // ==========================================

  describe("getChestBoostById", () => {
    test("gibt den gemappten Boost zurück wenn er gefunden wird", async () => {
      prismaMock.chestBoost.findUnique.mockResolvedValue(makeRawBoost());

      const result = await getChestBoostById(1, "de");

      expect(result).not.toBeNull();
      expect(result?.id).toBe(1);
      expect(result?.animal.name).toBe("Kranich");
    });

    test("gibt null zurück wenn der Eintrag nicht gefunden wird", async () => {
      prismaMock.chestBoost.findUnique.mockResolvedValue(null);

      const result = await getChestBoostById(999, "de");

      expect(result).toBeNull();
    });

    test("fragt mit der korrekten ID ab", async () => {
      prismaMock.chestBoost.findUnique.mockResolvedValue(makeRawBoost({ id: 42 }));

      await getChestBoostById(42, "de");

      expect(prismaMock.chestBoost.findUnique).toHaveBeenCalledWith(
        expect.objectContaining({ where: { id: 42 } }),
      );
    });
  });

  // ==========================================
  // createChestBoost
  // ==========================================

  describe("createChestBoost", () => {
    test("erstellt einen Boost und gibt die neue ID zurück", async () => {
      prismaMock.chestBoost.create.mockResolvedValue({ id: 77 });

      const result = await createChestBoost({
        startDate: "2026-01-01",
        endDate: "2026-02-12",
        chestType: "EPIC",
        isEvent: false,
        animalId: 10,
      });

      expect(result).toEqual({ id: 77 });
    });

    test("konvertiert startDate und endDate zu Date-Objekten", async () => {
      prismaMock.chestBoost.create.mockResolvedValue({ id: 1 });

      await createChestBoost({
        startDate: "2026-01-01",
        endDate: "2026-02-12",
        chestType: "EPIC",
        isEvent: false,
        animalId: 10,
      });

      expect(prismaMock.chestBoost.create).toHaveBeenCalledWith(
        expect.objectContaining({
          data: expect.objectContaining({
            startDate: new Date("2026-01-01"),
            endDate: new Date("2026-02-12"),
            animalId: 10,
          }),
        }),
      );
    });
  });

  // ==========================================
  // updateChestBoost
  // ==========================================

  describe("updateChestBoost", () => {
    test("aktualisiert einen Boost und gibt die ID zurück", async () => {
      prismaMock.chestBoost.update.mockResolvedValue({ id: 5 });

      const result = await updateChestBoost(5, {
        startDate: "2026-03-01",
        endDate: "2026-04-12",
        chestType: "RETRO",
        isEvent: true,
        animalId: 3,
      });

      expect(result).toEqual({ id: 5 });
      expect(prismaMock.chestBoost.update).toHaveBeenCalledWith(
        expect.objectContaining({ where: { id: 5 } }),
      );
    });
  });

  // ==========================================
  // deleteChestBoost
  // ==========================================

  describe("deleteChestBoost", () => {
    test("löscht den Boost mit der korrekten ID", async () => {
      prismaMock.chestBoost.delete.mockResolvedValue({});

      await deleteChestBoost(9);

      expect(prismaMock.chestBoost.delete).toHaveBeenCalledWith({ where: { id: 9 } });
    });
  });

  // ==========================================
  // getAllAnimalsForChestBoostForm
  // ==========================================

  describe("getAllAnimalsForChestBoostForm", () => {
    test("gibt Tiere alphabetisch sortiert zurück", async () => {
      prismaMock.animal.findMany.mockResolvedValue([
        { id: 1, identifier: "crane", animaltext: [{ animalName: "Kranich" }] },
        { id: 2, identifier: "eagle", animaltext: [{ animalName: "Adler" }] },
      ]);

      const result = await getAllAnimalsForChestBoostForm("de");

      expect(result[0].name).toBe("Adler");
      expect(result[1].name).toBe("Kranich");
    });

    test("gibt leeren Namen zurück wenn kein Text vorhanden ist", async () => {
      prismaMock.animal.findMany.mockResolvedValue([
        { id: 1, identifier: null, animaltext: [] },
      ]);

      const result = await getAllAnimalsForChestBoostForm("de");

      expect(result[0].name).toBe("");
      expect(result[0].identifier).toBeNull();
    });
  });
});
