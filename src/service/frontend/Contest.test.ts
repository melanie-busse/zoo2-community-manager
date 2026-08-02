import { describe, test, expect, vi, beforeEach } from "vitest";
import {
  getContestEntriesForUser,
  submitContestEntries,
  deleteContestOnClient,
} from "@/service/frontend/Contest";

const mockFetch = (ok: boolean, body: object, status = ok ? 200 : 400) => {
  vi.stubGlobal(
    "fetch",
    vi.fn().mockResolvedValue({
      ok,
      status,
      json: vi.fn().mockResolvedValue(body),
    }),
  );
};

describe("Contest Frontend Service", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.unstubAllGlobals();
  });

  // ==========================================
  // getContestEntriesForUser
  // ==========================================

  describe("getContestEntriesForUser", () => {
    const mockEntries = [
      { id: 1, animalId: 10, level: 5, count: 3 },
      { id: 2, animalId: 11, level: 3, count: 7 },
    ];

    test("sendet GET-Request an die korrekte URL mit userId", async () => {
      mockFetch(true, mockEntries);

      await getContestEntriesForUser(42, 7);

      expect(fetch).toHaveBeenCalledWith("/api/contests/42/entries?userId=7");
    });

    test("gibt die Einträge zurück bei Erfolg", async () => {
      mockFetch(true, mockEntries);

      const result = await getContestEntriesForUser(42, 7);

      expect(result).toEqual(mockEntries);
    });

    test("gibt leeres Array zurück wenn Response nicht ok ist", async () => {
      mockFetch(false, { message: "Fehler" });

      const result = await getContestEntriesForUser(42, 7);

      expect(result).toEqual([]);
    });
  });

  // ==========================================
  // submitContestEntries
  // ==========================================

  describe("submitContestEntries", () => {
    const entries = [
      { animalId: 10, level: 5, count: 3 },
      { animalId: 11, level: 3, count: 7 },
    ];

    test("sendet POST-Request an die korrekte URL", async () => {
      mockFetch(true, { success: true }, 201);

      await submitContestEntries(42, 7, entries);

      expect(fetch).toHaveBeenCalledWith("/api/contests/42/entries", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId: 7, entries }),
      });
    });

    test("löst ohne Rückgabewert auf bei Erfolg", async () => {
      mockFetch(true, { success: true }, 201);

      const result = await submitContestEntries(42, 7, entries);

      expect(result).toBeUndefined();
    });

    test("wirft einen Fehler mit der Server-Nachricht, wenn die Anfrage fehlschlägt", async () => {
      mockFetch(false, { message: "Fehler beim Speichern" });

      await expect(submitContestEntries(42, 7, entries)).rejects.toThrow(
        "Fehler beim Speichern",
      );
    });

    test("wirft einen Fehler, wenn die Fehler-Antwort kein JSON enthält", async () => {
      vi.stubGlobal(
        "fetch",
        vi.fn().mockResolvedValue({
          ok: false,
          json: vi.fn().mockRejectedValue(new Error("invalid json")),
        }),
      );

      await expect(submitContestEntries(42, 7, entries)).rejects.toThrow();
    });
  });

  // ==========================================
  // deleteContestOnClient
  // ==========================================

  describe("deleteContestOnClient", () => {
    test("sendet DELETE-Request an die korrekte URL", async () => {
      mockFetch(true, {});

      await deleteContestOnClient(42);

      expect(fetch).toHaveBeenCalledWith("/api/contests/42", { method: "DELETE" });
    });

    test("löst ohne Rückgabewert auf bei Erfolg", async () => {
      mockFetch(true, {});

      const result = await deleteContestOnClient(42);

      expect(result).toBeUndefined();
    });

    test("wirft einen Fehler mit der Server-Nachricht, wenn die Anfrage fehlschlägt", async () => {
      mockFetch(false, { message: "Contest nicht gefunden" });

      await expect(deleteContestOnClient(42)).rejects.toThrow("Contest nicht gefunden");
    });
  });
});