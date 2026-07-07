import { create } from "zustand";
import { SpecialCoat } from "@/types/specialCoat";
import { filterSpecialCoats, sortSpecialCoats, paginate } from "@/utils/SpecialCoatUtil";
import { confirmDeleteDialog, showErrorToast, showSuccessToast } from "@/utils/alerts";
import {
  createSpecialCoatOnClient,
  deleteSpecialCoatOnClient,
  updateSpecialCoatOnClient,
} from "@/service/frontend/SpecialCoat";

export type InventoryStatusFilter = "all" | "missing_partner" | "ready" | "not_owned";

interface SpecialCoatState {
  // 1. Listen-Zustände
  allSpecialCoats: SpecialCoat[];
  currentItems: SpecialCoat[];
  filteredCount: number;

  // 2. Bearbeitungs-Zustand
  editingSpecialCoat: SpecialCoat | null;
  saveSpecialCoat: (formData: any) => Promise<boolean>;

  // 3. Filter-Zustände
  searchTerm: string;
  selectedBiome: string | null;
  selectedShelterLevel: number | null;
  inventoryStatus: InventoryStatusFilter;
  sortBy: string;
  sortDirection: "asc" | "desc";
  currentPage: number;
  itemsPerPage: number;
  selectedSpecialCoat: SpecialCoat | null;

  // 4. Aktionen für die Übersicht & Filter
  setInitialSpecialCoats: (coats: SpecialCoat[]) => void;
  setSelectedSpecialCoat: (coat: SpecialCoat | null) => void;
  toggleSort: (key: string) => void;
  nextPage: () => void;
  prevPage: () => void;
  setPage: (page: number) => void;

  // 5. Filter-Setter
  setSearchTerm: (term: string) => void;
  setSelectedBiome: (biome: string | null) => void;
  setSelectedShelterLevel: (level: number | null) => void;
  setInventoryStatusFilter: (status: InventoryStatusFilter) => void;
  resetFilters: () => void;

  // 6. Aktionen für Edit & Delete
  setEditingSpecialCoat: (coat: SpecialCoat | null) => void;
  clearEditingSpecialCoat: () => void;
  deleteSpecialCoat: (id: number, t: any) => Promise<boolean>;
}

