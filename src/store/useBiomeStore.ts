import { create } from "zustand";
import { paginate } from "@/utils/AnimalUtil";

export interface BiomeItem {
  id: number;
  identifier: string;
  price: number | null;
  expansionsCost: number | null;
  biomestext: { biomeName: string }[];
  priceType: { name: string } | null;
}

function filterBiomes(biomes: BiomeItem[], searchTerm: string): BiomeItem[] {
  if (!searchTerm) return biomes;
  const lower = searchTerm.toLowerCase();
  return biomes.filter((biome) => {
    const name = biome.biomestext[0]?.biomeName ?? biome.identifier;
    return name.toLowerCase().includes(lower);
  });
}

interface BiomeState {
  allBiomes: BiomeItem[];
  currentItems: BiomeItem[];
  filteredCount: number;
  currentPage: number;
  itemsPerPage: number;
  searchTerm: string;

  setInitialBiomes: (biomes: BiomeItem[]) => void;
  setSearchTerm: (term: string) => void;
  nextPage: () => void;
  prevPage: () => void;
}

function runPipeline(
  allBiomes: BiomeItem[],
  searchTerm: string,
  currentPage: number,
  itemsPerPage: number,
) {
  const filtered = filterBiomes(allBiomes, searchTerm);
  return {
    filteredCount: filtered.length,
    currentItems: paginate(filtered, currentPage, itemsPerPage),
  };
}

export const useBiomeStore = create<BiomeState>((set) => ({
  allBiomes: [],
  currentItems: [],
  filteredCount: 0,
  currentPage: 1,
  itemsPerPage: 20,
  searchTerm: "",

  setInitialBiomes: (biomes) =>
    set((state) => ({
      allBiomes: biomes,
      currentPage: 1,
      ...runPipeline(biomes, state.searchTerm, 1, state.itemsPerPage),
    })),

  setSearchTerm: (term) =>
    set((state) => ({
      searchTerm: term,
      currentPage: 1,
      ...runPipeline(state.allBiomes, term, 1, state.itemsPerPage),
    })),

  nextPage: () =>
    set((state) => {
      const totalPages = Math.ceil(state.filteredCount / state.itemsPerPage);
      if (state.currentPage >= totalPages) return {};
      const next = state.currentPage + 1;
      const filtered = filterBiomes(state.allBiomes, state.searchTerm);
      return { currentPage: next, currentItems: paginate(filtered, next, state.itemsPerPage) };
    }),

  prevPage: () =>
    set((state) => {
      if (state.currentPage <= 1) return {};
      const prev = state.currentPage - 1;
      const filtered = filterBiomes(state.allBiomes, state.searchTerm);
      return { currentPage: prev, currentItems: paginate(filtered, prev, state.itemsPerPage) };
    }),
}));
