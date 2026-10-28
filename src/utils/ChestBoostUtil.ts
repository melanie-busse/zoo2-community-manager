import type { ChestBoostListItem, ChestType } from "@/types/chestBoost";

interface FilterOptions {
  searchTerm: string;
  selectedChestType: ChestType | null;
  selectedYear: number | null;
}

export function filterChestBoosts(
  items: ChestBoostListItem[],
  { searchTerm, selectedChestType, selectedYear }: FilterOptions,
): ChestBoostListItem[] {
  return items.filter((item) => {
    if (searchTerm && !item.animal.name.toLowerCase().includes(searchTerm.toLowerCase())) {
      return false;
    }
    if (selectedChestType && item.chestType !== selectedChestType) {
      return false;
    }
    if (selectedYear !== null && new Date(item.startDate).getFullYear() !== selectedYear) {
      return false;
    }
    return true;
  });
}

export function sortChestBoosts(items: ChestBoostListItem[]): ChestBoostListItem[] {
  return [...items].sort(
    (a, b) => new Date(b.startDate).getTime() - new Date(a.startDate).getTime(),
  );
}

export function paginateChestBoosts(
  items: ChestBoostListItem[],
  page: number,
  itemsPerPage: number,
): ChestBoostListItem[] {
  const start = (page - 1) * itemsPerPage;
  return items.slice(start, start + itemsPerPage);
}

export function getYearsFromBoosts(items: ChestBoostListItem[]): number[] {
  const years = Array.from(new Set(items.map((item) => new Date(item.startDate).getFullYear())));
  return years.sort((a, b) => b - a);
}
