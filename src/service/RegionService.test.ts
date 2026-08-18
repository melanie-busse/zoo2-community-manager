import { vi, describe, test, expect, beforeEach } from "vitest";
import { prisma } from "@/lib/prisma";

import { getAllRegions } from "./RegionService";

vi.mock("server-only", () => ({}));

vi.mock("@/lib/prisma", () => ({
  prisma: {
    region: {
      findMany: vi.fn(),
    },
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

    expect(prisma.region.findMany).toHaveBeenCalledWith({
      include: { regionTexts: { where: { languageCode: "de" } } },
      orderBy: { id: "asc" },
    });
    expect(result).toHaveLength(2);
    expect(result[0]).toMatchObject({ id: 1, identifier: "main-zoo" });
  });

  test("getAllRegions verwendet Standardlocale 'de'", async () => {
    vi.mocked(prisma.region.findMany).mockResolvedValue([]);

    await getAllRegions();

    expect(prisma.region.findMany).toHaveBeenCalledWith({
      include: { regionTexts: { where: { languageCode: "de" } } },
      orderBy: { id: "asc" },
    });
  });

  test("getAllRegions gibt leeres Array zurück bei Datenbankfehler", async () => {
    vi.mocked(prisma.region.findMany).mockRejectedValue(new Error("DB error"));

    const result = await getAllRegions("de");

    expect(result).toEqual([]);
  });
});