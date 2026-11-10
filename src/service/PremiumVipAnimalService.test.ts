import { describe, test, expect, vi, beforeEach } from "vitest";
import { getPremiumVipAnimals, getAvailableYears } from "./PremiumVipAnimalService";

vi.mock("@/lib/prisma", () => ({
  default: {
    premiumVipAnimalEntry: {
      findMany: vi.fn(),
      count: vi.fn(),
      groupBy: vi.fn(),
    },
  },
}));

import prisma from "@/lib/prisma";

const mockFindMany = prisma.premiumVipAnimalEntry.findMany as ReturnType<typeof vi.fn>;
const mockCount = prisma.premiumVipAnimalEntry.count as ReturnType<typeof vi.fn>;
const mockGroupBy = prisma.premiumVipAnimalEntry.groupBy as ReturnType<typeof vi.fn>;

beforeEach(() => {
  vi.clearAllMocks();
});

describe("getPremiumVipAnimals", () => {
  test("returns paginated entries for PREMIUM type", async () => {
    mockFindMany.mockResolvedValue([
      { id: 1, type: "PREMIUM", year: 2026, dateLabel: "Nov 3–17", animal: null, animalName: "Fossa", isNpc: false },
    ]);
    mockCount.mockResolvedValue(1);

    const result = await getPremiumVipAnimals("PREMIUM", { page: 1, pageSize: 25 });

    expect(result.entries).toHaveLength(1);
    expect(result.total).toBe(1);
    expect(mockFindMany).toHaveBeenCalledWith(
      expect.objectContaining({ where: { type: "PREMIUM" }, take: 25, skip: 0 })
    );
  });

  test("filters by animalName (case-insensitive LIKE)", async () => {
    mockFindMany.mockResolvedValue([]);
    mockCount.mockResolvedValue(0);

    await getPremiumVipAnimals("PREMIUM", { animalName: "Fox", page: 1, pageSize: 25 });

    expect(mockFindMany).toHaveBeenCalledWith(
      expect.objectContaining({
        where: expect.objectContaining({
          animalName: { contains: "Fox", mode: "insensitive" },
        }),
      })
    );
  });

  test("filters by year when provided", async () => {
    mockFindMany.mockResolvedValue([]);
    mockCount.mockResolvedValue(0);

    await getPremiumVipAnimals("VIP", { year: 2024, page: 1, pageSize: 25 });

    expect(mockFindMany).toHaveBeenCalledWith(
      expect.objectContaining({ where: expect.objectContaining({ year: 2024 }) })
    );
  });

  test("calculates skip from page number", async () => {
    mockFindMany.mockResolvedValue([]);
    mockCount.mockResolvedValue(0);

    await getPremiumVipAnimals("PREMIUM", { page: 3, pageSize: 25 });

    expect(mockFindMany).toHaveBeenCalledWith(
      expect.objectContaining({ skip: 50, take: 25 })
    );
  });

  test("omits animalName filter when not provided", async () => {
    mockFindMany.mockResolvedValue([]);
    mockCount.mockResolvedValue(0);

    await getPremiumVipAnimals("PREMIUM", { page: 1, pageSize: 25 });

    const callArg = mockFindMany.mock.calls[0][0];
    expect(callArg.where).not.toHaveProperty("animalName");
  });
});

describe("getAvailableYears", () => {
  test("returns distinct years descending for given type", async () => {
    mockGroupBy.mockResolvedValue([{ year: 2026 }, { year: 2025 }, { year: 2024 }]);

    const years = await getAvailableYears("PREMIUM");
    expect(years).toEqual([2026, 2025, 2024]);
  });
});
