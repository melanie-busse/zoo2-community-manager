import { Biome } from "@/types/biome";
import { Image } from "@/types/image";

export function getBiomeImage(biome: Biome): Image {
  return {
    name: biome.image || "placeholder.png",

    path: `/images/biomes/${biome.identifier}/area.webp`,

    alt: biome.biomestext?.[0]?.biomeName || "Gehegebild",
  };
}

export function getShelterImage(biome: Biome): Image {
  return {
    name: biome.image || "placeholder.png",

    path: `/images/biomes/${biome.identifier}/shelter.png`,

    alt: biome.biomestext?.[0]?.biomeName || "Stall",
  };
}

export function getBiomeName(biome: Biome, fallback: string) {
  return biome.biomestext?.[0]?.biomeName || fallback;
}

export function getBiomeDescription(biome: Biome, fallback: string) {
  return biome.biomestext?.[0]?.biomeDescription || fallback;
}
