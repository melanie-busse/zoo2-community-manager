import { describe, test, expect, vi, beforeEach } from "vitest";
import { GET, POST } from "./route";
import { getAllChestBoosts, createChestBoost } from "@/service/ChestBoostService";

vi.mock("@/service/ChestBoostService", () => ({
  getAllChestBoosts: vi.fn(),
  createChestBoost: vi.fn(),
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

const validBody = {
  startDate: "2026-01-01",
  endDate: "2026-02-12",
  chestType: "EPIC",
  isEvent: false,
  animalId: 5,
};

describe("GET /api/chest-boosts", () => {
  beforeEach(() => vi.clearAllMocks());

  test("gibt alle Boosts zurück (200)", async () => {
    const mockBoosts = [{ id: 1 }, { id: 2 }];
    vi.mocked(getAllChestBoosts).mockResolvedValue(mockBoosts as any);

    const request = new Request("http://localhost:3000/api/chest-boosts?locale=de");
    const response = await GET(request);
    const data = await response.json();

    expect(response.status).toBe(200);
    expect(data).toEqual(mockBoosts);
  });

  test("verwendet locale aus Query-Parameter", async () => {
    vi.mocked(getAllChestBoosts).mockResolvedValue([]);

    const request = new Request("http://localhost:3000/api/chest-boosts?locale=en");
    await GET(request);

    expect(getAllChestBoosts).toHaveBeenCalledWith("en");
  });

  test("gibt 500 zurück wenn der Service einen Fehler wirft", async () => {
    vi.mocked(getAllChestBoosts).mockRejectedValue(new Error("DB-Fehler"));

    const request = new Request("http://localhost:3000/api/chest-boosts");
    const response = await GET(request);

    expect(response.status).toBe(500);
  });
});

describe("POST /api/chest-boosts", () => {
  beforeEach(() => vi.clearAllMocks());

  test("erstellt einen ChestBoost und gibt 201 zurück", async () => {
    vi.mocked(createChestBoost).mockResolvedValue({ id: 42 });

    const request = new Request("http://localhost:3000/api/chest-boosts", {
      method: "POST",
      body: JSON.stringify(validBody),
    });

    const response = await POST(request);
    const data = await response.json();

    expect(response.status).toBe(201);
    expect(data).toEqual({ id: 42 });
    expect(createChestBoost).toHaveBeenCalledWith(validBody);
  });

  test("gibt 403 zurück wenn keine Session vorhanden ist", async () => {
    const { getServerSession } = await import("next-auth/next");
    vi.mocked(getServerSession).mockResolvedValueOnce(null);

    const request = new Request("http://localhost:3000/api/chest-boosts", {
      method: "POST",
      body: JSON.stringify(validBody),
    });

    const response = await POST(request);

    expect(response.status).toBe(403);
    expect(createChestBoost).not.toHaveBeenCalled();
  });

  test("gibt 403 zurück wenn User kein Director ist", async () => {
    const { getServerSession } = await import("next-auth/next");
    vi.mocked(getServerSession).mockResolvedValueOnce({ user: { role: "Member", roleId: 4 } } as any);

    const request = new Request("http://localhost:3000/api/chest-boosts", {
      method: "POST",
      body: JSON.stringify(validBody),
    });

    const response = await POST(request);

    expect(response.status).toBe(403);
    expect(createChestBoost).not.toHaveBeenCalled();
  });

  test("gibt 403 zurück wenn User Mayor ist (Read-only)", async () => {
    const { getServerSession } = await import("next-auth/next");
    vi.mocked(getServerSession).mockResolvedValueOnce({ user: { role: "Mayor", roleId: 0 } } as any);

    const request = new Request("http://localhost:3000/api/chest-boosts", {
      method: "POST",
      body: JSON.stringify(validBody),
    });

    const response = await POST(request);
    const data = await response.json();

    expect(response.status).toBe(403);
    expect(data.error).toBe("MayorReadonly");
    expect(createChestBoost).not.toHaveBeenCalled();
  });

  test("gibt 400 zurück wenn animalId fehlt", async () => {
    const { animalId: _, ...bodyWithoutAnimal } = validBody;

    const request = new Request("http://localhost:3000/api/chest-boosts", {
      method: "POST",
      body: JSON.stringify(bodyWithoutAnimal),
    });

    const response = await POST(request);

    expect(response.status).toBe(400);
    expect(createChestBoost).not.toHaveBeenCalled();
  });

  test("gibt 400 zurück bei ungültigem chestType", async () => {
    const request = new Request("http://localhost:3000/api/chest-boosts", {
      method: "POST",
      body: JSON.stringify({ ...validBody, chestType: "INVALID" }),
    });

    const response = await POST(request);

    expect(response.status).toBe(400);
    expect(createChestBoost).not.toHaveBeenCalled();
  });

  test("gibt 400 zurück wenn endDate vor startDate liegt", async () => {
    const request = new Request("http://localhost:3000/api/chest-boosts", {
      method: "POST",
      body: JSON.stringify({ ...validBody, endDate: "2025-12-31" }),
    });

    const response = await POST(request);

    expect(response.status).toBe(400);
    expect(createChestBoost).not.toHaveBeenCalled();
  });

  test("gibt 400 zurück wenn endDate gleich startDate ist", async () => {
    const request = new Request("http://localhost:3000/api/chest-boosts", {
      method: "POST",
      body: JSON.stringify({ ...validBody, endDate: validBody.startDate }),
    });

    const response = await POST(request);

    expect(response.status).toBe(400);
    expect(createChestBoost).not.toHaveBeenCalled();
  });

  test("gibt 500 zurück wenn der Service einen Fehler wirft", async () => {
    vi.mocked(createChestBoost).mockRejectedValue(new Error("DB-Fehler"));

    const request = new Request("http://localhost:3000/api/chest-boosts", {
      method: "POST",
      body: JSON.stringify(validBody),
    });

    const response = await POST(request);

    expect(response.status).toBe(500);
  });
});
