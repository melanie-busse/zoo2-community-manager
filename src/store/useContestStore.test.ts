import { describe, test, expect, vi, beforeEach } from "vitest";
import { useContestStore } from "./useContestStore";
import { Contest } from "@/types/contest";
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

const mockContests: Contest[] = [
  { id: 1, startDate: "2024-01-01", endDate: "2024-01-07", active: true },
  { id: 2, startDate: "2024-02-01", endDate: "2024-02-07", active: false },
];

const mockT = (key: string) => key;

describe("useContestStore", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    useContestStore.setState({ allContests: [] });
  });

  test("setInitialContests befüllt die Liste", () => {
    useContestStore.getState().setInitialContests(mockContests);
    expect(useContestStore.getState().allContests).toHaveLength(2);
  });

  test("saveContest (POST) fügt einen neuen Contest hinzu", async () => {
    const newContest = { id: 3, startDate: "2024-03-01", endDate: "2024-03-07", active: false };
    global.fetch = vi.fn().mockResolvedValue({ ok: true, json: async () => newContest });

    const result = await useContestStore.getState().saveContest({ startDate: "2024-03-01", endDate: "2024-03-07" });

    expect(result).toBe(3);
    expect(fetch).toHaveBeenCalledWith("/api/contests", expect.any(Object));
    expect(useContestStore.getState().allContests).toContainEqual(newContest);
  });

  test("saveContest (PUT) aktualisiert einen bestehenden Contest", async () => {
    useContestStore.getState().setInitialContests(mockContests);
    const updated = { ...mockContests[0], active: false };
    global.fetch = vi.fn().mockResolvedValue({ ok: true, json: async () => updated });

    const result = await useContestStore.getState().saveContest({ id: 1, active: false });

    expect(result).toBe(1);
    expect(fetch).toHaveBeenCalledWith("/api/contests/1", expect.any(Object));
    expect(useContestStore.getState().allContests[0].active).toBe(false);
  });

  test("saveContest gibt false zurück bei API-Fehler", async () => {
    global.fetch = vi.fn().mockResolvedValue({
      ok: false,
      json: async () => ({ message: "Server Error" }),
    });

    const result = await useContestStore.getState().saveContest({ startDate: "2024-03-01" });

    expect(result).toBe(false);
    expect(toast.error).toHaveBeenCalled();
  });

  test("deleteContest bricht ab, wenn der User den Dialog verneint", async () => {
    vi.mocked(Swal.fire).mockResolvedValue({ isConfirmed: false } as any);

    const result = await useContestStore.getState().deleteContest(1, mockT, mockT);

    expect(result).toBe(false);
    expect(global.fetch).not.toHaveBeenCalled();
  });

  test("deleteContest entfernt den Contest aus dem State bei Erfolg", async () => {
    useContestStore.getState().setInitialContests(mockContests);
    vi.mocked(Swal.fire).mockResolvedValue({ isConfirmed: true } as any);
    global.fetch = vi.fn().mockResolvedValue({ ok: true });

    const result = await useContestStore.getState().deleteContest(1, mockT, mockT);

    expect(result).toBe(true);
    expect(toast.success).toHaveBeenCalled();
    expect(useContestStore.getState().allContests).toHaveLength(1);
    expect(useContestStore.getState().allContests[0].id).toBe(2);
  });
});