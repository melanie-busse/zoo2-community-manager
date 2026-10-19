import { describe, test, expect, vi, beforeEach } from "vitest";
import { createShopOnClient, updateShopOnClient, deleteShopOnClient } from "@/service/frontend/Shop";

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

describe("Shop Frontend Service", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.unstubAllGlobals();
  });

  describe("createShopOnClient", () => {
    const shopInput = { name: "Blumenstand", coinsPerClient: 3, levels: [] };
    const created = { id: 1, name: "Blumenstand", coinsPerClient: 3, levels: [] };

    test("sendet POST an /api/shops", async () => {
      mockFetch(true, created);
      await createShopOnClient(shopInput);
      expect(fetch).toHaveBeenCalledWith("/api/shops", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(shopInput),
      });
    });

    test("gibt das Ergebnis zurück bei Erfolg", async () => {
      mockFetch(true, created);
      const result = await createShopOnClient(shopInput);
      expect(result).toEqual(created);
    });

    test("wirft Fehler bei fehlgeschlagenem Request", async () => {
      mockFetch(false, { message: "Name ist Pflichtfeld" });
      await expect(createShopOnClient(shopInput)).rejects.toThrow("Name ist Pflichtfeld");
    });
  });

  describe("updateShopOnClient", () => {
    const shopInput = { name: "Blumenstand (neu)", coinsPerClient: 5, levels: [] };

    test("sendet PUT an /api/shops/10", async () => {
      mockFetch(true, { id: 10 });
      await updateShopOnClient(10, shopInput);
      expect(fetch).toHaveBeenCalledWith("/api/shops/10", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(shopInput),
      });
    });

    test("wirft Fehler bei fehlgeschlagenem Request", async () => {
      mockFetch(false, { message: "Shop nicht gefunden" });
      await expect(updateShopOnClient(10, shopInput)).rejects.toThrow("Shop nicht gefunden");
    });
  });

  describe("deleteShopOnClient", () => {
    test("sendet DELETE an /api/shops/10", async () => {
      vi.stubGlobal("fetch", vi.fn().mockResolvedValue({ ok: true }));
      await deleteShopOnClient(10);
      expect(fetch).toHaveBeenCalledWith("/api/shops/10", { method: "DELETE" });
    });

    test("löst ohne Rückgabewert auf bei Erfolg", async () => {
      vi.stubGlobal("fetch", vi.fn().mockResolvedValue({ ok: true }));
      const result = await deleteShopOnClient(10);
      expect(result).toBeUndefined();
    });

    test("wirft Fehler bei fehlgeschlagenem Request", async () => {
      mockFetch(false, { message: "Shop nicht gefunden" });
      await expect(deleteShopOnClient(10)).rejects.toThrow("Shop nicht gefunden");
    });
  });
});
