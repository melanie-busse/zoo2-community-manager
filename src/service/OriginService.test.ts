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

  test("getAllOrigins sollte alle Herkunftsorte alphabetisch aufsteigend sortiert zurückgeben", async () => {
    const mockOrigins = [
      { id: 1, name: "Atemberaubende Truhe", origintext: [{ originName: "Breathtaking Chest", languageCode: "en" }] },
      { id: 2, name: "Ereignis-Belohnung", origintext: [{ originName: "Event Reward", languageCode: "en" }] },
      { id: 3, name: "Shop", origintext: [{ originName: "Shop", languageCode: "en" }] },
    ];

    vi.mocked(prisma.origin.findMany).mockResolvedValue(mockOrigins as any);

    const result = await getAllOrigins("en");

    expect(prisma.origin.findMany).toHaveBeenCalledWith({
      include: {
        origintext: {
          where: { languageCode: "en" },
        },
      },
      orderBy: {
        name: "asc",
      },
    });

    expect(result).toEqual([
      { id: 1, name: "Breathtaking Chest", origintext: mockOrigins[0].origintext },
      { id: 2, name: "Event Reward", origintext: mockOrigins[1].origintext },
      { id: 3, name: "Shop", origintext: mockOrigins[2].origintext },
    ]);
  });

  test("getAllOrigins sollte den deutschen Namen als Fallback verwenden wenn keine Übersetzung vorhanden", async () => {
    const mockOrigins = [
      { id: 1, name: "Atemberaubende Truhe", origintext: [] },
    ];

    vi.mocked(prisma.origin.findMany).mockResolvedValue(mockOrigins as any);

    const result = await getAllOrigins("en");

    expect(result[0].name).toBe("Atemberaubende Truhe");
  });

  test("getAllOrigins sollte mit Standardlocale 'de' aufgerufen werden können", async () => {
    const mockOrigins = [
      { id: 1, name: "Shop", origintext: [{ originName: "Shop", languageCode: "de" }] },
    ];

    vi.mocked(prisma.origin.findMany).mockResolvedValue(mockOrigins as any);

    await getAllOrigins();

    expect(prisma.origin.findMany).toHaveBeenCalledWith({
      include: {
        origintext: {
          where: { languageCode: "de" },
        },
      },
      orderBy: {
        name: "asc",
      },
    });
  });
});