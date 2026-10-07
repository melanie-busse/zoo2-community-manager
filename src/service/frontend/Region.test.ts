import { describe, test, expect, vi, beforeEach } from "vitest";

import {
  createRegionOnClient,
  updateRegionOnClient,
  deleteRegionOnClient,
} from "@/service/frontend/Region";

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

describe("Region Frontend Service", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.unstubAllGlobals();
  });

  // ==========================================
  // createRegionOnClient
  // ==========================================

  describe("createRegionOnClient", () => {
    const formData = { identifier: "MainZoo" };
    const mockResult = { id: 1, identifier: "MainZoo" };

    test("sendet einen POST-Request mit dem korrekten Body", async () => {
      mockFetch(true, mockResult);

      await createRegionOnClient(formData);

      expect(fetch).toHaveBeenCalledWith("/api/regions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
    });

    test("gibt das Ergebnis zurück bei Erfolg", async () => {
      mockFetch(true, mockResult);

      const result = await createRegionOnClient(formData);

      expect(result).toEqual(mockResult);
    });

    test("wirft einen Fehler mit der Server-Nachricht, wenn die Anfrage fehlschlägt", async () => {
      mockFetch(false, { message: "Identifier ist Pflichtfeld" });

      await expect(createRegionOnClient(formData)).rejects.toThrow("Identifier ist Pflichtfeld");
    });

    test("wirft einen Fehler, wenn keine Server-Nachricht vorhanden ist", async () => {
      mockFetch(false, {});

      await expect(createRegionOnClient(formData)).rejects.toThrow();
    });
  });

  // ==========================================
  // updateRegionOnClient
  // ==========================================

  describe("updateRegionOnClient", () => {
    const formData = { identifier: "MainZoo (aktualisiert)" };
    const mockResult = { id: 42, identifier: "MainZoo (aktualisiert)" };

    test("sendet einen PUT-Request an die korrekte URL", async () => {
      mockFetch(true, mockResult);

      await updateRegionOnClient(42, formData);

      expect(fetch).toHaveBeenCalledWith("/api/regions/42", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
    });

    test("gibt das Ergebnis zurück bei Erfolg", async () => {
      mockFetch(true, mockResult);

      const result = await updateRegionOnClient(42, formData);

      expect(result).toEqual(mockResult);
    });

    test("wirft einen Fehler mit der Server-Nachricht, wenn die Anfrage fehlschlägt", async () => {
      mockFetch(false, { message: "Region nicht gefunden" });

      await expect(updateRegionOnClient(42, formData)).rejects.toThrow("Region nicht gefunden");
    });

    test("wirft einen Fehler, wenn keine Server-Nachricht vorhanden ist", async () => {
      mockFetch(false, {});

      await expect(updateRegionOnClient(42, formData)).rejects.toThrow();
    });
  });

  // ==========================================
  // deleteRegionOnClient
  // ==========================================

  describe("deleteRegionOnClient", () => {
    test("sendet einen DELETE-Request an die korrekte URL", async () => {
      mockFetch(true, {});

      await deleteRegionOnClient(42);

      expect(fetch).toHaveBeenCalledWith("/api/regions/42", { method: "DELETE" });
    });

    test("löst ohne Rückgabewert auf, wenn das Löschen erfolgreich war", async () => {
      mockFetch(true, {});

      const result = await deleteRegionOnClient(42);

      expect(result).toBeUndefined();
    });

    test("wirft einen Fehler mit der Server-Nachricht, wenn die Anfrage fehlschlägt", async () => {
      mockFetch(false, { message: "Region nicht gefunden" });

      await expect(deleteRegionOnClient(42)).rejects.toThrow("Region nicht gefunden");
    });

    test("wirft einen Fehler, wenn die Fehler-Antwort kein JSON enthält", async () => {
      vi.stubGlobal(
        "fetch",
        vi.fn().mockResolvedValue({
          ok: false,
          json: vi.fn().mockRejectedValue(new Error("invalid json")),
        }),
      );

      await expect(deleteRegionOnClient(42)).rejects.toThrow();
    });
  });
});
