import { describe, test, expect, vi, beforeEach } from "vitest";
import { PUT, DELETE } from "./route";
import { updateChestBoost, deleteChestBoost } from "@/service/ChestBoostService";

vi.mock("@/service/ChestBoostService", () => ({
  updateChestBoost: vi.fn(),
  deleteChestBoost: vi.fn(),
}));

vi.mock("next-intl/server", () => ({
  getTranslations: vi.fn().mockResolvedValue((key: string) => key),
}));

vi.mock("next-auth/next", () => ({
  getServerSession: vi.fn().mockResolvedValue({ user: { role: "Director", roleId: 2 } }),
}));

vi.mock("@/app/api/auth/[...nextauth]/route", () => ({
  authOptions: {},
}));

const makeParams = (id: string) => ({ params: Promise.resolve({ id }) }) as any;

const validBody = {
  startDate: "2026-01-01",
  endDate: "2026-02-12",
  chestType: "EPIC",
  isEvent: false,
  animalId: 5,
};

describe("PUT /api/chest-boosts/[id]", () => {
  beforeEach(() => vi.clearAllMocks());

  test("aktualisiert einen ChestBoost und gibt 200 zurück", async () => {
    vi.mocked(updateChestBoost).mockResolvedValue({ id: 7 });

    const request = new Request("http://localhost:3000/api/chest-boosts/7", {
      method: "PUT",
      body: JSON.stringify(validBody),
    });

    const response = await PUT(request, makeParams("7"));
    const data = await response.json();

    expect(response.status).toBe(200);
    expect(data).toEqual({ id: 7 });
    expect(updateChestBoost).toHaveBeenCalledWith(7, validBody);
  });

  test("gibt 403 zurück wenn keine Session vorhanden ist", async () => {
    const { getServerSession } = await import("next-auth/next");
    vi.mocked(getServerSession).mockResolvedValueOnce(null);

    const request = new Request("http://localhost:3000/api/chest-boosts/7", {
      method: "PUT",
      body: JSON.stringify(validBody),
    });

    const response = await PUT(request, makeParams("7"));

    expect(response.status).toBe(403);
    expect(updateChestBoost).not.toHaveBeenCalled();
  });

  test("gibt 403 zurück wenn User kein Director ist", async () => {
    const { getServerSession } = await import("next-auth/next");
    vi.mocked(getServerSession).mockResolvedValueOnce({ user: { role: "Member", roleId: 4 } } as any);

    const request = new Request("http://localhost:3000/api/chest-boosts/7", {
      method: "PUT",
      body: JSON.stringify(validBody),
    });

    const response = await PUT(request, makeParams("7"));

    expect(response.status).toBe(403);
    expect(updateChestBoost).not.toHaveBeenCalled();
  });

  test("gibt 403 zurück wenn User Mayor ist (Read-only)", async () => {
    const { getServerSession } = await import("next-auth/next");
    vi.mocked(getServerSession).mockResolvedValueOnce({ user: { role: "Mayor", roleId: 0 } } as any);

    const request = new Request("http://localhost:3000/api/chest-boosts/7", {
      method: "PUT",
      body: JSON.stringify(validBody),
    });

    const response = await PUT(request, makeParams("7"));
    const data = await response.json();

    expect(response.status).toBe(403);
    expect(data.error).toBe("MayorReadonly");
    expect(updateChestBoost).not.toHaveBeenCalled();
  });

  test("gibt 400 zurück bei ungültiger ID", async () => {
    const request = new Request("http://localhost:3000/api/chest-boosts/abc", {
      method: "PUT",
      body: JSON.stringify(validBody),
    });

    const response = await PUT(request, makeParams("abc"));

    expect(response.status).toBe(400);
    expect(updateChestBoost).not.toHaveBeenCalled();
  });

  test("gibt 400 zurück bei ungültigem chestType", async () => {
    const request = new Request("http://localhost:3000/api/chest-boosts/7", {
      method: "PUT",
      body: JSON.stringify({ ...validBody, chestType: "INVALID" }),
    });

    const response = await PUT(request, makeParams("7"));

    expect(response.status).toBe(400);
    expect(updateChestBoost).not.toHaveBeenCalled();
  });

  test("gibt 400 zurück wenn endDate vor startDate liegt", async () => {
    const request = new Request("http://localhost:3000/api/chest-boosts/7", {
      method: "PUT",
      body: JSON.stringify({ ...validBody, endDate: "2025-12-31" }),
    });

    const response = await PUT(request, makeParams("7"));

    expect(response.status).toBe(400);
    expect(updateChestBoost).not.toHaveBeenCalled();
  });

  test("gibt 500 zurück wenn der Service einen Fehler wirft", async () => {
    vi.mocked(updateChestBoost).mockRejectedValue(new Error("DB-Fehler"));

    const request = new Request("http://localhost:3000/api/chest-boosts/7", {
      method: "PUT",
      body: JSON.stringify(validBody),
    });

    const response = await PUT(request, makeParams("7"));

    expect(response.status).toBe(500);
  });
});

