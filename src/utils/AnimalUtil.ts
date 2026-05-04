import { Image } from "@/types/image";
import { Animal } from "@/types/animal";
import { getBiomeName } from "@/utils/BiomeUtil";

interface FilterOptions {
  searchTerm: string;
  selectedGehege: string;
  selectedLevel: string;
}

export function filterAnimals(
  animals: Animal[] | undefined,
  { searchTerm, selectedGehege, selectedLevel }: FilterOptions,
): Animal[] {
  if (!animals) return [];

  const searchLower = searchTerm.toLowerCase();

  return animals.filter((animal) => {
    // 1. Suche nach Name oder ID
    const matchesSearch =
      !searchTerm ||
      animal.name.toLowerCase().includes(searchLower) ||
      animal.id.toString().includes(searchLower);

    // 2. Filter nach Gehege
    const matchesGehege =
      selectedGehege === "all" || getBiomeName(animal.biome, "") === selectedGehege;

    // 3. Filter nach Level
    const matchesLevel = selectedLevel === "all" || String(animal.shelterLevel) === selectedLevel;

    return matchesSearch && matchesGehege && matchesLevel;
  });
}

interface SortOptions {
  sortBy: string | null;
  sortDirection: "asc" | "desc";
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

  // Erlaubt Zugriff auf "biome.name" etc.
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

    path: `/images/animals/${animal.biome.identifier}/${animal.image}`,

    alt: animal.animaltext?.[0]?.animalName || "Tierbild",
  };
}

export function getAnimalName(animal: Animal, fallback: string): string {
  return animal.animaltext?.[0]?.animalName || fallback;
}

export function getAnimalDescription(animal: Animal, fallback: string): string {
  return animal.animaltext?.[0]?.animalDescription || fallback;
}
