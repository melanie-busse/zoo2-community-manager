import { create } from "zustand";
import { LevelRewardItem } from "@/service/LevelService";

function filterLevels(
  all: LevelRewardItem[],
  levelSearch: string,
  animalId: number | null
): LevelRewardItem[] {
  return all.filter((item) => {
    if (levelSearch && !String(item.level).includes(levelSearch)) return false;
    if (animalId !== null && !item.animalRewards.some((a) => a.animal?.id === animalId))
      return false;
    return true;
  });
}

function paginate<T>(items: T[], page: number, perPage: number): T[] {
  return items.slice((page - 1) * perPage, page * perPage);
}

interface LevelState {
  allLevels: LevelRewardItem[];
  currentItems: LevelRewardItem[];
  filteredCount: number;
  levelSearch: string;
  animalId: number | null;
  currentPage: number;
  itemsPerPage: number;

  setInitialLevels: (levels: LevelRewardItem[]) => void;
  setLevelSearch: (s: string) => void;
  setAnimalId: (id: number | null) => void;
  nextPage: () => void;
  prevPage: () => void;
  setPage: (page: number) => void;
}

export const useLevelStore = create<LevelState>((set) => {
  function run(
    all: LevelRewardItem[],
    levelSearch: string,
    animalId: number | null,
    page: number,
    perPage: number
  ) {
    const filtered = filterLevels(all, levelSearch, animalId);
    return { currentItems: paginate(filtered, page, perPage), filteredCount: filtered.length };
  }

  return {
    allLevels: [],
    currentItems: [],
    filteredCount: 0,
    levelSearch: "",
    animalId: null,
    currentPage: 1,
    itemsPerPage: 25,

    setInitialLevels: (levels) =>
      set((state) => ({
        allLevels: levels,
        currentPage: 1,
        ...run(levels, state.levelSearch, state.animalId, 1, state.itemsPerPage),
      })),

    setLevelSearch: (s) =>
      set((state) => ({
        levelSearch: s,
        currentPage: 1,
        ...run(state.allLevels, s, state.animalId, 1, state.itemsPerPage),
      })),

    setAnimalId: (id) =>
      set((state) => ({
        animalId: id,
        currentPage: 1,
        ...run(state.allLevels, state.levelSearch, id, 1, state.itemsPerPage),
      })),

    nextPage: () =>
      set((state) => {
        const total = Math.ceil(state.filteredCount / state.itemsPerPage);
        if (state.currentPage >= total) return {};
        const next = state.currentPage + 1;
        return {
          currentPage: next,
          ...run(state.allLevels, state.levelSearch, state.animalId, next, state.itemsPerPage),
        };
      }),

    prevPage: () =>
      set((state) => {
        const prev = Math.max(1, state.currentPage - 1);
        return {
          currentPage: prev,
          ...run(state.allLevels, state.levelSearch, state.animalId, prev, state.itemsPerPage),
        };
      }),

    setPage: (page) =>
      set((state) => ({
        currentPage: page,
        ...run(state.allLevels, state.levelSearch, state.animalId, page, state.itemsPerPage),
      })),
  };
});
