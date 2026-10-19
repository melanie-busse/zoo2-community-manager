import { describe, test, expect, vi, beforeEach } from "vitest";
import { GET, POST } from "./route";
import { getShopsByRegionId, createShop } from "@/service/RegionService";

vi.mock("@/service/RegionService", () => ({
  getShopsByRegionId: vi.fn(),
  createShop: vi.fn(),
}));
vi.mock("next-intl/server", () => ({
  getTranslations: vi.fn().mockResolvedValue((key: string) => key),
}));
vi.mock("next-auth/next", () => ({
  getServerSession: vi.fn().mockResolvedValue({ user: { role: "Director", roleId: 2 } }),
}));
vi.mock("@/app/api/auth/[...nextauth]/route", () => ({ authOptions: {} }));

const params = Promise.resolve({ id: "5" });

describe("GET /api/regions/[id]/shops", () => {
  beforeEach(() => vi.clearAllMocks());

  test("gibt Shops mit Status 200 zurück", async () => {
    const mockShops = [{ id: 1, name: "Blumenstand", levels: [] }];
    vi.mocked(getShopsByRegionId).mockResolvedValue(mockShops as any);
    const req = new Request("http://localhost/api/regions/5/shops");
    const res = await GET(req, { params });
    expect(res.status).toBe(200);
    expect(await res.json()).toEqual(mockShops);
    expect(getShopsByRegionId).toHaveBeenCalledWith(5);
  });

  test("gibt leeres Array zurück wenn keine Shops vorhanden", async () => {
    vi.mocked(getShopsByRegionId).mockResolvedValue([]);
    const req = new Request("http://localhost/api/regions/5/shops");
    const res = await GET(req, { params });
    expect(res.status).toBe(200);
    expect(await res.json()).toEqual([]);
  });

  test("gibt 400 zurück bei ungültiger Region-ID", async () => {
    const req = new Request("http://localhost/api/regions/abc/shops");
    const res = await GET(req, { params: Promise.resolve({ id: "abc" }) });
    expect(res.status).toBe(400);
    expect(getShopsByRegionId).not.toHaveBeenCalled();
  });

  test("gibt 500 zurück bei Service-Fehler", async () => {
    vi.mocked(getShopsByRegionId).mockRejectedValue(new Error("DB down"));
    const req = new Request("http://localhost/api/regions/5/shops");
    const res = await GET(req, { params });
    expect(res.status).toBe(500);
  });
});

describe("POST /api/regions/[id]/shops", () => {
  beforeEach(() => vi.clearAllMocks());

  const validBody = { name: "Blumenstand", coinsPerClient: 3, levels: [] };

  test("erstellt einen Shop mit Status 201", async () => {
    const created = { id: 10, ...validBody, regionId: 5, levels: [] };
    vi.mocked(createShop).mockResolvedValue(created as any);
    const req = new Request("http://localhost/api/regions/5/shops", {
      method: "POST",
      body: JSON.stringify(validBody),
    });
    const res = await POST(req, { params });
    expect(res.status).toBe(201);
    expect(createShop).toHaveBeenCalledWith(5, validBody);
  });

  test("gibt 400 zurück wenn name fehlt", async () => {
    const req = new Request("http://localhost/api/regions/5/shops", {
      method: "POST",
      body: JSON.stringify({ coinsPerClient: 3, levels: [] }),
    });
    const res = await POST(req, { params });
    expect(res.status).toBe(400);
    expect(createShop).not.toHaveBeenCalled();
  });

  test("gibt 400 zurück wenn name nur Leerzeichen enthält", async () => {
    const req = new Request("http://localhost/api/regions/5/shops", {
      method: "POST",
      body: JSON.stringify({ name: "   ", coinsPerClient: null, levels: [] }),
    });
    const res = await POST(req, { params });
    expect(res.status).toBe(400);
    expect(createShop).not.toHaveBeenCalled();
  });

  test("gibt 403 zurück ohne Director-Rolle", async () => {
    const { getServerSession } = await import("next-auth/next");
    vi.mocked(getServerSession).mockResolvedValueOnce({ user: { role: "Member", roleId: 0 } } as any);
    const req = new Request("http://localhost/api/regions/5/shops", {
      method: "POST",
      body: JSON.stringify(validBody),
    });
    const res = await POST(req, { params });
    expect(res.status).toBe(403);
    expect(createShop).not.toHaveBeenCalled();
  });
});
