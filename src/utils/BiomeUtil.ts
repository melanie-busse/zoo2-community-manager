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

  return {
    name: biome.image || "placeholder.png",
    path: `/images/biomes/${biome.identifier}/area.webp`,
    alt: biome.biomestext?.[0]?.biomeName || "Gehegebild",
  };
}

export function getShelterImage(biome: Biome | null | undefined): Image {
  // Robustheits-Check für den Initial-Load
  if (!biome) {
    return {
      name: "placeholder.png",
      path: "/images/biomes/placeholder/shelter.png",
      alt: "Stall",
    };
  }

  return {
    name: biome.image || "placeholder.png",
    path: `/images/biomes/${biome.identifier}/shelter.png`,
    alt: biome.biomestext?.[0]?.biomeName || "Stall",
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
