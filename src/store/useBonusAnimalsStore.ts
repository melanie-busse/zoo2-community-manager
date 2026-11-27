import { create } from "zustand";
import { fetchBonusAnimals, deleteBonusAnimal, type BonusAnimalsResponse } from "@/service/frontend/PremiumVipAnimal";
import type { PremiumVipAnimalEntryWithAnimal } from "@/service/PremiumVipAnimalService";

interface BonusAnimalsState {
  type: "PREMIUM" | "VIP";
  locale: string;
  entries: PremiumVipAnimalEntryWithAnimal[];
  total: number;
  availableYears: number[];
  identifierFilter: string;
  yearFilter: number | null;
  page: number;
  pageSize: number;
  isLoading: boolean;
  fetchError: string | null;

  initializeFromSSR: (data: BonusAnimalsResponse & { type: "PREMIUM" | "VIP"; locale: string }) => void;
  setIdentifierFilter: (value: string) => void;
  setYearFilter: (year: number | null) => void;
  setPage: (page: number) => void;
  fetchEntries: () => Promise<void>;
  deleteEntry: (id: number) => Promise<void>;
}

export const useBonusAnimalsStore = create<BonusAnimalsState>((set, get) => ({
  type: "PREMIUM",
  locale: "de",
  entries: [],
  total: 0,
  availableYears: [],
  identifierFilter: "",
  yearFilter: null,
  page: 1,
  pageSize: 25,
  isLoading: false,
  fetchError: null,

  initializeFromSSR: (data) => {
    set({
      type: data.type,
      locale: data.locale,
      entries: data.entries,
      total: data.total,
      availableYears: data.availableYears,
      page: 1,
      identifierFilter: "",
      yearFilter: null,
      isLoading: false,
      fetchError: null,
    });
  },

  setIdentifierFilter: (value) => {
    set({ identifierFilter: value, page: 1 });
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

  deleteEntry: async (id) => {
    await deleteBonusAnimal(id);
    await get().fetchEntries();
  },

  fetchEntries: async () => {
    const { type, locale, identifierFilter, yearFilter, page, pageSize } = get();
    set({ isLoading: true, fetchError: null });
    try {
      const result = await fetchBonusAnimals(type, {
        identifier: identifierFilter || undefined,
        year: yearFilter ?? undefined,
        page,
        pageSize,
        locale,
      });
      set({ entries: result.entries, total: result.total, availableYears: result.availableYears, isLoading: false });
    } catch (e: unknown) {
      const message = e instanceof Error ? e.message : "Failed to load data";
      set({ isLoading: false, fetchError: message });
    }
  },
}));
