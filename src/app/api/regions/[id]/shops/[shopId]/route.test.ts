import { describe, test, expect, vi, beforeEach } from "vitest";
import { PUT, DELETE } from "./route";
import { updateShop, deleteShop } from "@/service/RegionService";

vi.mock("@/service/RegionService", () => ({
  updateShop: vi.fn(),
  deleteShop: vi.fn(),
}));
vi.mock("next-intl/server", () => ({
  getTranslations: vi.fn().mockResolvedValue((key: string) => key),
}));
vi.mock("next-auth/next", () => ({
  getServerSession: vi.fn().mockResolvedValue({ user: { role: "Director", roleId: 2 } }),
}));
vi.mock("@/app/api/auth/[...nextauth]/route", () => ({ authOptions: {} }));

const params = Promise.resolve({ id: "5", shopId: "10" });
const validBody = { name: "Blumenstand", coinsPerClient: 3, levels: [] };

describe("PUT /api/regions/[id]/shops/[shopId]", () => {
  beforeEach(() => vi.clearAllMocks());

  test("aktualisiert einen Shop erfolgreich mit Status 200", async () => {
    const updated = { id: 10, ...validBody, regionId: 5, levels: [] };
    vi.mocked(updateShop).mockResolvedValue(updated as any);
    const req = new Request("http://localhost/api/regions/5/shops/10", {
      method: "PUT",
      body: JSON.stringify(validBody),
    });
    const res = await PUT(req, { params });
    expect(res.status).toBe(200);
    expect(updateShop).toHaveBeenCalledWith(10, validBody);
  });

  test("gibt 400 zurück bei ungültiger shopId", async () => {
    const req = new Request("http://localhost/api/regions/5/shops/abc", {
      method: "PUT",
      body: JSON.stringify(validBody),
    });
    const res = await PUT(req, { params: Promise.resolve({ id: "5", shopId: "abc" }) });
    expect(res.status).toBe(400);
    expect(updateShop).not.toHaveBeenCalled();
  });

  test("gibt 400 zurück wenn name fehlt", async () => {
    const req = new Request("http://localhost/api/regions/5/shops/10", {
      method: "PUT",
      body: JSON.stringify({ coinsPerClient: 3, levels: [] }),
    });
    const res = await PUT(req, { params });
    expect(res.status).toBe(400);
    expect(updateShop).not.toHaveBeenCalled();
  });

  test("gibt 403 zurück ohne Director-Rolle", async () => {
    const { getServerSession } = await import("next-auth/next");
    vi.mocked(getServerSession).mockResolvedValueOnce({ user: { role: "Member", roleId: 0 } } as any);
    const req = new Request("http://localhost/api/regions/5/shops/10", {
      method: "PUT",
      body: JSON.stringify(validBody),
    });
    const res = await PUT(req, { params });
    expect(res.status).toBe(403);
  });
});

describe("DELETE /api/regions/[id]/shops/[shopId]", () => {
  beforeEach(() => vi.clearAllMocks());

  test("löscht einen Shop erfolgreich mit Status 204", async () => {
    vi.mocked(deleteShop).mockResolvedValue(undefined);
    const req = new Request("http://localhost/api/regions/5/shops/10", { method: "DELETE" });
    const res = await DELETE(req, { params });
    expect(res.status).toBe(204);
    expect(deleteShop).toHaveBeenCalledWith(10);
  });

  test("gibt 400 zurück bei ungültiger shopId", async () => {
    const req = new Request("http://localhost/api/regions/5/shops/xyz", { method: "DELETE" });
    const res = await DELETE(req, { params: Promise.resolve({ id: "5", shopId: "xyz" }) });
    expect(res.status).toBe(400);
    expect(deleteShop).not.toHaveBeenCalled();
  });

  test("gibt 403 zurück ohne Director-Rolle", async () => {
    const { getServerSession } = await import("next-auth/next");
    vi.mocked(getServerSession).mockResolvedValueOnce({ user: { role: "Member", roleId: 0 } } as any);
    const req = new Request("http://localhost/api/regions/5/shops/10", { method: "DELETE" });
    const res = await DELETE(req, { params });
    expect(res.status).toBe(403);
  });
});