describe("DELETE /api/chest-boosts/[id]", () => {
  beforeEach(() => vi.clearAllMocks());

  test("löscht einen ChestBoost und gibt 204 zurück", async () => {
    vi.mocked(deleteChestBoost).mockResolvedValue(undefined);

    const request = new Request("http://localhost:3000/api/chest-boosts/7");
    const response = await DELETE(request, makeParams("7"));

    expect(response.status).toBe(204);
    expect(deleteChestBoost).toHaveBeenCalledWith(7);
  });

  test("gibt 403 zurück wenn keine Session vorhanden ist", async () => {
    const { getServerSession } = await import("next-auth/next");
    vi.mocked(getServerSession).mockResolvedValueOnce(null);

    const request = new Request("http://localhost:3000/api/chest-boosts/7");
    const response = await DELETE(request, makeParams("7"));

    expect(response.status).toBe(403);
    expect(deleteChestBoost).not.toHaveBeenCalled();
  });

  test("gibt 403 zurück wenn User kein Director ist", async () => {
    const { getServerSession } = await import("next-auth/next");
    vi.mocked(getServerSession).mockResolvedValueOnce({ user: { role: "Member", roleId: 4 } } as any);

    const request = new Request("http://localhost:3000/api/chest-boosts/7");
    const response = await DELETE(request, makeParams("7"));

    expect(response.status).toBe(403);
    expect(deleteChestBoost).not.toHaveBeenCalled();
  });

  test("gibt 403 zurück wenn User Mayor ist (Read-only)", async () => {
    const { getServerSession } = await import("next-auth/next");
    vi.mocked(getServerSession).mockResolvedValueOnce({ user: { role: "Mayor", roleId: 0 } } as any);

    const request = new Request("http://localhost:3000/api/chest-boosts/7");
    const response = await DELETE(request, makeParams("7"));
    const data = await response.json();

    expect(response.status).toBe(403);
    expect(data.error).toBe("MayorReadonly");
    expect(deleteChestBoost).not.toHaveBeenCalled();
  });

  test("gibt 400 zurück bei ungültiger ID", async () => {
    const request = new Request("http://localhost:3000/api/chest-boosts/abc");
    const response = await DELETE(request, makeParams("abc"));

    expect(response.status).toBe(400);
    expect(deleteChestBoost).not.toHaveBeenCalled();
  });

  test("gibt 500 zurück wenn der Service einen Fehler wirft", async () => {
    vi.mocked(deleteChestBoost).mockRejectedValue(new Error("Unbekannt"));

    const request = new Request("http://localhost:3000/api/chest-boosts/7");
    const response = await DELETE(request, makeParams("7"));

    expect(response.status).toBe(500);
  });
});
