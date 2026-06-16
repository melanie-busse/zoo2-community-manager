import { vi } from "vitest";

// 1. server-only mocken, damit Next.js uns nicht blockiert
vi.mock("server-only", () => ({}));

// 2. Den Prisma-Client für das biome-Model mocken
vi.mock("@/lib/prisma", () => ({
  default: {
    biome: {
      count: vi.fn(),
    },
  },
}));

import { describe, test, expect, beforeEach } from "vitest";
import { getHabitatCount } from "./BiomeService"; // Pfad ggf. anpassen, falls die Datei anders heißt
import prisma from "@/lib/prisma";

describe("Biome Service", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  test("getHabitatCount gibt die korrekte Anzahl der Gehege/Biome zurück", async () => {
    // Dem Mock sagen, dass prisma.biome.count() z.B. 14 zurückgibt
    vi.mocked(prisma.biome.count).mockResolvedValue(14);

    const result = await getHabitatCount();

    // Überprüfen, ob Prisma aufgerufen wurde und das Ergebnis stimmt
    expect(prisma.biome.count).toHaveBeenCalledTimes(1);
    expect(result).toBe(14);
  });
});