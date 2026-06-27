import { create } from "zustand";
import { SpecialCoat } from "@/types/specialCoat";

// Definition der Filter-Typen
export type InventoryStatusFilter = "all" | "missing_partner" | "ready" | "not_owned";

interface SpecialCoatState {
  // Daten-Arrays
  allInitalItems: SpecialCoat[];
  currentItems: SpecialCoat[];
  filteredItems: SpecialCoat[];

  // Aktive Filter-Werte
  searchQuery: string;
  selectedBiomeId: number | null;
  selectedShelterLevel: number | null;
  inventoryStatus: InventoryStatusFilter;

  // Sortierung
  sortBy: string;
  sortDirection: "asc" | "desc";

  // Pagination
  currentPage: number;
  itemsPerPage: number;

  selectedSpecialCoat: SpecialCoat | null;

  // Aktionen
  setInitialSpecialCoats: (coats: SpecialCoat[]) => void;
  setSelectedSpecialCoat: (coat: SpecialCoat | null) => void;
  toggleSort: (columnKey: string) => void;
  setPage: (page: number) => void;
  nextPage: () => void;
  prevPage: () => void;

  // Filter-Setter
  setSearchQuery: (query: string) => void;
  setBiomeFilter: (biomeId: number | null) => void;
  setShelterLevelFilter: (level: number | null) => void;
  setInventoryStatusFilter: (status: InventoryStatusFilter) => void;

  applyFiltersAndSorting: (passedCoats?: SpecialCoat[]) => void;
}

export const useSpecialCoatStore = create<SpecialCoatState>((set, get) => ({
  allInitalItems: [],
  currentItems: [],
  filteredItems: [],

  // Filter-Standards
  searchQuery: "",
  selectedBiomeId: null,
  selectedShelterLevel: null,
  inventoryStatus: "all",

  sortBy: "animalName",
  sortDirection: "asc",

  currentPage: 1,
  itemsPerPage: 12,
  selectedSpecialCoat: null,

  setInitialSpecialCoats: (coats) => {
    set({
      allInitalItems: coats,
      currentPage: 1,
    });

    get().applyFiltersAndSorting(coats);
  },

  setSelectedSpecialCoat: (coat) => set({ selectedSpecialCoat: coat }),

  setSearchQuery: (query) => {
    set({ searchQuery: query, currentPage: 1 });
    get().applyFiltersAndSorting();
  },
  setBiomeFilter: (biomeId) => {
    set({ selectedBiomeId: biomeId, currentPage: 1 });
    get().applyFiltersAndSorting();
  },
  setShelterLevelFilter: (level) => {
    set({ selectedShelterLevel: level, currentPage: 1 });
    get().applyFiltersAndSorting();
  },
  setInventoryStatusFilter: (status) => {
    set({ inventoryStatus: status, currentPage: 1 });
    get().applyFiltersAndSorting();
  },

  toggleSort: (columnKey) => {
    set((state) => {
      const isSameColumn = state.sortBy === columnKey;
      const nextDirection = isSameColumn && state.sortDirection === "asc" ? "desc" : "asc";
      return { sortBy: columnKey, sortDirection: nextDirection, currentPage: 1 };
    });
    get().applyFiltersAndSorting();
  },

  setPage: (page) => {
    set({ currentPage: page });
    const { filteredItems, itemsPerPage } = get();
    const startIndex = (page - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    set({ currentItems: filteredItems.slice(startIndex, endIndex) });
  },

  nextPage: () => {
    const { currentPage, filteredItems, itemsPerPage } = get();
    const totalPages = Math.ceil(filteredItems.length / itemsPerPage);

    if (currentPage < totalPages) {
      get().setPage(currentPage + 1);
    }
  },

  prevPage: () => {
    const { currentPage } = get();
    if (currentPage > 1) {
      get().setPage(currentPage - 1);
    }
  },

  applyFiltersAndSorting: (passedCoats?: SpecialCoat[]) => {
    const {
      allInitalItems,
      searchQuery,
      selectedBiomeId,
      selectedShelterLevel,
      inventoryStatus,
      sortBy,
      sortDirection,
      currentPage,
      itemsPerPage,
    } = get();

    const itemsToFilter = passedCoats || allInitalItems;

    let result = itemsToFilter.filter((coat) => {
      const animal = coat.animal;

      // Filter A: Name (Sucht im Farbnamen, Variantennamen UND im Tiernamen)
      if (searchQuery.trim() !== "") {
        const query = searchQuery.toLowerCase();
        const coatColor = coat.specialcoatstext?.[0]?.color?.toLowerCase() ?? "";
        const coatName = coat.specialcoatstext?.[0]?.name?.toLowerCase() ?? "";
        const animalTextName = animal?.animaltext?.[0]?.animalName?.toLowerCase() ?? "";

        const matchesName =
          coatColor.includes(query) || coatName.includes(query) || animalTextName.includes(query);

        if (!matchesName) return false;
      }

      // Filter B: Biome / Gehege
      if (selectedBiomeId !== null && animal?.biome?.id !== selectedBiomeId) {
        return false;
      }

      // Filter C: Stalllevel
      const actualShelterLevel = animal?.shelterLevel;
      if (selectedShelterLevel !== null && actualShelterLevel !== selectedShelterLevel) {
        return false;
      }

      // Filter D: Inventar-Status / Ampelsystem 🚦
      const amount = coat.ownedAmount ?? 0;
      if (inventoryStatus === "missing_partner" && amount !== 1) return false;
      if (inventoryStatus === "ready" && amount < 2) return false;
      if (inventoryStatus === "not_owned" && amount !== 0) return false;

      return true;
    });

    // 2. Sortierung anwenden
    result.sort((a, b) => {
      let valueA: any = "";
      let valueB: any = "";

      if (sortBy === "animalName") {
        valueA = a.animal?.animaltext?.[0]?.animalName ?? "";
        valueB = b.animal?.animaltext?.[0]?.animalName ?? "";
      } else if (sortBy === "coatName") {
        // 💡 Gefixt: Eigener Key passend zur DesktopTable
        valueA = a.specialcoatstext?.[0]?.name ?? "";
        valueB = b.specialcoatstext?.[0]?.name ?? "";
      } else if (sortBy === "color") {
        valueA = a.specialcoatstext?.[0]?.color ?? "";
        valueB = b.specialcoatstext?.[0]?.color ?? "";
      } else if (sortBy === "biomeName") {
        valueA = a.animal?.biome?.identifier ?? "";
        valueB = b.animal?.biome?.identifier ?? "";
      } else if (sortBy === "price") {
        valueA = a.animal?.price ?? 0;
        valueB = b.animal?.price ?? 0;
      } else if (sortBy === "sellingPrice") {
        valueA = a.animal?.sellingPrice ?? 0;
        valueB = b.animal?.sellingPrice ?? 0;
      } else if (sortBy === "shelterLevel") {
        valueA = a.animal?.shelterLevel ?? 0;
        valueB = b.animal?.shelterLevel ?? 0;
      } else if (sortBy === "releaseDate") {
        valueA = new Date(a.releaseDate).getTime();
        valueB = new Date(b.releaseDate).getTime();
      }

      if (valueA < valueB) return sortDirection === "asc" ? -1 : 1;
      if (valueA > valueB) return sortDirection === "asc" ? 1 : -1;
      return 0;
    });

    // 3. Pagination berechnen
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    const paginatedItems = result.slice(startIndex, endIndex);

    set({
      filteredItems: result,
      currentItems: paginatedItems,
    });
  },
}));
