import { describe, test, expect, vi } from "vitest";
import {
  filterAnimals,
  sortAnimals,
  paginate,
  calculateTotalXP,
  getAnimalImage,
  getAnimalName,
} from "./AnimalUtil";

vi.mock("@/utils/BiomeUtil", () => ({
  getBiomeName: (biome: any) => biome?.name || "Unbekannt",
}));

describe("Animal Utilities", () => {
  const mockAnimals = [
    {
      id: 1,
      name: "Erdmännchen",
      shelterLevel: 2,
      image: "erdmaennchen.png",
      sellingPrice: 500,
      biome: { id: 10, identifier: "grassland", name: "Grasland" },
      animaltext: [{ animalName: "Süßes Erdmännchen" }],
      animalxp: [{ xpValue: 100 }, { xpValue: 50 }],
    },
    {
      id: 2,
      name: "Löwe",
      shelterLevel: 5,
      image: "loewe.png",
      sellingPrice: 2000,
      biome: { id: 11, identifier: "savanna", name: "Savanne" },
      animaltext: [{ animalName: "Großer Löwe" }], // 💡 FIX: Name für die Suchfunktion hinterlegt
      animalxp: [{ xpValue: 300 }],
    },
  ] as any[];

  describe("filterAnimals", () => {
    test("filtert nach Suchbegriff (Name)", () => {
      const result = filterAnimals(mockAnimals, {
        searchTerm: "Löwe",
        selectedBiome: "all",
        selectedLevel: "all",
      });
      expect(result).toHaveLength(1);
      expect(result[0].id).toBe(2);
    });

    test("filtert nach Suchbegriff (ID)", () => {
      const result = filterAnimals(mockAnimals, {
        searchTerm: "1",
        selectedBiome: "all",
        selectedLevel: "all",
      });
      expect(result).toHaveLength(1);
      expect(result[0].id).toBe(1);
    });

    test("filtert nach Gehege", () => {
      const result = filterAnimals(mockAnimals, {
        searchTerm: "",
        selectedBiome: "Savanne",
        selectedLevel: "all",
      });
      expect(result).toHaveLength(1);
      expect(result[0].id).toBe(2);
    });

    test("filtert nach Level", () => {
      const result = filterAnimals(mockAnimals, {
        searchTerm: "",
        selectedBiome: "all",
        selectedLevel: "2",
      });
      expect(result).toHaveLength(1);
      expect(result[0].id).toBe(1);
    });
  });

  describe("sortAnimals", () => {
    test("sortiert nach Zahlen (z.B. sellingPrice) aufsteigend", () => {
      const result = sortAnimals(mockAnimals, { sortBy: "sellingPrice", sortDirection: "asc" });
      expect(result[0].id).toBe(1); // 500 < 2000
    });

    test("sortiert nach XP (berechneter Wert) absteigend", () => {
      const result = sortAnimals(mockAnimals, { sortBy: "xp", sortDirection: "desc" });
      expect(result[0].id).toBe(2); // Löwe (300 XP) > Erdmännchen (150 XP)
    });
  });

  describe("paginate", () => {
    test("gibt die exakte Teilmenge für die angeforderte Seite zurück", () => {
      const items = ["A", "B", "C", "D", "E"];
      const result = paginate(items, 2, 2); // Seite 2, 2 Items pro Seite
      expect(result).toEqual(["C", "D"]);
    });
  });

  describe("calculateTotalXP", () => {
    test("rechnet alle XP-Werte eines Tieres zusammen", () => {
      const total = calculateTotalXP(mockAnimals[0]);
      expect(total).toBe(150);
    });

    test("gibt 0 zurück, wenn kein XP-Array existiert", () => {
      const total = calculateTotalXP({} as any);
      expect(total).toBe(0);
    });
  });

  describe("Image & Text Helpers", () => {
    test("baut den korrekten Bild-Pfad zusammen", () => {
      const imageObj = getAnimalImage(mockAnimals[0]);
      expect(imageObj).toEqual({
        name: "erdmaennchen.png",
        path: "/images/animals/grassland/erdmaennchen.png",
        alt: "Süßes Erdmännchen",
      });
    });

    test("nutzt den Fallback-Namen, wenn animaltext leer oder nicht vorhanden ist", () => {
      const emptyAnimal = { animaltext: [] } as any;
      const name = getAnimalName(emptyAnimal, "Unbekanntes Tier");
      expect(name).toBe("Unbekanntes Tier");
    });
  });
});
