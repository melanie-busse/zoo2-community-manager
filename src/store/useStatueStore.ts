import { create } from "zustand";
import { filterAnimals, sortAnimals, paginate } from "@/utils/AnimalUtil";

interface StatueState {
  allStatues: any[];
  currentItems: any[];
  filteredCount: number;

  searchTerm: string;
  selectedBiome: string | null;
  filterRegionId: number | null;
  sortBy: string;
  sortDirection: "asc" | "desc";
  currentPage: number;
  itemsPerPage: number;

  setInitialStatues: (statues: any[]) => void;
  toggleSort: (key: string) => void;
  nextPage: () => void;
  prevPage: () => void;

  setSearchTerm: (term: string) => void;
  setSelectedBiome: (biome: string | null) => void;
  setFilterRegionId: (id: number | null) => void;
  resetFilters: () => void;
}

export const useStatueStore = create<StatueState>((set) => {
  const runPipeline = (all: any[], state: any) => {
    const filtered = filterAnimals(all, {
      searchTerm: state.searchTerm,
      selectedBiome: state.selectedBiome,
      selectedShelterLevel: null,
      filterRegionId: state.filterRegionId,
    });

    const sorted = sortAnimals(filtered, {
      sortBy: state.sortBy,
      sortDirection: state.sortDirection,
    });

    const paginated = paginate(sorted, state.currentPage, state.itemsPerPage);

    return {
      currentItems: paginated,
      filteredCount: filtered.length,
    };
  };

  return {
    allStatues: [],
    currentItems: [],
    filteredCount: 0,
    searchTerm: "",
    selectedBiome: null,
    filterRegionId: null,
    sortBy: "name",
    sortDirection: "asc",
    currentPage: 1,
    itemsPerPage: 12,

    setInitialStatues: (statues) =>
      set((state) => {
        return {
          allStatues: statues,
          currentPage: 1,
          ...runPipeline(statues, { ...state, currentPage: 1 }),
        };
      }),

    toggleSort: (key) =>
      set((state) => {
        const isSameKey = state.sortBy === key;
        const nextDirection = isSameKey && state.sortDirection === "asc" ? "desc" : "asc";
        const nextState = { ...state, sortBy: key, sortDirection: nextDirection };
        return {
          sortBy: key,
          sortDirection: nextDirection,
          ...runPipeline(state.allStatues, nextState),
        };
      }),

    nextPage: () =>
      set((state) => {
        const totalPages = Math.ceil(state.filteredCount / state.itemsPerPage);
        if (state.currentPage >= totalPages) return {};
        const nextPage = state.currentPage + 1;
        return {
          currentPage: nextPage,
          ...runPipeline(state.allStatues, { ...state, currentPage: nextPage }),
        };
      }),

    prevPage: () =>
      set((state) => {
        const nextPage = Math.max(1, state.currentPage - 1);
        return {
          currentPage: nextPage,
          ...runPipeline(state.allStatues, { ...state, currentPage: nextPage }),
        };
      }),

    setSearchTerm: (term) =>
      set((state) => {
        const nextState = { ...state, searchTerm: term, currentPage: 1 };
        return { searchTerm: term, currentPage: 1, ...runPipeline(state.allStatues, nextState) };
      }),

    setSelectedBiome: (biome) =>
      set((state) => {
        const nextState = { ...state, selectedBiome: biome, currentPage: 1 };
        return {
          selectedBiome: biome,
          currentPage: 1,
          ...runPipeline(state.allStatues, nextState),
        };
      }),

    setFilterRegionId: (id) =>
      set((state) => {
        const nextState = { ...state, filterRegionId: id, currentPage: 1 };
        return {
          filterRegionId: id,
          currentPage: 1,
          ...runPipeline(state.allStatues, nextState),
        };
      }),

    resetFilters: () =>
      set((state) => {
        const clearedState = {
          ...state,
          searchTerm: "",
          selectedBiome: null,
          filterRegionId: null,
          sortBy: "name",
          sortDirection: "asc" as const,
          currentPage: 1,
        };
        return { ...clearedState, ...runPipeline(state.allStatues, clearedState) };
      }),
  };
});