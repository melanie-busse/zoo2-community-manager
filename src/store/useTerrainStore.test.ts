import { describe, test, expect, beforeEach } from "vitest";
import { useTerrainStore } from "./useTerrainStore";
import type { TerrainItem } from "./useTerrainStore";

const mockTerrains: TerrainItem[] = Array.from({ length: 25 }, (_, i) => ({
  id: i + 1,
  identifier: `terrain_${i + 1}`,
  terrainTexts: [{ name: `Gelände ${i + 1}` }],
  regionName: null,
}));

describe("useTerrainStore", () => {
  beforeEach(() => {
    useTerrainStore.setState({
      allTerrains: [],
      currentItems: [],
      filteredCount: 0,
      currentPage: 1,
      itemsPerPage: 20,
      searchTerm: "",
    });
  });

  test("setInitialTerrains lädt Geländetypen und paginiert auf Seite 1", () => {
    useTerrainStore.getState().setInitialTerrains(mockTerrains);
    const state = useTerrainStore.getState();
    expect(state.allTerrains).toHaveLength(25);
    expect(state.currentItems).toHaveLength(20);
    expect(state.filteredCount).toBe(25);
    expect(state.currentPage).toBe(1);
  });

  test("setSearchTerm filtert nach Name und setzt Seite zurück auf 1", () => {
    useTerrainStore.getState().setInitialTerrains(mockTerrains);
    useTerrainStore.getState().setSearchTerm("Gelände 1");
    const state = useTerrainStore.getState();
    expect(state.currentItems.every((t) => t.terrainTexts[0].name.includes("Gelände 1"))).toBe(true);
    expect(state.currentPage).toBe(1);
  });

  test("nextPage blättert zur nächsten Seite", () => {
    useTerrainStore.getState().setInitialTerrains(mockTerrains);
    useTerrainStore.getState().nextPage();
    const state = useTerrainStore.getState();
    expect(state.currentPage).toBe(2);
    expect(state.currentItems).toHaveLength(5);
  });

  test("prevPage blättert zur vorherigen Seite", () => {
    useTerrainStore.getState().setInitialTerrains(mockTerrains);
    useTerrainStore.getState().nextPage();
    useTerrainStore.getState().prevPage();
    expect(useTerrainStore.getState().currentPage).toBe(1);
  });

  test("nextPage überschreitet nicht die letzte Seite", () => {
    useTerrainStore.getState().setInitialTerrains(mockTerrains);
    useTerrainStore.getState().nextPage();
    useTerrainStore.getState().nextPage();
    expect(useTerrainStore.getState().currentPage).toBe(2);
  });

  test("prevPage geht nicht unter Seite 1", () => {
    useTerrainStore.getState().setInitialTerrains(mockTerrains);
    useTerrainStore.getState().prevPage();
    expect(useTerrainStore.getState().currentPage).toBe(1);
  });

  test("leerer Suchbegriff zeigt alle Geländetypen", () => {
    useTerrainStore.getState().setInitialTerrains(mockTerrains);
    useTerrainStore.getState().setSearchTerm("xyz");
    useTerrainStore.getState().setSearchTerm("");
    expect(useTerrainStore.getState().filteredCount).toBe(25);
  });
});
