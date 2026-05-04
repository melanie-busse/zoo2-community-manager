import { PriceType } from "@/types/PriceType";

export interface Biome {
  id: number;
  name: string;
  description?: string;
  identifier: string;

  price?: number | null;
  priceType?: PriceType | null;

  expansionCost?: number | null;
  priceTypeExpansionsCost?: PriceType | null;

  size?: number;
  image?: string | null;
  biomestext?: BiomesText[];
}

export interface BiomesText {
  id: number;
  biomeName: string;
  biomeDescription: string;
}
