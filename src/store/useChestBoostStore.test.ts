import { describe, test, expect, vi, beforeEach } from "vitest";
import { useChestBoostStore } from "./useChestBoostStore";
import type { ChestBoostListItem } from "@/types/chestBoost";
import Swal from "sweetalert2";
import { toast } from "react-toastify";

vi.mock("sweetalert2", () => ({
  default: {
    fire: vi.fn(),
  },
}));

vi.mock("react-toastify", () => ({
  toast: {
    success: vi.fn(),
    error: vi.fn(),
  },
}));

vi.mock("@/service/frontend/ChestBoost", () => ({
  createChestBoostOnClient: vi.fn(),
  updateChestBoostOnClient: vi.fn(),
  deleteChestBoostOnClient: vi.fn(),
}));

import {
  createChestBoostOnClient,
  updateChestBoostOnClient,
  deleteChestBoostOnClient,
} from "@/service/frontend/ChestBoost";

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
    biome: { id: 1, name: "Savanne", identifier: "savanne" },
  },
  ...overrides,
});

const mockBoosts = [
  makeBoost({ id: 1, chestType: "EPIC" }),
  makeBoost({ id: 2, chestType: "RETRO" }),
  makeBoost({ id: 3, chestType: "EPIC" }),
];

const mockT = (key: string) => key;

