import { describe, test, expect, vi, beforeEach } from "vitest";

import { prisma } from "@/lib/prisma";
import {
  getCountSpecialCoats,
  getAllSpecialCoats,
  getSpecialCoatById,
  createSpecialCoat,
  updateSpecialCoat,
} from "@/service/SpecialCoatsService";

const txMock = {
  specialCoat: {
    update: vi.fn(),
    findUnique: vi.fn(),
  },
  specialCoatsText: {
    deleteMany: vi.fn(),
    createMany: vi.fn(),
  },
  specialCoatsOrigin: {
    deleteMany: vi.fn(),
    createMany: vi.fn(),
  },
};

vi.mock("@/lib/prisma", () => ({
  prisma: {
    specialCoat: {
      count: vi.fn(),
      findMany: vi.fn(),
      findUnique: vi.fn(),
      create: vi.fn(),
    },
    specialCoatsOrigin: {
      createMany: vi.fn(),
    },
    $transaction: vi.fn((callback) => callback(txMock)),
  },
}));

describe("SpecialCoats Service", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  // ==========================================
  // getCountSpecialCoats
  // ==========================================

  describe("getCountSpecialCoats", () => {
    test("sollte die Gesamtanzahl der SpecialCoats zurückgeben", async () => {
      vi.mocked(prisma.specialCoat.count).mockResolvedValue(15);

      const result = await getCountSpecialCoats();

      expect(result).toBe(15);
      expect(prisma.specialCoat.count).toHaveBeenCalledTimes(1);
    });
  });

  // ==========================================
  // getAllSpecialCoats
  // ==========================================

  describe("getAllSpecialCoats", () => {
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
          specialcoatsorigin: [{ origin: { id: 5, name: "Winter-Event" } }],
        },
      ];

      vi.mocked(prisma.specialCoat.findMany).mockResolvedValue(mockDbResult as any);

      const result = await getAllSpecialCoats(mockLocale);

      expect(result).toEqual(mockDbResult);
      expect(prisma.specialCoat.findMany).toHaveBeenCalledWith({
        include: {
          specialcoatstext: { where: { languageCode: mockLocale } },
          animal: {
            include: {
              animaltext: { where: { languageCode: mockLocale } },
              priceType: true,
              biome: {
                include: {
                  biomestext: { where: { languageCode: mockLocale } },
                },
              },
            },
          },
          specialcoatsorigin: { include: { origin: true } },
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

  // ==========================================
  // getSpecialCoatById
  // ==========================================

  describe("getSpecialCoatById", () => {
    const mockCoat = {
      id: 42,
      specialcoatstext: [{ name: "Polarbär", languageCode: "de" }],
      animal: { id: 5, animaltext: [{ animalName: "Bär" }] },
      specialcoatsorigin: [],
    };

    test("sollte einen SpecialCoat mit Locale-Filter zurückgeben", async () => {
      vi.mocked(prisma.specialCoat.findUnique).mockResolvedValue(mockCoat as any);

      const result = await getSpecialCoatById(42, "de");

      expect(result).toEqual(mockCoat);
      expect(prisma.specialCoat.findUnique).toHaveBeenCalledWith({
        where: { id: 42 },
        include: {
          specialcoatstext: { where: { languageCode: "de" } },
          animal: {
            include: {
              animaltext: { where: { languageCode: "de" } },
              priceType: true,
              biome: {
                include: {
                  biomestext: { where: { languageCode: "de" } },
                },
              },
            },
          },
          specialcoatsorigin: { include: { origin: { include: { origintext: { where: { languageCode: "de" } } } } } },
        },
      });
    });

    test("sollte alle Sprachen laden, wenn kein Locale übergeben wird", async () => {
      vi.mocked(prisma.specialCoat.findUnique).mockResolvedValue(mockCoat as any);

      await getSpecialCoatById(42);

      expect(prisma.specialCoat.findUnique).toHaveBeenCalledWith(
        expect.objectContaining({
          include: expect.objectContaining({
            specialcoatstext: true,
          }),
        }),
      );
    });

    test("sollte null zurückgeben, wenn kein Eintrag gefunden wurde", async () => {
      vi.mocked(prisma.specialCoat.findUnique).mockResolvedValue(null);

      const result = await getSpecialCoatById(99, "de");

      expect(result).toBeNull();
    });

    test("sollte null zurückgeben und warnen, wenn die ID keine Zahl ist", async () => {
      const consoleSpy = vi.spyOn(console, "warn").mockImplementation(() => {});

      const result = await getSpecialCoatById("ungueltig", "de");

      expect(result).toBeNull();
      expect(prisma.specialCoat.findUnique).not.toHaveBeenCalled();
      consoleSpy.mockRestore();
    });

    test("sollte einen String als ID korrekt in eine Zahl umwandeln", async () => {
      vi.mocked(prisma.specialCoat.findUnique).mockResolvedValue(mockCoat as any);

      await getSpecialCoatById("42", "de");

      expect(prisma.specialCoat.findUnique).toHaveBeenCalledWith(
        expect.objectContaining({ where: { id: 42 } }),
      );
    });
  });

  // ==========================================
  // createSpecialCoat
  // ==========================================

  describe("createSpecialCoat", () => {
    const mockInput = {
      animalId: 10,
      releaseDate: "2026-06-01",
      image: "polarbear.png",
      texts: [{ languageCode: "de", name: "Polarbär", color: "Weiß" }],
      originIds: [1, 2],
    };

    const mockCreatedCoat = { id: 99, animalId: 10 };
    const mockFinalCoat = {
      id: 99,
      specialcoatstext: [{ name: "Polarbär" }],
      specialcoatsorigin: [{ origin: { id: 1 } }, { origin: { id: 2 } }],
    };

    test("sollte einen SpecialCoat mit Texten und Origins erstellen", async () => {
      vi.mocked(prisma.specialCoat.create).mockResolvedValue(mockCreatedCoat as any);
      vi.mocked(prisma.specialCoat.findUnique).mockResolvedValue(mockFinalCoat as any);

      const result = await createSpecialCoat(mockInput);

      expect(prisma.specialCoat.create).toHaveBeenCalledWith({
        data: {
          animalId: 10,
          releaseDate: new Date("2026-06-01"),
          image: "polarbear.png",
          specialcoatstext: {
            create: [{ languageCode: "de", name: "Polarbär", color: "Weiß" }],
          },
        },
      });

      expect(prisma.specialCoatsOrigin.createMany).toHaveBeenCalledWith({
        data: [
          { specialCoatId: 99, originId: 1 },
          { specialCoatId: 99, originId: 2 },
        ],
      });

      expect(result).toEqual(mockFinalCoat);
    });

    test("sollte createMany für Origins überspringen, wenn keine Origins vorhanden sind", async () => {
      vi.mocked(prisma.specialCoat.create).mockResolvedValue(mockCreatedCoat as any);
      vi.mocked(prisma.specialCoat.findUnique).mockResolvedValue(mockFinalCoat as any);

      await createSpecialCoat({ ...mockInput, originIds: [] });

      expect(prisma.specialCoatsOrigin.createMany).not.toHaveBeenCalled();
    });
  });

  // ==========================================
  // updateSpecialCoat
  // ==========================================

  describe("updateSpecialCoat", () => {
    const mockUpdateData = {
      animalId: 10,
      releaseDate: "2026-07-01",
      image: "updated.png",
      texts: [{ languageCode: "de", name: "Neuer Name", color: "Blau" }],
      originIds: [3],
    };

    const mockUpdatedCoat = {
      id: 42,
      specialcoatstext: [{ name: "Neuer Name" }],
      specialcoatsorigin: [{ origin: { id: 3 } }],
    };

    test("sollte Coat, Texte und Origins in einer Transaktion aktualisieren", async () => {
      txMock.specialCoat.findUnique.mockResolvedValue(mockUpdatedCoat);

      const result = await updateSpecialCoat(42, mockUpdateData);

      expect(prisma.$transaction).toHaveBeenCalledTimes(1);

      expect(txMock.specialCoat.update).toHaveBeenCalledWith({
        where: { id: 42 },
        data: {
          animalId: 10,
          releaseDate: new Date("2026-07-01"),
          image: "updated.png",
        },
      });

      expect(txMock.specialCoatsText.deleteMany).toHaveBeenCalledWith({
        where: { specialCoatId: 42 },
      });
      expect(txMock.specialCoatsText.createMany).toHaveBeenCalledWith({
        data: [{ specialCoatId: 42, languageCode: "de", name: "Neuer Name", color: "Blau" }],
      });

      expect(txMock.specialCoatsOrigin.deleteMany).toHaveBeenCalledWith({
        where: { specialCoatId: 42 },
      });
      expect(txMock.specialCoatsOrigin.createMany).toHaveBeenCalledWith({
        data: [{ specialCoatId: 42, originId: 3 }],
      });

      expect(result).toEqual(mockUpdatedCoat);
    });

    test("sollte Origins löschen aber nicht neu erstellen, wenn originIds leer ist", async () => {
      txMock.specialCoat.findUnique.mockResolvedValue(mockUpdatedCoat);

      await updateSpecialCoat(42, { ...mockUpdateData, originIds: [] });

      expect(txMock.specialCoatsOrigin.deleteMany).toHaveBeenCalled();
      expect(txMock.specialCoatsOrigin.createMany).not.toHaveBeenCalled();
    });

    test("sollte Texte und Origins nicht anfassen, wenn sie nicht im Update-Payload sind", async () => {
      txMock.specialCoat.findUnique.mockResolvedValue(mockUpdatedCoat);

      await updateSpecialCoat(42, { animalId: 10, image: "neu.png" });

      expect(txMock.specialCoatsText.deleteMany).not.toHaveBeenCalled();
      expect(txMock.specialCoatsOrigin.deleteMany).not.toHaveBeenCalled();
    });

    test("sollte einen Fehler werfen, wenn die ID ungültig ist", async () => {
      await expect(updateSpecialCoat("ungueltig", mockUpdateData)).rejects.toThrow(
        "updateSpecialCoat aborted: Invalid ID: ungueltig",
      );
      expect(prisma.$transaction).not.toHaveBeenCalled();
    });

    test("sollte einen String als ID korrekt in eine Zahl umwandeln", async () => {
      txMock.specialCoat.findUnique.mockResolvedValue(mockUpdatedCoat);

      await updateSpecialCoat("42", mockUpdateData);

      expect(txMock.specialCoat.update).toHaveBeenCalledWith(
        expect.objectContaining({ where: { id: 42 } }),
      );
    });
  });
});