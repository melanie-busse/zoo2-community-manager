import { vi, describe, test, expect, beforeEach } from "vitest";
import prisma from "@/lib/prisma";

import { getAllOrigins } from "./OriginService"; // Pfad ggf. anpassen

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
      { id: 1, name: "Atemberaubende Truhe" },
      { id: 2, name: "Ereignis-Belohnung" },
      { id: 3, name: "Shop" },
    ];

    vi.mocked(prisma.origin.findMany).mockResolvedValue(mockOrigins as any);

    const result = await getAllOrigins();

    expect(prisma.origin.findMany).toHaveBeenCalledWith({
      orderBy: {
        name: "asc",
      },
    });

    expect(result).toEqual(mockOrigins);
  });
});