export const useSpecialCoatStore = create<SpecialCoatState>((set, get) => {
  const runPipeline = (all: SpecialCoat[], state: any) => {
    const filtered = filterSpecialCoats(all, {
      searchTerm: state.searchTerm,
      selectedBiome: state.selectedBiome,
      selectedShelterLevel: state.selectedShelterLevel,
      inventoryStatus: state.inventoryStatus,
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
    allSpecialCoats: [],
    currentItems: [],
    filteredCount: 0,

    editingSpecialCoat: null,

    searchTerm: "",
    selectedBiome: null,
    selectedShelterLevel: null,
    inventoryStatus: "all",
    sortBy: "coatName",
    sortDirection: "asc",
    currentPage: 1,
    itemsPerPage: 12,
    selectedSpecialCoat: null,

    setInitialSpecialCoats: (coats) =>
      set((state) => {
        return {
          allSpecialCoats: coats,
          currentPage: 1,
          ...runPipeline(coats, { ...state, currentPage: 1 }),
        };
      }),

    setSelectedSpecialCoat: (coat) => set({ selectedSpecialCoat: coat }),

    saveSpecialCoat: async (formData) => {
      const isEdit = !!formData.id;
      let result: any;

      try {
        if (isEdit) {
          result = await updateSpecialCoatOnClient(formData.id, formData);
        } else {
          result = await createSpecialCoatOnClient(formData);
        }

        set((state) => {
          let updatedAll = [...state.allSpecialCoats];
          if (isEdit) {
            updatedAll = updatedAll.map((c) => (c.id === result.id ? result : c));
          } else {
            updatedAll.push(result);
          }
          return {
            allSpecialCoats: updatedAll,
            editingSpecialCoat: null,
            ...runPipeline(updatedAll, state),
          };
        });

        return true;
      } catch (error: any) {
        console.error("Fetch Error:", error);
        showErrorToast(error.message || "Netzwerkfehler beim Speichern.");
        return false;
      }
    },

    setSearchTerm: (term) =>
      set((state) => {
        const nextState = { ...state, searchTerm: term, currentPage: 1 };
        return {
          searchTerm: term,
          currentPage: 1,
          ...runPipeline(state.allSpecialCoats, nextState),
        };
      }),

    setSelectedBiome: (biome) =>
      set((state) => {
        const nextState = { ...state, selectedBiome: biome, currentPage: 1 };
        return {
          selectedBiome: biome,
          currentPage: 1,
          ...runPipeline(state.allSpecialCoats, nextState),
        };
      }),

    setSelectedShelterLevel: (level) =>
      set((state) => {
        const nextState = { ...state, selectedShelterLevel: level, currentPage: 1 };
        return {
          selectedShelterLevel: level,
          currentPage: 1,
          ...runPipeline(state.allSpecialCoats, nextState),
        };
      }),

    setInventoryStatusFilter: (status) =>
      set((state) => {
        const nextState = { ...state, inventoryStatus: status, currentPage: 1 };
        return {
          inventoryStatus: status,
          currentPage: 1,
          ...runPipeline(state.allSpecialCoats, nextState),
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
          ...runPipeline(state.allSpecialCoats, nextState),
        };
      }),

    setPage: (page) =>
      set((state) => {
        const nextState = { ...state, currentPage: page };
        return { currentPage: page, ...runPipeline(state.allSpecialCoats, nextState) };
      }),

    nextPage: () =>
      set((state) => {
        const totalPages = Math.ceil(state.filteredCount / state.itemsPerPage);
        if (state.currentPage >= totalPages) return {};
        const nextPage = state.currentPage + 1;
        return {
          currentPage: nextPage,
          ...runPipeline(state.allSpecialCoats, { ...state, currentPage: nextPage }),
        };
      }),

    prevPage: () =>
      set((state) => {
        if (state.currentPage <= 1) return {};
        const prevPage = state.currentPage - 1;
        return {
          currentPage: prevPage,
          ...runPipeline(state.allSpecialCoats, { ...state, currentPage: prevPage }),
        };
      }),

    resetFilters: () =>
      set((state) => {
        const clearedState = {
          ...state,
          searchTerm: "",
          selectedBiome: null,
          selectedShelterLevel: null,
          inventoryStatus: "all" as const,
          sortBy: "coatName",
          sortDirection: "asc" as const,
          currentPage: 1,
          selectedSpecialCoat: null,
        };
        return { ...clearedState, ...runPipeline(state.allSpecialCoats, clearedState) };
      }),

    setEditingSpecialCoat: (coat) => set({ editingSpecialCoat: coat }),
    clearEditingSpecialCoat: () => set({ editingSpecialCoat: null }),

    deleteSpecialCoat: async (id: number, t: any) => {
      const confirmed = await confirmDeleteDialog({
        title: t("SpecialCoat.messages.deleteErrorTitle") || "Löschen?",
        text:
          t("SpecialCoat.messages.confirmDelete") || "Möchtest du diese Variante wirklich löschen?",
        confirmButtonText: t("Common.messages.yes_delete") || "Ja, löschen",
        cancelButtonText: t("Common.messages.cancel") || "Abbrechen",
      });

      if (!confirmed) return false;

      try {
        await deleteSpecialCoatOnClient(id);

        set((state) => {
          const updated = state.allSpecialCoats.filter((c) => c.id !== id);
          const nextSelected =
            state.selectedSpecialCoat?.id === id ? null : state.selectedSpecialCoat;

          const filtered = filterSpecialCoats(updated, {
            searchTerm: state.searchTerm,
            selectedBiome: state.selectedBiome,
            selectedShelterLevel: state.selectedShelterLevel,
            inventoryStatus: state.inventoryStatus,
          });

          const totalPages = Math.ceil(filtered.length / state.itemsPerPage);
          const nextPage =
            state.currentPage > totalPages ? Math.max(1, totalPages) : state.currentPage;

          const nextState = { ...state, currentPage: nextPage };

          return {
            allSpecialCoats: updated,
            selectedSpecialCoat: nextSelected,
            currentPage: nextPage,
            ...runPipeline(updated, nextState),
          };
        });

        showSuccessToast(t("SpecialCoat.messages.deleteSuccess") || "Erfolgreich gelöscht");
        return true;
      } catch (error: any) {
        console.error("Delete Error:", error);
        showErrorToast(error.message || "Fehler beim Löschen");
        return false;
      }
    },
  };
});
