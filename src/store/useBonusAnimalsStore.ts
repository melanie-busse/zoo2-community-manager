import { create } from "zustand";
import { fetchBonusAnimals, type BonusAnimalsResponse } from "@/service/frontend/PremiumVipAnimal";
import type { PremiumVipAnimalEntryWithAnimal } from "@/service/PremiumVipAnimalService";

interface BonusAnimalsState {
  type: "PREMIUM" | "VIP";
  entries: PremiumVipAnimalEntryWithAnimal[];
  total: number;
  availableYears: number[];
  animalNameFilter: string;
  yearFilter: number | null;
  page: number;
  pageSize: number;
  isLoading: boolean;

  initializeFromSSR: (data: BonusAnimalsResponse & { type: "PREMIUM" | "VIP" }) => void;
  setAnimalNameFilter: (name: string) => void;
  setYearFilter: (year: number | null) => void;
  setPage: (page: number) => void;
  fetchEntries: () => Promise<void>;
}

export const useBonusAnimalsStore = create<BonusAnimalsState>((set, get) => ({
  type: "PREMIUM",
  entries: [],
  total: 0,
  availableYears: [],
  animalNameFilter: "",
  yearFilter: null,
  page: 1,
  pageSize: 25,
  isLoading: false,

  initializeFromSSR: (data) => {
    set({
      type: data.type,
      entries: data.entries,
      total: data.total,
      availableYears: data.availableYears,
      page: 1,
      animalNameFilter: "",
      yearFilter: null,
      isLoading: false,
    });
  },

  setAnimalNameFilter: (name) => {
    set({ animalNameFilter: name, page: 1 });
    get().fetchEntries();
  },

  setYearFilter: (year) => {
    set({ yearFilter: year, page: 1 });
    get().fetchEntries();
  },

  setPage: (page) => {
    set({ page });
    get().fetchEntries();
  },

  fetchEntries: async () => {
    const { type, animalNameFilter, yearFilter, page, pageSize } = get();
    set({ isLoading: true });
    try {
      const result = await fetchBonusAnimals(type, {
        animalName: animalNameFilter || undefined,
        year: yearFilter ?? undefined,
        page,
        pageSize,
      });
      set({ entries: result.entries, total: result.total, availableYears: result.availableYears, isLoading: false });
    } catch {
      set({ isLoading: false });
    }
  },
}));
