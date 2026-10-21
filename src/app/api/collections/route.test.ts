import { describe, test, expect, vi, beforeEach } from "vitest";

vi.mock("server-only", () => ({}));
vi.mock("@/service/CollectionService", () => ({
  getAllCollectionsForAdmin: vi.fn().mockResolvedValue([]),
  createCollection: vi.fn().mockResolvedValue({ id: 1 }),
}));
vi.mock("next-auth", () => ({ getServerSession: vi.fn() }));
vi.mock("@/app/api/auth/[...nextauth]/route", () => ({ authOptions: {} }));
vi.mock("@/utils/roleUtils", () => ({
  hasMinimumRole: vi.fn(),
  isMayor: vi.fn(),
}));

import { GET, POST } from "./route";
import { getServerSession } from "next-auth";
import { hasMinimumRole, isMayor } from "@/utils/roleUtils";
import { createCollection } from "@/service/CollectionService";

describe("GET /api/collections", () => {
  test("returns 200 with array", async () => {
    const res = await GET();
    expect(res.status).toBe(200);
  });
});

describe("POST /api/collections", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  test("returns 403 when not Director", async () => {
    vi.mocked(getServerSession).mockResolvedValue({} as any);
    vi.mocked(isMayor).mockReturnValue(false);
    vi.mocked(hasMinimumRole).mockReturnValue(false);
    const req = new Request("http://localhost/api/collections", {
      method: "POST",
      body: JSON.stringify({ regionId: 1, texts: [{ languageCode: "de", name: "Test" }], stars: 1, requirements: [] }),
      headers: { "Content-Type": "application/json" },
    });
    const res = await POST(req);
    expect(res.status).toBe(403);
  });

  test("returns 400 when texts array is empty", async () => {
    vi.mocked(getServerSession).mockResolvedValue({} as any);
    vi.mocked(isMayor).mockReturnValue(false);
    vi.mocked(hasMinimumRole).mockReturnValue(true);
    const req = new Request("http://localhost/api/collections", {
      method: "POST",
      body: JSON.stringify({ regionId: 1, texts: [], stars: 1, requirements: [] }),
      headers: { "Content-Type": "application/json" },
    });
    const res = await POST(req);
    expect(res.status).toBe(400);
  });

  test("returns 400 when regionId missing", async () => {
    vi.mocked(getServerSession).mockResolvedValue({} as any);
    vi.mocked(isMayor).mockReturnValue(false);
    vi.mocked(hasMinimumRole).mockReturnValue(true);
    const req = new Request("http://localhost/api/collections", {
      method: "POST",
      body: JSON.stringify({ texts: [{ languageCode: "de", name: "Test" }], stars: 1, requirements: [] }),
      headers: { "Content-Type": "application/json" },
    });
    const res = await POST(req);
    expect(res.status).toBe(400);
  });

  test("returns 201 with id on success", async () => {
    vi.mocked(getServerSession).mockResolvedValue({} as any);
    vi.mocked(isMayor).mockReturnValue(false);
    vi.mocked(hasMinimumRole).mockReturnValue(true);
    vi.mocked(createCollection).mockResolvedValue({ id: 99 });
    const req = new Request("http://localhost/api/collections", {
      method: "POST",
      body: JSON.stringify({ regionId: 1, texts: [{ languageCode: "de", name: "Test" }], stars: 1, requirements: [] }),
      headers: { "Content-Type": "application/json" },
    });
    const res = await POST(req);
    expect(res.status).toBe(201);
  });
});
