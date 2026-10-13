import { create } from "zustand";
import { paginate } from "@/utils/AnimalUtil";
import type { BiomeDecorationItem } from "@/components/pages/zoo/decorations/BiomeDecorationOverviewContent";

function filterDecorations(
  decorations: BiomeDecorationItem[],
  searchTerm: string,
  selectedBiomeIdentifier: string | null,
): BiomeDecorationItem[] {
  return decorations.filter((deco) => {
    const name = deco.texts[0]?.name ?? deco.identifier;
    const matchesSearch =
      !searchTerm || name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesBiome =
      !selectedBiomeIdentifier || deco.biome.identifier === selectedBiomeIdentifier;
    return matchesSearch && matchesBiome;
  });
}

interface DecorationState {
  allDecorations: BiomeDecorationItem[];
  currentItems: BiomeDecorationItem[];
  filteredCount: number;
  currentPage: number;
  itemsPerPage: number;
  searchTerm: string;
  selectedBiomeIdentifier: string | null;

  setInitialDecorations: (decorations: BiomeDecorationItem[]) => void;
  setSearchTerm: (term: string) => void;
  setSelectedBiomeIdentifier: (id: string | null) => void;
  nextPage: () => void;
  prevPage: () => void;
}

function runPipeline(
  allDecorations: BiomeDecorationItem[],
  searchTerm: string,
  selectedBiomeIdentifier: string | null,
  currentPage: number,
  itemsPerPage: number,
) {
  const filtered = filterDecorations(allDecorations, searchTerm, selectedBiomeIdentifier);
  return {
    filteredCount: filtered.length,
    currentItems: paginate(filtered, currentPage, itemsPerPage),
  };
}

export const useDecorationStore = create<DecorationState>((set) => ({
  allDecorations: [],
  currentItems: [],
  filteredCount: 0,
  currentPage: 1,
  itemsPerPage: 20,
  searchTerm: "",
  selectedBiomeIdentifier: null,

  setInitialDecorations: (decorations) =>
    set((state) => ({
      allDecorations: decorations,
      currentPage: 1,
      ...runPipeline(decorations, state.searchTerm, state.selectedBiomeIdentifier, 1, state.itemsPerPage),
    })),

  setSearchTerm: (term) =>
    set((state) => ({
      searchTerm: term,
      currentPage: 1,
      ...runPipeline(state.allDecorations, term, state.selectedBiomeIdentifier, 1, state.itemsPerPage),
    })),

  setSelectedBiomeIdentifier: (id) =>
    set((state) => ({
      selectedBiomeIdentifier: id,
      currentPage: 1,
      ...runPipeline(state.allDecorations, state.searchTerm, id, 1, state.itemsPerPage),
    })),

  nextPage: () =>
    set((state) => {
      const totalPages = Math.ceil(state.filteredCount / state.itemsPerPage);
      if (state.currentPage >= totalPages) return {};
      const next = state.currentPage + 1;
      const filtered = filterDecorations(state.allDecorations, state.searchTerm, state.selectedBiomeIdentifier);
      return { currentPage: next, currentItems: paginate(filtered, next, state.itemsPerPage) };
    }),

  prevPage: () =>
    set((state) => {
      if (state.currentPage <= 1) return {};
      const prev = state.currentPage - 1;
      const filtered = filterDecorations(state.allDecorations, state.searchTerm, state.selectedBiomeIdentifier);
      return { currentPage: prev, currentItems: paginate(filtered, prev, state.itemsPerPage) };
    }),
}));
