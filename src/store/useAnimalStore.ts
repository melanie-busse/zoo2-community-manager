import { create } from "zustand";
import { Animal } from "@/types/animal";
import { filterAnimals, sortAnimals, paginate } from "@/utils/AnimalUtil";
import { confirmDeleteDialog, showErrorToast, showSuccessToast } from "@/utils/alerts";
import { toast } from "react-toastify";
import {
  createAnimalOnClient,
  deleteAnimalOnClient,
  updateAnimalOnClient,
} from "@/service/frontend/Animal";

interface AnimalState {
  // 1. Listen-Zustände
  allAnimals: Animal[];
  currentItems: Animal[];
  filteredCount: number;

  // 2. Bearbeitungs-Zustand
  editingAnimal: Animal | null;
  saveAnimal: (formData: any) => Promise<number | false | { error: string; message: string }>;

  // 3. Filter-Zustände
  searchTerm: string;
  selectedBiome: string | null;
  selectedShelterLevel: string | null;
  hasStatueFilter: boolean;
  filterRegionId: number | null;
  filterLevel10: boolean;
  filterLevel20: boolean;
  filterGlitter: boolean;
  sortBy: string;
  sortDirection: "asc" | "desc";
  currentPage: number;
  itemsPerPage: number;
  selectedAnimal: Animal | null;

  // 4. Aktionen für die Übersicht & Filter
  setInitialAnimals: (animals: Animal[]) => void;
  setSelectedAnimal: (animal: Animal) => void;
  toggleSort: (key: string) => void;
  nextPage: () => void;
  prevPage: () => void;
  setPage: (page: number) => void;

  // 5.Filter-Setter
  setSearchTerm: (term: string) => void;
  setSelectedBiome: (biome: string | null) => void;
  setSelectedShelterLevel: (level: string | null) => void;
  setHasStatueFilter: (value: boolean) => void;
  setFilterRegionId: (id: number | null) => void;
  setFilterLevel10: (value: boolean) => void;
  setFilterLevel20: (value: boolean) => void;
  setFilterGlitter: (value: boolean) => void;
  resetFilters: () => void;

  // 6. Aktionen für Edit & Delete
  setEditingAnimal: (animal: Animal | null) => void;
  clearEditingAnimal: () => void;
  deleteAnimal: (id: number, t: any, tCommon: any) => Promise<boolean>;
}

