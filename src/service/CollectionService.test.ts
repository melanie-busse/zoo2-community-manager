import { describe, test, expect, vi, beforeEach } from "vitest";

vi.mock("server-only", () => ({}));

const txMock = {
  collection: { create: vi.fn(), update: vi.fn() },
  collectionText: { deleteMany: vi.fn(), createMany: vi.fn() },
  collectionRequirement: { deleteMany: vi.fn(), createMany: vi.fn() },
};

vi.mock("@/lib/prisma", () => ({
  prisma: {
    $transaction: vi.fn((cb: any) => cb(txMock)),
    collection: { findMany: vi.fn(), delete: vi.fn() },
    collectionText: { deleteMany: vi.fn(), createMany: vi.fn() },
    collectionRequirement: { deleteMany: vi.fn(), createMany: vi.fn() },
    contestStatue: { findMany: vi.fn() },
  },
}));

import { prisma } from "@/lib/prisma";
import {
  createCollection,
  updateCollection,
  deleteCollection,
  getAllContestStatues,
} from "@/service/CollectionService";

const prismaMock = prisma as any;

const baseInput = {
  regionId: 1,
  rewardAnimalId: null,
  rewardSpecialCoatId: null,
  stars: 2,
  texts: [{ languageCode: "de", name: "Mein Album" }],
  requirements: [{ type: "ANIMAL" as const, animalId: 5, statueId: null, requiredLevel: 3, sortOrder: 0 }],
};

describe("CollectionService", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    txMock.collection.create.mockResolvedValue({ id: 42 });
    txMock.collectionText.deleteMany.mockResolvedValue({});
    txMock.collectionRequirement.deleteMany.mockResolvedValue({});
    txMock.collectionText.createMany.mockResolvedValue({});
    txMock.collectionRequirement.createMany.mockResolvedValue({});
    txMock.collection.update.mockResolvedValue({});
    prismaMock.collection.delete.mockResolvedValue({});
  });

  test("createCollection slugifies first text name as identifier", async () => {
    await createCollection(baseInput);
    expect(txMock.collection.create).toHaveBeenCalledWith(
      expect.objectContaining({
        data: expect.objectContaining({ identifier: "mein_album" }),
      }),
    );
  });

  test("createCollection runs inside a transaction", async () => {
    await createCollection(baseInput);
    expect(prismaMock.$transaction).toHaveBeenCalledTimes(1);
  });

  test("createCollection returns the new collection id", async () => {
    const result = await createCollection(baseInput);
    expect(result).toEqual({ id: 42 });
  });

  test("updateCollection deletes texts and requirements before recreating", async () => {
    await updateCollection(7, baseInput);
    expect(txMock.collectionText.deleteMany).toHaveBeenCalledWith({ where: { collectionId: 7 } });
    expect(txMock.collectionRequirement.deleteMany).toHaveBeenCalledWith({ where: { collectionId: 7 } });
    expect(txMock.collectionText.createMany).toHaveBeenCalled();
    expect(txMock.collectionRequirement.createMany).toHaveBeenCalled();
  });

  test("deleteCollection calls prisma.collection.delete with id", async () => {
    await deleteCollection(9);
    expect(prismaMock.collection.delete).toHaveBeenCalledWith({ where: { id: 9 } });
  });

  test("getAllContestStatues returns array with id, animalName, contestName", async () => {
    prismaMock.contestStatue.findMany.mockResolvedValue([
      {
        id: 1,
        animal: { animaltext: [{ animalName: "Löwe" }], identifier: "lion" },
        contest: { endDate: new Date("2024-03-01") },
      },
    ]);
    const result = await getAllContestStatues();
    expect(result).toEqual([{ id: 1, animalName: "Löwe", contestName: "2024" }]);
  });
});
