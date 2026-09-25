export type BiomeStatistic = {
  biomeId: number;
  biomeName: string;
  biomeIdentifier: string;
  region: string | null;
  totalAnimals: number;
  animalsForZoodollar: number;
  animalsForDiamond: number;
  totalSpecialCoats: number;
  shelterLevelCounts: Record<number, number>;
};