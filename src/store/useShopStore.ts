import { create } from "zustand";

export interface ShopItem {
  id: number;
  name: string;
  coinsPerClient: number | null;
  regionId: number | null;
  region: { id: number; identifier: string } | null;
  levels: { id: number; level: number; cost: number; currency: string; maxCapacity: number; buildTime: string }[];
}

interface ShopState {
  allShops: ShopItem[];
  currentItems: ShopItem[];
  filteredCount: number;
  currentPage: number;
  itemsPerPage: number;
  searchTerm: string;

  setInitialShops: (shops: ShopItem[]) => void;
  setSearchTerm: (term: string) => void;
  nextPage: () => void;
  prevPage: () => void;
}

function filterShops(shops: ShopItem[], searchTerm: string): ShopItem[] {
  return shops.filter((s) => {
    return !searchTerm || s.name.toLowerCase().includes(searchTerm.toLowerCase());
  });
}

function paginate<T>(items: T[], page: number, perPage: number): T[] {
  return items.slice((page - 1) * perPage, page * perPage);
}

function runPipeline(
  allShops: ShopItem[],
  searchTerm: string,
  currentPage: number,
  itemsPerPage: number,
): Pick<ShopState, "currentItems" | "filteredCount"> {
  const filtered = filterShops(allShops, searchTerm);
  return {
    filteredCount: filtered.length,
    currentItems: paginate(filtered, currentPage, itemsPerPage),
  };
}

export const useShopStore = create<ShopState>((set, get) => ({
  allShops: [],
  currentItems: [],
  filteredCount: 0,
  currentPage: 1,
  itemsPerPage: 20,
  searchTerm: "",

  setInitialShops: (shops) => {
    const { searchTerm, itemsPerPage } = get();
    set({ allShops: shops, currentPage: 1, ...runPipeline(shops, searchTerm, 1, itemsPerPage) });
  },

  setSearchTerm: (term) => {
    const { allShops, itemsPerPage } = get();
    set({ searchTerm: term, currentPage: 1, ...runPipeline(allShops, term, 1, itemsPerPage) });
  },

  nextPage: () => {
    const { currentPage, allShops, searchTerm, itemsPerPage } = get();
    const filtered = filterShops(allShops, searchTerm);
    const maxPage = Math.ceil(filtered.length / itemsPerPage);
    if (currentPage < maxPage) {
      const next = currentPage + 1;
      set({ currentPage: next, currentItems: paginate(filtered, next, itemsPerPage) });
    }
  },

  prevPage: () => {
    const { currentPage, allShops, searchTerm, itemsPerPage } = get();
    if (currentPage > 1) {
      const prev = currentPage - 1;
      const filtered = filterShops(allShops, searchTerm);
      set({ currentPage: prev, currentItems: paginate(filtered, prev, itemsPerPage) });
    }
  },
}));
