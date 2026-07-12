import { describe, test, expect, vi, beforeEach } from "vitest";
import { POST } from "./route";

vi.mock("@/service/FandonApi", () => ({
  fetchAnimalDetails: vi.fn(),
  parseAnimalData: vi.fn(),
}));

vi.mock("@/service/AnimalService", () => ({
  createAnimal: vi.fn(),
}));

vi.mock("@/service/SpecialCoatsService", () => ({
  createSpecialCoat: vi.fn(),
}));

vi.mock("@/lib/prisma", () => ({
  prisma: {
    biome: {
      findFirst: vi.fn(),
      create: vi.fn(),
    },
    origin: {
      findMany: vi.fn(),
    },
  },
}));

import { fetchAnimalDetails, parseAnimalData } from "@/service/FandonApi";
import { createAnimal } from "@/service/AnimalService";
import { createSpecialCoat } from "@/service/SpecialCoatsService";
import { prisma } from "@/lib/prisma";

const mockParsedAnimal = {
  price: 1500,
  currencyId: 1,
  wikiBiomeName: "Meadow",
  releaseDate: "2024-01-15",
  biomeId: undefined,
  rawColorVariants: [],
  animaltext: [{ languageCode: "en", animalName: "Red Fox", animalDescription: "" }],
};

describe("POST /api/admin/import-animals", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  test("gibt 400 zurück, wenn pageTitle fehlt", async () => {
    const request = new Request("http://localhost/api/admin/import-animals", {
      method: "POST",
      body: JSON.stringify({}),
    });

    const response = await POST(request);
    const data = await response.json();

    expect(response.status).toBe(400);
    expect(data.error).toBe("pageTitle ist erforderlich");
  });

  test("gibt 404 zurück, wenn fetchAnimalDetails null zurückgibt", async () => {
    vi.mocked(fetchAnimalDetails).mockResolvedValue(null);

    const request = new Request("http://localhost/api/admin/import-animals", {
      method: "POST",
      body: JSON.stringify({ pageTitle: "Unknown Animal" }),
    });

    const response = await POST(request);
    const data = await response.json();

    expect(response.status).toBe(404);
    expect(data.error).toContain("Unknown Animal");
  });

  test("gibt 500 zurück, wenn parseAnimalData null zurückgibt", async () => {
    vi.mocked(fetchAnimalDetails).mockResolvedValue({ title: "Fox", wikitext: {} });
    vi.mocked(parseAnimalData).mockReturnValue(null);

    const request = new Request("http://localhost/api/admin/import-animals", {
      method: "POST",
      body: JSON.stringify({ pageTitle: "Fox" }),
    });

    const response = await POST(request);
    const data = await response.json();

    expect(response.status).toBe(500);
    expect(data.error).toContain("Fox");
  });

  test("importiert ein Tier erfolgreich ohne Farbvarianten", async () => {
    vi.mocked(fetchAnimalDetails).mockResolvedValue({ title: "Red Fox", wikitext: { "*": "" } });
    vi.mocked(parseAnimalData).mockReturnValue({ ...mockParsedAnimal });
    vi.mocked(prisma.biome.findFirst).mockResolvedValue({ id: 3, identifier: "Meadow" } as any);
    vi.mocked(createAnimal).mockResolvedValue({ id: 99 } as any);

    const request = new Request("http://localhost/api/admin/import-animals", {
      method: "POST",
      body: JSON.stringify({ pageTitle: "Red Fox" }),
    });

    const response = await POST(request);
    const data = await response.json();

    expect(response.status).toBe(200);
    expect(data.success).toBe(true);
    expect(data.message).toContain("Red Fox");
    expect(data.message).toContain("0 Farbvarianten");
    expect(createAnimal).toHaveBeenCalledWith(expect.objectContaining({ biomeId: 3 }));
  });

  test("legt fehlendes Biom dynamisch an", async () => {
    vi.mocked(fetchAnimalDetails).mockResolvedValue({ title: "Red Fox", wikitext: { "*": "" } });
    vi.mocked(parseAnimalData).mockReturnValue({ ...mockParsedAnimal });
    vi.mocked(prisma.biome.findFirst).mockResolvedValue(null);
    vi.mocked(prisma.biome.create).mockResolvedValue({ id: 7, identifier: "Meadow" } as any);
    vi.mocked(createAnimal).mockResolvedValue({ id: 99 } as any);

    const request = new Request("http://localhost/api/admin/import-animals", {
      method: "POST",
      body: JSON.stringify({ pageTitle: "Red Fox" }),
    });

    await POST(request);

    expect(prisma.biome.create).toHaveBeenCalledWith({
      data: { identifier: "Meadow" },
    });
    expect(createAnimal).toHaveBeenCalledWith(expect.objectContaining({ biomeId: 7 }));
  });

  test("importiert Farbvarianten und matcht Origins aus der DB", async () => {
    const parsedWithCoats = {
      ...mockParsedAnimal,
      rawColorVariants: [
        {
          name: "Arctic Fox",
          imageName: "ArcticFox.png",
          obtainedFrom: ["Magic Chest"],
          releaseDate: "2024-03-01",
        },
      ],
    };

    vi.mocked(fetchAnimalDetails).mockResolvedValue({ title: "Red Fox", wikitext: { "*": "" } });
    vi.mocked(parseAnimalData).mockReturnValue(parsedWithCoats);
    vi.mocked(prisma.biome.findFirst).mockResolvedValue({ id: 3, identifier: "Meadow" } as any);
    vi.mocked(createAnimal).mockResolvedValue({ id: 99 } as any);
    vi.mocked(prisma.origin.findMany).mockResolvedValue([{ id: 5, name: "Magic Chest" }] as any);
    vi.mocked(createSpecialCoat).mockResolvedValue({ id: 1 } as any);

    const request = new Request("http://localhost/api/admin/import-animals", {
      method: "POST",
      body: JSON.stringify({ pageTitle: "Red Fox" }),
    });

    const response = await POST(request);
    const data = await response.json();

    expect(data.success).toBe(true);
    expect(data.message).toContain("1 Farbvarianten");
    expect(createSpecialCoat).toHaveBeenCalledWith(
      expect.objectContaining({
        animalId: 99,
        originIds: [5],
        texts: [expect.objectContaining({ name: "Arctic Fox", languageCode: "en" })],
      }),
    );
  });

  test("gibt 500 zurück, wenn createAnimal einen Fehler wirft", async () => {
    vi.mocked(fetchAnimalDetails).mockResolvedValue({ title: "Red Fox", wikitext: { "*": "" } });
    vi.mocked(parseAnimalData).mockReturnValue({ ...mockParsedAnimal });
    vi.mocked(prisma.biome.findFirst).mockResolvedValue({ id: 3 } as any);
    vi.mocked(createAnimal).mockRejectedValue(new Error("DB-Fehler"));

    const request = new Request("http://localhost/api/admin/import-animals", {
      method: "POST",
      body: JSON.stringify({ pageTitle: "Red Fox" }),
    });

    const response = await POST(request);
    const data = await response.json();

    expect(response.status).toBe(500);
    expect(data.error).toBe("DB-Fehler");
  });
});