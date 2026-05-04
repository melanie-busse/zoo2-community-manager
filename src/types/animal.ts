import { Biome } from "@/types/biome";
import { PriceType } from "@/types/PriceType";
import { Image } from "@/types/image";

export interface Animal {
  id: number;
  name: string;
  biome: Biome;
  shelterLevel: number;

  // Optionale Felder
  releaseDate?: Date | string | null;
  price?: number | null;
  priceType?: PriceType | null;
  sellingPrice?: number | null;
  popularity?: number | null;
  description?: string | null;
  image?: string | null;
  breedingCost?: number | null;
  breedingDuration?: number | null;
  breedingProbability?: number | null;

  // Relationen
  animalxp?: any[];
  game: any[];
  origins: any[];
  animaltext: AnimalText[];
}

export interface AnimalText {
  id: number;
  animalName: string;
  animalDescription: string;
}
