import { describe, test, expect, beforeEach } from "vitest";
import { useRegionStore } from "./useRegionStore";
import type { RegionItem } from "./useRegionStore";

const mockRegions: RegionItem[] = Array.from({ length: 25 }, (_, i) => ({
  id: i + 1,
  identifier: `region_${i + 1}`,
  price: i * 100,
  unlocklevel: i + 1,
  regionTexts: [{ name: `Region ${i + 1}` }],
  _count: { breedingCenterSlots: i },
  terrainName: null,
}));

describe("useRegionStore", () => {
  beforeEach(() => {
    useRegionStore.setState({
      allRegions: [],
      currentItems: [],
      filteredCount: 0,
      currentPage: 1,
      itemsPerPage: 20,
      searchTerm: "",
    });
  });

  test("setInitialRegions lädt Regionen und paginiert auf Seite 1", () => {
    useRegionStore.getState().setInitialRegions(mockRegions);
    const state = useRegionStore.getState();
    expect(state.allRegions).toHaveLength(25);
    expect(state.currentItems).toHaveLength(20);
    expect(state.filteredCount).toBe(25);
    expect(state.currentPage).toBe(1);
  });

  test("setSearchTerm filtert nach Name und setzt Seite zurück auf 1", () => {
    useRegionStore.getState().setInitialRegions(mockRegions);
    useRegionStore.getState().setSearchTerm("Region 1");
    const state = useRegionStore.getState();
    expect(state.currentItems.every((r) => r.regionTexts[0].name.includes("Region 1"))).toBe(true);
    expect(state.currentPage).toBe(1);
  });

  test("nextPage blättert zur nächsten Seite", () => {
    useRegionStore.getState().setInitialRegions(mockRegions);
    useRegionStore.getState().nextPage();
    const state = useRegionStore.getState();
    expect(state.currentPage).toBe(2);
    expect(state.currentItems).toHaveLength(5);
  });

  test("prevPage blättert zur vorherigen Seite", () => {
    useRegionStore.getState().setInitialRegions(mockRegions);
    useRegionStore.getState().nextPage();
    useRegionStore.getState().prevPage();
    expect(useRegionStore.getState().currentPage).toBe(1);
  });

  test("nextPage überschreitet nicht die letzte Seite", () => {
    useRegionStore.getState().setInitialRegions(mockRegions);
    useRegionStore.getState().nextPage();
    useRegionStore.getState().nextPage();
    expect(useRegionStore.getState().currentPage).toBe(2);
  });

  test("prevPage geht nicht unter Seite 1", () => {
    useRegionStore.getState().setInitialRegions(mockRegions);
    useRegionStore.getState().prevPage();
    expect(useRegionStore.getState().currentPage).toBe(1);
  });

  test("leerer Suchbegriff zeigt alle Regionen", () => {
    useRegionStore.getState().setInitialRegions(mockRegions);
    useRegionStore.getState().setSearchTerm("xyz");
    useRegionStore.getState().setSearchTerm("");
    expect(useRegionStore.getState().filteredCount).toBe(25);
  });
});
