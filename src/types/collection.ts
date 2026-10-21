import { Animal } from "@/types/animal";
import { SpecialCoat } from "@/types/specialCoat";

export type Decoration = {
  id: number;
  identifier: string;
  name: string;
  category: { identifier: string };
};

export type CollectionRequirement = {
  id: number;
  type: "ANIMAL" | "DECORATION" | "STATUE";
  requiredLevel: number | null;
  itemName: string;
  sortOrder: number;
  animal: Animal | null;
  specialCoat: SpecialCoat | null;
  decoration: Decoration | null;
  statue: { id: number; animalName: string; contestName: string; animalIdentifier: string; biomeIdentifier: string } | null;
};

export type Collection = {
  id: number;
  identifier: string;
  stars: number;
  region: {
    id: number;
    identifier: string;
    name: string;
  };
  name: string;
  requirements: CollectionRequirement[];
  rewardAnimal: Animal | null;
  rewardSpecialCoat: SpecialCoat | null;
};

export type CollectionInput = {
  regionId: number;
  rewardAnimalId: number | null;
  rewardSpecialCoatId: number | null;
  stars: number;
  texts: { languageCode: string; name: string }[];
  requirements: {
    type: "ANIMAL" | "STATUE";
    animalId: number | null;
    statueId: number | null;
    requiredLevel: number | null;
    sortOrder: number;
  }[];
};

export type RawCollection = {
  id: number;
  identifier: string;
  stars: number;
  regionId: number;
  rewardAnimalId: number | null;
  rewardSpecialCoatId: number | null;
  texts: { languageCode: string; name: string }[];
  requirements: {
    id: number;
    type: "ANIMAL" | "STATUE";
    animalId: number | null;
    statueId: number | null;
    requiredLevel: number | null;
    sortOrder: number;
  }[];
};
