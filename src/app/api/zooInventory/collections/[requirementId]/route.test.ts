import { describe, test, expect, vi, beforeEach } from "vitest";
import { PUT } from "./route";
import { prisma } from "@/lib/prisma";

vi.mock("@/lib/prisma", () => ({
  prisma: {
    zooInventoryCollection: {
      upsert: vi.fn(),
    },
  },
}));

vi.mock("next-auth", () => ({
  getServerSession: vi.fn().mockResolvedValue({ user: { id: "5" } }),
}));

vi.mock("@/app/api/auth/[...nextauth]/route", () => ({
  authOptions: {},
}));

const makeRequest = (requirementId: string, body: object) =>
  new Request(`http://localhost/api/zooInventory/collections/${requirementId}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  }) as any;

const makeParams = (requirementId: string) =>
  Promise.resolve({ requirementId });

describe("PUT /api/zooInventory/collections/[requirementId]", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  test("gibt 401 zurück wenn keine Session vorhanden ist", async () => {
    const { getServerSession } = await import("next-auth");
    vi.mocked(getServerSession).mockResolvedValueOnce(null);

    const response = await PUT(makeRequest("42", { completed: true }), { params: makeParams("42") });

    expect(response.status).toBe(401);
    expect(prisma.zooInventoryCollection.upsert).not.toHaveBeenCalled();
  });

  test("führt upsert durch und gibt 200 zurück", async () => {
    vi.mocked(prisma.zooInventoryCollection.upsert).mockResolvedValue({} as any);

    const response = await PUT(makeRequest("42", { completed: true }), { params: makeParams("42") });
    const data = await response.json();

    expect(response.status).toBe(200);
    expect(data).toEqual({ ok: true });
  });

  test("ruft upsert mit korrekten Werten auf", async () => {
    vi.mocked(prisma.zooInventoryCollection.upsert).mockResolvedValue({} as any);

    await PUT(makeRequest("42", { completed: true }), { params: makeParams("42") });

    expect(prisma.zooInventoryCollection.upsert).toHaveBeenCalledWith({
      where: {
        userId_collectionRequirementId: {
          userId: 5,
          collectionRequirementId: 42,
        },
      },
      update: { completed: true },
      create: { userId: 5, collectionRequirementId: 42, completed: true },
    });
  });

  test("setzt completed auf false beim Abwählen", async () => {
    vi.mocked(prisma.zooInventoryCollection.upsert).mockResolvedValue({} as any);

    await PUT(makeRequest("10", { completed: false }), { params: makeParams("10") });

    expect(prisma.zooInventoryCollection.upsert).toHaveBeenCalledWith(
      expect.objectContaining({
        update: { completed: false },
        create: expect.objectContaining({ completed: false }),
      }),
    );
  });
});
