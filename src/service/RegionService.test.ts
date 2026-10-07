import { vi, describe, test, expect, beforeEach } from "vitest";
import { prisma } from "@/lib/prisma";

import { getAllRegions, getRegionByIdForEdit, deleteRegion } from "./RegionService";

vi.mock("server-only", () => ({}));

vi.mock("@/lib/prisma", () => ({
  prisma: {
    $transaction: vi.fn().mockImplementation((ops: Promise<any>[]) => Promise.all(ops)),
    region: {
      findMany: vi.fn(),
      findUnique: vi.fn(),
      delete: vi.fn(),
    },
    terrain: { findMany: vi.fn().mockResolvedValue([]) },
    regionText: { deleteMany: vi.fn() },
    admissionsBooth: { deleteMany: vi.fn() },
    breedingCenterSlot: { deleteMany: vi.fn() },
    breedingCenter: { deleteMany: vi.fn() },
    adminBuilding: { deleteMany: vi.fn() },
    visitorCenter: { deleteMany: vi.fn() },
    transportStation: { deleteMany: vi.fn() },
    guestLounge: { deleteMany: vi.fn() },
  },
}));

describe("RegionService", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  test("getAllRegions gibt Regionen mit lokalisierten Texten zurück", async () => {
    const mockRegions = [
      { id: 1, identifier: "main-zoo", regionTexts: [{ name: "Hauptzoo", languageCode: "de" }] },
      { id: 2, identifier: "tannenhain", regionTexts: [{ name: "Tannenhain", languageCode: "de" }] },
    ];

    vi.mocked(prisma.region.findMany).mockResolvedValue(mockRegions as any);

    const result = await getAllRegions("de");

    expect(prisma.region.findMany).toHaveBeenCalledWith(
      expect.objectContaining({
        include: expect.objectContaining({
          regionTexts: { where: { languageCode: "de" } },
        }),
        orderBy: { id: "asc" },
      }),
    );
    expect(result).toHaveLength(2);
    expect(result[0]).toMatchObject({ id: 1, identifier: "main-zoo" });
  });

  test("getAllRegions verwendet Standardlocale 'de'", async () => {
    vi.mocked(prisma.region.findMany).mockResolvedValue([]);

    await getAllRegions();

    expect(prisma.region.findMany).toHaveBeenCalledWith(
      expect.objectContaining({
        include: expect.objectContaining({
          regionTexts: { where: { languageCode: "de" } },
        }),
        orderBy: { id: "asc" },
      }),
    );
  });

  test("getAllRegions gibt leeres Array zurück bei Datenbankfehler", async () => {
    vi.mocked(prisma.region.findMany).mockRejectedValue(new Error("DB error"));

    const result = await getAllRegions("de");

    expect(result).toEqual([]);
  });
});

describe("getRegionByIdForEdit", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  test("lädt alle regionTexts ohne Locale-Filter", async () => {
    const mockRegion = {
      id: 1,
      identifier: "MainZoo",
      regionTexts: [
        { languageCode: "de", name: "Hauptzoo" },
        { languageCode: "en", name: "Main Zoo" },
      ],
    };
    vi.mocked(prisma.region.findUnique).mockResolvedValue(mockRegion as any);

    const result = await getRegionByIdForEdit(1);

    expect(prisma.region.findUnique).toHaveBeenCalledWith({
      where: { id: 1 },
      include: expect.objectContaining({
        regionTexts: true,
      }),
    });
    expect(result?.regionTexts).toHaveLength(2);
  });

  test("gibt null zurück bei Datenbankfehler", async () => {
    vi.mocked(prisma.region.findUnique).mockRejectedValue(new Error("DB error"));

    const result = await getRegionByIdForEdit(99);

    expect(result).toBeNull();
  });
});

describe("deleteRegion", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(prisma.regionText.deleteMany).mockResolvedValue({ count: 0 });
    vi.mocked(prisma.admissionsBooth.deleteMany).mockResolvedValue({ count: 0 });
    vi.mocked(prisma.breedingCenterSlot.deleteMany).mockResolvedValue({ count: 0 });
    vi.mocked(prisma.breedingCenter.deleteMany).mockResolvedValue({ count: 0 });
    vi.mocked(prisma.adminBuilding.deleteMany).mockResolvedValue({ count: 0 });
    vi.mocked(prisma.visitorCenter.deleteMany).mockResolvedValue({ count: 0 });
    vi.mocked(prisma.transportStation.deleteMany).mockResolvedValue({ count: 0 });
    vi.mocked(prisma.guestLounge.deleteMany).mockResolvedValue({ count: 0 });
    vi.mocked(prisma.region.delete).mockResolvedValue({} as any);
  });

  test("löscht alle abhängigen Datensätze in einer Transaktion", async () => {
    await deleteRegion(5);

    expect(prisma.$transaction).toHaveBeenCalledTimes(1);
    expect(prisma.regionText.deleteMany).toHaveBeenCalledWith({ where: { regionid: 5 } });
    expect(prisma.admissionsBooth.deleteMany).toHaveBeenCalledWith({ where: { regionId: 5 } });
    expect(prisma.breedingCenterSlot.deleteMany).toHaveBeenCalledWith({ where: { regionId: 5 } });
    expect(prisma.breedingCenter.deleteMany).toHaveBeenCalledWith({ where: { regionId: 5 } });
    expect(prisma.adminBuilding.deleteMany).toHaveBeenCalledWith({ where: { regionId: 5 } });
    expect(prisma.visitorCenter.deleteMany).toHaveBeenCalledWith({ where: { regionId: 5 } });
    expect(prisma.transportStation.deleteMany).toHaveBeenCalledWith({ where: { regionId: 5 } });
    expect(prisma.guestLounge.deleteMany).toHaveBeenCalledWith({ where: { regionId: 5 } });
    expect(prisma.region.delete).toHaveBeenCalledWith({ where: { id: 5 } });
  });

  test("wirft einen Fehler weiter, wenn die Transaktion fehlschlägt", async () => {
    vi.mocked(prisma.$transaction).mockRejectedValue(new Error("FK constraint"));

    await expect(deleteRegion(5)).rejects.toThrow("FK constraint");
  });
});