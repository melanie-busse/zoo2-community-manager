import { describe, test, expect, vi, beforeEach } from "vitest";

import {
  createAnimalOnClient,
  updateAnimalOnClient,
  deleteAnimalOnClient,
} from "@/service/frontend/Animal";

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

describe("Animal Frontend Service", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.unstubAllGlobals();
  });

  // ==========================================
  // createAnimalOnClient
  // ==========================================

  describe("createAnimalOnClient", () => {
    const formData = { name: "Löwe", biomeId: 1 };
    const mockResult = { id: 99, name: "Löwe" };

    test("sendet einen POST-Request mit dem korrekten Body", async () => {
      mockFetch(true, mockResult);

      await createAnimalOnClient(formData);

      expect(fetch).toHaveBeenCalledWith("/api/animals", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
    });

    test("gibt das Ergebnis zurück bei Erfolg", async () => {
      mockFetch(true, mockResult);

      const result = await createAnimalOnClient(formData);

      expect(result).toEqual(mockResult);
    });

    test("wirft einen Fehler mit der Server-Nachricht, wenn die Anfrage fehlschlägt", async () => {
      mockFetch(false, { message: "Name ist Pflichtfeld" });

      await expect(createAnimalOnClient(formData)).rejects.toThrow("Name ist Pflichtfeld");
    });

    test("wirft einen Fehler, wenn keine Server-Nachricht vorhanden ist", async () => {
      mockFetch(false, {});

      await expect(createAnimalOnClient(formData)).rejects.toThrow();
    });
  });

  // ==========================================
  // updateAnimalOnClient
  // ==========================================

  describe("updateAnimalOnClient", () => {
    const formData = { name: "Löwe (aktualisiert)", biomeId: 2 };
    const mockResult = { id: 42, name: "Löwe (aktualisiert)" };

    test("sendet einen PUT-Request an die korrekte URL", async () => {
      mockFetch(true, mockResult);

      await updateAnimalOnClient(42, formData);

      expect(fetch).toHaveBeenCalledWith("/api/animals/42", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
    });

    test("gibt das Ergebnis zurück bei Erfolg", async () => {
      mockFetch(true, mockResult);

      const result = await updateAnimalOnClient(42, formData);

      expect(result).toEqual(mockResult);
    });

    test("wirft einen Fehler mit der Server-Nachricht, wenn die Anfrage fehlschlägt", async () => {
      mockFetch(false, { message: "Tier nicht gefunden" });

      await expect(updateAnimalOnClient(42, formData)).rejects.toThrow("Tier nicht gefunden");
    });

    test("wirft einen Fehler, wenn keine Server-Nachricht vorhanden ist", async () => {
      mockFetch(false, {});

      await expect(updateAnimalOnClient(42, formData)).rejects.toThrow();
    });
  });

  // ==========================================
  // deleteAnimalOnClient
  // ==========================================

  describe("deleteAnimalOnClient", () => {
    test("sendet einen DELETE-Request an die korrekte URL", async () => {
      mockFetch(true, {});

      await deleteAnimalOnClient(42);

      expect(fetch).toHaveBeenCalledWith("/api/animals/42", { method: "DELETE" });
    });

    test("löst ohne Rückgabewert auf, wenn das Löschen erfolgreich war", async () => {
      mockFetch(true, {});

      const result = await deleteAnimalOnClient(42);

      expect(result).toBeUndefined();
    });

    test("wirft einen Fehler mit der Server-Nachricht, wenn die Anfrage fehlschlägt", async () => {
      mockFetch(false, { message: "Tier nicht gefunden" });

      await expect(deleteAnimalOnClient(42)).rejects.toThrow("Tier nicht gefunden");
    });

    test("wirft einen Fehler, wenn die Fehler-Antwort kein JSON enthält", async () => {
      vi.stubGlobal(
        "fetch",
        vi.fn().mockResolvedValue({
          ok: false,
          json: vi.fn().mockRejectedValue(new Error("invalid json")),
        }),
      );

      await expect(deleteAnimalOnClient(42)).rejects.toThrow();
    });
  });
});
