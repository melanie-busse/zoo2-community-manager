import { Image } from "@/types/image";
import { Animal } from "@/types/animal";
import { getBiomeName } from "@/utils/BiomeUtil";
import { formatInitialDate } from "@/utils/DateUtil";

interface FilterOptions {
  searchTerm: string;
  selectedBiome: string | null;
  selectedShelterLevel: string | null;
  hasStatueFilter?: boolean;
  filterRegionId?: number | null;
  filterLevel10?: boolean;
  filterLevel20?: boolean;
  filterGlitter?: boolean;
}

interface SortOptions {
  sortBy: string | null;
  sortDirection: "asc" | "desc";
}

export function filterAnimals(
  animals: Animal[] | undefined,
  {
    searchTerm,
    selectedBiome,
    selectedShelterLevel,
    hasStatueFilter = false,
    filterRegionId = null,
    filterLevel10 = false,
    filterLevel20 = false,
    filterGlitter = false,
  }: FilterOptions,
): Animal[] {
  if (!animals) return [];

  return animals.filter((animal) => {
    if (searchTerm.trim() !== "") {
      const query = searchTerm.toLowerCase();
      const name = animal.animaltext?.[0]?.animalName?.toLowerCase() ?? "";
      const id = animal.id.toString();
      if (!name.includes(query) && !id.includes(query)) return false;
    }

    if (selectedBiome !== null && getBiomeName(animal.biome, "") !== selectedBiome) {
      return false;
    }

    if (selectedShelterLevel !== null && String(animal.shelterLevel) !== selectedShelterLevel) {
      return false;
    }

    if (hasStatueFilter && !animal.statueImage) {
      return false;
    }

    if (filterLevel10 && !(animal as any).inventoryLevel10) return false;
    if (filterLevel20 && !(animal as any).inventoryLevel20) return false;
    if (filterGlitter && !(animal as any).inventoryGlitter) return false;

    if (filterRegionId !== null && (animal as any).inventoryRegionId !== filterRegionId) {
      return false;
    }

    return true;
  });
}

export function paginate<T>(items: T[], page: number, itemsPerPage: number): T[] {
  const start = (page - 1) * itemsPerPage;
  return items.slice(start, start + itemsPerPage);
}

export function sortAnimals(items: Animal[], { sortBy, sortDirection }: SortOptions): Animal[] {
  if (!sortBy) return items;

  return [...items].sort((a, b) => {
    const valA = _getNestedValue(a, sortBy);
    const valB = _getNestedValue(b, sortBy);

    if (typeof valA === "string" && typeof valB === "string") {
      return sortDirection === "asc" ? valA.localeCompare(valB) : valB.localeCompare(valA);
    }

    // Fallback für Zahlen (XP, ID, Level)
    const numA = Number(valA) || 0;
    const numB = Number(valB) || 0;

    return sortDirection === "asc" ? numA - numB : numB - numA;
  });
}

function _getNestedValue(obj: any, path: string): string | number {
  if (path === "xp") {
    return calculateTotalXP(obj);
  }

  if (path === "sellingPrice") {
    return obj.sellingPrice || 0;
  }

  return path.split(".").reduce((acc, part) => acc && acc[part], obj) || 0;
}

export function calculateTotalXP(animal: Animal): number {
  const xpArray = animal?.animalxp;

  if (!xpArray || !Array.isArray(xpArray)) {
    return 0;
  }

  return xpArray.reduce((acc: number, eintrag: any) => {
    const punkte = Number(eintrag.xpValue) || 0;
    return acc + punkte;
  }, 0);
}

export function getAnimalImage(animal: Animal): Image {
  return {
    name: animal.image || "placeholder.png",

    path: `/images/animals/${animal.biome?.identifier}/${animal.image}`,

    alt: animal.animaltext?.[0]?.animalName || "Tierbild",
  };
}

export function getAnimalName(animal: Animal, fallback: string): string {
  return animal.animaltext?.[0]?.animalName || fallback;
}

export const createEmptyForm = (languages: Array<{ code: string }>) => ({
  price: null,
  priceTypeId: 1,
  sellingPrice: null,
  popularity: null,
  releaseExp: null,
  biomeId: null,
  shelterLevel: 0,
  breedingCost: null,
  breedingDuration: null,
  breedingProbability: null,
  releaseDate: null,
  animaltext: languages.map((lang) => ({
    languageCode: lang.code,
    animalName: "",
    animalDescription: "",
  })),
  animalxp: [],
  animalorigins: [],
  animalperenclosure: [],
  actions: {
    feed: { durationHours: null, durationMinutes: null, xp: null },
    play: { durationHours: null, durationMinutes: null, xp: null },
    clean: { durationHours: null, durationMinutes: null, xp: null },
  },
});

export const mapAnimalToForm = (data: any, languages: Array<{ code: string }>) => {
  if (!data) return createEmptyForm(languages);

  const totalMinutesFeed = data.animalxp?.find((x: any) => x.xpTypeId === 1)?.xpDuration || 0;
  const totalMinutesPlay = data.animalxp?.find((x: any) => x.xpTypeId === 2)?.xpDuration || 0;
  const totalMinutesClean = data.animalxp?.find((x: any) => x.xpTypeId === 3)?.xpDuration || 0;

  return {
    ...data,
    releaseDate: formatInitialDate(data.releaseDate),
    actions: {
      feed: {
        xp: data.animalxp?.find((x: any) => x.xpTypeId === 1)?.xpValue ?? null,
        durationHours: Math.floor(totalMinutesFeed / 60) || null,
        durationMinutes: totalMinutesFeed % 60 || null,
      },
      play: {
        xp: data.animalxp?.find((x: any) => x.xpTypeId === 2)?.xpValue ?? null,
        durationHours: Math.floor(totalMinutesPlay / 60) || null,
        durationMinutes: totalMinutesPlay % 60 || null,
      },
      clean: {
        xp: data.animalxp?.find((x: any) => x.xpTypeId === 3)?.xpValue ?? null,
        durationHours: Math.floor(totalMinutesClean / 60) || null,
        durationMinutes: totalMinutesClean % 60 || null,
      },
    },
    origins: data.animalorigins?.map((o: any) => ({ id: o.originId })) || [],
    enclosureSizes: data.animalperenclosure?.map((size: any) => ({
      animalCount: size.numberAnimals,
      size: size.numberEnclosure,
    })) || [{ animalCount: 1, size: 10 }],
  };
};
