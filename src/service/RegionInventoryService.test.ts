import { vi, describe, test, expect, beforeEach } from "vitest";
import { prisma } from "@/lib/prisma";

import { getRegionsWithInventory, upsertRegionInventory } from "./RegionInventoryService";

vi.mock("server-only", () => ({}));

vi.mock("@/lib/prisma", () => ({
  prisma: {
    region: {
      findMany: vi.fn(),
    },
    zooInventoryRegion: {
      findMany: vi.fn(),
      upsert: vi.fn(),
    },
  },
}));

const MOCK_REGION = {
  id: 1,
  identifier: "MainZoo",
  regionTexts: [{ name: "Hauptzoo" }],
  breedingCenterSlots: [],
  admissionsBooths: [],
  guestLounges: [],
};

describe("getRegionsWithInventory", () => {
  beforeEach(() => vi.clearAllMocks());

  test("gibt null als inventory zurück wenn keine Zeile existiert", async () => {
    vi.mocked(prisma.region.findMany).mockResolvedValue([MOCK_REGION] as any);
    vi.mocked(prisma.zooInventoryRegion.findMany).mockResolvedValue([]);

    const result = await getRegionsWithInventory(1, "de");

    expect(result).toHaveLength(1);
    expect(result[0].inventory).toBeNull();
    expect(result[0].region.id).toBe(1);
  });

  test("merged eine vorhandene Inventarzeile korrekt", async () => {
    vi.mocked(prisma.region.findMany).mockResolvedValue([MOCK_REGION] as any);
    vi.mocked(prisma.zooInventoryRegion.findMany).mockResolvedValue([
      {
        userid: 1,
        regionId: 1,
        owned: true,
        breedingCenterSlots: 2,
        admissionsBoothLevel: 1,
        adminBuilding: false,
        visitorCenter: true,
        transportStation: false,
        guestLounge: false,
      },
    ] as any);

    const result = await getRegionsWithInventory(1, "de");

    expect(result[0].inventory?.owned).toBe(true);
    expect(result[0].inventory?.breedingCenterSlots).toBe(2);
    expect(result[0].inventory?.visitorCenter).toBe(true);
  });

  test("ruft findMany mit korrekten Includes auf", async () => {
    vi.mocked(prisma.region.findMany).mockResolvedValue([]);
    vi.mocked(prisma.zooInventoryRegion.findMany).mockResolvedValue([]);

    await getRegionsWithInventory(1, "de");

    expect(prisma.region.findMany).toHaveBeenCalledWith(
      expect.objectContaining({
        include: expect.objectContaining({
          regionTexts: expect.objectContaining({ where: { languageCode: "de" } }),
          breedingCenterSlots: true,
          admissionsBooths: expect.objectContaining({ orderBy: { booth_level: "asc" } }),
          guestLounges: true,
        }),
        orderBy: { id: "asc" },
      }),
    );
  });
});

describe("upsertRegionInventory", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(prisma.zooInventoryRegion.upsert).mockResolvedValue({} as any);
  });

  test("ruft upsert mit korrektem where und update-Payload auf", async () => {
    await upsertRegionInventory(1, 5, "owned", true);

    expect(prisma.zooInventoryRegion.upsert).toHaveBeenCalledWith(
      expect.objectContaining({
        where: { userid_regionId: { userid: 1, regionId: 5 } },
        update: { owned: true },
      }),
    );
  });

  test("create-Payload hat alle Felder mit korrekten Defaults", async () => {
    await upsertRegionInventory(1, 5, "adminBuilding", true);

    const call = vi.mocked(prisma.zooInventoryRegion.upsert).mock.calls[0][0];
    expect(call.create).toEqual({
      userid: 1,
      regionId: 5,
      owned: false,
      breedingCenterSlots: null,
      admissionsBoothLevel: null,
      adminBuilding: true,
      visitorCenter: false,
      transportStation: false,
      guestLounge: false,
    });
  });

  test("create-Payload setzt Int-Felder korrekt", async () => {
    await upsertRegionInventory(1, 5, "breedingCenterSlots", 3);

    const call = vi.mocked(prisma.zooInventoryRegion.upsert).mock.calls[0][0];
    expect(call.create.breedingCenterSlots).toBe(3);
    expect(call.create.owned).toBe(false);
  });
});
