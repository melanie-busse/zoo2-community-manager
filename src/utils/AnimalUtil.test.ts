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
      identifier: "erdmaennchen",
      sellingPrice: 500,
      biome: { id: 10, identifier: "grassland", name: "Grasland" },
      animaltext: [{ animalName: "Süßes Erdmännchen" }],
      animalxp: [{ xpValue: 100 }, { xpValue: 50 }],
    },
    {
      id: 2,
      name: "Löwe",
      shelterLevel: 5,
      identifier: "loewe",
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
        selectedBiome: null,
        selectedShelterLevel: null,
      });
      expect(result).toHaveLength(1);
      expect(result[0].id).toBe(2);
    });

    test("filtert nach englischem Namen (zweiter animaltext-Eintrag)", () => {
      const animals = [
        { ...mockAnimals[0], animaltext: [{ animalName: "Süßes Erdmännchen" }, { animalName: "Meerkat" }] },
        { ...mockAnimals[1], animaltext: [{ animalName: "Großer Löwe" }, { animalName: "Lion" }] },
      ];
      const result = filterAnimals(animals as any, {
        searchTerm: "lion",
        selectedBiome: null,
        selectedShelterLevel: null,
      });
      expect(result).toHaveLength(1);
      expect(result[0].id).toBe(2);
    });

    test("filtert nach Suchbegriff (ID)", () => {
      const result = filterAnimals(mockAnimals, {
        searchTerm: "1",
        selectedBiome: null,
        selectedShelterLevel: null,
      });
      expect(result).toHaveLength(1);
      expect(result[0].id).toBe(1);
    });

    test("filtert nach Gehege", () => {
      const result = filterAnimals(mockAnimals, {
        searchTerm: "",
        selectedBiome: "Savanne",
        selectedShelterLevel: null,
      });
      expect(result).toHaveLength(1);
      expect(result[0].id).toBe(2);
    });

    test("filtert nach Level", () => {
      const result = filterAnimals(mockAnimals, {
        searchTerm: "",
        selectedBiome: null,
        selectedShelterLevel: "2",
      });
      expect(result).toHaveLength(1);
      expect(result[0].id).toBe(1);
    });

    test("filtert auf Tiere mit Statue, wenn hasStatueFilter aktiv", () => {
      const animalsWithStatue = [
        { ...mockAnimals[0], isContestAnimal: true },
        { ...mockAnimals[1], isContestAnimal: false },
      ];
      const result = filterAnimals(animalsWithStatue as any, {
        searchTerm: "",
        selectedBiome: null,
        selectedShelterLevel: null,
        hasStatueFilter: true,
      });
      expect(result).toHaveLength(1);
      expect(result[0].id).toBe(1);
    });

    test("zeigt alle Tiere, wenn hasStatueFilter nicht gesetzt", () => {
      const animalsWithStatue = [
        { ...mockAnimals[0], isContestAnimal: true },
        { ...mockAnimals[1], isContestAnimal: false },
      ];
      const result = filterAnimals(animalsWithStatue as any, {
        searchTerm: "",
        selectedBiome: null,
        selectedShelterLevel: null,
      });
      expect(result).toHaveLength(2);
    });

    test("filtert nach filterRegionId — gibt nur Tiere mit passender inventoryRegionId zurück", () => {
      const animals = [
        { ...mockAnimals[0], inventoryRegionId: 3 },
        { ...mockAnimals[1], inventoryRegionId: 7 },
      ];
      const result = filterAnimals(animals as any, {
        searchTerm: "",
        selectedBiome: null,
        selectedShelterLevel: null,
        filterRegionId: 3,
      });
      expect(result).toHaveLength(1);
      expect(result[0].id).toBe(1);
    });

    test("zeigt alle Tiere, wenn filterRegionId null ist", () => {
      const animals = [
        { ...mockAnimals[0], inventoryRegionId: 3 },
        { ...mockAnimals[1], inventoryRegionId: 7 },
      ];
      const result = filterAnimals(animals as any, {
        searchTerm: "",
        selectedBiome: null,
        selectedShelterLevel: null,
        filterRegionId: null,
      });
      expect(result).toHaveLength(2);
    });

    test("filtert nach filterLevel10 — gibt nur Tiere mit inventoryLevel10=true zurück", () => {
      const animals = [
        { ...mockAnimals[0], inventoryLevel10: true },
        { ...mockAnimals[1], inventoryLevel10: false },
      ];
      const result = filterAnimals(animals as any, {
        searchTerm: "",
        selectedBiome: null,
        selectedShelterLevel: null,
        filterLevel10: true,
      });
      expect(result).toHaveLength(1);
      expect(result[0].id).toBe(1);
    });

    test("filtert nach filterLevel20 — gibt nur Tiere mit inventoryLevel20=true zurück", () => {
      const animals = [
        { ...mockAnimals[0], inventoryLevel20: false },
        { ...mockAnimals[1], inventoryLevel20: true },
      ];
      const result = filterAnimals(animals as any, {
        searchTerm: "",
        selectedBiome: null,
        selectedShelterLevel: null,
        filterLevel20: true,
      });
      expect(result).toHaveLength(1);
      expect(result[0].id).toBe(2);
    });

    test("filtert nach filterGlitter — gibt nur Tiere mit inventoryGlitter=true zurück", () => {
      const animals = [
        { ...mockAnimals[0], inventoryGlitter: true },
        { ...mockAnimals[1], inventoryGlitter: true },
      ];
      const result = filterAnimals(animals as any, {
        searchTerm: "",
        selectedBiome: null,
        selectedShelterLevel: null,
        filterGlitter: true,
      });
      expect(result).toHaveLength(2);
    });

    test("kombiniert mehrere Inventory-Filter korrekt", () => {
      const animals = [
        { ...mockAnimals[0], inventoryLevel10: true, inventoryRegionId: 3 },
        { ...mockAnimals[1], inventoryLevel10: true, inventoryRegionId: 7 },
      ];
      const result = filterAnimals(animals as any, {
        searchTerm: "",
        selectedBiome: null,
        selectedShelterLevel: null,
        filterLevel10: true,
        filterRegionId: 3,
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

    test("sortiert nach Name (animaltext[0].animalName) aufsteigend", () => {
      const result = sortAnimals(mockAnimals, { sortBy: "name", sortDirection: "asc" });
      expect(result[0].id).toBe(2); // "Großer Löwe" < "Süßes Erdmännchen"
    });

    test("sortiert nach Name (animaltext[0].animalName) absteigend", () => {
      const result = sortAnimals(mockAnimals, { sortBy: "name", sortDirection: "desc" });
      expect(result[0].id).toBe(1); // "Süßes Erdmännchen" > "Großer Löwe"
    });

    test("sortiert nach Name korrekt wenn animaltext fehlt", () => {
      const animalsWithoutText = [
        { ...mockAnimals[0], animaltext: undefined },
        { ...mockAnimals[1] },
      ] as any[];
      const result = sortAnimals(animalsWithoutText, { sortBy: "name", sortDirection: "asc" });
      expect(result[0].id).toBe(1); // leerer String sortiert vor "Großer Löwe"
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
        name: "erdmaennchen",
        path: "/images/animals/grassland/erdmaennchen/image.jpg",
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
