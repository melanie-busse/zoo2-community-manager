// @vitest-environment node
import { vi, describe, test, expect, beforeEach } from "vitest";
import prisma from "@/lib/prisma";
import {
  getAllAnimals,
  getAnimalById,
  getCountAnimals,
  getCountSpecialCoats,
} from "@/service/AnimalService";

// 1. ALL GLOBAL MOCKS AT THE TOP (Combined Prisma Mock)
vi.mock("server-only", () => ({}));
vi.mock("@/lib/prisma", () => ({
  default: {
    animal: {
      count: vi.fn(),
      findMany: vi.fn(),
      findUnique: vi.fn(), // <-- Here it is! Added seamlessly
    },
    specialCoat: {
      count: vi.fn(),
    },
  },
}));

describe("Animal Service", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  test("getCountAnimals should return the correct total count of animals", async () => {
    vi.mocked(prisma.animal.count).mockResolvedValue(42);

    const result = await getCountAnimals();

    expect(prisma.animal.count).toHaveBeenCalledTimes(1);
    expect(result).toBe(42);
  });

  test("getCountSpecialCoats should return the correct total count of coats", async () => {
    vi.mocked(prisma.specialCoat.count).mockResolvedValue(15);

    const result = await getCountSpecialCoats();

    expect(prisma.specialCoat.count).toHaveBeenCalledTimes(1);
    expect(result).toBe(15);
  });

  test("getAllAnimals should fetch animals with the correct relational includes and locales", async () => {
    const mockAnimalsFromDb = [
      {
        id: 1,
        animaltext: [{ name: "Lion", languageCode: "en" }],
        biome: { id: 10, biomestext: [{ biomeName: "Savanna", languageCode: "en" }] },
      },
    ];

    vi.mocked(prisma.animal.findMany).mockResolvedValue(mockAnimalsFromDb as any);

    const result = await getAllAnimals("en");

    expect(prisma.animal.findMany).toHaveBeenCalledWith({
      include: {
        animaltext: {
          where: { languageCode: "en" },
        },
        animalxp: true,
        biome: {
          include: {
            biomestext: {
              where: { languageCode: "en" },
            },
          },
        },
        priceType: true,
      },
      orderBy: { id: "asc" },
    });

    expect(result).toEqual(mockAnimalsFromDb);
  });

  describe("getAnimalById", () => {
    test("should successfully return an animal with filtered language tracks", async () => {
      const mockAnimal = {
        id: 42,
        price: 500,
        animaltext: [{ name: "Lion", description: "King of the jungle", languageCode: "en" }],
        priceType: { name: "Zoodollar" },
      };

      vi.mocked(prisma.animal.findUnique).mockResolvedValue(mockAnimal as any);

      const result = await getAnimalById(42, "en");

      expect(prisma.animal.findUnique).toHaveBeenCalledWith({
        where: { id: 42 },
        include: expect.objectContaining({
          animaltext: { where: { languageCode: "en" } },
          biome: expect.any(Object),
        }),
      });

      expect(result).toEqual(mockAnimal);
      expect(result.animaltext[0].name).toBe("Lion");
    });

    test("should return null and log a warning if the provided ID is NaN", async () => {
      const consoleWarnSpy = vi.spyOn(console, "warn").mockImplementation(() => {});

      const result = await getAnimalById("invalid-id", "en");

      expect(result).toBeNull();
      expect(prisma.animal.findUnique).not.toHaveBeenCalled();
      expect(consoleWarnSpy).toHaveBeenCalledWith(
        expect.stringContaining("getAnimalById aborted: ID is not a number"),
      );

      consoleWarnSpy.mockRestore();
    });

    test("should return null if no animal was found in the database", async () => {
      vi.mocked(prisma.animal.findUnique).mockResolvedValue(null);

      const result = await getAnimalById(999, "de");

      expect(result).toBeNull();
      expect(prisma.animal.findUnique).toHaveBeenCalledWith(
        expect.objectContaining({
          where: { id: 999 },
        }),
      );
    });
  });
});
