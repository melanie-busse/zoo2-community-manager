export type CollectionRequirement = {
  id: number;
  type: "ANIMAL" | "DECORATION";
  requiredLevel: number | null;
  itemName: string;
  sortOrder: number;
};

export type Collection = {
  id: number;
  identifier: string;
  stars: number;
  area: "MAIN_ZOO" | "TERRARIUM" | "AQUARIUM" | "NOCTARIUM" | "AVIARY";
  name: string;
  requirements: CollectionRequirement[];
};
