import { create } from "zustand";
import { Animal } from "@/types/animal";
import { filterAnimals, sortAnimals, paginate } from "@/utils/AnimalUtil";
import Swal from "sweetalert2";
import { toast } from "react-toastify";

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
  selectedBiome: string;
  selectedLevel: string;
  sortBy: string;
  sortDirection: "asc" | "desc";
  currentPage: number;
  itemsPerPage: number;
  selectedAnimal: Animal | null;

  // 4. Aktionen für die Übersicht & Filter
  setInitialAnimals: (animals: any[]) => void;
  setSelectedAnimal: (animal: Animal) => void;
  toggleSort: (key: string) => void;
  nextPage: () => void;
  prevPage: () => void;

  // 5.Filter-Setter
  setSearchTerm: (term: string) => void;
  setSelectedBiome: (gehege: string) => void;
  setSelectedLevel: (level: string) => void;
  resetFilters: () => void;

  // 5. Aktionen für Edit & Delete
  setEditingAnimal: (animal: Animal) => void;
  clearEditingAnimal: () => void;
  deleteAnimal: (id: number, t: any) => Promise<boolean>;
}

export const useAnimalStore = create<AnimalState>((set, get) => {
  const runPipeline = (all: Animal[], state: any) => {
    const filtered = filterAnimals(all, {
      searchTerm: state.searchTerm,
      selectedBiome: state.selectedBiome,
      selectedLevel: state.selectedLevel,
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
    selectedBiome: "all",
    selectedLevel: "all",
    sortBy: "name",
    sortDirection: "asc",
    currentPage: 1,
    itemsPerPage: 12,
    selectedAnimal: null,

    // Startwert Bearbeiten
    editingAnimal: null,

    // --- AKTIONEN ---

    setInitialAnimals: (animals) =>
      set((state) => {
        const all = animals as unknown as Animal[];
        return { allAnimals: all, ...runPipeline(all, state) };
      }),

    setSelectedAnimal: (animal) => set({ selectedAnimal: animal }),

    saveAnimal: async (formData) => {
      const isEdit = !!formData.id;
      const url = isEdit ? `/api/animals/${formData.id}` : "/api/animals";
      const method = isEdit ? "PUT" : "POST";

      try {
        const response = await fetch(url, {
          method,
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(formData),
        });

        const result = await response.json();

        if (response.ok) {
          toast.success(isEdit ? "Tier erfolgreich aktualisiert!" : "Tier erfolgreich erstellt!");

          // Update den lokalen Listenstate direkt im Store
          set((state) => {
            let updatedAll = [...state.allAnimals];
            if (isEdit) {
              updatedAll = updatedAll.map((a) => (a.id === result.id ? result : a));
            } else {
              updatedAll.push(result);
            }
            return {
              allAnimals: updatedAll,
              editingAnimal: null, // Nach Erfolg den Edit-Modus schließen
              ...runPipeline(updatedAll, state),
            };
          });
          return true;
        }
        toast.error(`Fehler: ${result.message || "Unbekannter Fehler"}`);
        return false;
      } catch (error) {
        console.error("Fetch Error:", error);
        toast.error("Netzwerkfehler: Keine Verbindung zur API.");
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

    setSelectedLevel: (level) =>
      set((state) => {
        const nextState = { ...state, selectedLevel: level, currentPage: 1 };
        return {
          selectedLevel: level,
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

    nextPage: () =>
      set((state) => {
        const nextState = { ...state, currentPage: state.currentPage + 1 };
        return { currentPage: state.currentPage + 1, ...runPipeline(state.allAnimals, nextState) };
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
          selectedBiome: "all",
          selectedLevel: "all",
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
      const result = await Swal.fire({
        title: t("Animals.messages.deleteErrorTitle"),
        text: t("Animals.messages.confirmDelete"),
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#d33",
        confirmButtonText: t("Common.messages.yes_delete"),
      });

      if (result.isConfirmed) {
        try {
          const response = await fetch(`/api/animals/${id}`, { method: "DELETE" });
          if (response.ok) {
            set((state) => {
              const updatedAnimals = state.allAnimals.filter((animal) => animal.id !== id);
              const nextSelected = state.selectedAnimal?.id === id ? null : state.selectedAnimal;
              return {
                allAnimals: updatedAnimals,
                selectedAnimal: nextSelected,
                ...runPipeline(updatedAnimals, state),
              };
            });
            toast.success(t("Animals.messages.deleteSuccess"));
            return true;
          }
          toast.error("Fehler beim Löschen");
          return false;
        } catch (error) {
          console.error(error);
          toast.error("Fehler beim Löschen");
          return false;
        }
      }
      return false;
    },
  };
});
