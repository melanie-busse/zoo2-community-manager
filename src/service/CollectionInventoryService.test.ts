import { describe, test, expect, vi, beforeEach } from "vitest";
import { prisma } from "@/lib/prisma";
import { getAllCollections } from "@/service/CollectionService";
import { getCollectionsWithUserProgress } from "./CollectionInventoryService";

vi.mock("server-only", () => ({}));

vi.mock("@/service/CollectionService", () => ({
  getAllCollections: vi.fn(),
}));

vi.mock("@/lib/prisma", () => ({
  prisma: {
    zooInventoryCollection: {
      findMany: vi.fn(),
    },
  },
}));

const makeCollection = (id: number, reqIds: number[]) => ({
  id,
  identifier: `collection-${id}`,
  stars: 1,
  name: `Collection ${id}`,
  region: { id: 1, identifier: "grassland", name: "Grasland" },
  requirements: reqIds.map((rid) => ({
    id: rid,
    type: "ANIMAL" as const,
    requiredLevel: null,
    itemName: "",
    sortOrder: 0,
    animal: null,
    specialCoat: null,
    decoration: null,
  })),
  rewardAnimal: null,
  rewardSpecialCoat: null,
});

describe("CollectionInventoryService", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  test("gibt Collections ohne Fortschritt zurück wenn keine DB-Einträge vorhanden sind", async () => {
    vi.mocked(getAllCollections).mockResolvedValue([makeCollection(1, [10, 11])]);
    vi.mocked(prisma.zooInventoryCollection.findMany).mockResolvedValue([]);

    const result = await getCollectionsWithUserProgress("de", 42);

    expect(result).toHaveLength(1);
    expect(result[0].completedRequirementIds.size).toBe(0);
  });

  test("gibt completedRequirementIds korrekt befüllt zurück", async () => {
    vi.mocked(getAllCollections).mockResolvedValue([makeCollection(1, [10, 11, 12])]);
    vi.mocked(prisma.zooInventoryCollection.findMany).mockResolvedValue([
      { collectionRequirementId: 10 } as any,
      { collectionRequirementId: 12 } as any,
    ]);

    const result = await getCollectionsWithUserProgress("de", 42);

    expect(result[0].completedRequirementIds).toEqual(new Set([10, 12]));
    expect(result[0].completedRequirementIds.has(11)).toBe(false);
  });

  test("fragt Prisma mit allen Requirement-IDs und der userId ab", async () => {
    vi.mocked(getAllCollections).mockResolvedValue([
      makeCollection(1, [1, 2]),
      makeCollection(2, [3, 4]),
    ]);
    vi.mocked(prisma.zooInventoryCollection.findMany).mockResolvedValue([]);

    await getCollectionsWithUserProgress("de", 7);

    expect(prisma.zooInventoryCollection.findMany).toHaveBeenCalledWith({
      where: {
        userId: 7,
        collectionRequirementId: { in: [1, 2, 3, 4] },
        completed: true,
      },
      select: { collectionRequirementId: true },
    });
  });

  test("verteilt abgeschlossene Requirements auf die richtige Collection", async () => {
    vi.mocked(getAllCollections).mockResolvedValue([
      makeCollection(1, [1, 2]),
      makeCollection(2, [3, 4]),
    ]);
    vi.mocked(prisma.zooInventoryCollection.findMany).mockResolvedValue([
      { collectionRequirementId: 2 } as any,
      { collectionRequirementId: 3 } as any,
    ]);

    const result = await getCollectionsWithUserProgress("de", 1);

    expect(result[0].completedRequirementIds).toEqual(new Set([2]));
    expect(result[1].completedRequirementIds).toEqual(new Set([3]));
  });

  test("gibt leeres Array zurück wenn es keine Collections gibt", async () => {
    vi.mocked(getAllCollections).mockResolvedValue([]);
    vi.mocked(prisma.zooInventoryCollection.findMany).mockResolvedValue([]);

    const result = await getCollectionsWithUserProgress("de", 1);

    expect(result).toEqual([]);
  });
});
