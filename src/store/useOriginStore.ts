import { create } from "zustand";
import { paginate } from "@/utils/AnimalUtil";

export interface OriginItem {
  id: number;
  identifier: string | null;
  origintext: { originName: string }[];
}

function filterOrigins(origins: OriginItem[], searchTerm: string): OriginItem[] {
  return origins.filter((o) => {
    const name = o.origintext[0]?.originName ?? "";
    return !searchTerm || name.toLowerCase().includes(searchTerm.toLowerCase());
  });
}

interface OriginState {
  allOrigins: OriginItem[];
  currentItems: OriginItem[];
  filteredCount: number;
  currentPage: number;
  itemsPerPage: number;
  searchTerm: string;

  setInitialOrigins: (origins: OriginItem[]) => void;
  setSearchTerm: (term: string) => void;
  nextPage: () => void;
  prevPage: () => void;
}

function runPipeline(
  allOrigins: OriginItem[],
  searchTerm: string,
  currentPage: number,
  itemsPerPage: number,
) {
  const filtered = filterOrigins(allOrigins, searchTerm);
  return {
    filteredCount: filtered.length,
    currentItems: paginate(filtered, currentPage, itemsPerPage),
  };
}

export const useOriginStore = create<OriginState>((set) => ({
  allOrigins: [],
  currentItems: [],
  filteredCount: 0,
  currentPage: 1,
  itemsPerPage: 20,
  searchTerm: "",

  setInitialOrigins: (origins) =>
    set((state) => ({
      allOrigins: origins,
      currentPage: 1,
      ...runPipeline(origins, state.searchTerm, 1, state.itemsPerPage),
    })),

  setSearchTerm: (term) =>
    set((state) => ({
      searchTerm: term,
      currentPage: 1,
      ...runPipeline(state.allOrigins, term, 1, state.itemsPerPage),
    })),

  nextPage: () =>
    set((state) => {
      const totalPages = Math.ceil(state.filteredCount / state.itemsPerPage);
      if (state.currentPage >= totalPages) return {};
      const next = state.currentPage + 1;
      const filtered = filterOrigins(state.allOrigins, state.searchTerm);
      return { currentPage: next, currentItems: paginate(filtered, next, state.itemsPerPage) };
    }),

  prevPage: () =>
    set((state) => {
      if (state.currentPage <= 1) return {};
      const prev = state.currentPage - 1;
      const filtered = filterOrigins(state.allOrigins, state.searchTerm);
      return { currentPage: prev, currentItems: paginate(filtered, prev, state.itemsPerPage) };
    }),
}));
