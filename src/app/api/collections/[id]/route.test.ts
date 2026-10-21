import { describe, test, expect, vi, beforeEach } from "vitest";

vi.mock("server-only", () => ({}));
vi.mock("@/service/CollectionService", () => ({
  updateCollection: vi.fn().mockResolvedValue(undefined),
  deleteCollection: vi.fn().mockResolvedValue(undefined),
}));
vi.mock("next-auth", () => ({ getServerSession: vi.fn() }));
vi.mock("@/app/api/auth/[...nextauth]/route", () => ({ authOptions: {} }));
vi.mock("@/utils/roleUtils", () => ({
  hasMinimumRole: vi.fn(),
  isMayor: vi.fn(),
}));

import { PUT, DELETE } from "./route";
import { getServerSession } from "next-auth";
import { hasMinimumRole, isMayor } from "@/utils/roleUtils";

const params = { params: Promise.resolve({ id: "5" }) };

describe("DELETE /api/collections/[id]", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  test("returns 403 when not Director", async () => {
    vi.mocked(getServerSession).mockResolvedValue({} as any);
    vi.mocked(isMayor).mockReturnValue(false);
    vi.mocked(hasMinimumRole).mockReturnValue(false);
    const res = await DELETE(new Request("http://localhost"), params);
    expect(res.status).toBe(403);
  });

  test("returns 204 on success", async () => {
    vi.mocked(getServerSession).mockResolvedValue({} as any);
    vi.mocked(isMayor).mockReturnValue(false);
    vi.mocked(hasMinimumRole).mockReturnValue(true);
    const res = await DELETE(new Request("http://localhost"), params);
    expect(res.status).toBe(204);
  });
});

describe("PUT /api/collections/[id]", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  test("returns 403 when not Director", async () => {
    vi.mocked(getServerSession).mockResolvedValue({} as any);
    vi.mocked(isMayor).mockReturnValue(false);
    vi.mocked(hasMinimumRole).mockReturnValue(false);
    const req = new Request("http://localhost", {
      method: "PUT",
      body: JSON.stringify({ regionId: 1, texts: [{ languageCode: "de", name: "Test" }], stars: 1, requirements: [] }),
      headers: { "Content-Type": "application/json" },
    });
    const res = await PUT(req, params);
    expect(res.status).toBe(403);
  });

  test("returns 400 when texts empty", async () => {
    vi.mocked(getServerSession).mockResolvedValue({} as any);
    vi.mocked(isMayor).mockReturnValue(false);
    vi.mocked(hasMinimumRole).mockReturnValue(true);
    const req = new Request("http://localhost", {
      method: "PUT",
      body: JSON.stringify({ regionId: 1, texts: [], stars: 1, requirements: [] }),
      headers: { "Content-Type": "application/json" },
    });
    const res = await PUT(req, params);
    expect(res.status).toBe(400);
  });

  test("returns 200 with id on success", async () => {
    vi.mocked(getServerSession).mockResolvedValue({} as any);
    vi.mocked(isMayor).mockReturnValue(false);
    vi.mocked(hasMinimumRole).mockReturnValue(true);
    const req = new Request("http://localhost", {
      method: "PUT",
      body: JSON.stringify({ regionId: 1, texts: [{ languageCode: "de", name: "Test" }], stars: 1, requirements: [] }),
      headers: { "Content-Type": "application/json" },
    });
    const res = await PUT(req, params);
    expect(res.status).toBe(200);
  });
});
