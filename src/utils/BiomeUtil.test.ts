import { describe, test, expect } from "vitest";
import {
  getBiomeImage,
  getShelterImage,
  getBiomeName,
  getBiomeDescription,
  extractUniqueBiomes,
  extractUniqueShelterLevels,
} from "./BiomeUtil";

describe("Biome Utilities", () => {
  const mockBiome = {
    id: 1,
    identifier: "grassland",
    image: "grassland.png",
    biomestext: [
      {
        biomeName: "Grasland",
        biomeDescription: "Ein saftiges, grünes Gehege für heimische Tiere.",
      },
    ],
  } as any;

  const mockEmptyBiome = {
    id: 2,
    identifier: "desert",
    image: "",
    biomestext: [],
  } as any;

  describe("getBiomeImage", () => {
    test("baut den korrekten Bildpfad für das Gehege-Areal zusammen", () => {
      const result = getBiomeImage(mockBiome);
      expect(result).toEqual({
        name: "grassland.png",
        path: "/images/biomes/grassland/area.webp",
        alt: "Grasland",
      });
    });

    test("nutzt die Fallbacks, wenn Daten im Biome fehlen", () => {
      const result = getBiomeImage(mockEmptyBiome);
      expect(result).toEqual({
        name: "placeholder.png",
        path: "/images/biomes/desert/area.webp",
        alt: "Gehegebild",
      });
    });

    test("fängt null oder undefined sauber ab und gibt den globalen Platzhalter zurück", () => {
      const result = getBiomeImage(null);
      expect(result).toEqual({
        name: "placeholder.png",
        path: "/images/biomes/placeholder/area.webp",
        alt: "Gehegebild",
      });
    });
  });

  describe("getShelterImage", () => {
    test("baut den korrekten Bildpfad für den Stall zusammen", () => {
      const result = getShelterImage(mockBiome);
      expect(result).toEqual({
        name: "grassland.png",
        path: "/images/biomes/grassland/shelter.png",
        alt: "Grasland",
      });
    });

    test("nutzt die Fallbacks für den Stall, wenn Daten fehlen", () => {
      const result = getShelterImage(mockEmptyBiome);
      expect(result).toEqual({
        name: "placeholder.png",
        path: "/images/biomes/desert/shelter.png",
        alt: "Stall",
      });
    });

    test("fängt null oder undefined für Ställe sauber ab", () => {
      const result = getShelterImage(undefined);
      expect(result).toEqual({
        name: "placeholder.png",
        path: "/images/biomes/placeholder/shelter.png",
        alt: "Stall",
      });
    });
  });

  describe("extractUniqueBiomes", () => {
    test("gibt leeres Array zurück wenn keine Items vorhanden", () => {
      expect(extractUniqueBiomes([])).toHaveLength(0);
    });

    test("filtert Items ohne Biome heraus", () => {
      expect(extractUniqueBiomes([{ biome: null }, { biome: undefined }, {}])).toHaveLength(0);
    });

    test("dedupliziert nach Biome-ID", () => {
      const items = [{ biome: mockBiome }, { biome: mockBiome }, { biome: mockEmptyBiome }];
      const result = extractUniqueBiomes(items);
      expect(result).toHaveLength(2);
      expect(result.map((b) => b.id)).toEqual(expect.arrayContaining([1, 2]));
    });

    test("gibt alle Biome zurück wenn alle eindeutig sind", () => {
      const anotherBiome = { ...mockBiome, id: 3 };
      const items = [{ biome: mockBiome }, { biome: mockEmptyBiome }, { biome: anotherBiome }];
      expect(extractUniqueBiomes(items)).toHaveLength(3);
    });

    test("verarbeitet gemischte Items mit und ohne Biome", () => {
      const items = [{ biome: mockBiome }, { biome: null }, { biome: mockEmptyBiome }, {}];
      expect(extractUniqueBiomes(items)).toHaveLength(2);
    });
  });

  describe("extractUniqueShelterLevels", () => {
    test("gibt leeres Array zurück wenn keine Items vorhanden", () => {
      expect(extractUniqueShelterLevels([])).toHaveLength(0);
    });

    test("filtert Items ohne shelterLevel heraus", () => {
      expect(
        extractUniqueShelterLevels([{ shelterLevel: null }, { shelterLevel: undefined }]),
      ).toHaveLength(0);
    });

    test("dedupliziert nach shelterLevel", () => {
      const items = [{ shelterLevel: 5 }, { shelterLevel: 5 }, { shelterLevel: 10 }];
      expect(extractUniqueShelterLevels(items)).toHaveLength(2);
    });

    test("sortiert aufsteigend nach shelterLevel", () => {
      const items = [{ shelterLevel: 10 }, { shelterLevel: 3 }, { shelterLevel: 7 }, { shelterLevel: 1 }];
      const result = extractUniqueShelterLevels(items);
      expect(result.map((i) => i.shelterLevel)).toEqual([1, 3, 7, 10]);
    });

    test("verarbeitet gemischte Items mit und ohne shelterLevel", () => {
      const items = [
        { shelterLevel: 5 },
        { shelterLevel: null },
        { shelterLevel: 10 },
        { shelterLevel: undefined },
      ];
      const result = extractUniqueShelterLevels(items);
      expect(result).toHaveLength(2);
      expect(result.map((i) => i.shelterLevel)).toEqual([5, 10]);
    });
  });

  describe("Name & Description Fallbacks", () => {
    test("gibt den korrekten Namen und Beschreibung aus, wenn vorhanden", () => {
      expect(getBiomeName(mockBiome, "Fallback")).toBe("Grasland");
      expect(getBiomeDescription(mockBiome, "Fallback")).toBe(
        "Ein saftiges, grünes Gehege für heimische Tiere.",
      );
    });

    test("greift auf den Fallback-String zurück, wenn das Text-Array leer ist", () => {
      expect(getBiomeName(mockEmptyBiome, "Unbekanntes Gehege")).toBe("Unbekanntes Gehege");
      expect(getBiomeDescription(mockEmptyBiome, "Keine Beschreibung verfügbar")).toBe(
        "Keine Beschreibung verfügbar",
      );
    });

    test("gibt den Fallback-String zurück, wenn das Biome-Objekt null oder undefined ist", () => {
      expect(getBiomeName(null, "Globaler Fallback")).toBe("Globaler Fallback");
      expect(getBiomeDescription(undefined, "Keine Beschreibung")).toBe("Keine Beschreibung");
    });
  });
});
