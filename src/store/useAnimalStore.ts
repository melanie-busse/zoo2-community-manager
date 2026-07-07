import { create } from "zustand";
import { Animal } from "@/types/animal";
import { filterAnimals, sortAnimals, paginate } from "@/utils/AnimalUtil";
import { confirmDeleteDialog, showErrorToast, showSuccessToast } from "@/utils/alerts";
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
  saveAnimal: (formData: any) => Promise<boolean>;

  // 3. Filter-Zustände
  searchTerm: string;
  selectedBiome: string | null;
  selectedShelterLevel: string | null;
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
  resetFilters: () => void;

  // 6. Aktionen für Edit & Delete
  setEditingAnimal: (animal: Animal | null) => void;
  clearEditingAnimal: () => void;
  deleteAnimal: (id: number, t: any) => Promise<boolean>;
}

export const useAnimalStore = create<AnimalState>((set) => {
  const runPipeline = (all: Animal[], state: any) => {
    const filtered = filterAnimals(all, {
      searchTerm: state.searchTerm,
      selectedBiome: state.selectedBiome,
      selectedShelterLevel: state.selectedShelterLevel,
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
        return { currentPage: nextPage, ...runPipeline(state.allAnimals, { ...state, currentPage: nextPage }) };
      }),

    prevPage: () =>
      set((state) => {
        const nextState = { ...state, currentPage: Math.max(1, state.currentPage - 1) };
        return {
          currentPage: Math.max(1, state.currentPage - 1),
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
          sortBy: "name",
          sortDirection: "asc" as const,
          currentPage: 1,
          selectedAnimal: null,
        };
        return { ...clearedState, ...runPipeline(state.allAnimals, clearedState) };
      }),

    // Bearbeiten-Aktionen (direkt im selben Store)
    setEditingAnimal: (animal) => set({ editingAnimal: animal }),
    clearEditingAnimal: () => set({ editingAnimal: null }),

    // Lösch-Aktion
    deleteAnimal: async (id: number, t: any) => {
      const confirmed = await confirmDeleteDialog({
        title: t("Animals.messages.deleteErrorTitle") || "Löschen?",
        text: t("Animals.messages.confirmDelete") || "Möchtest du dieses Tier wirklich löschen?",
        confirmButtonText: t("Common.messages.yes_delete") || "Ja, löschen",
        cancelButtonText: t("Common.messages.cancel") || "Abbrechen",
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

        showSuccessToast(t("Animals.messages.deleteSuccess") || "Erfolgreich gelöscht");
        return true;
      } catch (error: any) {
        console.error("Delete Error:", error);
        showErrorToast(error.message || "Fehler beim Löschen");
        return false;
      }
    },
  };
});
