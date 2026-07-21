import { describe, test, expect, vi, beforeEach } from "vitest";
import { POST } from "./route";

vi.mock("@/service/FandomService", () => ({
  syncBreedingChancesFromApi: vi.fn(),
}));

import { syncBreedingChancesFromApi } from "@/service/FandomService";

describe("POST /api/admin/sync-breeding-chances", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  test("returns 200 on success", async () => {
    vi.mocked(syncBreedingChancesFromApi).mockResolvedValue(undefined);

    const res = await POST();
    const body = await res.json();

    expect(res.status).toBe(200);
    expect(body.success).toBe(true);
  });

  test("returns 500 when sync throws", async () => {
    vi.mocked(syncBreedingChancesFromApi).mockRejectedValue(new Error("Wiki unavailable"));

    const res = await POST();
    const body = await res.json();

    expect(res.status).toBe(500);
    expect(body.error).toBe("Wiki unavailable");
  });

  test("returns generic message when error has no message", async () => {
    vi.mocked(syncBreedingChancesFromApi).mockRejectedValue({});

    const res = await POST();
    const body = await res.json();

    expect(res.status).toBe(500);
    expect(body.error).toBe("Internal server error");
  });
});
