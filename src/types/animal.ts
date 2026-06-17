import { Biome } from "@/types/biome";
import { PriceType } from "@/types/PriceType";
import { Xp } from "@/types/xp";
import { AnimalOrigin, Origin } from "@/types/origin";

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
  releaseExp?: number | null;
  popularity?: number | null;
  description?: string | null;
  image?: string | null;
  breedingCost?: number | null;
  breedingDuration?: number | null;
  breedingProbability?: number | null;

  // Relationen
  animalxp?: Xp[];
  game: any[];
  animalorigins: AnimalOrigin[];
  animaltext: AnimalText[];
  specialcoat: SpecialCoat[];
  animalperenclosure: AnimalPerEnclosure[];
}

export interface AnimalText {
  id: number;
  animalName: string;
  animalDescription: string;
}

export interface SpecialCoat {
  id: number;
  name: string;
  image?: string | null;
  color?: string | null;
  releaseDate?: Date | null;
  origin?: Origin | null;
  specialCoatText?: Array<{ name: string; languageCode: string }>;
}

export interface AnimalPerEnclosure {
  animalId: number;
  numberAnimals: number;
  numberEnclosure: number;
}