export const useAnimalStore = create<AnimalState>((set) => {
  const runPipeline = (all: Animal[], state: any) => {
    const filtered = filterAnimals(all, {
      searchTerm: state.searchTerm,
      selectedBiome: state.selectedBiome,
      selectedShelterLevel: state.selectedShelterLevel,
      hasStatueFilter: state.hasStatueFilter,
      filterRegionId: state.filterRegionId,
      filterLevel10: state.filterLevel10,
      filterLevel20: state.filterLevel20,
      filterGlitter: state.filterGlitter,
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
    allAnimals: [],
    currentItems: [],
    filteredCount: 0,
    searchTerm: "",
    selectedBiome: null,
    selectedShelterLevel: null,
    hasStatueFilter: false,
    filterRegionId: null,
    filterLevel10: false,
    filterLevel20: false,
    filterGlitter: false,
    sortBy: "name",
    sortDirection: "asc",
    currentPage: 1,
    itemsPerPage: 12,
    selectedAnimal: null,

    editingAnimal: null,

    setInitialAnimals: (animals) =>
      set((state) => {
        const all = animals as unknown as Animal[];
        return {
          allAnimals: all,
          currentPage: 1,
          ...runPipeline(all, state),
        };
      }),

    setSelectedAnimal: (animal) => set({ selectedAnimal: animal }),

    saveAnimal: async (formData) => {
      const isEdit = !!formData.id;
      let result: any;

      try {
        if (isEdit) {
          result = await updateAnimalOnClient(formData.id, formData);
        } else {
          result = await createAnimalOnClient(formData);
        }

        set((state) => {
          let updatedAll = [...state.allAnimals];
          if (isEdit) {
            updatedAll = updatedAll.map((a) => (a.id === result.id ? result : a));
          } else {
            updatedAll.push(result);
          }
          return {
            allAnimals: updatedAll,
            editingAnimal: null,
            ...runPipeline(updatedAll, state),
          };
        });

        return result.id as number;
      } catch (error: any) {
        console.error("Fetch Error:", error);

        // Mayor-Schutz beim Speichern/Bearbeiten abfangen
        const responseData = error?.response?.data || error?.data;
        if (error?.status === 403 || responseData?.error === "MayorReadonly") {
          return {
            error: "MayorReadonly",
            message: responseData?.message || "Read-only mode for Mayor.",
          };
        }

        showErrorToast(error.message || "Fehler beim Speichern");
        return false;
      }
    },

    setSearchTerm: (term) =>
      set((state) => {
        const nextState = { ...state, searchTerm: term, currentPage: 1 };
        return { searchTerm: term, currentPage: 1, ...runPipeline(state.allAnimals, nextState) };
      }),

    setSelectedBiome: (biome) =>
      set((state) => {
        const nextState = { ...state, selectedBiome: biome, currentPage: 1 };
        return {
          selectedBiome: biome,
          currentPage: 1,
          ...runPipeline(state.allAnimals, nextState),
        };
      }),

    setSelectedShelterLevel: (level) =>
      set((state) => {
        const nextState = { ...state, selectedShelterLevel: level, currentPage: 1 };
        return {
          selectedShelterLevel: level,
          currentPage: 1,
          ...runPipeline(state.allAnimals, nextState),
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
          ...runPipeline(state.allAnimals, nextState),
        };
      }),

    setPage: (page) =>
      set((state) => {
        const nextState = { ...state, currentPage: page };
        return { currentPage: page, ...runPipeline(state.allAnimals, nextState) };
      }),

    nextPage: () =>
      set((state) => {
        const totalPages = Math.ceil(state.filteredCount / state.itemsPerPage);
        if (state.currentPage >= totalPages) return {};
        const nextPage = state.currentPage + 1;
        return {
          currentPage: nextPage,
          ...runPipeline(state.allAnimals, { ...state, currentPage: nextPage }),
        };
      }),

    prevPage: () =>
      set((state) => {
        const nextState = { ...state, currentPage: Math.max(1, state.currentPage - 1) };
        return {
          currentPage: Math.max(1, state.currentPage - 1),
          ...runPipeline(state.allAnimals, nextState),
        };
      }),

    setHasStatueFilter: (value) =>
      set((state) => {
        const nextState = { ...state, hasStatueFilter: value, currentPage: 1 };
        return {
          hasStatueFilter: value,
          currentPage: 1,
          ...runPipeline(state.allAnimals, nextState),
        };
      }),

    setFilterRegionId: (id) =>
      set((state) => {
        const nextState = { ...state, filterRegionId: id, currentPage: 1 };
        return { filterRegionId: id, currentPage: 1, ...runPipeline(state.allAnimals, nextState) };
      }),

    setFilterLevel10: (value) =>
      set((state) => {
        const nextState = { ...state, filterLevel10: value, currentPage: 1 };
        return {
          filterLevel10: value,
          currentPage: 1,
          ...runPipeline(state.allAnimals, nextState),
        };
      }),

    setFilterLevel20: (value) =>
      set((state) => {
        const nextState = { ...state, filterLevel20: value, currentPage: 1 };
        return {
          filterLevel20: value,
          currentPage: 1,
          ...runPipeline(state.allAnimals, nextState),
        };
      }),

    setFilterGlitter: (value) =>
      set((state) => {
        const nextState = { ...state, filterGlitter: value, currentPage: 1 };
        return {
          filterGlitter: value,
          currentPage: 1,
          ...runPipeline(state.allAnimals, nextState),
        };
      }),

    resetFilters: () =>
      set((state) => {
        const clearedState = {
          ...state,
          searchTerm: "",
          selectedBiome: null,
          selectedShelterLevel: null,
          hasStatueFilter: false,
          filterRegionId: null,
          filterLevel10: false,
          filterLevel20: false,
          filterGlitter: false,
          sortBy: "name",
          sortDirection: "asc" as const,
          currentPage: 1,
          selectedAnimal: null,
        };
        return { ...clearedState, ...runPipeline(state.allAnimals, clearedState) };
      }),

    setEditingAnimal: (animal) => set({ editingAnimal: animal }),
    clearEditingAnimal: () => set({ editingAnimal: null }),

    deleteAnimal: async (id: number, t: any, tCommon: any) => {
      const confirmed = await confirmDeleteDialog({
        title: t("messages.deleteErrorTitle"),
        text: t("messages.confirmDelete"),
        confirmButtonText: tCommon("messages.yes_delete"),
        cancelButtonText: tCommon("messages.cancel"),
      });

      if (!confirmed) return false;

      try {
        await deleteAnimalOnClient(id);

        set((state) => {
          const updated = state.allAnimals.filter((a) => a.id !== id);
          const nextSelected = state.selectedAnimal?.id === id ? null : state.selectedAnimal;

          const filtered = filterAnimals(updated, {
            searchTerm: state.searchTerm,
            selectedBiome: state.selectedBiome,
            selectedShelterLevel: state.selectedShelterLevel,
            hasStatueFilter: state.hasStatueFilter,
          });

          const totalPages = Math.ceil(filtered.length / state.itemsPerPage);
          const nextPage =
            state.currentPage > totalPages ? Math.max(1, totalPages) : state.currentPage;

          const nextState = { ...state, currentPage: nextPage };

          return {
            allAnimals: updated,
            selectedAnimal: nextSelected,
            currentPage: nextPage,
            ...runPipeline(updated, nextState),
          };
        });

        showSuccessToast(t("messages.deleteSuccess"));
        return true;
      } catch (error: any) {
        console.error("Delete Error:", error);

        // Mayor-Schutz beim Löschen abfangen
        const responseData = error?.response?.data || error?.data;
        if (error?.status === 403 || responseData?.error === "MayorReadonly") {
          toast.info(responseData?.message || t("messages.mayorReadonlyNotice"));
          return false;
        }

        showErrorToast(error.message);
        return false;
      }
    },
  };
});
