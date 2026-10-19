import { describe, test, expect, beforeEach } from "vitest";
import { useBiomeStore } from "./useBiomeStore";
import type { BiomeItem } from "./useBiomeStore";

const mockBiomes: BiomeItem[] = Array.from({ length: 25 }, (_, i) => ({
  id: (i + 1) * 100,
  identifier: `biome_${i + 1}`,
  price: i * 100,
  expansionsCost: i * 50,
  biomestext: [{ biomeName: `Biom ${i + 1}` }],
  priceType: null,
}));

describe("useBiomeStore", () => {
  beforeEach(() => {
    useBiomeStore.setState({
      allBiomes: [],
      currentItems: [],
      filteredCount: 0,
      currentPage: 1,
      itemsPerPage: 20,
      searchTerm: "",
    });
  });

  test("setInitialBiomes lädt Biome und paginiert auf Seite 1", () => {
    useBiomeStore.getState().setInitialBiomes(mockBiomes);
    const state = useBiomeStore.getState();
    expect(state.allBiomes).toHaveLength(25);
    expect(state.currentItems).toHaveLength(20);
    expect(state.filteredCount).toBe(25);
    expect(state.currentPage).toBe(1);
  });

  test("setSearchTerm filtert nach Name und setzt Seite zurück auf 1", () => {
    useBiomeStore.getState().setInitialBiomes(mockBiomes);
    useBiomeStore.getState().setSearchTerm("Biom 1");
    const state = useBiomeStore.getState();
    // Matches "Biom 1", "Biom 10", "Biom 11", ..., "Biom 19"
    expect(state.currentItems.every((b) => b.biomestext[0].biomeName.includes("Biom 1"))).toBe(true);
    expect(state.currentPage).toBe(1);
  });

  test("nextPage blättert zur nächsten Seite", () => {
    useBiomeStore.getState().setInitialBiomes(mockBiomes);
    useBiomeStore.getState().nextPage();
    const state = useBiomeStore.getState();
    expect(state.currentPage).toBe(2);
    expect(state.currentItems).toHaveLength(5);
  });

  test("prevPage blättert zur vorherigen Seite", () => {
    useBiomeStore.getState().setInitialBiomes(mockBiomes);
    useBiomeStore.getState().nextPage();
    useBiomeStore.getState().prevPage();
    expect(useBiomeStore.getState().currentPage).toBe(1);
  });

  test("nextPage überschreitet nicht die letzte Seite", () => {
    useBiomeStore.getState().setInitialBiomes(mockBiomes);
    useBiomeStore.getState().nextPage();
    useBiomeStore.getState().nextPage();
    expect(useBiomeStore.getState().currentPage).toBe(2);
  });

  test("prevPage geht nicht unter Seite 1", () => {
    useBiomeStore.getState().setInitialBiomes(mockBiomes);
    useBiomeStore.getState().prevPage();
    expect(useBiomeStore.getState().currentPage).toBe(1);
  });

  test("leerer Suchbegriff zeigt alle Biome", () => {
    useBiomeStore.getState().setInitialBiomes(mockBiomes);
    useBiomeStore.getState().setSearchTerm("xyz");
    useBiomeStore.getState().setSearchTerm("");
    expect(useBiomeStore.getState().filteredCount).toBe(25);
  });
});
