import { vi, describe, test, expect, beforeEach } from "vitest";
import prisma from "@/lib/prisma";

import { getAllOrigins } from "./OriginService";

vi.mock("@/lib/prisma", () => ({
  default: {
    origin: {
      findMany: vi.fn(),
    },
  },
}));

describe("Origin Service", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  test("getAllOrigins gibt Herkunftsorte alphabetisch sortiert zurück", async () => {
    const mockOrigins = [
      { id: 3, wiki_icon_name: "Shop_Icon.png", origintext: [{ originName: "Shop", languageCode: "en" }] },
      { id: 1, wiki_icon_name: "Epic_Icon.png", origintext: [{ originName: "Epic Chest", languageCode: "en" }] },
      { id: 2, wiki_icon_name: "Prize_Wheel.png", origintext: [{ originName: "Prize Wheel", languageCode: "en" }] },
    ];

    vi.mocked(prisma.origin.findMany).mockResolvedValue(mockOrigins as any);

    const result = await getAllOrigins("en");

    expect(prisma.origin.findMany).toHaveBeenCalledWith({
      include: { origintext: { where: { languageCode: "en" } } },
    });

    expect(result.map((r) => r.name)).toEqual(["Epic Chest", "Prize Wheel", "Shop"]);
  });

  test("getAllOrigins gibt leeren String zurück wenn kein origintext vorhanden", async () => {
    const mockOrigins = [
      { id: 1, wiki_icon_name: "Shop_Icon.png", origintext: [] },
    ];

    vi.mocked(prisma.origin.findMany).mockResolvedValue(mockOrigins as any);

    const result = await getAllOrigins("en");

    expect(result[0].name).toBe("");
  });

  test("getAllOrigins verwendet Standardlocale 'de'", async () => {
    vi.mocked(prisma.origin.findMany).mockResolvedValue([]);

    await getAllOrigins();

    expect(prisma.origin.findMany).toHaveBeenCalledWith({
      include: { origintext: { where: { languageCode: "de" } } },
    });
  });
});