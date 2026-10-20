import { create } from "zustand";

export interface ShopItem {
  id: number;
  name: string;
  identifier: string;
  coinsPerClient: number | null;
  regionId: number | null;
  region: { id: number; identifier: string; regionTexts: { name: string }[] } | null;
  levels: { id: number; level: number; cost: number; currency: string; maxCapacity: number; buildTime: string }[];
  texts: { name: string }[];
}

interface ShopState {
  allShops: ShopItem[];
  currentItems: ShopItem[];
  filteredCount: number;
  currentPage: number;
  itemsPerPage: number;
  searchTerm: string;
  selectedRegionId: number | null;
  sortBy: string | null;
  sortDirection: "asc" | "desc";

  setInitialShops: (shops: ShopItem[]) => void;
  setSearchTerm: (term: string) => void;
  setSelectedRegionId: (id: number | null) => void;
  toggleSort: (key: string) => void;
  nextPage: () => void;
  prevPage: () => void;
}

function filterShops(shops: ShopItem[], searchTerm: string, selectedRegionId: number | null): ShopItem[] {
  return shops.filter((s) => {
    const matchesSearch = !searchTerm || s.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRegion = selectedRegionId === null ? true : s.region?.id === selectedRegionId;
    return matchesSearch && matchesRegion;
  });
}

function sortShops(shops: ShopItem[], sortBy: string | null, sortDirection: "asc" | "desc"): ShopItem[] {
  if (!sortBy) return shops;
  return [...shops].sort((a, b) => {
    let valA: string;
    let valB: string;
    if (sortBy === "region") {
      valA = (a.region?.regionTexts?.[0]?.name ?? a.region?.identifier ?? "").toLowerCase();
      valB = (b.region?.regionTexts?.[0]?.name ?? b.region?.identifier ?? "").toLowerCase();
    } else {
      valA = (a.texts?.[0]?.name ?? a.name).toLowerCase();
      valB = (b.texts?.[0]?.name ?? b.name).toLowerCase();
    }
    const cmp = valA.localeCompare(valB);
    return sortDirection === "asc" ? cmp : -cmp;
  });
}

function paginate<T>(items: T[], page: number, perPage: number): T[] {
  return items.slice((page - 1) * perPage, page * perPage);
}

function runPipeline(
  allShops: ShopItem[],
  searchTerm: string,
  selectedRegionId: number | null,
  sortBy: string | null,
  sortDirection: "asc" | "desc",
  currentPage: number,
  itemsPerPage: number,
): Pick<ShopState, "currentItems" | "filteredCount"> {
  const filtered = filterShops(allShops, searchTerm, selectedRegionId);
  const sorted = sortShops(filtered, sortBy, sortDirection);
  return {
    filteredCount: filtered.length,
    currentItems: paginate(sorted, currentPage, itemsPerPage),
  };
}

export const useShopStore = create<ShopState>((set, get) => ({
  allShops: [],
  currentItems: [],
  filteredCount: 0,
  currentPage: 1,
  itemsPerPage: 20,
  searchTerm: "",
  selectedRegionId: null,
  sortBy: "name",
  sortDirection: "asc",

  setInitialShops: (shops) => {
    const { searchTerm, selectedRegionId, sortBy, sortDirection, itemsPerPage } = get();
    set({ allShops: shops, currentPage: 1, ...runPipeline(shops, searchTerm, selectedRegionId, sortBy, sortDirection, 1, itemsPerPage) });
  },

  setSearchTerm: (term) => {
    const { allShops, selectedRegionId, sortBy, sortDirection, itemsPerPage } = get();
    set({ searchTerm: term, currentPage: 1, ...runPipeline(allShops, term, selectedRegionId, sortBy, sortDirection, 1, itemsPerPage) });
  },

  setSelectedRegionId: (id) => {
    const { allShops, searchTerm, sortBy, sortDirection, itemsPerPage } = get();
    set({ selectedRegionId: id, currentPage: 1, ...runPipeline(allShops, searchTerm, id, sortBy, sortDirection, 1, itemsPerPage) });
  },

  toggleSort: (key) => {
    const { allShops, searchTerm, selectedRegionId, sortBy, sortDirection, itemsPerPage } = get();
    const newDirection = sortBy === key && sortDirection === "asc" ? "desc" : "asc";
    set({ sortBy: key, sortDirection: newDirection, currentPage: 1, ...runPipeline(allShops, searchTerm, selectedRegionId, key, newDirection, 1, itemsPerPage) });
  },

  nextPage: () => {
    const { currentPage, allShops, searchTerm, selectedRegionId, sortBy, sortDirection, itemsPerPage } = get();
    const filtered = filterShops(allShops, searchTerm, selectedRegionId);
    const maxPage = Math.ceil(filtered.length / itemsPerPage);
    if (currentPage < maxPage) {
      const next = currentPage + 1;
      set({ currentPage: next, currentItems: paginate(sortShops(filtered, sortBy, sortDirection), next, itemsPerPage) });
    }
  },

  prevPage: () => {
    const { currentPage, allShops, searchTerm, selectedRegionId, sortBy, sortDirection, itemsPerPage } = get();
    if (currentPage > 1) {
      const prev = currentPage - 1;
      const filtered = filterShops(allShops, searchTerm, selectedRegionId);
      set({ currentPage: prev, currentItems: paginate(sortShops(filtered, sortBy, sortDirection), prev, itemsPerPage) });
    }
  },
}));
