import { create } from "zustand";
import { filterSpecialCoats, sortSpecialCoats, paginate } from "@/utils/SpecialCoatUtil";

interface ContestSpecialCoatState {
  allCoats: any[];
  currentItems: any[];
  filteredCount: number;

  searchTerm: string;
  selectedBiome: string | null;
  filterRegionId: number | null;
  sortBy: string;
  sortDirection: "asc" | "desc";
  currentPage: number;
  itemsPerPage: number;

  setInitialCoats: (coats: any[]) => void;
  toggleSort: (key: string) => void;
  nextPage: () => void;
  prevPage: () => void;

  setSearchTerm: (term: string) => void;
  setSelectedBiome: (biome: string | null) => void;
  setFilterRegionId: (id: number | null) => void;
  resetFilters: () => void;
}

export const useContestSpecialCoatStore = create<ContestSpecialCoatState>((set) => {
  const runPipeline = (all: any[], state: any) => {
    const filtered = filterSpecialCoats(all, {
      searchTerm: state.searchTerm,
      selectedBiome: state.selectedBiome,
      selectedShelterLevel: null,
      inventoryStatus: "all",
      filterRegionId: state.filterRegionId,
    });

    const sorted = sortSpecialCoats(filtered, {
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
    allCoats: [],
    currentItems: [],
    filteredCount: 0,
    searchTerm: "",
    selectedBiome: null,
    filterRegionId: null,
    sortBy: "coatName",
    sortDirection: "asc",
    currentPage: 1,
    itemsPerPage: 12,

    setInitialCoats: (coats) =>
      set((state) => ({
        allCoats: coats,
        currentPage: 1,
        ...runPipeline(coats, { ...state, currentPage: 1 }),
      })),

    toggleSort: (key) =>
      set((state) => {
        const isSameKey = state.sortBy === key;
        const nextDirection = isSameKey && state.sortDirection === "asc" ? "desc" : "asc";
        const nextState = { ...state, sortBy: key, sortDirection: nextDirection };
        return {
          sortBy: key,
          sortDirection: nextDirection,
          ...runPipeline(state.allCoats, nextState),
        };
      }),

    nextPage: () =>
      set((state) => {
        const totalPages = Math.ceil(state.filteredCount / state.itemsPerPage);
        if (state.currentPage >= totalPages) return {};
        const nextPage = state.currentPage + 1;
        return {
          currentPage: nextPage,
          ...runPipeline(state.allCoats, { ...state, currentPage: nextPage }),
        };
      }),

    prevPage: () =>
      set((state) => {
        const nextPage = Math.max(1, state.currentPage - 1);
        return {
          currentPage: nextPage,
          ...runPipeline(state.allCoats, { ...state, currentPage: nextPage }),
        };
      }),

    setSearchTerm: (term) =>
      set((state) => {
        const nextState = { ...state, searchTerm: term, currentPage: 1 };
        return { searchTerm: term, currentPage: 1, ...runPipeline(state.allCoats, nextState) };
      }),

    setSelectedBiome: (biome) =>
      set((state) => {
        const nextState = { ...state, selectedBiome: biome, currentPage: 1 };
        return {
          selectedBiome: biome,
          currentPage: 1,
          ...runPipeline(state.allCoats, nextState),
        };
      }),

    setFilterRegionId: (id) =>
      set((state) => {
        const nextState = { ...state, filterRegionId: id, currentPage: 1 };
        return {
          filterRegionId: id,
          currentPage: 1,
          ...runPipeline(state.allCoats, nextState),
        };
      }),

    resetFilters: () =>
      set((state) => {
        const clearedState = {
          ...state,
          searchTerm: "",
          selectedBiome: null,
          filterRegionId: null,
          sortBy: "coatName",
          sortDirection: "asc" as const,
          currentPage: 1,
        };
        return { ...clearedState, ...runPipeline(state.allCoats, clearedState) };
      }),
  };
});
