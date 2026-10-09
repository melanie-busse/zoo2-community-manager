import { Biome } from "@/types/biome";
import { Image } from "@/types/image";

export function getBiomeImage(biome: Biome | null | undefined): Image {
  // Robustheits-Check für den Initial-Load
  if (!biome) {
    return {
      name: "placeholder.png",
      path: "/images/biomes/placeholder/area.webp",
      alt: "Gehegebild",
    };
  }

  const identifier = /^[\w-]+$/.test(biome.identifier ?? "") ? biome.identifier : "placeholder";
  return {
    name: biome.image || "placeholder.png",
    path: `/images/biomes/${identifier}/area.webp`,
    alt: biome.biomestext?.[0]?.biomeName || "Gehegebild",
  };
}

export function getShelterImage(biome: Biome | null | undefined): Image {
  if (!biome) {
    return {
      name: "placeholder.png",
      path: "/images/biomes/placeholder/shelter.png",
      alt: "Stall",
    };
  }

  const identifier = /^[\w-]+$/.test(biome.identifier ?? "") ? biome.identifier : "placeholder";
  return {
    name: biome.image || "placeholder.png",
    path: `/images/biomes/${identifier}/shelter.png`,
    alt: biome.biomestext?.[0]?.biomeName || "Stall",
  };
}

export function getGameImage(
  biomeIdentifier: string | null | undefined,
  gameIdentifier: string | null | undefined,
): Image {
  if (!biomeIdentifier || !gameIdentifier) {
    return {
      name: "placeholder.png",
      path: "/images/placeholder.jpg",
      alt: "Spielzeug",
    };
  }
  return {
    name: gameIdentifier,
    path: `/images/biomes/${biomeIdentifier}/game/${gameIdentifier}/image.webp`,
    alt: gameIdentifier,
  };
}

export function getBiomeName(biome: Biome | null | undefined, fallback: string): string {
  if (!biome) return fallback;
  return biome.biomestext?.[0]?.biomeName || fallback;
}

export function getBiomeDescription(biome: Biome | null | undefined, fallback: string): string {
  if (!biome) return fallback;
  return biome.biomestext?.[0]?.biomeDescription || fallback;
}

export function extractUniqueShelterLevels<T extends { shelter?: { level?: number | null } | null }>(
  items: T[],
): T[] {
  return Array.from(
    new Map(
      items
        .filter((item) => item.shelter?.level !== null && item.shelter?.level !== undefined)
        .map((item) => [item.shelter?.level, item]),
    ).values(),
  ).sort((a, b) => (a.shelter?.level ?? 0) - (b.shelter?.level ?? 0));
}

export function extractUniqueBiomes<T extends { biome?: Biome | null }>(items: T[]): Biome[] {
  return Array.from(
    new Map(
      items
        .map((item) => item.biome)
        .filter((b): b is Biome => b !== null && b !== undefined)
        .map((b) => [b.id, b]),
    ).values(),
  ).sort((a, b) => a.id - b.id);
}
