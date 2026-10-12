import { describe, test, expect, beforeEach, vi } from "vitest";
import { useGameStore } from "./useGameStore";
import type { BiomeGame } from "@/components/pages/zoo/games/BiomeGameOverviewContent";

vi.mock("@/utils/AnimalUtil", () => ({
  paginate: <T,>(items: T[], page: number, itemsPerPage: number): T[] =>
    items.slice((page - 1) * itemsPerPage, page * itemsPerPage),
}));

const makeGames = (count: number, biomeIdentifier = "grassland"): BiomeGame[] =>
  Array.from({ length: count }, (_, i) => ({
    id: i + 1,
    identifier: `game_${i + 1}`,
    biomeIdentifier,
    price: 100,
    pricetype: 1,
    repair: 20,
    repairpricetype: 1,
    texts: [{ name: `Spielgerät ${i + 1}` }],
  }));

describe("useGameStore", () => {
  beforeEach(() => {
    useGameStore.setState({
      allGames: [],
      currentItems: [],
      filteredCount: 0,
      currentPage: 1,
      itemsPerPage: 20,
      searchTerm: "",
      selectedBiomeIdentifier: null,
    });
  });

  // ── setInitialGames ──────────────────────────────────────────────────────
  test("setInitialGames befüllt allGames und currentItems", () => {
    const games = makeGames(5);
    useGameStore.getState().setInitialGames(games);

    const state = useGameStore.getState();
    expect(state.allGames).toHaveLength(5);
    expect(state.currentItems).toHaveLength(5);
    expect(state.filteredCount).toBe(5);
    expect(state.currentPage).toBe(1);
  });

  test("setInitialGames setzt currentPage auf 1 zurück", () => {
    useGameStore.setState({ currentPage: 3 });
    useGameStore.getState().setInitialGames(makeGames(3));
    expect(useGameStore.getState().currentPage).toBe(1);
  });

  test("setInitialGames paginiert auf itemsPerPage Einträge", () => {
    const games = makeGames(25);
    useGameStore.getState().setInitialGames(games);

    const state = useGameStore.getState();
    expect(state.currentItems).toHaveLength(20);
    expect(state.filteredCount).toBe(25);
  });

  // ── nextPage ─────────────────────────────────────────────────────────────
  test("nextPage erhöht currentPage und aktualisiert currentItems", () => {
    useGameStore.getState().setInitialGames(makeGames(25));
    useGameStore.getState().nextPage();

    const state = useGameStore.getState();
    expect(state.currentPage).toBe(2);
    expect(state.currentItems).toHaveLength(5);
  });

  test("nextPage tut nichts auf der letzten Seite", () => {
    useGameStore.getState().setInitialGames(makeGames(25));
    useGameStore.getState().nextPage(); // → Seite 2 (letzte)
    useGameStore.getState().nextPage(); // → darf nicht weiter

    expect(useGameStore.getState().currentPage).toBe(2);
  });

  // ── prevPage ─────────────────────────────────────────────────────────────
  test("prevPage verringert currentPage und aktualisiert currentItems", () => {
    useGameStore.getState().setInitialGames(makeGames(25));
    useGameStore.getState().nextPage();
    useGameStore.getState().prevPage();

    const state = useGameStore.getState();
    expect(state.currentPage).toBe(1);
    expect(state.currentItems).toHaveLength(20);
  });

  test("prevPage tut nichts auf Seite 1", () => {
    useGameStore.getState().setInitialGames(makeGames(10));
    useGameStore.getState().prevPage();

    expect(useGameStore.getState().currentPage).toBe(1);
  });

  // ── setSearchTerm ─────────────────────────────────────────────────────────
  test("setSearchTerm filtert nach Namen und setzt Seite zurück", () => {
    const games = [
      ...makeGames(3, "grassland"),
      { id: 4, identifier: "play_pond", biomeIdentifier: "forest", price: 100, pricetype: 1, repair: 20, repairpricetype: 1, texts: [{ name: "Teich" }] },
    ];
    useGameStore.getState().setInitialGames(games);
    useGameStore.getState().setSearchTerm("Teich");

    const state = useGameStore.getState();
    expect(state.filteredCount).toBe(1);
    expect(state.currentItems[0].texts[0].name).toBe("Teich");
    expect(state.currentPage).toBe(1);
  });

  test("setSearchTerm mit leerem String zeigt alle Spiele", () => {
    useGameStore.getState().setInitialGames(makeGames(5));
    useGameStore.getState().setSearchTerm("Spielgerät 1");
    useGameStore.getState().setSearchTerm("");

    expect(useGameStore.getState().filteredCount).toBe(5);
  });

  // ── setSelectedBiomeIdentifier ────────────────────────────────────────────
  test("setSelectedBiomeIdentifier filtert nach Biom", () => {
    const games = [
      ...makeGames(3, "grassland"),
      { id: 4, identifier: "play_pond", biomeIdentifier: "forest", price: 100, pricetype: 1, repair: 20, repairpricetype: 1, texts: [{ name: "Teich" }] },
    ];
    useGameStore.getState().setInitialGames(games);
    useGameStore.getState().setSelectedBiomeIdentifier("forest");

    const state = useGameStore.getState();
    expect(state.filteredCount).toBe(1);
    expect(state.currentItems[0].biomeIdentifier).toBe("forest");
  });

  test("setSelectedBiomeIdentifier mit null zeigt alle Spiele", () => {
    const games = [...makeGames(3, "grassland"), ...makeGames(2, "forest").map((g) => ({ ...g, id: g.id + 10 }))];
    useGameStore.getState().setInitialGames(games);
    useGameStore.getState().setSelectedBiomeIdentifier("forest");
    useGameStore.getState().setSelectedBiomeIdentifier(null);

    expect(useGameStore.getState().filteredCount).toBe(5);
  });

  test("Name- und Biom-Filter kombinieren sich", () => {
    const games = [
      ...makeGames(2, "grassland"),
      { id: 10, identifier: "play_pond", biomeIdentifier: "forest", price: 100, pricetype: 1, repair: 20, repairpricetype: 1, texts: [{ name: "Teich" }] },
      { id: 11, identifier: "play_tree", biomeIdentifier: "forest", price: 100, pricetype: 1, repair: 20, repairpricetype: 1, texts: [{ name: "Baum" }] },
    ];
    useGameStore.getState().setInitialGames(games);
    useGameStore.getState().setSelectedBiomeIdentifier("forest");
    useGameStore.getState().setSearchTerm("Teich");

    const state = useGameStore.getState();
    expect(state.filteredCount).toBe(1);
    expect(state.currentItems[0].identifier).toBe("play_pond");
  });
});
