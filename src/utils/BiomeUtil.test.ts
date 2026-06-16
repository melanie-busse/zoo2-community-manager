import { describe, test, expect } from "vitest";
import { getBiomeImage, getShelterImage, getBiomeName, getBiomeDescription } from "./BiomeUtil"; // Pfad anpassen, falls die Datei anders heißt

describe("Biome Utilities", () => {
  // Mock-Daten für ein Gehege (z.B. Grasland) vorbereiten
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

  // Mock-Daten für ein Gehege ohne Übersetzungen (Fallback-Test)
  const mockEmptyBiome = {
    id: 2,
    identifier: "desert",
    image: "", // Löst den placeholder.png Fallback aus
    biomestext: [],
  } as any;

  // ==========================================
  // 1. GET BIOME IMAGE
  // ==========================================
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
  });

  // ==========================================
  // 2. GET SHELTER IMAGE
  // ==========================================
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
  });

  // ==========================================
  // 3. NAME & DESCRIPTION FALLBACKS
  // ==========================================
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
  });
});
