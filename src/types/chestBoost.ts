export type ChestType = "EPIC" | "RETRO" | "LEGENDARY";

export interface ChestBoostAnimal {
  id: number;
  name: string;
  identifier: string | null;
  biome: {
    id: number;
    name: string;
    identifier: string;
  };
}

export interface ChestBoostListItem {
  id: number;
  startDate: string; // ISO string
  endDate: string; // ISO string
  chestType: ChestType;
  isEvent: boolean;
  animal: ChestBoostAnimal;
}

export type ChestBoostDetail = ChestBoostListItem;

export interface ChestBoostCreateInput {
  startDate: string;
  endDate: string;
  chestType: ChestType;
  isEvent: boolean;
  animalId: number;
}

export type ChestBoostUpdateInput = ChestBoostCreateInput;
