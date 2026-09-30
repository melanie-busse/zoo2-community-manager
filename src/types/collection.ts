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
  type: "ANIMAL" | "DECORATION";
  requiredLevel: number | null;
  itemName: string;
  sortOrder: number;
  animal: Animal | null;
  specialCoat: SpecialCoat | null;
  decoration: Decoration | null;
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
