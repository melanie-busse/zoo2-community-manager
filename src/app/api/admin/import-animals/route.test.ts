import { describe, test, expect, vi, beforeEach } from "vitest";
import { POST, PUT } from "./route";

vi.mock("@/service/FandomService", () => ({
  fetchAnimalDetails: vi.fn(),
  parseAnimalData: vi.fn(),
  extractIconsFromOverview: vi.fn().mockReturnValue([]),
}));

vi.mock("@/service/AnimalService", () => ({
  createAnimal: vi.fn(),
  updateAnimal: vi.fn(),
}));

vi.mock("@/service/SpecialCoatsService", () => ({
  createSpecialCoat: vi.fn(),
}));

vi.mock("@/service/LanguageService", () => ({
  getAllLanguages: vi.fn().mockResolvedValue([{ code: "en" }, { code: "de" }]),
}));

vi.mock("@/utils/translate", () => ({
  translateText: vi.fn().mockResolvedValue(""),
}));

vi.mock("@/lib/prisma", () => ({
  prisma: {
    biome: {
      findFirst: vi.fn(),
      create: vi.fn(),
    },
    origin: {
      findMany: vi.fn().mockResolvedValue([]),
    },
    animalText: {
      findFirst: vi.fn(),
      findMany: vi.fn(),
    },
    animal: {
      findUnique: vi.fn(),
    },
    specialCoatsText: {
      findMany: vi.fn().mockResolvedValue([]),
    },
  },
}));

import {
  fetchAnimalDetails,
  parseAnimalData,
  extractIconsFromOverview,
} from "@/service/FandomService";
import { createAnimal, updateAnimal } from "@/service/AnimalService";
import { createSpecialCoat } from "@/service/SpecialCoatsService";
import { translateText } from "@/utils/translate";
import { prisma } from "@/lib/prisma";

