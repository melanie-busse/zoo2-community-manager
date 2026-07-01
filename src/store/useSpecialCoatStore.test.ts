import { describe, test, expect, beforeEach, vi } from "vitest";
import { useSpecialCoatStore } from "./useSpecialCoatStore";
import { SpecialCoat } from "@/types/specialCoat";

// Testdaten erstellen
const createMockCoat = (
  id: number,
  animalName: string,
  color: string,
  biomeId: number,
  shelterLevel: number,
  ownedAmount: number,
  price: number,
): SpecialCoat =>
  ({
    id,
    releaseDate: "2026-01-01",
    ownedAmount,
    specialcoatstext: [{ name: `Variante-${animalName}`, color, languageCode: "de" }],
    animal: {
      id: id * 10,
      price,
      shelterLevel,
      biome: { id: biomeId, identifier: biomeId === 1 ? "grassland" : "desert" },
      animaltext: [{ animalName, languageCode: "de" }],
    },
  }) as any;

const mockCoats: SpecialCoat[] = [
  createMockCoat(1, "Löwe", "Goldgelb", 1, 1, 0, 500), // Biome 1, Level 1, 0 Stück (not_owned)
  createMockCoat(2, "Zebra", "Streifen", 1, 2, 1, 300), // Biome 1, Level 2, 1 Stück (missing_partner)
  createMockCoat(3, "Erdmännchen", "Braun", 2, 1, 2, 100), // Biome 2, Level 1, 2 Stück (ready)
];

