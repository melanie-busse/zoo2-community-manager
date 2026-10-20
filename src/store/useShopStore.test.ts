import { describe, test, expect, beforeEach } from "vitest";
import { useShopStore } from "./useShopStore";
import type { ShopItem } from "./useShopStore";

function makeShop(overrides: Partial<ShopItem> & { id: number; name: string }): ShopItem {
  return {
    identifier: overrides.name.toLowerCase().replace(/ /g, "_"),
    coinsPerClient: null,
    regionId: null,
    region: null,
    levels: [],
    texts: [],
    ...overrides,
  };
}

const mockShops: ShopItem[] = [
  makeShop({ id: 1, name: "Balloon Shop", region: { id: 1, identifier: "mainzoo", regionTexts: [{ name: "Main Zoo" }] }, regionId: 1, texts: [{ name: "Balloon Shop" }] }),
  makeShop({ id: 2, name: "Cloud Cafe", region: { id: 1, identifier: "mainzoo", regionTexts: [{ name: "Main Zoo" }] }, regionId: 1, texts: [{ name: "Cloud Cafe" }] }),
  makeShop({ id: 3, name: "Ice Cream Cart", region: { id: 2, identifier: "aquarium", regionTexts: [{ name: "Aquarium" }] }, regionId: 2, texts: [{ name: "Ice Cream Cart" }] }),
  makeShop({ id: 4, name: "Kiosk", region: { id: 2, identifier: "aquarium", regionTexts: [{ name: "Aquarium" }] }, regionId: 2, texts: [{ name: "Kiosk" }] }),
  makeShop({ id: 5, name: "Snack Shop", region: null, regionId: null, texts: [{ name: "Snack Shop" }] }),
];

describe("useShopStore", () => {
  beforeEach(() => {
    useShopStore.setState({
      allShops: [],
      currentItems: [],
      filteredCount: 0,
      currentPage: 1,
      itemsPerPage: 20,
      searchTerm: "",
      selectedRegionId: null,
      sortBy: "name",
      sortDirection: "asc",
    });
  });

  test("setInitialShops lädt Shops und paginiert auf Seite 1", () => {
    useShopStore.getState().setInitialShops(mockShops);
    const state = useShopStore.getState();
    expect(state.allShops).toHaveLength(5);
    expect(state.filteredCount).toBe(5);
    expect(state.currentPage).toBe(1);
  });

  test("setInitialShops sortiert standardmäßig alphabetisch (asc)", () => {
    useShopStore.getState().setInitialShops(mockShops);
    const names = useShopStore.getState().currentItems.map((s) => s.texts[0]?.name ?? s.name);
    expect(names).toEqual([...names].sort((a, b) => a.localeCompare(b)));
  });

  test("setSearchTerm filtert nach Name und setzt Seite zurück auf 1", () => {
    useShopStore.getState().setInitialShops(mockShops);
    useShopStore.getState().nextPage();
    useShopStore.getState().setSearchTerm("ice");
    const state = useShopStore.getState();
    expect(state.currentItems).toHaveLength(1);
    expect(state.currentItems[0].name).toBe("Ice Cream Cart");
    expect(state.currentPage).toBe(1);
  });

  test("leerer Suchbegriff zeigt alle Shops", () => {
    useShopStore.getState().setInitialShops(mockShops);
    useShopStore.getState().setSearchTerm("ice");
    useShopStore.getState().setSearchTerm("");
    expect(useShopStore.getState().filteredCount).toBe(5);
  });

  test("setSelectedRegionId filtert nach Region", () => {
    useShopStore.getState().setInitialShops(mockShops);
    useShopStore.getState().setSelectedRegionId(1);
    const state = useShopStore.getState();
    expect(state.filteredCount).toBe(2);
    expect(state.currentItems.every((s) => s.region?.id === 1)).toBe(true);
  });

  test("setSelectedRegionId(null) zeigt alle Shops", () => {
    useShopStore.getState().setInitialShops(mockShops);
    useShopStore.getState().setSelectedRegionId(1);
    useShopStore.getState().setSelectedRegionId(null);
    expect(useShopStore.getState().filteredCount).toBe(5);
  });

  test("Suche und Regions-Filter kombiniert", () => {
    useShopStore.getState().setInitialShops(mockShops);
    useShopStore.getState().setSelectedRegionId(1);
    useShopStore.getState().setSearchTerm("cloud");
    const state = useShopStore.getState();
    expect(state.filteredCount).toBe(1);
    expect(state.currentItems[0].name).toBe("Cloud Cafe");
  });

  test("toggleSort wechselt auf desc beim zweiten Klick", () => {
    useShopStore.getState().setInitialShops(mockShops);
    useShopStore.getState().toggleSort("name");
    expect(useShopStore.getState().sortDirection).toBe("desc");
    const names = useShopStore.getState().currentItems.map((s) => s.texts[0]?.name ?? s.name);
    expect(names).toEqual([...names].sort((a, b) => b.localeCompare(a)));
  });

  test("toggleSort wechselt zurück auf asc beim dritten Klick", () => {
    useShopStore.getState().setInitialShops(mockShops);
    useShopStore.getState().toggleSort("name");
    useShopStore.getState().toggleSort("name");
    expect(useShopStore.getState().sortDirection).toBe("asc");
  });

  test("toggleSort nach Region sortiert nach Regionsname (asc)", () => {
    useShopStore.getState().setInitialShops(mockShops);
    useShopStore.getState().toggleSort("region");
    const regions = useShopStore.getState().currentItems.map(
      (s) => s.region?.regionTexts?.[0]?.name ?? "",
    );
    expect(regions).toEqual([...regions].sort((a, b) => a.localeCompare(b)));
  });

  test("toggleSort nach Region sortiert desc beim zweiten Klick", () => {
    useShopStore.getState().setInitialShops(mockShops);
    useShopStore.getState().toggleSort("region");
    useShopStore.getState().toggleSort("region");
    const regions = useShopStore.getState().currentItems.map(
      (s) => s.region?.regionTexts?.[0]?.name ?? "",
    );
    expect(regions).toEqual([...regions].sort((a, b) => b.localeCompare(a)));
  });

  test("Pagination: nextPage blättert zur nächsten Seite", () => {
    const manyShops = Array.from({ length: 25 }, (_, i) =>
      makeShop({ id: i + 1, name: `Shop ${String(i + 1).padStart(2, "0")}` }),
    );
    useShopStore.getState().setInitialShops(manyShops);
    useShopStore.getState().nextPage();
    const state = useShopStore.getState();
    expect(state.currentPage).toBe(2);
    expect(state.currentItems).toHaveLength(5);
  });

  test("Pagination: prevPage geht nicht unter Seite 1", () => {
    useShopStore.getState().setInitialShops(mockShops);
    useShopStore.getState().prevPage();
    expect(useShopStore.getState().currentPage).toBe(1);
  });

  test("Pagination: nextPage überschreitet nicht die letzte Seite", () => {
    useShopStore.getState().setInitialShops(mockShops);
    useShopStore.getState().nextPage();
    useShopStore.getState().nextPage();
    expect(useShopStore.getState().currentPage).toBe(1);
  });
});
