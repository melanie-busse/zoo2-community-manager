import { describe, test, expect, vi, beforeEach } from "vitest";
import { updateRegionInventoryOnClient } from "@/service/frontend/RegionInventory";

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

describe("updateRegionInventoryOnClient", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.unstubAllGlobals();
  });

  test("sendet einen POST-Request mit dem korrekten Body", async () => {
    mockFetch(true, { success: true });

    await updateRegionInventoryOnClient(3, "owned", true);

    expect(fetch).toHaveBeenCalledWith("/api/zooInventory/regions", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ regionId: 3, field: "owned", value: true }),
    });
  });

  test("löst ohne Rückgabewert auf bei Erfolg", async () => {
    mockFetch(true, { success: true });

    const result = await updateRegionInventoryOnClient(3, "owned", true);

    expect(result).toBeUndefined();
  });

  test("wirft einen Fehler bei nicht-ok Antwort", async () => {
    mockFetch(false, { message: "Nicht autorisiert" });

    await expect(updateRegionInventoryOnClient(3, "owned", true)).rejects.toThrow();
  });
});
