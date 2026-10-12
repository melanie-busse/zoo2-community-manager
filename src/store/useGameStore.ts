import { create } from "zustand";
import { paginate } from "@/utils/AnimalUtil";
import type { BiomeGame } from "@/components/pages/zoo/games/BiomeGameOverviewContent";

function filterGames(
  games: BiomeGame[],
  searchTerm: string,
  selectedBiomeIdentifier: string | null,
): BiomeGame[] {
  return games.filter((game) => {
    const name = game.texts[0]?.name ?? game.identifier;
    const matchesSearch =
      !searchTerm || name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesBiome =
      !selectedBiomeIdentifier || game.biomeIdentifier === selectedBiomeIdentifier;
    return matchesSearch && matchesBiome;
  });
}

interface GameState {
  allGames: BiomeGame[];
  currentItems: BiomeGame[];
  filteredCount: number;
  currentPage: number;
  itemsPerPage: number;
  searchTerm: string;
  selectedBiomeIdentifier: string | null;

  setInitialGames: (games: BiomeGame[]) => void;
  setSearchTerm: (term: string) => void;
  setSelectedBiomeIdentifier: (id: string | null) => void;
  nextPage: () => void;
  prevPage: () => void;
}

function runPipeline(
  allGames: BiomeGame[],
  searchTerm: string,
  selectedBiomeIdentifier: string | null,
  currentPage: number,
  itemsPerPage: number,
) {
  const filtered = filterGames(allGames, searchTerm, selectedBiomeIdentifier);
  return {
    filteredCount: filtered.length,
    currentItems: paginate(filtered, currentPage, itemsPerPage),
  };
}

export const useGameStore = create<GameState>((set) => ({
  allGames: [],
  currentItems: [],
  filteredCount: 0,
  currentPage: 1,
  itemsPerPage: 20,
  searchTerm: "",
  selectedBiomeIdentifier: null,

  setInitialGames: (games) =>
    set((state) => ({
      allGames: games,
      currentPage: 1,
      ...runPipeline(games, state.searchTerm, state.selectedBiomeIdentifier, 1, state.itemsPerPage),
    })),

  setSearchTerm: (term) =>
    set((state) => ({
      searchTerm: term,
      currentPage: 1,
      ...runPipeline(state.allGames, term, state.selectedBiomeIdentifier, 1, state.itemsPerPage),
    })),

  setSelectedBiomeIdentifier: (id) =>
    set((state) => ({
      selectedBiomeIdentifier: id,
      currentPage: 1,
      ...runPipeline(state.allGames, state.searchTerm, id, 1, state.itemsPerPage),
    })),

  nextPage: () =>
    set((state) => {
      const totalPages = Math.ceil(state.filteredCount / state.itemsPerPage);
      if (state.currentPage >= totalPages) return {};
      const next = state.currentPage + 1;
      const filtered = filterGames(state.allGames, state.searchTerm, state.selectedBiomeIdentifier);
      return { currentPage: next, currentItems: paginate(filtered, next, state.itemsPerPage) };
    }),

  prevPage: () =>
    set((state) => {
      if (state.currentPage <= 1) return {};
      const prev = state.currentPage - 1;
      const filtered = filterGames(state.allGames, state.searchTerm, state.selectedBiomeIdentifier);
      return { currentPage: prev, currentItems: paginate(filtered, prev, state.itemsPerPage) };
    }),
}));
