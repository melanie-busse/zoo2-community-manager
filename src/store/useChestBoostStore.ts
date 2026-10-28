import { create } from "zustand";
import type { ChestBoostListItem, ChestBoostCreateInput, ChestType } from "@/types/chestBoost";
import {
  filterChestBoosts,
  sortChestBoosts,
  paginateChestBoosts,
} from "@/utils/ChestBoostUtil";
import { confirmDeleteDialog, showErrorToast, showSuccessToast } from "@/utils/alerts";
import {
  createChestBoostOnClient,
  updateChestBoostOnClient,
  deleteChestBoostOnClient,
} from "@/service/frontend/ChestBoost";

interface ChestBoostState {
  // 1. Listen-Zustände
  allBoosts: ChestBoostListItem[];
  currentItems: ChestBoostListItem[];
  filteredCount: number;

  // 2. Filter-Zustände
  searchTerm: string;
  selectedChestType: ChestType | null;
  selectedYear: number | null;
  currentPage: number;
  itemsPerPage: number;

  // 3. Aktionen Übersicht & Filter
  setInitialBoosts: (boosts: ChestBoostListItem[]) => void;
  setSearchTerm: (term: string) => void;
  setSelectedChestType: (type: ChestType | null) => void;
  setSelectedYear: (year: number | null) => void;
  resetFilters: () => void;
  nextPage: () => void;
  prevPage: () => void;
  setPage: (page: number) => void;

  // 4. CRUD
  saveBoost: (
    data: ChestBoostCreateInput,
    id?: number,
  ) => Promise<number | false | { error: string; message: string }>;
  deleteBoost: (id: number, t: any, tCommon: any) => Promise<boolean>;
}

const runPipeline = (
  all: ChestBoostListItem[],
  state: Pick<
    ChestBoostState,
    "searchTerm" | "selectedChestType" | "selectedYear" | "currentPage" | "itemsPerPage"
  >,
) => {
  const filtered = filterChestBoosts(all, {
    searchTerm: state.searchTerm,
    selectedChestType: state.selectedChestType,
    selectedYear: state.selectedYear,
  });
  const sorted = sortChestBoosts(filtered);
  const paginated = paginateChestBoosts(sorted, state.currentPage, state.itemsPerPage);

  return {
    currentItems: paginated,
    filteredCount: filtered.length,
  };
};

export const useChestBoostStore = create<ChestBoostState>((set, get) => ({
  allBoosts: [],
  currentItems: [],
  filteredCount: 0,

  searchTerm: "",
  selectedChestType: null,
  selectedYear: null,
  currentPage: 1,
  itemsPerPage: 20,

  setInitialBoosts: (boosts) =>
    set((state) => ({
      allBoosts: boosts,
      currentPage: 1,
      ...runPipeline(boosts, { ...state, currentPage: 1 }),
    })),

  setSearchTerm: (term) =>
    set((state) => {
      const next = { ...state, searchTerm: term, currentPage: 1 };
      return { searchTerm: term, currentPage: 1, ...runPipeline(state.allBoosts, next) };
    }),

  setSelectedChestType: (type) =>
    set((state) => {
      const next = { ...state, selectedChestType: type, currentPage: 1 };
      return { selectedChestType: type, currentPage: 1, ...runPipeline(state.allBoosts, next) };
    }),

  setSelectedYear: (year) =>
    set((state) => {
      const next = { ...state, selectedYear: year, currentPage: 1 };
      return { selectedYear: year, currentPage: 1, ...runPipeline(state.allBoosts, next) };
    }),

  resetFilters: () =>
    set((state) => {
      const cleared = {
        ...state,
        searchTerm: "",
        selectedChestType: null as ChestType | null,
        selectedYear: null as number | null,
        currentPage: 1,
      };
      return { ...cleared, ...runPipeline(state.allBoosts, cleared) };
    }),

  nextPage: () =>
    set((state) => {
      const nextPage = state.currentPage + 1;
      return {
        currentPage: nextPage,
        ...runPipeline(state.allBoosts, { ...state, currentPage: nextPage }),
      };
    }),

  prevPage: () =>
    set((state) => {
      const nextPage = Math.max(1, state.currentPage - 1);
      return {
        currentPage: nextPage,
        ...runPipeline(state.allBoosts, { ...state, currentPage: nextPage }),
      };
    }),

  setPage: (page) =>
    set((state) => ({
      currentPage: page,
      ...runPipeline(state.allBoosts, { ...state, currentPage: page }),
    })),

  saveBoost: async (data, id) => {
    try {
      let result: any;
      if (id !== undefined) {
        result = await updateChestBoostOnClient(id, data);
      } else {
        result = await createChestBoostOnClient(data);
      }

      // Refetch to get fresh data with animal relations
      const response = await fetch("/api/chest-boosts?locale=de");
      if (response.ok) {
        const fresh = await response.json();
        set((state) => ({
          allBoosts: fresh,
          ...runPipeline(fresh, state),
        }));
      }

      return result.id as number;
    } catch (error: any) {
      console.error("ChestBoost save error:", error);
      const responseData = error?.data;
      if (error?.status === 403 || responseData?.error === "MayorReadonly") {
        return { error: "MayorReadonly", message: responseData?.message || "Read-only mode." };
      }
      showErrorToast(error.message || "Fehler beim Speichern");
      return false;
    }
  },

  deleteBoost: async (id, t, tCommon) => {
    const confirmed = await confirmDeleteDialog({
      title: t("delete_confirm"),
      text: t("delete_confirm"),
      confirmButtonText: tCommon("messages.yes_delete"),
      cancelButtonText: tCommon("messages.cancel"),
    });

    if (!confirmed) return false;

    try {
      await deleteChestBoostOnClient(id);

      set((state) => {
        const updated = state.allBoosts.filter((b) => b.id !== id);
        const totalPages = Math.ceil(
          filterChestBoosts(updated, {
            searchTerm: state.searchTerm,
            selectedChestType: state.selectedChestType,
            selectedYear: state.selectedYear,
          }).length / state.itemsPerPage,
        );
        const nextPage =
          state.currentPage > totalPages ? Math.max(1, totalPages) : state.currentPage;
        return {
          allBoosts: updated,
          currentPage: nextPage,
          ...runPipeline(updated, { ...state, currentPage: nextPage }),
        };
      });

      showSuccessToast(t("delete_success") || "Erfolgreich gelöscht");
      return true;
    } catch (error: any) {
      console.error("ChestBoost delete error:", error);
      const responseData = error?.data;
      if (error?.status === 403 || responseData?.error === "MayorReadonly") {
        showErrorToast(responseData?.message || "Read-only mode.");
        return false;
      }
      showErrorToast(error.message || "Fehler beim Löschen");
      return false;
    }
  },
}));
