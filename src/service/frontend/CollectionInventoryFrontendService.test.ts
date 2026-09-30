import { describe, test, expect, vi, beforeEach } from "vitest";
import { toggleCollectionRequirement } from "./CollectionInventoryFrontendService";

describe("CollectionInventoryFrontendService", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.unstubAllGlobals();
  });

  test("sendet einen PUT-Request an die korrekte URL", async () => {
    vi.stubGlobal("fetch", vi.fn().mockResolvedValue({ ok: true }));

    await toggleCollectionRequirement(42, true);

    expect(fetch).toHaveBeenCalledWith("/api/zooInventory/collections/42", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ completed: true }),
    });
  });

  test("sendet completed: false beim Abwählen", async () => {
    vi.stubGlobal("fetch", vi.fn().mockResolvedValue({ ok: true }));

    await toggleCollectionRequirement(7, false);

    expect(fetch).toHaveBeenCalledWith("/api/zooInventory/collections/7", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ completed: false }),
    });
  });

  test("löst ohne Rückgabewert auf", async () => {
    vi.stubGlobal("fetch", vi.fn().mockResolvedValue({ ok: true }));

    const result = await toggleCollectionRequirement(1, true);

    expect(result).toBeUndefined();
  });
});
