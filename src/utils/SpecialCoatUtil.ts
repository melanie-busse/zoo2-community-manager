import { Image } from "@/types/image";
import { SpecialCoat } from "@/types/specialCoat";
import { InventoryStatusFilter } from "@/store/useSpecialCoatStore";
import { getBiomeName } from "@/utils/BiomeUtil";

interface FilterOptions {
  searchTerm: string;
  selectedBiome: string | null;
  selectedShelterLevel: number | null;
  inventoryStatus: InventoryStatusFilter;
  contestOnly?: boolean;
  filterRegionId?: number | null;
  filterOwnedCount?: number | null;
  filterLevel10?: boolean;
  filterLevel20?: boolean;
  filterGlitter?: boolean;
}

interface SortOptions {
  sortBy: string;
  sortDirection: "asc" | "desc";
}

export function filterSpecialCoats(
  coats: SpecialCoat[] | undefined,
  {
    searchTerm,
    selectedBiome,
    selectedShelterLevel,
    inventoryStatus,
    contestOnly = false,
    filterRegionId = null,
    filterOwnedCount = null,
    filterLevel10 = false,
    filterLevel20 = false,
    filterGlitter = false,
  }: FilterOptions,
): SpecialCoat[] {
  if (!coats) return [];

  return coats.filter((coat) => {
    const animal = coat.animal;

    if (searchTerm.trim() !== "") {
      const query = searchTerm.toLowerCase();
      const matchesCoat = coat.specialcoatstext?.some(
        (t) =>
          t.name?.toLowerCase().includes(query) ||
          t.color?.toLowerCase().includes(query),
      ) ?? false;
      const matchesAnimalName = animal?.animaltext?.some(
        (t) => t.animalName?.toLowerCase().includes(query),
      ) ?? false;

      if (!matchesCoat && !matchesAnimalName) {
        return false;
      }
    }

    if (selectedBiome !== null && getBiomeName(animal?.biome, "") !== selectedBiome) {
      return false;
    }

    if (selectedShelterLevel !== null && animal?.shelterLevel !== selectedShelterLevel) {
      return false;
    }

    const amount = coat.ownedAmount ?? 0;
    if (inventoryStatus === "missing_partner" && amount !== 1) return false;
    if (inventoryStatus === "ready" && amount < 2) return false;
    if (inventoryStatus === "not_owned" && amount !== 0) return false;

    if (contestOnly && !coat.isContestSpecialCoat) return false;

    if (filterLevel10 && !coat.inventoryLevel10) return false;
    if (filterLevel20 && !coat.inventoryLevel20) return false;
    if (filterGlitter && !coat.inventoryGlitter) return false;
    if (filterRegionId !== null && coat.inventoryRegionId !== filterRegionId) return false;
    if (filterOwnedCount !== null && (coat.ownedAmount ?? 0) !== filterOwnedCount) return false;

    return true;
  });
}

export function paginate<T>(items: T[], page: number, itemsPerPage: number): T[] {
  const start = (page - 1) * itemsPerPage;
  return items.slice(start, start + itemsPerPage);
}

export function sortSpecialCoats(
  items: SpecialCoat[],
  { sortBy, sortDirection }: SortOptions,
): SpecialCoat[] {
  if (!sortBy) return items;

  return [...items].sort((a, b) => {
    const valA = _getNestedValue(a, sortBy);
    const valB = _getNestedValue(b, sortBy);

    if (typeof valA === "string" && typeof valB === "string") {
      return sortDirection === "asc" ? valA.localeCompare(valB) : valB.localeCompare(valA);
    }

    const numA = Number(valA) || 0;
    const numB = Number(valB) || 0;
    return sortDirection === "asc" ? numA - numB : numB - numA;
  });
}

function _getNestedValue(coat: SpecialCoat, sortBy: string): string | number {
  switch (sortBy) {
    case "coatName":
    case "name":
      return coat.specialcoatstext?.[0]?.name ?? "";
    case "color":
      return coat.specialcoatstext?.[0]?.color ?? "";
    case "biomeName":
      return coat.animal?.biome?.identifier ?? "";
    case "shelterLevel":
      return coat.animal?.shelterLevel ?? 0;
    case "animalName":
      return coat.animal?.animaltext?.[0]?.animalName ?? "";
    case "price":
      return coat.animal?.price ?? 0;
    default:
      return "";
  }
}

export function getSpecialCoatImage(specialCoat: SpecialCoat): Image {
  const biome = specialCoat.animal?.biome?.identifier;
  const animalId = specialCoat.animal?.identifier;
  const coatFolder = specialCoat.identifier && animalId ? specialCoat.identifier.slice(animalId.length + 1) : "";
  const path =
    biome && animalId && coatFolder
      ? `/images/animals/${biome}/${animalId}/specialcoats/${coatFolder}/image.jpg`
      : "/images/placeholder.jpg";
  return {
    name: specialCoat.identifier || "placeholder",
    path,
    alt: specialCoat.specialcoatstext?.[0]?.name || "Tierbild",
  };
}

export function getSpecialCoatName(specialCoat: SpecialCoat, fallback: string): string {
  return specialCoat.specialcoatstext?.[0]?.name || fallback;
}

export const createEmptyForm = (languages: Array<{ code: string }>) => ({
  animalId: "",
  releaseDate: "",
  identifier: "",
  isContestSpecialCoat: false,
  isLocked: false,
  parentWithCoatNeeded: false,
  chanceBaseWithoutParent: "",
  chanceBaseWithOneParent: "",
  chanceEventWithoutParent: "",
  chanceEventWithOneParent: "",
  origins: [],
  texts: languages.length > 0 ? [{ languageCode: languages[0].code, name: "", color: "" }] : [],
});

export const mapSpecialCoatToForm = (coat: any, languages: any[]) => {
  if (!coat) {
    return createEmptyForm(languages);
  }

  const flatOrigins = coat.specialcoatsorigin
    ? coat.specialcoatsorigin.map((o: any) => ({ id: Number(o.originId) }))
    : (coat.origins || []).map((id: any) => ({ id: Number(id) }));

  const mappedTexts = coat.specialcoatstext
    ? coat.specialcoatstext.map((t: any) => ({
        languageCode: t.languageCode,
        name: t.name || "",
        color: t.color || "",
      }))
    : [];

  return {
    id: coat.id,
    animalId: coat.animalId || "",
    releaseDate: coat.releaseDate ? new Date(coat.releaseDate).toISOString().split("T")[0] : "",
    identifier: coat.identifier || "",
    isContestSpecialCoat: coat?.isContestSpecialCoat ?? false,
    isLocked: coat?.isLocked ?? false,
    parentWithCoatNeeded: coat?.parentWithCoatNeeded ?? false,
    chanceBaseWithoutParent: coat?.chanceBaseWithoutParent ?? "",
    chanceBaseWithOneParent: coat?.chanceBaseWithOneParent ?? "",
    chanceEventWithoutParent: coat?.chanceEventWithoutParent ?? "",
    chanceEventWithOneParent: coat?.chanceEventWithOneParent ?? "",
    origins: flatOrigins,
    texts: mappedTexts,
  };
};
