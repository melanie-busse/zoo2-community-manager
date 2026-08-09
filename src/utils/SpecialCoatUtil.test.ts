import { describe, test, expect } from "vitest";
import { getSpecialCoatImage, filterSpecialCoats } from "./SpecialCoatUtil";
import { SpecialCoat } from "@/types/specialCoat";

const mockCoats: SpecialCoat[] = [
  {
    id: 1,
    animalId: 10,
    releaseDate: "2024-01-01",
    image: "coat1.png",
    isContestSpecialCoat: true,
    specialcoatstext: [{ id: 1, specialCoatId: 1, languageCode: "de", color: "Weiß", name: "Schneefuchs" }],
    animal: { id: 10, shelterLevel: 3, biome: { id: 1, identifier: "arctic" } } as any,
  },
  {
    id: 2,
    animalId: 11,
    releaseDate: "2024-02-01",
    image: "coat2.png",
    isContestSpecialCoat: false,
    specialcoatstext: [{ id: 2, specialCoatId: 2, languageCode: "de", color: "Schwarz", name: "Nachtrabe" }],
    animal: { id: 11, shelterLevel: 5, biome: { id: 2, identifier: "jungle" } } as any,
  },
];

describe("filterSpecialCoats", () => {
  test("gibt alle zurück, wenn keine Filter gesetzt sind", () => {
    const result = filterSpecialCoats(mockCoats, {
      searchTerm: "",
      selectedBiome: null,
      selectedShelterLevel: null,
      inventoryStatus: "all",
    });
    expect(result).toHaveLength(2);
  });

  test("filtert nach contestOnly und zeigt nur isContestSpecialCoat=true", () => {
    const result = filterSpecialCoats(mockCoats, {
      searchTerm: "",
      selectedBiome: null,
      selectedShelterLevel: null,
      inventoryStatus: "all",
      contestOnly: true,
    });
    expect(result).toHaveLength(1);
    expect(result[0].id).toBe(1);
  });

  test("zeigt alle, wenn contestOnly=false", () => {
    const result = filterSpecialCoats(mockCoats, {
      searchTerm: "",
      selectedBiome: null,
      selectedShelterLevel: null,
      inventoryStatus: "all",
      contestOnly: false,
    });
    expect(result).toHaveLength(2);
  });
});

describe("getSpecialCoatImage", () => {
  test("sollte das korrekte Image-Objekt zurückgeben, wenn ein Bild und Text vorhanden sind", () => {
    const mockSpecialCoat = {
      image: "polar-fox.png",
      specialcoatstext: [
        {
          name: "Polarfuchs",
        },
      ],
    } as SpecialCoat;

    const result = getSpecialCoatImage(mockSpecialCoat);

    expect(result).toEqual({
      name: "polar-fox.png",
      path: "/images/specialCoat/polar-fox.png",
      alt: "Polarfuchs",
    });
  });

  test("sollte auf Fallbacks zurückgreifen, wenn image und specialcoatstext fehlen", () => {
    const mockSpecialCoat = {
      image: null,
      specialcoatstext: [],
    } as unknown as SpecialCoat;

    const result = getSpecialCoatImage(mockSpecialCoat);

    expect(result).toEqual({
      name: "placeholder.png",
      path: "/images/specialCoat/null", // Da template literal: specialCoat.image ist null
      alt: "Tierbild",
    });
  });

  test("sollte den Fallback-Alt-Text nutzen, wenn specialcoatstext zwar existiert, aber leer ist", () => {
    const mockSpecialCoat = {
      image: "zebra.png",
      specialcoatstext: [
        {
          name: "", // Leerer Name
        },
      ],
    } as SpecialCoat;

    const result = getSpecialCoatImage(mockSpecialCoat);

    expect(result.alt).toBe("Tierbild");
  });
});