describe("useChestBoostStore", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    useChestBoostStore.setState({
      allBoosts: [],
      currentItems: [],
      filteredCount: 0,
      searchTerm: "",
      selectedChestType: null,
      selectedYear: null,
      currentPage: 1,
      itemsPerPage: 20,
    });
  });

  // ==========================================
  // setInitialBoosts
  // ==========================================

  test("setInitialBoosts befüllt allBoosts und currentItems", () => {
    useChestBoostStore.getState().setInitialBoosts(mockBoosts);

    const state = useChestBoostStore.getState();
    expect(state.allBoosts).toHaveLength(3);
    expect(state.currentItems).toHaveLength(3);
    expect(state.filteredCount).toBe(3);
  });

  test("setInitialBoosts setzt currentPage auf 1 zurück", () => {
    useChestBoostStore.setState({ currentPage: 3 });
    useChestBoostStore.getState().setInitialBoosts(mockBoosts);

    expect(useChestBoostStore.getState().currentPage).toBe(1);
  });

  // ==========================================
  // Filter
  // ==========================================

  test("setSearchTerm filtert die Ergebnisse und setzt Seite zurück", () => {
    useChestBoostStore.getState().setInitialBoosts([
      makeBoost({ id: 1, animal: { id: 1, name: "Adler", identifier: null, biome: { id: 1, name: "x", identifier: "x" } } }),
      makeBoost({ id: 2, animal: { id: 2, name: "Löwe", identifier: null, biome: { id: 1, name: "x", identifier: "x" } } }),
    ]);
    useChestBoostStore.setState({ currentPage: 2 });

    useChestBoostStore.getState().setSearchTerm("adler");

    const state = useChestBoostStore.getState();
    expect(state.filteredCount).toBe(1);
    expect(state.currentItems[0].animal.name).toBe("Adler");
    expect(state.currentPage).toBe(1);
  });

  test("setSelectedChestType filtert nach Truhenart", () => {
    useChestBoostStore.getState().setInitialBoosts(mockBoosts);

    useChestBoostStore.getState().setSelectedChestType("RETRO");

    const state = useChestBoostStore.getState();
    expect(state.filteredCount).toBe(1);
    expect(state.currentItems[0].chestType).toBe("RETRO");
  });

  test("setSelectedYear filtert nach Jahr", () => {
    useChestBoostStore.getState().setInitialBoosts([
      makeBoost({ id: 1, startDate: "2025-06-01T00:00:00.000Z" }),
      makeBoost({ id: 2, startDate: "2026-01-01T00:00:00.000Z" }),
    ]);

    useChestBoostStore.getState().setSelectedYear(2025);

    const state = useChestBoostStore.getState();
    expect(state.filteredCount).toBe(1);
    expect(state.currentItems[0].id).toBe(1);
  });

  test("resetFilters löscht alle Filter und setzt Seite zurück", () => {
    useChestBoostStore.getState().setInitialBoosts(mockBoosts);
    useChestBoostStore.getState().setSelectedChestType("RETRO");
    useChestBoostStore.getState().setSearchTerm("foo");
    useChestBoostStore.setState({ currentPage: 3 });

    useChestBoostStore.getState().resetFilters();

    const state = useChestBoostStore.getState();
    expect(state.searchTerm).toBe("");
    expect(state.selectedChestType).toBeNull();
    expect(state.selectedYear).toBeNull();
    expect(state.filteredCount).toBe(3);
    expect(state.currentPage).toBe(1);
  });

  // ==========================================
  // Pagination
  // ==========================================

  test("nextPage erhöht currentPage", () => {
    useChestBoostStore.getState().setInitialBoosts(
      Array.from({ length: 25 }, (_, i) => makeBoost({ id: i + 1 })),
    );
    useChestBoostStore.setState({ itemsPerPage: 10 });

    useChestBoostStore.getState().nextPage();

    expect(useChestBoostStore.getState().currentPage).toBe(2);
  });

  test("prevPage verringert currentPage (Minimum: 1)", () => {
    useChestBoostStore.setState({ currentPage: 2 });
    useChestBoostStore.getState().prevPage();
    expect(useChestBoostStore.getState().currentPage).toBe(1);

    useChestBoostStore.getState().prevPage();
    expect(useChestBoostStore.getState().currentPage).toBe(1);
  });

  test("setPage setzt currentPage direkt", () => {
    useChestBoostStore.getState().setInitialBoosts(
      Array.from({ length: 25 }, (_, i) => makeBoost({ id: i + 1 })),
    );
    useChestBoostStore.setState({ itemsPerPage: 10 });

    useChestBoostStore.getState().setPage(3);

    expect(useChestBoostStore.getState().currentPage).toBe(3);
  });

  // ==========================================
  // saveBoost
  // ==========================================

  test("saveBoost (POST) erstellt einen neuen Boost und aktualisiert die Liste", async () => {
    vi.mocked(createChestBoostOnClient).mockResolvedValue({ id: 99 } as any);
    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue({ ok: true, json: async () => [...mockBoosts, makeBoost({ id: 99 })] }),
    );

    const formData = {
      startDate: "2026-03-01",
      endDate: "2026-04-01",
      chestType: "EPIC" as const,
      isEvent: false,
      animalId: 1,
    };

    const result = await useChestBoostStore.getState().saveBoost(formData);

    expect(result).toBe(99);
    expect(createChestBoostOnClient).toHaveBeenCalledWith(formData);
    expect(useChestBoostStore.getState().allBoosts).toHaveLength(4);
  });

  test("saveBoost (PUT) aktualisiert einen bestehenden Boost", async () => {
    vi.mocked(updateChestBoostOnClient).mockResolvedValue({ id: 2 } as any);
    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue({ ok: true, json: async () => mockBoosts }),
    );

    const formData = {
      startDate: "2026-03-01",
      endDate: "2026-04-01",
      chestType: "RETRO" as const,
      isEvent: false,
      animalId: 2,
    };

    const result = await useChestBoostStore.getState().saveBoost(formData, 2);

    expect(result).toBe(2);
    expect(updateChestBoostOnClient).toHaveBeenCalledWith(2, formData);
    expect(createChestBoostOnClient).not.toHaveBeenCalled();
  });

  test("saveBoost gibt false zurück und zeigt Toast bei API-Fehler", async () => {
    vi.mocked(createChestBoostOnClient).mockRejectedValue(new Error("Netzwerkfehler"));

    const result = await useChestBoostStore.getState().saveBoost({
      startDate: "2026-01-01",
      endDate: "2026-02-01",
      chestType: "EPIC",
      isEvent: false,
      animalId: 1,
    });

    expect(result).toBe(false);
    expect(toast.error).toHaveBeenCalled();
  });

  test("saveBoost gibt MayorReadonly-Objekt zurück bei 403-Fehler", async () => {
    const mayorError = Object.assign(new Error("Forbidden"), {
      status: 403,
      data: { error: "MayorReadonly", message: "Nur Lesen erlaubt" },
    });
    vi.mocked(createChestBoostOnClient).mockRejectedValue(mayorError);

    const result = await useChestBoostStore.getState().saveBoost({
      startDate: "2026-01-01",
      endDate: "2026-02-01",
      chestType: "EPIC",
      isEvent: false,
      animalId: 1,
    });

    expect(result).toEqual({ error: "MayorReadonly", message: "Nur Lesen erlaubt" });
  });

  // ==========================================
  // deleteBoost
  // ==========================================

  test("deleteBoost bricht ab wenn der User den Dialog verneint", async () => {
    vi.mocked(Swal.fire).mockResolvedValue({ isConfirmed: false } as any);
    useChestBoostStore.getState().setInitialBoosts(mockBoosts);

    const result = await useChestBoostStore.getState().deleteBoost(1, mockT, mockT);

    expect(result).toBe(false);
    expect(deleteChestBoostOnClient).not.toHaveBeenCalled();
  });

  test("deleteBoost entfernt den Boost aus dem State und zeigt Erfolgs-Toast", async () => {
    vi.mocked(Swal.fire).mockResolvedValue({ isConfirmed: true } as any);
    vi.mocked(deleteChestBoostOnClient).mockResolvedValue(undefined);
    useChestBoostStore.getState().setInitialBoosts(mockBoosts);

    const result = await useChestBoostStore.getState().deleteBoost(1, mockT, mockT);

    expect(result).toBe(true);
    expect(useChestBoostStore.getState().allBoosts).toHaveLength(2);
    expect(useChestBoostStore.getState().allBoosts.find((b) => b.id === 1)).toBeUndefined();
    expect(toast.success).toHaveBeenCalled();
  });

  test("deleteBoost gibt false zurück und zeigt Toast bei API-Fehler", async () => {
    vi.mocked(Swal.fire).mockResolvedValue({ isConfirmed: true } as any);
    vi.mocked(deleteChestBoostOnClient).mockRejectedValue(new Error("Serverfehler"));
    useChestBoostStore.getState().setInitialBoosts(mockBoosts);

    const result = await useChestBoostStore.getState().deleteBoost(1, mockT, mockT);

    expect(result).toBe(false);
    expect(toast.error).toHaveBeenCalled();
  });
});
