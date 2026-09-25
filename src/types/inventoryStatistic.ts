import { BiomeStatistic } from "./zooStatistic";

export type InventoryBiomeStatistic = BiomeStatistic & {
  ownedAnimals: number;
  ownedSpecialCoats: number;
  ownedAnimalsForZoodollar: number;
  ownedAnimalsForDiamond: number;
  ownedContestStatues: number;
  ownedContestSpecialCoats: number;
  ownedShelterLevelCounts: Record<number, number>;
};