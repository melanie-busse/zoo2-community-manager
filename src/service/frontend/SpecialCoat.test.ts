import { describe, test, expect, vi, beforeEach } from "vitest";

import {
  createSpecialCoatOnClient,
  updateSpecialCoatOnClient,
  deleteSpecialCoatOnClient,
} from "@/service/frontend/SpecialCoat";

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

describe("SpecialCoat Frontend Service", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.unstubAllGlobals();
  });

  // ==========================================
  // createSpecialCoatOnClient
  // ==========================================

  describe("createSpecialCoatOnClient", () => {
    const formData = { animalId: 5, image: "polar.png" };
    const mockResult = { id: 77, animalId: 5 };

    test("sendet einen POST-Request mit dem korrekten Body", async () => {
      mockFetch(true, mockResult);

      await createSpecialCoatOnClient(formData);

      expect(fetch).toHaveBeenCalledWith("/api/specialcoats", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
    });

    test("gibt das Ergebnis zurück bei Erfolg", async () => {
      mockFetch(true, mockResult);

      const result = await createSpecialCoatOnClient(formData);

      expect(result).toEqual(mockResult);
    });

    test("wirft einen Fehler mit der Server-Nachricht, wenn die Anfrage fehlschlägt", async () => {
      mockFetch(false, { message: "AnimalId ist Pflichtfeld" });

      await expect(createSpecialCoatOnClient(formData)).rejects.toThrow(
        "AnimalId ist Pflichtfeld",
      );
    });

    test("wirft einen Fehler, wenn keine Server-Nachricht vorhanden ist", async () => {
      mockFetch(false, {});

      await expect(createSpecialCoatOnClient(formData)).rejects.toThrow();
    });
  });

  // ==========================================
  // updateSpecialCoatOnClient
  // ==========================================

  describe("updateSpecialCoatOnClient", () => {
    const formData = { image: "updated.png" };
    const mockResult = { id: 42, image: "updated.png" };

    test("sendet einen PUT-Request an die korrekte URL", async () => {
      mockFetch(true, mockResult);

      await updateSpecialCoatOnClient(42, formData);

      expect(fetch).toHaveBeenCalledWith("/api/specialcoats/42", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
    });

    test("gibt das Ergebnis zurück bei Erfolg", async () => {
      mockFetch(true, mockResult);

      const result = await updateSpecialCoatOnClient(42, formData);

      expect(result).toEqual(mockResult);
    });

    test("wirft einen Fehler mit der Server-Nachricht, wenn die Anfrage fehlschlägt", async () => {
      mockFetch(false, { message: "Farbvariante nicht gefunden" });

      await expect(updateSpecialCoatOnClient(42, formData)).rejects.toThrow(
        "Farbvariante nicht gefunden",
      );
    });

    test("wirft einen Fehler, wenn keine Server-Nachricht vorhanden ist", async () => {
      mockFetch(false, {});

      await expect(updateSpecialCoatOnClient(42, formData)).rejects.toThrow();
    });
  });

  // ==========================================
  // deleteSpecialCoatOnClient
  // ==========================================

  describe("deleteSpecialCoatOnClient", () => {
    test("sendet einen DELETE-Request an die korrekte URL", async () => {
      mockFetch(true, {});

      await deleteSpecialCoatOnClient(42);

      expect(fetch).toHaveBeenCalledWith("/api/specialcoats/42", { method: "DELETE" });
    });

    test("löst ohne Rückgabewert auf, wenn das Löschen erfolgreich war", async () => {
      mockFetch(true, {});

      const result = await deleteSpecialCoatOnClient(42);

      expect(result).toBeUndefined();
    });

    test("wirft einen Fehler mit der Server-Nachricht, wenn die Anfrage fehlschlägt", async () => {
      mockFetch(false, { message: "Farbvariante nicht gefunden" });

      await expect(deleteSpecialCoatOnClient(42)).rejects.toThrow("Farbvariante nicht gefunden");
    });

    test("wirft einen Fehler, wenn die Fehler-Antwort kein JSON enthält", async () => {
      vi.stubGlobal(
        "fetch",
        vi.fn().mockResolvedValue({
          ok: false,
          json: vi.fn().mockRejectedValue(new Error("invalid json")),
        }),
      );

      await expect(deleteSpecialCoatOnClient(42)).rejects.toThrow();
    });
  });
});
