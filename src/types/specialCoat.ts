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
  inventoryLevel10?: boolean;
  inventoryLevel20?: boolean;
  inventoryGlitter?: boolean;
  inventoryRegionId?: number | null;
  isContestSpecialCoat?: boolean;
  parentWithCoatNeeded?: boolean;
  chanceBaseWithoutParent?: number;
  chanceBaseWithOneParent?: number;
  chanceEventWithoutParent?: number;
  chanceEventWithOneParent?: number;

  animal?: Animal;
  specialcoatsorigin?: SpecialCoatOrigin[];
  specialcoatstext?: SpecialCoatsText[];
}

export interface SpecialCoatOrigin {
  id: number;
  specialCoatId: number;
  originId: number;
  origin?: Origin;
}

export interface CreateSpecialCoatInput {
  animalId: number;
  releaseDate: Date | string;
  image: string | null;
  isContestSpecialCoat?: boolean;
  parentWithCoatNeeded?: boolean;
  chanceBaseWithoutParent?: number;
  chanceBaseWithOneParent?: number;
  chanceEventWithoutParent?: number;
  chanceEventWithOneParent?: number;
  texts: {
    languageCode: string;
    name: string;
    color: string;
  }[];
  originIds: number[];
}
