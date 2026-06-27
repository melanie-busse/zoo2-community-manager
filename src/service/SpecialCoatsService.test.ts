import { describe, test, expect, vi, beforeEach } from "vitest";

import { prisma } from "@/lib/prisma";
import { getAllSpecialCoats } from "@/service/SpecialCoatsService";

vi.mock("@/lib/prisma", () => ({
  prisma: {
    specialCoat: {
      findMany: vi.fn(),
    },
  },
}));

describe("getAllSpecialCoats Service", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  test("sollte findMany mit den korrekten Relationen und Language-Filtern aufrufen", async () => {
    const mockLocale = "de";

    const mockDbResult = [
      {
        id: 1,
        specialcoatstext: [{ name: "Polarfuchs", languageCode: "de" }],
        animal: {
          id: 10,
          animaltext: [{ animalName: "Fuchs", languageCode: "de" }],
          priceType: { id: 1, name: "Zoodollar" },
          biome: { id: 100, identifier: "ice" },
        },
        origin: { id: 5, name: "Winter-Event" },
      },
    ];

    vi.mocked(prisma.specialCoat.findMany).mockResolvedValue(mockDbResult as any);

    const result = await getAllSpecialCoats(mockLocale);

    expect(result).toEqual(mockDbResult);

    expect(prisma.specialCoat.findMany).toHaveBeenCalledWith({
      include: {
        specialcoatstext: {
          where: {
            languageCode: mockLocale,
          },
        },
        animal: {
          include: {
            animaltext: {
              where: {
                languageCode: mockLocale,
              },
            },
            priceType: true,
            biome: true,
          },
        },
        origin: true,
      },
    });
  });

  test("sollte einen Fehler abfangen und ein leeres Array zurückgeben", async () => {
    const consoleSpy = vi.spyOn(console, "error").mockImplementation(() => {});
    vi.mocked(prisma.specialCoat.findMany).mockRejectedValue(new Error("DB Connection Lost"));

    const result = await getAllSpecialCoats("de");

    expect(result).toEqual([]);
    expect(consoleSpy).toHaveBeenCalled();

    consoleSpy.mockRestore();
  });
});
