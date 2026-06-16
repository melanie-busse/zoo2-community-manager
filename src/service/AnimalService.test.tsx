// @vitest-environment node
import { vi } from "vitest";

vi.mock("server-only", () => ({}));
vi.mock("@/lib/prisma", () => ({
  default: {
    animal: {
      count: vi.fn(),
      findMany: vi.fn(),
    },
    specialCoat: {
      count: vi.fn(),
    },
  },
}));

import { describe, test, expect, beforeEach } from "vitest";

import prisma from "@/lib/prisma";
import { getAllAnimals, getCountAnimals, getCountSpecialCoats } from "@/service/AnimalService";

// Den globalen Prisma-Client mocken
vi.mock("@/lib/prisma", () => ({
  default: {
    animal: {
      count: vi.fn(),
      findMany: vi.fn(),
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

  test("getCountAnimals gibt die korrekte Anzahl der Tiere zurück", async () => {
    // Dem Mock sagen, was prisma.animal.count() zurückgeben soll
    vi.mocked(prisma.animal.count).mockResolvedValue(42);

    const result = await getCountAnimals();

    expect(prisma.animal.count).toHaveBeenCalledTimes(1);
    expect(result).toBe(42);
  });

  test("getCountSpecialCoats gibt die korrekte Anzahl der Farbvarianten zurück", async () => {
    vi.mocked(prisma.specialCoat.count).mockResolvedValue(15);

    const result = await getCountSpecialCoats();

    expect(prisma.specialCoat.count).toHaveBeenCalledTimes(1);
    expect(result).toBe(15);
  });

  test("getAllAnimals fragt die Tiere mit den richtigen relationalen Includes und Sprachen ab", async () => {
    // Mock-Daten, die die verschachtelte Prisma-Struktur simulieren
    const mockAnimalsFromDb = [
      {
        id: 1,
        animaltext: [{ name: "Löwe", languageCode: "de" }],
        biome: { id: 10, biomestext: [{ biomeName: "Wüste", languageCode: "de" }] },
      },
    ];

    vi.mocked(prisma.animal.findMany).mockResolvedValue(mockAnimalsFromDb as any);

    // Service aufrufen (standardmäßig mit "de")
    const result = await getAllAnimals("de");

    // 1. Prüfen, ob findMany mit den exakt richtigen Relations (include) aufgerufen wurde
    expect(prisma.animal.findMany).toHaveBeenCalledWith({
      include: {
        animaltext: {
          where: { languageCode: "de" },
        },
        animalxp: true,
        biome: {
          include: {
            biomestext: {
              where: { languageCode: "de" },
            },
          },
        },
        priceType: true,
      },
      orderBy: { id: "asc" },
    });

    // 2. Prüfen, ob die Daten unverändert zurückkommen
    expect(result).toEqual(mockAnimalsFromDb);
  });
});
