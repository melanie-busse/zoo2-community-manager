import { describe, test, expect, vi, beforeEach } from "vitest";
import {
  createChestBoostOnClient,
  updateChestBoostOnClient,
  deleteChestBoostOnClient,
} from "@/service/frontend/ChestBoost";

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

describe("ChestBoost Frontend Service", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.unstubAllGlobals();
  });

  // ==========================================
  // createChestBoostOnClient
  // ==========================================

  describe("createChestBoostOnClient", () => {
    const formData = {
      startDate: "2026-01-01",
      endDate: "2026-02-12",
      chestType: "EPIC" as const,
      isEvent: false,
      animalId: 42,
    };
    const mockResult = { id: 1 };

    test("sendet einen POST-Request an /api/chest-boosts", async () => {
      mockFetch(true, mockResult);

      await createChestBoostOnClient(formData);

      expect(fetch).toHaveBeenCalledWith("/api/chest-boosts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
    });

    test("gibt das Ergebnis zurück bei Erfolg", async () => {
      mockFetch(true, mockResult);

      const result = await createChestBoostOnClient(formData);

      expect(result).toEqual(mockResult);
    });

    test("wirft einen Fehler mit der Server-Nachricht, wenn die Anfrage fehlschlägt", async () => {
      mockFetch(false, { message: "Pflichtfelder fehlen" });

      await expect(createChestBoostOnClient(formData)).rejects.toThrow("Pflichtfelder fehlen");
    });

    test("wirft einen Fehler, wenn keine Server-Nachricht vorhanden ist", async () => {
      mockFetch(false, {});

      await expect(createChestBoostOnClient(formData)).rejects.toThrow();
    });
  });

  // ==========================================
  // updateChestBoostOnClient
  // ==========================================

  describe("updateChestBoostOnClient", () => {
    const formData = {
      startDate: "2026-03-01",
      endDate: "2026-04-12",
      chestType: "RETRO" as const,
      isEvent: false,
      animalId: 7,
    };
    const mockResult = { id: 42 };

    test("sendet einen PUT-Request an die korrekte URL", async () => {
      mockFetch(true, mockResult);

      await updateChestBoostOnClient(42, formData);

      expect(fetch).toHaveBeenCalledWith("/api/chest-boosts/42", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
    });

    test("gibt das Ergebnis zurück bei Erfolg", async () => {
      mockFetch(true, mockResult);

      const result = await updateChestBoostOnClient(42, formData);

      expect(result).toEqual(mockResult);
    });

    test("wirft einen Fehler mit der Server-Nachricht, wenn die Anfrage fehlschlägt", async () => {
      mockFetch(false, { message: "Eintrag nicht gefunden" });

      await expect(updateChestBoostOnClient(42, formData)).rejects.toThrow(
        "Eintrag nicht gefunden",
      );
    });
  });

  // ==========================================
  // deleteChestBoostOnClient
  // ==========================================

  describe("deleteChestBoostOnClient", () => {
    test("sendet einen DELETE-Request an die korrekte URL", async () => {
      mockFetch(true, {});

      await deleteChestBoostOnClient(42);

      expect(fetch).toHaveBeenCalledWith("/api/chest-boosts/42", { method: "DELETE" });
    });

    test("löst ohne Rückgabewert auf, wenn das Löschen erfolgreich war", async () => {
      mockFetch(true, {});

      const result = await deleteChestBoostOnClient(42);

      expect(result).toBeUndefined();
    });

    test("wirft einen Fehler mit der Server-Nachricht, wenn die Anfrage fehlschlägt", async () => {
      mockFetch(false, { message: "Eintrag nicht gefunden" });

      await expect(deleteChestBoostOnClient(42)).rejects.toThrow("Eintrag nicht gefunden");
    });

    test("wirft einen Fehler, wenn die Fehler-Antwort kein JSON enthält", async () => {
      vi.stubGlobal(
        "fetch",
        vi.fn().mockResolvedValue({
          ok: false,
          json: vi.fn().mockRejectedValue(new Error("invalid json")),
        }),
      );

      await expect(deleteChestBoostOnClient(42)).rejects.toThrow();
    });
  });
});
