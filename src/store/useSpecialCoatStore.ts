import { create } from "zustand";
import { SpecialCoat } from "@/types/specialCoat";
import { toast } from "react-toastify";
import Swal from "sweetalert2";

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
  selectedBiomeId: number | null;
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
  setBiomeFilter: (biomeId: number | null) => void;
  setShelterLevelFilter: (level: number | null) => void;
  setInventoryStatusFilter: (status: InventoryStatusFilter) => void;
  resetFilters: () => void;

  // 6. Aktionen für Edit & Delete
  setEditingSpecialCoat: (coat: SpecialCoat | null) => void;
  clearEditingSpecialCoat: () => void;
  deleteSpecialCoat: (id: number, t: any) => Promise<boolean>;
}

export const useSpecialCoatStore = create<SpecialCoatState>((set, get) => {
  // Die Pipeline filtert, sortiert und paginiert analog zum AnimalStore
  const runPipeline = (all: SpecialCoat[], state: any) => {
    let result = all.filter((coat) => {
      const animal = coat.animal;

      // Filter A: Textsuche (Farbname, Variantenname oder Tiername)
      if (state.searchTerm.trim() !== "") {
        const query = state.searchTerm.toLowerCase();
        const coatColor = coat.specialcoatstext?.[0]?.color?.toLowerCase() ?? "";
        const coatName = coat.specialcoatstext?.[0]?.name?.toLowerCase() ?? "";
        const animalTextName = animal?.animaltext?.[0]?.animalName?.toLowerCase() ?? "";

        if (
          !coatColor.includes(query) &&
          !coatName.includes(query) &&
          !animalTextName.includes(query)
        ) {
          return false;
        }
      }

      // Filter B: Biome
      if (state.selectedBiomeId !== null && animal?.biome?.id !== state.selectedBiomeId) {
        return false;
      }

      // Filter C: Stalllevel
      if (
        state.selectedShelterLevel !== null &&
        animal?.shelterLevel !== state.selectedShelterLevel
      ) {
        return false;
      }

      // Filter D: Inventar-Status
      const amount = coat.ownedAmount ?? 0;
      if (state.inventoryStatus === "missing_partner" && amount !== 1) return false;
      if (state.inventoryStatus === "ready" && amount < 2) return false;
      if (state.inventoryStatus === "not_owned" && amount !== 0) return false;

      return true;
    });

    // Sortierung
    result.sort((a, b) => {
      let valueA: any = "";
      let valueB: any = "";

      if (state.sortBy === "coatName") {
        valueA = a.specialcoatstext?.[0]?.name ?? "";
        valueB = b.specialcoatstext?.[0]?.name ?? "";
      } else if (state.sortBy === "color") {
        valueA = a.specialcoatstext?.[0]?.color ?? "";
        valueB = b.specialcoatstext?.[0]?.color ?? "";
      } else if (state.sortBy === "biomeName") {
        valueA = a.animal?.biome?.identifier ?? "";
        valueB = b.animal?.biome?.identifier ?? "";
      } else if (state.sortBy === "shelterLevel") {
        valueA = a.animal?.shelterLevel ?? 0;
        valueB = b.animal?.shelterLevel ?? 0;
      }

      if (valueA < valueB) return state.sortDirection === "asc" ? -1 : 1;
      if (valueA > valueB) return state.sortDirection === "asc" ? 1 : -1;
      return 0;
    });

    // Pagination
    const startIndex = (state.currentPage - 1) * state.itemsPerPage;
    const paginatedItems = result.slice(startIndex, startIndex + state.itemsPerPage);

    return {
      currentItems: paginatedItems,
      filteredCount: result.length,
    };
  };

  return {
    allSpecialCoats: [],
    currentItems: [],
    filteredCount: 0,

    editingSpecialCoat: null,

    // Filter-Standards
    searchTerm: "",
    selectedBiomeId: null,
    selectedShelterLevel: null,
    inventoryStatus: "all",
    sortBy: "animalName",
    sortDirection: "asc",
    currentPage: 1,
    itemsPerPage: 12,
    selectedSpecialCoat: null,

    // --- AKTIONEN ---
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
      const url = isEdit ? `/api/specialcoats/${formData.id}` : "/api/specialcoats";
      const method = isEdit ? "PUT" : "POST";

      try {
        const response = await fetch(url, {
          method,
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(formData),
        });

        const result = await response.json();

        if (response.ok) {
          toast.success(
            isEdit
              ? "Farbvariante erfolgreich aktualisiert!"
              : "Farbvariante erfolgreich erstellt!",
          );

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
        }
        toast.error(`Fehler: ${result.message || "Unbekannter Fehler"}`);
        return false;
      } catch (error) {
        console.error("Fetch Error:", error);
        toast.error("Netzwerkfehler beim Speichern.");
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

    setBiomeFilter: (biomeId) =>
      set((state) => {
        const nextState = { ...state, selectedBiomeId: biomeId, currentPage: 1 };
        return {
          selectedBiomeId: biomeId,
          currentPage: 1,
          ...runPipeline(state.allSpecialCoats, nextState),
        };
      }),

    setShelterLevelFilter: (level) =>
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
          selectedBiomeId: null,
          selectedShelterLevel: null,
          inventoryStatus: "all" as const,
          sortBy: "animalName",
          sortDirection: "asc" as const,
          currentPage: 1,
          selectedSpecialCoat: null,
        };
        return { ...clearedState, ...runPipeline(state.allSpecialCoats, clearedState) };
      }),

    setEditingSpecialCoat: (coat) => set({ editingSpecialCoat: coat }),
    clearEditingSpecialCoat: () => set({ editingSpecialCoat: null }),

    deleteSpecialCoat: async (id: number, t: any) => {
      const result = await Swal.fire({
        title: t("SpecialCoat.messages.deleteErrorTitle") || "Löschen?",
        text:
          t("SpecialCoat.messages.confirmDelete") || "Möchtest du diese Variante wirklich löschen?",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#d33",
        confirmButtonText: t("Common.messages.yes_delete") || "Ja, löschen",
      });

      if (result.isConfirmed) {
        try {
          const response = await fetch(`/api/special-coats/${id}`, { method: "DELETE" });
          if (response.ok) {
            set((state) => {
              const updated = state.allSpecialCoats.filter((c) => c.id !== id);
              const nextSelected =
                state.selectedSpecialCoat?.id === id ? null : state.selectedSpecialCoat;
              return {
                allSpecialCoats: updated,
                selectedSpecialCoat: nextSelected,
                ...runPipeline(updated, state),
              };
            });
            toast.success(t("SpecialCoat.messages.deleteSuccess") || "Erfolgreich gelöscht");
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
