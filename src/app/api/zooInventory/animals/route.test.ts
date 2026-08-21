import { describe, test, expect, vi, beforeEach } from "vitest";
import { POST } from "./route";
import { updateZooInventoryAnimal } from "@/service/ZooInventoryService";

vi.mock("@/service/ZooInventoryService", () => ({
  updateZooInventoryAnimal: vi.fn(),
}));

vi.mock("next-intl/server", () => ({
  getTranslations: vi.fn().mockResolvedValue((key: string) => key),
}));

vi.mock("next-auth/next", () => ({
  getServerSession: vi.fn().mockResolvedValue({ user: { id: 1 } }),
}));

vi.mock("@/app/api/auth/[...nextauth]/route", () => ({
  authOptions: {},
}));

describe("POST /api/zooInventory/animals", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  test("speichert Inventardaten und gibt 200 zurück", async () => {
    const mockResult = { id: 1, userid: 1, animalId: 10, count: 2 };
    vi.mocked(updateZooInventoryAnimal).mockResolvedValue(mockResult as any);

    const request = new Request("http://localhost:3000/api/zooInventory/animals", {
      method: "POST",
      body: JSON.stringify({ animalId: 10, field: "count", value: 2 }),
    });

    const response = await POST(request);
    const data = await response.json();

    expect(response.status).toBe(200);
    expect(data.success).toBe(true);
    expect(data.data).toEqual(mockResult);
    expect(updateZooInventoryAnimal).toHaveBeenCalledWith(1, 10, "count", 2);
  });

  test("gibt 401 zurück wenn keine Session vorhanden ist", async () => {
    const { getServerSession } = await import("next-auth/next");
    vi.mocked(getServerSession).mockResolvedValueOnce(null);

    const request = new Request("http://localhost:3000/api/zooInventory/animals", {
      method: "POST",
      body: JSON.stringify({ animalId: 10, field: "count", value: 1 }),
    });

    const response = await POST(request);

    expect(response.status).toBe(401);
    expect(updateZooInventoryAnimal).not.toHaveBeenCalled();
  });

  test("gibt 400 zurück wenn animalId fehlt", async () => {
    const request = new Request("http://localhost:3000/api/zooInventory/animals", {
      method: "POST",
      body: JSON.stringify({ field: "count", value: 1 }),
    });

    const response = await POST(request);

    expect(response.status).toBe(400);
    expect(updateZooInventoryAnimal).not.toHaveBeenCalled();
  });

  test("gibt 400 zurück wenn field fehlt", async () => {
    const request = new Request("http://localhost:3000/api/zooInventory/animals", {
      method: "POST",
      body: JSON.stringify({ animalId: 10, value: 1 }),
    });

    const response = await POST(request);

    expect(response.status).toBe(400);
    expect(updateZooInventoryAnimal).not.toHaveBeenCalled();
  });

  test("gibt 500 zurück wenn der Service einen Fehler wirft", async () => {
    vi.mocked(updateZooInventoryAnimal).mockRejectedValue(new Error("DB-Fehler"));

    const request = new Request("http://localhost:3000/api/zooInventory/animals", {
      method: "POST",
      body: JSON.stringify({ animalId: 10, field: "level10", value: true }),
    });

    const response = await POST(request);

    expect(response.status).toBe(500);
  });
});