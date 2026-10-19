import { create } from "zustand";
import { paginate } from "@/utils/AnimalUtil";

export interface RegionItem {
  id: number;
  identifier: string;
  price: number;
  unlocklevel: number;
  regionTexts: { name: string }[];
  _count: { breedingCenterSlots: number };
  terrainName?: string | null;
}

function filterRegions(regions: RegionItem[], searchTerm: string): RegionItem[] {
  if (!searchTerm) return regions;
  const lower = searchTerm.toLowerCase();
  return regions.filter((region) => {
    const name = region.regionTexts[0]?.name ?? region.identifier;
    return name.toLowerCase().includes(lower);
  });
}

interface RegionState {
  allRegions: RegionItem[];
  currentItems: RegionItem[];
  filteredCount: number;
  currentPage: number;
  itemsPerPage: number;
  searchTerm: string;

  setInitialRegions: (regions: RegionItem[]) => void;
  setSearchTerm: (term: string) => void;
  nextPage: () => void;
  prevPage: () => void;
}

function runPipeline(
  allRegions: RegionItem[],
  searchTerm: string,
  currentPage: number,
  itemsPerPage: number,
) {
  const filtered = filterRegions(allRegions, searchTerm);
  return {
    filteredCount: filtered.length,
    currentItems: paginate(filtered, currentPage, itemsPerPage),
  };
}

export const useRegionStore = create<RegionState>((set) => ({
  allRegions: [],
  currentItems: [],
  filteredCount: 0,
  currentPage: 1,
  itemsPerPage: 20,
  searchTerm: "",

  setInitialRegions: (regions) =>
    set((state) => ({
      allRegions: regions,
      currentPage: 1,
      ...runPipeline(regions, state.searchTerm, 1, state.itemsPerPage),
    })),

  setSearchTerm: (term) =>
    set((state) => ({
      searchTerm: term,
      currentPage: 1,
      ...runPipeline(state.allRegions, term, 1, state.itemsPerPage),
    })),

  nextPage: () =>
    set((state) => {
      const totalPages = Math.ceil(state.filteredCount / state.itemsPerPage);
      if (state.currentPage >= totalPages) return {};
      const next = state.currentPage + 1;
      const filtered = filterRegions(state.allRegions, state.searchTerm);
      return { currentPage: next, currentItems: paginate(filtered, next, state.itemsPerPage) };
    }),

  prevPage: () =>
    set((state) => {
      if (state.currentPage <= 1) return {};
      const prev = state.currentPage - 1;
      const filtered = filterRegions(state.allRegions, state.searchTerm);
      return { currentPage: prev, currentItems: paginate(filtered, prev, state.itemsPerPage) };
    }),
}));
