import { vi, describe, test, expect, beforeEach } from "vitest";
import prisma from "@/lib/prisma";

import {
  getAllAnimals,
  getAnimalById,
  getCountAnimals,
  getCountSpecialCoats,
  createAnimal,
  updateAnimal,
} from "@/service/AnimalService";

const txMock = {
  animal: {
    create: vi.fn(),
    update: vi.fn(),
  },
  animalText: {
    createMany: vi.fn(),
    deleteMany: vi.fn(),
  },
  animalXP: {
    createMany: vi.fn(),
    deleteMany: vi.fn(),
  },
  animalPerEnclosure: {
    createMany: vi.fn(),
    deleteMany: vi.fn(),
  },
  animalOrigin: {
    createMany: vi.fn(),
    deleteMany: vi.fn(),
  },
};

vi.mock("server-only", () => ({}));

vi.mock("@/lib/prisma", () => ({
  default: {
    animal: {
      count: vi.fn(),
      findMany: vi.fn(),
      findUnique: vi.fn(),
    },
    specialCoat: {
      count: vi.fn(),
    },

    $transaction: vi.fn((callback) => callback(txMock)),
  },
}));

describe("Animal Service", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  test("getCountAnimals should return the correct total count of animals", async () => {
    vi.mocked(prisma.animal.count).mockResolvedValue(42);
    const result = await getCountAnimals();
    expect(result).toBe(42);
  });

  test("getCountSpecialCoats should return the correct total count of coats", async () => {
    vi.mocked(prisma.specialCoat.count).mockResolvedValue(15);
    const result = await getCountSpecialCoats();
    expect(result).toBe(15);
  });

  test("getAllAnimals should fetch animals with the correct relational includes and locales", async () => {
    const mockAnimalsFromDb = [{ id: 1 }];
    vi.mocked(prisma.animal.findMany).mockResolvedValue(mockAnimalsFromDb as any);
    const result = await getAllAnimals("en");
    expect(result).toEqual(mockAnimalsFromDb);
  });

  describe("getAnimalById", () => {
    test("should successfully return an animal with filtered language tracks", async () => {
      const mockAnimal = { id: 42, animaltext: [{ name: "Lion" }] };
      vi.mocked(prisma.animal.findUnique).mockResolvedValue(mockAnimal as any);
      const result = await getAnimalById(42, "en");
      expect(result).toEqual(mockAnimal);
    });

    test("should return null and log a warning if the provided ID is NaN", async () => {
      const consoleWarnSpy = vi.spyOn(console, "warn").mockImplementation(() => {});
      const result = await getAnimalById("invalid-id", "en");
      expect(result).toBeNull();
      consoleWarnSpy.mockRestore();
    });
  });

  describe("createAnimal", () => {
    const mockInputData = {
      translations: [
        { spracheCode: "de", name: "Erdmännchen", description: "Süßer Gräber" },
        { spracheCode: "en", name: "Meerkat", description: "Cute digger" },
      ],
      releaseDate: "2026-03-07",
      price: 1000,
      priceType: "Zoodollar",
      sellValue: 200,
      popularity: 50,
      auswildern: 100,
      enclosureType: 10,
      breedingLevel: 1,
      breedingCosts: 50,
      breedingDuration: 120,
      breedingChance: 80,
      actions: {
        feed: { xp: 10, durationHours: 1, durationMinutes: 0 },
      },
      enclosureSizes: [{ animalCount: 2, size: 15 }],
      origins: [{ id: 5 }],
    };

    test("should create an animal record and all related rows via createMany inside a transaction", async () => {
      vi.mocked(txMock.animal.create).mockResolvedValue({ id: 99 } as any);

      const result = await createAnimal(mockInputData);

      // 1. Überprüfen, ob das Haupttier angelegt wurde
      expect(txMock.animal.create).toHaveBeenCalledWith({
        data: expect.objectContaining({
          price: 1000,
          priceTypeId: 1,
          biomeId: 10,
        }),
      });

      expect(txMock.animalText.createMany).toHaveBeenCalledWith({
        data: [
          {
            animalId: 99,
            languageCode: "de",
            animalName: "Erdmännchen",
            animalDescription: "Süßer Gräber",
          },
          {
            animalId: 99,
            languageCode: "en",
            animalName: "Meerkat",
            animalDescription: "Cute digger",
          },
        ],
      });

      expect(txMock.animalXP.createMany).toHaveBeenCalledWith({
        data: [{ animalId: 99, xpTypeId: 1, xpValue: 10, xpDuration: 60 }], // 1 Hour = 60 Min
      });

      expect(txMock.animalPerEnclosure.createMany).toHaveBeenCalled();
      expect(txMock.animalOrigin.createMany).toHaveBeenCalled();

      expect(result).toEqual({ id: 99 });
    });
  });

  describe("updateAnimal", () => {
    const mockUpdateData = {
      translations: [{ spracheCode: "de", name: "Löwe (Update)", description: "Neuer Text" }],
      releaseDate: "2026-06-24",
      price: 5000,
      currencyId: 2,
      sellPrice: 1000,
      popularity: 200,
      releaseTickets: 500,
      biomeId: 12,
      breedingLevel: 4,
      breedingCost: 300,
      breedingDuration: 600,
      breedingProbability: 40,
      actions: {
        play: { xp: 25, durationHours: 0, durationMinutes: 30 },
      },
      enclosureSizes: [],
      origins: [],
    };

    test("should clear old relations and insert new data on update", async () => {
      vi.mocked(txMock.animal.update).mockResolvedValue({ id: 42 } as any);

      const result = await updateAnimal(42, mockUpdateData);

      expect(txMock.animalText.deleteMany).toHaveBeenCalledWith({ where: { animalId: 42 } });
      expect(txMock.animalXP.deleteMany).toHaveBeenCalledWith({ where: { animalId: 42 } });
      expect(txMock.animalPerEnclosure.deleteMany).toHaveBeenCalledWith({
        where: { animalId: 42 },
      });
      expect(txMock.animalOrigin.deleteMany).toHaveBeenCalledWith({ where: { animalId: 42 } });

      expect(txMock.animal.update).toHaveBeenCalledWith({
        where: { id: 42 },
        data: expect.objectContaining({
          price: 5000,
          priceTypeId: 2,
          biomeId: 12,
        }),
      });

      expect(txMock.animalText.createMany).toHaveBeenCalledWith({
        data: [
          {
            animalId: 42,
            languageCode: "de",
            animalName: "Löwe (Update)",
            animalDescription: "Neuer Text",
          },
        ],
      });

      expect(txMock.animalXP.createMany).toHaveBeenCalledWith({
        data: [{ animalId: 42, xpTypeId: 2, xpValue: 25, xpDuration: 30 }],
      });

      expect(result).toEqual({ id: 42 });
    });
  });
});
