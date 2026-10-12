import { create } from "zustand";
import { paginate } from "@/utils/AnimalUtil";

export interface TerrainItem {
  id: number;
  identifier: string;
  terrainTexts: { name: string }[];
  regionName?: string | null;
}

function filterTerrains(terrains: TerrainItem[], searchTerm: string): TerrainItem[] {
  if (!searchTerm) return terrains;
  const lower = searchTerm.toLowerCase();
  return terrains.filter((terrain) => {
    const name = terrain.terrainTexts[0]?.name ?? terrain.identifier;
    return name.toLowerCase().includes(lower);
  });
}

interface TerrainState {
  allTerrains: TerrainItem[];
  currentItems: TerrainItem[];
  filteredCount: number;
  currentPage: number;
  itemsPerPage: number;
  searchTerm: string;

  setInitialTerrains: (terrains: TerrainItem[]) => void;
  setSearchTerm: (term: string) => void;
  nextPage: () => void;
  prevPage: () => void;
}

function runPipeline(
  allTerrains: TerrainItem[],
  searchTerm: string,
  currentPage: number,
  itemsPerPage: number,
) {
  const filtered = filterTerrains(allTerrains, searchTerm);
  return {
    filteredCount: filtered.length,
    currentItems: paginate(filtered, currentPage, itemsPerPage),
  };
}

export const useTerrainStore = create<TerrainState>((set) => ({
  allTerrains: [],
  currentItems: [],
  filteredCount: 0,
  currentPage: 1,
  itemsPerPage: 20,
  searchTerm: "",

  setInitialTerrains: (terrains) =>
    set((state) => ({
      allTerrains: terrains,
      currentPage: 1,
      ...runPipeline(terrains, state.searchTerm, 1, state.itemsPerPage),
    })),

  setSearchTerm: (term) =>
    set((state) => ({
      searchTerm: term,
      currentPage: 1,
      ...runPipeline(state.allTerrains, term, 1, state.itemsPerPage),
    })),

  nextPage: () =>
    set((state) => {
      const totalPages = Math.ceil(state.filteredCount / state.itemsPerPage);
      if (state.currentPage >= totalPages) return {};
      const next = state.currentPage + 1;
      const filtered = filterTerrains(state.allTerrains, state.searchTerm);
      return { currentPage: next, currentItems: paginate(filtered, next, state.itemsPerPage) };
    }),

  prevPage: () =>
    set((state) => {
      if (state.currentPage <= 1) return {};
      const prev = state.currentPage - 1;
      const filtered = filterTerrains(state.allTerrains, state.searchTerm);
      return { currentPage: prev, currentItems: paginate(filtered, prev, state.itemsPerPage) };
    }),
}));