const mockParsedAnimal: any = {
  price: 1500,
  currencyId: 1,
  wikiBiomeName: "Meadow",
  releaseDate: "2024-01-15",
  biomeId: undefined,
  specialCoats: [],
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
    expect(data.error).toBe("pageTitle is required");
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
    expect(data.message).toContain("0 special coat(s)");
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
      data: { identifier: "meadow" },
    });
    expect(createAnimal).toHaveBeenCalledWith(expect.objectContaining({ biomeId: 7 }));
  });

  test("importiert Farbvarianten und matcht Origins aus der DB", async () => {
    const parsedWithCoats = {
      ...mockParsedAnimal,
      specialCoats: [
        {
          image: "ArcticFox.png",
          origin: ["Magic Chest"],
          releaseDate: "2024-03-01",
          texts: [{ languageCode: "en", name: "Arctic Fox", color: "Arctic" }],
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
    expect(data.message).toContain("1 special coat(s)");
    expect(createSpecialCoat).toHaveBeenCalledWith(
      expect.objectContaining({
        animalId: 99,
        originIds: [5],
        texts: expect.arrayContaining([expect.objectContaining({ name: "Arctic Fox", languageCode: "en" })]),
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

  test("importiert erfolgreich, auch wenn kein Origin in der DB matcht (leere originIds)", async () => {
    vi.mocked(fetchAnimalDetails).mockResolvedValue({ title: "Red Fox", wikitext: { "*": "" } });
    vi.mocked(extractIconsFromOverview).mockReturnValue(["Some_Icon.png"]);
    vi.mocked(prisma.origin.findMany).mockResolvedValue([]);
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
    expect(data.originIds).toEqual([]);
  });

  test("importiert trotzdem erfolgreich, wenn das Laden der Übersichtsseite fehlschlägt", async () => {
    vi.mocked(fetchAnimalDetails)
      .mockResolvedValueOnce({ title: "Red Fox", wikitext: { "*": "" } }) // Tier
      .mockRejectedValueOnce(new Error("Network error")); // Übersichtsseite
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
    expect(data.originIds).toEqual([]);
  });

  test("importiert trotzdem erfolgreich, auch wenn createSpecialCoat fehlschlägt (Fehler wird pro Coat abgefangen)", async () => {
    const parsedWithCoats = {
      ...mockParsedAnimal,
      specialCoats: [
        {
          image: "ArcticFox.png",
          origin: ["Magic Chest"],
          releaseDate: "2024-03-01",
          texts: [{ languageCode: "en", name: "Arctic Fox", color: "Arctic" }],
        },
      ],
    };

    vi.mocked(fetchAnimalDetails).mockResolvedValue({ title: "Red Fox", wikitext: { "*": "" } });
    vi.mocked(parseAnimalData).mockReturnValue(parsedWithCoats);
    vi.mocked(prisma.biome.findFirst).mockResolvedValue({ id: 3, identifier: "Meadow" } as any);
    vi.mocked(createAnimal).mockResolvedValue({ id: 99 } as any);
    vi.mocked(prisma.origin.findMany).mockResolvedValue([]);
    vi.mocked(createSpecialCoat).mockRejectedValue(new Error("Coat-DB-Fehler"));

    const request = new Request("http://localhost/api/admin/import-animals", {
      method: "POST",
      body: JSON.stringify({ pageTitle: "Red Fox" }),
    });

    const response = await POST(request);
    const data = await response.json();

    expect(response.status).toBe(200);
    expect(data.success).toBe(true);
    expect(data.coats).toEqual([]);
  });

  test("gibt 500 zurück bei ungültigem JSON im Request-Body", async () => {
    const request = new Request("http://localhost/api/admin/import-animals", {
      method: "POST",
      body: "kein json {{{",
      headers: { "Content-Type": "application/json" },
    });

    const response = await POST(request);
    expect(response.status).toBe(500);
  });
});

describe("PUT /api/admin/import-animals", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  const makeRequest = (body: object) =>
    new Request("http://localhost/api/admin/import-animals", {
      method: "PUT",
      body: JSON.stringify(body),
    });

  test("gibt 400 zurück, wenn pageTitle fehlt", async () => {
    const response = await PUT(makeRequest({}));
    const data = await response.json();

    expect(response.status).toBe(400);
    expect(data.error).toBe("pageTitle is required");
  });

  test("gibt 404 zurück, wenn Tier nicht in der DB existiert", async () => {
    vi.mocked(prisma.animalText.findFirst).mockResolvedValue(null);

    const response = await PUT(makeRequest({ pageTitle: "African Buffalo" }));
    const data = await response.json();

    expect(response.status).toBe(404);
    expect(data.error).toContain("African Buffalo");
    expect(data.error).toContain("not found in database");
  });

  test("gibt 404 zurück, wenn Wiki-Daten nicht gefunden werden", async () => {
    vi.mocked(prisma.animalText.findFirst).mockResolvedValue({
      id: 1,
      animalId: 42,
      languageCode: "en",
      animalName: "African Buffalo",
      animalDescription: "",
    });
    vi.mocked(prisma.animal.findUnique).mockResolvedValue({
      id: 42,
      biomeId: 3,
      image: null,
    } as any);
    vi.mocked(fetchAnimalDetails).mockResolvedValue(null);

    const response = await PUT(makeRequest({ pageTitle: "African Buffalo" }));
    const data = await response.json();

    expect(response.status).toBe(404);
    expect(data.error).toContain("African Buffalo");
  });

  test("gibt 500 zurück, wenn parseAnimalData null zurückgibt", async () => {
    vi.mocked(prisma.animalText.findFirst).mockResolvedValue({
      id: 1,
      animalId: 42,
      languageCode: "en",
      animalName: "African Buffalo",
      animalDescription: "",
    });
    vi.mocked(prisma.animal.findUnique).mockResolvedValue({
      id: 42,
      biomeId: 3,
      image: null,
    } as any);
    vi.mocked(fetchAnimalDetails).mockResolvedValue({ title: "African Buffalo", wikitext: {} });
    vi.mocked(parseAnimalData).mockReturnValue(null);

    const response = await PUT(makeRequest({ pageTitle: "African Buffalo" }));
    const data = await response.json();

    expect(response.status).toBe(500);
  });

  test("aktualisiert ein Tier erfolgreich", async () => {
    vi.mocked(prisma.animalText.findFirst).mockResolvedValue({
      id: 1,
      animalId: 42,
      languageCode: "en",
      animalName: "African Buffalo",
      animalDescription: "",
    });
    vi.mocked(prisma.animal.findUnique).mockResolvedValue({
      id: 42,
      biomeId: 3,
      image: null,
    } as any);
    vi.mocked(fetchAnimalDetails).mockResolvedValue({
      title: "African Buffalo",
      wikitext: { "*": "" },
    });
    vi.mocked(parseAnimalData).mockReturnValue({ ...mockParsedAnimal });
    vi.mocked(prisma.animalText.findMany).mockResolvedValue([]);
    vi.mocked(prisma.biome.findFirst).mockResolvedValue({ id: 3, identifier: "Meadow" } as any);
    vi.mocked(updateAnimal).mockResolvedValue({ id: 42 } as any);

    const response = await PUT(makeRequest({ pageTitle: "African Buffalo" }));
    const data = await response.json();

    expect(response.status).toBe(200);
    expect(data.success).toBe(true);
    expect(data.message).toContain("African Buffalo");
    expect(updateAnimal).toHaveBeenCalledWith(42, expect.objectContaining({ biomeId: 3 }));
  });

  test("behält das vorhandene Biome aus der DB bei (biomeId !== 1)", async () => {
    vi.mocked(prisma.animalText.findFirst).mockResolvedValue({
      id: 1,
      animalId: 42,
      languageCode: "en",
      animalName: "African Buffalo",
      animalDescription: "",
    });
    vi.mocked(prisma.animal.findUnique).mockResolvedValue({
      id: 42,
      biomeId: 7,
      image: null,
    } as any);
    vi.mocked(fetchAnimalDetails).mockResolvedValue({
      title: "African Buffalo",
      wikitext: { "*": "" },
    });
    vi.mocked(parseAnimalData).mockReturnValue({ ...mockParsedAnimal });
    vi.mocked(prisma.animalText.findMany).mockResolvedValue([]);
    vi.mocked(updateAnimal).mockResolvedValue({ id: 42 } as any);

    await PUT(makeRequest({ pageTitle: "African Buffalo" }));

    // resolveBiome wird NICHT aufgerufen, da biomeId 7 != 1
    expect(prisma.biome.findFirst).not.toHaveBeenCalled();
    expect(updateAnimal).toHaveBeenCalledWith(42, expect.objectContaining({ biomeId: 7 }));
  });

  test("schützt vorhandenes Bild aus der DB", async () => {
    vi.mocked(prisma.animalText.findFirst).mockResolvedValue({
      id: 1,
      animalId: 42,
      languageCode: "en",
      animalName: "African Buffalo",
      animalDescription: "",
    });
    vi.mocked(prisma.animal.findUnique).mockResolvedValue({
      id: 42,
      biomeId: 3,
      image: "existing_image.png",
    } as any);
    vi.mocked(fetchAnimalDetails).mockResolvedValue({
      title: "African Buffalo",
      wikitext: { "*": "" },
    });
    vi.mocked(parseAnimalData).mockReturnValue({
      ...mockParsedAnimal,
      imageName: "wiki_image.png",
    });
    vi.mocked(prisma.animalText.findMany).mockResolvedValue([]);
    vi.mocked(prisma.biome.findFirst).mockResolvedValue({ id: 3, identifier: "Meadow" } as any);
    vi.mocked(updateAnimal).mockResolvedValue({ id: 42 } as any);

    await PUT(makeRequest({ pageTitle: "African Buffalo" }));

    expect(updateAnimal).toHaveBeenCalledWith(
      42,
      expect.objectContaining({ imageName: "existing_image.png" }),
    );
  });

  test("schützt vorhandene nicht-englische DB-Übersetzungen", async () => {
    vi.mocked(prisma.animalText.findFirst).mockResolvedValue({
      id: 1,
      animalId: 42,
      languageCode: "en",
      animalName: "African Buffalo",
      animalDescription: "Same description",
    });
    vi.mocked(prisma.animal.findUnique).mockResolvedValue({
      id: 42,
      biomeId: 3,
      image: null,
    } as any);
    vi.mocked(fetchAnimalDetails).mockResolvedValue({
      title: "African Buffalo",
      wikitext: { "*": "" },
    });
    vi.mocked(parseAnimalData).mockReturnValue({
      ...mockParsedAnimal,
      animaltext: [
        { languageCode: "en", animalName: "African Buffalo", animalDescription: "Same description" },
      ],
    });
    vi.mocked(prisma.animalText.findMany).mockResolvedValue([
      {
        id: 10,
        animalId: 42,
        languageCode: "de",
        animalName: "Afrikanischer Büffel",
        animalDescription: "DB-Text auf Deutsch",
      },
    ] as any);
    vi.mocked(prisma.biome.findFirst).mockResolvedValue({ id: 3, identifier: "Meadow" } as any);
    vi.mocked(updateAnimal).mockResolvedValue({ id: 42 } as any);

    await PUT(makeRequest({ pageTitle: "African Buffalo" }));

    // "de" hat einen DB-Text und das englische Original hat sich nicht geändert → schützen
    expect(updateAnimal).toHaveBeenCalledWith(
      42,
      expect.objectContaining({
        animaltext: expect.arrayContaining([
          expect.objectContaining({
            languageCode: "de",
            animalName: "Afrikanischer Büffel",
            animalDescription: "DB-Text auf Deutsch",
          }),
        ]),
      }),
    );
  });

  test("gibt 500 zurück, wenn updateAnimal einen Fehler wirft", async () => {
    vi.mocked(prisma.animalText.findFirst).mockResolvedValue({
      id: 1,
      animalId: 42,
      languageCode: "en",
      animalName: "African Buffalo",
      animalDescription: "",
    });
    vi.mocked(prisma.animal.findUnique).mockResolvedValue({
      id: 42,
      biomeId: 3,
      image: null,
    } as any);
    vi.mocked(fetchAnimalDetails).mockResolvedValue({
      title: "African Buffalo",
      wikitext: { "*": "" },
    });
    vi.mocked(parseAnimalData).mockReturnValue({ ...mockParsedAnimal });
    vi.mocked(prisma.animalText.findMany).mockResolvedValue([]);
    vi.mocked(prisma.biome.findFirst).mockResolvedValue({ id: 3, identifier: "Meadow" } as any);
    vi.mocked(updateAnimal).mockRejectedValue(new Error("Update-DB-Fehler"));

    const response = await PUT(makeRequest({ pageTitle: "African Buffalo" }));
    const data = await response.json();

    expect(response.status).toBe(500);
    expect(data.error).toBe("Update-DB-Fehler");
  });

  test("übersetzt Texte neu, wenn sich die englische Beschreibung geändert hat", async () => {
    vi.mocked(translateText).mockResolvedValue("Übersetzt");

    vi.mocked(prisma.animalText.findFirst).mockResolvedValue({
      id: 1,
      animalId: 42,
      languageCode: "en",
      animalName: "African Buffalo",
      animalDescription: "Old description",
    });
    vi.mocked(prisma.animal.findUnique).mockResolvedValue({
      id: 42,
      biomeId: 3,
      image: null,
    } as any);
    // extractDescriptionFromWiki parst "New description." → ≠ "Old description" → hasChanged = true
    vi.mocked(fetchAnimalDetails).mockResolvedValue({
      title: "African Buffalo",
      wikitext: { "*": "{{AnimalInfo}}\nNew description.\n== Behavior ==" },
    });
    vi.mocked(parseAnimalData).mockReturnValue({
      ...mockParsedAnimal,
      animaltext: [{ languageCode: "en", animalName: "African Buffalo", animalDescription: "" }],
    });
    vi.mocked(prisma.animalText.findMany).mockResolvedValue([
      {
        id: 1,
        animalId: 42,
        languageCode: "en",
        animalName: "African Buffalo",
        animalDescription: "Old description",
      },
      {
        id: 10,
        animalId: 42,
        languageCode: "de",
        animalName: "Afrikanischer Büffel",
        animalDescription: "Alter DB-Text",
      },
    ] as any);
    vi.mocked(prisma.biome.findFirst).mockResolvedValue({ id: 3, identifier: "Meadow" } as any);
    vi.mocked(updateAnimal).mockResolvedValue({ id: 42 } as any);

    await PUT(makeRequest({ pageTitle: "African Buffalo" }));

    // translateText muss für "de" aufgerufen worden sein (nicht der DB-Text wiederverwendet)
    expect(translateText).toHaveBeenCalled();
    expect(updateAnimal).toHaveBeenCalledWith(
      42,
      expect.objectContaining({
        animaltext: expect.arrayContaining([
          expect.objectContaining({ languageCode: "de", animalName: "Übersetzt" }),
        ]),
      }),
    );
  });
});

describe("POST /api/admin/import-animals – buildCoatTexts", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  test("verwendet den englischen Namen und die Farbe für alle Sprachen unverändert", async () => {
    const parsedWithCoats = {
      ...mockParsedAnimal,
      specialCoats: [
        {
          image: "ArcticFox.png",
          origin: ["Magic Chest"],
          releaseDate: "2024-03-01",
          texts: [{ languageCode: "en", name: "Arctic Fox", color: "Arctic" }],
        },
      ],
    };

    vi.mocked(fetchAnimalDetails).mockResolvedValue({ title: "Red Fox", wikitext: { "*": "" } });
    vi.mocked(parseAnimalData).mockReturnValue(parsedWithCoats);
    vi.mocked(prisma.biome.findFirst).mockResolvedValue({ id: 3, identifier: "Meadow" } as any);
    vi.mocked(createAnimal).mockResolvedValue({ id: 99 } as any);
    vi.mocked(prisma.origin.findMany).mockResolvedValue([]);
    vi.mocked(createSpecialCoat).mockResolvedValue({ id: 1 } as any);

    const request = new Request("http://localhost/api/admin/import-animals", {
      method: "POST",
      body: JSON.stringify({ pageTitle: "Red Fox" }),
    });

    await POST(request);

    // Both name and color are translated for non-English locales
    expect(translateText).toHaveBeenCalledWith("Arctic Fox", "de");
    expect(translateText).toHaveBeenCalledWith("Arctic", "de");
    expect(createSpecialCoat).toHaveBeenCalledWith(
      expect.objectContaining({
        texts: expect.arrayContaining([
          expect.objectContaining({ languageCode: "en", name: "Arctic Fox", color: "Arctic" }),
          expect.objectContaining({ languageCode: "de" }),
        ]),
      }),
    );
  });
});
