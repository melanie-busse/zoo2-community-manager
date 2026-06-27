import { Animal } from "@/types/animal";
import { Origin } from "@/types/origin";

export interface SpecialCoatsText {
  id: number;
  specialCoatId: number;
  languageCode: string;
  color: string;
  name: string;
}

export interface SpecialCoat {
  id: number;
  animalId: number;
  releaseDate: Date | string;
  image: string | null;
  ownedAmount?: number;

  animal?: Animal;
  origin?: Origin[];
  specialcoatstext?: SpecialCoatsText[];
}
