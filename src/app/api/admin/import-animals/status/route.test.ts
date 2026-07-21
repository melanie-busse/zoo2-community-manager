import { describe, test, expect, vi, beforeEach } from "vitest";
import { GET } from "./route";

vi.mock("@/service/FandomService", () => ({
  fetchPagesFromCategory: vi.fn(),
}));

vi.mock("@/lib/prisma", () => ({
  prisma: {
    animalText: {
      findMany: vi.fn(),
    },
  },
}));

import { fetchPagesFromCategory } from "@/service/FandomService";
import { prisma } from "@/lib/prisma";

const mockFetchPages = fetchPagesFromCategory as ReturnType<typeof vi.fn>;
const mockFindMany = prisma.animalText.findMany as ReturnType<typeof vi.fn>;

beforeEach(() => {
  vi.clearAllMocks();
});

describe("GET /api/admin/import-animals/status", () => {
  test("gibt 502 zurück wenn keine Wiki-Titel geladen werden konnten", async () => {
    mockFetchPages.mockResolvedValue([]);

    const response = await GET();
    const body = await response.json();

    expect(response.status).toBe(502);
    expect(body.error).toBeDefined();
  });

  test("gibt summary und animals zurück bei erfolgreichem Abgleich", async () => {
    mockFetchPages.mockResolvedValue(["Lion", "Tiger", "Elephant"]);
    mockFindMany.mockResolvedValue([{ animalName: "Lion" }, { animalName: "Tiger" }]);

    const response = await GET();
    const body = await response.json();

    expect(response.status).toBe(200);
    expect(body.summary).toEqual({ total: 3, imported: 2, missing: 1 });
    expect(body.animals).toHaveLength(3);
  });

  test("markiert importierte Tiere korrekt", async () => {
    mockFetchPages.mockResolvedValue(["Lion", "Tiger"]);
    mockFindMany.mockResolvedValue([{ animalName: "Lion" }]);

    const response = await GET();
    const body = await response.json();

    const lion = body.animals.find((a: { title: string }) => a.title === "Lion");
    const tiger = body.animals.find((a: { title: string }) => a.title === "Tiger");
    expect(lion.status).toBe("imported");
    expect(tiger.status).toBe("missing");
  });

  test("vergleicht Namen case-insensitiv", async () => {
    mockFetchPages.mockResolvedValue(["Komodo Dragon"]);
    mockFindMany.mockResolvedValue([{ animalName: "komodo dragon" }]);

    const response = await GET();
    const body = await response.json();

    expect(body.animals[0].status).toBe("imported");
  });

  test("gibt 500 zurück bei unerwarteten Fehlern", async () => {
    mockFetchPages.mockRejectedValue(new Error("Datenbankfehler"));

    const response = await GET();
    const body = await response.json();

    expect(response.status).toBe(500);
    expect(body.error).toBe("Datenbankfehler");
  });

  test("alle Tiere fehlen wenn DB leer ist", async () => {
    mockFetchPages.mockResolvedValue(["Lion", "Tiger"]);
    mockFindMany.mockResolvedValue([]);

    const response = await GET();
    const body = await response.json();

    expect(body.summary).toEqual({ total: 2, imported: 0, missing: 2 });
    expect(body.animals.every((a: { status: string }) => a.status === "missing")).toBe(true);
  });

  test("alle Tiere importiert wenn alle DB-Namen matchen", async () => {
    mockFetchPages.mockResolvedValue(["Lion"]);
    mockFindMany.mockResolvedValue([{ animalName: "Lion" }]);

    const response = await GET();
    const body = await response.json();

    expect(body.summary).toEqual({ total: 1, imported: 1, missing: 0 });
  });
});