import { describe, test, expect, vi, beforeEach } from "vitest";
import { fetchPagesFromCategory, fetchAnimalDetails, parseAnimalData } from "./FandonApi";

const mockFetch = vi.fn();
vi.stubGlobal("fetch", mockFetch);

describe("FandomApi", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  // ==========================================
  // fetchPagesFromCategory
  // ==========================================

  describe("fetchPagesFromCategory", () => {
    test("gibt Seitentitel aus einer Kategorie zurück", async () => {
      mockFetch.mockResolvedValue({
        ok: true,
        json: async () => ({
          query: {
            categorymembers: [
              { pageid: 1, ns: 0, title: "Fox" },
              { pageid: 2, ns: 0, title: "Bear" },
            ],
          },
        }),
      });

      const result = await fetchPagesFromCategory("Animals");

      expect(result).toEqual(["Fox", "Bear"]);
      expect(mockFetch).toHaveBeenCalledOnce();
      expect(mockFetch.mock.calls[0][0]).toContain("cmtitle=Category%3AAnimals");
    });

    test("gibt leeres Array zurück, wenn keine Treffer vorhanden sind", async () => {
      mockFetch.mockResolvedValue({
        ok: true,
        json: async () => ({ query: { categorymembers: [] } }),
      });

      const result = await fetchPagesFromCategory("EmptyCategory");
      expect(result).toEqual([]);
    });

    test("gibt leeres Array zurück, wenn die API einen Fehler zurückgibt", async () => {
      mockFetch.mockResolvedValue({ ok: false, status: 500 });

      const result = await fetchPagesFromCategory("Animals");
      expect(result).toEqual([]);
    });

    test("gibt leeres Array zurück, wenn fetch wirft", async () => {
      mockFetch.mockRejectedValue(new Error("Network error"));

      const result = await fetchPagesFromCategory("Animals");
      expect(result).toEqual([]);
    });
  });

  // ==========================================
  // fetchAnimalDetails
  // ==========================================

  describe("fetchAnimalDetails", () => {
    test("gibt das parse-Objekt zurück", async () => {
      const mockParse = { title: "Fox", wikitext: { "*": "| biome = Meadow" } };
      mockFetch.mockResolvedValue({
        ok: true,
        json: async () => ({ parse: mockParse }),
      });

      const result = await fetchAnimalDetails("Fox");
      expect(result).toEqual(mockParse);
    });

    test("gibt null zurück, wenn kein parse-Objekt vorhanden ist", async () => {
      mockFetch.mockResolvedValue({
        ok: true,
        json: async () => ({}),
      });

      const result = await fetchAnimalDetails("Unknown");
      expect(result).toBeNull();
    });

    test("gibt null zurück, wenn die API einen Fehler zurückgibt", async () => {
      mockFetch.mockResolvedValue({ ok: false, status: 404 });

      const result = await fetchAnimalDetails("Fox");
      expect(result).toBeNull();
    });

    test("gibt null zurück, wenn fetch wirft", async () => {
      mockFetch.mockRejectedValue(new Error("Network error"));

      const result = await fetchAnimalDetails("Fox");
      expect(result).toBeNull();
    });
  });

  // ==========================================
  // parseAnimalData
  // ==========================================

  describe("parseAnimalData", () => {
    const wikitext = `
| price = 1,500 c.png
| cost = 2,000
| duration = 2h 30m
| probability = 75%
| shelter_level = 3
| biome = Meadow
| release_date = 2024-01-15
| feeding = 50 xp 1h
| playing = 30 xp 30m
| cleaning = 20 xp 45m
| image1 = Fox.png

== Description ==
The red fox is a cunning animal.

== Number of animals per enclosure ==
{|
|-
| 1
| 9
|-
| 2
| 16
|}

{{Coat_Box
| row1 = Arctic Fox
| image1 = ArcticFox.png
| obtained_from = [[Magic Chest|Magic Chest]]
| release_date = 2024-03-01
}}
`;

    const mockApiResult = {
      title: "Red Fox",
      wikitext: { "*": wikitext },
    };

    test("gibt null zurück, wenn wikitext fehlt", () => {
      expect(parseAnimalData({})).toBeNull();
      expect(parseAnimalData({ wikitext: {} })).toBeNull();
    });

    test("parst Preis und Währung korrekt", () => {
      const result = parseAnimalData(mockApiResult);
      expect(result?.price).toBe(1500);
      expect(result?.currencyId).toBe(1); // keine "d.png" → Coins
    });

    test("erkennt Diamond-Währung", () => {
      const result = parseAnimalData({
        title: "Fox",
        wikitext: { "*": "| price = 500 d.png" },
      });
      expect(result?.currencyId).toBe(2);
    });

    test("parst Zuchtdaten korrekt", () => {
      const result = parseAnimalData(mockApiResult);
      expect(result?.breedingCost).toBe(2000);
      expect(result?.breedingDuration).toBe(150); // 2h 30m = 150 min
      expect(result?.breedingProbability).toBe(75);
      expect(result?.breedingLevel).toBe(3);
    });

    test("parst Biom und Release-Datum", () => {
      const result = parseAnimalData(mockApiResult);
      expect(result?.wikiBiomeName).toBe("Meadow");
      expect(result?.releaseDate).toBe("2024-01-15");
    });

    test("parst Tiernamen und Beschreibung", () => {
      const result = parseAnimalData(mockApiResult);
      expect(result?.animaltext[0].languageCode).toBe("en");
      expect(result?.animaltext[0].animalName).toBe("Red Fox");
      expect(result?.animaltext[0].animalDescription).toContain("cunning animal");
    });

    test("parst Gehegegrößen-Tabelle", () => {
      const result = parseAnimalData(mockApiResult);
      expect(result?.enclosureSizes).toEqual([
        { animalCount: 1, size: 9 },
        { animalCount: 2, size: 16 },
      ]);
    });

    test("parst Farbvarianten", () => {
      const result = parseAnimalData(mockApiResult);
      expect(result?.rawColorVariants).toHaveLength(1);
      expect(result?.rawColorVariants[0].name).toBe("Arctic Fox");
      expect(result?.rawColorVariants[0].imageName).toBe("ArcticFox.png");
      expect(result?.rawColorVariants[0].obtainedFrom).toContain("Magic Chest");
      expect(result?.rawColorVariants[0].releaseDate).toBe("2024-03-01");
    });

    test("mappt originIds korrekt", () => {
      const result = parseAnimalData(mockApiResult, [10, 20]);
      expect(result?.origins).toEqual([{ id: 10 }, { id: 20 }]);
    });

    test("parst Bild-Dateiname", () => {
      const result = parseAnimalData(mockApiResult);
      expect(result?.imageName).toBe("Fox.png");
    });
  });
});