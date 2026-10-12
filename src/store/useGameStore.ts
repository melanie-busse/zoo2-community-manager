import { create } from "zustand";
import { paginate } from "@/utils/AnimalUtil";
import type { BiomeGame } from "@/components/pages/zoo/games/BiomeGameOverviewContent";

interface GameState {
  allGames: BiomeGame[];
  currentItems: BiomeGame[];
  filteredCount: number;
  currentPage: number;
  itemsPerPage: number;

  setInitialGames: (games: BiomeGame[]) => void;
  nextPage: () => void;
  prevPage: () => void;
}

export const useGameStore = create<GameState>((set) => ({
  allGames: [],
  currentItems: [],
  filteredCount: 0,
  currentPage: 1,
  itemsPerPage: 20,

  setInitialGames: (games) =>
    set({ allGames: games, filteredCount: games.length, currentPage: 1, currentItems: paginate(games, 1, 20) }),

  nextPage: () =>
    set((state) => {
      const totalPages = Math.ceil(state.filteredCount / state.itemsPerPage);
      if (state.currentPage >= totalPages) return {};
      const next = state.currentPage + 1;
      return { currentPage: next, currentItems: paginate(state.allGames, next, state.itemsPerPage) };
    }),

  prevPage: () =>
    set((state) => {
      if (state.currentPage <= 1) return {};
      const prev = state.currentPage - 1;
      return { currentPage: prev, currentItems: paginate(state.allGames, prev, state.itemsPerPage) };
    }),
}));
