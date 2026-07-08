import { Biome } from "@/types/biome";
import { PriceType } from "@/types/PriceType";
import { Xp } from "@/types/xp";
import { AnimalOrigin } from "@/types/origin";
import { SpecialCoat } from "@/types/specialCoat";

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

export interface AnimalPerEnclosure {
  animalId: number;
  numberAnimals: number;
  numberEnclosure: number;
}