describe("useSpecialCoatStore", () => {
  beforeEach(() => {
    // Zustand-Store vor jedem Test komplett auf Standardwerte zurücksetzen
    useSpecialCoatStore.setState({
      allSpecialCoats: [],
      currentItems: [],
      filteredItems: [],
      searchQuery: "",
      selectedBiomeId: null,
      selectedShelterLevel: null,
      inventoryStatus: "all",
      sortBy: "animalName",
      sortDirection: "asc",
      currentPage: 1,
      itemsPerPage: 2, // Auf 2 setzen, um Pagination mit 3 Items leichter zu testen
    });
  });

  test("sollte initiale Items setzen und automatisch Filter/Sortierung anwenden", () => {
    const store = useSpecialCoatStore.getState();
    store.setInitialSpecialCoats(mockCoats);

    const updatedState = useSpecialCoatStore.getState();
    expect(updatedState.allSpecialCoats).toHaveLength(3);
    expect(updatedState.filteredItems).toHaveLength(3);
    // Da itemsPerPage=2 ist, sollten in currentItems nur die ersten zwei sein
    expect(updatedState.currentItems).toHaveLength(2);
    // Standard-Sortierung ist animalName (asc): Erdmännchen (E) vor Löwe (L)
    expect(updatedState.currentItems[0].animal?.animaltext?.[0].animalName).toBe("Erdmännchen");
  });

  describe("Filter-Logik", () => {
    beforeEach(() => {
      useSpecialCoatStore.getState().setInitialSpecialCoats(mockCoats);
    });

    test("sollte nach Suchbegriff (Name, Farbname oder Variantename) filtern", () => {
      useSpecialCoatStore.getState().setSearchQuery("Goldgelb");
      expect(useSpecialCoatStore.getState().filteredItems).toHaveLength(1);
      expect(
        useSpecialCoatStore.getState().filteredItems[0].animal?.animaltext?.[0].animalName,
      ).toBe("Löwe");

      useSpecialCoatStore.getState().setSearchQuery("Zebra");
      expect(useSpecialCoatStore.getState().filteredItems).toHaveLength(1);
    });

    test("sollte nach Biome filtern", () => {
      useSpecialCoatStore.getState().setBiomeFilter(1); // Löwe und Zebra haben Biome 1
      expect(useSpecialCoatStore.getState().filteredItems).toHaveLength(2);
    });

    test("sollte nach Stalllevel (shelterLevel) filtern", () => {
      useSpecialCoatStore.getState().setShelterLevelFilter(2); // Nur Zebra hat Level 2
      expect(useSpecialCoatStore.getState().filteredItems).toHaveLength(1);
      expect(
        useSpecialCoatStore.getState().filteredItems[0].animal?.animaltext?.[0].animalName,
      ).toBe("Zebra");
    });

    test("sollte nach Ampelsystem / Inventory-Status filtern", () => {
      // 1. Zuchtbereit (ready -> >= 2)
      useSpecialCoatStore.getState().setInventoryStatusFilter("ready");
      expect(useSpecialCoatStore.getState().filteredItems).toHaveLength(1);
      expect(
        useSpecialCoatStore.getState().filteredItems[0].animal?.animaltext?.[0].animalName,
      ).toBe("Erdmännchen");

      // 2. Partner gesucht (missing_partner -> genau 1)
      useSpecialCoatStore.getState().setInventoryStatusFilter("missing_partner");
      expect(useSpecialCoatStore.getState().filteredItems).toHaveLength(1);
      expect(
        useSpecialCoatStore.getState().filteredItems[0].animal?.animaltext?.[0].animalName,
      ).toBe("Zebra");

      // 3. Nicht im Besitz (not_owned -> genau 0)
      useSpecialCoatStore.getState().setInventoryStatusFilter("not_owned");
      expect(useSpecialCoatStore.getState().filteredItems).toHaveLength(1);
      expect(
        useSpecialCoatStore.getState().filteredItems[0].animal?.animaltext?.[0].animalName,
      ).toBe("Löwe");
    });
  });

  describe("Sortierungs-Logik", () => {
    beforeEach(() => {
      useSpecialCoatStore.getState().setInitialSpecialCoats(mockCoats);
    });

    test("sollte die Richtung wechseln, wenn dieselbe Spalte getoggelt wird", () => {
      // Default ist "animalName" + "asc"
      useSpecialCoatStore.getState().toggleSort("animalName");

      let state = useSpecialCoatStore.getState();
      expect(state.sortBy).toBe("animalName");
      expect(state.sortDirection).toBe("desc");
      // Bei absteigender Sortierung sollte Zebra (Z) ganz oben stehen
      expect(state.currentItems[0].animal?.animaltext?.[0].animalName).toBe("Zebra");
    });

    test("sollte nach numerischen Werten wie dem Preis sortieren", () => {
      useSpecialCoatStore.getState().toggleSort("price"); // Schaltet auf price asc um
      const state = useSpecialCoatStore.getState();
      // Erdmännchen (100) -> Zebra (300) -> Löwe (500)
      expect(state.filteredItems[0].animal?.price).toBe(100);
      expect(state.filteredItems[1].animal?.price).toBe(300);
    });
  });

  describe("Pagination-Logik", () => {
    beforeEach(() => {
      // 3 Items bei 2 Items pro Seite = 2 Seiten
      useSpecialCoatStore.getState().setInitialSpecialCoats(mockCoats);
    });

    test("sollte Seiten vor- und zurückblättern", () => {
      expect(useSpecialCoatStore.getState().currentPage).toBe(1);

      // Vorblättern auf Seite 2
      useSpecialCoatStore.getState().nextPage();
      expect(useSpecialCoatStore.getState().currentPage).toBe(2);
      expect(useSpecialCoatStore.getState().currentItems).toHaveLength(1); // Das übrig gebliebene 3. Element

      // Weiterblättern verhindern, da Maximum erreicht
      useSpecialCoatStore.getState().nextPage();
      expect(useSpecialCoatStore.getState().currentPage).toBe(2);

      // Zurückblättern auf Seite 1
      useSpecialCoatStore.getState().prevPage();
      expect(useSpecialCoatStore.getState().currentPage).toBe(1);
      expect(useSpecialCoatStore.getState().currentItems).toHaveLength(2);
    });
  });
});
