import { describe, test, expect } from "vitest";
import {
  filterChestBoosts,
  sortChestBoosts,
  paginateChestBoosts,
  getYearsFromBoosts,
} from "@/utils/ChestBoostUtil";
import type { ChestBoostListItem } from "@/types/chestBoost";

const makeBoost = (overrides: Partial<ChestBoostListItem> = {}): ChestBoostListItem => ({
  id: 1,
  startDate: "2026-01-01T00:00:00.000Z",
  endDate: "2026-02-12T00:00:00.000Z",
  chestType: "EPIC",
  isEvent: false,
  animal: {
    id: 1,
    name: "Kranich",
    identifier: "crane",
    biome: { id: 1, name: "Savanne" },
  },
  ...overrides,
});

describe("filterChestBoosts", () => {
  test("gibt alle zurück, wenn keine Filter gesetzt sind", () => {
    const items = [makeBoost(), makeBoost({ id: 2 })];
    expect(
      filterChestBoosts(items, { searchTerm: "", selectedChestType: null, selectedYear: null }),
    ).toHaveLength(2);
  });

  test("filtert nach Tiernamen (case-insensitiv)", () => {
    const items = [
      makeBoost({
        id: 1,
        animal: { id: 1, name: "Kranich", identifier: null, biome: { id: 1, name: "x" } },
      }),
      makeBoost({
        id: 2,
        animal: { id: 2, name: "Löwe", identifier: null, biome: { id: 1, name: "x" } },
      }),
    ];
    const result = filterChestBoosts(items, {
      searchTerm: "kran",
      selectedChestType: null,
      selectedYear: null,
    });
    expect(result).toHaveLength(1);
    expect(result[0].animal.name).toBe("Kranich");
  });

  test("filtert nach Truhenart", () => {
    const items = [
      makeBoost({ id: 1, chestType: "EPIC" }),
      makeBoost({ id: 2, chestType: "RETRO" }),
    ];
    const result = filterChestBoosts(items, {
      searchTerm: "",
      selectedChestType: "RETRO",
      selectedYear: null,
    });
    expect(result).toHaveLength(1);
    expect(result[0].chestType).toBe("RETRO");
  });

  test("filtert nach Jahr (aus startDate)", () => {
    const items = [
      makeBoost({ id: 1, startDate: "2025-06-01T00:00:00.000Z" }),
      makeBoost({ id: 2, startDate: "2026-01-01T00:00:00.000Z" }),
    ];
    const result = filterChestBoosts(items, {
      searchTerm: "",
      selectedChestType: null,
      selectedYear: 2025,
    });
    expect(result).toHaveLength(1);
    expect(result[0].id).toBe(1);
  });

  test("kombiniert Suchbegriff und Truhenart", () => {
    const items = [
      makeBoost({ id: 1, chestType: "EPIC", animal: { id: 1, name: "Adler", identifier: null, biome: { id: 1, name: "x" } } }),
      makeBoost({ id: 2, chestType: "RETRO", animal: { id: 2, name: "Adler", identifier: null, biome: { id: 1, name: "x" } } }),
      makeBoost({ id: 3, chestType: "EPIC", animal: { id: 3, name: "Löwe", identifier: null, biome: { id: 1, name: "x" } } }),
    ];
    const result = filterChestBoosts(items, {
      searchTerm: "adler",
      selectedChestType: "EPIC",
      selectedYear: null,
    });
    expect(result).toHaveLength(1);
    expect(result[0].id).toBe(1);
  });

  test("gibt leeres Array zurück, wenn keine Übereinstimmung", () => {
    const items = [makeBoost()];
    const result = filterChestBoosts(items, {
      searchTerm: "xyznotfound",
      selectedChestType: null,
      selectedYear: null,
    });
    expect(result).toHaveLength(0);
  });
});

describe("sortChestBoosts", () => {
  test("sortiert nach startDate absteigend", () => {
    const items = [
      makeBoost({ id: 1, startDate: "2024-01-01T00:00:00.000Z" }),
      makeBoost({ id: 2, startDate: "2026-01-01T00:00:00.000Z" }),
      makeBoost({ id: 3, startDate: "2025-06-15T00:00:00.000Z" }),
    ];
    const result = sortChestBoosts(items);
    expect(result[0].id).toBe(2);
    expect(result[1].id).toBe(3);
    expect(result[2].id).toBe(1);
  });

  test("mutiert das Original-Array nicht", () => {
    const items = [
      makeBoost({ id: 1, startDate: "2024-01-01T00:00:00.000Z" }),
      makeBoost({ id: 2, startDate: "2026-01-01T00:00:00.000Z" }),
    ];
    const original = [...items];
    sortChestBoosts(items);
    expect(items[0].id).toBe(original[0].id);
  });
});

describe("paginateChestBoosts", () => {
  test("gibt die richtige erste Seite zurück", () => {
    const items = Array.from({ length: 25 }, (_, i) => makeBoost({ id: i + 1 }));
    const page1 = paginateChestBoosts(items, 1, 10);
    expect(page1).toHaveLength(10);
    expect(page1[0].id).toBe(1);
    expect(page1[9].id).toBe(10);
  });

  test("gibt die letzte (unvollständige) Seite korrekt zurück", () => {
    const items = Array.from({ length: 25 }, (_, i) => makeBoost({ id: i + 1 }));
    const page3 = paginateChestBoosts(items, 3, 10);
    expect(page3).toHaveLength(5);
    expect(page3[0].id).toBe(21);
  });

  test("gibt leeres Array zurück, wenn Seite außerhalb des Bereichs", () => {
    const items = Array.from({ length: 5 }, (_, i) => makeBoost({ id: i + 1 }));
    expect(paginateChestBoosts(items, 2, 10)).toHaveLength(0);
  });
});

describe("getYearsFromBoosts", () => {
  test("gibt eindeutige Jahre sortiert absteigend zurück", () => {
    const items = [
      makeBoost({ id: 1, startDate: "2024-06-01T00:00:00.000Z" }),
      makeBoost({ id: 2, startDate: "2026-01-01T00:00:00.000Z" }),
      makeBoost({ id: 3, startDate: "2024-12-01T00:00:00.000Z" }),
    ];
    expect(getYearsFromBoosts(items)).toEqual([2026, 2024]);
  });

  test("gibt leeres Array zurück, wenn keine Einträge vorhanden", () => {
    expect(getYearsFromBoosts([])).toEqual([]);
  });

  test("gibt ein einzelnes Jahr zurück, wenn alle Einträge dasselbe Jahr haben", () => {
    const items = [
      makeBoost({ id: 1, startDate: "2025-01-01T00:00:00.000Z" }),
      makeBoost({ id: 2, startDate: "2025-06-15T00:00:00.000Z" }),
    ];
    expect(getYearsFromBoosts(items)).toEqual([2025]);
  });
});
